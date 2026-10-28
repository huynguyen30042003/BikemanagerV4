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
 * Định dạng tiền rút gọn cho không gian hẹp (vd: 1,2tỷ · 12,5tr · 500k · 0)
 */
export function formatCompactCurrency(val: number | null | undefined): string {
  const n = val ?? 0;
  const abs = Math.abs(n);
  const fmt = (v: number) =>
    new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(v);
  if (abs >= 1_000_000_000) return `${fmt(n / 1_000_000_000)}tỷ`;
  if (abs >= 1_000_000) return `${fmt(n / 1_000_000)}tr`;
  if (abs >= 1_000) return `${fmt(n / 1_000)}k`;
  return fmt(n);
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
 * Helper format Date thành chuỗi chuẩn API: YYYY-MM-DDTHH:mm:ss theo giờ địa phương
 * Tránh hoàn toàn tình trạng toISOString() bị lùi 7 tiếng về 17:00:00.000Z của ngày hôm trước
 */
function formatToLocalISO(d: Date, timeStr: "00:00:00" | "23:59:59"): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${timeStr}`;
}

/**
 * Trích xuất ngày bắt đầu (TuNgay) và ngày kết thúc (DenNgay) theo TimeRangeType
 * Đảm bảo giờ bắt đầu luôn là 00:00:00 và giờ kết thúc luôn là 23:59:59
 */
export function getFilterDates(
  range: TimeRangeType,
  customFrom?: string,
  customTo?: string,
): {
  TuNgay: string | null;
  DenNgay: string | null;
} {
  if (range === "tat_ca") {
    return { TuNgay: null, DenNgay: null };
  }
  if (range === "tuy_chon") {
    // customFrom / customTo có dạng yyyy-MM-dd (từ DatePicker)
    const from = customFrom ? customFrom.slice(0, 10) : "";
    const to = customTo ? customTo.slice(0, 10) : "";
    return {
      TuNgay: from ? `${from}T00:00:00` : null,
      DenNgay: to ? `${to}T23:59:59` : null,
    };
  }
  const now = new Date();
  if (range === "hom_nay") {
    return {
      TuNgay: formatToLocalISO(now, "00:00:00"),
      DenNgay: formatToLocalISO(now, "23:59:59"),
    };
  }
  if (range === "7_ngay") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    return {
      TuNgay: formatToLocalISO(start, "00:00:00"),
      DenNgay: formatToLocalISO(now, "23:59:59"),
    };
  }
  if (range === "thang_nay") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      TuNgay: formatToLocalISO(start, "00:00:00"),
      DenNgay: formatToLocalISO(end, "23:59:59"),
    };
  }
  if (range === "quy_nay") {
    const currentQuarter = Math.floor(now.getMonth() / 3);
    const start = new Date(now.getFullYear(), currentQuarter * 3, 1);
    const end = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0);
    return {
      TuNgay: formatToLocalISO(start, "00:00:00"),
      DenNgay: formatToLocalISO(end, "23:59:59"),
    };
  }
  if (range === "nam_nay") {
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31);
    return {
      TuNgay: formatToLocalISO(start, "00:00:00"),
      DenNgay: formatToLocalISO(end, "23:59:59"),
    };
  }
  return { TuNgay: null, DenNgay: null };
}
