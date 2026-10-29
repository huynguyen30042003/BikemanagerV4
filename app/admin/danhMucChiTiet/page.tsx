"use client";

import React, { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useDanhMucChiTiet } from "@/hooks/DanhMucChiTiet/useDanhMucChiTiet";
import { DM_DanhMucChiTiet } from "@/types/danhMucChiTiet";
import { SelectOption } from "@/components/ui/selectSearch";
import {
  DanhMucChiTietKpiGrid,
  DanhMucChiTietFilterBar,
  DanhMucChiTietGrid,
  DanhMucChiTietSkeleton,
  DanhMucChiTietTable,
  CreateDanhMucChiTietSlideOver,
  UpdateDanhMucChiTietSlideOver,
} from "@/components/DanhMucChiTiet";

type ViewMode = "grid" | "table";

function DanhMucChiTietContent() {
  const searchParams = useSearchParams();
  const parentIdParam =
    searchParams.get("danhMucId") || searchParams.get("parentId") || "";

  const {
    // Pagination & Search
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    parentCategoryFilter,
    setParentCategoryFilter,
    searchInput,
    handleSearch,

    // Parent category options
    parentCategories,
    parentCategoryOptions,
    parentCategoryMap,
    isLoadingParent,

    // Data query
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

    // Delete state & actions
    handleDelete,

    // Sync
    handleSync,
    isSyncing,
  } = useDanhMucChiTiet(parentIdParam ? Number(parentIdParam) : "");

  // Local modal states
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<DM_DanhMucChiTiet | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // KPI metrics từ API GetKPI hoặc fallback tính cục bộ
  const activeCount = useMemo(
    () =>
      items.filter((item: DM_DanhMucChiTiet) => item.trangThai === true).length,
    [items],
  );
  const inactiveCount = useMemo(
    () =>
      items.filter((item: DM_DanhMucChiTiet) => item.trangThai === false)
        .length,
    [items],
  );

  const total_DanhMucChiTiet = kpiData?.total_DanhMucChiTiet ?? totalCount;
  const total_HoatDong = kpiData?.total_HoatDong ?? activeCount;
  const total_NgungHoatDong = kpiData?.total_NgungHoatDong ?? inactiveCount;
  const total_DanhMucChung =
    kpiData?.total_DanhMucChung ?? parentCategories.length;

  // Filter options for parent category toolbar
  const filterParentOptions: SelectOption[] = useMemo(() => {
    return [
      { value: "", label: "📁 Tất cả danh mục cha" },
      ...parentCategoryOptions,
    ];
  }, [parentCategoryOptions]);

  // Selected parent name for active filter chip display
  const currentParentName = useMemo(() => {
    if (!parentCategoryFilter) return "";
    return (
      parentCategoryMap.get(Number(parentCategoryFilter)) ||
      `Danh mục #${parentCategoryFilter}`
    );
  }, [parentCategoryFilter, parentCategoryMap]);

  const hasActiveFilters = Boolean(
    searchInput || statusFilter !== "all" || parentCategoryFilter,
  );

  const handleResetFilters = () => {
    handleSearch("");
    setStatusFilter("all");
    setParentCategoryFilter("");
    setPage(1);
  };

  return (
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-3 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header & Thanh lọc tìm kiếm (Tối ưu Responsive Nút 3 gạch trên Mobile) */}
      <DanhMucChiTietFilterBar
        totalDanhMucChiTiet={total_DanhMucChiTiet}
        totalHoatDong={total_HoatDong}
        totalNgungHoatDong={total_NgungHoatDong}
        totalDanhMucChung={total_DanhMucChung}
        parentCategoryFilter={parentCategoryFilter}
        onParentCategoryChange={(val) => {
          setParentCategoryFilter(val);
          setPage(1);
        }}
        filterParentOptions={filterParentOptions}
        currentParentName={currentParentName}
        isLoadingParent={isLoadingParent}
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
        onRefresh={() => {
          refetch();
          refetchKPI();
        }}
        isFetching={isFetching}
        onResetFilters={handleResetFilters}
      />

      {/* 2. Dải KPI Ribbon Thống Kê (Render động bằng .map(), 2 cột trên Mobile) */}
      <DanhMucChiTietKpiGrid
        totalDanhMucChiTiet={total_DanhMucChiTiet}
        totalHoatDong={total_HoatDong}
        totalNgungHoatDong={total_NgungHoatDong}
        totalDanhMucChung={total_DanhMucChung}
        statusFilter={statusFilter}
        onSelectStatus={(status) => {
          setStatusFilter(status);
          setPage(1);
        }}
        isLoadingKPI={isLoadingKPI}
        isLoading={isLoading}
        isLoadingParent={isLoadingParent}
      />

      {/* 3. Nội dung dữ liệu chính (Lưới Showcase Grid hoặc Bảng Table Anti-Blowout) */}
      {isLoading ? (
        <DanhMucChiTietSkeleton viewMode={viewMode} count={8} />
      ) : viewMode === "grid" ? (
        <DanhMucChiTietGrid
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
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          searchInput={searchInput}
          parentCategoryMap={parentCategoryMap}
        />
      ) : (
        <DanhMucChiTietTable
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onEdit={(item) => setEditingItem(item)}
          onDelete={handleDelete}
          parentCategoryMap={parentCategoryMap}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          onOpenCreate={() => setOpenCreate(true)}
          searchInput={searchInput}
        />
      )}

      {/* Slide-over Drawer: THÊM MỚI MỤC CHI TIẾT */}
      <CreateDanhMucChiTietSlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        parentCategoryOptions={parentCategoryOptions}
        defaultParentId={
          parentCategoryFilter ? Number(parentCategoryFilter) : undefined
        }
      />

      {/* Slide-over Drawer: CẬP NHẬT MỤC CHI TIẾT */}
      <UpdateDanhMucChiTietSlideOver
        open={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        data={editingItem}
        parentCategoryOptions={parentCategoryOptions}
      />
    </div>
  );
}

export default function DanhMucChiTietPageClient() {
  return (
    <Suspense
      fallback={
        <div className="p-6 space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      }
    >
      <DanhMucChiTietContent />
    </Suspense>
  );
}
