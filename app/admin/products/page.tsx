"use client";

import React, { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useSanPham, useDeleteSanPham } from "@/hooks/SanPham/useSanPham";
import { SP_SanPham } from "@/types/sanPham";
import {
  ProductsKpiGrid,
  ProductsFilterBar,
  ProductsGrid,
  ProductsTable,
  CreateProductSlideOver,
  UpdateProductSlideOver,
  ProductsSkeleton,
} from "@/components/Products";

type ViewMode = "grid" | "table";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialBrandId = searchParams.get("brandId") || undefined;
  const initialCategoryId = searchParams.get("categoryId")
    ? Number(searchParams.get("categoryId"))
    : undefined;

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    brandFilter,
    setBrandFilter,
    categoryFilter,
    setCategoryFilter,
    searchInput,
    handleSearch,

    brandOptions,
    isLoadingBrands,
    categoryOptions,
    isLoadingCategories,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    kpiData,
    isLoadingKPI,
    refetchKPI,
  } = useSanPham(initialBrandId, initialCategoryId);

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [openAdd, setOpenAdd] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SP_SanPham | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<SP_SanPham | null>(
    null,
  );

  const deleteMutation = useDeleteSanPham();

  const handleResetFilters = () => {
    handleSearch("");
    setStatusFilter("all");
    setBrandFilter("");
    setCategoryFilter("");
    setPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    try {
      await deleteMutation.mutateAsync(deletingProduct.sanPhamID);
      setDeletingProduct(null);
      refetchKPI();
    } catch {
      // Toast notification is handled in mutation
    }
  };

  // Thống kê KPI ưu tiên từ Backend API GetKPI, fallback sang dataset client
  const totalSanPham = useMemo(() => {
    return kpiData?.total_SanPham ?? totalCount;
  }, [kpiData?.total_SanPham, totalCount]);

  const totalLaPhuongTien = useMemo(() => {
    return (
      kpiData?.total_LaPhuongTien ??
      items.filter((i) => i.laPhuongTien === true).length
    );
  }, [kpiData?.total_LaPhuongTien, items]);

  const totalDaXuatBan = useMemo(() => {
    return (
      kpiData?.total_DaXuatBan ??
      items.filter((i) => i.daXuatBan === true).length
    );
  }, [kpiData?.total_DaXuatBan, items]);

  const totalHoatDong = useMemo(() => {
    return (
      kpiData?.total_HoatDong ??
      items.filter((i) => i.trangThai === true).length
    );
  }, [kpiData?.total_HoatDong, items]);

  const inactiveCount = useMemo(() => {
    return items.filter((i) => i.trangThai === false).length;
  }, [items]);

  const hasActiveFilters = Boolean(
    searchInput || statusFilter !== "all" || brandFilter || categoryFilter,
  );

  return (
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-3 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header, Navigation Tabs & Multi-Filter Toolbar */}
      <ProductsFilterBar
        totalSanPham={totalSanPham}
        activeCount={totalHoatDong}
        inactiveCount={inactiveCount}
        searchInput={searchInput}
        onSearch={handleSearch}
        brandFilter={brandFilter}
        onBrandFilterChange={(val) => {
          setBrandFilter(val);
          setPage(1);
        }}
        brandOptions={brandOptions}
        isLoadingBrands={isLoadingBrands}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={(val) => {
          setCategoryFilter(val);
          setPage(1);
        }}
        categoryOptions={categoryOptions}
        isLoadingCategories={isLoadingCategories}
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

      {/* 2. Dải KPI Ribbon tương tác (.map() based, dùng KpiRibbon chuẩn) */}
      <ProductsKpiGrid
        totalSanPham={totalSanPham}
        totalLaPhuongTien={totalLaPhuongTien}
        totalDaXuatBan={totalDaXuatBan}
        totalHoatDong={totalHoatDong}
        statusFilter={statusFilter}
        brandFilter={brandFilter}
        categoryFilter={categoryFilter}
        onSelectTotal={() => {
          setBrandFilter("");
          setCategoryFilter("");
          setStatusFilter("all");
          setPage(1);
        }}
        onSelectActive={() => {
          setStatusFilter("active");
          setPage(1);
        }}
        isLoadingKPI={isLoadingKPI}
        isLoading={isLoading}
      />

      {/* 3. Nội dung dữ liệu chính (Chế độ xem kép: Grid thẻ xe & Table) */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card
              key={i}
              className="p-4 rounded-xl border border-border/70 space-y-3"
            >
              <Skeleton className="h-36 w-full rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      ) : viewMode === "grid" ? (
        <ProductsGrid
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onEdit={(product) => setEditingProduct(product)}
          onDelete={(product) => setDeletingProduct(product)}
          onOpenAdd={() => setOpenAdd(true)}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      ) : (
        <ProductsTable
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onEdit={(product) => setEditingProduct(product)}
          onDelete={(product) => setDeletingProduct(product)}
        />
      )}

      {/* 4. SlideOver: Thêm sản phẩm mới (State Form cô lập hoàn toàn) */}
      <CreateProductSlideOver
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        brandOptions={brandOptions}
        isLoadingBrands={isLoadingBrands}
        categoryOptions={categoryOptions}
        isLoadingCategories={isLoadingCategories}
        defaultBrandId={brandFilter}
        defaultCategoryId={categoryFilter ? Number(categoryFilter) : 0}
        onSuccess={() => {
          refetch();
          refetchKPI();
        }}
      />

      {/* 5. SlideOver: Cập nhật sản phẩm (State Form cô lập hoàn toàn) */}
      <UpdateProductSlideOver
        open={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        product={editingProduct}
        brandOptions={brandOptions}
        isLoadingBrands={isLoadingBrands}
        categoryOptions={categoryOptions}
        isLoadingCategories={isLoadingCategories}
        onSuccess={() => {
          refetch();
          refetchKPI();
        }}
      />

      {/* 6. Modal xác nhận xóa sản phẩm an toàn */}
      <ConfirmModal
        open={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa sản phẩm"
        description={
          <div className="space-y-2">
            <p>
              Bạn có chắc chắn muốn xóa sản phẩm &quot;
              <strong className="text-foreground">
                {deletingProduct?.tenSanPham}
              </strong>
              &quot; không?
            </p>
            <span className="text-xs text-rose-600 dark:text-rose-400 block bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
              Lưu ý: Không thể xóa nếu sản phẩm này đã có các biến thể màu/pin
              hoặc phát sinh dữ liệu tồn kho.
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

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}
