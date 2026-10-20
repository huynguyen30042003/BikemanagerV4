"use client";

import React, { useMemo, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Store } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SelectOption } from "@/components/ui/selectSearch";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useDiaDiem } from "@/hooks/DiaDiem/useDiaDiem";
import { DM_DiaDiem, DiaDiemKPI } from "@/types/diaDiem";
import {
  DiaDiemKpiGrid,
  DiaDiemFilterBar,
  DiaDiemGrid,
  DiaDiemSkeleton,
  DiaDiemTable,
  CreateDiaDiemSlideOver,
  UpdateDiaDiemSlideOver,
} from "@/components/DiaDiem";

function DiaDiemContent() {
  const searchParams = useSearchParams();
  const tinhIdFromUrl = searchParams.get("tinhId") || "";

  // Dual View Mode (Showcase Grid vs Data Table)
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Local state for modals to isolate form re-renders from the main catalog list
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<DM_DiaDiem | null>(null);

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
    parentLocationOptions,

    loaiDiaDiemOptions,
    getLoaiDiaDiemBadge,
    isLoadingLoaiDiaDiem,

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
  } = useDiaDiem(tinhIdFromUrl ? Number(tinhIdFromUrl) : "");

  // Metrics (Derived KPI metrics - Ưu tiên lấy từ API GetKPI hoặc fallback tính cục bộ)
  const activeCount = useMemo(
    () => items.filter((item) => item.trangThai === true).length,
    [items]
  );
  const inactiveCount = useMemo(
    () => items.filter((item) => item.trangThai === false).length,
    [items]
  );
  const showroomCount = useMemo(
    () => items.filter((item) => item.loaiDiaDiemID === 1).length,
    [items]
  );

  const kpi = kpiData as unknown as (DiaDiemKPI & { data?: DiaDiemKPI }) | undefined;

  const total_DiaDiem = kpi?.data?.total_DiaDiem ?? kpi?.total_DiaDiem ?? totalCount;
  const total_HoatDong = kpi?.data?.total_HoatDong ?? kpi?.total_HoatDong ?? activeCount;
  const total_NgungHoatDong = kpi?.data?.total_NgungHoatDong ?? kpi?.total_NgungHoatDong ?? inactiveCount;

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

  const getLoaiBadge = (loaiId?: number | null) => {
    const badge = getLoaiDiaDiemBadge(loaiId);
    return (
      <span
        className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${badge.bgClass} ${badge.textClass} border ${badge.borderClass}`}
      >
        <Store className="w-2.5 h-2.5" />
        {badge.label}
      </span>
    );
  };

  const hasActiveFilters = Boolean(
    searchInput || tinhFilter || statusFilter !== "all"
  );

  const handleResetFilters = () => {
    handleSearch("");
    setTinhFilter("");
    setStatusFilter("all");
    setPage(1);
  };

  return (
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-4 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header & Thanh lọc tìm kiếm (Tối ưu Responsive Nút 3 gạch trên Mobile) */}
      <DiaDiemFilterBar
        totalDiaDiem={total_DiaDiem}
        totalHoatDong={total_HoatDong}
        totalNgungHoatDong={total_NgungHoatDong}
        searchInput={searchInput}
        onSearch={handleSearch}
        tinhFilter={tinhFilter}
        onTinhFilterChange={(val) => {
          setTinhFilter(val ? Number(val) : "");
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
        onRefresh={handleReload}
        isFetching={isFetching}
        isLoadingKPI={isLoadingKPI}
        onResetFilters={handleResetFilters}
      />

      {/* 2. Dải KPI Ribbon Thống Kê (Render động bằng .map(), 2 cột trên Mobile) */}
      <DiaDiemKpiGrid
        totalDiaDiem={total_DiaDiem}
        totalHoatDong={total_HoatDong}
        totalNgungHoatDong={total_NgungHoatDong}
        showroomCount={showroomCount}
        statusFilter={statusFilter}
        tinhFilter={tinhFilter}
        onSelectStatus={(status) => {
          setStatusFilter(status);
          setPage(1);
        }}
        onResetTinh={() => setTinhFilter("")}
        isLoadingKPI={isLoadingKPI}
        isLoading={isLoading}
      />

      {/* 3. Nội dung dữ liệu chính (Lưới Showcase Grid hoặc Bảng Table Anti-Blowout) */}
      {isLoading ? (
        <DiaDiemSkeleton viewMode={viewMode} count={8} />
      ) : viewMode === "grid" ? (
        <DiaDiemGrid
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
          provinceMap={provinceMap}
          getLoaiBadge={getLoaiBadge}
        />
      ) : (
        <DiaDiemTable
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onEdit={(item) => setEditingItem(item)}
          onDelete={(item) => handleOpenDelete(item)}
          provinceMap={provinceMap}
          getLoaiBadge={getLoaiBadge}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          onOpenCreate={() => setOpenCreate(true)}
          searchInput={searchInput}
        />
      )}

      {/* SlideOver: THÊM MỚI CƠ SỞ / SHOWROOM (Tách component riêng, cách ly form state) */}
      <CreateDiaDiemSlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        provinceOptions={provinceOptions}
        parentLocationOptions={parentLocationOptions}
        loaiDiaDiemOptions={loaiDiaDiemOptions}
        isLoadingLoaiDiaDiem={isLoadingLoaiDiaDiem}
        defaultTinhId={tinhFilter ? Number(tinhFilter) : 0}
        onSuccess={handleReload}
      />

      {/* SlideOver: CẬP NHẬT CƠ SỞ / SHOWROOM (Tách component riêng, cách ly form state) */}
      <UpdateDiaDiemSlideOver
        open={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        data={editingItem}
        provinceOptions={provinceOptions}
        parentLocationOptions={parentLocationOptions}
        loaiDiaDiemOptions={loaiDiaDiemOptions}
        isLoadingLoaiDiaDiem={isLoadingLoaiDiaDiem}
        onSuccess={handleReload}
      />

      {/* Modal Xác nhận Xóa */}
      <ConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleSubmitDelete}
        title="Xác nhận xóa cơ sở / showroom"
        description={
          <div>
            <p>
              Bạn có chắc chắn muốn xóa cơ sở &quot;
              <strong className="text-foreground">{selectItemName}</strong>
              &quot; không?
            </p>
            <span className="text-xs text-rose-600/90 dark:text-rose-400 mt-2 block bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              Hành động này không thể hoàn tác nếu cơ sở đang có giao dịch đơn
              hàng hoặc kho hàng liên kết.
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

export default function DiaDiemPage() {
  return (
    <Suspense
      fallback={
        <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-4 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
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
      <DiaDiemContent />
    </Suspense>
  );
}
