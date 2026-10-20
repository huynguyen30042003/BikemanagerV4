import {
  getAccessToken,
  clearAuthTokens,
  isAccessTokenExpired,
  refreshAccessToken,
} from "./auth";

export async function apiFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  let token = getAccessToken();

  if (!token || isAccessTokenExpired(15)) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      token = refreshed;
    }
  }

  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  // Nếu token vừa hết hạn ở phía server, thử refresh 1 lần trước khi đăng xuất
  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
    }
  }

  if (response.status === 401) {
    clearAuthTokens();
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Bỏ qua lỗi mạng khi dọn cookie
    }

    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname + window.location.search;
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = `/login?callbackUrl=${encodeURIComponent(currentPath)}`;
      }
    }
  }

  return response;
}
