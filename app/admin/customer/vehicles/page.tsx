"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { usePhuongTienKhachHang } from "@/hooks/PhuongTienKhachHang/usePhuongTienKhachHang";
import { KH_PhuongTienKhachHang, PhuongTienKhachHangKPI } from "@/types/phuongTienKhachHang";
import {
  CustomerVehiclesKpiGrid,
  CustomerVehiclesFilterBar,
  CustomerVehiclesTable,
  CustomerVehiclesGrid,
  CustomerVehiclesSkeleton,
  CreateCustomerVehicleSlideOver,
  UpdateCustomerVehicleSlideOver,
  ViewMode,
} from "@/components/Customer/Vehicles";

function VehiclesContent() {
  const searchParams = useSearchParams();
  const initialKhachHangId = searchParams.get("khachHangId") || undefined;

  // Local state for modals to isolate form re-renders
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<KH_PhuongTienKhachHang | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    khachHangFilter,
    setKhachHangFilter,
    searchInput,
    handleSearch,

    customerOptions,
    isLoadingCustomers,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    kpiData,
    isLoadingKPI,
    refetchKPI,

    openDelete,
    setOpenDelete,
    selectItemName,
    handleOpenDelete,
    handleSubmitDelete,
    isDeleting,
  } = usePhuongTienKhachHang(initialKhachHangId);

  // Fallback metrics
  const activeCount = useMemo(
    () => items.filter((i) => i.trangThai === true).length,
    [items]
  );
  const inactiveCount = useMemo(
    () => items.filter((i) => i.trangThai === false).length,
    [items]
  );
  const avgKm = useMemo(() => {
    if (items.length === 0) return 0;
    const totalKm = items.reduce((acc, cur) => acc + (cur.soKmHienTai || 0), 0);
    return Math.round(totalKm / items.length);
  }, [items]);

  // Exact metrics from GetKPI API: {{base_url}}/api/PhuongTienKhachHangApi/GetKPI
  const kpi = kpiData as unknown as (PhuongTienKhachHangKPI & { data?: PhuongTienKhachHangKPI }) | undefined;
  const kpiMetrics = kpi?.data ?? kpi;

  const total_PhuongTienKhachHang =
    kpiMetrics?.total_PhuongTienKhachHang ?? totalCount;
  const total_HoatDong = kpiMetrics?.total_HoatDong ?? activeCount;
  const total_NgungHoatDong =
    kpiMetrics?.total_NgungHoatDong ?? inactiveCount;
  const total_KM = kpiMetrics?.total_KM ?? avgKm;

  const handleReload = () => {
    refetch();
    refetchKPI();
  };

  const handleResetFilters = () => {
    handleSearch("");
    setStatusFilter("all");
    setKhachHangFilter("");
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    searchInput || statusFilter !== "all" || khachHangFilter
  );

  return (
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-4 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header & Thanh lọc tìm kiếm (Tối ưu Responsive Nút 3 gạch & Switch ViewMode) */}
      <CustomerVehiclesFilterBar
        totalPhuongTien={total_PhuongTienKhachHang}
        totalHoatDong={total_HoatDong}
        totalNgungHoatDong={total_NgungHoatDong}
        searchInput={searchInput}
        onSearch={handleSearch}
        khachHangFilter={khachHangFilter}
        onKhachHangFilterChange={(val) => {
          setKhachHangFilter(val);
          setPage(1);
        }}
        customerOptions={customerOptions}
        isLoadingCustomers={isLoadingCustomers}
        statusFilter={statusFilter}
        onStatusFilterChange={(status) => {
          setStatusFilter(status);
          setPage(1);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCreate={() => setOpenCreate(true)}
        onRefresh={handleReload}
        isFetching={isFetching}
        isLoadingKPI={isLoadingKPI}
        onResetFilters={handleResetFilters}
      />

      {/* 2. Dải KPI Ribbon Thống Kê (Config-driven dùng KpiRibbon & .map) */}
      <CustomerVehiclesKpiGrid
        totalPhuongTien={total_PhuongTienKhachHang}
        totalHoatDong={total_HoatDong}
        totalNgungHoatDong={total_NgungHoatDong}
        totalKM={total_KM}
        statusFilter={statusFilter}
        onSelectStatus={(status) => {
          setStatusFilter(status);
          setPage(1);
        }}
        isLoadingKPI={isLoadingKPI}
        isLoading={isLoading}
      />

      {/* 3. Chế độ hiển thị kép: Bảng dữ liệu hoặc Lưới thẻ (Anti-Blowout Table & Responsive Cards) */}
      {isLoading ? (
        <CustomerVehiclesSkeleton viewMode={viewMode} />
      ) : viewMode === "grid" ? (
        <CustomerVehiclesGrid
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onEdit={(item) => setEditingItem(item)}
          onDelete={(item) => handleOpenDelete(item)}
          onOpenCreate={() => setOpenCreate(true)}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      ) : (
        <CustomerVehiclesTable
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onEdit={(item) => setEditingItem(item)}
          onDelete={(item) => handleOpenDelete(item)}
          onOpenCreate={() => setOpenCreate(true)}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      {/* 4. SlideOver: Đăng ký xe mới (Cô lập form state) */}
      <CreateCustomerVehicleSlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        customerOptions={customerOptions}
        isLoadingCustomers={isLoadingCustomers}
        defaultKhachHangId={khachHangFilter}
        onSuccess={handleReload}
      />

      {/* 5. SlideOver: Cập nhật thông số phương tiện (Cô lập form state) */}
      <UpdateCustomerVehicleSlideOver
        open={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        data={editingItem}
        customerOptions={customerOptions}
        isLoadingCustomers={isLoadingCustomers}
        onSuccess={handleReload}
      />

      {/* 6. Modal Xác nhận Xóa phương tiện */}
      <ConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleSubmitDelete}
        title="Xác nhận xóa phương tiện"
        description={
          <div>
            <p>
              Bạn có chắc chắn muốn xóa phương tiện &quot;
              <strong className="text-foreground">{selectItemName}</strong>
              &quot; không?
            </p>
            <span className="text-xs text-rose-600/90 dark:text-rose-400 mt-2 block bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              Hành động này sẽ xóa toàn bộ lịch sử sở hữu và thông số của xe trong hệ thống.
            </span>
          </div>
        }
        confirmText="Xác nhận xóa"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default function CustomerVehiclesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-4 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
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
      <VehiclesContent />
    </Suspense>
  );
}

