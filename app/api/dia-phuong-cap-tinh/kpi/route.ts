import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { APP_URL } from "@/shared/constants/apiConstants";

export async function GET(_req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const res = await fetch(`${APP_URL}/DiaPhuongCapTinhApi/GetKPI`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: {
        revalidate: 3600, // 1 giờ
        tags: ["dia-phuong-cap-tinh", "dia-phuong-cap-tinh-kpi"],
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Lỗi từ backend: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data?.data ?? data);
  } catch (error) {
    console.error("[API_DIA_PHUONG_CAP_TINH_KPI]", error);
    return NextResponse.json({ error: "Lỗi kết nối máy chủ" }, { status: 500 });
  }
}

