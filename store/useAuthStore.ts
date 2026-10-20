import { AxiosError } from "axios";
import { getUserInfo } from "@/shared/api/auth.api";
import { UserProfile } from "@/types/auth";
import {
  getAccessToken,
  clearAuthTokens,
  isAccessTokenExpired,
  refreshAccessToken,
} from "@/lib/auth";
import { create } from "zustand";

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: UserProfile | null) => void;
  fetchUser: (force?: boolean) => Promise<UserProfile | null>;
  clearUser: () => void;

  // Role Helpers
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
}

// Biến lưu Promise đang thực thi (in-flight request) để deduplicate (chống gọi trùng lặp song song)
let inFlightFetchUserPromise: Promise<UserProfile | null> | null = null;
// Cờ ngăn gọi lại fetchUser/refresh ngay trong lúc đang đăng xuất
let isLoggingOutFlag = false;

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: (user) => {
    if (user) {
      isLoggingOutFlag = false;
    }
    set({ user, error: null });
  },

  clearUser: () => {
    isLoggingOutFlag = true;
    inFlightFetchUserPromise = null;
    set({ user: null, error: null, isLoading: false });
    clearAuthTokens();
  },

  fetchUser: async (force = false) => {
    if (force) {
      isLoggingOutFlag = false;
    }
    if (isLoggingOutFlag) {
      return null;
    }

    // 1. Kiểm tra Access Token hiện tại trong Cookie
    let token = getAccessToken();

    // Nếu không có token hoặc token đã hết hạn, luôn thử làm mới từ HttpOnly refresh_token cookie
    if (!token || isAccessTokenExpired()) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        token = newToken;
      }
    }

    // Nếu sau khi thử refresh mà vẫn không có token hợp lệ
    if (!token) {
      clearAuthTokens();
      set({ user: null, isLoading: false });
      return null;
    }

    // 2. Nếu đã có dữ liệu user trong store (In-Memory) và không yêu cầu ép buộc (force refresh), tái sử dụng ngay
    const currentUser = get().user;
    if (currentUser && !force) {
      return currentUser;
    }

    // 3. Nếu đang có một request fetchUser đang chạy song song (in-flight), chia sẻ chung Promise đó
    if (inFlightFetchUserPromise && !force) {
      return inFlightFetchUserPromise;
    }

    // 4. Bắt đầu request lấy thông tin tài khoản
    set({ isLoading: true, error: null });
    inFlightFetchUserPromise = (async () => {
      try {
        const user = await getUserInfo();
        set({ user, isLoading: false, error: null });
        return user;
      } catch (err: unknown) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        // Nếu lỗi 401 Unauthorized (token hết hạn tại server), thử refresh lại 1 lần cuối
        if (axiosErr?.response?.status === 401) {
          try {
            const refreshedToken = await refreshAccessToken();
            if (refreshedToken) {
              const retryUser = await getUserInfo();
              set({ user: retryUser, isLoading: false, error: null });
              return retryUser;
            }
          } catch {
            // Bỏ qua lỗi retry
          }
          clearAuthTokens();
          if (typeof window !== "undefined") {
            fetch("/api/auth/logout", {
              method: "POST",
              credentials: "include",
            }).catch(() => {});
          }
        }

        const message =
          axiosErr?.response?.data?.message ??
          axiosErr?.message ??
          "Lỗi khi lấy thông tin người dùng";
        set({ user: null, error: message, isLoading: false });
        return null;
      } finally {
        inFlightFetchUserPromise = null;
      }
    })();

    return inFlightFetchUserPromise;
  },

  hasRole: (targetRole: string) => {
    const roles = get().user?.roles ?? [];
    return roles.some(
      (r) => r.toLowerCase() === targetRole.toLowerCase(),
    );
  },

  isAdmin: () => {
    const roles = get().user?.roles ?? [];
    return roles.some((r) =>
      [
        "admin",
        "adminaccess",
        "administrator",
        "quan tri vien",
      ].includes(r.toLowerCase()),
    );
  },
}));
