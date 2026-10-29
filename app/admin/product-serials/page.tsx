"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSoSerial } from "@/hooks/SoSerial/useSoSerial";
import { SP_SoSerial } from "@/types/soSerial";
import {
  ProductSerialsKpiGrid,
  ProductSerialsFilterBar,
  ProductSerialsGrid,
  ProductSerialsTable,
  CreateProductSerialSlideOver,
  EditProductSerialSlideOver,
  ActivateWarrantySlideOver,
  ChangeSerialStatusSlideOver,
  SerialImagesSlideOver,
  ProductSerialsSkeleton,
} from "@/components/ProductSerials";

type ViewMode = "grid" | "table";

function SerialsContent() {
  const searchParams = useSearchParams();
  const initialVariantId = searchParams.get("variantId") || undefined;

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    bienTheFilter,
    setBienTheFilter,
    searchInput,
    handleSearch,

    variantOptions,
    isLoadingVariants,
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

    serialStatusOptions,
    getSerialStatusBadge,
    getSerialStatusLabel,
    isLoadingSerialStatuses,
  } = useSoSerial(initialVariantId);

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [openAdd, setOpenAdd] = useState(false);
  const [editingSerial, setEditingSerial] = useState<SP_SoSerial | null>(null);
  const [warrantySerial, setWarrantySerial] = useState<SP_SoSerial | null>(
    null,
  );
  const [statusSerial, setStatusSerial] = useState<SP_SoSerial | null>(null);
  const [imageSerial, setImageSerial] = useState<SP_SoSerial | null>(null);

  const handleResetFilters = () => {
    handleSearch("");
    setStatusFilter(null);
    setBienTheFilter("");
    setPage(1);
  };

  // Thống kê fallback từ client nếu KPI backend chưa tải
  const inStockCount = useMemo(
    () =>
      items.filter((i) => {
        const b = getSerialStatusBadge(i.trangThaiID);
        return (
          b.color === "emerald" || i.trangThaiID === 59 || i.trangThaiID === 1
        );
      }).length,
    [items, getSerialStatusBadge],
  );

  const soldCount = useMemo(
    () =>
      items.filter((i) => {
        const b = getSerialStatusBadge(i.trangThaiID);
        return (
          b.color === "blue" || i.trangThaiID === 61 || i.trangThaiID === 2
        );
      }).length,
    [items, getSerialStatusBadge],
  );

  const maintenanceCount = useMemo(
    () =>
      items.filter((i) => {
        const b = getSerialStatusBadge(i.trangThaiID);
        return (
          b.color === "purple" ||
          b.color === "amber" ||
          b.color === "rose" ||
          i.trangThaiID === 62 ||
          i.trangThaiID === 63 ||
          i.trangThaiID === 65
        );
      }).length,
    [items, getSerialStatusBadge],
  );

  // Thống kê KPI ưu tiên từ Backend API GetKPI, fallback sang dataset client
  const totalSoSerial = useMemo(() => {
    return kpiData?.total_SoSerial ?? totalCount;
  }, [kpiData?.total_SoSerial, totalCount]);

  const totalTrongKho = useMemo(() => {
    return kpiData?.total_TrongKho ?? inStockCount;
  }, [kpiData?.total_TrongKho, inStockCount]);

  const totalDaXuatBan = useMemo(() => {
    return kpiData?.total_DaXuatBan ?? soldCount;
  }, [kpiData?.total_DaXuatBan, soldCount]);

  const totalBaoHanhXuong = useMemo(() => {
    return kpiData?.total_BaoHanhXuong ?? maintenanceCount;
  }, [kpiData?.total_BaoHanhXuong, maintenanceCount]);

  const hasActiveFilters = Boolean(
    searchInput || statusFilter !== null || bienTheFilter,
  );

  return (
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-3 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header, Navigation Tabs & Multi-Filter Toolbar */}
      <ProductSerialsFilterBar
        searchInput={searchInput}
        onSearch={handleSearch}
        bienTheFilter={bienTheFilter}
        onBienTheFilterChange={(val) => {
          setBienTheFilter(val);
          setPage(1);
        }}
        variantOptions={variantOptions}
        isLoadingVariants={isLoadingVariants}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        serialStatusOptions={serialStatusOptions}
        isLoadingSerialStatuses={isLoadingSerialStatuses}
        getSerialStatusLabel={getSerialStatusLabel}
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
      <ProductSerialsKpiGrid
        totalSoSerial={totalSoSerial}
        totalTrongKho={totalTrongKho}
        totalDaXuatBan={totalDaXuatBan}
        totalBaoHanhXuong={totalBaoHanhXuong}
        statusFilter={statusFilter}
        onSelectTotal={() => {
          setStatusFilter(null);
          setPage(1);
        }}
        onSelectInStock={() => {
          setStatusFilter(59);
          setPage(1);
        }}
        onSelectSold={() => {
          setStatusFilter(61);
          setPage(1);
        }}
        onSelectMaintenance={() => {
          setStatusFilter(62);
          setPage(1);
        }}
        isLoadingKPI={isLoadingKPI}
        isLoading={isLoading}
      />

      {/* 3. Nội dung dữ liệu chính (Chế độ xem kép: Grid thẻ tài sản & Table) */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card
              key={idx}
              className="p-4 rounded-xl border border-border/70 space-y-3"
            >
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-8 w-full" />
            </Card>
          ))}
        </div>
      ) : viewMode === "grid" ? (
        <ProductSerialsGrid
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onOpenWarranty={(serial) => setWarrantySerial(serial)}
          onOpenChangeStatus={(serial) => setStatusSerial(serial)}
          onOpenImages={(serial) => setImageSerial(serial)}
          onOpenAdd={() => setOpenAdd(true)}
          onOpenEdit={(serial) => setEditingSerial(serial)}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          getSerialStatusBadge={getSerialStatusBadge}
        />
      ) : (
        <ProductSerialsTable
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onOpenWarranty={(serial) => setWarrantySerial(serial)}
          onOpenChangeStatus={(serial) => setStatusSerial(serial)}
          onOpenImages={(serial) => setImageSerial(serial)}
          onOpenEdit={(serial) => setEditingSerial(serial)}
          getSerialStatusBadge={getSerialStatusBadge}
        />
      )}

      {/* 4. SlideOver: Đăng ký Serial mới (State Form cô lập hoàn toàn) */}
      <CreateProductSerialSlideOver
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        variantOptions={variantOptions}
        isLoadingVariants={isLoadingVariants}
        defaultBienTheId={bienTheFilter}
        onSuccess={() => {
          refetch();
          refetchKPI();
        }}
      />
      <EditProductSerialSlideOver
        open={Boolean(editingSerial)}
        selectSerial={editingSerial}
        onClose={() => setEditingSerial(null)}
        variantOptions={variantOptions}
        isLoadingVariants={isLoadingVariants}
        defaultBienTheId={bienTheFilter}
        onSuccess={() => {
          refetch();
          refetchKPI();
        }}
      />
      {/* 5. SlideOver: Kích hoạt Bảo hành Điện tử (State Form cô lập hoàn toàn) */}
      <ActivateWarrantySlideOver
        open={Boolean(warrantySerial)}
        onClose={() => setWarrantySerial(null)}
        serial={warrantySerial}
        customerOptions={customerOptions}
        isLoadingCustomers={isLoadingCustomers}
        getSerialStatusBadge={getSerialStatusBadge}
        onSuccess={() => {
          refetch();
          refetchKPI();
        }}
      />

      {/* 6. SlideOver: Chuyển Trạng thái Thiết bị (State Form cô lập hoàn toàn) */}
      <ChangeSerialStatusSlideOver
        open={Boolean(statusSerial)}
        onClose={() => setStatusSerial(null)}
        serial={statusSerial}
        serialStatusOptions={serialStatusOptions}
        isLoadingSerialStatuses={isLoadingSerialStatuses}
        getSerialStatusLabel={getSerialStatusLabel}
        onSuccess={() => {
          refetch();
          refetchKPI();
        }}
      />

      {/* 7. SlideOver: Thư viện & Upload Hình ảnh Xe theo Serial */}
      <SerialImagesSlideOver
        open={Boolean(imageSerial)}
        onClose={() => setImageSerial(null)}
        serial={imageSerial}
      />
    </div>
  );
}

export default function ProductSerialsPage() {
  return (
    <Suspense fallback={<ProductSerialsSkeleton />}>
      <SerialsContent />
    </Suspense>
  );
}
