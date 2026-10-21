"use client";

import React, { useMemo } from "react";
import {
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  DollarSign,
  LucideIcon,
} from "lucide-react";
import { KpiRibbon, KpiItem, KpiTone } from "@/components/Common/KpiRibbon";

export function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

export interface PurchaseOrdersKpiGridProps {
  totalPurchaseOrders: number;
  pendingCount: number;
  completedCount: number;
  totalDebt: number;
  statusFilter: number | null;
  onSelectTotal: () => void;
  onSelectPending: () => void;
  onSelectCompleted: () => void;
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

export const PurchaseOrdersKpiGrid: React.FC<PurchaseOrdersKpiGridProps> = ({
  totalPurchaseOrders,
  pendingCount,
  completedCount,
  totalDebt,
  statusFilter,
  onSelectTotal,
  onSelectPending,
  onSelectCompleted,
  isLoadingKPI = false,
  isLoading = false,
}) => {
  const isKpiLoading = isLoadingKPI || isLoading;

  // 1. Cấu hình định nghĩa 4 thẻ KPI Đơn nhập hàng
  const kpiDefinitions: RawKpiDef[] = useMemo(
    () => [
      {
        id: "total",
        title: "Tổng đơn nhập",
        subtext: "Đã tạo trong hệ thống",
        value: totalPurchaseOrders.toLocaleString("vi-VN"),
        icon: FileSpreadsheet,
        tone: "blue",
        isActive: statusFilter === null,
        onClick: onSelectTotal,
      },
      {
        id: "pending",
        title: "Chờ duyệt & Đang tạo",
        subtext: "Cần phê duyệt đơn hàng",
        value: pendingCount.toLocaleString("vi-VN"),
        icon: Clock,
        tone: "amber",
        isActive: statusFilter === 66 || statusFilter === 67,
        onClick: onSelectPending,
      },
      {
        id: "completed",
        title: "Đã nhập kho",
        subtext: "Đã tăng tồn kho thực tế",
        value: completedCount.toLocaleString("vi-VN"),
        icon: CheckCircle2,
        tone: "emerald",
        isActive: statusFilter === 70,
        onClick: onSelectCompleted,
      },
      {
        id: "debt",
        title: "Còn nợ đơn nhập",
        subtext: "Tổng nợ cần trả NCC",
        value: formatCurrency(totalDebt),
        icon: DollarSign,
        tone: "rose",
        compact: true,
        isActive: false,
      },
    ],
    [
      totalPurchaseOrders,
      pendingCount,
      completedCount,
      totalDebt,
      statusFilter,
      onSelectTotal,
      onSelectPending,
      onSelectCompleted,
    ]
  );

  // 2. Chuyển đổi sang định dạng KpiItem[] chuẩn của KpiRibbon bằng .map()
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

  return <KpiRibbon items={kpiItems} isLoading={isKpiLoading} />;
};
export default PurchaseOrdersKpiGrid;
