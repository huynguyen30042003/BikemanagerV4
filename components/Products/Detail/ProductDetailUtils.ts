export type ProductDetailTabKey =
  | "variants"
  | "gallery"
  | "specs-brand"
  | "serials-stock";

export interface ParsedSpecItem {
  id: string;
  label: string;
  value: string;
}

export const formatCurrency = (val?: number | null): string => {
  if (val === undefined || val === null || Number.isNaN(Number(val))) {
    return "0 đ";
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(val));
};

export const formatDateStr = (dateStr?: string | null): string => {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "-";
  }
};

/**
 * Giải mã chuỗi JSON thông số kỹ thuật (`thongSoKyThuatJson` hoặc `thuocTinhJson`)
 * Hỗ trợ cả dạng Object `{"Động cơ": "1500W", "Tốc độ tối đa": "60 km/h"}`
 * và dạng Array `[{"ten": "Động cơ", "giaTri": "1500W"}]`
 */
export const parseJsonSpecs = (jsonStr?: string | null): ParsedSpecItem[] => {
  if (!jsonStr || !jsonStr.trim()) return [];

  try {
    const parsed: unknown = JSON.parse(jsonStr);

    if (Array.isArray(parsed)) {
      return parsed
        .map((item, idx) => {
          if (item && typeof item === "object") {
            const record = item as Record<string, unknown>;
            const entries = Object.entries(record);
            if (entries.length >= 2) {
              return {
                id: `spec-arr-${idx}`,
                label: String(entries[0][1] ?? entries[0][0]),
                value: String(entries[1][1] ?? "-"),
              };
            }
            if (entries.length === 1) {
              return {
                id: `spec-arr-${idx}`,
                label: String(entries[0][0]),
                value: String(entries[0][1] ?? "-"),
              };
            }
          }
          return null;
        })
        .filter((x): x is ParsedSpecItem => x !== null);
    }

    if (parsed && typeof parsed === "object") {
      return Object.entries(parsed as Record<string, unknown>).map(
        ([k, v], idx) => ({
          id: `spec-obj-${idx}-${k}`,
          label: k,
          value:
            v === null || v === undefined
              ? "-"
              : typeof v === "object"
                ? JSON.stringify(v)
                : String(v),
        }),
      );
    }
  } catch {
    // Trường hợp chuỗi văn bản thuần cách nhau bởi dòng hoặc dấu chấm phẩy
    return jsonStr
      .split(/\r?\n|;/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, idx) => {
        const colonIdx = line.indexOf(":");
        if (colonIdx > 0) {
          return {
            id: `spec-line-${idx}`,
            label: line.slice(0, colonIdx).trim(),
            value: line.slice(colonIdx + 1).trim() || "-",
          };
        }
        return {
          id: `spec-line-${idx}`,
          label: `Thông số #${idx + 1}`,
          value: line,
        };
      });
  }

  return [];
};
