"use client";

import React from "react";
import { ArrowLeftRight, ClipboardCheck, Layers, PackagePlus, Warehouse } from "lucide-react";
import { useGetWarehouseNavTabs } from "@/hooks/Kho/useKhoApi";
import { BaseNavTabs, NavTabItem } from "@/components/Common/BaseNavTabs";

export type WarehouseTabKey = "warehouses" | "inventory" | "opening-stock" | "transfers" | "audits";

interface WarehouseNavTabsProps {
  activeTab: WarehouseTabKey;
  className?: string;
  totalWarehouses?: number;
  totalInventory?: number;
  totalTransfers?: number;
  totalAudits?: number;
}

export function WarehouseNavTabs({
  activeTab,
  className,
  totalWarehouses,
  totalInventory,
  totalTransfers,
  totalAudits,
}: WarehouseNavTabsProps) {
  const { data: navData, isLoading } = useGetWarehouseNavTabs();

  // Ưu tiên props truyền vào nếu có, fallback về data tự động từ API /api/KhoApi/NavTabs
  const countWarehouses =
    totalWarehouses ?? navData?.total_Kho ?? navData?.totalKho;
  const countInventory =
    totalInventory ?? navData?.total_TonKho ?? navData?.totalTonKho;
  const countTransfers =
    totalTransfers ?? navData?.total_PhieuChuyenKho ?? navData?.totalPhieuChuyenKho;
  const countAudits =
    totalAudits ?? navData?.total_PhieuKiemKe ?? navData?.totalPhieuKiemKe;

  const navTabs: NavTabItem<WarehouseTabKey>[] = React.useMemo(
    () => [
      {
        key: "warehouses",
        label: "Danh sách Kho bãi",
        href: "/admin/warehouses",
        icon: Warehouse,
        count: countWarehouses,
      },
      {
        key: "inventory",
        label: "Tồn kho & Thẻ kho",
        href: "/admin/inventory",
        icon: Layers,
        count: countInventory,
      },
      {
        key: "opening-stock",
        label: "Tồn kho đầu kỳ",
        href: "/admin/opening-stock",
        icon: PackagePlus,
      },
      {
        key: "transfers",
        label: "Điều chuyển kho",
        href: "/admin/stock-transfers",
        icon: ArrowLeftRight,
        count: countTransfers,
      },
      {
        key: "audits",
        label: "Kiểm kê kho",
        href: "/admin/stock-audits",
        icon: ClipboardCheck,
        count: countAudits,
      },
    ],
    [countWarehouses, countInventory, countTransfers, countAudits],
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
