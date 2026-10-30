import { NextRequest, NextResponse } from "next/server";

function isSafeCallbackUrl(url: string | null): url is string {
  if (!url) return false;
  return (
    url.startsWith("/") &&
    !url.startsWith("//") &&
    !url.startsWith("/login")
  );
}

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const userAgent = req.headers.get("user-agent") || "";

  // Bỏ qua tuyệt đối các file tĩnh, hình ảnh, scripts và API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/logo") ||
    pathname.startsWith("/opengraph-image") ||
    pathname.startsWith("/twitter-image") ||
    pathname.startsWith("/icon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Cho phép các bot mạng xã hội (Zalo, Facebook, Telegram, v.v.) cào dữ liệu thẻ meta OpenGraph trực tiếp
  const isSocialCrawler =
    /facebookexternalhit|zalo|telegrambot|twitterbot|slackbot|discordbot|whatsapp|linkedinbot/i.test(
      userAgent,
    );
  if (isSocialCrawler) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  const hasActiveAccessToken = Boolean(
    accessToken &&
      accessToken !== "undefined" &&
      accessToken !== "null" &&
      accessToken.trim().length >= 10,
  );

  const hasRefreshSession = Boolean(
    refreshToken &&
      refreshToken !== "undefined" &&
      refreshToken !== "null" &&
      refreshToken.trim().length >= 10,
  );

  const hasAnySession = hasActiveAccessToken || hasRefreshSession;
  const isAuthPage = pathname === "/login";

  // Chưa đăng nhập mà truy cập trang quản trị/dashboard -> chuyển đến login kèm callbackUrl
  if (!hasAnySession && !isAuthPage) {
    const loginUrl = new URL("/login", req.url);
    const callbackPath = req.nextUrl.pathname + req.nextUrl.search;
    if (isSafeCallbackUrl(callbackPath)) {
      loginUrl.searchParams.set("callbackUrl", callbackPath);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Đã có access_token hợp lệ mà cố vào trang login: đưa về callbackUrl nếu hợp lệ, hoặc về /admin
  if (hasActiveAccessToken && isAuthPage) {
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");
    if (isSafeCallbackUrl(callbackUrl)) {
      return NextResponse.redirect(new URL(callbackUrl, req.url));
    }
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Đã đăng nhập khi truy cập trang chủ "/" -> rewrite sang "/admin" để hiển thị cùng view và layout quản trị
  if (pathname === "/") {
    return NextResponse.rewrite(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
  ],
};
