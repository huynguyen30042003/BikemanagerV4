"use client";

import React from "react";
import { Building2, CreditCard } from "lucide-react";
import { useGetTraGopNavTabs } from "@/hooks/TraGop/useTraGopApi";
import { BaseNavTabs, NavTabItem } from "@/components/Common/BaseNavTabs";

export type InstallmentTabKey = "providers" | "contracts";

interface InstallmentNavTabsProps {
  activeTab: InstallmentTabKey;
  className?: string;
  totalProviders?: number;
  totalContracts?: number;
  totalDonViTraGop?: number;
  totalHopDongTraGop?: number;
}

export function InstallmentNavTabs({
  activeTab,
  className,
  totalProviders,
  totalContracts,
  totalDonViTraGop,
  totalHopDongTraGop,
}: InstallmentNavTabsProps) {
  const { data: navData, isLoading } = useGetTraGopNavTabs();

  // Ưu tiên props truyền vào nếu có, fallback về data tự động từ API /api/TraGopApi/NavTabs
  const countProviders =
    totalProviders ?? totalDonViTraGop ?? navData?.total_DonViTraGop;
  const countContracts =
    totalContracts ?? totalHopDongTraGop ?? navData?.total_HopDongTraGop;

  const navTabs: NavTabItem<InstallmentTabKey>[] = React.useMemo(
    () => [
      {
        key: "providers",
        label: "Đối tác trả góp",
        href: "/admin/installment-providers",
        icon: Building2,
        count: countProviders,
      },
      {
        key: "contracts",
        label: "Hợp đồng trả góp",
        href: "/admin/installment-contracts",
        icon: CreditCard,
        count: countContracts,
      },
    ],
    [countProviders, countContracts],
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

export const TraGopNavTabs = InstallmentNavTabs;
