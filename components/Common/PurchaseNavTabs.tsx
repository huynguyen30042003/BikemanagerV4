"use client";

import React from "react";
import Link from "next/link";
import { Truck, ShoppingBag } from "lucide-react";

interface PurchaseNavTabsProps {
  activeTab: "suppliers" | "orders";
  totalSuppliers?: number;
  totalOrders?: number;
}

export function PurchaseNavTabs({
  activeTab,
  totalSuppliers,
  totalOrders,
}: PurchaseNavTabsProps) {
  const tabs = [
    {
      id: "suppliers",
      label: "Nhà cung cấp",
      href: "/admin/suppliers",
      icon: Truck,
      count: totalSuppliers,
    },
    {
      id: "orders",
      label: "Đơn nhập hàng & Nhập kho",
      href: "/admin/purchase-orders",
      icon: ShoppingBag,
      count: totalOrders,
    },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-muted/60 backdrop-blur-md rounded-xl border border-border/80 w-fit">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isActive
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`} />
            <span>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
