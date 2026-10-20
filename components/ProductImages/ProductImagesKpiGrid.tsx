"use client";

import React from "react";
import { ImageIcon, Star, Boxes, Package, LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductImagesKpiGridProps {
  totalHinhAnhSanPham: number;
  totalAnhDaiDien: number;
  totalAnhBienThe: number;
  totalAnhChung: number;
  selectedBienTheId?: string;
  onSelectTotal?: () => void;
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

export const ProductImagesKpiGrid: React.FC<ProductImagesKpiGridProps> = ({
  totalHinhAnhSanPham,
  totalAnhDaiDien,
  totalAnhBienThe,
  totalAnhChung,
  selectedBienTheId = "",
  onSelectTotal,
  isLoadingKPI = false,
  isLoading = false,
}) => {
  const isKpiLoading = isLoadingKPI || isLoading;

  const kpiConfigs: KpiItemConfig[] = [
    {
      id: "total",
      title: "Tổng số hình ảnh",
      subTitle: "Bộ sưu tập gallery toàn hệ thống",
      value: totalHinhAnhSanPham.toLocaleString("vi-VN"),
      icon: ImageIcon,
      colorClass: "text-foreground",
      iconBgClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      isActive: !selectedBienTheId,
      borderActiveClass:
        "border-blue-500/50 bg-blue-500/5 shadow-xs ring-2 ring-blue-500/10",
      isClickable: Boolean(onSelectTotal),
      onClick: onSelectTotal,
    },
    {
      id: "cover",
      title: "Ảnh đại diện (Cover)",
      subTitle: "Hiển thị chính tại danh mục xe",
      value: totalAnhDaiDien.toLocaleString("vi-VN"),
      icon: Star,
      colorClass: "text-amber-600 dark:text-amber-400",
      iconBgClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      isActive: false,
      borderActiveClass: "",
      isClickable: false,
    },
    {
      id: "variant",
      title: "Ảnh theo biến thể màu",
      subTitle: "Gán riêng cho từng mã SKU xe",
      value: totalAnhBienThe.toLocaleString("vi-VN"),
      icon: Boxes,
      colorClass: "text-indigo-600 dark:text-indigo-400",
      iconBgClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      isActive: Boolean(selectedBienTheId),
      borderActiveClass:
        "border-indigo-500/50 bg-indigo-500/5 shadow-xs ring-2 ring-indigo-500/10",
      isClickable: false,
    },
    {
      id: "general",
      title: "Ảnh chung dòng xe",
      subTitle: "Khung xe, đồng hồ, phụ tùng chung",
      value: totalAnhChung.toLocaleString("vi-VN"),
      icon: Package,
      colorClass: "text-emerald-600 dark:text-emerald-400",
      iconBgClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
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
