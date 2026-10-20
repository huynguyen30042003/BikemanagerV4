"use client";

import React from "react";
import Link from "next/link";
import { Truck, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetPurchaseNavTabs } from "@/hooks/NhaCungCap/useNhaCungCapApi";

interface PurchaseNavTabsProps {
  activeTab: "suppliers" | "orders";
  className?: string;
  totalSuppliers?: number;
  totalOrders?: number;
}

export function PurchaseNavTabs({
  activeTab,
  className,
  totalSuppliers,
  totalOrders,
}: PurchaseNavTabsProps) {
  const { data: navData, isLoading } = useGetPurchaseNavTabs();

  // Ưu tiên props truyền vào nếu có, fallback về data tự động từ API /api/v1/NhaCungCapApi/NavTabs
  const countSuppliers =
    totalSuppliers ?? navData?.total_NhaCungCap ?? navData?.totalNhaCungCap;
  const countOrders =
    totalOrders ?? navData?.total_DonNhapHang ?? navData?.totalDonNhapHang;

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

  const tabs = [
    {
      id: "suppliers" as const,
      label: "Nhà cung cấp",
      href: "/admin/suppliers",
      icon: Truck,
      count: countSuppliers,
    },
    {
      id: "orders" as const,
      label: "Đơn nhập hàng & Nhập kho",
      href: "/admin/purchase-orders",
      icon: ShoppingBag,
      count: countOrders,
    },
  ];

  return (
    <div
      className={cn(
        "inline-flex items-center p-1 rounded-xl bg-muted/70 border border-border/80 shadow-2xs gap-1 flex-wrap",
        className
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
              isActive
                ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{tab.label}</span>
            {renderBadge(tab.count, isActive)}
          </Link>
        );
      })}
    </div>
  );
}

