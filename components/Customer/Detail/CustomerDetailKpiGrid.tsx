"use client";

import React, { useMemo } from "react";
import {
  Bike,
  ShieldCheck,
  ShoppingBag,
  Wrench,
  LucideIcon,
} from "lucide-react";
import { KpiRibbon, KpiItem, KpiTone } from "@/components/Common/KpiRibbon";
import { DetailTabKey } from "@/components/Customer/Detail/CustomerDetailUtils";

export interface CustomerDetailKpiGridProps {
  vehiclesCount: number;
  activeWarrantiesCount: number;
  totalWarrantiesCount: number;
  ordersCount: number;
  claimsCount: number;
  activeTab: DetailTabKey;
  setActiveTab: (tab: DetailTabKey) => void;
  isLoading: boolean;
}

interface RawDetailKpiDef {
  id: string;
  title: string;
  subtext: string;
  value: React.ReactNode;
  icon: LucideIcon;
  tone: KpiTone;
  isActive: boolean;
  onClick: () => void;
}

export const CustomerDetailKpiGrid: React.FC<CustomerDetailKpiGridProps> =
  React.memo(
    ({
      vehiclesCount,
      activeWarrantiesCount,
      totalWarrantiesCount,
      ordersCount,
      claimsCount,
      activeTab,
      setActiveTab,
      isLoading,
    }) => {
      const kpiDefinitions: RawDetailKpiDef[] = useMemo(
        () => [
          {
            id: "vehicles",
            title: "Phương tiện sở hữu",
            subtext: "Xe gắn với hồ sơ khách hàng",
            value: vehiclesCount.toLocaleString("vi-VN"),
            icon: Bike,
            tone: "blue",
            isActive: activeTab === "vehicles-warranty",
            onClick: () => setActiveTab("vehicles-warranty"),
          },
          {
            id: "warranties",
            title: "Sổ bảo hành hiệu lực",
            subtext: "Chứng nhận bảo hành điện tử",
            value: `${activeWarrantiesCount} / ${totalWarrantiesCount}`,
            icon: ShieldCheck,
            tone: "emerald",
            isActive: false,
            onClick: () => setActiveTab("vehicles-warranty"),
          },
          {
            id: "orders",
            title: "Đơn hàng đã mua",
            subtext: "Bấm để xem sản phẩm đã mua",
            value: ordersCount.toLocaleString("vi-VN"),
            icon: ShoppingBag,
            tone: "indigo",
            isActive: activeTab === "purchased-orders",
            onClick: () => setActiveTab("purchased-orders"),
          },
          {
            id: "claims",
            title: "Lịch sử bảo hành",
            subtext: "Phiếu kiểm tra & xử lý kỹ thuật",
            value: claimsCount.toLocaleString("vi-VN"),
            icon: Wrench,
            tone: "amber",
            isActive: activeTab === "warranty-claims",
            onClick: () => setActiveTab("warranty-claims"),
          },
        ],
        [
          vehiclesCount,
          activeWarrantiesCount,
          totalWarrantiesCount,
          ordersCount,
          claimsCount,
          activeTab,
          setActiveTab,
        ],
      );

      const kpiItems: KpiItem[] = useMemo(
        () =>
          kpiDefinitions.map((def) => ({
            title: def.title,
            value: def.value,
            subtext: def.subtext,
            icon: def.icon,
            tone: def.tone,
            isActive: def.isActive,
            onClick: def.onClick,
          })),
        [kpiDefinitions],
      );

      return <KpiRibbon items={kpiItems} isLoading={isLoading} />;
    },
  );

CustomerDetailKpiGrid.displayName = "CustomerDetailKpiGrid";

