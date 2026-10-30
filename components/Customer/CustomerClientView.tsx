"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useKhachHang } from "@/hooks/KhachHang/useKhachHang";
import { KH_KhachHang } from "@/types/khachHang";
import { CustomerFilterBar, ViewMode } from "./CustomerFilterBar";
import { CustomerKpiGrid } from "./CustomerKpiGrid";
import { CustomerGrid } from "./CustomerGrid";
import { CustomerSkeleton } from "./CustomerSkeleton";
import { useCustomerModalStore } from "@/store/useCustomerModalStore";

// Lazy-load heavy drawers with next/dynamic (Saves ~90 KiB JS on initial load)
const CreateCustomerSlideOver = dynamic(
  () =>
    import("./CreateCustomerSlideOver").then((m) => m.CreateCustomerSlideOver),
  { ssr: false },
);

const UpdateCustomerSlideOver = dynamic(
  () =>
    import("./UpdateCustomerSlideOver").then((m) => m.UpdateCustomerSlideOver),
  { ssr: false },
);

// Lazy-load table view mode (loaded only when switched to table)
const CustomerTable = dynamic(
  () => import("./CustomerTable").then((m) => m.CustomerTable),
  {
    loading: () => <CustomerSkeleton viewMode="table" />,
    ssr: false,
  },
);

export interface CustomerClientViewProps {
  initialTinhId?: string | number;
}

export function CustomerClientView({ initialTinhId }: CustomerClientViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Global modal state isolated from form inputs (AGENTS.md Rule 11)
  const {
    isOpenCreate,
    editingCustomer,
    openCreate,
    closeCreate,
    openEdit,
    closeEdit,
  } = useCustomerModalStore();

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
    <div className="space-y-3 sm:space-y-6">
      {/* 1. Toolbar thanh lọc tìm kiếm */}
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
        onOpenCreate={openCreate}
        onRefresh={handleReload}
        isFetching={isFetching}
        isLoadingKPI={isLoadingKPI}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
      />

      {/* 2. Dải KPI Ribbon Thống Kê */}
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
          onEdit={(customer) => openEdit(customer)}
          onDelete={handleDelete}
          onOpenCreate={openCreate}
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
          onEdit={(customer) => openEdit(customer)}
          onDelete={handleDelete}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          onOpenCreate={openCreate}
        />
      )}

      {/* Slide-over Drawer: THÊM MỚI KHÁCH HÀNG (Lazy loaded - chỉ render khi open) */}
      {isOpenCreate && (
        <CreateCustomerSlideOver
          open={isOpenCreate}
          onClose={closeCreate}
          provinceOptions={provinceOptions}
          isLoadingTinh={isLoadingTinh}
        />
      )}

      {/* Slide-over Drawer: CẬP NHẬT HỒ SƠ KHÁCH HÀNG (Lazy loaded - chỉ render khi có editingCustomer) */}
      {Boolean(editingCustomer) && (
        <UpdateCustomerSlideOver
          open={Boolean(editingCustomer)}
          onClose={closeEdit}
          customer={editingCustomer}
          provinceOptions={provinceOptions}
          isLoadingTinh={isLoadingTinh}
        />
      )}
    </div>
  );
}
