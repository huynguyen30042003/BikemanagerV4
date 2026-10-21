"use client";

import React, { useMemo } from "react";
import { CheckCircle2, Flag, Globe, XCircle } from "lucide-react";
import { KpiItem, KpiRibbon } from "@/components/Common/KpiRibbon";

interface QuocGiaKpiGridProps {
  total_QuocGia: number;
  total_HoatDong: number;
  total_NgungHoatDong: number;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  isLoading?: boolean;
}

export function QuocGiaKpiGrid({
  total_QuocGia,
  total_HoatDong,
  total_NgungHoatDong,
  statusFilter,
  onStatusFilterChange,
  isLoading,
}: QuocGiaKpiGridProps) {
  const kpiItems = useMemo<KpiItem[]>(
    () => [
      {
        title: "Tổng số Quốc gia",
        value: total_QuocGia,
        subtext: "Khai báo trong toàn hệ thống",
        icon: Globe,
        tone: "blue",
        onClick: () => onStatusFilterChange("all"),
        isActive: statusFilter === "all",
      },
      {
        title: "Đang áp dụng",
        value: total_HoatDong,
        subtext: "Sẵn sàng liên kết xuất xứ",
        icon: CheckCircle2,
        tone: "emerald",
        onClick: () => onStatusFilterChange("active"),
        isActive: statusFilter === "active",
      },
      {
        title: "Tạm ngưng / Khóa",
        value: total_NgungHoatDong,
        subtext: "Vô hiệu hóa trong biểu mẫu",
        icon: XCircle,
        tone: "rose",
        onClick: () => onStatusFilterChange("inactive"),
        isActive: statusFilter === "inactive",
      },
      {
        title: "Chuẩn mã ISO",
        value: "ISO-3166",
        subtext: "Định dạng mã quốc tế chuẩn",
        icon: Flag,
        tone: "indigo",
      },
    ],
    [total_QuocGia, total_HoatDong, total_NgungHoatDong, statusFilter, onStatusFilterChange]
  );

  return <KpiRibbon items={kpiItems} isLoading={isLoading} />;
}
