"use client";

import React, { useMemo } from "react";
import { Tags, CheckCircle2, XCircle, Globe, LucideIcon } from "lucide-react";
import { KpiRibbon, KpiItem, KpiTone } from "@/components/Common/KpiRibbon";

export interface BrandsKpiGridProps {
  totalThuongHieu: number;
  totalHoatDong: number;
  totalNgungHoatDong: number;
  totalXuatXuQuocTe: number;
  statusFilter: string;
  onSelectStatus: (status: string) => void;
  isLoadingKPI?: boolean;
  isLoading?: boolean;
}

interface RawKpiDef {
  id: string;
  title: string;
  subtext: string;
  value: number;
  icon: LucideIcon;
  tone: KpiTone;
  isClickable: boolean;
  filterStatus?: string;
}

export const BrandsKpiGrid: React.FC<BrandsKpiGridProps> = ({
  totalThuongHieu,
  totalHoatDong,
  totalNgungHoatDong,
  totalXuatXuQuocTe,
  statusFilter,
  onSelectStatus,
  isLoadingKPI = false,
  isLoading = false,
}) => {
  // Danh sách định nghĩa thẻ KPI
  const kpiDefinitions: RawKpiDef[] = useMemo(
    () => [
      {
        id: "all",
        title: "Tổng số thương hiệu",
        subtext: "Khai báo trong toàn hệ thống",
        value: totalThuongHieu,
        icon: Tags,
        tone: "neutral",
        isClickable: true,
        filterStatus: "all",
      },
      {
        id: "active",
        title: "Đang áp dụng",
        subtext: "Sẵn sàng liên kết khi tạo xe",
        value: totalHoatDong,
        icon: CheckCircle2,
        tone: "emerald",
        isClickable: true,
        filterStatus: "active",
      },
      {
        id: "inactive",
        title: "Tạm ngừng / Lưu trữ",
        subtext: "Không xuất hiện trên bộ lọc khách",
        value: totalNgungHoatDong,
        icon: XCircle,
        tone: "amber",
        isClickable: true,
        filterStatus: "inactive",
      },
      {
        id: "global",
        title: "Xuất xứ quốc tế",
        subtext: "Đã liên kết quốc gia xuất xứ",
        value: totalXuatXuQuocTe,
        icon: Globe,
        tone: "blue",
        isClickable: false,
      },
    ],
    [totalThuongHieu, totalHoatDong, totalNgungHoatDong, totalXuatXuQuocTe]
  );

  // Áp dụng .map() chuyển đổi dữ liệu cấu hình sang KpiItem của KpiRibbon
  const kpiItems: KpiItem[] = useMemo(
    () =>
      kpiDefinitions.map((def) => ({
        title: def.title,
        value: def.value.toLocaleString("vi-VN"),
        subtext: def.subtext,
        icon: def.icon,
        tone: def.tone,
        isActive: def.filterStatus ? statusFilter === def.filterStatus : false,
        onClick:
          def.isClickable && def.filterStatus
            ? () => onSelectStatus(def.filterStatus!)
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
