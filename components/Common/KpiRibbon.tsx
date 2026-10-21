"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type KpiTone =
  | "neutral"
  | "blue"
  | "amber"
  | "emerald"
  | "rose"
  | "indigo";

export interface KpiItem {
  title: string;
  value: React.ReactNode;
  subtext?: string;
  icon: LucideIcon;
  tone?: KpiTone;
  /** Giá trị dài (tiền tệ) → giảm cỡ chữ để không tràn trên 390px */
  compact?: boolean;
  /** Callback khi người dùng click vào thẻ để lọc nhanh */
  onClick?: () => void;
  /** Trạng thái kích hoạt của bộ lọc ứng với thẻ */
  isActive?: boolean;
  /** Custom class cho viền / background khi đang active */
  activeBorderClass?: string;
}

const TONE: Record<KpiTone, { value: string; icon: string }> = {
  neutral: { value: "text-foreground", icon: "bg-blue-500/10 text-blue-600" },
  blue: {
    value: "text-blue-600 dark:text-blue-400",
    icon: "bg-blue-500/10 text-blue-600",
  },
  amber: {
    value: "text-amber-600 dark:text-amber-400",
    icon: "bg-amber-500/10 text-amber-600",
  },
  emerald: {
    value: "text-emerald-600 dark:text-emerald-400",
    icon: "bg-emerald-500/10 text-emerald-600",
  },
  rose: {
    value: "text-rose-600 dark:text-rose-400",
    icon: "bg-rose-500/10 text-rose-600",
  },
  indigo: {
    value: "text-indigo-600 dark:text-indigo-400",
    icon: "bg-indigo-500/10 text-indigo-600",
  },
};

const ACTIVE_BORDER: Record<KpiTone, string> = {
  neutral: "border-blue-500/50 bg-blue-500/5 shadow-xs ring-2 ring-blue-500/10",
  blue: "border-blue-500/50 bg-blue-500/5 shadow-xs ring-2 ring-blue-500/10",
  amber:
    "border-amber-500/50 bg-amber-500/5 shadow-xs ring-2 ring-amber-500/10",
  emerald:
    "border-emerald-500/50 bg-emerald-500/5 shadow-xs ring-2 ring-emerald-500/10",
  rose: "border-rose-500/50 bg-rose-500/5 shadow-xs ring-2 ring-rose-500/10",
  indigo:
    "border-indigo-500/50 bg-indigo-500/5 shadow-xs ring-2 ring-indigo-500/10",
};

const GRID_COLS: Record<number, string> = {
  4: "grid-cols-2 md:grid-cols-4",
  5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
};

interface KpiRibbonProps {
  items: KpiItem[];
  isLoading?: boolean;
  className?: string;
}

/** Dải thẻ KPI dùng chung cho các trang quản trị (config-driven) */
export function KpiRibbon({ items, isLoading, className }: KpiRibbonProps) {
  const cols = GRID_COLS[items.length] ?? "grid-cols-2 md:grid-cols-4";

  return (
    <section
      aria-label="Chỉ số tổng quan"
      className={cn("grid gap-3", cols, className)}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const toneKey = item.tone ?? "neutral";
        const tone = TONE[toneKey];
        const isClickable = Boolean(item.onClick);

        const cardClasses = cn(
          "p-3.5 bg-card/60 backdrop-blur-sm border-border/80 shadow-2xs min-w-0 transition-all",
          isClickable &&
            "cursor-pointer hover:border-border hover:shadow-xs active:scale-[0.99]",
          item.isActive && (item.activeBorderClass || ACTIVE_BORDER[toneKey]),
        );

        return (
          <Card
            key={item.title}
            className={`gap-0 sm:gap-2 ${cardClasses}`}
            onClick={item.onClick}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onKeyDown={
              isClickable
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      item.onClick?.();
                    }
                  }
                : undefined
            }
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground truncate">
                {item.title}
              </span>
              <div
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                  tone.icon,
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div
              className={cn(
                "font-bold mt-2 truncate tabular-nums",
                item.compact ? "text-base lg:text-lg" : "text-2xl",
                tone.value,
              )}
            >
              {isLoading ? <Skeleton className="h-7 w-16" /> : item.value}
            </div>
            {item.subtext && (
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                {item.subtext}
              </p>
            )}
          </Card>
        );
      })}
    </section>
  );
}
