import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { unstable_cache } from "next/cache";
import { APP_URL } from "@/shared/constants/apiConstants";

const getCachedNhaCungCapKPI = (token?: string) =>
  unstable_cache(
    async () => {
      let res = await fetch(`${APP_URL}/NhaCungCapApi/GetKPI`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        res = await fetch(`${APP_URL}/NhaCungCapApi/GetKPI`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
      }

      if (!res.ok) {
        throw new Error(`Lỗi từ backend: ${res.statusText}`);
      }

      const json = await res.json();
      return {
        data: json,
        cachedAt: Date.now(),
      };
    },
    ["nha-cung-cap-kpi-cache"],
    {
      revalidate: 3600, // 1 giờ
      tags: ["nha-cung-cap", "nha-cung-cap-kpi"],
    }
  )();

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const startTime = performance.now();
    const result = await getCachedNhaCungCapKPI(token);
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
    console.error("[API_NHA_CUNG_CAP_KPI]", error);
    return NextResponse.json({ error: "Lỗi kết nối máy chủ" }, { status: 500 });
  }
}

