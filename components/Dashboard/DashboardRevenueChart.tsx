"use client";

import React from "react";
import { TrendingUp, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DashboardOverviewResponse, DashboardKPI } from "@/types/dashboard";
import { formatCurrency, formatDate } from "./dashboardUtils";

interface DashboardRevenueChartProps {
  dashboard?: DashboardOverviewResponse | null;
  kpi?: DashboardKPI | null;
  maxDayChartValue: number;
}

export function DashboardRevenueChart({
  dashboard,
  kpi,
  maxDayChartValue,
}: DashboardRevenueChartProps) {
  return (
    <Card className="p-4 sm:p-5 border border-border/70 lg:col-span-2 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/60 gap-3">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-blue-500" />
              Doanh Thu & Dòng Tiền Thực Thu
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Biểu đồ biến động 7 ngày gần nhất & tiến độ doanh thu tháng
            </p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-medium self-start sm:self-auto">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
              <span>Doanh thu xuất bán</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span>Thực thu đã nhận</span>
            </div>
          </div>
        </div>

        {/* Daily Bar Chart */}
        {dashboard?.doanhThuTheoNgay && dashboard.doanhThuTheoNgay.length > 0 ? (
          <div className="pt-6 pb-2 overflow-x-auto">
            <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-border/60 min-w-[340px]">
              {dashboard.doanhThuTheoNgay.map((item, idx) => {
                const dtHeight = Math.min(
                  100,
                  Math.round((item.doanhThu / maxDayChartValue) * 100)
                );
                const ttHeight = Math.min(
                  100,
                  Math.round((item.daThanhToan / maxDayChartValue) * 100)
                );
                const dateFormatted = formatDate(item.ngay).split(" ")[0];

                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center h-full justify-end group relative min-w-[36px]"
                  >
                    {/* Hover Tooltip */}
                    <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-[11px] p-2 rounded-md shadow-md border border-border pointer-events-none z-20 whitespace-nowrap">
                      <div className="font-semibold text-xs border-b pb-1 mb-1">
                        {dateFormatted}
                      </div>
                      <div className="text-blue-500 font-medium">
                        Doanh thu: {formatCurrency(item.doanhThu)}
                      </div>
                      <div className="text-emerald-500 font-medium">
                        Đã thu: {formatCurrency(item.daThanhToan)}
                      </div>
                      <div className="text-muted-foreground text-[10px]">
                        Số đơn: {item.soDonHang}
                      </div>
                    </div>

                    {/* Bars */}
                    <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full pb-2">
                      <div
                        style={{ height: `${Math.max(dtHeight, 4)}%` }}
                        className="w-2 sm:w-3.5 bg-blue-500 rounded-t-sm hover:brightness-110 transition-all"
                      />
                      <div
                        style={{ height: `${Math.max(ttHeight, 4)}%` }}
                        className="w-2 sm:w-3.5 bg-emerald-500 rounded-t-sm hover:brightness-110 transition-all"
                      />
                    </div>

                    {/* Ngày */}
                    <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground truncate w-full text-center">
                      {dateFormatted}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="h-56 flex flex-col items-center justify-center text-muted-foreground text-xs gap-2">
            <BarChart3 className="w-8 h-8 opacity-40" />
            <span>Chưa có dữ liệu biểu đồ doanh thu theo ngày</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-border/50 flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2">
        <span>Dữ liệu bán hàng cập nhật từ các chi nhánh</span>
        <span className="font-medium text-foreground">
          Doanh thu tháng này:{" "}
          <span className="text-blue-600 dark:text-blue-400 font-bold">
            {formatCurrency(kpi?.doanhThuThangNay)}
          </span>
        </span>
      </div>
    </Card>
  );
}

export default DashboardRevenueChart;
