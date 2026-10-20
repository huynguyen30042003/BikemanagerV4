"use client";

import React from "react";
import { Store, CheckCircle2, XCircle, LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DiaDiemKpiGridProps {
  totalDiaDiem: number;
  totalHoatDong: number;
  totalNgungHoatDong: number;
  showroomCount: number;
  statusFilter: string;
  tinhFilter: string | number;
  onSelectStatus: (status: string) => void;
  onResetTinh?: () => void;
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

export const DiaDiemKpiGrid: React.FC<DiaDiemKpiGridProps> = ({
  totalDiaDiem,
  totalHoatDong,
  totalNgungHoatDong,
  showroomCount,
  statusFilter,
  tinhFilter,
  onSelectStatus,
  onResetTinh,
  isLoadingKPI = false,
  isLoading = false,
}) => {
  const kpiConfigs: KpiItemConfig[] = [
    {
      id: "all",
      title: "Tổng số cơ sở",
      subTitle: "Toàn bộ mạng lưới phân phối",
      value: totalDiaDiem,
      icon: Store,
      colorClass: "text-foreground",
      iconBgClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      isActive: statusFilter === "all" && !tinhFilter,
      borderActiveClass:
        "border-blue-500/50 bg-blue-500/5 shadow-xs ring-2 ring-blue-500/10",
      isClickable: true,
      onClick: () => {
        onSelectStatus("all");
        onResetTinh?.();
      },
    },
    {
      id: "active",
      title: "Đang hoạt động",
      subTitle: "Mở cửa đón khách & xuất kho",
      value: totalHoatDong,
      icon: CheckCircle2,
      colorClass: "text-emerald-600 dark:text-emerald-400",
      iconBgClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      isActive: statusFilter === "active",
      borderActiveClass:
        "border-emerald-500/50 bg-emerald-500/5 shadow-xs ring-2 ring-emerald-500/10",
      isClickable: true,
      onClick: () => onSelectStatus("active"),
    },
    {
      id: "inactive",
      title: "Tạm đóng / Khóa",
      subTitle: "Bảo trì hoặc ngừng hoạt động",
      value: totalNgungHoatDong,
      icon: XCircle,
      colorClass: "text-slate-700 dark:text-slate-300",
      iconBgClass: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
      isActive: statusFilter === "inactive",
      borderActiveClass:
        "border-slate-500/50 bg-slate-500/5 shadow-xs ring-2 ring-slate-500/10",
      isClickable: true,
      onClick: () => onSelectStatus("inactive"),
    },
    {
      id: "showroom",
      title: "Showroom bán hàng",
      subTitle: "Điểm bán lẻ trực tiếp (trên trang)",
      value: showroomCount,
      icon: Store,
      colorClass: "text-indigo-600 dark:text-indigo-400",
      iconBgClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      isActive: false,
      borderActiveClass: "",
      isClickable: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
      {kpiConfigs.map((item) => {
        const IconComponent = item.icon;
        const isShowSkeleton = (isLoadingKPI && isLoading) || (item.id === "showroom" && isLoading);

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
              className={`mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold tracking-tight ${item.colorClass}`}
            >
              {isShowSkeleton ? (
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
