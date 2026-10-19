"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeftRight, ClipboardCheck, Layers, Warehouse } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <div
      className={cn(
        "inline-flex items-center p-1 rounded-xl bg-muted/70 border border-border/80 shadow-2xs gap-1 flex-wrap",
        className
      )}
    >
      <Link
        href="/admin/warehouses"
        className={cn(
          "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "warehouses"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <Warehouse className="w-3.5 h-3.5 shrink-0" />
        <span>Danh sách Kho bãi</span>
        {totalWarehouses !== undefined && (
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.2 rounded-full font-mono",
              activeTab === "warehouses"
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                : "bg-muted text-muted-foreground"
            )}
          >
            {totalWarehouses}
          </span>
        )}
      </Link>

      <Link
        href="/admin/inventory"
        className={cn(
          "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "inventory"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <Layers className="w-3.5 h-3.5 shrink-0" />
        <span>Tồn kho & Thẻ kho</span>
        {totalInventory !== undefined && (
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.2 rounded-full font-mono",
              activeTab === "inventory"
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                : "bg-muted text-muted-foreground"
            )}
          >
            {totalInventory}
          </span>
        )}
      </Link>

      <Link
        href="/admin/stock-transfers"
        className={cn(
          "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "transfers"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <ArrowLeftRight className="w-3.5 h-3.5 shrink-0" />
        <span>Điều chuyển kho</span>
        {totalTransfers !== undefined && (
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.2 rounded-full font-mono",
              activeTab === "transfers"
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                : "bg-muted text-muted-foreground"
            )}
          >
            {totalTransfers}
          </span>
        )}
      </Link>

      <Link
        href="/admin/stock-audits"
        className={cn(
          "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "audits"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <ClipboardCheck className="w-3.5 h-3.5 shrink-0" />
        <span>Kiểm kê kho</span>
        {totalAudits !== undefined && (
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.2 rounded-full font-mono",
              activeTab === "audits"
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                : "bg-muted text-muted-foreground"
            )}
          >
            {totalAudits}
          </span>
        )}
      </Link>
    </div>
  );
}
