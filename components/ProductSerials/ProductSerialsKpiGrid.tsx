"use client";

import React from "react";
import {
  Barcode,
  CheckCircle2,
  Car,
  ShieldAlert,
  LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductSerialsKpiGridProps {
  totalSoSerial: number;
  totalTrongKho: number;
  totalDaXuatBan: number;
  totalBaoHanhXuong: number;
  statusFilter: number | null;
  onSelectTotal: () => void;
  onSelectInStock: () => void;
  onSelectSold: () => void;
  onSelectMaintenance: () => void;
  isLoadingKPI?: boolean;
  isLoading?: boolean;
}

interface KpiItemConfig {
  id: string;
  title: string;
  subTitle: string;
  value: React.ReactNode;
  icon: LucideIcon;
  colorClass: string;
  iconBgClass: string;
  isActive: boolean;
  borderActiveClass: string;
  isClickable: boolean;
  onClick?: () => void;
}

export const ProductSerialsKpiGrid: React.FC<ProductSerialsKpiGridProps> = ({
  totalSoSerial,
  totalTrongKho,
  totalDaXuatBan,
  totalBaoHanhXuong,
  statusFilter,
  onSelectTotal,
  onSelectInStock,
  onSelectSold,
  onSelectMaintenance,
  isLoadingKPI = false,
  isLoading = false,
}) => {
  const isKpiLoading = isLoadingKPI || isLoading;

  const kpiConfigs: KpiItemConfig[] = [
    {
      id: "total",
      title: "Tổng số Serial",
      subTitle: "Mã định danh đã cấp",
      value: totalSoSerial.toLocaleString("vi-VN"),
      icon: Barcode,
      colorClass: "text-foreground",
      iconBgClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      isActive: statusFilter === null,
      borderActiveClass:
        "border-blue-500/50 bg-blue-500/5 shadow-xs ring-2 ring-blue-500/10",
      isClickable: true,
      onClick: onSelectTotal,
    },
    {
      id: "inStock",
      title: "Trong kho (Sẵn sàng)",
      subTitle: "Sẵn sàng xuất bán",
      value: totalTrongKho.toLocaleString("vi-VN"),
      icon: CheckCircle2,
      colorClass: "text-emerald-600 dark:text-emerald-400",
      iconBgClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      isActive: statusFilter === 59 || statusFilter === 1,
      borderActiveClass:
        "border-emerald-500/50 bg-emerald-500/5 shadow-xs ring-2 ring-emerald-500/10",
      isClickable: true,
      onClick: onSelectInStock,
    },
    {
      id: "sold",
      title: "Đã xuất bán",
      subTitle: "Khách hàng đang lưu hành",
      value: totalDaXuatBan.toLocaleString("vi-VN"),
      icon: Car,
      colorClass: "text-blue-600 dark:text-blue-400",
      iconBgClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      isActive: statusFilter === 61 || statusFilter === 2,
      borderActiveClass:
        "border-blue-500/50 bg-blue-500/5 shadow-xs ring-2 ring-blue-500/10",
      isClickable: true,
      onClick: onSelectSold,
    },
    {
      id: "maintenance",
      title: "Bảo hành / Xưởng",
      subTitle: "Đang sửa chữa hoặc lỗi",
      value: totalBaoHanhXuong.toLocaleString("vi-VN"),
      icon: ShieldAlert,
      colorClass: "text-amber-600 dark:text-amber-400",
      iconBgClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      isActive:
        statusFilter === 62 ||
        statusFilter === 63 ||
        statusFilter === 3 ||
        statusFilter === 4,
      borderActiveClass:
        "border-amber-500/50 bg-amber-500/5 shadow-xs ring-2 ring-amber-500/10",
      isClickable: true,
      onClick: onSelectMaintenance,
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
                item.value
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
