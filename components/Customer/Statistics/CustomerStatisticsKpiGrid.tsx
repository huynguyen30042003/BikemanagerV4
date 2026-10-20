"use client";

import React, { useMemo } from "react";
import {
  Award,
  Crown,
  CreditCard,
  DollarSign,
  AlertCircle,
  LucideIcon,
} from "lucide-react";
import { KpiRibbon, KpiItem, KpiTone } from "@/components/Common/KpiRibbon";

export interface CustomerStatisticsKpiGridProps {
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

interface RawKpiDef {
  id: string;
  title: string;
  subtext: string;
  value: React.ReactNode;
  icon: LucideIcon;
  tone: KpiTone;
  compact?: boolean;
  isClickable: boolean;
  filterValue?: string;
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
  // 1. Định nghĩa cấu hình 5 thẻ KPI chuẩn
  const kpiDefinitions: RawKpiDef[] = useMemo(
    () => [
      {
        id: "all",
        title: "Tổng hồ sơ tích lũy",
        subtext: "Khách có dữ liệu giao dịch",
        value: totalThongKeKhachHang.toLocaleString("vi-VN"),
        icon: Award,
        tone: "neutral",
        isClickable: true,
        filterValue: "all",
      },
      {
        id: "vip",
        title: "Hội viên VIP",
        subtext: "Hạng Vàng & Kim Cương",
        value: totalHoiVienVip.toLocaleString("vi-VN"),
        icon: Crown,
        tone: "amber",
        isClickable: true,
        filterValue: "Vang",
      },
      {
        id: "debtCustomers",
        title: "Khách có công nợ",
        subtext:
          totalKhachCoCongNo > 0
            ? `${totalKhachCoCongNo} khách hàng nợ`
            : "Không có dư nợ tồn",
        value: totalKhachCoCongNo.toLocaleString("vi-VN"),
        icon: AlertCircle,
        tone: "rose",
        isClickable: false,
      },
      {
        id: "spent",
        title: "Tổng tiền đã chi",
        subtext: "Doanh số chi tiêu toàn hệ thống",
        value: formatCurrency(totalTongTienDaChi),
        icon: DollarSign,
        tone: "emerald",
        compact: true,
        isClickable: false,
      },
      {
        id: "debt",
        title: "Tổng công nợ hiện tại",
        subtext: "Dư nợ mua sỉ / nợ sửa chữa",
        value: formatCurrency(totalCongNoHienTai),
        icon: CreditCard,
        tone: "indigo",
        compact: true,
        isClickable: false,
      },
    ],
    [
      totalThongKeKhachHang,
      totalHoiVienVip,
      totalTongTienDaChi,
      totalCongNoHienTai,
      totalKhachCoCongNo,
    ]
  );

  // 2. Dùng .map() chuyển đổi sang KpiItem chuẩn để tái sử dụng KpiRibbon
  const kpiItems: KpiItem[] = useMemo(
    () =>
      kpiDefinitions.map((def) => {
        const isActive =
          def.filterValue === "all"
            ? tierFilter === "all"
            : def.filterValue === "Vang"
            ? tierFilter === "Vang" || tierFilter === "KimCuong"
            : false;

        return {
          title: def.title,
          value: def.value,
          subtext: def.subtext,
          icon: def.icon,
          tone: def.tone,
          compact: def.compact,
          isActive,
          onClick:
            def.isClickable && def.filterValue
              ? () => onSelectTier(def.filterValue!)
              : undefined,
        };
      }),
    [kpiDefinitions, tierFilter, onSelectTier]
  );

  return (
    <KpiRibbon
      items={kpiItems}
      isLoading={isLoadingKPI || isLoading}
    />
  );
};
