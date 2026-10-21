"use client";

import React from "react";
import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavTabItem<T extends string = string> {
  key: T;
  label: string;
  href: string;
  icon: LucideIcon;
  count?: number;
  badgeColorClass?: string;
}

export interface BaseNavTabsProps<T extends string = string> {
  items: NavTabItem<T>[];
  activeTab: T;
  isLoading?: boolean;
  className?: string;
  activeColorClass?: string;
}

export function BaseNavTabs<T extends string = string>({
  items,
  activeTab,
  isLoading,
  className,
  activeColorClass = "text-blue-600 dark:text-blue-400",
}: BaseNavTabsProps<T>) {
  const renderBadge = (count?: number, isActive?: boolean, customBadgeColor?: string) => {
    if (count !== undefined) {
      return (
        <span
          className={cn(
            "text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold transition-colors",
            isActive
              ? customBadgeColor || "bg-blue-500/15 text-blue-600 dark:text-blue-400"
              : "bg-muted text-muted-foreground group-hover:text-foreground",
          )}
        >
          {count}
        </span>
      );
    }
    if (isLoading) {
      return (
        <span className="w-5 h-3.5 rounded-full bg-muted/60 animate-pulse" />
      );
    }
    return null;
  };

  return (
    <div
      className={cn(
        "flex items-center p-1 rounded-xl bg-muted/70 border border-border/80 shadow-2xs gap-1 max-w-full overflow-x-auto no-scrollbar scroll-smooth",
        className,
      )}
    >
      {items.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            className={cn(
              "group inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer shrink-0 whitespace-nowrap",
              isActive
                ? cn(
                    "bg-background text-foreground font-semibold shadow-xs border border-border/50",
                    activeColorClass,
                  )
                : "text-muted-foreground hover:text-foreground hover:bg-background/50",
            )}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{tab.label}</span>
            {renderBadge(tab.count, isActive, tab.badgeColorClass)}
          </Link>
        );
      })}
    </div>
  );
}
