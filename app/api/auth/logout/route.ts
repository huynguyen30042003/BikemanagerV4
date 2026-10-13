
import { APP_URL } from "@/shared/constants/apiConstants";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = await fetch(
      `${APP_URL}/auth/logout`,
      {
        method: "POST",

        credentials: "include",
      }
    );

    const nextResponse =
      NextResponse.json({
        success: true,
      });

    // forward clear-cookie from backend
    const cookies =
      response.headers.getSetCookie();

    cookies.forEach((cookie) => {
      nextResponse.headers.append(
        "Set-Cookie",
        cookie
      );
    });

    // Explicitly delete client cookies
    nextResponse.cookies.set("access_token", "", { path: "/", maxAge: 0 });
    nextResponse.cookies.set("refresh_token", "", { path: "/", maxAge: 0 });
    nextResponse.cookies.set("expires_at", "", { path: "/", maxAge: 0 });

    return nextResponse;
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message:
          "Logout failed",
      },
      {
        status: 500,
      }
    );
  }
}