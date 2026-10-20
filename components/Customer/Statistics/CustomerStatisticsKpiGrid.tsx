"use client";

import React from "react";
import {
  Award,
  Crown,
  CreditCard,
  DollarSign,
  AlertCircle,
  LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomerStatisticsKpiGridProps {
  totalThongKeKhachHang: number;
  totalHoiVienVip: number;
  totalTongTienDaChi: number;
  totalCongNoHienTai: number;
  totalKhachCoCongNo: number;
  tierFilter: string;
  onSelectTier: (tier: string) => void;
  isLoadingKPI?: boolean;
  isLoading?: boolean;
}

interface KpiItemConfig {
  id: string;
  title: string;
  subTitle: string;
  value: string | number;
  icon: LucideIcon;
  colorClass: string;
  iconBgClass: string;
  isActive: boolean;
  borderActiveClass: string;
  isClickable: boolean;
  isMonoFont?: boolean;
  onClick?: () => void;
}

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

export const CustomerStatisticsKpiGrid: React.FC<CustomerStatisticsKpiGridProps> = ({
  totalThongKeKhachHang,
  totalHoiVienVip,
  totalTongTienDaChi,
  totalCongNoHienTai,
  totalKhachCoCongNo,
  tierFilter,
  onSelectTier,
  isLoadingKPI = false,
  isLoading = false,
}) => {
  const isKpiLoading = isLoadingKPI || isLoading;

  const kpiConfigs: KpiItemConfig[] = [
    {
      id: "all",
      title: "Tổng hồ sơ tích lũy",
      subTitle: "Khách có dữ liệu giao dịch",
      value: totalThongKeKhachHang,
      icon: Award,
      colorClass: "text-foreground",
      iconBgClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      isActive: tierFilter === "all",
      borderActiveClass:
        "border-blue-500/50 bg-blue-500/5 shadow-xs ring-2 ring-blue-500/10",
      isClickable: true,
      onClick: () => onSelectTier("all"),
    },
    {
      id: "vip",
      title: "Hội viên VIP",
      subTitle: "Hạng Vàng & Kim Cương",
      value: totalHoiVienVip,
      icon: Crown,
      colorClass: "text-amber-600 dark:text-amber-400",
      iconBgClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      isActive: tierFilter === "Vang" || tierFilter === "KimCuong",
      borderActiveClass:
        "border-amber-500/50 bg-amber-500/5 shadow-xs ring-2 ring-amber-500/10",
      isClickable: true,
      onClick: () => onSelectTier("Vang"),
    },
    {
      id: "debtCustomers",
      title: "Khách có công nợ",
      subTitle:
        totalKhachCoCongNo > 0
          ? `${totalKhachCoCongNo} khách hàng nợ`
          : "Không có dư nợ nợ tồn",
      value: totalKhachCoCongNo,
      icon: AlertCircle,
      colorClass: "text-rose-600 dark:text-rose-400",
      iconBgClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      isActive: false,
      borderActiveClass: "",
      isClickable: false,
    },
    {
      id: "spent",
      title: "Tổng tiền đã chi",
      subTitle: "Doanh số chi tiêu toàn hệ thống",
      value: formatCurrency(totalTongTienDaChi),
      icon: DollarSign,
      colorClass: "text-emerald-600 dark:text-emerald-400",
      iconBgClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      isActive: false,
      borderActiveClass: "",
      isClickable: false,
      isMonoFont: true,
    },
    {
      id: "debt",
      title: "Tổng công nợ hiện tại",
      subTitle: "Dư nợ mua sỉ / nợ sửa chữa",
      value: formatCurrency(totalCongNoHienTai),
      icon: CreditCard,
      colorClass: "text-violet-600 dark:text-violet-400",
      iconBgClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
      isActive: false,
      borderActiveClass: "",
      isClickable: false,
      isMonoFont: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
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
              className={`mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold tracking-tight truncate ${
                item.colorClass
              } ${item.isMonoFont ? "font-mono text-lg sm:text-xl" : ""}`}
            >
              {isKpiLoading ? (
                <Skeleton className="h-6 sm:h-7 w-14 sm:w-20" />
              ) : typeof item.value === "number" ? (
                item.value.toLocaleString("vi-VN")
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
