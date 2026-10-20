"use client";

import React, { useMemo } from "react";
import {
  History,
  CheckCircle2,
  ArrowRightLeft,
  Tag,
  LucideIcon,
} from "lucide-react";
import { KpiRibbon, KpiItem, KpiTone } from "@/components/Common/KpiRibbon";

export interface CustomerOwnershipsKpiGridProps {
  totalLichSuSoHuu: number;
  totalChuSoHuuHienTai: number;
  totalSangTen: number;
  totalThuCuDoiMoi: number;
  lyDoFilter: string;
  onSelectLyDo: (lyDo: string) => void;
  isLoadingKPI?: boolean;
  isLoading?: boolean;
}

interface RawKpiDef {
  id: string;
  title: string;
  subtext: string;
  value: number;
  icon: LucideIcon;
  tone: KpiTone;
  isClickable: boolean;
  filterValue?: string;
}

export const CustomerOwnershipsKpiGrid: React.FC<CustomerOwnershipsKpiGridProps> = ({
  totalLichSuSoHuu,
  totalChuSoHuuHienTai,
  totalSangTen,
  totalThuCuDoiMoi,
  lyDoFilter,
  onSelectLyDo,
  isLoadingKPI = false,
  isLoading = false,
}) => {
  // 1. Định nghĩa cấu hình các thẻ KPI theo chuẩn dữ liệu
  const kpiDefinitions: RawKpiDef[] = useMemo(
    () => [
      {
        id: "all",
        title: "Tổng số lượt sở hữu",
        subtext: "Toàn bộ lịch sử sở hữu đã lưu",
        value: totalLichSuSoHuu,
        icon: History,
        tone: "neutral",
        isClickable: true,
        filterValue: "all",
      },
      {
        id: "current",
        title: "Chủ sở hữu hiện tại",
        subtext: "Các xe đang có người đứng tên",
        value: totalChuSoHuuHienTai,
        icon: CheckCircle2,
        tone: "emerald",
        isClickable: false,
      },
      {
        id: "transfer",
        title: "Lượt sang tên đổi chủ",
        subtext: "Chuyển giao quyền sở hữu",
        value: totalSangTen,
        icon: ArrowRightLeft,
        tone: "indigo",
        isClickable: true,
        filterValue: "SangTen",
      },
      {
        id: "tradeIn",
        title: "Thu cũ đổi mới",
        subtext: "Thu hồi xe cũ lên đời xe mới",
        value: totalThuCuDoiMoi,
        icon: Tag,
        tone: "amber",
        isClickable: true,
        filterValue: "ThuCuDoiMoi",
      },
    ],
    [totalLichSuSoHuu, totalChuSoHuuHienTai, totalSangTen, totalThuCuDoiMoi]
  );

  // 2. Dùng .map() chuyển đổi sang KpiItem chuẩn để tái sử dụng KpiRibbon
  const kpiItems: KpiItem[] = useMemo(
    () =>
      kpiDefinitions.map((def) => ({
        title: def.title,
        value: def.value.toLocaleString("vi-VN"),
        subtext: def.subtext,
        icon: def.icon,
        tone: def.tone,
        isActive: def.filterValue ? lyDoFilter === def.filterValue : false,
        onClick:
          def.isClickable && def.filterValue
            ? () => onSelectLyDo(def.filterValue!)
            : undefined,
      })),
    [kpiDefinitions, lyDoFilter, onSelectLyDo]
  );

  return (
    <KpiRibbon
      items={kpiItems}
      isLoading={isLoadingKPI || isLoading}
    />
  );
};
