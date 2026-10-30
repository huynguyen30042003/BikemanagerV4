import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { unstable_cache } from "next/cache";
import { APP_URL } from "@/shared/constants/apiConstants";

const getCachedDiaPhuongCapTinhById = (id: number, token?: string) =>
  unstable_cache(
    async () => {
      const res = await fetch(`${APP_URL}/DiaPhuongCapTinhApi/Get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ Id: id }),
      });

      if (!res.ok) {
        throw new Error(`Lỗi từ backend: ${res.statusText}`);
      }

      const json = await res.json();
      return {
        data: json,
        cachedAt: Date.now(),
      };
    },
    ["dia-phuong-cap-tinh-id-cache", String(id)],
    {
      revalidate: 86400,
      tags: ["dia-phuong-cap-tinh", `dia-phuong-cap-tinh-id-${id}`],
    }
  )();

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = Number(id);

    if (isNaN(numId) || numId <= 0) {
      return NextResponse.json({ error: "ID tỉnh/thành phố không hợp lệ" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const startTime = performance.now();
    const result = await getCachedDiaPhuongCapTinhById(numId, token);
    const duration = Math.round(performance.now() - startTime);

    const isHit = Date.now() - result.cachedAt > 50 || duration < 25;

    return NextResponse.json(result.data, {
      headers: {
        "X-Cache": isHit ? "HIT" : "MISS",
        "X-Cache-Time": new Date(result.cachedAt).toISOString(),
        "X-Response-Time": `${duration}ms`,
      },
    });
  } catch (error) {
    console.error("[API_DIA_PHUONG_CAP_TINH_GET_ID]", error);
    return NextResponse.json({ error: "Lỗi kết nối máy chủ" }, { status: 500 });
  }
}

