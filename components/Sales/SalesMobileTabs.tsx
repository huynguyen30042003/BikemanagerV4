"use client";

import React from "react";
import { Package, ShoppingCart } from "lucide-react";

interface SalesMobileTabsProps {
  mobileTab: "catalog" | "cart";
  onTabChange: (tab: "catalog" | "cart") => void;
  totalItemCount: number;
}

export const SalesMobileTabs: React.FC<SalesMobileTabsProps> = ({
  mobileTab,
  onTabChange,
  totalItemCount,
}) => {
  return (
    <div className="lg:hidden flex items-center p-1 rounded-xl bg-muted/70 border border-border/80 shadow-2xs gap-1">
      <button
        type="button"
        onClick={() => onTabChange("catalog")}
        className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
          mobileTab === "catalog"
            ? "bg-card text-foreground shadow-xs font-bold"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Package className="w-4 h-4" />
        <span>Sản phẩm & Menu</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("cart")}
        className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
          mobileTab === "cart"
            ? "bg-card text-blue-600 dark:text-blue-400 shadow-xs font-bold"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <ShoppingCart className="w-4 h-4" />
        <span>Giỏ hàng</span>
        {totalItemCount > 0 && (
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-600 text-white">
            {totalItemCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default SalesMobileTabs;
