process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { APP_URL } from "@/shared/constants/apiConstants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();

    // 1. Tìm refresh token từ HttpOnly cookies (hỗ trợ cả 2 tên gọi)
    let refreshToken =
      cookieStore.get("refresh_token")?.value ||
      cookieStore.get("refreshToken")?.value ||
      cookieStore.get("RefreshToken")?.value;

    // 2. Fallback nếu client gửi refresh token qua JSON body
    if (!refreshToken) {
      try {
        const body = await req.json();
        refreshToken =
          body?.refresh_token ||
          body?.refreshToken ||
          body?.RefreshToken;
      } catch {
        // Body có thể rỗng hoặc không phải JSON
      }
    }

    // 3. Fallback nếu client gửi qua custom headers
    if (!refreshToken) {
      refreshToken =
        req.headers.get("x-refresh-token") ||
        req.headers.get("x-token") ||
        undefined;
    }

    // Lấy access_token cũ (nếu có) để backend đối chiếu
    let accessToken =
      cookieStore.get("access_token")?.value ||
      cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        accessToken = authHeader.substring(7);
      }
    }

    if (!refreshToken) {
      console.warn("[API_AUTH_REFRESH] Không tìm thấy refresh token trong cookie hoặc payload");
      const errRes = NextResponse.json(
        { message: "No refresh token" },
        { status: 401 }
      );
      errRes.cookies.set("access_token", "", { path: "/", maxAge: 0 });
      errRes.cookies.set("refresh_token", "", { path: "/", maxAge: 0 });
      errRes.cookies.set("refreshToken", "", { path: "/", maxAge: 0 });
      errRes.cookies.set("expires_at", "", { path: "/", maxAge: 0 });
      return errRes;
    }

    const backendBase =
      APP_URL || process.env.NEXT_PUBLIC_API_URL || "https://localhost:5001/api";

    console.log("[API_AUTH_REFRESH] Gửi refresh token sang backend:", `${backendBase}/auth/refresh`);

    // Gửi yêu cầu sang backend Orchard / OpenIddict:
    // Hỗ trợ cả Cookie header, JSON body và Authorization header để tương thích tối đa
    const response = await fetch(`${backendBase}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh_token=${refreshToken}; refreshToken=${refreshToken}; RefreshToken=${refreshToken}`,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
        refreshToken: refreshToken,
        RefreshToken: refreshToken,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data) {
      console.error("[API_AUTH_REFRESH] Backend từ chối refresh token:", response.status, data);
      const errRes = NextResponse.json(
        data || { message: "Invalid refresh token" },
        { status: 401 }
      );
      errRes.cookies.set("access_token", "", { path: "/", maxAge: 0 });
      errRes.cookies.set("refresh_token", "", { path: "/", maxAge: 0 });
      errRes.cookies.set("refreshToken", "", { path: "/", maxAge: 0 });
      errRes.cookies.set("expires_at", "", { path: "/", maxAge: 0 });
      return errRes;
    }

    // Trích xuất refresh token mới (nếu backend có cơ chế rotation), hoặc giữ nguyên token hiện tại
    const setCookie = response.headers.get("set-cookie");
    const cookieMatch = setCookie?.match(/refresh_token=([^;]+)/i);
    const newRefreshToken =
      data.refresh_token ||
      data.refreshToken ||
      (cookieMatch ? cookieMatch[1] : null) ||
      refreshToken;

    const res = NextResponse.json({
      ...data,
      refresh_token: newRefreshToken,
    });

    // 1. Lưu cookie access_token (httpOnly: false để client JS đọc được)
    res.cookies.set("access_token", data.access_token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: data.expires_in,
    });

    // 2. Cập nhật cookie refresh_token (HttpOnly)
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

    // Forward Set-Cookie từ backend nếu có
    if (setCookie) {
      const allCookies = response.headers.getSetCookie?.() || [];
      allCookies.forEach((cookie) => {
        res.headers.append("Set-Cookie", cookie);
      });
    }

    return res;
  } catch (error) {
    console.error("[API_AUTH_REFRESH_ERROR]", error);
    return NextResponse.json(
      { message: "Refresh failed" },
      { status: 401 }
    );
  }
}