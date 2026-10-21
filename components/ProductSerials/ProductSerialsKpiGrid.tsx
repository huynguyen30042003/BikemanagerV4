"use client";

import React, { useMemo } from "react";
import {
  Barcode,
  CheckCircle2,
  Car,
  ShieldAlert,
  LucideIcon,
} from "lucide-react";
import { KpiRibbon, KpiItem, KpiTone } from "@/components/Common/KpiRibbon";

export interface ProductSerialsKpiGridProps {
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

  // 1. Cấu hình định nghĩa 4 thẻ KPI Serial
  const kpiDefinitions: RawKpiDef[] = useMemo(
    () => [
      {
        id: "total",
        title: "Tổng số Serial",
        subtext: "Mã định danh đã cấp",
        value: totalSoSerial.toLocaleString("vi-VN"),
        icon: Barcode,
        tone: "blue",
        isActive: statusFilter === null,
        onClick: onSelectTotal,
      },
      {
        id: "inStock",
        title: "Trong kho (Sẵn sàng)",
        subtext: "Sẵn sàng xuất bán",
        value: totalTrongKho.toLocaleString("vi-VN"),
        icon: CheckCircle2,
        tone: "emerald",
        isActive: statusFilter === 59 || statusFilter === 1,
        onClick: onSelectInStock,
      },
      {
        id: "sold",
        title: "Đã xuất bán",
        subtext: "Khách hàng đang lưu hành",
        value: totalDaXuatBan.toLocaleString("vi-VN"),
        icon: Car,
        tone: "blue",
        isActive: statusFilter === 61 || statusFilter === 2,
        onClick: onSelectSold,
      },
      {
        id: "maintenance",
        title: "Bảo hành / Xưởng",
        subtext: "Đang kiểm định & bảo dưỡng",
        value: totalBaoHanhXuong.toLocaleString("vi-VN"),
        icon: ShieldAlert,
        tone: "amber",
        isActive:
          statusFilter === 62 ||
          statusFilter === 63 ||
          statusFilter === 65,
        onClick: onSelectMaintenance,
      },
    ],
    [
      totalSoSerial,
      totalTrongKho,
      totalDaXuatBan,
      totalBaoHanhXuong,
      statusFilter,
      onSelectTotal,
      onSelectInStock,
      onSelectSold,
      onSelectMaintenance,
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
export default ProductSerialsKpiGrid;
