"use client";

import React, { useMemo } from "react";
import { Package, Bike, ShoppingBag, CheckCircle2, LucideIcon } from "lucide-react";
import { KpiRibbon, KpiItem, KpiTone } from "@/components/Common/KpiRibbon";

export interface ProductsKpiGridProps {
  totalSanPham: number;
  totalLaPhuongTien: number;
  totalDaXuatBan: number;
  totalHoatDong: number;
  statusFilter: string;
  brandFilter: string;
  categoryFilter: string | number;
  onSelectTotal: () => void;
  onSelectActive: () => void;
  isLoadingKPI?: boolean;
  isLoading?: boolean;
}

interface RawKpiDef {
  id: string;
  title: string;
  subtext: string;
  value: React.ReactNode;
  icon: LucideIcon;
  tone: KpiTone;
  isActive?: boolean;
  onClick?: () => void;
}

export const ProductsKpiGrid: React.FC<ProductsKpiGridProps> = ({
  totalSanPham,
  totalLaPhuongTien,
  totalDaXuatBan,
  totalHoatDong,
  statusFilter,
  brandFilter,
  categoryFilter,
  onSelectTotal,
  onSelectActive,
  isLoadingKPI = false,
  isLoading = false,
}) => {
  const isKpiLoading = isLoadingKPI || isLoading;

  const isTotalActive = !brandFilter && !categoryFilter && statusFilter === "all";
  const isActiveStatusActive = statusFilter === "active";

  // 1. Cấu hình định nghĩa 4 thẻ KPI Dòng sản phẩm
  const kpiDefinitions: RawKpiDef[] = useMemo(
    () => [
      {
        id: "total",
        title: "Tổng số dòng sản phẩm",
        subtext: "Đăng ký trong toàn hệ thống",
        value: totalSanPham.toLocaleString("vi-VN"),
        icon: Package,
        tone: "blue",
        isActive: isTotalActive,
        onClick: onSelectTotal,
      },
      {
        id: "vehicle",
        title: "Dòng xe nguyên chiếc",
        subtext: "Tự động sinh hồ sơ phương tiện",
        value: totalLaPhuongTien.toLocaleString("vi-VN"),
        icon: Bike,
        tone: "indigo",
        isActive: false,
      },
      {
        id: "published",
        title: "Niêm yết bán POS",
        subtext: "Cho phép xuất bán tại quầy",
        value: totalDaXuatBan.toLocaleString("vi-VN"),
        icon: ShoppingBag,
        tone: "amber",
        isActive: false,
      },
      {
        id: "active",
        title: "Đang kinh doanh",
        subtext: "Sản phẩm đang lưu hành",
        value: totalHoatDong.toLocaleString("vi-VN"),
        icon: CheckCircle2,
        tone: "emerald",
        isActive: isActiveStatusActive,
        onClick: onSelectActive,
      },
    ],
    [
      totalSanPham,
      totalLaPhuongTien,
      totalDaXuatBan,
      totalHoatDong,
      isTotalActive,
      isActiveStatusActive,
      onSelectTotal,
      onSelectActive,
    ]
  );

  // 2. Chuyển đổi sang định dạng KpiItem[] chuẩn của KpiRibbon bằng .map()
  const kpiItems: KpiItem[] = useMemo(
    () =>
      kpiDefinitions.map((kpi) => ({
        title: kpi.title,
        value: kpi.value,
        subtext: kpi.subtext,
        icon: kpi.icon,
        tone: kpi.tone,
        isActive: kpi.isActive,
        onClick: kpi.onClick,
      })),
    [kpiDefinitions]
  );

  return <KpiRibbon items={kpiItems} isLoading={isKpiLoading} />;
};
export default ProductsKpiGrid;
