"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "./types";

interface SalesFloatingCheckoutBarProps {
  totalItemCount: number;
  grandTotal: number;
  onOpenCart: () => void;
}

export const SalesFloatingCheckoutBar: React.FC<SalesFloatingCheckoutBarProps> = ({
  totalItemCount,
  grandTotal,
  onOpenCart,
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t border-border/80 p-3 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-200">
      <div className="min-w-0">
        <span className="text-[10px] uppercase font-bold text-muted-foreground block">
          Giỏ hàng ({totalItemCount} món)
        </span>
        <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-base truncate block">
          {formatCurrency(grandTotal)}
        </span>
      </div>

      <Button
        type="button"
        onClick={onOpenCart}
        className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95 transition-transform"
      >
        <span>Xem giỏ & Thanh toán</span>
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default SalesFloatingCheckoutBar;
