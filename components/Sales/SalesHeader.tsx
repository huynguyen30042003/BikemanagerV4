"use client";

import React from "react";
import { Store, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderNavTabs } from "@/components/Common/OrderNavTabs";

interface SalesHeaderProps {
  isFetching: boolean;
  onRefresh: () => void;
  hasCartItems: boolean;
  onClearCart: () => void;
}

export const SalesHeader: React.FC<SalesHeaderProps> = ({
  isFetching,
  onRefresh,
  hasCartItems,
  onClearCart,
}) => {
  return (
    <div className="flex flex-col gap-4 pb-4 border-b border-border/70">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="min-w-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1 flex-wrap">
            <span>Hệ thống</span>
            <span className="text-muted-foreground/30">/</span>
            <span>Bán hàng & Thu ngân</span>
            <span className="text-muted-foreground/30">/</span>
            <span className="text-foreground">POS Showroom</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
              <Store className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 flex-wrap">
                <span>Bán Hàng Tại Quầy & POS Showroom</span>
                <Badge
                  variant="outline"
                  className="text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-semibold hidden xs:inline-flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Sẵn sàng bán hàng
                </Badge>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                Giao diện thu ngân bán nhanh xe điện, pin ắc quy, phụ tùng và xuất hóa đơn tức thì
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="h-9 px-3 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
            title="Làm mới danh mục sản phẩm"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
            />
            <span className="text-xs font-medium hidden xs:inline">Làm mới</span>
            <span className="text-xs font-medium xs:hidden">Reload</span>
          </Button>

          {hasCartItems && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearCart}
              className="h-9 px-3 text-xs text-rose-600 border-rose-500/30 hover:bg-rose-500/10 cursor-pointer shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              <span>Xóa giỏ</span>
            </Button>
          )}
        </div>
      </div>

      {/* Quick Tab Switcher */}
      <div className="pt-1 max-w-full">
        <OrderNavTabs activeTab="sales" />
      </div>
    </div>
  );
};

export default SalesHeader;
