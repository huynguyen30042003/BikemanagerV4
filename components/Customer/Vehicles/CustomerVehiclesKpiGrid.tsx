"use client";

import React, { useMemo } from "react";
import {
  Bike,
  CheckCircle2,
  XCircle,
  Gauge,
  LucideIcon,
} from "lucide-react";
import { KpiRibbon, KpiItem, KpiTone } from "@/components/Common/KpiRibbon";

export interface CustomerVehiclesKpiGridProps {
  totalPhuongTien: number;
  totalHoatDong: number;
  totalNgungHoatDong: number;
  totalKM: number;
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
  isClickable: boolean;
  filterValue?: string;
}

export const CustomerVehiclesKpiGrid: React.FC<CustomerVehiclesKpiGridProps> = ({
  totalPhuongTien,
  totalHoatDong,
  totalNgungHoatDong,
  totalKM,
  statusFilter,
  onSelectStatus,
  isLoadingKPI = false,
  isLoading = false,
}) => {
  // 1. Định nghĩa cấu hình 4 thẻ KPI phương tiện
  const kpiDefinitions: RawKpiDef[] = useMemo(
    () => [
      {
        id: "all",
        title: "Tổng số phương tiện",
        subtext: "Toàn bộ phương tiện đăng ký",
        value: totalPhuongTien.toLocaleString("vi-VN"),
        icon: Bike,
        tone: "neutral",
        isClickable: true,
        filterValue: "all",
      },
      {
        id: "active",
        title: "Đang sử dụng",
        subtext: "Sẵn sàng lưu thông & bảo dưỡng",
        value: totalHoatDong.toLocaleString("vi-VN"),
        icon: CheckCircle2,
        tone: "emerald",
        isClickable: true,
        filterValue: "active",
      },
      {
        id: "inactive",
        title: "Đã chuyển nhượng / Hỏng",
        subtext: "Ngưng hoạt động hoặc đã đổi chủ",
        value: totalNgungHoatDong.toLocaleString("vi-VN"),
        icon: XCircle,
        tone: "rose",
        isClickable: true,
        filterValue: "inactive",
      },
      {
        id: "km",
        title: "Đã ghi nhận ODO",
        subtext: "Phương tiện có số KM lưu hành",
        value: totalKM.toLocaleString("vi-VN"),
        icon: Gauge,
        tone: "indigo",
        isClickable: false,
      },
    ],
    [totalPhuongTien, totalHoatDong, totalNgungHoatDong, totalKM]
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
        isActive: def.filterValue ? statusFilter === def.filterValue : false,
        onClick:
          def.isClickable && def.filterValue
            ? () => onSelectStatus(def.filterValue!)
            : undefined,
      })),
    [kpiDefinitions, statusFilter, onSelectStatus]
  );

  return (
    <KpiRibbon
      items={kpiItems}
      isLoading={isLoadingKPI || isLoading}
    />
  );
};

