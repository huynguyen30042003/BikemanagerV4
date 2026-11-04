import { KH_PhuongTienKhachHang } from "@/types/phuongTienKhachHang";
import { BH_BaoHanh, BH_PhieuBaoHanh } from "@/types/baoHanh";

export type DetailTabKey =
  | "vehicles-warranty"
  | "purchased-orders"
  | "warranty-claims";

export interface EnrichedCustomerVehicle {
  vehicle: KH_PhuongTienKhachHang;
  warranty: BH_BaoHanh | null;
  claims: BH_PhieuBaoHanh[];
}

export interface WarrantyTimeInfo {
  status: "unknown" | "expired" | "expiring" | "active";
  label: string;
  daysLeft: number;
  progressPercent: number;
}

export interface TierConfig {
  label: string;
  badgeClass: string;
}

export const formatCurrency = (value?: number | null): string =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

export const formatDate = (dateStr?: string | null): string => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const getWarrantyTimeStatus = (
  ngayBatDau?: string,
  ngayKetThuc?: string,
): WarrantyTimeInfo => {
  if (!ngayKetThuc) {
    return {
      status: "unknown",
      label: "Chưa xác định",
      daysLeft: 0,
      progressPercent: 0,
    };
  }
  const now = Date.now();
  const start = ngayBatDau ? new Date(ngayBatDau).getTime() : now;
  const end = new Date(ngayKetThuc).getTime();

  const totalDuration = Math.max(end - start, 1);
  const elapsed = Math.min(Math.max(now - start, 0), totalDuration);
  const progressPercent = Math.round((elapsed / totalDuration) * 100);
  const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return {
      status: "expired",
      label: `Đã hết hạn (${Math.abs(daysLeft)} ngày trước)`,
      daysLeft: 0,
      progressPercent: 100,
    };
  }
  if (daysLeft <= 30) {
    return {
      status: "expiring",
      label: `Sắp hết hạn (còn ${daysLeft} ngày)`,
      daysLeft,
      progressPercent,
    };
  }
  return {
    status: "active",
    label: `Đang hiệu lực (còn ${daysLeft} ngày)`,
    daysLeft,
    progressPercent,
  };
};

export const getTierConfig = (tier?: string | null): TierConfig => {
  switch (tier) {
    case "KimCuong":
      return {
        label: "Hội viên Kim Cương",
        badgeClass:
          "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/40",
      };
    case "Vang":
      return {
        label: "Hội viên Vàng",
        badgeClass:
          "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40",
      };
    case "Bac":
      return {
        label: "Hội viên Bạc",
        badgeClass:
          "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
      };
    default:
      return {
        label: "Khách hàng Thân thiết",
        badgeClass:
          "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/25",
      };
  }
};

