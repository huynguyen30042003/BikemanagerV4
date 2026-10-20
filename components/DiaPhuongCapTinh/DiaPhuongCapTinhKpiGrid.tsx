"use client";

import React, { useMemo } from "react";
import { Building2, CheckCircle2, XCircle, Landmark, LucideIcon } from "lucide-react";
import { KpiRibbon, KpiItem, KpiTone } from "@/components/Common/KpiRibbon";

export interface DiaPhuongCapTinhKpiGridProps {
  totalDiaPhuongCapTinh: number;
  totalHoatDong: number;
  totalNgungHoatDong: number;
  totalThanhPho: number;
  statusFilter: string;
  onSelectStatus: (status: string) => void;
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

export const DiaPhuongCapTinhKpiGrid: React.FC<DiaPhuongCapTinhKpiGridProps> = ({
  totalDiaPhuongCapTinh,
  totalHoatDong,
  totalNgungHoatDong,
  totalThanhPho,
  statusFilter,
  onSelectStatus,
  isLoadingKPI = false,
  isLoading = false,
}) => {
  // 1. Cấu hình định nghĩa 4 thẻ KPI Cấp Tỉnh
  const kpiDefinitions: RawKpiDef[] = useMemo(
    () => [
      {
        id: "all",
        title: "Tổng Tỉnh / Thành phố",
        subtext: "Địa bàn cấp tỉnh trên toàn quốc",
        value: totalDiaPhuongCapTinh.toLocaleString("vi-VN"),
        icon: Building2,
        tone: "neutral",
        isActive: statusFilter === "all",
        onClick: () => onSelectStatus("all"),
      },
      {
        id: "active",
        title: "Đang hoạt động",
        subtext: "Sẵn sàng liên kết xã phường & cơ sở",
        value: totalHoatDong.toLocaleString("vi-VN"),
        icon: CheckCircle2,
        tone: "emerald",
        isActive: statusFilter === "active",
        onClick: () => onSelectStatus("active"),
      },
      {
        id: "inactive",
        title: "Tạm ngưng / Khóa",
        subtext: "Vô hiệu hóa trong biểu mẫu chọn",
        value: totalNgungHoatDong.toLocaleString("vi-VN"),
        icon: XCircle,
        tone: "rose",
        isActive: statusFilter === "inactive",
        onClick: () => onSelectStatus("inactive"),
      },
      {
        id: "cities",
        title: "Thành phố trực thuộc TW",
        subtext: "Đô thị loại đặc biệt & cấp TW",
        value: totalThanhPho.toLocaleString("vi-VN"),
        icon: Landmark,
        tone: "indigo",
      },
    ],
    [
      totalDiaPhuongCapTinh,
      totalHoatDong,
      totalNgungHoatDong,
      totalThanhPho,
      statusFilter,
      onSelectStatus,
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
