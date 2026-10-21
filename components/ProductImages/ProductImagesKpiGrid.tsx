"use client";

import React, { useMemo } from "react";
import { ImageIcon, Star, Boxes, Package, LucideIcon } from "lucide-react";
import { KpiRibbon, KpiItem, KpiTone } from "@/components/Common/KpiRibbon";

export interface ProductImagesKpiGridProps {
  totalHinhAnhSanPham: number;
  totalAnhDaiDien: number;
  totalAnhBienThe: number;
  totalAnhChung: number;
  selectedBienTheId?: string;
  onSelectTotal?: () => void;
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

  // 1. Cấu hình định nghĩa 4 thẻ KPI hình ảnh sản phẩm
  const kpiDefinitions: RawKpiDef[] = useMemo(
    () => [
      {
        id: "total",
        title: "Tổng số hình ảnh",
        subtext: "Bộ sưu tập gallery toàn hệ thống",
        value: totalHinhAnhSanPham.toLocaleString("vi-VN"),
        icon: ImageIcon,
        tone: "blue",
        isActive: !selectedBienTheId,
        onClick: onSelectTotal,
      },
      {
        id: "cover",
        title: "Ảnh đại diện (Cover)",
        subtext: "Hiển thị chính tại danh mục xe",
        value: totalAnhDaiDien.toLocaleString("vi-VN"),
        icon: Star,
        tone: "amber",
        isActive: false,
      },
      {
        id: "variant",
        title: "Ảnh theo biến thể màu",
        subtext: "Gán riêng cho từng mã SKU xe",
        value: totalAnhBienThe.toLocaleString("vi-VN"),
        icon: Boxes,
        tone: "indigo",
        isActive: Boolean(selectedBienTheId),
      },
      {
        id: "general",
        title: "Ảnh chung dòng xe",
        subtext: "Khung xe, đồng hồ, phụ tùng chung",
        value: totalAnhChung.toLocaleString("vi-VN"),
        icon: Package,
        tone: "emerald",
        isActive: false,
      },
    ],
    [
      totalHinhAnhSanPham,
      totalAnhDaiDien,
      totalAnhBienThe,
      totalAnhChung,
      selectedBienTheId,
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
        isActive: kpi.isActive,
        onClick: kpi.onClick,
      })),
    [kpiDefinitions]
  );

  return <KpiRibbon items={kpiItems} isLoading={isKpiLoading} />;
};
export default ProductImagesKpiGrid;
