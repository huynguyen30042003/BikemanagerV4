"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, CheckCircle2, AlertCircle, DollarSign } from "lucide-react";
import { NH_NhaCungCap, NhaCungCapKPI } from "@/types/nhaCungCap";

interface SuppliersKpiGridProps {
  kpiData?: NhaCungCapKPI | null;
  totalCount: number;
  items: NH_NhaCungCap[];
  isLoading: boolean;
  isLoadingKPI: boolean;
}

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

export function SuppliersKpiGrid({
  kpiData,
  totalCount,
  items,
  isLoading,
  isLoadingKPI,
}: SuppliersKpiGridProps) {
  const totalSuppliers = kpiData?.total_NhaCungCap ?? totalCount;
  const activeCount =
    kpiData?.total_HoatDong ?? items.filter((i) => i.trangThai).length;
  const debtCount =
    kpiData?.total_CoCongNo ??
    items.filter((i) => (i.congNoHienTai || 0) > 0).length;
  const totalDebt =
    kpiData?.total_CongNoHienTai ??
    items.reduce((sum, i) => sum + (i.congNoHienTai || 0), 0);

  const kpis = useMemo(
    () => [
      {
        id: "total",
        title: "Tổng nhà cung cấp",
        subTitle: "Đã lưu trong hệ thống",
        value: totalSuppliers.toLocaleString("vi-VN"),
        icon: Building2,
        colorClass: "text-foreground",
        iconBgClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      },
      {
        id: "active",
        title: "Đang giao dịch",
        subTitle: "Hợp tác kinh doanh tích cực",
        value: activeCount.toLocaleString("vi-VN"),
        icon: CheckCircle2,
        colorClass: "text-emerald-600 dark:text-emerald-400",
        iconBgClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      },
      {
        id: "hasDebt",
        title: "Có công nợ",
        subTitle: "NCC cần thanh toán đợt tới",
        value: debtCount.toLocaleString("vi-VN"),
        icon: AlertCircle,
        colorClass: "text-amber-600 dark:text-amber-400",
        iconBgClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      },
      {
        id: "totalDebt",
        title: "Tổng nợ phải trả",
        subTitle: "Công nợ toàn hệ thống",
        value: formatCurrency(totalDebt),
        icon: DollarSign,
        colorClass: "text-rose-600 dark:text-rose-400",
        iconBgClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      },
    ],
    [totalSuppliers, activeCount, debtCount, totalDebt],
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card
            key={kpi.id}
            className="p-3.5 sm:p-4 bg-card/60 backdrop-blur-sm border-border/80 shadow-2xs transition-all hover:border-border"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground truncate">
                {kpi.title}
              </span>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${kpi.iconBgClass}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div
              className={`text-xl sm:text-2xl font-bold mt-2 truncate ${kpi.colorClass}`}
            >
              {isLoading || isLoadingKPI ? (
                <Skeleton className="h-7 w-20" />
              ) : (
                kpi.value
              )}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
              {kpi.subTitle}
            </p>
          </Card>
        );
      })}
    </div>
  );
}

export default SuppliersKpiGrid;
