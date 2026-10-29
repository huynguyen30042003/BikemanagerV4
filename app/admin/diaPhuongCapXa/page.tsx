"use client";

import React, { useMemo, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { SelectOption } from "@/components/ui/selectSearch";
import { useDiaPhuongCapXa } from "@/hooks/DiaPhuongCapXa/useDiaPhuongCapXa";
import { DM_DiaPhuongCapXa, DiaPhuongCapXaKPI } from "@/types/diaPhuongCapXa";
import {
  DiaPhuongCapXaKpiGrid,
  DiaPhuongCapXaFilterBar,
  DiaPhuongCapXaGrid,
  DiaPhuongCapXaSkeleton,
  DiaPhuongCapXaTable,
  CreateDiaPhuongCapXaSlideOver,
  UpdateDiaPhuongCapXaSlideOver,
} from "@/components/DiaPhuongCapXa";

type ViewMode = "grid" | "table";

function DiaPhuongCapXaContent() {
  const searchParams = useSearchParams();
  const tinhIdFromUrl = searchParams.get("tinhId") || "";

  // Dual View Mode (Showcase Grid vs Data Table)
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Local state for modals to isolate form re-renders from the main catalog list
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<DM_DiaPhuongCapXa | null>(
    null,
  );

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    tinhFilter,
    setTinhFilter,
    searchInput,
    handleSearch,

    provinceOptions,
    provinceMap,
    isLoadingTinh,

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
  } = useDiaPhuongCapXa(tinhIdFromUrl ? Number(tinhIdFromUrl) : "");

  // Metrics (Derived KPI metrics - Ưu tiên lấy từ API GetKPI hoặc fallback lọc cục bộ)
  const activeCount = useMemo(
    () => items.filter((item) => item.trangThai === true).length,
    [items],
  );
  const inactiveCount = useMemo(
    () => items.filter((item) => item.trangThai === false).length,
    [items],
  );

  const kpi = kpiData as unknown as
    | (DiaPhuongCapXaKPI & { data?: DiaPhuongCapXaKPI })
    | undefined;

  const total_DiaPhuongCapXa =
    kpi?.data?.total_DiaPhuongCapXa ?? kpi?.total_DiaPhuongCapXa ?? totalCount;
  const total_HoatDong =
    kpi?.data?.total_HoatDong ?? kpi?.total_HoatDong ?? activeCount;
  const total_NgungHoatDong =
    kpi?.data?.total_NgungHoatDong ?? kpi?.total_NgungHoatDong ?? inactiveCount;
  const total_DiaPhuongCapTinh =
    kpi?.data?.total_DiaPhuongCapTinh ??
    kpi?.total_DiaPhuongCapTinh ??
    provinceOptions.length;

  const handleReload = () => {
    refetch();
    refetchKPI();
  };

  const filterProvinceOptions: SelectOption[] = useMemo(() => {
    return [
      { value: "", label: "-- Tất cả Tỉnh / Thành phố --" },
      ...provinceOptions,
    ];
  }, [provinceOptions]);

  const currentProvinceName = useMemo(() => {
    if (!tinhFilter) return "";
    return provinceMap.get(Number(tinhFilter)) || `Tỉnh #${tinhFilter}`;
  }, [tinhFilter, provinceMap]);

  const hasActiveFilters = Boolean(
    searchInput || tinhFilter || statusFilter !== "all",
  );

  const handleResetFilters = () => {
    handleSearch("");
    setTinhFilter("");
    setStatusFilter("all");
    setPage(1);
  };

  return (
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-3 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header & Thanh lọc tìm kiếm (Tối ưu Responsive Nút 3 gạch trên Mobile) */}
      <DiaPhuongCapXaFilterBar
        totalDiaPhuongCapXa={total_DiaPhuongCapXa}
        totalHoatDong={total_HoatDong}
        totalNgungHoatDong={total_NgungHoatDong}
        totalDiaPhuongCapTinh={total_DiaPhuongCapTinh}
        searchInput={searchInput}
        onSearch={handleSearch}
        tinhFilter={tinhFilter}
        onTinhFilterChange={(val) => {
          setTinhFilter(val ? String(val) : "");
          setPage(1);
        }}
        filterProvinceOptions={filterProvinceOptions}
        currentProvinceName={currentProvinceName}
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
      <DiaPhuongCapXaKpiGrid
        totalDiaPhuongCapXa={total_DiaPhuongCapXa}
        totalHoatDong={total_HoatDong}
        totalNgungHoatDong={total_NgungHoatDong}
        totalDiaPhuongCapTinh={total_DiaPhuongCapTinh}
        statusFilter={statusFilter}
        onSelectStatus={(status) => {
          setStatusFilter(status);
          setPage(1);
        }}
        isLoadingKPI={isLoadingKPI}
        isLoading={isLoading}
        isLoadingTinh={isLoadingTinh}
      />

      {/* 3. Nội dung dữ liệu chính (Lưới Showcase Grid hoặc Bảng Table Anti-Blowout) */}
      {isLoading ? (
        <DiaPhuongCapXaSkeleton viewMode={viewMode} count={8} />
      ) : viewMode === "grid" ? (
        <DiaPhuongCapXaGrid
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
          provinceMap={provinceMap}
          onSelectProvince={(pId) => {
            setTinhFilter(pId);
            setPage(1);
          }}
        />
      ) : (
        <DiaPhuongCapXaTable
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onEdit={(item) => setEditingItem(item)}
          onDelete={handleDelete}
          provinceMap={provinceMap}
          onSelectProvince={(pId) => {
            setTinhFilter(pId);
            setPage(1);
          }}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          onOpenCreate={() => setOpenCreate(true)}
          onSync={handleSync}
          searchInput={searchInput}
        />
      )}

      {/* SlideOver: THÊM MỚI XÃ / PHƯỜNG */}
      <CreateDiaPhuongCapXaSlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        provinceOptions={provinceOptions}
        defaultTinhId={tinhFilter ? Number(tinhFilter) : undefined}
        onSuccess={handleReload}
      />

      {/* SlideOver: CẬP NHẬT XÃ / PHƯỜNG */}
      <UpdateDiaPhuongCapXaSlideOver
        open={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        data={editingItem}
        provinceOptions={provinceOptions}
        onSuccess={handleReload}
      />
    </div>
  );
}

export default function DiaPhuongCapXaPage() {
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
      <DiaPhuongCapXaContent />
    </Suspense>
  );
}
