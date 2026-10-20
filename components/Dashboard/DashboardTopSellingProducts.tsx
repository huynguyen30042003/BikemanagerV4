"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronRight, Package } from "lucide-react";
import { DashboardTongQuanDto } from "@/types/dashboard";
import { formatCurrency } from "./dashboardUtils";

interface DashboardTopSellingProductsProps {
  dashboard?: DashboardTongQuanDto | null;
}

export const DashboardTopSellingProducts: React.FC<DashboardTopSellingProductsProps> = ({
  dashboard,
}) => {
  const hasProducts =
    dashboard?.topSanPhamBanChay && dashboard.topSanPhamBanChay.length > 0;

  return (
    <Card className="p-4 sm:p-5 border border-border/70 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
              <span>Top Sản Phẩm & Xe Bán Chạy</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
              Xếp hạng theo sản lượng đã xuất bán
            </p>
          </div>
          <Link href="/admin/products" className="self-start sm:self-auto">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground px-2 h-8"
            >
              Xem sản phẩm <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {hasProducts ? (
          <div className="space-y-2.5 sm:space-y-3">
            {dashboard!.topSanPhamBanChay.map((sp, idx) => (
              <div
                key={sp.bienTheSanPhamID}
                className="flex items-center justify-between p-2.5 rounded-xl border border-border/50 hover:bg-muted/30 transition-all gap-2.5"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                      idx === 0
                        ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                        : idx === 1
                          ? "bg-slate-400/20 text-slate-600 dark:text-slate-300 border border-slate-400/30"
                          : idx === 2
                            ? "bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    #{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-xs text-foreground truncate">
                      {sp.tenSanPham}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {sp.tenBienThe} ({sp.maSKU})
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-bold text-xs text-foreground whitespace-nowrap">
                    {formatCurrency(sp.tongDoanhThu)}
                  </div>
                  <div className="text-[11px] text-muted-foreground whitespace-nowrap">
                    Đã bán:{" "}
                    <strong className="text-blue-600 dark:text-blue-400">
                      {sp.soLuongDaBan}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 sm:py-12 flex flex-col items-center justify-center text-muted-foreground text-xs">
            <Package className="w-8 h-8 text-muted-foreground/40 mb-2" />
            <span>Chưa có dữ liệu thống kê sản phẩm</span>
          </div>
        )}
      </div>
    </Card>
  );
};
