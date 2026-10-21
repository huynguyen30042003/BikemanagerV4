"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftRight, Clock, Truck, CheckCircle2 } from "lucide-react";
import { KHO_PhieuChuyenKhoKPI } from "@/types/phieuChuyenKho";

interface StockTransfersKpiGridProps {
  transferKpi?: KHO_PhieuChuyenKhoKPI;
  isLoading: boolean;
  totalCount: number;
  waitingCount: number;
  inTransitCount: number;
  completedCount: number;
}

export const StockTransfersKpiGrid: React.FC<StockTransfersKpiGridProps> = ({
  transferKpi,
  isLoading,
  totalCount,
  waitingCount,
  inTransitCount,
  completedCount,
}) => {
  const cards = [
    {
      title: "Tổng phiếu chuyển",
      value:
        transferKpi?.total_PhieuChuyenKho ??
        transferKpi?.totalPhieuChuyenKho ??
        totalCount,
      subtext: "Đã khởi tạo trong hệ thống",
      icon: ArrowLeftRight,
      color: "text-foreground",
      iconColor: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10 dark:bg-blue-500/15",
      border: "border-blue-500/20",
    },
    {
      title: "Chờ xuất kho",
      value:
        transferKpi?.total_ChoXuatKho ??
        transferKpi?.totalChoXuatKho ??
        waitingCount,
      subtext: "Chờ thủ kho xuất hàng",
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      iconColor: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10 dark:bg-amber-500/15",
      border: "border-amber-500/20",
    },
    {
      title: "Đang vận chuyển",
      value:
        transferKpi?.total_DangVanChuyen ??
        transferKpi?.totalDangVanChuyen ??
        inTransitCount,
      subtext: "Hàng đang đi trên đường",
      icon: Truck,
      color: "text-blue-600 dark:text-blue-400",
      iconColor: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10 dark:bg-blue-500/15",
      border: "border-blue-500/20",
    },
    {
      title: "Đã hoàn tất",
      value:
        transferKpi?.total_DaHoanTat ??
        transferKpi?.totalDaHoanTat ??
        completedCount,
      subtext: "Kho đích đã nhận đủ hàng",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
      border: "border-emerald-500/20",
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
                <Skeleton className="h-7 w-16" />
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
