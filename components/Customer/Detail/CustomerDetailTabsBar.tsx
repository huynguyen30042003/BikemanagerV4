"use client";

import React, { useMemo } from "react";
import {
  ShieldCheck,
  ShoppingBag,
  Wrench,
  LucideIcon,
} from "lucide-react";
import { DetailTabKey } from "@/components/Customer/Detail/CustomerDetailUtils";

export interface CustomerDetailTabsBarProps {
  activeTab: DetailTabKey;
  setActiveTab: (tab: DetailTabKey) => void;
  vehiclesAndStandaloneCount: number;
  ordersCount: number;
  claimsCount: number;
}

interface DetailTabItemConfig {
  id: DetailTabKey;
  label: string;
  count: number;
  icon: LucideIcon;
  badgeClass: string;
}

export const CustomerDetailTabsBar: React.FC<CustomerDetailTabsBarProps> =
  React.memo(
    ({
      activeTab,
      setActiveTab,
      vehiclesAndStandaloneCount,
      ordersCount,
      claimsCount,
    }) => {
      const tabConfigs: DetailTabItemConfig[] = useMemo(
        () => [
          {
            id: "vehicles-warranty",
            label: "Xe sở hữu & Sổ Bảo Hành Điện Tử",
            count: vehiclesAndStandaloneCount,
            icon: ShieldCheck,
            badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
          },
          {
            id: "purchased-orders",
            label: "Sản phẩm đã mua",
            count: ordersCount,
            icon: ShoppingBag,
            badgeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
          },
          {
            id: "warranty-claims",
            label: "Lịch sử bảo hành & bảo dưỡng",
            count: claimsCount,
            icon: Wrench,
            badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
          },
        ],
        [vehiclesAndStandaloneCount, ordersCount, claimsCount],
      );

      return (
        <nav
          aria-label="Điều hướng chi tiết hồ sơ khách hàng"
          className="flex items-center gap-1.5 sm:gap-2 border-b border-border/80 max-w-full overflow-x-auto no-scrollbar scroll-smooth print:hidden"
        >
          {tabConfigs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[11px] font-mono ${tab.badgeClass}`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      );
    },
  );

CustomerDetailTabsBar.displayName = "CustomerDetailTabsBar";

