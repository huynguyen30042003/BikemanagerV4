import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { unstable_cache } from "next/cache";
import { APP_URL } from "@/shared/constants/apiConstants";

const getCachedQuocGiaById = (id: number, token?: string) =>
  unstable_cache(
    async () => {
      const res = await fetch(`${APP_URL}/QuocGiaApi/Get`, {
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
    ["quoc-gia-detail-cache", String(id)],
    {
      revalidate: 86400, // 24 giờ
      tags: ["quoc-gia", `quoc-gia-${id}`],
    }
  )();

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const startTime = performance.now();
    const result = await getCachedQuocGiaById(id, token);
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
    console.error("[API_QUOC_GIA_DETAIL]", error);
    return NextResponse.json({ error: "Lỗi kết nối máy chủ" }, { status: 500 });
  }
}

