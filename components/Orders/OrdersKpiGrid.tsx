"use client";

import React, { useMemo } from "react";
import {
  ShoppingCart,
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

export interface OrdersKpiGridProps {
  totalOrders: number;
  pendingCount: number;
  completedCount: number;
  totalRevenue: number;
  statusFilter: number | null;
  onFilterStatus: (status: number | null) => void;
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

export const OrdersKpiGrid: React.FC<OrdersKpiGridProps> = ({
  totalOrders,
  pendingCount,
  completedCount,
  totalRevenue,
  statusFilter,
  onFilterStatus,
  onResetFilters,
  isLoadingKPI = false,
  isLoading = false,
}) => {
  // 1. Cấu hình định nghĩa 4 thẻ KPI Đơn hàng
  const kpiDefinitions: RawKpiDef[] = useMemo(
    () => [
      {
        id: "total",
        title: "Tổng đơn hàng",
        subtext: "Tất cả kênh bán",
        value: totalOrders.toLocaleString("vi-VN"),
        icon: ShoppingCart,
        tone: "neutral",
        isActive: statusFilter === null,
        onClick: onResetFilters,
      },
      {
        id: "pending",
        title: "Chờ xử lý & Giao",
        subtext: "Cần xuất kho hoặc vận chuyển",
        value: pendingCount.toLocaleString("vi-VN"),
        icon: Clock,
        tone: "amber",
        isActive: statusFilter === 72 || statusFilter === 73,
        onClick: () =>
          onFilterStatus(statusFilter === 72 ? null : 72),
      },
      {
        id: "completed",
        title: "Hoàn thành",
        subtext: "Đã bàn giao xe cho khách",
        value: completedCount.toLocaleString("vi-VN"),
        icon: CheckCircle2,
        tone: "emerald",
        isActive: statusFilter === 75 || statusFilter === 76,
        onClick: () =>
          onFilterStatus(statusFilter === 75 ? null : 75),
      },
      {
        id: "revenue",
        title: "Doanh thu tích lũy",
        subtext: "Giá trị tiền hàng thực tế",
        value: formatCurrency(totalRevenue),
        icon: DollarSign,
        tone: "indigo",
        compact: true,
      },
    ],
    [
      totalOrders,
      pendingCount,
      completedCount,
      totalRevenue,
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
