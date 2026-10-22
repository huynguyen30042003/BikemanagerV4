"use client";

import React, { useState, useMemo, useEffect } from "react";
import { TrendingUp, BarChart3, Table as TableIcon, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DashboardOverviewResponse, DashboardKPI, TimeRangeType } from "@/types/dashboard";
import { formatCurrency } from "./dashboardUtils";

interface DashboardRevenueChartProps {
  dashboard?: DashboardOverviewResponse | null;
  kpi?: DashboardKPI | null;
  maxDayChartValue?: number;
  timeRange?: TimeRangeType;
}

// Helper format chuỗi ngày an toàn không bị lỗi timezone hay thư viện
function formatDayLabel(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    const parts = dateStr.split("T")[0].split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}`;
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      return `${dd}/${mm}`;
    }
    return dateStr;
  } catch {
    return String(dateStr);
  }
}

function formatDayFull(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    const parts = dateStr.split("T")[0].split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    }
    return dateStr;
  } catch {
    return String(dateStr);
  }
}

function formatMonthLabel(monthStr: string | null | undefined): string {
  if (!monthStr) return "—";
  const parts = monthStr.split("-");
  if (parts.length === 2) {
    return `T${parts[1]}/${parts[0].slice(2)}`;
  }
  return monthStr;
}

function formatMonthFull(monthStr: string | null | undefined): string {
  if (!monthStr) return "—";
  const parts = monthStr.split("-");
  if (parts.length === 2) {
    return `Tháng ${parts[1]}/${parts[0]}`;
  }
  return monthStr;
}

export function DashboardRevenueChart({
  dashboard,
  kpi,
  timeRange = "tat_ca",
}: DashboardRevenueChartProps) {
  // Khi chọn "Tất cả" hoặc "Năm nay", mặc định hiển thị theo Tháng.
  // Khi chọn "Hôm nay", "7 ngày", "Tháng này", mặc định hiển thị theo Ngày.
  const [viewMode, setViewMode] = useState<"thang" | "ngay">(() => {
    return timeRange === "tat_ca" || timeRange === "nam_nay" ? "thang" : "ngay";
  });

  const [displayType, setDisplayType] = useState<"chart" | "table">("chart");

  // Đồng bộ viewMode khi filter timeRange thay đổi
  useEffect(() => {
    if (timeRange === "tat_ca" || timeRange === "nam_nay") {
      setViewMode("thang");
    } else {
      setViewMode("ngay");
    }
  }, [timeRange]);

  const dailyData = dashboard?.doanhThuTheoNgay || [];
  const monthlyData = dashboard?.doanhThuTheoThang || [];

  // Tính toán scale tối đa cho biểu đồ theo chế độ xem
  const maxValue = useMemo(() => {
    if (viewMode === "thang") {
      if (!monthlyData.length) return 10000000;
      const maxVal = Math.max(
        ...monthlyData.map((m) => Math.max(m.doanhThu || 0, m.chiPhiNhap || 0))
      );
      return maxVal > 0 ? maxVal * 1.15 : 10000000;
    } else {
      if (!dailyData.length) return 10000000;
      const maxVal = Math.max(
        ...dailyData.map((d) => Math.max(d.doanhThu || 0, d.daThanhToan || 0))
      );
      return maxVal > 0 ? maxVal * 1.15 : 10000000;
    }
  }, [viewMode, monthlyData, dailyData]);

  // Phụ đề động theo ngữ cảnh
  const subtitle = useMemo(() => {
    if (viewMode === "thang") {
      return "Phân tích doanh thu & chi phí nhập hàng theo từng tháng";
    }
    if (timeRange === "tat_ca") {
      return "Chi tiết biến động doanh thu & thực thu các ngày có giao dịch";
    }
    if (timeRange === "hom_nay") {
      return "Doanh thu và dòng tiền thực thu phát sinh trong hôm nay";
    }
    if (timeRange === "7_ngay") {
      return "Biến động doanh thu & thực thu 7 ngày gần nhất";
    }
    return "Biến động doanh thu bán hàng & thực thu theo ngày";
  }, [viewMode, timeRange]);

  return (
    <Card className="p-4 sm:p-5 border border-border/70 lg:col-span-2 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header với Tiêu đề, Toggle Ngày/Tháng và Nút Biểu đồ/Bảng */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/60 gap-3">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-blue-500 shrink-0" />
              <span>Doanh Thu & Dòng Tiền Thực Thu</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {/* Chuyển đổi Theo tháng / Theo ngày */}
            <div className="bg-muted/70 p-0.5 rounded-lg border border-border/60 flex items-center gap-0.5 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("thang")}
                className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  viewMode === "thang"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Theo tháng {monthlyData.length > 0 && `(${monthlyData.length})`}
              </button>
              <button
                type="button"
                onClick={() => setViewMode("ngay")}
                className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  viewMode === "ngay"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Theo ngày {dailyData.length > 0 && `(${dailyData.length})`}
              </button>
            </div>

            {/* Chuyển đổi Biểu đồ / Bảng */}
            <div className="bg-muted/70 p-0.5 rounded-lg border border-border/60 flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => setDisplayType("chart")}
                title="Xem dạng biểu đồ cột"
                className={`p-1 rounded-md transition-all cursor-pointer ${
                  displayType === "chart"
                    ? "bg-card text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDisplayType("table")}
                title="Xem dạng bảng số liệu"
                className={`p-1 rounded-md transition-all cursor-pointer ${
                  displayType === "table"
                    ? "bg-card text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium pt-3 pb-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
            <span>Doanh thu xuất bán</span>
          </div>
          {viewMode === "thang" ? (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
              <span>Chi phí nhập hàng</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span>Thực thu đã nhận</span>
            </div>
          )}
        </div>

        {/* VÙNG HIỂN THỊ NỘI DUNG (BIỂU ĐỒ HOẶC BẢNG) */}
        {displayType === "chart" ? (
          viewMode === "thang" ? (
            /* BIỂU ĐỒ THEO THÁNG */
            monthlyData.length > 0 ? (
              <div className="pt-4 pb-2 overflow-x-auto">
                <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-border/60 min-w-[340px]">
                  {monthlyData.map((item, idx) => {
                    const dtHeight = Math.min(
                      100,
                      Math.round(((item.doanhThu || 0) / maxValue) * 100)
                    );
                    const cpHeight = Math.min(
                      100,
                      Math.round(((item.chiPhiNhap || 0) / maxValue) * 100)
                    );
                    const monthFull = formatMonthFull(item.thang);
                    const monthLabel = formatMonthLabel(item.thang);
                    const grossProfit = (item.doanhThu || 0) - (item.chiPhiNhap || 0);

                    return (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center h-full justify-end group relative min-w-[42px]"
                      >
                        {/* Hover Tooltip */}
                        <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-[11px] p-2 rounded-md shadow-md border border-border pointer-events-none z-20 whitespace-nowrap min-w-[130px]">
                          <div className="font-semibold text-xs border-b pb-1 mb-1">
                            {monthFull}
                          </div>
                          <div className="text-blue-500 font-medium">
                            Doanh thu: {formatCurrency(item.doanhThu)}
                          </div>
                          <div className="text-amber-500 font-medium">
                            Chi phí nhập: {formatCurrency(item.chiPhiNhap)}
                          </div>
                          <div className="text-emerald-500 font-medium border-t border-border/40 mt-1 pt-1">
                            Lợi nhuận gộp: {formatCurrency(grossProfit)}
                          </div>
                          <div className="text-muted-foreground text-[10px] mt-0.5">
                            Số đơn hàng: {item.soDonHang} đơn
                          </div>
                        </div>

                        {/* Cột kép: Doanh thu & Chi phí nhập */}
                        <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full pb-2">
                          <div
                            style={{ height: `${Math.max(dtHeight, 4)}%` }}
                            className="w-2.5 sm:w-4 bg-blue-500 rounded-t-sm hover:brightness-110 transition-all shadow-2xs"
                          />
                          <div
                            style={{ height: `${Math.max(cpHeight, item.chiPhiNhap > 0 ? 4 : 0)}%` }}
                            className="w-2.5 sm:w-4 bg-amber-500 rounded-t-sm hover:brightness-110 transition-all shadow-2xs"
                          />
                        </div>

                        {/* Label Tháng */}
                        <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground truncate w-full text-center">
                          {monthLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-56 flex flex-col items-center justify-center text-muted-foreground text-xs gap-2">
                <BarChart3 className="w-8 h-8 opacity-40" />
                <span>Chưa có dữ liệu doanh thu theo tháng</span>
              </div>
            )
          ) : (
            /* BIỂU ĐỒ THEO NGÀY */
            dailyData.length > 0 ? (
              <div className="pt-4 pb-2 overflow-x-auto">
                <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-border/60 min-w-[340px]">
                  {dailyData.map((item, idx) => {
                    const dtHeight = Math.min(
                      100,
                      Math.round(((item.doanhThu || 0) / maxValue) * 100)
                    );
                    const ttHeight = Math.min(
                      100,
                      Math.round(((item.daThanhToan || 0) / maxValue) * 100)
                    );
                    const dateFull = formatDayFull(item.ngay);
                    const dateLabel = formatDayLabel(item.ngay);
                    const unpaid = Math.max(0, (item.doanhThu || 0) - (item.daThanhToan || 0));

                    return (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center h-full justify-end group relative min-w-[38px]"
                      >
                        {/* Hover Tooltip */}
                        <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-[11px] p-2 rounded-md shadow-md border border-border pointer-events-none z-20 whitespace-nowrap min-w-[130px]">
                          <div className="font-semibold text-xs border-b pb-1 mb-1">
                            {dateFull}
                          </div>
                          <div className="text-blue-500 font-medium">
                            Doanh thu: {formatCurrency(item.doanhThu)}
                          </div>
                          <div className="text-emerald-500 font-medium">
                            Đã thu: {formatCurrency(item.daThanhToan)}
                          </div>
                          {unpaid > 0 && (
                            <div className="text-amber-500 font-medium">
                              Còn nợ: {formatCurrency(unpaid)}
                            </div>
                          )}
                          <div className="text-muted-foreground text-[10px] mt-0.5">
                            Số đơn hàng: {item.soDonHang} đơn
                          </div>
                        </div>

                        {/* Cột kép: Doanh thu & Thực thu */}
                        <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full pb-2">
                          <div
                            style={{ height: `${Math.max(dtHeight, 4)}%` }}
                            className="w-2 sm:w-3.5 bg-blue-500 rounded-t-sm hover:brightness-110 transition-all shadow-2xs"
                          />
                          <div
                            style={{ height: `${Math.max(ttHeight, item.daThanhToan > 0 ? 4 : 0)}%` }}
                            className="w-2 sm:w-3.5 bg-emerald-500 rounded-t-sm hover:brightness-110 transition-all shadow-2xs"
                          />
                        </div>

                        {/* Label Ngày */}
                        <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground truncate w-full text-center">
                          {dateLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-56 flex flex-col items-center justify-center text-muted-foreground text-xs gap-2">
                <BarChart3 className="w-8 h-8 opacity-40" />
                <span>Chưa có dữ liệu doanh thu theo ngày</span>
              </div>
            )
          )
        ) : (
          /* BẢNG DỮ LIỆU CHI TIẾT (TABLE VIEW) */
          <div className="pt-3 pb-2">
            <div className="overflow-x-auto max-h-56 border border-border/60 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/80 text-muted-foreground sticky top-0 border-b border-border/60 font-medium z-10">
                  {viewMode === "thang" ? (
                    <tr>
                      <th className="py-2 px-3">Tháng</th>
                      <th className="py-2 px-3 text-center">Số đơn</th>
                      <th className="py-2 px-3 text-right">Doanh thu</th>
                      <th className="py-2 px-3 text-right">Chi phí nhập</th>
                      <th className="py-2 px-3 text-right">Lợi nhuận gộp</th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="py-2 px-3">Ngày</th>
                      <th className="py-2 px-3 text-center">Số đơn</th>
                      <th className="py-2 px-3 text-right">Doanh thu</th>
                      <th className="py-2 px-3 text-right">Đã thanh toán</th>
                      <th className="py-2 px-3 text-right">Còn lại</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-border/40">
                  {viewMode === "thang" ? (
                    monthlyData.length > 0 ? (
                      monthlyData.map((item, idx) => {
                        const grossProfit = (item.doanhThu || 0) - (item.chiPhiNhap || 0);
                        return (
                          <tr key={idx} className="hover:bg-muted/30 transition-colors">
                            <td className="py-2 px-3 font-semibold text-foreground flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-blue-500" />
                              {formatMonthFull(item.thang)}
                            </td>
                            <td className="py-2 px-3 text-center font-medium">
                              <span className="px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-semibold">
                                {item.soDonHang}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-right font-bold text-blue-600 dark:text-blue-400">
                              {formatCurrency(item.doanhThu)}
                            </td>
                            <td className="py-2 px-3 text-right font-medium text-amber-600 dark:text-amber-400">
                              {formatCurrency(item.chiPhiNhap)}
                            </td>
                            <td className="py-2 px-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(grossProfit)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-muted-foreground">
                          Không có dữ liệu theo tháng
                        </td>
                      </tr>
                    )
                  ) : dailyData.length > 0 ? (
                    dailyData.map((item, idx) => {
                      const unpaid = Math.max(0, (item.doanhThu || 0) - (item.daThanhToan || 0));
                      return (
                        <tr key={idx} className="hover:bg-muted/30 transition-colors">
                          <td className="py-2 px-3 font-semibold text-foreground flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-blue-500" />
                            {formatDayFull(item.ngay)}
                          </td>
                          <td className="py-2 px-3 text-center font-medium">
                            <span className="px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-semibold">
                              {item.soDonHang}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(item.doanhThu)}
                          </td>
                          <td className="py-2 px-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(item.daThanhToan)}
                          </td>
                          <td className="py-2 px-3 text-right font-medium text-muted-foreground">
                            {unpaid > 0 ? (
                              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                                {formatCurrency(unpaid)}
                              </span>
                            ) : (
                              <span className="text-emerald-500 font-medium">0 đ</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-muted-foreground">
                        Không có dữ liệu theo ngày
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Footer tổng kết dữ liệu */}
      <div className="pt-3 border-t border-border/50 flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2">
        <span>
          {timeRange === "tat_ca"
            ? "Dữ liệu lũy kế toàn thời gian từ tất cả chi nhánh"
            : "Dữ liệu bán hàng cập nhật từ các chi nhánh trực thuộc"}
        </span>
        <div className="flex items-center gap-3">
          {timeRange === "tat_ca" ? (
            <span className="font-medium text-foreground">
              Tổng doanh thu toàn bộ:{" "}
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {formatCurrency(kpi?.tongDoanhThu)}
              </span>
            </span>
          ) : timeRange === "hom_nay" ? (
            <span className="font-medium text-foreground">
              Doanh thu hôm nay:{" "}
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {formatCurrency(kpi?.doanhThuHomNay)}
              </span>
            </span>
          ) : (
            <span className="font-medium text-foreground">
              Doanh thu tháng này:{" "}
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {formatCurrency(kpi?.doanhThuThangNay)}
              </span>
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

export default DashboardRevenueChart;
