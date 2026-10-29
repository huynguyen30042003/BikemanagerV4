"use client";

import React, { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useKhachHang } from "@/hooks/KhachHang/useKhachHang";
import { KH_KhachHang } from "@/types/khachHang";
import {
  CustomerFilterBar,
  CustomerKpiGrid,
  CustomerGrid,
  CustomerTable,
  CustomerSkeleton,
  CreateCustomerSlideOver,
  UpdateCustomerSlideOver,
  ViewMode,
} from "@/components/Customer";

function CustomerContent() {
  const searchParams = useSearchParams();
  const initialTinhId = searchParams.get("tinhId") || undefined;

  // Cô lập hoàn toàn state đóng/mở Modal khỏi Form State để chống Re-render Trap
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<KH_KhachHang | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const {
    // Phân trang & Tìm kiếm & Bộ lọc
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    loaiFilter,
    setLoaiFilter,
    tinhFilter,
    setTinhFilter,
    searchInput,
    handleSearch,

    // Dữ liệu danh sách
    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    // KPI data
    kpiData,
    isLoadingKPI,
    refetchKPI,

    // Tỉnh/Thành phố cho bộ lọc & modal
    provinceOptions,
    isLoadingTinh,

    handleDelete,
  } = useKhachHang(initialTinhId);

  // Metrics (Ưu tiên lấy từ API GetKPI, fallback lọc cục bộ)
  const individualCount = useMemo(
    () => items.filter((i: KH_KhachHang) => i.loaiKhachHang === 1).length,
    [items],
  );
  const businessCount = useMemo(
    () => items.filter((i: KH_KhachHang) => i.loaiKhachHang === 2).length,
    [items],
  );
  const activeCount = useMemo(
    () => items.filter((i: KH_KhachHang) => i.trangThai === true).length,
    [items],
  );

  const total_KhachHang = kpiData?.total_KhachHang ?? totalCount;
  const total_CaNhan = kpiData?.total_CaNhan ?? individualCount;
  const total_ToChuc = kpiData?.total_ToChuc ?? businessCount;
  const total_HoatDong = kpiData?.total_HoatDong ?? activeCount;

  const hasActiveFilters = Boolean(
    searchInput || statusFilter !== "all" || loaiFilter !== "all" || tinhFilter,
  );

  const handleReload = () => {
    refetch();
    refetchKPI();
  };

  const handleResetFilters = () => {
    handleSearch("");
    setStatusFilter("all");
    setLoaiFilter("all");
    setTinhFilter("");
    setPage(1);
  };

  return (
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-3 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header & Thanh lọc tìm kiếm (Tối ưu Responsive Nút Bộ lọc trên Mobile) */}
      <CustomerFilterBar
        totalKhachHang={total_KhachHang}
        totalCaNhan={total_CaNhan}
        totalToChuc={total_ToChuc}
        totalHoatDong={total_HoatDong}
        searchInput={searchInput}
        onSearch={handleSearch}
        tinhFilter={tinhFilter}
        onTinhFilterChange={(val) => {
          setTinhFilter(val);
          setPage(1);
        }}
        provinceOptions={provinceOptions}
        isLoadingTinh={isLoadingTinh}
        loaiFilter={loaiFilter}
        onLoaiFilterChange={(val) => {
          setLoaiFilter(val);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCreate={() => setOpenCreate(true)}
        onRefresh={handleReload}
        isFetching={isFetching}
        isLoadingKPI={isLoadingKPI}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
      />

      {/* 2. Dải KPI Ribbon Thống Kê (Render động qua KpiRibbon) */}
      <CustomerKpiGrid
        totalKhachHang={total_KhachHang}
        totalCaNhan={total_CaNhan}
        totalToChuc={total_ToChuc}
        totalHoatDong={total_HoatDong}
        loaiFilter={loaiFilter}
        setLoaiFilter={setLoaiFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        setPage={setPage}
        isLoading={isLoading}
        isLoadingKPI={isLoadingKPI}
      />

      {/* 3. Nội dung dữ liệu chính (Lưới Showcase Grid hoặc Bảng Table Anti-Blowout) */}
      {isLoading ? (
        <CustomerSkeleton viewMode={viewMode} />
      ) : viewMode === "grid" ? (
        <CustomerGrid
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onEdit={(customer) => setEditingCustomer(customer)}
          onDelete={handleDelete}
          onOpenCreate={() => setOpenCreate(true)}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      ) : (
        <CustomerTable
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onEdit={(customer) => setEditingCustomer(customer)}
          onDelete={handleDelete}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          onOpenCreate={() => setOpenCreate(true)}
        />
      )}

      {/* Slide-over Drawer: THÊM MỚI KHÁCH HÀNG (Cô lập Form State) */}
      <CreateCustomerSlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        provinceOptions={provinceOptions}
        isLoadingTinh={isLoadingTinh}
      />

      {/* Slide-over Drawer: CẬP NHẬT HỒ SƠ KHÁCH HÀNG (Cô lập Form State) */}
      <UpdateCustomerSlideOver
        open={Boolean(editingCustomer)}
        onClose={() => setEditingCustomer(null)}
        customer={editingCustomer}
        provinceOptions={provinceOptions}
        isLoadingTinh={isLoadingTinh}
      />
    </div>
  );
}

export default function CustomerPage() {
  return (
    <Suspense
      fallback={
        <div className="p-3 sm:p-5 lg:p-7 space-y-3 sm:space-y-6 max-w-[1600px] mx-auto">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
      <CustomerContent />
    </Suspense>
  );
}
