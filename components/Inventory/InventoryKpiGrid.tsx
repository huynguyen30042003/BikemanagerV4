"use client";

import React, { useMemo } from "react";
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  LucideIcon,
} from "lucide-react";
import { KpiRibbon, KpiItem, KpiTone } from "@/components/Common/KpiRibbon";
import { KHO_TonKhoKPI } from "@/types/tonKho";

export interface InventoryKpiGridProps {
  kpiData?: KHO_TonKhoKPI;
  totalCount: number;
  totalAvailable: number;
  lowStockCount: number;
  outOfStockCount: number;
  warningFilter: "all" | "low" | "out";
  onSelectWarning: (filter: "all" | "low" | "out") => void;
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

export const InventoryKpiGrid: React.FC<InventoryKpiGridProps> = ({
  kpiData,
  totalCount,
  totalAvailable,
  lowStockCount,
  outOfStockCount,
  warningFilter,
  onSelectWarning,
  isLoadingKPI = false,
  isLoading = false,
}) => {
  const totalTonKho =
    kpiData?.total_TonKho ?? kpiData?.totalTonKho ?? totalCount;
  const totalTonKhaDung =
    kpiData?.total_TonKhaDung ?? kpiData?.totalTonKhaDung ?? totalAvailable;
  const totalSapHetHang =
    kpiData?.total_SapHetHang ?? kpiData?.totalSapHetHang ?? lowStockCount;
  const totalHetHang =
    kpiData?.total_HetHang ?? kpiData?.totalHetHang ?? outOfStockCount;

  // 1. Cấu hình định nghĩa 4 chỉ số KPI Tồn kho
  const kpiDefinitions: RawKpiDef[] = useMemo(
    () => [
      {
        id: "all",
        title: "Mặt hàng tồn (SKU)",
        subtext: "Phiên bản / Mã hàng quản lý",
        value: totalTonKho.toLocaleString("vi-VN"),
        icon: Package,
        tone: "neutral",
        isActive: warningFilter === "all",
        onClick: () => onSelectWarning("all"),
      },
      {
        id: "available",
        title: "Tổng tồn khả dụng",
        subtext: "Số lượng sẵn sàng bán ra",
        value: totalTonKhaDung.toLocaleString("vi-VN"),
        icon: CheckCircle2,
        tone: "emerald",
        isActive: warningFilter === "all",
        onClick: () => onSelectWarning("all"),
      },
      {
        id: "low",
        title: "Sắp hết hàng",
        subtext: "Dưới ngưỡng an toàn tối thiểu",
        value: totalSapHetHang.toLocaleString("vi-VN"),
        icon: AlertTriangle,
        tone: "amber",
        isActive: warningFilter === "low",
        onClick: () =>
          onSelectWarning(warningFilter === "low" ? "all" : "low"),
      },
      {
        id: "out",
        title: "Hết hàng",
        subtext: "Cần lập đơn mua / nhập kho gấp",
        value: totalHetHang.toLocaleString("vi-VN"),
        icon: XCircle,
        tone: "rose",
        isActive: warningFilter === "out",
        onClick: () =>
          onSelectWarning(warningFilter === "out" ? "all" : "out"),
      },
    ],
    [
      totalTonKho,
      totalTonKhaDung,
      totalSapHetHang,
      totalHetHang,
      warningFilter,
      onSelectWarning,
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
