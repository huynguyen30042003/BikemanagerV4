"use client";

import React, { Suspense, useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useThuongHieu, useDeleteThuongHieu } from "@/hooks/ThuongHieu/useThuongHieu";
import { SP_ThuongHieu } from "@/types/thuongHieu";
import {
  BrandsKpiGrid,
  BrandsFilterBar,
  BrandsGrid,
  BrandsTable,
  CreateBrandSlideOver,
  UpdateBrandSlideOver,
} from "@/components/Brands";

type ViewMode = "grid" | "table";

function BrandsContent() {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    searchInput,
    handleSearch,

    countryOptions,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    kpiData,
    isLoadingKPI,
    refetchKPI,
  } = useThuongHieu();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [openAdd, setOpenAdd] = useState(false);
  const [editingBrand, setEditingBrand] = useState<SP_ThuongHieu | null>(null);
  const [deletingBrand, setDeletingBrand] = useState<SP_ThuongHieu | null>(null);

  const deleteMutation = useDeleteThuongHieu();

  const handleResetFilters = () => {
    handleSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBrand) return;
    try {
      await deleteMutation.mutateAsync(deletingBrand.thuongHieuID);
      setDeletingBrand(null);
    } catch {
      // Toast notification is handled in mutation
    }
  };

  // KPI Metrics prioritization (Backend KPI first, fallback to current dataset)
  const totalThuongHieu = useMemo(() => {
    return kpiData?.total_ThuongHieu ?? totalCount;
  }, [kpiData?.total_ThuongHieu, totalCount]);

  const totalHoatDong = useMemo(() => {
    return (
      kpiData?.total_HoatDong ??
      items.filter((i) => i.trangThai === true).length
    );
  }, [kpiData?.total_HoatDong, items]);

  const totalNgungHoatDong = useMemo(() => {
    return (
      kpiData?.total_NgungHoatDong ??
      items.filter((i) => i.trangThai === false).length
    );
  }, [kpiData?.total_NgungHoatDong, items]);

  const totalXuatXuQuocTe = useMemo(() => {
    return (
      kpiData?.total_XuatXuQuocTe ??
      items.filter((i) => Boolean(i.quocGiaID)).length
    );
  }, [kpiData?.total_XuatXuQuocTe, items]);

  const hasActiveFilters = Boolean(searchInput || statusFilter !== "all");

  return (
    <div className="p-4 md:p-8 min-h-screen space-y-6 max-w-[1600px] mx-auto">
      {/* 1. Header, Navigation Tabs & Toolbar */}
      <BrandsFilterBar
        totalThuongHieu={totalThuongHieu}
        activeCount={totalHoatDong}
        inactiveCount={totalNgungHoatDong}
        searchInput={searchInput}
        onSearch={handleSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenAdd={() => setOpenAdd(true)}
        onRefresh={() => {
          refetch();
          refetchKPI();
        }}
        isFetching={isFetching}
        isLoadingKPI={isLoadingKPI}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 2. Interactive KPI Cards Grid (.map() based, responsive down to 390px) */}
      <BrandsKpiGrid
        totalThuongHieu={totalThuongHieu}
        totalHoatDong={totalHoatDong}
        totalNgungHoatDong={totalNgungHoatDong}
        totalXuatXuQuocTe={totalXuatXuQuocTe}
        statusFilter={statusFilter}
        onSelectStatus={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        isLoadingKPI={isLoadingKPI}
        isLoading={isLoading}
      />

      {/* 3. Main Data Content (Grid vs Table) */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="p-4 rounded-xl border border-border/70 space-y-3">
              <Skeleton className="h-28 w-full rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      ) : viewMode === "grid" ? (
        <BrandsGrid
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onEdit={(brand) => setEditingBrand(brand)}
          onDelete={(brand) => setDeletingBrand(brand)}
          onOpenAdd={() => setOpenAdd(true)}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      ) : (
        <BrandsTable
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onEdit={(brand) => setEditingBrand(brand)}
          onDelete={(brand) => setDeletingBrand(brand)}
        />
      )}

      {/* 4. SlideOver: Thêm thương hiệu (State Isolation) */}
      <CreateBrandSlideOver
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        countryOptions={countryOptions}
        onSuccess={() => {
          refetch();
          refetchKPI();
        }}
      />

      {/* 5. SlideOver: Cập nhật thương hiệu (State Isolation) */}
      <UpdateBrandSlideOver
        open={Boolean(editingBrand)}
        onClose={() => setEditingBrand(null)}
        brand={editingBrand}
        countryOptions={countryOptions}
        onSuccess={() => {
          refetch();
          refetchKPI();
        }}
      />

      {/* 6. Modal xác nhận xóa */}
      <ConfirmModal
        open={Boolean(deletingBrand)}
        onClose={() => setDeletingBrand(null)}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa thương hiệu"
        description={
          <div className="space-y-2">
            <p>
              Bạn có chắc chắn muốn xóa thương hiệu &quot;
              <strong className="text-foreground">{deletingBrand?.tenThuongHieu}</strong>
              &quot; không?
            </p>
            <span className="text-xs text-rose-600 dark:text-rose-400 block bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
              Lưu ý: Không thể xóa nếu thương hiệu này đang chứa các sản phẩm xe điện hoặc linh kiện phụ tùng đang lưu hành.
            </span>
          </div>
        }
        confirmText="Xác nhận xóa"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

export default function BrandsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <BrandsContent />
    </Suspense>
  );
}
