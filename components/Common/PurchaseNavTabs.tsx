"use client";

import React from "react";
import { Truck, ShoppingBag } from "lucide-react";
import { useGetPurchaseNavTabs } from "@/hooks/NhaCungCap/useNhaCungCapApi";
import { BaseNavTabs, NavTabItem } from "@/components/Common/BaseNavTabs";

export type PurchaseTabKey = "suppliers" | "orders";

interface PurchaseNavTabsProps {
  activeTab: PurchaseTabKey;
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

  const navTabs: NavTabItem<PurchaseTabKey>[] = React.useMemo(
    () => [
      {
        key: "suppliers",
        label: "Nhà cung cấp",
        href: "/admin/suppliers",
        icon: Truck,
        count: countSuppliers,
      },
      {
        key: "orders",
        label: "Đơn nhập hàng & Nhập kho",
        href: "/admin/purchase-orders",
        icon: ShoppingBag,
        count: countOrders,
      },
    ],
    [countSuppliers, countOrders],
  );

  return (
    <BaseNavTabs
      items={navTabs}
      activeTab={activeTab}
      isLoading={isLoading}
      className={className}
    />
  );
}
