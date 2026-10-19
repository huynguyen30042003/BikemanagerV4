"use client";

import React from "react";
import Link from "next/link";
import { Building2, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetTraGopNavTabs } from "@/hooks/TraGop/useTraGopApi";

interface InstallmentNavTabsProps {
  activeTab: "providers" | "contracts";
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


  const renderBadge = (count?: number, isActive?: boolean) => {
    if (count !== undefined) {
      return (
        <span
          className={cn(
            "text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold transition-colors",
            isActive
              ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
              : "bg-muted text-muted-foreground group-hover:text-foreground"
          )}
        >
          {count}
        </span>
      );
    }
    if (isLoading) {
      return <span className="w-5 h-3.5 rounded-full bg-muted/60 animate-pulse" />;
    }
    return null;
  };

  return (
    <div
      className={cn(
        "inline-flex items-center p-1 rounded-xl bg-muted/70 border border-border/80 shadow-2xs gap-1 flex-wrap",
        className
      )}
    >
      <Link
        href="/admin/installment-providers"
        className={cn(
          "group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "providers"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <Building2 className="w-3.5 h-3.5 shrink-0" />
        <span>Đối tác trả góp</span>
        {renderBadge(countProviders, activeTab === "providers")}
      </Link>

      <Link
        href="/admin/installment-contracts"
        className={cn(
          "group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "contracts"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <CreditCard className="w-3.5 h-3.5 shrink-0" />
        <span>Hợp đồng trả góp</span>
        {renderBadge(countContracts, activeTab === "contracts")}
      </Link>
    </div>
  );
}

export const TraGopNavTabs = InstallmentNavTabs;
