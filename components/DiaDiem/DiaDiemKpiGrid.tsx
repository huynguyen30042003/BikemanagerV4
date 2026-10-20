"use client";

import React, { useMemo } from "react";
import { Store, CheckCircle2, XCircle, ShoppingBag, LucideIcon } from "lucide-react";
import { KpiRibbon, KpiItem, KpiTone } from "@/components/Common/KpiRibbon";

export interface DiaDiemKpiGridProps {
  totalDiaDiem: number;
  totalHoatDong: number;
  totalNgungHoatDong: number;
  showroomCount: number;
  statusFilter: string;
  tinhFilter: string | number;
  onSelectStatus: (status: string) => void;
  onResetTinh?: () => void;
  isLoadingKPI?: boolean;
  isLoading?: boolean;
}

interface RawKpiDef {
  id: string;
  title: string;
  subtext: string;
  value: React.ReactNode;
  icon: LucideIcon;
  tone: KpiTone;
  compact?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export const DiaDiemKpiGrid: React.FC<DiaDiemKpiGridProps> = ({
  totalDiaDiem,
  totalHoatDong,
  totalNgungHoatDong,
  showroomCount,
  statusFilter,
  tinhFilter,
  onSelectStatus,
  onResetTinh,
  isLoadingKPI = false,
  isLoading = false,
}) => {
  // 1. Cấu hình định nghĩa 4 thẻ KPI Địa điểm
  const kpiDefinitions: RawKpiDef[] = useMemo(
    () => [
      {
        id: "all",
        title: "Tổng số cơ sở",
        subtext: "Toàn bộ mạng lưới phân phối",
        value: totalDiaDiem.toLocaleString("vi-VN"),
        icon: Store,
        tone: "neutral",
        isActive: statusFilter === "all" && !tinhFilter,
        onClick: () => {
          onSelectStatus("all");
          onResetTinh?.();
        },
      },
      {
        id: "active",
        title: "Đang hoạt động",
        subtext: "Mở cửa đón khách & xuất kho",
        value: totalHoatDong.toLocaleString("vi-VN"),
        icon: CheckCircle2,
        tone: "emerald",
        isActive: statusFilter === "active",
        onClick: () => onSelectStatus("active"),
      },
      {
        id: "inactive",
        title: "Tạm đóng / Khóa",
        subtext: "Bảo trì hoặc ngừng hoạt động",
        value: totalNgungHoatDong.toLocaleString("vi-VN"),
        icon: XCircle,
        tone: "rose",
        isActive: statusFilter === "inactive",
        onClick: () => onSelectStatus("inactive"),
      },
      {
        id: "showroom",
        title: "Showroom bán hàng",
        subtext: "Điểm bán lẻ trực tiếp (trên trang)",
        value: showroomCount.toLocaleString("vi-VN"),
        icon: ShoppingBag,
        tone: "indigo",
      },
    ],
    [
      totalDiaDiem,
      totalHoatDong,
      totalNgungHoatDong,
      showroomCount,
      statusFilter,
      tinhFilter,
      onSelectStatus,
      onResetTinh,
    ]
  );

  // 2. Dùng .map() chuyển đổi sang KpiItem chuẩn để tái sử dụng KpiRibbon
  const kpiItems: KpiItem[] = useMemo(
    () =>
      kpiDefinitions.map((def) => ({
        title: def.title,
        value: def.value,
        subtext: def.subtext,
        icon: def.icon,
        tone: def.tone,
        compact: def.compact,
        isActive: def.isActive,
        onClick: def.onClick,
      })),
    [kpiDefinitions]
  );

  return (
    <KpiRibbon
      items={kpiItems}
      isLoading={isLoadingKPI || isLoading}
    />
  );
};
