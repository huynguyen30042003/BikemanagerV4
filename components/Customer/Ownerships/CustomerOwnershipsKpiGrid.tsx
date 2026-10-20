"use client";

import React from "react";
import {
  History,
  CheckCircle2,
  ArrowRightLeft,
  Tag,
  LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomerOwnershipsKpiGridProps {
  totalLichSuSoHuu: number;
  totalChuSoHuuHienTai: number;
  totalSangTen: number;
  totalThuCuDoiMoi: number;
  lyDoFilter: string;
  onSelectLyDo: (lyDo: string) => void;
  isLoadingKPI?: boolean;
  isLoading?: boolean;
}

interface KpiItemConfig {
  id: string;
  title: string;
  subTitle: string;
  value: number;
  icon: LucideIcon;
  colorClass: string;
  iconBgClass: string;
  isActive: boolean;
  borderActiveClass: string;
  isClickable: boolean;
  onClick?: () => void;
}

export const CustomerOwnershipsKpiGrid: React.FC<CustomerOwnershipsKpiGridProps> = ({
  totalLichSuSoHuu,
  totalChuSoHuuHienTai,
  totalSangTen,
  totalThuCuDoiMoi,
  lyDoFilter,
  onSelectLyDo,
  isLoadingKPI = false,
  isLoading = false,
}) => {
  const isKpiLoading = isLoadingKPI || isLoading;

  const kpiConfigs: KpiItemConfig[] = [
    {
      id: "all",
      title: "Tổng số lượt sở hữu",
      subTitle: "Toàn bộ lịch sử sở hữu đã lưu",
      value: totalLichSuSoHuu,
      icon: History,
      colorClass: "text-foreground",
      iconBgClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      isActive: lyDoFilter === "all",
      borderActiveClass:
        "border-blue-500/50 bg-blue-500/5 shadow-xs ring-2 ring-blue-500/10",
      isClickable: true,
      onClick: () => onSelectLyDo("all"),
    },
    {
      id: "current",
      title: "Chủ sở hữu hiện tại",
      subTitle: "Các xe đang có người đứng tên",
      value: totalChuSoHuuHienTai,
      icon: CheckCircle2,
      colorClass: "text-emerald-600 dark:text-emerald-400",
      iconBgClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      isActive: false,
      borderActiveClass: "",
      isClickable: false,
    },
    {
      id: "transfer",
      title: "Lượt sang tên đổi chủ",
      subTitle: "Chuyển giao quyền sở hữu",
      value: totalSangTen,
      icon: ArrowRightLeft,
      colorClass: "text-indigo-600 dark:text-indigo-400",
      iconBgClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      isActive: lyDoFilter === "SangTen",
      borderActiveClass:
        "border-indigo-500/50 bg-indigo-500/5 shadow-xs ring-2 ring-indigo-500/10",
      isClickable: true,
      onClick: () => onSelectLyDo("SangTen"),
    },
    {
      id: "tradeIn",
      title: "Thu cũ đổi mới",
      subTitle: "Thu hồi xe cũ lên đời xe mới",
      value: totalThuCuDoiMoi,
      icon: Tag,
      colorClass: "text-amber-600 dark:text-amber-400",
      iconBgClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      isActive: lyDoFilter === "ThuCuDoiMoi",
      borderActiveClass:
        "border-amber-500/50 bg-amber-500/5 shadow-xs ring-2 ring-amber-500/10",
      isClickable: true,
      onClick: () => onSelectLyDo("ThuCuDoiMoi"),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
      {kpiConfigs.map((item) => {
        const IconComponent = item.icon;

        return (
          <Card
            key={item.id}
            onClick={item.onClick}
            className={`gap-0 p-3 sm:p-4 rounded-xl border transition-all ${
              item.isClickable ? "cursor-pointer" : "cursor-default"
            } ${
              item.isActive
                ? item.borderActiveClass
                : "border-border/80 bg-card hover:border-border hover:shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-medium text-muted-foreground line-clamp-1">
                {item.title}
              </span>
              <div
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0 ${item.iconBgClass}`}
              >
                <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            <div
              className={`mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold tracking-tight truncate ${item.colorClass}`}
            >
              {isKpiLoading ? (
                <Skeleton className="h-6 sm:h-7 w-12 sm:w-16" />
              ) : (
                item.value.toLocaleString("vi-VN")
              )}
            </div>

            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 sm:mt-1 line-clamp-1">
              {item.subTitle}
            </p>
          </Card>
        );
      })}
    </div>
  );
};
