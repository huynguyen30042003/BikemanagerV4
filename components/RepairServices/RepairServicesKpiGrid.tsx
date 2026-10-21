"use client";

import React, { useMemo } from "react";
import {
  Sparkles,
  CheckCircle2,
  PauseCircle,
  Tag,
  DollarSign,
  Timer,
} from "lucide-react";
import { KpiItem, KpiRibbon } from "@/components/Common/KpiRibbon";
import { SC_DichVuKPI } from "@/types/suaChua";

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

interface RepairServicesKpiGridProps {
  kpi?: SC_DichVuKPI;
  isLoading?: boolean;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

export function RepairServicesKpiGrid({
  kpi,
  isLoading,
  statusFilter,
  onStatusFilterChange,
}: RepairServicesKpiGridProps) {
  const kpiItems = useMemo<KpiItem[]>(
    () => [
      {
        title: "Tổng dịch vụ",
        value: kpi?.total_DichVu ?? 0,
        subtext: "Hạng mục trong danh mục",
        icon: Sparkles,
        onClick: () => onStatusFilterChange("all"),
        isActive: statusFilter === "all",
      },
      {
        title: "Đang kinh doanh",
        value: kpi?.total_DangKinhDoanh ?? 0,
        subtext: "Áp dụng cho phiếu sửa chữa",
        icon: CheckCircle2,
        tone: "emerald",
        onClick: () => onStatusFilterChange("active"),
        isActive: statusFilter === "active",
      },
      {
        title: "Ngừng kinh doanh",
        value: kpi?.total_NgungKinhDoanh ?? 0,
        subtext: "Đã ẩn khỏi danh sách chọn",
        icon: PauseCircle,
        tone: "rose",
        onClick: () => onStatusFilterChange("inactive"),
        isActive: statusFilter === "inactive",
      },
      {
        title: "Có khuyến mãi",
        value: kpi?.total_CoKhuyenMai ?? 0,
        subtext: "Đang giảm giá tiền công",
        icon: Tag,
        tone: "amber",
      },
      {
        title: "Tiền công TB",
        value: formatCurrency(kpi?.avg_GiaTienCong),
        subtext: "Trung bình mỗi dịch vụ",
        icon: DollarSign,
        tone: "blue",
        compact: true,
      },
      {
        title: "Thời gian TB",
        value: `${kpi?.avg_ThoiGianPhut ?? 0} phút`,
        subtext: "Thời gian thi công dự kiến",
        icon: Timer,
        tone: "indigo",
        compact: true,
      },
    ],
    [kpi, statusFilter, onStatusFilterChange]
  );

  return <KpiRibbon isLoading={isLoading} items={kpiItems} />;
}
