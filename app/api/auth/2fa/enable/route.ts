process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { APP_URL } from "@/shared/constants/apiConstants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    let token = cookieStore.get("access_token")?.value;

    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { message: "Chưa đăng nhập hoặc không tìm thấy token" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const response = await fetch(`${APP_URL}/auth/2fa/enable`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        phoneNumber: body.phoneNumber,
        code: body.code,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message || "Không thể kích hoạt tính năng xác thực 2 bước.",
          errors: data.errors,
        },
        { status: response.status || 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[ENABLE_2FA_ERROR]", error);
    return NextResponse.json(
      { message: "Lỗi kết nối máy chủ khi kích hoạt 2FA" },
      { status: 500 }
    );
  }
}
