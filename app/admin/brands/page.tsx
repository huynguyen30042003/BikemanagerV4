"use client";

import React, { Suspense, useState, useMemo } from "react";
import {
  useThuongHieu,
  useDeleteThuongHieu,
} from "@/hooks/ThuongHieu/useThuongHieu";
import { SP_ThuongHieu } from "@/types/thuongHieu";
import {
  BrandsKpiGrid,
  BrandsFilterBar,
  BrandsGrid,
  BrandsTable,
  BrandsSkeleton,
  BrandsDeleteModal,
  CreateBrandSlideOver,
  UpdateBrandSlideOver,
  ViewMode,
} from "@/components/Brands";

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
  const [deletingBrand, setDeletingBrand] = useState<SP_ThuongHieu | null>(
    null,
  );

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
      // Toast notification is handled inside useDeleteThuongHieu mutation
    }
  };

  // Ưu tiên số liệu thống kê từ Backend KPI, fallback sang số liệu tính từ danh sách hiện tại
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
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-3 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
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

      {/* 2. Dải chỉ số KPI dùng KpiRibbon và .map() */}
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

      {/* 3. Nội dung dữ liệu chính (Lưới vs Bảng) */}
      {isLoading ? (
        <BrandsSkeleton count={8} />
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

      {/* 4. SlideOver: Thêm thương hiệu mới (State Isolation) */}
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

      {/* 6. Modal xác nhận xóa thương hiệu (Component Isolation) */}
      <BrandsDeleteModal
        brand={deletingBrand}
        onClose={() => setDeletingBrand(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

export default function BrandsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto">
          <div className="h-8 w-64 bg-muted/60 animate-pulse rounded-lg" />
          <BrandsSkeleton count={8} />
        </div>
      }
    >
      <BrandsContent />
    </Suspense>
  );
}
