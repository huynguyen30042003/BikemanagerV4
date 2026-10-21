"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Layers, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { KHO_TonKhoKPI } from "@/types/tonKho";

interface OpeningStockKpiGridProps {
  kpiData?: KHO_TonKhoKPI;
  isLoading: boolean;
  totalItems: number;
}

export const OpeningStockKpiGrid: React.FC<OpeningStockKpiGridProps> = ({
  kpiData,
  isLoading,
  totalItems,
}) => {
  const cards = [
    {
      title: "Mặt hàng tồn kho",
      value:
        kpiData?.total_TonKho ??
        kpiData?.totalTonKho ??
        totalItems,
      subtext: "Đã có dữ liệu tồn trong hệ thống",
      icon: Layers,
      color: "text-foreground",
      iconColor: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10 dark:bg-blue-500/15",
      border: "border-blue-500/20",
    },
    {
      title: "Tổng tồn khả dụng",
      value:
        kpiData?.total_TonKhaDung ??
        kpiData?.totalTonKhaDung ??
        0,
      subtext: "Sẵn sàng giao dịch & xuất kho",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
      border: "border-emerald-500/20",
    },
    {
      title: "Cận định mức (Sắp hết)",
      value:
        kpiData?.total_SapHetHang ??
        kpiData?.totalSapHetHang ??
        0,
      subtext: "Dưới ngưỡng số lượng tối thiểu",
      icon: AlertTriangle,
      color: "text-amber-600 dark:text-amber-400",
      iconColor: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10 dark:bg-amber-500/15",
      border: "border-amber-500/20",
    },
    {
      title: "Hết hàng (Tồn = 0)",
      value:
        kpiData?.total_HetHang ??
        kpiData?.totalHetHang ??
        0,
      subtext: "Cần bổ sung tồn kho ngay",
      icon: XCircle,
      color: "text-rose-600 dark:text-rose-400",
      iconColor: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10 dark:bg-rose-500/15",
      border: "border-rose-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card
            key={idx}
            className="p-3.5 sm:p-4 rounded-xl bg-card border border-border/80 shadow-xs hover:border-border transition-all duration-200"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground truncate">
                {card.title}
              </span>
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${card.bg} ${card.iconColor} border ${card.border} flex items-center justify-center shrink-0`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            <div className="mt-2 flex items-baseline gap-1.5">
              {isLoading ? (
                <Skeleton className="h-7 w-16 rounded-md" />
              ) : (
                <span className={`text-xl sm:text-2xl font-bold font-mono tracking-tight ${card.color}`}>
                  {typeof card.value === "number"
                    ? card.value.toLocaleString("vi-VN")
                    : card.value}
                </span>
              )}
            </div>

            <p className="text-[11px] text-muted-foreground/80 mt-1 truncate">
              {card.subtext}
            </p>
          </Card>
        );
      })}
    </div>
  );
};
