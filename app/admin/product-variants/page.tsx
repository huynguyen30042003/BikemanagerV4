"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBienTheSanPham } from "@/hooks/BienTheSanPham/useBienTheSanPham";
import { SP_BienTheSanPham } from "@/types/bienTheSanPham";
import {
  ProductVariantsKpiGrid,
  ProductVariantsFilterBar,
  ProductVariantsGrid,
  ProductVariantsTable,
  CreateProductVariantSlideOver,
  UpdateProductVariantSlideOver,
  ProductVariantsSkeleton,
} from "@/components/ProductVariants";

type ViewMode = "grid" | "table";

function VariantsContent() {
  const searchParams = useSearchParams();
  const initialSanPhamId = searchParams.get("productId") || undefined;

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    sanPhamFilter,
    setSanPhamFilter,
    searchInput,
    handleSearch,

    productOptions,
    isLoadingProducts,

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
  } = useBienTheSanPham(initialSanPhamId);

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [openAdd, setOpenAdd] = useState(false);
  const [editingVariant, setEditingVariant] =
    useState<SP_BienTheSanPham | null>(null);

  const handleResetFilters = () => {
    handleSearch("");
    setSanPhamFilter("");
    setPage(1);
  };

  // Thống kê KPI ưu tiên từ Backend API GetKPI, fallback sang dataset client
  const totalBienTheSanPham = useMemo(() => {
    return kpiData?.total_BienTheSanPham ?? totalCount;
  }, [kpiData?.total_BienTheSanPham, totalCount]);

  const totalQuanLyTheoSerial = useMemo(() => {
    return (
      kpiData?.total_QuanLyTheoSerial ??
      items.filter((i) => i.quanLyTheoSerial === true).length
    );
  }, [kpiData?.total_QuanLyTheoSerial, items]);

  const totalGiaBanCaoNhat = useMemo(() => {
    if (kpiData?.total_GiaBanCaoNhat != null) {
      return kpiData.total_GiaBanCaoNhat;
    }
    if (items.length === 0) return 0;
    return Math.max(...items.map((i) => i.giaBan || 0));
  }, [kpiData?.total_GiaBanCaoNhat, items]);

  const totalHoatDong = useMemo(() => {
    return (
      kpiData?.total_HoatDong ??
      items.filter((i) => i.trangThai === true).length
    );
  }, [kpiData?.total_HoatDong, items]);

  const hasActiveFilters = Boolean(searchInput || sanPhamFilter);

  return (
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-3 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header, Navigation Tabs & Multi-Filter Toolbar */}
      <ProductVariantsFilterBar
        totalBienThe={totalBienTheSanPham}
        activeCount={totalHoatDong}
        searchInput={searchInput}
        onSearch={handleSearch}
        sanPhamFilter={sanPhamFilter}
        onSanPhamFilterChange={(val) => {
          setSanPhamFilter(val);
          setPage(1);
        }}
        productOptions={productOptions}
        isLoadingProducts={isLoadingProducts}
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

      {/* 2. Dải KPI Ribbon tương tác (.map() based, dùng KpiRibbon chuẩn) */}
      <ProductVariantsKpiGrid
        totalBienTheSanPham={totalBienTheSanPham}
        totalQuanLyTheoSerial={totalQuanLyTheoSerial}
        totalGiaBanCaoNhat={totalGiaBanCaoNhat}
        totalHoatDong={totalHoatDong}
        sanPhamFilter={sanPhamFilter}
        onSelectTotal={() => {
          setSanPhamFilter("");
          setPage(1);
        }}
        isLoadingKPI={isLoadingKPI}
        isLoading={isLoading}
      />

      {/* 3. Nội dung dữ liệu chính (Chế độ xem kép: Grid thẻ & Table) */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card
              key={i}
              className="p-4 rounded-xl border border-border/70 space-y-3"
            >
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full" />
            </Card>
          ))}
        </div>
      ) : viewMode === "grid" ? (
        <ProductVariantsGrid
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onEdit={(variant) => setEditingVariant(variant)}
          onDelete={handleDelete}
          onOpenAdd={() => setOpenAdd(true)}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      ) : (
        <ProductVariantsTable
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onEdit={(variant) => setEditingVariant(variant)}
          onDelete={handleDelete}
        />
      )}

      {/* 4. SlideOver: Thêm biến thể mới (State Form cô lập hoàn toàn) */}
      <CreateProductVariantSlideOver
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        productOptions={productOptions}
        isLoadingProducts={isLoadingProducts}
        defaultSanPhamId={sanPhamFilter}
        onSuccess={() => {
          refetch();
          refetchKPI();
        }}
      />

      {/* 5. SlideOver: Cập nhật biến thể (State Form cô lập hoàn toàn) */}
      <UpdateProductVariantSlideOver
        open={Boolean(editingVariant)}
        onClose={() => setEditingVariant(null)}
        variant={editingVariant}
        productOptions={productOptions}
        isLoadingProducts={isLoadingProducts}
        onSuccess={() => {
          refetch();
          refetchKPI();
        }}
      />
    </div>
  );
}

export default function VariantsPage() {
  return (
    <Suspense fallback={<ProductVariantsSkeleton />}>
      <VariantsContent />
    </Suspense>
  );
}
