"use client";

import React, { useMemo } from "react";
import { Users, User, Building2, CheckCircle2 } from "lucide-react";
import { KpiRibbon, KpiItem } from "@/components/Common/KpiRibbon";

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
  const kpiCards: KpiItem[] = useMemo(
    () => [
      {
        title: "Tổng số khách hàng",
        value: totalKhachHang,
        subtext: "Đăng ký trong toàn hệ thống",
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
        title: "Khách hàng Cá nhân",
        value: totalCaNhan,
        subtext: "Người tiêu dùng cá nhân & mua lẻ",
        icon: User,
        tone: "blue",
        isActive: loaiFilter === "1",
        onClick: () => {
          setLoaiFilter("1");
          setPage(1);
        },
      },
      {
        title: "Doanh nghiệp / Tổ chức",
        value: totalToChuc,
        subtext: "Đối tác mua sỉ, công ty & đại lý",
        icon: Building2,
        tone: "indigo",
        isActive: loaiFilter === "2",
        onClick: () => {
          setLoaiFilter("2");
          setPage(1);
        },
      },
      {
        title: "Đang hoạt động",
        value: totalHoatDong,
        subtext: "Được phép tạo đơn & bảo dưỡng",
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

  return <KpiRibbon items={kpiCards} isLoading={isLoadingKPI && isLoading} />;
};
