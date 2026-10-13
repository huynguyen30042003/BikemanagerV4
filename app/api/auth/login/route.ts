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
    const nextResponse = NextResponse.json({
      success: true,

      access_token: data.access_token,

      expires_in: data.expires_in,
    });
    const isProduction = process.env.NODE_ENV === "production";
    // lưu cookie HttpOnly
    nextResponse.cookies.set("access_token", data.access_token, {
      httpOnly: true,

      secure: isProduction,

      sameSite: "lax",

      path: "/",

      maxAge: data.expires_in,
    });
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      const match = setCookie.match(/refresh_token=([^;]+)/);

      if (match) {
        nextResponse.cookies.set("refresh_token", match[1], {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
      }
    }

    // expires_at
    nextResponse.cookies.set(
      "expires_at",
      (Math.floor(Date.now() / 1000) + data.expires_in).toString(),
      {
        httpOnly: false,

        secure: false,

        sameSite: "lax",

        path: "/",

        maxAge: data.expires_in,
      },
    );

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
