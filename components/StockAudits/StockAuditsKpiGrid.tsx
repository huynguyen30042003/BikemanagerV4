"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardCheck, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { KHO_PhieuKiemKeKPI } from "@/types/phieuKiemKe";

interface StockAuditsKpiGridProps {
  auditKpi?: KHO_PhieuKiemKeKPI;
  isLoading: boolean;
  totalCount: number;
  inProgressCount: number;
  balancedCount: number;
  totalDiscrepancy: number;
}

export const StockAuditsKpiGrid: React.FC<StockAuditsKpiGridProps> = ({
  auditKpi,
  isLoading,
  totalCount,
  inProgressCount,
  balancedCount,
  totalDiscrepancy,
}) => {
  const cards = [
    {
      title: "Đợt kiểm kê",
      value:
        auditKpi?.total_PhieuKiemKe ??
        auditKpi?.totalPhieuKiemKe ??
        totalCount,
      subtext: "Biên bản đã lập",
      icon: ClipboardCheck,
      color: "text-foreground",
      iconColor: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10 dark:bg-blue-500/15",
      border: "border-blue-500/20",
    },
    {
      title: "Đang kiểm đếm",
      value:
        auditKpi?.total_DangKiemKe ??
        auditKpi?.totalDangKiemKe ??
        inProgressCount,
      subtext: "Chưa duyệt cân bằng kho",
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      iconColor: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10 dark:bg-amber-500/15",
      border: "border-amber-500/20",
    },
    {
      title: "Đã cân bằng",
      value:
        auditKpi?.total_DaCanBang ??
        auditKpi?.totalDaCanBang ??
        balancedCount,
      subtext: "Tồn kho đã điều chỉnh",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
      border: "border-emerald-500/20",
    },
    {
      title: "Tổng sai lệch SL",
      value:
        auditKpi?.total_TongSoLuongLech ??
        auditKpi?.totalTongSoLuongLech ??
        totalDiscrepancy,
      subtext: "Chênh lệch giữa đếm và sổ",
      icon: AlertTriangle,
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

            <div className={`text-xl sm:text-2xl font-bold font-mono tracking-tight mt-2 ${card.color}`}>
              {isLoading ? (
                <Skeleton className="h-7 w-16 rounded-md" />
              ) : (
                card.value.toLocaleString("vi-VN")
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
};
