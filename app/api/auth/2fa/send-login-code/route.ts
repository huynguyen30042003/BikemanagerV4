process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { APP_URL } from "@/shared/constants/apiConstants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${APP_URL}/auth/2fa/send-login-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        twoFactorToken: body.twoFactorToken,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message || "Không thể gửi lại mã OTP. Vui lòng thử lại sau.",
          errors: data.errors,
        },
        {
          status: response.status || 400,
        }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[SEND_LOGIN_CODE_ERROR]", error);
    return NextResponse.json(
      {
        message: "Lỗi kết nối máy chủ khi yêu cầu gửi lại OTP.",
      },
      {
        status: 500,
      }
    );
  }
}
