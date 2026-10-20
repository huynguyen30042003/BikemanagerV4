"use client";

import React, { useMemo } from "react";
import { Users, User, Building2, CheckCircle2, LucideIcon } from "lucide-react";
import { KpiRibbon, KpiItem, KpiTone } from "@/components/Common/KpiRibbon";

export interface CustomerKpiGridProps {
  totalKhachHang: number;
  totalCaNhan: number;
  totalToChuc: number;
  totalHoatDong: number;
  loaiFilter: string;
  setLoaiFilter: (loai: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  setPage: (page: number | ((prev: number) => number)) => void;
  isLoading: boolean;
  isLoadingKPI: boolean;
}

interface RawKpiDef {
  id: string;
  title: string;
  subtext: string;
  value: React.ReactNode;
  icon: LucideIcon;
  tone: KpiTone;
  compact?: boolean;
  isActive: boolean;
  onClick: () => void;
}

export const CustomerKpiGrid: React.FC<CustomerKpiGridProps> = ({
  totalKhachHang,
  totalCaNhan,
  totalToChuc,
  totalHoatDong,
  loaiFilter,
  setLoaiFilter,
  statusFilter,
  setStatusFilter,
  setPage,
  isLoading,
  isLoadingKPI,
}) => {
  // 1. Định nghĩa cấu hình 4 thẻ KPI khách hàng
  const kpiDefinitions: RawKpiDef[] = useMemo(
    () => [
      {
        id: "all",
        title: "Tổng số khách hàng",
        subtext: "Đăng ký trong toàn hệ thống",
        value: totalKhachHang.toLocaleString("vi-VN"),
        icon: Users,
        tone: "neutral",
        isActive: loaiFilter === "all" && statusFilter === "all",
        onClick: () => {
          setLoaiFilter("all");
          setStatusFilter("all");
          setPage(1);
        },
      },
      {
        id: "individual",
        title: "Khách hàng Cá nhân",
        subtext: "Người tiêu dùng cá nhân & mua lẻ",
        value: totalCaNhan.toLocaleString("vi-VN"),
        icon: User,
        tone: "blue",
        isActive: loaiFilter === "1",
        onClick: () => {
          setLoaiFilter("1");
          setPage(1);
        },
      },
      {
        id: "business",
        title: "Doanh nghiệp / Tổ chức",
        subtext: "Đối tác mua sỉ, công ty & đại lý",
        value: totalToChuc.toLocaleString("vi-VN"),
        icon: Building2,
        tone: "indigo",
        isActive: loaiFilter === "2",
        onClick: () => {
          setLoaiFilter("2");
          setPage(1);
        },
      },
      {
        id: "active",
        title: "Đang hoạt động",
        subtext: "Được phép tạo đơn & bảo dưỡng",
        value: totalHoatDong.toLocaleString("vi-VN"),
        icon: CheckCircle2,
        tone: "emerald",
        isActive: statusFilter === "active",
        onClick: () => {
          setStatusFilter("active");
          setPage(1);
        },
      },
    ],
    [
      totalKhachHang,
      totalCaNhan,
      totalToChuc,
      totalHoatDong,
      loaiFilter,
      statusFilter,
      setLoaiFilter,
      setStatusFilter,
      setPage,
    ]
  );

  // 2. Dùng .map() chuyển đổi sang KpiItem chuẩn để nạp vào KpiRibbon
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

  return <KpiRibbon items={kpiItems} isLoading={isLoadingKPI || isLoading} />;
};

