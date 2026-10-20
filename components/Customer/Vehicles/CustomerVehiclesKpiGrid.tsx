"use client";

import React from "react";
import {
  Bike,
  CheckCircle2,
  XCircle,
  Gauge,
  LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomerVehiclesKpiGridProps {
  totalPhuongTien: number;
  totalHoatDong: number;
  totalNgungHoatDong: number;
  totalKM: number;
  statusFilter: string;
  onSelectStatus: (status: string) => void;
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

export const CustomerVehiclesKpiGrid: React.FC<CustomerVehiclesKpiGridProps> = ({
  totalPhuongTien,
  totalHoatDong,
  totalNgungHoatDong,
  totalKM,
  statusFilter,
  onSelectStatus,
  isLoadingKPI = false,
  isLoading = false,
}) => {
  const isKpiLoading = isLoadingKPI || isLoading;

  const kpiConfigs: KpiItemConfig[] = [
    {
      id: "all",
      title: "Tổng số phương tiện",
      subTitle: "Toàn bộ phương tiện đăng ký",
      value: totalPhuongTien,
      icon: Bike,
      colorClass: "text-foreground",
      iconBgClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      isActive: statusFilter === "all",
      borderActiveClass:
        "border-blue-500/50 bg-blue-500/5 shadow-xs ring-2 ring-blue-500/10",
      isClickable: true,
      onClick: () => onSelectStatus("all"),
    },
    {
      id: "active",
      title: "Đang sử dụng",
      subTitle: "Sẵn sàng mang vào sửa chữa",
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
      title: "Đã chuyển nhượng / Hỏng",
      subTitle: "Ngưng hoạt động hoặc đã đổi chủ",
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
      id: "km",
      title: "Đã ghi nhận ODO",
      subTitle: "Phương tiện có số KM lưu hành",
      value: totalKM,
      icon: Gauge,
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
