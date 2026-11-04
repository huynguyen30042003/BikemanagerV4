"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DH_DonHang } from "@/types/donHang";
import { OrderPurchasedItemsCard } from "@/components/Customer/Detail/OrderPurchasedItemsCard";

export interface CustomerPurchasedOrdersTabProps {
  orders: DH_DonHang[];
  isLoading: boolean;
}

export const CustomerPurchasedOrdersTab: React.FC<CustomerPurchasedOrdersTabProps> =
  React.memo(({ orders, isLoading }) => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <Card className="p-8 sm:p-10 rounded-2xl border border-border/80 bg-card text-center space-y-2">
          <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto stroke-[1.5]" />
          <div className="text-sm font-semibold text-foreground">
            Chưa có lịch sử đơn hàng đã mua
          </div>
          <p className="text-xs text-muted-foreground">
            Khách hàng chưa phát sinh hóa đơn mua xe hoặc phụ tùng tại cửa hàng.
          </p>
        </Card>
      );
    }

    return (
      <div className="space-y-3">
        {orders.map((order, idx) => (
          <OrderPurchasedItemsCard
            key={order.donHangID}
            donHang={order}
            defaultExpanded={idx === 0}
          />
        ))}
      </div>
    );
  });

CustomerPurchasedOrdersTab.displayName = "CustomerPurchasedOrdersTab";

