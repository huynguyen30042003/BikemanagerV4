"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Wrench,
  AlertTriangle,
  Package,
  Layers,
  ArrowRight,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Users,
  ChevronRight,
  ShieldCheck,
  Building2,
  Sparkles,
  BarChart3,
  PieChart,
  Calendar,
  Store,
  PlusCircle,
  FileText,
  BadgeAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { useGetDashboardOverview } from "@/hooks/Dashboard/useDashboardApi";
import { useGetKho } from "@/hooks/Kho/useKhoApi";
import { useGetDiaDiem } from "@/hooks/DiaDiem/useDiaDiemApi";
import {
  DashboardOverviewFilter,
  TimeRangeType,
} from "@/types/dashboard";
import { KHO_Kho } from "@/types/kho";
import { DM_DiaDiem } from "@/types/diaDiem";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function getFilterDates(range: TimeRangeType): { TuNgay: string | null; DenNgay: string | null } {
  if (range === "tat_ca") {
    return { TuNgay: null, DenNgay: null };
  }
  const now = new Date();
  if (range === "hom_nay") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    return { TuNgay: start.toISOString(), DenNgay: end.toISOString() };
  }
  if (range === "7_ngay") {
    const start = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { TuNgay: start.toISOString(), DenNgay: end.toISOString() };
  }
  if (range === "thang_nay") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    return { TuNgay: start.toISOString(), DenNgay: end.toISOString() };
  }
  if (range === "quy_nay") {
    const currentQuarter = Math.floor(now.getMonth() / 3);
    const start = new Date(now.getFullYear(), currentQuarter * 3, 1, 0, 0, 0);
    const end = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0, 23, 59, 59);
    return { TuNgay: start.toISOString(), DenNgay: end.toISOString() };
  }
  if (range === "nam_nay") {
    const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
    const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    return { TuNgay: start.toISOString(), DenNgay: end.toISOString() };
  }
  return { TuNgay: null, DenNgay: null };
}

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const [timeRange, setTimeRange] = useState<TimeRangeType>("tat_ca");
  const [selectedKhoId, setSelectedKhoId] = useState<string>("");
  const [selectedDiaDiemId, setSelectedDiaDiemId] = useState<string>("");

  const filter: DashboardOverviewFilter = useMemo(() => {
    const { TuNgay, DenNgay } = getFilterDates(timeRange);
    return {
      TuNgay,
      DenNgay,
      KhoID: selectedKhoId || null,
      DiaDiemID: selectedDiaDiemId || null,
      loaiThoiGian: timeRange,
    };
  }, [timeRange, selectedKhoId, selectedDiaDiemId]);

  const { data: dashboard, isLoading, isFetching, refetch } = useGetDashboardOverview(filter);

  const { data: khoData, isLoading: isLoadingKho } = useGetKho({ PageIndex: 1, PageSize: 100 });
  const { data: diaDiemData, isLoading: isLoadingDiaDiem } = useGetDiaDiem({ PageIndex: 1, PageSize: 100 });

  const khoList: KHO_Kho[] = useMemo(() => {
    if (Array.isArray(khoData?.data)) return khoData.data;
    if (Array.isArray(khoData?.items)) return khoData.items;
    if (Array.isArray(khoData)) return khoData;
    return [];
  }, [khoData]);

  const diaDiemList: DM_DiaDiem[] = useMemo(() => {
    if (Array.isArray(diaDiemData?.data)) return diaDiemData.data;
    if (Array.isArray(diaDiemData?.items)) return diaDiemData.items;
    if (Array.isArray(diaDiemData)) return diaDiemData;
    return [];
  }, [diaDiemData]);

  const diaDiemOptions: SelectOption[] = useMemo(() => {
    return [
      { value: "", label: "🏬 Tất cả chi nhánh" },
      ...diaDiemList.map((dd: DM_DiaDiem) => ({
        value: dd.diaDiemID,
        label: `📍 ${dd.tenDiaDiem}${dd.diaChiSo ? ` - ${dd.diaChiSo}` : ""}`,
      })),
    ];
  }, [diaDiemList]);

  const khoOptions: SelectOption[] = useMemo(() => {
    const filteredKhos = selectedDiaDiemId
      ? khoList.filter((k: KHO_Kho) => !k.diaDiemID || k.diaDiemID === selectedDiaDiemId)
      : khoList;

    return [
      { value: "", label: "🏢 Tất cả kho" },
      ...filteredKhos.map((kho: KHO_Kho) => ({
        value: kho.khoID,
        label: `📦 ${kho.tenKho} (${kho.maKho})`,
      })),
    ];
  }, [khoList, selectedDiaDiemId]);

  // Max value cho biểu đồ ngày
  const maxDayChartValue = useMemo(() => {
    if (!dashboard?.doanhThuTheoNgay || dashboard.doanhThuTheoNgay.length === 0) return 10000000;
    const maxVal = Math.max(...dashboard.doanhThuTheoNgay.map((d) => d.doanhThu));
    return maxVal > 0 ? maxVal * 1.15 : 10000000;
  }, [dashboard]);

  // Max value cho biểu đồ tháng
  const maxMonthChartValue = useMemo(() => {
    if (!dashboard?.doanhThuTheoThang || dashboard.doanhThuTheoThang.length === 0) return 50000000;
    const maxVal = Math.max(
      ...dashboard.doanhThuTheoThang.map((m) => Math.max(m.doanhThu, m.chiPhiNhap))
    );
    return maxVal > 0 ? maxVal * 1.15 : 50000000;
  }, [dashboard]);

  const kpi = dashboard?.kpi;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* 1. Header & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Tổng Quan Hoạt Động BikeManager
                <Badge
                  variant="outline"
                  className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                  Đồng bộ Realtime
                </Badge>
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Xin chào <span className="font-semibold text-foreground">{user?.fullName || user?.username || "Quản trị viên"}</span>, số liệu được tổng hợp trực tiếp từ hệ thống bán xe, xưởng dịch vụ và kho bãi.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Branch / Showroom SearchSelect */}
          <div className="w-[190px] sm:w-[220px]">
            <SearchSelect
              value={selectedDiaDiemId}
              options={diaDiemOptions}
              placeholder="🏬 Chọn chi nhánh..."
              isLoading={isLoadingDiaDiem}
              onChange={(val) => {
                const nextVal = String(val || "");
                setSelectedDiaDiemId(nextVal);
                if (nextVal && selectedKhoId) {
                  const currentKho = khoList.find((k: KHO_Kho) => k.khoID === selectedKhoId);
                  if (currentKho?.diaDiemID && currentKho.diaDiemID !== nextVal) {
                    setSelectedKhoId("");
                  }
                }
              }}
            />
          </div>

          {/* Warehouse SearchSelect */}
          <div className="w-[190px] sm:w-[220px]">
            <SearchSelect
              value={selectedKhoId}
              options={khoOptions}
              placeholder="🏢 Chọn kho hàng..."
              isLoading={isLoadingKho}
              onChange={(val) => setSelectedKhoId(String(val || ""))}
            />
          </div>

          {/* Time range preset tabs */}
          <div className="bg-muted/60 p-1 rounded-lg border border-border/70 flex items-center gap-1 shadow-xs">
            <button
              onClick={() => setTimeRange("tat_ca")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                timeRange === "tat_ca"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setTimeRange("hom_nay")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                timeRange === "hom_nay"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Hôm nay
            </button>
            <button
              onClick={() => setTimeRange("7_ngay")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                timeRange === "7_ngay"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              7 ngày
            </button>
            <button
              onClick={() => setTimeRange("thang_nay")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                timeRange === "thang_nay"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Tháng này
            </button>
            <button
              onClick={() => setTimeRange("quy_nay")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                timeRange === "quy_nay"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Quý này
            </button>
          </div>

          {/* Refresh button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-1.5 text-xs font-medium h-9 border-border/80 shadow-xs hover:bg-muted/70"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* 2. Primary KPI Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Card 1: Tổng Doanh Thu */}
          <Card className="p-4 border border-border/70 bg-gradient-to-br from-card to-blue-500/5 hover:border-blue-500/30 transition-all duration-300 shadow-xs relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Tổng Doanh Thu
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-foreground tracking-tight">
              {formatCurrency(kpi?.tongDoanhThu)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="text-muted-foreground text-[11px]">
                Hôm nay: <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(kpi?.doanhThuHomNay)}</strong>
              </span>
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground flex justify-between pt-2 border-t border-border/50">
              <span>Tháng này: {formatCurrency(kpi?.doanhThuThangNay)}</span>
            </div>
          </Card>

          {/* Card 2: Đơn Hàng */}
          <Card className="p-4 border border-border/70 bg-gradient-to-br from-card to-indigo-500/5 hover:border-indigo-500/30 transition-all duration-300 shadow-xs relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Đơn Bán Hàng
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <ShoppingCart className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-foreground tracking-tight">
              {kpi?.tongDonHang || 0} <span className="text-xs font-normal text-muted-foreground">đơn</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                +{kpi?.donHangHomNay || 0} đơn hôm nay
              </span>
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground flex justify-between pt-2 border-t border-border/50">
              <span className="text-amber-500 font-medium">Chờ xử lý: {kpi?.donHangChoXuLy || 0} đơn</span>
              <Link href="/admin/sales" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5">
                Xem <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </Card>

          {/* Card 3: Giá Trị Tồn Kho */}
          <Card className="p-4 border border-border/70 bg-gradient-to-br from-card to-emerald-500/5 hover:border-emerald-500/30 transition-all duration-300 shadow-xs relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Giá Trị Tồn Kho
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
              {formatCurrency(kpi?.tongGiaTriTonKho)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="text-muted-foreground text-[11px]">
                Tổng tồn: <strong className="text-foreground">{kpi?.tongSoLuongTon || 0}</strong> sản phẩm/xe
              </span>
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground flex justify-between pt-2 border-t border-border/50">
              <span className="text-rose-500 font-medium">Sắp hết: {kpi?.soMatHangSapHet || 0} SKU</span>
              <Link href="/admin/inventory" className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5">
                Kho <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </Card>

          {/* Card 4: Dịch Vụ Sửa Chữa */}
          <Card className="p-4 border border-border/70 bg-gradient-to-br from-card to-amber-500/5 hover:border-amber-500/30 transition-all duration-300 shadow-xs relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Xưởng Dịch Vụ
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Wrench className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400 tracking-tight">
              {kpi?.soPhieuSuaChuaDangXuLy || 0} <span className="text-xs font-normal text-muted-foreground">xe đang sửa</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="text-muted-foreground text-[11px]">
                Bảo hành đang xử lý: <strong className="text-blue-500">{kpi?.soPhieuBaoHanhDangXuLy || 0} phiếu</strong>
              </span>
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground flex justify-between pt-2 border-t border-border/50">
              <Link href="/admin/repair-tickets" className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5">
                Phiếu sửa chữa <ChevronRight className="w-3 h-3" />
              </Link>
              <Link href="/admin/warranties" className="text-blue-500 hover:underline">
                Bảo hành
              </Link>
            </div>
          </Card>

          {/* Card 5: Chi Phí Nhập Hàng */}
          <Card className="p-4 border border-border/70 bg-gradient-to-br from-card to-rose-500/5 hover:border-rose-500/30 transition-all duration-300 shadow-xs relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Chi Phí Nhập Hàng
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-rose-600 dark:text-rose-400 tracking-tight">
              {formatCurrency(kpi?.tongChiPhiNhapHang)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="text-muted-foreground text-[11px]">
                Nhập xe & linh kiện từ NCC
              </span>
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground flex justify-between pt-2 border-t border-border/50">
              <Link href="/admin/purchase-orders" className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5">
                Đơn nhập hàng <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </Card>

          {/* Card 6: Khách Hàng */}
          <Card className="p-4 border border-border/70 bg-gradient-to-br from-card to-purple-500/5 hover:border-purple-500/30 transition-all duration-300 shadow-xs relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Khách Hàng
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-purple-600 dark:text-purple-400 tracking-tight">
              {kpi?.tongKhachHang || 0} <span className="text-xs font-normal text-muted-foreground">khách</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                +{kpi?.khachHangMoiThangNay || 0} khách mới tháng này
              </span>
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground flex justify-between pt-2 border-t border-border/50">
              <Link href="/admin/customer" className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-0.5">
                Danh sách KH <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </Card>
        </div>
      )}

      {/* 3. Middle Section: Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doanh thu theo ngày (2 cols) */}
        <Card className="p-5 border border-border/70 lg:col-span-2 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Doanh Thu Bán Hàng Theo Ngày
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Thống kê doanh số bán xe và phụ tùng qua từng ngày
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                  <span className="text-muted-foreground">Doanh thu</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                  <span className="text-muted-foreground">Đã thanh toán</span>
                </div>
              </div>
            </div>

            {/* Daily Bar Chart */}
            {dashboard?.doanhThuTheoNgay && dashboard.doanhThuTheoNgay.length > 0 ? (
              <div className="pt-6 pb-2">
                <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-border/60">
                  {dashboard.doanhThuTheoNgay.map((item, idx) => {
                    const dtHeight = Math.min(100, Math.round((item.doanhThu / maxDayChartValue) * 100));
                    const ttHeight = Math.min(100, Math.round((item.daThanhToan / maxDayChartValue) * 100));
                    const dateFormatted = formatDate(item.ngay).split(" ")[0];

                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                        {/* Hover Tooltip */}
                        <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-[11px] p-2 rounded-md shadow-md border border-border pointer-events-none z-20 whitespace-nowrap">
                          <div className="font-semibold text-xs border-b pb-1 mb-1">{dateFormatted}</div>
                          <div className="text-blue-500 font-medium">Doanh thu: {formatCurrency(item.doanhThu)}</div>
                          <div className="text-emerald-500 font-medium">Đã thu: {formatCurrency(item.daThanhToan)}</div>
                          <div className="text-muted-foreground text-[10px]">Số đơn: {item.soDonHang}</div>
                        </div>

                        {/* Bars */}
                        <div className="w-full flex items-end justify-center gap-1 max-w-[42px] h-full">
                          <div
                            style={{ height: `${dtHeight}%` }}
                            className="w-1/2 bg-blue-500 hover:bg-blue-600 rounded-t-xs transition-all duration-500"
                            title={`Doanh thu: ${formatCurrency(item.doanhThu)}`}
                          />
                          <div
                            style={{ height: `${ttHeight}%` }}
                            className="w-1/2 bg-emerald-500 hover:bg-emerald-600 rounded-t-xs transition-all duration-500"
                            title={`Đã thu: ${formatCurrency(item.daThanhToan)}`}
                          />
                        </div>

                        <span className="text-[10px] text-muted-foreground mt-2 font-medium truncate max-w-[48px]">
                          {dateFormatted}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-56 flex flex-col items-center justify-center text-muted-foreground text-xs border border-dashed border-border/80 rounded-xl my-2">
                <BarChart3 className="w-8 h-8 text-muted-foreground/40 mb-2" />
                Chưa có dữ liệu doanh thu trong khoảng thời gian đã chọn
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-border/50 flex flex-wrap items-center justify-between text-xs text-muted-foreground">
            <span>Dữ liệu bán hàng cập nhật từ các chi nhánh</span>
            <span className="font-medium text-foreground">
              Doanh thu tháng này: <span className="text-blue-600 dark:text-blue-400 font-bold">{formatCurrency(kpi?.doanhThuThangNay)}</span>
            </span>
          </div>
        </Card>

        {/* Cơ cấu trạng thái đơn hàng (1 col) */}
        <Card className="p-5 border border-border/70 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <PieChart className="w-5 h-5 text-indigo-500" />
                Cơ Cấu Trạng Thái Đơn Hàng
              </h2>
              <span className="text-xs text-muted-foreground">Phân bổ</span>
            </div>

            {/* List trạng thái */}
            {dashboard?.coCauTrangThaiDonHang && dashboard.coCauTrangThaiDonHang.length > 0 ? (
              <div className="space-y-3.5">
                {dashboard.coCauTrangThaiDonHang.map((st, idx) => {
                  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
                  const color = colors[idx % colors.length];

                  return (
                    <div key={st.trangThaiID} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-medium text-foreground">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                          {st.tenTrangThai}
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-foreground">{st.soLuong} đơn</span>
                          <span className="text-muted-foreground text-[11px] ml-2">({formatCurrency(st.tongTien)})</span>
                        </div>
                      </div>
                      <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden">
                        <div
                          style={{
                            width: `${kpi?.tongDonHang ? Math.min(100, Math.round((st.soLuong / kpi.tongDonHang) * 100)) : 0}%`,
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
              <div className="py-12 flex flex-col items-center justify-center text-muted-foreground text-xs">
                <PieChart className="w-8 h-8 text-muted-foreground/40 mb-2" />
                Chưa có đơn hàng nào trong khoảng thời gian này
              </div>
            )}
          </div>

          {/* Doanh thu theo tháng so sánh với chi phí nhập */}
          {dashboard?.doanhThuTheoThang && dashboard.doanhThuTheoThang.length > 0 && (
            <div className="mt-6 pt-4 border-t border-border/60">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                Kinh doanh tháng gần nhất ({dashboard.doanhThuTheoThang[0].thang})
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="text-[10px] text-muted-foreground">Doanh thu</div>
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                    {formatCurrency(dashboard.doanhThuTheoThang[0].doanhThu)}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <div className="text-[10px] text-muted-foreground">Chi phí nhập</div>
                  <div className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                    {formatCurrency(dashboard.doanhThuTheoThang[0].chiPhiNhap)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* 4. Bottom Section: Actionable Operational Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Đơn hàng mới nhất */}
        <Card className="p-5 border border-border/70 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-500" />
                  Đơn Hàng Bán Mới Nhất
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Giao dịch mua bán xe & phụ tùng vừa phát sinh</p>
              </div>
              <Link href="/admin/sales">
                <Button variant="ghost" size="sm" className="text-xs gap-1 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10">
                  Tất cả đơn <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            {dashboard?.donHangMoiNhat && dashboard.donHangMoiNhat.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
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
                    {dashboard.donHangMoiNhat.map((dh) => (
                      <tr key={dh.donHangID} className="hover:bg-muted/40 transition-colors">
                        <td className="py-2.5 font-semibold text-foreground">
                          <Link href={`/admin/sales`} className="hover:text-blue-500 transition-colors">
                            {dh.maDonHang}
                          </Link>
                        </td>
                        <td className="py-2.5">
                          <div className="font-medium text-foreground">{dh.tenKhachHang}</div>
                          {dh.dienThoaiKhachHang && (
                            <div className="text-[11px] text-muted-foreground">{dh.dienThoaiKhachHang}</div>
                          )}
                        </td>
                        <td className="py-2.5 text-right font-bold text-foreground">
                          {formatCurrency(dh.tongTien)}
                        </td>
                        <td className="py-2.5 text-center">
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0.5 font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                          >
                            {dh.tenTrangThaiDonHang || "Đang xử lý"}
                          </Badge>
                          {dh.tenTrangThaiThanhToan && (
                            <div className="text-[9px] text-muted-foreground mt-0.5">
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
              <div className="py-12 flex flex-col items-center justify-center text-muted-foreground text-xs">
                <ShoppingCart className="w-8 h-8 text-muted-foreground/40 mb-2" />
                Chưa có đơn hàng nào
              </div>
            )}
          </div>
        </Card>

        {/* Top sản phẩm bán chạy */}
        <Card className="p-5 border border-border/70 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Top Sản Phẩm & Xe Bán Chạy
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Xếp hạng theo sản lượng đã xuất bán</p>
              </div>
              <Link href="/admin/products">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                  Xem sản phẩm <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            {dashboard?.topSanPhamBanChay && dashboard.topSanPhamBanChay.length > 0 ? (
              <div className="space-y-3">
                {dashboard.topSanPhamBanChay.map((sp, idx) => (
                  <div
                    key={sp.bienTheSanPhamID}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-border/50 hover:bg-muted/30 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
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
                        <div className="font-semibold text-xs text-foreground truncate">{sp.tenSanPham}</div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {sp.tenBienThe} ({sp.maSKU})
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-bold text-xs text-foreground">{formatCurrency(sp.tongDoanhThu)}</div>
                      <div className="text-[11px] text-muted-foreground">
                        Đã bán: <strong className="text-blue-600 dark:text-blue-400">{sp.soLuongDaBan}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-muted-foreground text-xs">
                <Package className="w-8 h-8 text-muted-foreground/40 mb-2" />
                Chưa có dữ liệu thống kê sản phẩm
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* 5. Cảnh báo tồn kho */}
      <Card className="p-5 border border-border/70 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              Cảnh Báo Hàng Sắp Hết Trong Kho
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Danh sách các phụ tùng và xe có số lượng tồn kho chạm hoặc thấp hơn định mức tối thiểu
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/purchase-orders">
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1 text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/10"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Tạo đơn nhập hàng
              </Button>
            </Link>
            <Link href="/admin/inventory">
              <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground hover:text-foreground">
                Xem kho <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {dashboard?.canhBaoTonKho && dashboard.canhBaoTonKho.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {dashboard.canhBaoTonKho.map((item) => (
              <div
                key={item.bienTheSanPhamID}
                className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-xs text-foreground truncate">{item.tenSanPham}</span>
                    {item.soLuong <= 0 && (
                      <Badge variant="outline" className="text-[9px] px-1 py-0 bg-rose-500 text-white font-semibold">
                        HẾT HÀNG
                      </Badge>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {item.tenBienThe} ({item.maSKU})
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    🏢 Kho: <strong className="text-foreground">{item.tenKho}</strong>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-rose-500/20 flex items-center justify-between text-xs">
                  <span className="text-rose-600 dark:text-rose-400 font-bold">
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
            Tất cả các mặt hàng hiện đều đạt định mức an toàn trong kho
          </div>
        )}
      </Card>
    </div>
  );
}
