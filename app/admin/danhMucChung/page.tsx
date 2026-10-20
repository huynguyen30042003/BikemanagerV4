"use client";

import React, { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useDanhMucChung } from "@/hooks/DanhMucChung/useDanhMucChung";
import { DM_DanhMucChung } from "@/types/danhMucChung";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  DanhMucChungKpiGrid,
  DanhMucChungFilterBar,
  DanhMucChungGrid,
  DanhMucChungTable,
  CreateDanhMucChungSlideOver,
  UpdateDanhMucChungSlideOver,
} from "@/components/DanhMucChung";

type ViewMode = "grid" | "table";

export default function DanhMucChungPageClient() {
  const {
    // Pagination & Search
    page,
    setPage,
    pageSize,
    setPageSize,
    searchInput,
    handleSearch,
    statusFilter,
    setStatusFilter,

    // Data query
    dataDanhMucChung,
    items: hookItems,
    totalCount: hookTotalCount,
    totalPages: hookTotalPages,
    isLoading,
    isFetching,
    refetch,

    // KPI data
    kpiData,
    isLoadingKPI,
    refetchKPI,

    // Delete state & actions
    openDelete,
    setOpenDelete,
    selectItemName,
    handleOpenDelete,
    handleSubmitDelete,
    isDeleting,

    // Sync
    handleSync,
    isSyncing,
  } = useDanhMucChung();

  // Local state for modals to isolate form re-renders from the main catalog list
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<DM_DanhMucChung | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const items = hookItems ?? dataDanhMucChung?.data ?? [];
  const totalCount =
    hookTotalCount ??
    dataDanhMucChung?.pagination?.totalItems ??
    dataDanhMucChung?.recordsTotal ??
    0;
  const totalPages =
    hookTotalPages ?? dataDanhMucChung?.pagination?.totalPages ?? 1;

  // KPI metrics từ API GetKPI hoặc fallback tính cục bộ
  const activeCount = useMemo(
    () => items.filter((item: DM_DanhMucChung) => item.trangThai === true).length,
    [items]
  );
  const inactiveCount = useMemo(
    () => items.filter((item: DM_DanhMucChung) => item.trangThai === false).length,
    [items]
  );
  const totalSubCategories = useMemo(
    () =>
      items.reduce(
        (acc: number, item: DM_DanhMucChung) => acc + (item.soLuongChiTiet || 0),
        0
      ),
    [items]
  );

  const total_DanhMucChung = kpiData?.total_DanhMucChung ?? totalCount;
  const total_HoatDong = kpiData?.total_HoatDong ?? activeCount;
  const total_NgungHoatDong = kpiData?.total_NgungHoatDong ?? inactiveCount;
  const total_DanhMucChiTiet = kpiData?.total_DanhMucChiTiet ?? totalSubCategories;

  const hasActiveFilters = Boolean(searchInput || statusFilter !== "all");

  const handleResetFilters = () => {
    handleSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  return (
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-4 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header & Thanh lọc tìm kiếm (Tối ưu Responsive Nút 3 gạch trên Mobile) */}
      <DanhMucChungFilterBar
        totalDanhMucChung={total_DanhMucChung}
        totalHoatDong={total_HoatDong}
        totalNgungHoatDong={total_NgungHoatDong}
        totalDanhMucChiTiet={total_DanhMucChiTiet}
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
      <DanhMucChungKpiGrid
        totalDanhMucChung={total_DanhMucChung}
        totalHoatDong={total_HoatDong}
        totalNgungHoatDong={total_NgungHoatDong}
        totalDanhMucChiTiet={total_DanhMucChiTiet}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <Card key={idx} className="p-4 rounded-xl border border-border/70 space-y-3">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-8 w-full" />
            </Card>
          ))}
        </div>
      ) : viewMode === "grid" ? (
        <DanhMucChungGrid
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
          searchInput={searchInput}
        />
      ) : (
        <DanhMucChungTable
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onEdit={(item) => setEditingItem(item)}
          onDelete={(item) => handleOpenDelete(item)}
        />
      )}

      {/* Slide-over Drawer: THÊM MỚI DANH MỤC */}
      <CreateDanhMucChungSlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />

      {/* Slide-over Drawer: CẬP NHẬT DANH MỤC */}
      <UpdateDanhMucChungSlideOver
        open={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        data={editingItem}
      />

      {/* Modal Xác nhận Xóa */}
      <ConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleSubmitDelete}
        title="Xác nhận xóa danh mục"
        variant="danger"
        isLoading={isDeleting}
        confirmText="Xác nhận xóa"
        description={
          <div>
            <p>
              Bạn có chắc chắn muốn xóa danh mục &quot;
              <strong className="text-foreground">{selectItemName}</strong>
              &quot; không?
            </p>
            <span className="text-xs text-rose-600/90 dark:text-rose-400 mt-2 block bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              Hành động này không thể hoàn tác. Nếu danh mục đang có mục con
              hoặc dữ liệu phụ thuộc, hệ thống sẽ từ chối xóa để đảm bảo toàn vẹn dữ liệu.
            </span>
          </div>
        }
      />
    </div>
  );
}
