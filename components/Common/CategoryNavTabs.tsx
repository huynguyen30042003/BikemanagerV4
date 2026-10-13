"use client";

import React from "react";
import Link from "next/link";
import { FolderTree, ListTree } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryNavTabsProps {
  activeTab: "chung" | "chiTiet";
  className?: string;
  totalChung?: number;
  totalChiTiet?: number;
}

export function CategoryNavTabs({
  activeTab,
  className,
  totalChung,
  totalChiTiet,
}: CategoryNavTabsProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center p-1 rounded-xl bg-muted/70 border border-border/80 shadow-2xs gap-1",
        className
      )}
    >
      <Link
        href="/admin/danhMucChung"
        className={cn(
          "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "chung"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <FolderTree className="w-3.5 h-3.5 shrink-0" />
        <span>Danh mục dùng chung</span>
        {totalChung !== undefined && (
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.2 rounded-full font-mono",
              activeTab === "chung"
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                : "bg-muted text-muted-foreground"
            )}
          >
            {totalChung}
          </span>
        )}
      </Link>

      <Link
        href="/admin/danhMucChiTiet"
        className={cn(
          "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "chiTiet"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <ListTree className="w-3.5 h-3.5 shrink-0" />
        <span>Danh mục chi tiết</span>
        {totalChiTiet !== undefined && (
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.2 rounded-full font-mono",
              activeTab === "chiTiet"
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                : "bg-muted text-muted-foreground"
            )}
          >
            {totalChiTiet}
          </span>
        )}
      </Link>
    </div>
  );
}
