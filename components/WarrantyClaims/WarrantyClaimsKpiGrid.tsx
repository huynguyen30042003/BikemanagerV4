"use client";

import React from "react";
import { KpiRibbon } from "@/components/Common/KpiRibbon";
import { useGetPhieuBaoHanhKPI } from "@/hooks/BaoHanh/useBaoHanhApi";
import {
  FileText,
  Clock,
  CheckCircle2,
  HandCoins,
  Wallet,
} from "lucide-react";

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

interface WarrantyClaimsKpiGridProps {
  onCardClick?: (statusType: string) => void;
}

export function WarrantyClaimsKpiGrid({
  onCardClick,
}: WarrantyClaimsKpiGridProps) {
  const { data: kpi, isLoading } = useGetPhieuBaoHanhKPI();

  return (
    <KpiRibbon
      isLoading={isLoading}
      items={[
        {
          title: "Tổng phiếu tiếp nhận",
          value: kpi?.total_PhieuBaoHanh ?? 0,
          subtext: "Yêu cầu bảo hành đã lập",
          icon: FileText,
          onClick: onCardClick ? () => onCardClick("all") : undefined,
        },
        {
          title: "Đang xử lý",
          value: kpi?.total_DangXuLy ?? 0,
          subtext: "Đang kiểm tra, sửa chữa",
          icon: Clock,
          tone: "amber",
          onClick: onCardClick ? () => onCardClick("processing") : undefined,
        },
        {
          title: "Hoàn thành",
          value: kpi?.total_HoanThanh ?? 0,
          subtext: "Đã bàn giao xe cho khách",
          icon: CheckCircle2,
          tone: "emerald",
          onClick: onCardClick ? () => onCardClick("completed") : undefined,
        },
        {
          title: "Hãng hỗ trợ",
          value: formatCurrency(kpi?.total_ChiPhiHangHoTro),
          subtext: "Chi phí bảo hành hãng chi trả",
          icon: HandCoins,
          tone: "indigo",
          compact: true,
        },
        {
          title: "Khách trả",
          value: formatCurrency(kpi?.total_ChiPhiKhachTra),
          subtext: "Phần ngoài phạm vi bảo hành",
          icon: Wallet,
          tone: "blue",
          compact: true,
        },
      ]}
    />
  );
}
