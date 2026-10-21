"use client";

import React, { useMemo } from "react";
import {
  Wrench,
  Clock,
  CheckCircle2,
  DollarSign,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import { KpiItem, KpiRibbon } from "@/components/Common/KpiRibbon";
import { SC_PhieuSuaChuaKPI } from "@/types/suaChua";

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

interface RepairTicketsKpiGridProps {
  kpi?: SC_PhieuSuaChuaKPI;
  isLoading?: boolean;
  statusFilter: number | null;
  onStatusFilterChange: (status: number | null) => void;
}

export function RepairTicketsKpiGrid({
  kpi,
  isLoading,
  statusFilter,
  onStatusFilterChange,
}: RepairTicketsKpiGridProps) {
  const kpiItems = useMemo<KpiItem[]>(
    () => [
      {
        title: "Tổng phiếu sửa chữa",
        value: kpi?.total_PhieuSuaChua ?? 0,
        subtext: "Xe đã tiếp nhận vào xưởng",
        icon: Wrench,
        onClick: () => onStatusFilterChange(null),
        isActive: statusFilter === null,
      },
      {
        title: "Đang xử lý",
        value: kpi?.total_DangXuLy ?? 0,
        subtext: "Đang khám, sửa, chờ phụ tùng",
        icon: Clock,
        tone: "amber",
      },
      {
        title: "Hoàn thành",
        value: kpi?.total_HoanThanh ?? 0,
        subtext: "Đã bàn giao xe cho khách",
        icon: CheckCircle2,
        tone: "emerald",
      },
      {
        title: "Doanh thu",
        value: formatCurrency(kpi?.total_DoanhThu),
        subtext: "Tổng giá trị phiếu sửa chữa",
        icon: DollarSign,
        tone: "blue",
        compact: true,
      },
      {
        title: "Đã thu",
        value: formatCurrency(kpi?.total_DaThanhToan),
        subtext: "Khách hàng đã thanh toán",
        icon: Wallet,
        tone: "emerald",
        compact: true,
      },
      {
        title: "Còn nợ",
        value: formatCurrency(kpi?.total_ConNo),
        subtext: `${kpi?.total_PhieuConNo ?? 0} phiếu chưa tất toán`,
        icon: AlertTriangle,
        tone: "rose",
        compact: true,
      },
    ],
    [kpi, statusFilter, onStatusFilterChange]
  );

  return <KpiRibbon isLoading={isLoading} items={kpiItems} />;
}
