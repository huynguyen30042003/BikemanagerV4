"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, FileText, Wrench, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetServiceNavTabs } from "@/hooks/SuaChua/useSuaChuaApi";

interface ServiceNavTabsProps {
  activeTab: "warranties" | "claims" | "repairs" | "services";
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

  const tabs = [
    {
      id: "warranties" as const,
      label: "Sổ Bảo Hành Điện Tử",
      href: "/admin/warranties",
      icon: ShieldCheck,
      count: countWarranties,
    },
    {
      id: "claims" as const,
      label: "Phiếu Tiếp Nhận Bảo Hành",
      href: "/admin/warranty-claims",
      icon: FileText,
      count: countClaims,
    },
    {
      id: "repairs" as const,
      label: "Phiếu Sửa Chữa & Dịch Vụ",
      href: "/admin/repair-tickets",
      icon: Wrench,
      count: countRepairs,
    },
    {
      id: "services" as const,
      label: "Bảng Giá Dịch Vụ & Tiền Công",
      href: "/admin/repair-services",
      icon: Sparkles,
      count: countServices,
    },
  ];

  return (
    <div
      className={cn(
        "inline-flex items-center p-1 rounded-xl bg-muted/70 border border-border/80 shadow-2xs gap-1 flex-wrap",
        className
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
              isActive
                ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{tab.label}</span>
            {renderBadge(tab.count, isActive)}
          </Link>
        );
      })}
    </div>
  );
}
