import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Bỏ qua tuyệt đối các file tĩnh, hình ảnh, scripts và API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token =
    req.cookies.get("access_token")?.value ||
    req.cookies.get("refresh_token")?.value;

  const isAuthPage = pathname === "/login";

  // Chưa đăng nhập mà truy cập trang quản trị/dashboard -> chuyển đến login kèm callbackUrl
  if (!token && !isAuthPage) {
    const loginUrl = new URL("/login", req.url);
    const callbackPath = req.nextUrl.pathname + req.nextUrl.search;
    loginUrl.searchParams.set("callbackUrl", callbackPath);
    return NextResponse.redirect(loginUrl);
  }

  // Đã đăng nhập mà cố vào login: đưa về callbackUrl nếu có, hoặc về /admin
  if (token && isAuthPage) {
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");
    if (
      callbackUrl &&
      callbackUrl.startsWith("/") &&
      !callbackUrl.startsWith("/login")
    ) {
      return NextResponse.redirect(new URL(callbackUrl, req.url));
    }
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
  ],
};