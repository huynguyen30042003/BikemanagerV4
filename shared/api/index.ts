import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { BE_URL } from "../constants/apiConstants";
import {
  setAuthTokens,
  clearAuthTokens,
  getAccessToken,
  isAccessTokenExpired,
} from "@/lib/auth";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Các endpoint không được phép tự động chạy refresh token khi gặp lỗi 401
const AUTH_WHITELIST_URLS = ["/auth/login", "/auth/refresh", "/auth/register"];

class Api {
  public instance: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: BE_URL,
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private isExpiredTokenError(error: AxiosError): boolean {
    const requestUrl = error.config?.url || "";
    const isAuthUrl = AUTH_WHITELIST_URLS.some((url) => requestUrl.includes(url));

    return error?.response?.status === 401 && !isAuthUrl;
  }

  /**
   * Refresh Token dùng chung 1 Promise (Singleton in-flight request)
   * Chống gọi lặp lại /api/auth/refresh nhiều lần khi có nhiều API đồng thời
   */
  private async refreshToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const response = await axios.post(
          "/api/auth/refresh",
          {},
          {
            withCredentials: true,
          },
        );

        const newAccessToken =
          response.data?.access_token ||
          response.data?.accessToken ||
          response.data?.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("Không tìm thấy access token mới từ API refresh");
        }

        setAuthTokens(response.data);

        // Cập nhật authorization header mặc định cho instance
        this.instance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

        return newAccessToken;
      } catch (error) {
        clearAuthTokens();

        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname + window.location.search;
          if (!window.location.pathname.startsWith("/login")) {
            window.location.href = `/login?callbackUrl=${encodeURIComponent(currentPath)}`;
          }
        }
        throw error;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  // =========================
  // SETUP INTERCEPTORS
  // =========================
  private setupInterceptors() {
    // 1. REQUEST INTERCEPTOR
    this.instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        config.withCredentials = true;

        // Xử lý FormData: Xóa Content-Type để browser tự động thiết lập multipart/form-data kèm boundary
        if (config.data && typeof FormData !== "undefined" && config.data instanceof FormData) {
          config.headers.delete("Content-Type");
          config.headers.delete("content-type");
        } else if (config.data && typeof config.data === "object") {
          if (!config.headers.has("Content-Type") && !config.headers.has("content-type")) {
            config.headers.set("Content-Type", "application/json");
          }
        }

        if (typeof window !== "undefined") {
          const requestUrl = config.url || "";
          const isAuthUrl = AUTH_WHITELIST_URLS.some((url) => requestUrl.includes(url));

          const token = getAccessToken();

          // Chủ động refresh trước nếu token sắp hết hạn (trong vòng 15 giây) và không phải API auth
          if (!isAuthUrl && token && isAccessTokenExpired(15)) {
            try {
              const newToken = await this.refreshToken();
              config.headers.set("Authorization", `Bearer ${newToken}`);
            } catch (error) {
              console.error("[AUTO REFRESH FAILED]", error);
              return Promise.reject(error);
            }
          } else if (token) {
            // Luôn ghi đè bằng token mới nhất từ getAccessToken()
            config.headers.set("Authorization", `Bearer ${token}`);
          }
        }

        return config;
      },
    );

    // 2. RESPONSE INTERCEPTOR
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (process.env.NODE_ENV !== "production") {
          console.error("[RESPONSE ERROR]", {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
          });
        }

        const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

        // Chỉ xử lý 401 cho các request hợp lệ và chưa từng retry
        if (!originalRequest || !this.isExpiredTokenError(error) || originalRequest._retry) {
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
          // Chờ shared refreshToken promise
          const newToken = await this.refreshToken();

          originalRequest.headers.set("Authorization", `Bearer ${newToken}`);

          return this.instance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      },
    );
  }
}

const api = new Api().instance;
export default api;