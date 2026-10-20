"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ListTree, CheckCircle2, XCircle, FolderTree, LucideIcon } from "lucide-react";
import { KpiRibbon, KpiItem, KpiTone } from "@/components/Common/KpiRibbon";

export interface DanhMucChiTietKpiGridProps {
  totalDanhMucChiTiet: number;
  totalHoatDong: number;
  totalNgungHoatDong: number;
  totalDanhMucChung: number;
  statusFilter: string;
  onSelectStatus: (status: string) => void;
  isLoadingKPI: boolean;
  isLoading: boolean;
  isLoadingParent: boolean;
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

export const DanhMucChiTietKpiGrid: React.FC<DanhMucChiTietKpiGridProps> = ({
  totalDanhMucChiTiet,
  totalHoatDong,
  totalNgungHoatDong,
  totalDanhMucChung,
  statusFilter,
  onSelectStatus,
  isLoadingKPI,
  isLoading,
  isLoadingParent: _isLoadingParent,
}) => {
  const router = useRouter();

  // 1. Cấu hình định nghĩa 4 thẻ KPI DMCT
  const kpiDefinitions: RawKpiDef[] = useMemo(
    () => [
      {
        id: "all",
        title: "Tổng mục chi tiết",
        subtext: "Trên toàn bộ hệ thống",
        value: totalDanhMucChiTiet.toLocaleString("vi-VN"),
        icon: ListTree,
        tone: "neutral",
        isActive: statusFilter === "all",
        onClick: () => onSelectStatus("all"),
      },
      {
        id: "active",
        title: "Đang hoạt động",
        subtext: "Sẵn sàng để gán dữ liệu",
        value: totalHoatDong.toLocaleString("vi-VN"),
        icon: CheckCircle2,
        tone: "emerald",
        isActive: statusFilter === "active",
        onClick: () => onSelectStatus("active"),
      },
      {
        id: "inactive",
        title: "Tạm ngưng / Khóa",
        subtext: "Không thể chọn mới",
        value: totalNgungHoatDong.toLocaleString("vi-VN"),
        icon: XCircle,
        tone: "rose",
        isActive: statusFilter === "inactive",
        onClick: () => onSelectStatus("inactive"),
      },
      {
        id: "parent",
        title: "Danh mục cha liên kết",
        subtext: "Nhấn để xem danh mục dùng chung",
        value: totalDanhMucChung.toLocaleString("vi-VN"),
        icon: FolderTree,
        tone: "indigo",
        onClick: () => router.push("/admin/danhMucChung"),
      },
    ],
    [
      totalDanhMucChiTiet,
      totalHoatDong,
      totalNgungHoatDong,
      totalDanhMucChung,
      statusFilter,
      onSelectStatus,
      router,
    ]
  );

  // 2. Dùng .map() chuyển đổi sang KpiItem chuẩn để tái sử dụng KpiRibbon
  const kpiItems: KpiItem[] = useMemo(
    () =>
      kpiDefinitions.map((def) => ({
        title: def.title,
        value: def.value,
        subtext: def.subtext,
        icon: def.icon,
        tone: def.tone,
        compact: def.compact,
        isActive: def.isActive,
        onClick: def.onClick,
      })),
    [kpiDefinitions]
  );

  return (
    <KpiRibbon
      items={kpiItems}
      isLoading={isLoadingKPI || isLoading}
    />
  );
};

