"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, PlusCircle, ChevronRight, CheckCircle2 } from "lucide-react";
import { DashboardTongQuanDto } from "@/types/dashboard";

interface DashboardStockWarningProps {
  dashboard?: DashboardTongQuanDto | null;
}

export const DashboardStockWarning: React.FC<DashboardStockWarningProps> = ({
  dashboard,
}) => {
  const hasWarnings =
    dashboard?.canhBaoTonKho && dashboard.canhBaoTonKho.length > 0;

  return (
    <Card className="p-4 sm:p-5 border border-border/70 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 shrink-0" />
            <span>Cảnh Báo Hàng Sắp Hết Trong Kho</span>
          </h3>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
            Danh sách các phụ tùng và xe có số lượng tồn kho chạm hoặc thấp hơn định mức tối thiểu
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link href="/admin/purchase-orders">
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1 text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/10 h-8 px-2.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Tạo đơn</span> nhập hàng
            </Button>
          </Link>
          <Link href="/admin/inventory">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs gap-1 text-muted-foreground hover:text-foreground h-8 px-2"
            >
              Xem kho <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {hasWarnings ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {dashboard!.canhBaoTonKho.map((item) => (
            <div
              key={item.bienTheSanPhamID}
              className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-xs text-foreground truncate">
                    {item.tenSanPham}
                  </span>
                  {item.soLuong <= 0 && (
                    <Badge
                      variant="outline"
                      className="text-[9px] px-1 py-0 bg-rose-500 text-white font-semibold shrink-0"
                    >
                      HẾT HÀNG
                    </Badge>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {item.tenBienThe} ({item.maSKU})
                </div>
                <div className="text-[11px] text-muted-foreground mt-1 truncate">
                  🏢 Kho: <strong className="text-foreground">{item.tenKho}</strong>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-rose-500/20 flex items-center justify-between text-xs">
                <span className="text-rose-600 dark:text-rose-400 font-bold text-[11px] sm:text-xs">
                  Tồn: {item.soLuong} / Tối thiểu {item.soLuongToiThieu}
                </span>
                <Link
                  href={`/admin/inventory?search=${encodeURIComponent(item.maSKU)}`}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  Thẻ kho <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 flex flex-col items-center justify-center text-muted-foreground text-xs">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-1.5" />
          <span>Tất cả các mặt hàng hiện đều đạt định mức an toàn trong kho</span>
        </div>
      )}
    </Card>
  );
};
