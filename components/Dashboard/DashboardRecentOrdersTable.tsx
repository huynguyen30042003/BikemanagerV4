"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { DashboardTongQuanDto } from "@/types/dashboard";
import { formatCurrency, formatDate } from "./dashboardUtils";

interface DashboardRecentOrdersTableProps {
  dashboard?: DashboardTongQuanDto | null;
}

export const DashboardRecentOrdersTable: React.FC<DashboardRecentOrdersTableProps> = ({
  dashboard,
}) => {
  const hasOrders =
    dashboard?.donHangMoiNhat && dashboard.donHangMoiNhat.length > 0;

  return (
    <Card className="p-4 sm:p-5 border border-border/70 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 shrink-0" />
              <span>Đơn Hàng Bán Mới Nhất</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
              Giao dịch mua bán xe & phụ tùng vừa phát sinh
            </p>
          </div>
          <Link href="/admin/sales" className="self-start sm:self-auto">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs gap-1 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 px-2 h-8"
            >
              Tất cả đơn <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {hasOrders ? (
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full text-xs min-w-[520px]">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground text-left">
                  <th className="pb-2 font-semibold">Mã đơn</th>
                  <th className="pb-2 font-semibold">Khách hàng</th>
                  <th className="pb-2 font-semibold text-right">Tổng tiền</th>
                  <th className="pb-2 font-semibold text-center">Trạng thái</th>
                  <th className="pb-2 font-semibold text-right">Ngày tạo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {dashboard!.donHangMoiNhat.map((dh) => (
                  <tr
                    key={dh.donHangID}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <td className="py-2.5 font-semibold text-foreground">
                      <Link
                        href="/admin/sales"
                        className="hover:text-blue-500 transition-colors font-mono"
                      >
                        {dh.maDonHang}
                      </Link>
                    </td>
                    <td className="py-2.5 max-w-[160px]">
                      <div className="font-medium text-foreground truncate">
                        {dh.tenKhachHang}
                      </div>
                      {dh.dienThoaiKhachHang && (
                        <div className="text-[11px] text-muted-foreground font-mono">
                          {dh.dienThoaiKhachHang}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 text-right font-bold text-foreground whitespace-nowrap">
                      {formatCurrency(dh.tongTien)}
                    </td>
                    <td className="py-2.5 text-center">
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0.5 font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 whitespace-nowrap"
                      >
                        {dh.tenTrangThaiDonHang || "Đang xử lý"}
                      </Badge>
                      {dh.tenTrangThaiThanhToan && (
                        <div className="text-[9px] text-muted-foreground mt-0.5 whitespace-nowrap">
                          {dh.tenTrangThaiThanhToan}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 text-right text-muted-foreground whitespace-nowrap">
                      {formatDate(dh.ngayTaoLap)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 sm:py-12 flex flex-col items-center justify-center text-muted-foreground text-xs">
            <ShoppingCart className="w-8 h-8 text-muted-foreground/40 mb-2" />
            <span>Chưa có đơn hàng nào</span>
          </div>
        )}
      </div>
    </Card>
  );
};
