"use client";

import React, { Suspense, useMemo } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { WarehouseNavTabs } from "@/components/Common/WarehouseNavTabs";
import { usePhieuChuyenKho } from "@/hooks/PhieuChuyenKho/usePhieuChuyenKho";
import { useGetPhieuChuyenKhoKPI } from "@/hooks/PhieuChuyenKho/usePhieuChuyenKhoApi";
import {
  StockTransfersKpiGrid,
  StockTransfersFilterBar,
  StockTransfersTable,
  CreateStockTransferSlideOver,
  StockTransferDetailSlideOver,
} from "@/components/StockTransfers";

function StockTransfersContent() {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    khoFilter,
    setKhoFilter,
    statusFilter,
    setStatusFilter,
    searchInput,
    handleSearch,
    hasActiveFilters,
    handleResetFilters,

    khoOptions,
    isLoadingKhos,
    variantOptions,
    isLoadingVariants,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    openCreate,
    setOpenCreate,
    handleOpenCreate,
    handleSubmitCreate,
    isCreating,

    openDetail,
    setOpenDetail,
    selectedPhieu,
    handleOpenDetail,
    handleXuatKho,
    isXuatKho,
    handleNhanHang,
    isNhanHang,
    handleHuyPhieu,
    isHuyPhieu,

    transferStatusOptions,
    getTransferStatusBadge,
    isLoadingStatusList,
  } = usePhieuChuyenKho();

  const { data: transferKpi, isLoading: isLoadingKPI } =
    useGetPhieuChuyenKhoKPI();

  // Thống kê nhanh theo trạng thái từ danh sách items
  const waitingCount = useMemo(
    () =>
      items.filter((i) => {
        const b = getTransferStatusBadge(i.trangThaiID);
        return (
          b.color === "amber" || i.trangThaiID === 22 || i.trangThaiID === 1
        );
      }).length,
    [items, getTransferStatusBadge]
  );

  const inTransitCount = useMemo(
    () =>
      items.filter((i) => {
        const b = getTransferStatusBadge(i.trangThaiID);
        return (
          b.color === "blue" || i.trangThaiID === 23 || i.trangThaiID === 2
        );
      }).length,
    [items, getTransferStatusBadge]
  );

  const completedCount = useMemo(
    () =>
      items.filter((i) => {
        const b = getTransferStatusBadge(i.trangThaiID);
        return (
          b.color === "emerald" || i.trangThaiID === 24 || i.trangThaiID === 3
        );
      }).length,
    [items, getTransferStatusBadge]
  );

  return (
    <section className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-4 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header & Navigation */}
      <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 pb-2 sm:pb-4 border-b border-border/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1">
              <span>Hệ thống</span>
              <span className="text-muted-foreground/30">/</span>
              <span>Vận hành & Kho</span>
              <span className="text-muted-foreground/30">/</span>
              <span className="text-foreground">Điều chuyển kho</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Điều Chuyển Kho Nội Bộ
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Quản lý phiếu luân chuyển xe và linh kiện giữa các kho tổng, chi nhánh showroom và xưởng dịch vụ
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="pt-1">
          <WarehouseNavTabs activeTab="transfers" totalTransfers={totalCount} />
        </div>
      </div>

      {/* 2. KPI Summary Ribbon */}
      <StockTransfersKpiGrid
        transferKpi={transferKpi}
        isLoading={isLoadingKPI || isLoading}
        totalCount={totalCount}
        waitingCount={waitingCount}
        inTransitCount={inTransitCount}
        completedCount={completedCount}
      />

      {/* 3. Search & Filter Bar */}
      <StockTransfersFilterBar
        searchInput={searchInput}
        onSearchChange={handleSearch}
        khoFilter={khoFilter}
        onKhoFilterChange={(val) => {
          setKhoFilter(val);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        khoOptions={khoOptions}
        isLoadingKhos={isLoadingKhos}
        transferStatusOptions={transferStatusOptions}
        isLoadingStatusList={isLoadingStatusList}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        isFetching={isFetching}
        onRefetch={refetch}
        onOpenCreate={handleOpenCreate}
      />

      {/* 4. Data Table & Pagination */}
      <StockTransfersTable
        items={items}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        totalCount={totalCount}
        setPage={setPage}
        setPageSize={setPageSize}
        getTransferStatusBadge={getTransferStatusBadge}
        onOpenDetail={handleOpenDetail}
        onOpenCreate={handleOpenCreate}
      />

      {/* 5. Isolated Create Transfer SlideOver */}
      <CreateStockTransferSlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={async (payload) => {
          await handleSubmitCreate(payload);
        }}
        isCreating={isCreating}
        khoOptions={khoOptions}
        isLoadingKhos={isLoadingKhos}
        variantOptions={variantOptions}
        isLoadingVariants={isLoadingVariants}
      />

      {/* 6. Isolated Transfer Detail & Operations SlideOver */}
      <StockTransferDetailSlideOver
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        phieu={selectedPhieu}
        getTransferStatusBadge={getTransferStatusBadge}
        onXuatKho={handleXuatKho}
        isXuatKho={isXuatKho}
        onNhanHang={handleNhanHang}
        isNhanHang={isNhanHang}
        onHuyPhieu={handleHuyPhieu}
        isHuyPhieu={isHuyPhieu}
      />
    </section>
  );
}

export default function StockTransfersPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 md:p-8 space-y-6">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <StockTransfersContent />
    </Suspense>
  );
}
