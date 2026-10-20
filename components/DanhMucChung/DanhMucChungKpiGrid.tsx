"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { FolderTree, CheckCircle2, XCircle, Layers, LucideIcon } from "lucide-react";
import { KpiRibbon, KpiItem, KpiTone } from "@/components/Common/KpiRibbon";

export interface DanhMucChungKpiGridProps {
  totalDanhMucChung: number;
  totalHoatDong: number;
  totalNgungHoatDong: number;
  totalDanhMucChiTiet: number;
  statusFilter: string;
  onSelectStatus: (status: string) => void;
  isLoadingKPI: boolean;
  isLoading: boolean;
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

export const DanhMucChungKpiGrid: React.FC<DanhMucChungKpiGridProps> = ({
  totalDanhMucChung,
  totalHoatDong,
  totalNgungHoatDong,
  totalDanhMucChiTiet,
  statusFilter,
  onSelectStatus,
  isLoadingKPI,
  isLoading,
}) => {
  const router = useRouter();

  // 1. Cấu hình định nghĩa 4 thẻ KPI DMC
  const kpiDefinitions: RawKpiDef[] = useMemo(
    () => [
      {
        id: "all",
        title: "Tổng danh mục",
        subtext: "Trên toàn bộ hệ thống",
        value: totalDanhMucChung.toLocaleString("vi-VN"),
        icon: FolderTree,
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
        id: "child",
        title: "Mục con liên kết",
        subtext: "Nhấn để xem danh mục chi tiết",
        value: totalDanhMucChiTiet.toLocaleString("vi-VN"),
        icon: Layers,
        tone: "indigo",
        onClick: () => router.push("/admin/danhMucChiTiet"),
      },
    ],
    [
      totalDanhMucChung,
      totalHoatDong,
      totalNgungHoatDong,
      totalDanhMucChiTiet,
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
