process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { APP_URL } from "@/shared/constants/apiConstants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();

    // 1. Tìm refresh_token từ HttpOnly cookies
    let refreshToken = cookieStore.get("refresh_token")?.value;

    // 2. Fallback nếu client gửi refresh_token qua JSON body
    if (!refreshToken) {
      try {
        const body = await req.json();
        refreshToken = body?.refresh_token;
      } catch {
        // Body có thể rỗng
      }
    }

    // 3. Fallback nếu client gửi qua custom header
    if (!refreshToken) {
      refreshToken = req.headers.get("x-refresh-token") ?? undefined;
    }

    if (!refreshToken || refreshToken === "undefined" || refreshToken === "null") {
      const errRes = NextResponse.json(
        { message: "Không tìm thấy refresh_token hợp lệ" },
        { status: 401 },
      );
      return clearCookiesOnResponse(errRes);
    }

    // Gửi yêu cầu làm mới token sang backend (không gửi Authorization Bearer đã hết hạn để tránh bị middleware JWT chặn)
    const response = await fetch(`${APP_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh_token=${refreshToken}`,
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data || !data.access_token) {
      const errRes = NextResponse.json(
        data ?? { message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" },
        { status: 401 },
      );
      return clearCookiesOnResponse(errRes);
    }

    const newAccessToken: string = data.access_token;
    const expiresIn: number = data.expires_in ?? 3600;
    const newRefreshToken: string =
      data.refresh_token ??
      extractRefreshTokenFromSetCookie(response) ??
      refreshToken;

    const res = NextResponse.json({
      success: true,
      access_token: newAccessToken,
      expires_in: expiresIn,
      token_type: data.token_type ?? "Bearer",
    });

    // 1. Cập nhật cookie access_token (httpOnly: false để client JS đọc được)
    res.cookies.set("access_token", newAccessToken, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn,
    });

    // 2. Cập nhật cookie expires_at
    res.cookies.set("expires_at", String(Date.now() + expiresIn * 1000), {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn,
    });

    // 3. Cập nhật cookie refresh_token (HttpOnly)
    if (newRefreshToken) {
      const refreshMaxAge = 60 * 60 * 24 * 7; // 7 ngày
      res.cookies.set("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: refreshMaxAge,
      });
    }

    return res;
  } catch (error) {
    console.error("[API_AUTH_REFRESH_ERROR]", error);
    const errRes = NextResponse.json(
      { message: "Không thể làm mới phiên đăng nhập" },
      { status: 401 },
    );
    return clearCookiesOnResponse(errRes);
  }
}
