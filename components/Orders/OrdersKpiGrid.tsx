"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  ShoppingCart,
  Clock,
  CheckCircle2,
  DollarSign,
  Eye,
  EyeOff,
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
  headerAction?: React.ReactNode;
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
  // Trạng thái hiển thị doanh thu (lưu cấu hình vào localStorage)
  const [showRevenue, setShowRevenue] = useState<boolean>(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("BM_SHOW_REVENUE");
      if (saved !== null) {
        setShowRevenue(saved === "true");
      }
    } catch {
      // Safe fallback khi chạy môi trường không hỗ trợ localStorage
    }
  }, []);

  const toggleRevenueVisibility = useCallback(
    (e?: React.MouseEvent | React.KeyboardEvent) => {
      e?.stopPropagation();
      setShowRevenue((prev) => {
        const next = !prev;
        try {
          localStorage.setItem("BM_SHOW_REVENUE", String(next));
        } catch {
          // ignore localStorage error
        }
        return next;
      });
    },
    []
  );

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
        subtext: showRevenue
          ? "Giá trị tiền hàng thực tế"
          : "Đã ẩn số tiền doanh thu",
        value: showRevenue ? (
          formatCurrency(totalRevenue)
        ) : (
          <span className="tracking-widest font-mono text-muted-foreground/80 select-none">
            ••••••••
          </span>
        ),
        icon: DollarSign,
        tone: "indigo",
        compact: true,
        headerAction: (
          <button
            type="button"
            onClick={toggleRevenueVisibility}
            className="p-1 -my-1 rounded-md text-muted-foreground/80 hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            title={showRevenue ? "Ẩn số tiền doanh thu" : "Hiện số tiền doanh thu"}
            aria-label={
              showRevenue ? "Ẩn số tiền doanh thu" : "Hiện số tiền doanh thu"
            }
          >
            {showRevenue ? (
              <Eye className="w-3.5 h-3.5" />
            ) : (
              <EyeOff className="w-3.5 h-3.5" />
            )}
          </button>
        ),
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
      showRevenue,
      toggleRevenueVisibility,
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
        headerAction: kpi.headerAction,
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
