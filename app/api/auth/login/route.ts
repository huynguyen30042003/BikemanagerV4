process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { APP_URL } from "@/shared/constants/apiConstants";
import { NextRequest, NextResponse } from "next/server";

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
    const body = await req.json();

    const response = await fetch(`${APP_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: body.username,
        password: body.password,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message ?? "Tên đăng nhập hoặc mật khẩu không chính xác",
          errors: data.errors,
        },
        {
          status: response.status || 401,
        },
      );
    }

    const accessToken: string | undefined = data.access_token;
    const expiresIn: number = data.expires_in ?? 3600;
    const rawRefreshToken: string | null =
      data.refresh_token ?? extractRefreshTokenFromSetCookie(response);

    if (!accessToken) {
      return NextResponse.json(
        {
          message: "Máy chủ xác thực không trả về access_token hợp lệ",
        },
        { status: 500 },
      );
    }

    const nextResponse = NextResponse.json({
      success: true,
      access_token: accessToken,
      expires_in: expiresIn,
      token_type: data.token_type ?? "Bearer",
    });

    // 1. Lưu cookie access_token (httpOnly: false để client JS đọc được từ Cookie và đính kèm Authorization header)
    nextResponse.cookies.set("access_token", accessToken, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn,
    });

    // 2. Lưu cookie expires_at đồng bộ thời gian hết hạn
    nextResponse.cookies.set(
      "expires_at",
      String(Date.now() + expiresIn * 1000),
      {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: expiresIn,
      },
    );

    // 3. Lưu cookie refresh_token (HttpOnly để bảo mật tuyệt đối ở tầng mạng, không lưu localStorage)
    if (rawRefreshToken) {
      const refreshMaxAge = body.remember
        ? 60 * 60 * 24 * 30 // 30 ngày nếu chọn Ghi nhớ phiên
        : 60 * 60 * 24 * 7; // 7 ngày mặc định
      nextResponse.cookies.set("refresh_token", rawRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: refreshMaxAge,
      });
    }

    return nextResponse;
  } catch (error) {
    console.error("[API_AUTH_LOGIN_ERROR]", error);

    return NextResponse.json(
      {
        message: "Không thể kết nối đến máy chủ xác thực",
      },
      {
        status: 500,
      },
    );
  }
}
