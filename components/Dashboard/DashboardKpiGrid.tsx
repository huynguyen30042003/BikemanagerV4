"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Layers,
  Wrench,
  Truck,
  Users,
  ChevronRight,
  LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardKPI } from "@/types/dashboard";
import { formatCurrency } from "./dashboardUtils";

interface KpiCardConfig {
  id: string;
  title: string;
  icon: LucideIcon;
  iconBgClass: string;
  iconColorClass: string;
  gradientClass: string;
  value: React.ReactNode;
  valueColorClass?: string;
  subText: React.ReactNode;
  footer: React.ReactNode;
}

interface DashboardKpiGridProps {
  kpi?: DashboardKPI | null;
  isLoading: boolean;
}

export function DashboardKpiGrid({ kpi, isLoading }: DashboardKpiGridProps) {
  // Cấu hình danh sách 6 KPI Cards để render qua hàm .map()
  const kpiCards: KpiCardConfig[] = useMemo(
    () => [
      {
        id: "doanh-thu",
        title: "Tổng Doanh Thu",
        icon: DollarSign,
        iconBgClass: "bg-blue-500/10",
        iconColorClass: "text-blue-600 dark:text-blue-400",
        gradientClass: "from-card to-blue-500/5 hover:border-blue-500/30",
        value: formatCurrency(kpi?.tongDoanhThu),
        valueColorClass: "text-foreground",
        subText: (
          <span>
            Hôm nay:{" "}
            <strong className="text-emerald-600 dark:text-emerald-400">
              {formatCurrency(kpi?.doanhThuHomNay)}
            </strong>
          </span>
        ),
        footer: (
          <div className="w-full flex items-center justify-between">
            <span className="truncate">Tháng này: {formatCurrency(kpi?.doanhThuThangNay)}</span>
          </div>
        ),
      },
      {
        id: "don-hang",
        title: "Đơn Bán Hàng",
        icon: ShoppingCart,
        iconBgClass: "bg-indigo-500/10",
        iconColorClass: "text-indigo-600 dark:text-indigo-400",
        gradientClass: "from-card to-indigo-500/5 hover:border-indigo-500/30",
        value: (
          <>
            {kpi?.tongDonHang || 0}{" "}
            <span className="text-xs font-normal text-muted-foreground">đơn</span>
          </>
        ),
        valueColorClass: "text-foreground",
        subText: (
          <span className="text-emerald-600 dark:text-emerald-400 font-medium truncate">
            +{kpi?.donHangHomNay || 0} đơn hôm nay
          </span>
        ),
        footer: (
          <div className="w-full flex items-center justify-between">
            <span className="text-amber-500 font-medium truncate">
              Chờ xử lý: {kpi?.donHangChoXuLy || 0}
            </span>
            <Link
              href="/admin/sales"
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 shrink-0"
            >
              Xem <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        ),
      },
      {
        id: "ton-kho",
        title: "Giá Trị Tồn Kho",
        icon: Layers,
        iconBgClass: "bg-emerald-500/10",
        iconColorClass: "text-emerald-600 dark:text-emerald-400",
        gradientClass: "from-card to-emerald-500/5 hover:border-emerald-500/30",
        value: formatCurrency(kpi?.tongGiaTriTonKho),
        valueColorClass: "text-emerald-600 dark:text-emerald-400",
        subText: (
          <span>
            Tổng tồn:{" "}
            <strong className="text-foreground">{kpi?.tongSoLuongTon || 0}</strong> sản phẩm
          </span>
        ),
        footer: (
          <div className="w-full flex items-center justify-between">
            <span className="text-rose-500 font-medium truncate">
              Sắp hết: {kpi?.soMatHangSapHet || 0} SKU
            </span>
            <Link
              href="/admin/inventory"
              className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 shrink-0"
            >
              Kho <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        ),
      },
      {
        id: "dich-vu",
        title: "Xưởng Dịch Vụ",
        icon: Wrench,
        iconBgClass: "bg-amber-500/10",
        iconColorClass: "text-amber-600 dark:text-amber-400",
        gradientClass: "from-card to-amber-500/5 hover:border-amber-500/30",
        value: (
          <>
            {kpi?.soPhieuSuaChuaDangXuLy || 0}{" "}
            <span className="text-xs font-normal text-muted-foreground">xe đang sửa</span>
          </>
        ),
        valueColorClass: "text-amber-600 dark:text-amber-400",
        subText: (
          <span className="truncate">
            Bảo hành:{" "}
            <strong className="text-blue-500">
              {kpi?.soPhieuBaoHanhDangXuLy || 0} phiếu
            </strong>
          </span>
        ),
        footer: (
          <div className="w-full flex items-center justify-between gap-1">
            <Link
              href="/admin/repair-tickets"
              className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5 truncate"
            >
              Sửa chữa <ChevronRight className="w-3 h-3 shrink-0" />
            </Link>
            <Link
              href="/admin/warranties"
              className="text-blue-500 hover:underline shrink-0"
            >
              Bảo hành
            </Link>
          </div>
        ),
      },
      {
        id: "chi-phi-nhap",
        title: "Chi Phí Nhập Hàng",
        icon: Truck,
        iconBgClass: "bg-rose-500/10",
        iconColorClass: "text-rose-600 dark:text-rose-400",
        gradientClass: "from-card to-rose-500/5 hover:border-rose-500/30",
        value: formatCurrency(kpi?.tongChiPhiNhapHang),
        valueColorClass: "text-rose-600 dark:text-rose-400",
        subText: <span className="truncate">Nhập xe & linh kiện từ NCC</span>,
        footer: (
          <div className="w-full flex items-center justify-between">
            <Link
              href="/admin/purchase-orders"
              className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5"
            >
              Đơn nhập hàng <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        ),
      },
      {
        id: "khach-hang",
        title: "Khách Hàng",
        icon: Users,
        iconBgClass: "bg-purple-500/10",
        iconColorClass: "text-purple-600 dark:text-purple-400",
        gradientClass: "from-card to-purple-500/5 hover:border-purple-500/30",
        value: (
          <>
            {kpi?.tongKhachHang || 0}{" "}
            <span className="text-xs font-normal text-muted-foreground">khách</span>
          </>
        ),
        valueColorClass: "text-purple-600 dark:text-purple-400",
        subText: (
          <span className="text-emerald-600 dark:text-emerald-400 font-medium truncate">
            +{kpi?.khachHangMoiThangNay || 0} mới tháng này
          </span>
        ),
        footer: (
          <div className="w-full flex items-center justify-between">
            <Link
              href="/admin/customer"
              className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-0.5"
            >
              Danh sách KH <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        ),
      },
    ],
    [kpi]
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-3 lg:gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-3 lg:gap-4">
      {kpiCards.map((card) => {
        const IconComponent = card.icon;

        return (
          <Card
            key={card.id}
            className={`p-3 sm:p-4 border border-border/70 bg-gradient-to-br transition-all duration-300 shadow-xs relative overflow-hidden group flex flex-col justify-between ${card.gradientClass}`}
          >
            <div>
              <div className="flex items-center justify-between mb-1 sm:mb-2 gap-1">
                <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate mr-1">
                  {card.title}
                </span>
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 ${card.iconBgClass} ${card.iconColorClass}`}
                >
                  <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </div>

              <div
                className={`text-sm xs:text-base sm:text-lg lg:text-xl font-bold tracking-tight truncate ${
                  card.valueColorClass || "text-foreground"
                }`}
              >
                {card.value}
              </div>

              <div className="flex items-center gap-1 mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] text-muted-foreground truncate">
                {card.subText}
              </div>
            </div>

            <div className="mt-2.5 text-[10px] sm:text-[11px] text-muted-foreground pt-2 border-t border-border/50">
              {card.footer}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default DashboardKpiGrid;
