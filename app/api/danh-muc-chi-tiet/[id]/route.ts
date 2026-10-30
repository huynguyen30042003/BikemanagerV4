import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { APP_URL } from "@/shared/constants/apiConstants";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = Number(id);

    if (isNaN(numId) || numId <= 0) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const res = await fetch(`${APP_URL}/DanhMucChiTietApi/Get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ Id: numId }),
      next: {
        revalidate: 86400,
        tags: ["danh-muc-chi-tiet", `danh-muc-chi-tiet-id-${numId}`],
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Lỗi từ backend: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API_DANH_MUC_CHI_TIET_GET_ID]", error);
    return NextResponse.json({ error: "Lỗi kết nối máy chủ" }, { status: 500 });
  }
}

