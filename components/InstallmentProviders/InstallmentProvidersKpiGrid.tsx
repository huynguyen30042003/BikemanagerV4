"use client";

import React, { useMemo } from "react";
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  Cpu,
  LucideIcon,
} from "lucide-react";
import { KpiRibbon, KpiItem, KpiTone } from "@/components/Common/KpiRibbon";
import { TG_DonViTraGopKPI } from "@/types/traGop";

export interface InstallmentProvidersKpiGridProps {
  kpiData?: TG_DonViTraGopKPI;
  totalCount: number;
  statusFilter: string;
  onFilterStatus: (status: string) => void;
  onResetFilters: () => void;
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

export const InstallmentProvidersKpiGrid: React.FC<
  InstallmentProvidersKpiGridProps
> = ({
  kpiData,
  totalCount,
  statusFilter,
  onFilterStatus,
  onResetFilters,
  isLoadingKPI = false,
  isLoading = false,
}) => {
  const totalDonVi =
    kpiData?.total_DonViTraGop ?? kpiData?.totalDonViTraGop ?? totalCount;
  const totalDangHoatDong =
    kpiData?.total_DangHoatDong ?? kpiData?.totalDangHoatDong ?? 0;
  const totalNgungHoatDong =
    kpiData?.total_NgungHoatDong ?? kpiData?.totalNgungHoatDong ?? 0;
  const totalTichHopAPI =
    kpiData?.total_TichHopAPI ?? kpiData?.totalTichHopAPI ?? 0;

  // 1. Cấu hình định nghĩa 4 thẻ KPI Đơn vị đối tác trả góp
  const kpiDefinitions: RawKpiDef[] = useMemo(
    () => [
      {
        id: "all",
        title: "Tổng đối tác",
        subtext: "Tổ chức tài chính liên kết",
        value: totalDonVi.toLocaleString("vi-VN"),
        icon: Building2,
        tone: "neutral",
        isActive: statusFilter === "all",
        onClick: onResetFilters,
      },
      {
        id: "active",
        title: "Đang hợp tác",
        subtext: "Sẵn sàng nhận hồ sơ vay",
        value: totalDangHoatDong.toLocaleString("vi-VN"),
        icon: CheckCircle2,
        tone: "emerald",
        isActive: statusFilter === "active",
        onClick: () =>
          onFilterStatus(statusFilter === "active" ? "all" : "active"),
      },
      {
        id: "inactive",
        title: "Tạm ngưng",
        subtext: "Tạm dừng xử lý hồ sơ",
        value: totalNgungHoatDong.toLocaleString("vi-VN"),
        icon: AlertCircle,
        tone: "rose",
        isActive: statusFilter === "inactive",
        onClick: () =>
          onFilterStatus(statusFilter === "inactive" ? "all" : "inactive"),
      },
      {
        id: "api",
        title: "Tích hợp API",
        subtext: "Đồng bộ hồ sơ tự động",
        value: totalTichHopAPI.toLocaleString("vi-VN"),
        icon: Cpu,
        tone: "indigo",
      },
    ],
    [
      totalDonVi,
      totalDangHoatDong,
      totalNgungHoatDong,
      totalTichHopAPI,
      statusFilter,
      onResetFilters,
      onFilterStatus,
    ]
  );

  // 2. Dùng .map() chuyển đổi sang KpiItem chuẩn để truyền vào KpiRibbon
  const kpiItems: KpiItem[] = useMemo(
    () =>
      kpiDefinitions.map((kpi) => ({
        title: kpi.title,
        value: kpi.value,
        subtext: kpi.subtext,
        icon: kpi.icon,
        tone: kpi.tone,
        compact: kpi.compact,
        isActive: kpi.isActive,
        onClick: kpi.onClick,
      })),
    [kpiDefinitions]
  );

  return (
    <KpiRibbon
      items={kpiItems}
      isLoading={isLoadingKPI || isLoading}
      className="w-full"
    />
  );
};
