"use client";

import React from "react";
import Link from "next/link";
import { Building2, Compass, Globe, Store } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationNavTabsProps {
  activeTab: "quocGia" | "tinh" | "xa" | "diaDiem";
  className?: string;
  totalQuocGia?: number;
  totalTinh?: number;
  totalXa?: number;
  totalDiaDiem?: number;
}

export function LocationNavTabs({
  activeTab,
  className,
  totalQuocGia,
  totalTinh,
  totalXa,
  totalDiaDiem,
}: LocationNavTabsProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center p-1 rounded-xl bg-muted/70 border border-border/80 shadow-2xs gap-1 flex-wrap",
        className
      )}
    >
      <Link
        href="/admin/quocGia"
        className={cn(
          "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "quocGia"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <Globe className="w-3.5 h-3.5 shrink-0" />
        <span>Quốc gia</span>
        {totalQuocGia !== undefined && (
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.2 rounded-full font-mono",
              activeTab === "quocGia"
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                : "bg-muted text-muted-foreground"
            )}
          >
            {totalQuocGia}
          </span>
        )}
      </Link>

      <Link
        href="/admin/diaPhuongCapTinh"
        className={cn(
          "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "tinh"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <Building2 className="w-3.5 h-3.5 shrink-0" />
        <span>Tỉnh / Thành phố</span>
        {totalTinh !== undefined && (
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.2 rounded-full font-mono",
              activeTab === "tinh"
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                : "bg-muted text-muted-foreground"
            )}
          >
            {totalTinh}
          </span>
        )}
      </Link>

      <Link
        href="/admin/diaPhuongCapXa"
        className={cn(
          "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "xa"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <Compass className="w-3.5 h-3.5 shrink-0" />
        <span>Xã / Phường</span>
        {totalXa !== undefined && (
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.2 rounded-full font-mono",
              activeTab === "xa"
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                : "bg-muted text-muted-foreground"
            )}
          >
            {totalXa}
          </span>
        )}
      </Link>

      <Link
        href="/admin/diaDiem"
        className={cn(
          "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "diaDiem"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <Store className="w-3.5 h-3.5 shrink-0" />
        <span>Chi nhánh & Showroom</span>
        {totalDiaDiem !== undefined && (
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.2 rounded-full font-mono",
              activeTab === "diaDiem"
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                : "bg-muted text-muted-foreground"
            )}
          >
            {totalDiaDiem}
          </span>
        )}
      </Link>
    </div>
  );
}
