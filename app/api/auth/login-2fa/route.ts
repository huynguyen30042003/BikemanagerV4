process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { APP_URL } from "@/shared/constants/apiConstants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${APP_URL}/auth/login-2fa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        twoFactorToken: body.twoFactorToken,
        TwoFactorToken: body.twoFactorToken,
        code: body.code,
        Code: body.code,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message || "Mã xác thực OTP không chính xác hoặc đã hết hạn.",
          errors: data.errors,
        },
        {
          status: response.status || 400,
        }
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

    const accessToken =
      data.access_token ||
      data.accessToken ||
      data.token?.access_token ||
      data.token?.accessToken;

    const expiresIn =
      data.expires_in ||
      data.expiresIn ||
      data.token?.expires_in ||
      data.token?.expiresIn ||
      3600;

    const nextResponse = NextResponse.json({
      success: true,
      access_token: accessToken,
      expires_in: expiresIn,
      refresh_token: rawRefreshToken,
      token_type: data.token_type || data.tokenType || "Bearer",
    });

    // 1. Lưu cookie access_token (httpOnly: false để client JS đọc được và đính kèm Authorization header)
    if (accessToken) {
      nextResponse.cookies.set("access_token", accessToken, {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: expiresIn,
      });
    }

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

    // Forward Set-Cookie từ backend nếu có
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
    console.error("[LOGIN_2FA_ERROR]", error);
    return NextResponse.json(
      {
        message: "Lỗi kết nối máy chủ khi xác thực OTP 2FA.",
      },
      {
        status: 500,
      }
    );
  }
}
