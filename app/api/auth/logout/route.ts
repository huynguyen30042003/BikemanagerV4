process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { APP_URL } from "@/shared/constants/apiConstants";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const nextResponse = NextResponse.json({
    success: true,
  });

  // Xóa triệt để các Auth Cookies ở trình duyệt
  nextResponse.cookies.set("access_token", "", { path: "/", maxAge: 0, sameSite: "lax" });
  nextResponse.cookies.set("refresh_token", "", { path: "/", maxAge: 0, sameSite: "lax" });
  nextResponse.cookies.set("expires_at", "", { path: "/", maxAge: 0, sameSite: "lax" });

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;

    const cookieParts: string[] = [];
    if (refreshToken) cookieParts.push(`refresh_token=${refreshToken}`);
    if (accessToken) cookieParts.push(`access_token=${accessToken}`);

    await fetch(`${APP_URL}/auth/logout`, {
      method: "POST",
      headers: {
        ...(cookieParts.length > 0 ? { Cookie: cookieParts.join("; ") } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });
  } catch (error) {
    console.warn("[API_AUTH_LOGOUT_BACKEND_WARN]", error);
  }

  return nextResponse;
}
