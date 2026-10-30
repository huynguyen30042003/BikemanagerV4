import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { unstable_cache } from "next/cache";
import { APP_URL } from "@/shared/constants/apiConstants";

// Cache danh mục Xã/Phường theo TỉnhID & bộ lọc
const getCachedDiaPhuongCapXa = (
  tinhId: number | null,
  tuKhoa: string,
  pageIndex: number,
  pageSize: number,
  trangThai: boolean | null,
  token?: string
) =>
  unstable_cache(
    async () => {
      const res = await fetch(`${APP_URL}/DiaPhuongCapXaApi/Gets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          TinhID: tinhId,
          TuKhoa: tuKhoa,
          PageIndex: pageIndex,
          PageSize: pageSize,
          TrangThai: trangThai,
        }),
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
    [
      "dia-phuong-cap-xa-cache",
      String(tinhId),
      tuKhoa,
      String(pageIndex),
      String(pageSize),
      String(trangThai),
    ],
    {
      revalidate: 86400, // 24 giờ
      tags: ["dia-phuong-cap-xa", ...(tinhId ? [`dia-phuong-cap-xa-tinh-${tinhId}`] : [])],
    }
  )();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tinhIdParam = searchParams.get("TinhID");
    const tinhId = tinhIdParam ? Number(tinhIdParam) : null;
    const tuKhoa = searchParams.get("TuKhoa") ?? "";
    const pageIndex = Number(searchParams.get("PageIndex") ?? "1");
    const pageSize = Number(searchParams.get("PageSize") ?? "50");
    const trangThaiParam = searchParams.get("TrangThai");
    const trangThai =
      trangThaiParam === "true" ? true : trangThaiParam === "false" ? false : null;

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const startTime = performance.now();
    const result = await getCachedDiaPhuongCapXa(
      tinhId,
      tuKhoa,
      pageIndex,
      pageSize,
      trangThai,
      token
    );
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
    console.error("[API_DIA_PHUONG_CAP_XA_GETS]", error);
    return NextResponse.json({ error: "Lỗi kết nối máy chủ" }, { status: 500 });
  }
}

