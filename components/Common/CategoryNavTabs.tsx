"use client";

import React from "react";
import Link from "next/link";
import { FolderTree, ListTree } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetDanhMucChungNavTabs } from "@/hooks/DanhMucChung/useDanhMucChungApi";

interface CategoryNavTabsProps {
  activeTab: "chung" | "chiTiet";
  className?: string;
  totalChung?: number;
  totalChiTiet?: number;
  totalDanhMucChung?: number;
  totalDanhMucChiTiet?: number;
}

export function CategoryNavTabs({
  activeTab,
  className,
  totalChung,
  totalChiTiet,
  totalDanhMucChung,
  totalDanhMucChiTiet,
}: CategoryNavTabsProps) {
  const { data: navData, isLoading } = useGetDanhMucChungNavTabs();

  // Ưu tiên props truyền vào nếu có, fallback về data tự động từ API /api/DanhMucChungApi/NavTabs
  const countChung = totalChung ?? totalDanhMucChung ?? navData?.total_DanhMucChung;
  const countChiTiet = totalChiTiet ?? totalDanhMucChiTiet ?? navData?.total_DanhMucChiTiet;


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
        href="/admin/danhMucChung"
        className={cn(
          "group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "chung"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <FolderTree className="w-3.5 h-3.5 shrink-0" />
        <span>Danh mục dùng chung</span>
        {renderBadge(countChung, activeTab === "chung")}
      </Link>

      <Link
        href="/admin/danhMucChiTiet"
        className={cn(
          "group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "chiTiet"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <ListTree className="w-3.5 h-3.5 shrink-0" />
        <span>Danh mục chi tiết</span>
        {renderBadge(countChiTiet, activeTab === "chiTiet")}
      </Link>
    </div>
  );
}
