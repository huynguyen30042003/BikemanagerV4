"use client";

import React, { useMemo } from "react";
import {
  CreditCard,
  Clock,
  CheckCircle2,
  BadgeCheck,
  DollarSign,
  LucideIcon,
} from "lucide-react";
import { KpiRibbon, KpiItem, KpiTone } from "@/components/Common/KpiRibbon";
import { TG_TraGopKPI } from "@/types/traGop";

export function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

export interface InstallmentContractsKpiGridProps {
  kpiData?: TG_TraGopKPI;
  totalCount: number;
  statusFilter: string;
  disbursementFilter: string;
  onFilterStatus: (status: string) => void;
  onFilterDisbursement: (disbursement: string) => void;
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

export const InstallmentContractsKpiGrid: React.FC<InstallmentContractsKpiGridProps> = ({
  kpiData,
  totalCount,
  statusFilter,
  disbursementFilter,
  onFilterStatus,
  onFilterDisbursement,
  onResetFilters,
  isLoadingKPI = false,
  isLoading = false,
}) => {
  const totalHopDong =
    kpiData?.total_HopDongTraGop ?? kpiData?.totalHopDongTraGop ?? totalCount;
  const totalChoDuyet =
    kpiData?.total_ChoDuyet ?? kpiData?.totalChoDuyet ?? 0;
  const totalDaDuyet =
    kpiData?.total_DaDuyet ?? kpiData?.totalDaDuyet ?? 0;
  const totalDaGiaiNgan =
    kpiData?.total_DaGiaiNgan ?? kpiData?.totalDaGiaiNgan ?? 0;
  const totalTongTienVay =
    kpiData?.total_TongSoTienVay ?? kpiData?.totalTongSoTienVay ?? 0;
  const totalSoTienGiaiNganThucTe =
    kpiData?.total_SoTienGiaiNganThucTe ??
    kpiData?.totalSoTienGiaiNganThucTe ??
    0;

  // 1. Cấu hình định nghĩa 6 chỉ số KPI Hợp đồng trả góp
  const kpiDefinitions: RawKpiDef[] = useMemo(
    () => [
      {
        id: "all",
        title: "Tổng hợp đồng",
        subtext: "Hồ sơ vay trong hệ thống",
        value: totalHopDong.toLocaleString("vi-VN"),
        icon: CreditCard,
        tone: "neutral",
        isActive: statusFilter === "all" && disbursementFilter === "all",
        onClick: onResetFilters,
      },
      {
        id: "cho-duyet",
        title: "Chờ thẩm định",
        subtext: "Chờ đối tác duyệt hồ sơ",
        value: totalChoDuyet.toLocaleString("vi-VN"),
        icon: Clock,
        tone: "amber",
        isActive: statusFilter === "110",
        onClick: () =>
          onFilterStatus(statusFilter === "110" ? "all" : "110"),
      },
      {
        id: "da-duyet",
        title: "Đã duyệt vay",
        subtext: "Đủ điều kiện nhận xe",
        value: totalDaDuyet.toLocaleString("vi-VN"),
        icon: CheckCircle2,
        tone: "emerald",
        isActive: statusFilter === "111",
        onClick: () =>
          onFilterStatus(statusFilter === "111" ? "all" : "111"),
      },
      {
        id: "da-giai-ngan",
        title: "Đã giải ngân",
        subtext: "Tiền đã về shop",
        value: totalDaGiaiNgan.toLocaleString("vi-VN"),
        icon: BadgeCheck,
        tone: "indigo",
        isActive: disbursementFilter === "121",
        onClick: () =>
          onFilterDisbursement(
            disbursementFilter === "121" ? "all" : "121"
          ),
      },
      {
        id: "tong-tien-vay",
        title: "Tổng tiền vay",
        subtext: "Tổng hạn mức đề nghị",
        value: formatCurrency(Number(totalTongTienVay)),
        icon: DollarSign,
        tone: "blue",
        compact: true,
      },
      {
        id: "giai-ngan-thuc-te",
        title: "Giải ngân thực tế",
        subtext: "Thực nhận sau phí",
        value: formatCurrency(Number(totalSoTienGiaiNganThucTe)),
        icon: DollarSign,
        tone: "emerald",
        compact: true,
      },
    ],
    [
      totalHopDong,
      totalChoDuyet,
      totalDaDuyet,
      totalDaGiaiNgan,
      totalTongTienVay,
      totalSoTienGiaiNganThucTe,
      statusFilter,
      disbursementFilter,
      onResetFilters,
      onFilterStatus,
      onFilterDisbursement,
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
