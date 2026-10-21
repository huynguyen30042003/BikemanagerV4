"use client";

import React from "react";
import { ShieldCheck, FileText, Wrench, Sparkles } from "lucide-react";
import { useGetServiceNavTabs } from "@/hooks/SuaChua/useSuaChuaApi";
import { BaseNavTabs, NavTabItem } from "@/components/Common/BaseNavTabs";

export type ServiceTabKey = "warranties" | "claims" | "repairs" | "services";

interface ServiceNavTabsProps {
  activeTab: ServiceTabKey;
  className?: string;
  totalWarranties?: number;
  totalClaims?: number;
  totalRepairs?: number;
  totalServices?: number;
}

export function ServiceNavTabs({
  activeTab,
  className,
  totalWarranties,
  totalClaims,
  totalRepairs,
  totalServices,
}: ServiceNavTabsProps) {
  const { data: navData, isLoading } = useGetServiceNavTabs();

  // Ưu tiên props truyền vào nếu có, fallback về data tự động từ API /api/DichVuApi/NavTabs
  const countWarranties =
    totalWarranties ?? navData?.total_BaoHanh ?? navData?.totalBaoHanh;
  const countClaims =
    totalClaims ?? navData?.total_PhieuBaoHanh ?? navData?.totalPhieuBaoHanh;
  const countRepairs =
    totalRepairs ?? navData?.total_PhieuSuaChua ?? navData?.totalPhieuSuaChua;
  const countServices =
    totalServices ?? navData?.total_DichVu ?? navData?.totalDichVu;

  const navTabs: NavTabItem<ServiceTabKey>[] = React.useMemo(
    () => [
      {
        key: "warranties",
        label: "Sổ Bảo Hành Điện Tử",
        href: "/admin/warranties",
        icon: ShieldCheck,
        count: countWarranties,
      },
      {
        key: "claims",
        label: "Phiếu Tiếp Nhận Bảo Hành",
        href: "/admin/warranty-claims",
        icon: FileText,
        count: countClaims,
      },
      {
        key: "repairs",
        label: "Phiếu Sửa Chữa & Dịch Vụ",
        href: "/admin/repair-tickets",
        icon: Wrench,
        count: countRepairs,
      },
      {
        key: "services",
        label: "Bảng Giá Dịch Vụ & Tiền Công",
        href: "/admin/repair-services",
        icon: Sparkles,
        count: countServices,
      },
    ],
    [countWarranties, countClaims, countRepairs, countServices],
  );

  return (
    <BaseNavTabs
      items={navTabs}
      activeTab={activeTab}
      isLoading={isLoading}
      className={className}
    />
  );
}
