"use client";

import React, { Suspense, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useThongKeKhachHang } from "@/hooks/ThongKeKhachHang/useThongKeKhachHang";
import { KH_ThongKeKhachHang, ThongKeKhachHangKPI } from "@/types/thongKeKhachHang";
import {
  CustomerStatisticsKpiGrid,
  CustomerStatisticsFilterBar,
  CustomerStatisticsTable,
  CustomerStatisticsGrid,
  CustomerStatisticsSkeleton,
  UpdateCustomerStatisticsSlideOver,
  ViewMode,
} from "@/components/Customer/Statistics";

function StatisticsContent() {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    tierFilter,
    setTierFilter,
    searchInput,
    handleSearch,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    kpiData,
    isLoadingKPI,
    refetchKPI,
  } = useThongKeKhachHang();

  // Local state for modals to isolate form re-renders
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<KH_ThongKeKhachHang | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  // Fallback in-memory calculations
  const vipCount = useMemo(
    () =>
      items.filter(
        (i) => i.hangKhachHang === "Vang" || i.hangKhachHang === "KimCuong"
      ).length,
    [items]
  );

  const totalSpent = useMemo(
    () => items.reduce((acc, cur) => acc + (cur.tongTienDaChi || 0), 0),
    [items]
  );

  const totalDebt = useMemo(
    () => items.reduce((acc, cur) => acc + (cur.congNoHienTai || 0), 0),
    [items]
  );

  const debtCustomersCount = useMemo(
    () => items.filter((cur) => (cur.congNoHienTai || 0) > 0).length,
    [items]
  );

  // Exact metrics from GetKPI API: {{base_url}}/api/ThongKeKhachHangApi/GetKPI
  const kpi = kpiData as unknown as (ThongKeKhachHangKPI & { data?: ThongKeKhachHangKPI }) | undefined;
  const kpiMetrics = kpi?.data ?? kpi;

  const total_ThongKeKhachHang =
    kpiMetrics?.total_ThongKeKhachHang ?? totalCount;
  const total_HoiVienVip = kpiMetrics?.total_HoiVienVip ?? vipCount;
  const total_TongTienDaChi = kpiMetrics?.total_TongTienDaChi ?? totalSpent;
  const total_CongNoHienTai = kpiMetrics?.total_CongNoHienTai ?? totalDebt;
  const total_KhachCoCongNo =
    kpiMetrics?.total_KhachCoCongNo ?? debtCustomersCount;

  const handleReload = () => {
    refetch();
    refetchKPI();
  };

  const handleResetFilters = () => {
    handleSearch("");
    setTierFilter("all");
    setPage(1);
  };

  const hasActiveFilters = Boolean(searchInput || tierFilter !== "all");

  return (
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-4 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header & Thanh lọc tìm kiếm (Tối ưu Responsive Nút 3 gạch & Switch ViewMode) */}
      <CustomerStatisticsFilterBar
        totalThongKeKhachHang={total_ThongKeKhachHang}
        searchInput={searchInput}
        onSearch={handleSearch}
        tierFilter={tierFilter}
        onTierFilterChange={(tier) => {
          setTierFilter(tier);
          setPage(1);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefresh={handleReload}
        isFetching={isFetching}
        isLoadingKPI={isLoadingKPI}
        onResetFilters={handleResetFilters}
      />

      {/* 2. Dải 5 KPI Ribbon Thống Kê (Config-driven dùng KpiRibbon & .map) */}
      <CustomerStatisticsKpiGrid
        totalThongKeKhachHang={total_ThongKeKhachHang}
        totalHoiVienVip={total_HoiVienVip}
        totalTongTienDaChi={total_TongTienDaChi}
        totalCongNoHienTai={total_CongNoHienTai}
        totalKhachCoCongNo={total_KhachCoCongNo}
        tierFilter={tierFilter}
        onSelectTier={(tier) => {
          setTierFilter(tier);
          setPage(1);
        }}
        isLoadingKPI={isLoadingKPI}
        isLoading={isLoading}
      />

      {/* 3. Chế độ hiển thị kép: Bảng dữ liệu hoặc Lưới thẻ (Anti-Blowout Table & Responsive Cards) */}
      {isLoading ? (
        <CustomerStatisticsSkeleton viewMode={viewMode} />
      ) : viewMode === "grid" ? (
        <CustomerStatisticsGrid
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onEdit={(item) => {
            setSelectedItem(item);
            setOpenUpdate(true);
          }}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      ) : (
        <CustomerStatisticsTable
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onEdit={(item) => {
            setSelectedItem(item);
            setOpenUpdate(true);
          }}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      {/* 4. SlideOver: Điều chỉnh Hạng thẻ & Công nợ (Cô lập form state) */}
      <UpdateCustomerStatisticsSlideOver
        open={openUpdate}
        onClose={() => {
          setOpenUpdate(false);
          setSelectedItem(null);
        }}
        data={selectedItem}
        onSuccess={handleReload}
      />
    </div>
  );
}

export default function CustomerStatisticsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-4 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <StatisticsContent />
    </Suspense>
  );
}

