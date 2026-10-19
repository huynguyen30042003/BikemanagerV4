"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, FileText, Wrench, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceNavTabsProps {
  activeTab: "warranties" | "claims" | "repairs" | "services";
  totalWarranties?: number;
  totalClaims?: number;
  totalRepairs?: number;
}

export function ServiceNavTabs({
  activeTab,
  totalWarranties,
  totalClaims,
  totalRepairs,
}: ServiceNavTabsProps) {
  const tabs = [
    {
      id: "warranties",
      label: "Sổ Bảo Hành Điện Tử",
      href: "/admin/warranties",
      icon: ShieldCheck,
      badge: totalWarranties,
    },
    {
      id: "claims",
      label: "Phiếu Tiếp Nhận Bảo Hành",
      href: "/admin/warranty-claims",
      icon: FileText,
      badge: totalClaims,
    },
    {
      id: "repairs",
      label: "Phiếu Sửa Chữa & Dịch Vụ",
      href: "/admin/repair-tickets",
      icon: Wrench,
      badge: totalRepairs,
    },
    {
      id: "services",
      label: "Bảng Giá Dịch Vụ & Tiền Công",
      href: "/admin/repair-services",
      icon: Sparkles,
    },
  ];

  return (
    <div className="flex items-center gap-1.5 border-b border-border/60 pb-2 overflow-x-auto scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer",
              isActive
                ? "bg-blue-600 text-white shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
            )}
          >
            <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-muted-foreground")} />
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "ml-1 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-muted text-muted-foreground border border-border/60"
                )}
              >
                {tab.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
