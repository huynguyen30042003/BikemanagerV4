process.env.NODE_TLS_REJECT_UNAUTHORIZED =
  "0";

import { APP_URL } from "@/shared/constants/apiConstants";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore =
      await cookies();
      
    const refreshToken =
      cookieStore.get(
        "refresh_token"
      )?.value;
      console.log("refreshToken",refreshToken);

    if (!refreshToken) {
      return NextResponse.json(
        {
          message:
            "No refresh token",
        },
        {
          status: 401,
        }
      );
    }

    const response =
      await fetch(
        `${APP_URL}/auth/refresh`,
        {
          method: "POST",

          headers: {
            Cookie:
              `refresh_token=${refreshToken}`,
          },
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      return NextResponse.json(
        data,
        {
          status: 401,
        }
      );
    }

    const res =
      NextResponse.json(data);

    // access token
    res.cookies.set(
      "access_token",
      data.access_token,
      {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge:
          data.expires_in,
      }
    );

    // refresh token mới
    const setCookie =
      response.headers.get(
        "set-cookie"
      );

    if (setCookie) {
      const match =
        setCookie.match(
          /refresh_token=([^;]+)/
        );

      if (match) {
        res.cookies.set(
          "refresh_token",
          match[1],
          {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge:
              60 * 60 * 24 * 7,
          }
        );
      }
    }
       res.cookies.set(
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

    return res;
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message:
          "Refresh failed",
      },
      {
        status: 500,
      }
    );
  }
}