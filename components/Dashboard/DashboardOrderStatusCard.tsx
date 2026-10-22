"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import { DashboardTongQuanDto, DashboardKpiDto } from "@/types/dashboard";
import { formatCurrency } from "./dashboardUtils";

interface DashboardOrderStatusCardProps {
  dashboard?: DashboardTongQuanDto | null;
  kpi?: DashboardKpiDto | null;
}

const STATUS_COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
];

export const DashboardOrderStatusCard: React.FC<
  DashboardOrderStatusCardProps
> = ({ dashboard, kpi }) => {
  const hasStatusList =
    dashboard?.coCauTrangThaiDonHang &&
    dashboard.coCauTrangThaiDonHang.length > 0;

  const latestMonthData =
    dashboard?.doanhThuTheoThang && dashboard.doanhThuTheoThang.length > 0
      ? dashboard.doanhThuTheoThang[dashboard.doanhThuTheoThang.length - 2]
      : null;

  return (
    <Card className="p-4 sm:p-5 border border-border/70 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
            <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 shrink-0" />
            <span>Cơ Cấu Trạng Thái Đơn Hàng</span>
          </h2>
          <span className="text-[11px] sm:text-xs text-muted-foreground">
            Phân bổ
          </span>
        </div>

        {/* List trạng thái */}
        {hasStatusList ? (
          <div className="space-y-3 sm:space-y-3.5">
            {dashboard!.coCauTrangThaiDonHang.map((st, idx) => {
              const color = STATUS_COLORS[idx % STATUS_COLORS.length];
              const totalOrders = kpi?.tongDonHang ?? 0;
              const percentage =
                totalOrders > 0
                  ? Math.min(100, Math.round((st.soLuong / totalOrders) * 100))
                  : 0;

              return (
                <div key={st.trangThaiID} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-2 font-medium text-foreground min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="truncate">{st.tenTrangThai}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-semibold text-foreground">
                        {st.soLuong} đơn
                      </span>
                      <span className="text-muted-foreground text-[10px] sm:text-[11px] ml-1.5 sm:ml-2 hidden xs:inline">
                        ({formatCurrency(st.tongTien)})
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                      }}
                      className="h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10 sm:py-12 flex flex-col items-center justify-center text-muted-foreground text-xs">
            <PieChart className="w-8 h-8 text-muted-foreground/40 mb-2" />
            <span>Chưa có đơn hàng nào trong khoảng thời gian này</span>
          </div>
        )}
      </div>

      {/* Doanh thu theo tháng so sánh với chi phí nhập */}
      {latestMonthData && (
        <div className="mt-5 pt-4 border-t border-border/60">
          <div className="text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
            Kinh doanh tháng gần nhất ({latestMonthData.thang})
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="text-[10px] text-muted-foreground">Doanh thu</div>
              <div className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5 truncate">
                {formatCurrency(latestMonthData.doanhThu)}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <div className="text-[10px] text-muted-foreground">
                Chi phí nhập
              </div>
              <div className="text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 mt-0.5 truncate">
                {formatCurrency(latestMonthData.chiPhiNhap)}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
