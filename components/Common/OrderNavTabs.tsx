"use client";

import React from "react";
import { ShoppingCart, Store } from "lucide-react";
import { BaseNavTabs, NavTabItem } from "@/components/Common/BaseNavTabs";

export type OrderTabKey = "orders" | "sales";

interface OrderNavTabsProps {
  activeTab: OrderTabKey;
  className?: string;
  totalOrders?: number;
}

export function OrderNavTabs({
  activeTab,
  className,
  totalOrders,
}: OrderNavTabsProps) {
  const navTabs: NavTabItem<OrderTabKey>[] = React.useMemo(
    () => [
      {
        key: "orders",
        label: "Danh Sách Đơn Hàng",
        href: "/admin/orders",
        icon: ShoppingCart,
        count: totalOrders,
      },
      {
        key: "sales",
        label: "Bán Hàng & POS",
        href: "/admin/sales",
        icon: Store,
      },
    ],
    [totalOrders],
  );

  return (
    <BaseNavTabs
      items={navTabs}
      activeTab={activeTab}
      className={className}
    />
  );
}
