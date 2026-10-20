"use client";

import React from "react";
import { Tags, CheckCircle2, XCircle, Globe, LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface BrandsKpiGridProps {
  totalThuongHieu: number;
  totalHoatDong: number;
  totalNgungHoatDong: number;
  totalXuatXuQuocTe: number;
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

export const BrandsKpiGrid: React.FC<BrandsKpiGridProps> = ({
  totalThuongHieu,
  totalHoatDong,
  totalNgungHoatDong,
  totalXuatXuQuocTe,
  statusFilter,
  onSelectStatus,
  isLoadingKPI = false,
  isLoading = false,
}) => {
  const isKpiLoading = isLoadingKPI || isLoading;

  const kpiConfigs: KpiItemConfig[] = [
    {
      id: "all",
      title: "Tổng số thương hiệu",
      subTitle: "Khai báo trong toàn hệ thống",
      value: totalThuongHieu,
      icon: Tags,
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
      title: "Đang áp dụng",
      subTitle: "Sẵn sàng liên kết khi tạo xe",
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
      title: "Tạm ngừng / Lưu trữ",
      subTitle: "Không xuất hiện trên bộ lọc khách",
      value: totalNgungHoatDong,
      icon: XCircle,
      colorClass: "text-zinc-600 dark:text-zinc-400",
      iconBgClass: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
      isActive: statusFilter === "inactive",
      borderActiveClass:
        "border-zinc-500/50 bg-zinc-500/5 shadow-xs ring-2 ring-zinc-500/10",
      isClickable: true,
      onClick: () => onSelectStatus("inactive"),
    },
    {
      id: "global",
      title: "Xuất xứ quốc tế",
      subTitle: "Đã liên kết quốc gia xuất xứ",
      value: totalXuatXuQuocTe,
      icon: Globe,
      colorClass: "text-blue-600 dark:text-blue-400",
      iconBgClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
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
