"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Compass, CheckCircle2, XCircle, Building2, LucideIcon } from "lucide-react";
import { KpiRibbon, KpiItem, KpiTone } from "@/components/Common/KpiRibbon";

export interface DiaPhuongCapXaKpiGridProps {
  totalDiaPhuongCapXa: number;
  totalHoatDong: number;
  totalNgungHoatDong: number;
  totalDiaPhuongCapTinh: number;
  statusFilter: string;
  onSelectStatus: (status: string) => void;
  isLoadingKPI?: boolean;
  isLoading?: boolean;
  isLoadingTinh?: boolean;
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

export const DiaPhuongCapXaKpiGrid: React.FC<DiaPhuongCapXaKpiGridProps> = ({
  totalDiaPhuongCapXa,
  totalHoatDong,
  totalNgungHoatDong,
  totalDiaPhuongCapTinh,
  statusFilter,
  onSelectStatus,
  isLoadingKPI = false,
  isLoading = false,
  isLoadingTinh: _isLoadingTinh,
}) => {
  const router = useRouter();

  // 1. Cấu hình định nghĩa 4 thẻ KPI Cấp Xã
  const kpiDefinitions: RawKpiDef[] = useMemo(
    () => [
      {
        id: "all",
        title: "Tổng Xã / Phường",
        subtext: "Đơn vị hành chính cấp cơ sở",
        value: totalDiaPhuongCapXa.toLocaleString("vi-VN"),
        icon: Compass,
        tone: "neutral",
        isActive: statusFilter === "all",
        onClick: () => onSelectStatus("all"),
      },
      {
        id: "active",
        title: "Đang hoạt động",
        subtext: "Sẵn sàng liên kết cơ sở",
        value: totalHoatDong.toLocaleString("vi-VN"),
        icon: CheckCircle2,
        tone: "emerald",
        isActive: statusFilter === "active",
        onClick: () => onSelectStatus("active"),
      },
      {
        id: "inactive",
        title: "Tạm ngưng / Khóa",
        subtext: "Vô hiệu hóa trong biểu mẫu",
        value: totalNgungHoatDong.toLocaleString("vi-VN"),
        icon: XCircle,
        tone: "rose",
        isActive: statusFilter === "inactive",
        onClick: () => onSelectStatus("inactive"),
      },
      {
        id: "provinces",
        title: "Tỉnh / TP liên kết",
        subtext: "Xem toàn bộ danh mục cấp tỉnh",
        value: totalDiaPhuongCapTinh.toLocaleString("vi-VN"),
        icon: Building2,
        tone: "indigo",
        onClick: () => router.push("/admin/diaPhuongCapTinh"),
      },
    ],
    [
      totalDiaPhuongCapXa,
      totalHoatDong,
      totalNgungHoatDong,
      totalDiaPhuongCapTinh,
      statusFilter,
      onSelectStatus,
      router,
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
