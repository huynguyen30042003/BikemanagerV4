"use client";

import React, { useMemo } from "react";
import { Boxes, Barcode, DollarSign, CheckCircle2, LucideIcon } from "lucide-react";
import { KpiRibbon, KpiItem, KpiTone } from "@/components/Common/KpiRibbon";

export function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

export interface ProductVariantsKpiGridProps {
  totalBienTheSanPham: number;
  totalQuanLyTheoSerial: number;
  totalGiaBanCaoNhat: number;
  totalHoatDong: number;
  sanPhamFilter: string;
  onSelectTotal: () => void;
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
  compact?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export const ProductVariantsKpiGrid: React.FC<ProductVariantsKpiGridProps> = ({
  totalBienTheSanPham,
  totalQuanLyTheoSerial,
  totalGiaBanCaoNhat,
  totalHoatDong,
  sanPhamFilter,
  onSelectTotal,
  isLoadingKPI = false,
  isLoading = false,
}) => {
  const isKpiLoading = isLoadingKPI || isLoading;

  // 1. Cấu hình định nghĩa 4 thẻ KPI Biến thể sản phẩm
  const kpiDefinitions: RawKpiDef[] = useMemo(
    () => [
      {
        id: "total",
        title: "Tổng số biến thể SKU",
        subtext: "Mã định danh bán lẻ & kho",
        value: totalBienTheSanPham.toLocaleString("vi-VN"),
        icon: Boxes,
        tone: "blue",
        isActive: !sanPhamFilter,
        onClick: onSelectTotal,
      },
      {
        id: "serial",
        title: "Quản lý theo Serial",
        subtext: "Bắt buộc truy vết khung/pin",
        value: totalQuanLyTheoSerial.toLocaleString("vi-VN"),
        icon: Barcode,
        tone: "indigo",
        isActive: false,
      },
      {
        id: "maxPrice",
        title: "Giá bán cao nhất",
        subtext: "Mức giá niêm yết tối đa",
        value: formatCurrency(totalGiaBanCaoNhat),
        icon: DollarSign,
        tone: "emerald",
        compact: true,
        isActive: false,
      },
      {
        id: "active",
        title: "Đang kinh doanh",
        subtext: "Sẵn sàng bán ra thị trường",
        value: totalHoatDong.toLocaleString("vi-VN"),
        icon: CheckCircle2,
        tone: "emerald",
        isActive: false,
      },
    ],
    [
      totalBienTheSanPham,
      totalQuanLyTheoSerial,
      totalGiaBanCaoNhat,
      totalHoatDong,
      sanPhamFilter,
      onSelectTotal,
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
        compact: kpi.compact,
        isActive: kpi.isActive,
        onClick: kpi.onClick,
      })),
    [kpiDefinitions]
  );

  return <KpiRibbon items={kpiItems} isLoading={isKpiLoading} />;
};
export default ProductVariantsKpiGrid;
