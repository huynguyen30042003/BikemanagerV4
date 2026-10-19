"use client";

import React from "react";
import Link from "next/link";
import { Building2, Compass, Globe, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetDiaDiemNavTabs } from "@/hooks/DiaDiem/useDiaDiemApi";

interface LocationNavTabsProps {
  activeTab: "quocGia" | "tinh" | "xa" | "diaDiem";
  className?: string;
  total_QuocGia?: number;
  total_DiaPhuongCapTinh?: number;
  total_DiaPhuongCapXa?: number;
  total_DiaDiem?: number;
}

export function LocationNavTabs({
  activeTab,
  className,
  total_QuocGia,
  total_DiaPhuongCapTinh,
  total_DiaPhuongCapXa,
  total_DiaDiem,
}: LocationNavTabsProps) {
  const { data: navData, isLoading } = useGetDiaDiemNavTabs();

  // Ưu tiên props truyền vào nếu có, fallback về data tự động từ API /api/DiaDiemApi/NavTabs
  const countQuocGia = total_QuocGia ?? navData?.total_QuocGia;
  const countTinh = total_DiaPhuongCapTinh ?? navData?.total_DiaPhuongCapTinh;
  const countXa = total_DiaPhuongCapXa ?? navData?.total_DiaPhuongCapXa;
  const countDiaDiem = total_DiaDiem ?? navData?.total_DiaDiem;


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
        href="/admin/quocGia"
        className={cn(
          "group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "quocGia"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <Globe className="w-3.5 h-3.5 shrink-0" />
        <span>Quốc gia</span>
        {renderBadge(countQuocGia, activeTab === "quocGia")}
      </Link>

      <Link
        href="/admin/diaPhuongCapTinh"
        className={cn(
          "group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "tinh"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <Building2 className="w-3.5 h-3.5 shrink-0" />
        <span>Tỉnh / Thành phố</span>
        {renderBadge(countTinh, activeTab === "tinh")}
      </Link>

      <Link
        href="/admin/diaPhuongCapXa"
        className={cn(
          "group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "xa"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <Compass className="w-3.5 h-3.5 shrink-0" />
        <span>Xã / Phường</span>
        {renderBadge(countXa, activeTab === "xa")}
      </Link>

      <Link
        href="/admin/diaDiem"
        className={cn(
          "group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "diaDiem"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <Store className="w-3.5 h-3.5 shrink-0" />
        <span>Chi nhánh & Showroom</span>
        {renderBadge(countDiaDiem, activeTab === "diaDiem")}
      </Link>
    </div>
  );
}
