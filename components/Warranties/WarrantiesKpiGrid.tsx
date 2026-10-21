"use client";

import React from "react";
import { KpiRibbon } from "@/components/Common/KpiRibbon";
import { useGetBaoHanhKPI } from "@/hooks/BaoHanh/useBaoHanhApi";
import {
  ShieldCheck,
  BadgeCheck,
  Clock,
  ShieldOff,
} from "lucide-react";

interface WarrantiesKpiGridProps {
  onCardClick?: (statusType: string) => void;
}

export function WarrantiesKpiGrid({ onCardClick }: WarrantiesKpiGridProps) {
  const { data: kpi, isLoading } = useGetBaoHanhKPI();

  return (
    <KpiRibbon
      isLoading={isLoading}
      items={[
        {
          title: "Tổng sổ bảo hành",
          value: kpi?.total_BaoHanh ?? 0,
          subtext: "Đã kích hoạt trên hệ thống",
          icon: ShieldCheck,
          onClick: onCardClick ? () => onCardClick("all") : undefined,
        },
        {
          title: "Đang hiệu lực",
          value: kpi?.total_DangHieuLuc ?? 0,
          subtext: "Còn trong thời hạn cam kết",
          icon: BadgeCheck,
          tone: "emerald",
          onClick: onCardClick ? () => onCardClick("valid") : undefined,
        },
        {
          title: "Sắp hết hạn",
          value: kpi?.total_SapHetHan ?? 0,
          subtext: "Cần nhắc khách bảo dưỡng / gia hạn",
          icon: Clock,
          tone: "amber",
          onClick: onCardClick ? () => onCardClick("expiring") : undefined,
        },
        {
          title: "Đã hết hạn",
          value: kpi?.total_HetHan ?? 0,
          subtext: "Không còn trong phạm vi bảo hành",
          icon: ShieldOff,
          tone: "rose",
          onClick: onCardClick ? () => onCardClick("expired") : undefined,
        },
      ]}
    />
  );
}
