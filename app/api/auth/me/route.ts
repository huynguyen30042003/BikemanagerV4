process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { APP_URL } from "@/shared/constants/apiConstants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface RefreshedResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

function clearCookiesOnResponse(res: NextResponse): NextResponse {
  res.cookies.set("access_token", "", { path: "/", maxAge: 0, sameSite: "lax" });
  res.cookies.set("refresh_token", "", { path: "/", maxAge: 0, sameSite: "lax" });
  res.cookies.set("expires_at", "", { path: "/", maxAge: 0, sameSite: "lax" });
  return res;
}

function extractRefreshTokenFromSetCookie(response: Response): string | null {
  const allSetCookies = response.headers.getSetCookie?.() ?? [];
  const setCookieHeader = response.headers.get("set-cookie") ?? "";
  const allCookieStrings = [setCookieHeader, ...allSetCookies].join("; ");
  const cookieMatch = allCookieStrings.match(/refresh_token=([^;]+)/i);
  if (!cookieMatch?.[1]) return null;
  try {
    return decodeURIComponent(cookieMatch[1]);
  } catch {
    return cookieMatch[1];
  }
}

function isTokenNonEmpty(token: string | undefined | null): token is string {
  return Boolean(
    token &&
      token !== "undefined" &&
      token !== "null" &&
      token.trim().length >= 10,
  );
}

/**
 * Gọi refresh token trực tiếp sang backend khi access_token bị thiếu hoặc hết hạn
 */
async function attemptRefreshToken(refreshToken: string): Promise<RefreshedResult | null> {
  try {
    const refreshRes = await fetch(`${APP_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh_token=${refreshToken}`,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!refreshRes.ok) return null;

    const data = await refreshRes.json().catch(() => null);
    if (!data || !data.access_token) return null;

    const newAccessToken: string = data.access_token;
    const expiresIn: number = data.expires_in ?? 3600;
    const newRefreshToken: string =
      data.refresh_token ??
      extractRefreshTokenFromSetCookie(refreshRes) ??
      refreshToken;

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn,
    };
  } catch (err) {
    console.error("[API_AUTH_ME_REFRESH_ERROR]", err);
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authHeader = req.headers.get("authorization");
    let token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7).trim()
        : cookieStore.get("access_token")?.value;

    const refreshToken =
      cookieStore.get("refresh_token")?.value ??
      req.headers.get("x-refresh-token") ??
      undefined;

    let refreshedInfo: RefreshedResult | null = null;

    // 1. Nếu chưa có access_token hợp lệ (hỗ trợ cả Data Protection token CfDJ8... và JWT), thử refresh nếu có refresh_token
    if (!isTokenNonEmpty(token) && refreshToken) {
      refreshedInfo = await attemptRefreshToken(refreshToken);
      if (refreshedInfo?.accessToken) {
        token = refreshedInfo.accessToken;
      }
    }

    // 2. Nếu sau khi thử refresh mà vẫn không có token hợp lệ -> Báo 401 và dọn sạch cookie
    if (!isTokenNonEmpty(token)) {
      const errRes = NextResponse.json(
        { message: "Chưa đăng nhập hoặc phiên làm việc đã hết hạn" },
        { status: 401 },
      );
      return clearCookiesOnResponse(errRes);
    }

    // 3. Gọi backend lấy thông tin user
    let response: Response;
    try {
      response = await fetch(`${APP_URL}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (fetchErr) {
      console.warn("[API_AUTH_ME_FETCH_WARN] Không thể kết nối backend:", fetchErr);
      return NextResponse.json(
        { message: "Không thể kết nối đến máy chủ xác thực" },
        { status: 502 },
      );
    }

    // 4. Nếu backend trả về 401 (token vừa hết hạn tại backend) và chưa từng refresh trong request này
    if (response.status === 401 && !refreshedInfo && refreshToken) {
      refreshedInfo = await attemptRefreshToken(refreshToken);
      if (refreshedInfo?.accessToken) {
        token = refreshedInfo.accessToken;
        try {
          response = await fetch(`${APP_URL}/auth/me`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        } catch {
          // Bỏ qua lỗi retry
        }
      }
    }

    const data = await response.json().catch(() => ({
      message: response.statusText || "Unauthorized",
    }));

    if (!response.ok) {
      const errRes = NextResponse.json(data, { status: response.status });
      if (response.status === 401) {
        clearCookiesOnResponse(errRes);
      }
      return errRes;
    }

    const nextResponse = NextResponse.json(data);

    // 5. Nếu đã tự động làm mới token thành công, đồng bộ lại Cookie và Header cho trình duyệt
    if (refreshedInfo) {
      nextResponse.cookies.set("access_token", refreshedInfo.accessToken, {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: refreshedInfo.expiresIn,
      });
      nextResponse.cookies.set(
        "expires_at",
        String(Date.now() + refreshedInfo.expiresIn * 1000),
        {
          httpOnly: false,
          secure: false,
          sameSite: "lax",
          path: "/",
          maxAge: refreshedInfo.expiresIn,
        },
      );
      nextResponse.headers.set("x-access-token", refreshedInfo.accessToken);
      nextResponse.headers.set("x-expires-in", String(refreshedInfo.expiresIn));

      if (refreshedInfo.refreshToken) {
        const refreshMaxAge = 60 * 60 * 24 * 7; // 7 ngày
        nextResponse.cookies.set("refresh_token", refreshedInfo.refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          path: "/",
          maxAge: refreshMaxAge,
        });
        nextResponse.headers.set("x-refresh-token", refreshedInfo.refreshToken);
      }
    }

    return nextResponse;
  } catch (error) {
    console.error("[API_AUTH_ME_ERROR]", error);
    const errRes = NextResponse.json(
      { message: "Phiên làm việc đã hết hạn hoặc chưa đăng nhập" },
      { status: 401 },
    );
    return clearCookiesOnResponse(errRes);
  }
}
