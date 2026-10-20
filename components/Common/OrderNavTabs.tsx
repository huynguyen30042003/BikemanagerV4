"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Store, CreditCard, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { useGetTraGopNavTabs } from "@/hooks/TraGop/useTraGopApi";

interface OrderNavTabsProps {
  activeTab: "orders" | "sales" | "contracts" | "providers";
  totalOrders?: number;
  totalContracts?: number;
  totalProviders?: number;
}

export function OrderNavTabs({
  activeTab,
  totalOrders,
  totalContracts,
  totalProviders,
}: OrderNavTabsProps) {
  const { data: traGopNavData } = useGetTraGopNavTabs();

  const countContracts = totalContracts ?? traGopNavData?.total_HopDongTraGop;
  const countProviders = totalProviders ?? traGopNavData?.total_DonViTraGop;

  const tabs = [
    {
      id: "orders",
      label: "Danh Sách Đơn Hàng",
      href: "/admin/orders",
      icon: ShoppingCart,
      badge: totalOrders,
    },
    {
      id: "sales",
      label: "Bán Hàng & POS",
      href: "/admin/sales",
      icon: Store,
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
                : "text-muted-foreground hover:text-foreground hover:bg-muted/70",
            )}
          >
            <Icon
              className={cn(
                "w-4 h-4",
                isActive ? "text-white" : "text-muted-foreground",
              )}
            />
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "ml-1 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-muted text-muted-foreground border border-border/60",
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
