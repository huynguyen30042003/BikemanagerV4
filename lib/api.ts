import { getAccessToken } from "./auth";

export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  const token =
    getAccessToken();

  const response =
    await fetch(url, {
      ...options,

      headers: {
        ...options.headers,

        Authorization:
          `Bearer ${token}`,
      },
    });

  // token hết hạn
  if (
    response.status === 401
  ) {
    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "expires_at"
    );

    const currentPath =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : "/admin";
    window.location.href = `/login?callbackUrl=${encodeURIComponent(currentPath)}`;
  }

  return response;
}