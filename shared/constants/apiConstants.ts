export const APP_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:5001/api";

export const BE_URL =
  process.env.APP_URL ||
  (APP_URL ? APP_URL.replace(/\/api\/?$/, "") : "https://localhost:5001");

export const CLIENT_ID = process.env.ORCHARD_CLIENT_ID;
export const CLIENT_SECRET = process.env.ORCHARD_CLIENT_SECRET;
export const EXPIRED_TOKEN = 100210;

export const TOKEN_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER_INFO: "userInfo",
} as const;

/**
 * Chuyển đổi đường dẫn ảnh tương đối từ Backend thành URL tuyệt đối hoàn chỉnh: linkBE + đường dẫn
 */
export const getImageUrl = (path?: string | null): string => {
  if (!path) return "";
  const trimmed = String(path).trim();
  if (!trimmed) return "";

  // Nếu là URL tuyệt đối hoặc blob / data preview từ trình duyệt
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  const baseUrl = (BE_URL || "https://localhost:5001").replace(/\/+$/, "");
  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${baseUrl}${cleanPath}`;
};
