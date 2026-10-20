"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeftRight, ClipboardCheck, Layers, Warehouse } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetWarehouseNavTabs } from "@/hooks/Kho/useKhoApi";

interface WarehouseNavTabsProps {
  activeTab: "warehouses" | "inventory" | "transfers" | "audits";
  className?: string;
  totalWarehouses?: number;
  totalInventory?: number;
  totalTransfers?: number;
  totalAudits?: number;
}

export function WarehouseNavTabs({
  activeTab,
  className,
  totalWarehouses,
  totalInventory,
  totalTransfers,
  totalAudits,
}: WarehouseNavTabsProps) {
  const { data: navData, isLoading } = useGetWarehouseNavTabs();

  // Ưu tiên props truyền vào nếu có, fallback về data tự động từ API /api/KhoApi/NavTabs
  const countWarehouses =
    totalWarehouses ?? navData?.total_Kho ?? navData?.totalKho;
  const countInventory =
    totalInventory ?? navData?.total_TonKho ?? navData?.totalTonKho;
  const countTransfers =
    totalTransfers ?? navData?.total_PhieuChuyenKho ?? navData?.totalPhieuChuyenKho;
  const countAudits =
    totalAudits ?? navData?.total_PhieuKiemKe ?? navData?.totalPhieuKiemKe;

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
      id: "warehouses" as const,
      label: "Danh sách Kho bãi",
      href: "/admin/warehouses",
      icon: Warehouse,
      count: countWarehouses,
    },
    {
      id: "inventory" as const,
      label: "Tồn kho & Thẻ kho",
      href: "/admin/inventory",
      icon: Layers,
      count: countInventory,
    },
    {
      id: "transfers" as const,
      label: "Điều chuyển kho",
      href: "/admin/stock-transfers",
      icon: ArrowLeftRight,
      count: countTransfers,
    },
    {
      id: "audits" as const,
      label: "Kiểm kê kho",
      href: "/admin/stock-audits",
      icon: ClipboardCheck,
      count: countAudits,
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

