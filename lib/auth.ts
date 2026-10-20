/**
 * Kiểm tra đường dẫn redirect nội bộ an toàn (Chống Open Redirect Vulnerability)
 */
export function isSafeRedirectUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  return (
    url.startsWith("/") &&
    !url.startsWith("//") &&
    !url.startsWith("/login")
  );
}

/**
 * Lấy Access Token trực tiếp từ Cookie (Tuyệt đối không dùng localStorage)
 * Hỗ trợ cả chuẩn Opaque Data Protection Token của Orchard Core / OpenIddict (CfDJ8...) và JWT
 */
export function getAccessToken(): string | null {
  if (typeof document === "undefined" || !document.cookie) return null;

  const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]+)/);
  if (!match?.[1]) return null;

  let rawToken: string;
  try {
    rawToken = decodeURIComponent(match[1]);
  } catch {
    rawToken = match[1];
  }

  if (
    !rawToken ||
    rawToken === "undefined" ||
    rawToken === "null" ||
    rawToken.trim().length < 10
  ) {
    return null;
  }

  return rawToken.trim();
}

export interface SaveTokenPayload {
  access_token?: string | null;
  refresh_token?: string | null;
  expires_in?: number | null;
}

/**
 * Lưu Access Token và mốc hết hạn vào Cookie (Tuyệt đối không lưu vào localStorage)
 * Refresh Token được quản lý hoàn toàn bằng HttpOnly Cookie từ Server Route Handler
 */
export function setAuthTokens(payload?: SaveTokenPayload | null): void {
  if (typeof document === "undefined" || !payload) return;

  const accessToken = payload.access_token;
  const expiresIn = payload.expires_in ?? 3600;

  if (accessToken && accessToken !== "undefined" && accessToken !== "null") {
    const expiresAtMs = Date.now() + expiresIn * 1000;

    document.cookie = `access_token=${encodeURIComponent(
      accessToken,
    )}; path=/; max-age=${expiresIn}; SameSite=Lax`;
    document.cookie = `expires_at=${expiresAtMs}; path=/; max-age=${expiresIn}; SameSite=Lax`;
  }
}

/**
 * Xóa sạch Auth Cookies phía Client
 */
export function clearAuthTokens(): void {
  if (typeof document !== "undefined") {
    document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "refresh_token=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "expires_at=; path=/; max-age=0; SameSite=Lax";
  }
}

/**
 * Lấy Refresh Token từ Cookie (nếu không phải HttpOnly)
 */
export function getRefreshToken(): string | null {
  if (typeof document === "undefined" || !document.cookie) return null;

  const match = document.cookie.match(/(?:^|;\s*)refresh_token=([^;]+)/);
  if (!match?.[1]) return null;

  let raw: string;
  try {
    raw = decodeURIComponent(match[1]);
  } catch {
    raw = match[1];
  }

  if (!raw || raw === "undefined" || raw === "null") {
    return null;
  }

  return raw;
}

/**
 * Kiểm tra xem người dùng có cookie phiên làm việc hiện tại hay không
 */
export function hasAuthSession(): boolean {
  if (typeof document === "undefined" || !document.cookie) return false;
  return (
    Boolean(getAccessToken()) ||
    Boolean(getRefreshToken()) ||
    /(?:^|;\s*)expires_at=([^;]+)/.test(document.cookie)
  );
}

// Singleton Promise để chống gọi trùng lặp song song nhiều request refresh cùng 1 lúc
let inFlightRefreshPromise: Promise<string | null> | null = null;

/**
 * Gọi API refresh token (tự động đính kèm HttpOnly refresh_token cookie qua credentials: "include")
 */
export async function refreshAccessToken(): Promise<string | null> {
  if (inFlightRefreshPromise) {
    return inFlightRefreshPromise;
  }

  inFlightRefreshPromise = (async () => {
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Refresh token thất bại hoặc đã hết hạn");
      }

      const data: SaveTokenPayload = await res.json();
      const newAccessToken = data?.access_token;

      if (!newAccessToken) {
        throw new Error("Không tìm thấy access_token mới trong kết quả trả về");
      }

      setAuthTokens(data);
      return newAccessToken;
    } catch (err) {
      console.warn("[refreshAccessToken] Không thể làm mới token:", err);
      clearAuthTokens();
      return null;
    } finally {
      inFlightRefreshPromise = null;
    }
  })();

  return inFlightRefreshPromise;
}

/**
 * Kiểm tra xem Access Token đã hết hạn hoặc sắp hết hạn hay chưa dựa vào Cookie 'expires_at' hoặc claim 'exp'
 * @param bufferSeconds Thời gian dự phòng trước khi token thực sự hết hạn (mặc định 15 giây)
 */
export function isAccessTokenExpired(bufferSeconds = 15): boolean {
  const token = getAccessToken();
  if (!token) return true;

  try {
    // 1. Kiểm tra qua mốc thời gian expires_at trong Cookie
    if (typeof document !== "undefined" && document.cookie) {
      const match = document.cookie.match(/(?:^|;\s*)expires_at=([^;]+)/);
      if (match?.[1]) {
        const expiresAt = Number(decodeURIComponent(match[1]));
        if (!Number.isNaN(expiresAt) && expiresAt > 0) {
          const expiresAtMs = expiresAt < 1e12 ? expiresAt * 1000 : expiresAt;
          return Date.now() >= expiresAtMs - bufferSeconds * 1000;
        }
      }
    }

    // 2. Nếu token là JWT (có chứa dấu chấm), kiểm tra thêm claim 'exp'
    if (token.includes(".")) {
      const payload = decodeJwt<{ exp?: number }>(token);
      if (payload && typeof payload.exp === "number") {
        return Date.now() >= (payload.exp - bufferSeconds) * 1000;
      }
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Giải mã chuỗi Base64Url an toàn, có bù padding '=' và giải mã UTF-8 chuẩn xác
 */
function base64UrlDecode(input: string): string {
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");

  const pad = base64.length % 4;
  if (pad === 2) {
    base64 += "==";
  } else if (pad === 3) {
    base64 += "=";
  } else if (pad === 1) {
    throw new Error("Chuỗi Base64 không hợp lệ");
  }

  if (typeof window !== "undefined" && typeof window.atob === "function") {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder("utf-8").decode(bytes);
  } else {
    return Buffer.from(base64, "base64").toString("utf-8");
  }
}

/**
 * Giải mã JWT Token lấy phần Payload (Trả về null nếu là Opaque Data Protection Token CfDJ8...)
 */
export function decodeJwt<T = Record<string, unknown>>(token?: string | null): T | null {
  const jwt = token ?? getAccessToken();
  if (!jwt || !jwt.includes(".")) {
    return null;
  }

  try {
    const parts = jwt.split(".");
    if (parts.length < 2) {
      return null;
    }

    const jsonString = base64UrlDecode(parts[1]);
    return JSON.parse(jsonString) as T;
  } catch {
    return null;
  }
}

/**
 * Trích xuất tất cả các Roles từ JWT Payload
 */
export function getUserRoles(token?: string | null): string[] {
  const payload = decodeJwt<Record<string, unknown>>(token);
  if (!payload) {
    return [];
  }

  const ROLE_CLAIM_KEYS = [
    "role",
    "roles",
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role",
  ];

  const foundRoles: string[] = [];

  const extractItem = (val: unknown) => {
    if (!val) return;
    if (typeof val === "string") {
      if (val.includes(",")) {
        val.split(",").forEach((s) => {
          if (s.trim()) foundRoles.push(s.trim());
        });
      } else if (val.trim()) {
        foundRoles.push(val.trim());
      }
    } else if (typeof val === "number") {
      foundRoles.push(String(val));
    } else if (typeof val === "object" && val !== null) {
      const obj = val as Record<string, unknown>;
      const roleVal = obj.role ?? obj.name ?? obj.value;
      if (roleVal) foundRoles.push(String(roleVal).trim());
    }
  };

  for (const claimKey of ROLE_CLAIM_KEYS) {
    const claimValue = payload[claimKey];
    if (claimValue) {
      if (Array.isArray(claimValue)) {
        claimValue.forEach(extractItem);
      } else {
        extractItem(claimValue);
      }
    }
  }

  if (foundRoles.length === 0) {
    for (const [key, value] of Object.entries(payload)) {
      if (key.toLowerCase().includes("role") && value) {
        if (Array.isArray(value)) {
          value.forEach(extractItem);
        } else {
          extractItem(value);
        }
      }
    }
  }

  if (foundRoles.length === 0 && typeof payload.scope === "string") {
    const scopes = payload.scope.split(" ").map((s: string) => s.trim());
    const roleCandidates = scopes.filter((s: string) =>
      ["admin", "administrator", "manager", "staff", "user"].includes(s.toLowerCase()),
    );
    foundRoles.push(...roleCandidates);
  }

  return Array.from(new Set(foundRoles));
}

/**
 * Lấy role chính của người dùng từ token
 */
export function getUserRole(token?: string | null): string | null {
  const roles = getUserRoles(token);
  return roles.length > 0 ? roles[0] : null;
}

/**
 * Kiểm tra xem người dùng có vai trò cụ thể hay không (không phân biệt hoa thường)
 */
export function hasRole(roleName: string, token?: string | null): boolean {
  const roles = getUserRoles(token);
  return roles.some((r) => r.toLowerCase() === roleName.toLowerCase());
}

export interface UserTokenInfo {
  id?: string | null;
  username?: string | null;
  email?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  roles: string[];
  role: string | null;
  rawPayload?: Record<string, unknown> | null;
}

function getStringClaim(
  payload: Record<string, unknown>,
  keys: string[],
): string | null {
  for (const key of keys) {
    const val = payload[key];
    if (typeof val === "string" && val.trim()) {
      return val.trim();
    }
  }
  return null;
}

/**
 * Lấy thông tin cơ bản của user từ Token
 */
export function getUserFromToken(token?: string | null): UserTokenInfo | null {
  const activeToken = token ?? getAccessToken();
  if (!activeToken) return null;

  const payload = decodeJwt<Record<string, unknown>>(activeToken);
  if (!payload) {
    return null;
  }

  const roles = getUserRoles(activeToken);
  const username = getStringClaim(payload, [
    "preferred_username",
    "unique_name",
    "username",
    "name",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
    "sub",
  ]);

  const email = getStringClaim(payload, [
    "email",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
  ]);

  const fullName =
    getStringClaim(payload, ["fullName", "fullname", "given_name", "name"]) ??
    username;

  const avatarUrl = getStringClaim(payload, ["avatarUrl", "avatar", "picture"]);
  const id = getStringClaim(payload, ["sub", "id", "nameid"]);

  return {
    id,
    username,
    email,
    fullName,
    avatarUrl,
    roles,
    role: roles[0] ?? null,
    rawPayload: payload,
  };
}
