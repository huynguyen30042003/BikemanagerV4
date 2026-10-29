"use client";

import React, { useMemo, useState, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDiaPhuongCapTinh } from "@/hooks/DiaPhuongCapTinh/useDiaPhuongCapTinh";
import {
  DM_DiaPhuongCapTinh,
  DiaPhuongCapTinhKPI,
} from "@/types/diaPhuongCapTinh";
import {
  DiaPhuongCapTinhKpiGrid,
  DiaPhuongCapTinhFilterBar,
  DiaPhuongCapTinhGrid,
  DiaPhuongCapTinhSkeleton,
  DiaPhuongCapTinhTable,
  CreateDiaPhuongCapTinhSlideOver,
  UpdateDiaPhuongCapTinhSlideOver,
} from "@/components/DiaPhuongCapTinh";

type ViewMode = "grid" | "table";

function DiaPhuongCapTinhContent() {
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<DM_DiaPhuongCapTinh | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
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

    handleDelete,

    handleSync,
    isSyncing,
  } = useDiaPhuongCapTinh();

  // Metrics (Derived KPI metrics - Ưu tiên lấy từ API GetKPI hoặc fallback lọc cục bộ)
  const activeCount = useMemo(
    () => items.filter((item) => item.trangThai === true).length,
    [items],
  );
  const inactiveCount = useMemo(
    () => items.filter((item) => item.trangThai === false).length,
    [items],
  );
  const cityCount = useMemo(
    () => items.filter((item) => item.loai === 2).length,
    [items],
  );

  const kpi = kpiData as unknown as
    | (DiaPhuongCapTinhKPI & { data?: DiaPhuongCapTinhKPI })
    | undefined;

  const total_DiaPhuongCapTinh =
    kpi?.data?.total_DiaPhuongCapTinh ??
    kpi?.total_DiaPhuongCapTinh ??
    totalCount;
  const total_HoatDong =
    kpi?.data?.total_HoatDong ?? kpi?.total_HoatDong ?? activeCount;
  const total_NgungHoatDong =
    kpi?.data?.total_NgungHoatDong ?? kpi?.total_NgungHoatDong ?? inactiveCount;
  const total_ThanhPho =
    kpi?.data?.total_ThanhPho ?? kpi?.total_ThanhPho ?? cityCount;

  const handleReload = () => {
    refetch();
    refetchKPI();
  };

  const hasActiveFilters = Boolean(searchInput || statusFilter !== "all");

  const handleResetFilters = () => {
    handleSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  return (
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-3 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header & Thanh lọc tìm kiếm (Tối ưu Responsive Nút 3 gạch trên Mobile) */}
      <DiaPhuongCapTinhFilterBar
        totalDiaPhuongCapTinh={total_DiaPhuongCapTinh}
        totalHoatDong={total_HoatDong}
        totalNgungHoatDong={total_NgungHoatDong}
        searchInput={searchInput}
        onSearch={handleSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={(status) => {
          setStatusFilter(status);
          setPage(1);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCreate={() => setOpenCreate(true)}
        onSync={handleSync}
        isSyncing={isSyncing}
        onRefresh={handleReload}
        isFetching={isFetching}
        isLoadingKPI={isLoadingKPI}
        onResetFilters={handleResetFilters}
      />

      {/* 2. Dải KPI Ribbon Thống Kê (Render động bằng .map(), 2 cột trên Mobile) */}
      <DiaPhuongCapTinhKpiGrid
        totalDiaPhuongCapTinh={total_DiaPhuongCapTinh}
        totalHoatDong={total_HoatDong}
        totalNgungHoatDong={total_NgungHoatDong}
        totalThanhPho={total_ThanhPho}
        statusFilter={statusFilter}
        onSelectStatus={(status) => {
          setStatusFilter(status);
          setPage(1);
        }}
        isLoadingKPI={isLoadingKPI}
        isLoading={isLoading}
      />

      {/* 3. Nội dung dữ liệu chính (Lưới Showcase Grid hoặc Bảng Table Anti-Blowout) */}
      {isLoading ? (
        <DiaPhuongCapTinhSkeleton viewMode={viewMode} count={8} />
      ) : viewMode === "grid" ? (
        <DiaPhuongCapTinhGrid
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onEdit={(item) => setEditingItem(item)}
          onDelete={handleDelete}
          onOpenCreate={() => setOpenCreate(true)}
          onSync={handleSync}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          searchInput={searchInput}
        />
      ) : (
        <DiaPhuongCapTinhTable
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onEdit={(item) => setEditingItem(item)}
          onDelete={handleDelete}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          onOpenCreate={() => setOpenCreate(true)}
          onSync={handleSync}
          searchInput={searchInput}
        />
      )}

      {/* SlideOver: THÊM MỚI TỈNH / THÀNH PHỐ */}
      <CreateDiaPhuongCapTinhSlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={handleReload}
      />

      {/* SlideOver: CẬP NHẬT TỈNH / THÀNH PHỐ */}
      <UpdateDiaPhuongCapTinhSlideOver
        open={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        data={editingItem}
        onSuccess={handleReload}
      />
    </div>
  );
}

export default function DiaPhuongCapTinhPage() {
  return (
    <Suspense
      fallback={
        <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-3 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
          <Skeleton className="h-8 w-60" />
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
      <DiaPhuongCapTinhContent />
    </Suspense>
  );
}
