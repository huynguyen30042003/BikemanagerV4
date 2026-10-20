import { TimeRangeType } from "@/types/dashboard";

/**
 * Định dạng tiền tệ VNĐ chuẩn hóa
 */
export function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

/**
 * Định dạng ngày giờ thân thiện theo locale Việt Nam
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Trích xuất ngày bắt đầu (TuNgay) và ngày kết thúc (DenNgay) theo TimeRangeType
 */
export function getFilterDates(range: TimeRangeType): {
  TuNgay: string | null;
  DenNgay: string | null;
} {
  if (range === "tat_ca") {
    return { TuNgay: null, DenNgay: null };
  }
  const now = new Date();
  if (range === "hom_nay") {
    const start = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0
    );
    const end = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    );
    return { TuNgay: start.toISOString(), DenNgay: end.toISOString() };
  }
  if (range === "7_ngay") {
    const start = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { TuNgay: start.toISOString(), DenNgay: end.toISOString() };
  }
  if (range === "thang_nay") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    return { TuNgay: start.toISOString(), DenNgay: end.toISOString() };
  }
  if (range === "quy_nay") {
    const currentQuarter = Math.floor(now.getMonth() / 3);
    const start = new Date(now.getFullYear(), currentQuarter * 3, 1, 0, 0, 0);
    const end = new Date(
      now.getFullYear(),
      (currentQuarter + 1) * 3,
      0,
      23,
      59,
      59
    );
    return { TuNgay: start.toISOString(), DenNgay: end.toISOString() };
  }
  if (range === "nam_nay") {
    const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
    const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    return { TuNgay: start.toISOString(), DenNgay: end.toISOString() };
  }
  return { TuNgay: null, DenNgay: null };
}
