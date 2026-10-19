/**
 * Lấy Access Token từ Cookie
 */
export function getAccessToken(): string | null {
  if (typeof document === "undefined" || !document.cookie) return null;

  const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]+)/);
  if (match) {
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return match[1];
    }
  }

  return null;
}

export interface SaveTokenPayload {
  access_token?: string | null;
  accessToken?: string | null;
  token?: string | null;
  refresh_token?: string | null;
  expires_in?: number | null;
  expiresIn?: number | null;
}

/**
 * Lưu Access Token vào Cookie (Client-side)
 * Refresh Token được lưu dạng HttpOnly Cookie từ Server Route Handler
 */
export function setAuthTokens(payload?: SaveTokenPayload | null): void {
  if (typeof document === "undefined" || !payload) return;

  const accessToken =
    payload.access_token || payload.accessToken || payload.token;
  const expiresIn =
    payload.expires_in ?? payload.expiresIn ?? 3600;

  if (accessToken) {
    document.cookie = `access_token=${encodeURIComponent(
      accessToken
    )}; path=/; max-age=${expiresIn}; SameSite=Lax`;
  }
}

/**
 * Xóa sạch Auth Tokens khỏi Cookie và dọn dẹp bộ nhớ tạm
 */
export function clearAuthTokens(): void {
  if (typeof document !== "undefined") {
    document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "refresh_token=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "refreshToken=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "expires_at=; path=/; max-age=0; SameSite=Lax";
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("token");
      localStorage.removeItem("expires_at");
      localStorage.removeItem("auth-storage");
      localStorage.removeItem("remembered_username");
    } catch {
      // Bỏ qua lỗi nếu môi trường không cho phép truy cập localStorage
    }
  }
}

/**
 * Lấy Refresh Token từ Cookie (nếu có cookie phía client không httpOnly)
 */
export function getRefreshToken(): string | null {
  if (typeof document === "undefined" || !document.cookie) return null;

  const match = document.cookie.match(/(?:^|;\s*)(?:refresh_token|refreshToken)=([^;]+)/);
  if (match) {
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return match[1];
    }
  }

  return null;
}

/**
 * Kiểm tra xem Access Token đã hết hạn hoặc sắp hết hạn hay chưa dựa vào claim 'exp' trong JWT
 * @param bufferSeconds Thời gian dự phòng trước khi token thực sự hết hạn (mặc định 15 giây)
 */
export function isAccessTokenExpired(bufferSeconds = 15): boolean {
  const token = getAccessToken();
  if (!token) return true;

  try {
    const payload = decodeJwt<{ exp?: number }>(token);
    if (!payload || typeof payload.exp !== "number") return false;

    // exp tính bằng giây, Date.now() tính bằng mili-giây
    return Date.now() >= (payload.exp - bufferSeconds) * 1000;
  } catch {
    return false;
  }
}

/**
 * Giải mã chuỗi Base64Url an toàn, có bù padding '=' và giải mã UTF-8 chuẩn xác
 */
function base64UrlDecode(input: string): string {
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");

  // Bù padding '=' theo chuẩn Base64 (độ dài phải chia hết cho 4)
  const pad = base64.length % 4;
  if (pad === 2) {
    base64 += "==";
  } else if (pad === 3) {
    base64 += "=";
  } else if (pad === 1) {
    throw new Error("Chuỗi Base64 không hợp lệ");
  }

  // Sử dụng TextDecoder để giải mã Unicode/UTF-8 chuẩn xác
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
 * Giải mã JWT Token lấy phần Payload
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function decodeJwt<T = Record<string, any>>(token?: string | null): T | null {
  const jwt = token || getAccessToken();
  if (!jwt) {
    console.warn("[decodeJwt] Không tìm thấy token nào trong storage/cookies");
    return null;
  }

  try {
    const parts = jwt.split(".");
    if (parts.length < 2) {
      console.warn("[decodeJwt] Token không đúng định dạng JWT (phải có ít nhất 2 phần)");
      return null;
    }

    const jsonString = base64UrlDecode(parts[1]);
    const payload = JSON.parse(jsonString) as T;

    console.log("[decodeJwt] Decoded Payload thành công:", payload);
    return payload;
  } catch (error) {
    console.error("[decodeJwt] Lỗi khi giải mã token:", error);
    return null;
  }
}

/**
 * Trích xuất tất cả các Roles từ JWT Payload (hỗ trợ mọi format .NET, OpenIddict, OAuth, Keycloak)
 */
export function getUserRoles(token?: string | null): string[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload = decodeJwt<Record<string, any>>(token);
  if (!payload) return [];

  // 1. Kiểm tra các claim phổ biến cụ thể
  const directClaim =
    payload.role ??
    payload.roles ??
    payload.Role ??
    payload.Roles ??
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
    payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"] ??
    payload.authorities ??
    payload.user_role ??
    payload.userRoles;

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const obj = val as any;
      const name = obj.name || obj.role || obj.value || obj.title;
      if (name) foundRoles.push(String(name).trim());
    }
  };

  if (directClaim) {
    if (Array.isArray(directClaim)) {
      directClaim.forEach(extractItem);
    } else {
      extractItem(directClaim);
    }
  }

  // 2. Nếu chưa tìm thấy, quét tất cả các key chứa từ 'role' (không phân biệt hoa/thường)
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

  // 3. Fallback: Nếu có trường 'scope' chứa thông tin role
  if (foundRoles.length === 0 && typeof payload.scope === "string") {
    const scopes = payload.scope.split(" ").map((s: string) => s.trim());
    const roleCandidates = scopes.filter((s: string) =>
      ["admin", "administrator", "manager", "staff", "user"].includes(s.toLowerCase())
    );
    foundRoles.push(...roleCandidates);
  }

  // Khử trùng lặp
  const uniqueRoles = Array.from(new Set(foundRoles));
  console.log("[getUserRoles] Kết quả roles tìm được:", uniqueRoles);
  return uniqueRoles;
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

/**
 * Lấy toàn bộ thông tin cơ bản của user từ Token
 */
export function getUserFromToken(token?: string | null): UserTokenInfo | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload = decodeJwt<Record<string, any>>(token);
  if (!payload) return null;

  const roles = getUserRoles(token);
  const username =
    payload.sub ||
    payload.name ||
    payload.username ||
    payload.preferred_username ||
    payload.unique_name ||
    payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
    null;

  const email =
    payload.email ||
    payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
    null;

  const fullName =
    payload.fullname ||
    payload.fullName ||
    payload.given_name ||
    username ||
    null;

  const avatarUrl =
    payload.avatarUrl ||
    payload.avatar ||
    payload.picture ||
    payload.image ||
    null;

  const userResult: UserTokenInfo = {
    id: payload.sub || payload.id || null,
    username,
    email,
    fullName,
    avatarUrl,
    roles,
    role: roles[0] || null,
    rawPayload: payload,
  };

  console.log("[getUserFromToken] Thông tin user trích xuất:", userResult);
  return userResult;
}