process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { APP_URL } from "@/shared/constants/apiConstants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // gọi Orchard API
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
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message || "Login failed",
        },
        {
          status: 401,
        },
      );
    }
    const allSetCookies = response.headers.getSetCookie?.() || [];
    const setCookieHeader = response.headers.get("set-cookie") || "";
    const allCookieStrings = [setCookieHeader, ...allSetCookies].join("; ");
    const cookieMatch = allCookieStrings.match(/(?:refresh_token|refreshToken)=([^;]+)/i);
    const rawRefreshToken =
      data.refresh_token ||
      data.refreshToken ||
      data.RefreshToken ||
      data.token?.refresh_token ||
      data.token?.refreshToken ||
      (cookieMatch ? cookieMatch[1] : null);

    const nextResponse = NextResponse.json({
      success: true,
      access_token: data.access_token,
      expires_in: data.expires_in,
      refresh_token: rawRefreshToken,
      token_type: data.token_type || "Bearer",
    });

    // 1. Lưu cookie access_token (httpOnly: false để client JS đọc được và đính kèm Authorization header)
    nextResponse.cookies.set("access_token", data.access_token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: data.expires_in,
    });

    // 2. Lưu cookie refresh_token (HttpOnly để bảo mật tuyệt đối)
    if (rawRefreshToken) {
      const refreshMaxAge = 60 * 60 * 24 * 7; // 7 ngày
      nextResponse.cookies.set("refresh_token", rawRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: refreshMaxAge,
      });
    }

    // Forward Set-Cookie từ backend nếu có (loại bỏ Secure và Domain để browser localhost:3000 chấp nhận)
    if (allSetCookies.length > 0 || setCookieHeader) {
      const cookiesToForward = allSetCookies.length > 0 ? allSetCookies : [setCookieHeader];
      cookiesToForward.forEach((cookie) => {
        if (!cookie) return;
        const cleanedCookie = cookie
          .replace(/;\s*Secure/gi, "")
          .replace(/;\s*Domain=[^;]+/gi, "");
        nextResponse.headers.append("Set-Cookie", cleanedCookie);
      });
    }

    return nextResponse;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
