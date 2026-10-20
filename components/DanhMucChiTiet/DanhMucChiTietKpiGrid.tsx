"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ListTree, CheckCircle2, XCircle, FolderTree, ArrowRight, LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface KpiItemConfig {
  id: string;
  label: string;
  value: number;
  subtext: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  valueColor: string;
  filterKey?: "all" | "active" | "inactive";
  activeBorderClass?: string;
  href?: string;
  isLoading?: boolean;
}

interface DanhMucChiTietKpiGridProps {
  totalDanhMucChiTiet: number;
  totalHoatDong: number;
  totalNgungHoatDong: number;
  totalDanhMucChung: number;
  statusFilter: string;
  onSelectStatus: (status: string) => void;
  isLoadingKPI: boolean;
  isLoading: boolean;
  isLoadingParent: boolean;
}

export const DanhMucChiTietKpiGrid: React.FC<DanhMucChiTietKpiGridProps> = ({
  totalDanhMucChiTiet,
  totalHoatDong,
  totalNgungHoatDong,
  totalDanhMucChung,
  statusFilter,
  onSelectStatus,
  isLoadingKPI,
  isLoading,
  isLoadingParent,
}) => {
  const isGlobalLoading = isLoadingKPI && isLoading;

  const kpiCards: KpiItemConfig[] = useMemo(
    () => [
      {
        id: "all",
        label: "Tổng mục chi tiết",
        value: totalDanhMucChiTiet,
        subtext: "Trên toàn bộ hệ thống",
        icon: ListTree,
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-600 dark:text-blue-400",
        valueColor: "text-foreground",
        filterKey: "all",
        activeBorderClass:
          "border-blue-500/50 bg-blue-500/5 shadow-xs ring-2 ring-blue-500/10",
        isLoading: isGlobalLoading,
      },
      {
        id: "active",
        label: "Đang hoạt động",
        value: totalHoatDong,
        subtext: "Sẵn sàng để gán dữ liệu",
        icon: CheckCircle2,
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        valueColor: "text-emerald-600 dark:text-emerald-400",
        filterKey: "active",
        activeBorderClass:
          "border-emerald-500/50 bg-emerald-500/5 shadow-xs ring-2 ring-emerald-500/10",
        isLoading: isGlobalLoading,
      },
      {
        id: "inactive",
        label: "Tạm ngưng / Khóa",
        value: totalNgungHoatDong,
        subtext: "Không thể chọn mới",
        icon: XCircle,
        iconBg: "bg-slate-500/10",
        iconColor: "text-slate-600 dark:text-slate-400",
        valueColor: "text-slate-700 dark:text-slate-300",
        filterKey: "inactive",
        activeBorderClass:
          "border-slate-500/50 bg-slate-500/5 shadow-xs ring-2 ring-slate-500/10",
        isLoading: isGlobalLoading,
      },
      {
        id: "parent",
        label: "Danh mục cha liên kết",
        value: totalDanhMucChung,
        subtext: "Nhóm danh mục dùng chung",
        icon: FolderTree,
        iconBg: "bg-purple-500/10",
        iconColor: "text-purple-600 dark:text-purple-400",
        valueColor: "text-purple-600 dark:text-purple-400",
        href: "/admin/danhMucChung",
        isLoading: isLoadingKPI && isLoadingParent,
      },
    ],
    [
      totalDanhMucChiTiet,
      totalHoatDong,
      totalNgungHoatDong,
      totalDanhMucChung,
      isGlobalLoading,
      isLoadingKPI,
      isLoadingParent,
    ]
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5">
      {kpiCards.map((card) => {
        const Icon = card.icon;
        const isFilter = Boolean(card.filterKey);
        const isSelected = card.filterKey && statusFilter === card.filterKey;

        const cardBody = (
          <Card
            onClick={() => {
              if (card.filterKey) {
                onSelectStatus(card.filterKey);
              }
            }}
            className={`p-3 sm:p-4 gap-0 rounded-xl border transition-all h-full flex flex-col justify-between ${
              isFilter ? "cursor-pointer" : ""
            } ${
              isSelected
                ? card.activeBorderClass
                : card.href
                ? "border-border/80 bg-card hover:border-purple-500/40 hover:bg-purple-500/5 hover:shadow-xs cursor-pointer"
                : "border-border/80 bg-card hover:border-border hover:shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] sm:text-xs font-medium text-muted-foreground truncate">
                {card.label}
              </span>
              <div
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0 transition-transform ${
                  card.href ? "group-hover/kpi:scale-105" : ""
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            <div
              className={`mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold ${card.valueColor} flex items-center justify-between`}
            >
              <span>
                {card.isLoading ? (
                  <Skeleton className="h-6 sm:h-7 w-14 sm:w-16" />
                ) : (
                  card.value
                )}
              </span>
              {card.href && (
                <ArrowRight className="w-4 h-4 text-purple-400 opacity-0 group-hover/kpi:opacity-100 group-hover/kpi:translate-x-1 transition-all" />
              )}
            </div>

            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-1 truncate">
              {card.subtext}
            </p>
          </Card>
        );

        if (card.href) {
          return (
            <Link
              key={card.id}
              href={card.href}
              className="block group/kpi"
              title="Nhấn để xem toàn bộ danh mục chung cha"
            >
              {cardBody}
            </Link>
          );
        }

        return <div key={card.id}>{cardBody}</div>;
      })}
    </div>
  );
};
