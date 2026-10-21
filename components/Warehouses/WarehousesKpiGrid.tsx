"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Warehouse, CheckCircle2, Star, XCircle } from "lucide-react";
import { KHO_Kho } from "@/types/kho";

interface WarehousesKpiGridProps {
  kpiData?: Record<string, unknown> | null;
  items: KHO_Kho[];
  totalCount: number;
  isLoading: boolean;
  isLoadingKPI: boolean;
}

export function WarehousesKpiGrid({
  kpiData,
  items,
  totalCount,
  isLoading,
  isLoadingKPI,
}: WarehousesKpiGridProps) {
  const activeCount = useMemo(
    () => items.filter((i) => i.trangThai === true).length,
    [items],
  );
  const inactiveCount = useMemo(
    () => items.filter((i) => i.trangThai === false).length,
    [items],
  );
  const defaultWarehouseCount = useMemo(
    () => items.filter((i) => i.laKhoMacDinh === true).length,
    [items],
  );

  const kpiCards = useMemo(
    () => [
      {
        title: "Tổng số kho bãi",
        value: (kpiData?.total_Kho ?? kpiData?.totalKho ?? totalCount) as number,
        subtext: "Điểm lưu trữ toàn hệ thống",
        icon: Warehouse,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-500/10",
      },
      {
        title: "Đang hoạt động",
        value: (kpiData?.total_HoatDong ??
          kpiData?.totalHoatDong ??
          activeCount) as number,
        subtext: "Sẵn sàng xuất nhập hàng",
        icon: CheckCircle2,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500/10",
      },
      {
        title: "Kho mặc định ưu tiên",
        value: (kpiData?.total_KhoMacDinh ??
          kpiData?.totalKhoMacDinh ??
          defaultWarehouseCount) as number,
        subtext: "Tự động chọn khi lập đơn bán",
        icon: Star,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-500/10",
      },
      {
        title: "Tạm ngưng",
        value: (kpiData?.total_NgungHoatDong ??
          kpiData?.totalNgungHoatDong ??
          inactiveCount) as number,
        subtext: "Kho bảo trì hoặc dừng hoạt động",
        icon: XCircle,
        color: "text-slate-600 dark:text-slate-400",
        bg: "bg-slate-500/10",
      },
    ],
    [kpiData, totalCount, activeCount, inactiveCount, defaultWarehouseCount],
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {kpiCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card
            key={idx}
            className="p-3.5 sm:p-4 bg-card/60 backdrop-blur-sm border-border/80 shadow-2xs hover:border-border transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground truncate">
                {card.title}
              </span>
              <div
                className={`w-7 h-7 rounded-lg ${card.bg} ${card.color} flex items-center justify-center shrink-0`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className={`text-xl sm:text-2xl font-bold mt-2 truncate ${card.color}`}>
              {isLoadingKPI || isLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                card.value?.toLocaleString("vi-VN") ?? 0
              )}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
              {card.subtext}
            </p>
          </Card>
        );
      })}
    </div>
  );
}

export default WarehousesKpiGrid;
