"use client";

import React, { Suspense, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { WarehouseNavTabs } from "@/components/Common/WarehouseNavTabs";
import { usePhieuKiemKe } from "@/hooks/PhieuKiemKe/usePhieuKiemKe";
import { useGetPhieuKiemKeKPI } from "@/hooks/PhieuKiemKe/usePhieuKiemKeApi";
import { KHO_PhieuKiemKe } from "@/types/phieuKiemKe";
import {
  StockAuditsKpiGrid,
  StockAuditsFilterBar,
  StockAuditsTable,
  CreateStockAuditSlideOver,
  StockAuditDetailSlideOver,
  UpdateStockAuditCountsSlideOver,
} from "@/components/StockAudits";
import { ClipboardCheck } from "lucide-react";

function StockAuditsContent() {
  const { data: auditKpi, isLoading: isLoadingKPI } = useGetPhieuKiemKeKPI();

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
    setSearchInput,
    handleSearch,
    handleResetFilters,
    hasActiveFilters,

    khoOptions,
    isLoadingKhos,

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

    handleSubmitCapNhat,
    isCapNhatting,

    handleCanBang,
    isCanBang,
    handleHuyPhieu,
    isHuyPhieu,

    auditStatusOptions,
    getAuditStatusBadge,
    isLoadingAuditStatuses,
    reasonDiscrepancyOptions,
    isLoadingReasons,
  } = usePhieuKiemKe();

  // Single-State Pattern cho chi tiết & cập nhật số đếm
  const [detailPhieu, setDetailPhieu] = useState<KHO_PhieuKiemKe | null>(null);
  const [capNhatPhieu, setCapNhatPhieu] = useState<KHO_PhieuKiemKe | null>(null);

  // Thống kê nhanh theo trạng thái động từ DM_DanhMucChiTiet
  const inProgressCount = useMemo(
    () =>
      items.filter((i) => {
        const b = getAuditStatusBadge(i.trangThaiID);
        return (
          b.color === "amber" || i.trangThaiID === 26 || i.trangThaiID === 1
        );
      }).length,
    [items, getAuditStatusBadge]
  );

  const balancedCount = useMemo(
    () =>
      items.filter((i) => {
        const b = getAuditStatusBadge(i.trangThaiID);
        return (
          b.color === "emerald" || i.trangThaiID === 27 || i.trangThaiID === 2
        );
      }).length,
    [items, getAuditStatusBadge]
  );

  const totalDiscrepancy = useMemo(
    () => items.reduce((sum, i) => sum + Math.abs(i.tongSoLuongLech || 0), 0),
    [items]
  );

  const currentKhoName = useMemo(() => {
    if (!khoFilter) return "";
    return (
      khoOptions.find(
        (k: { value: string | number; label: string }) => k.value === khoFilter
      )?.label || ""
    );
  }, [khoFilter, khoOptions]);

  return (
    <section className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-3 sm:space-y-5 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header Section */}
      <header className="flex flex-col gap-2 sm:gap-3 lg:gap-4 pb-2 sm:pb-4 border-b border-border/70">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1">
            <span>Hệ thống</span>
            <span className="text-muted-foreground/30">/</span>
            <span>Vận hành & Kho</span>
            <span className="text-muted-foreground/30">/</span>
            <span className="text-foreground">Kiểm kê kho</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Kiểm Kê Kho & Đối Soát Tồn
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Thực hiện kiểm đếm thực tế, đối soát chênh lệch sổ sách và tự động cân bằng số liệu tồn kho
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="pt-1">
          <WarehouseNavTabs
            activeTab="audits"
            totalAudits={
              auditKpi?.total_PhieuKiemKe ??
              auditKpi?.totalPhieuKiemKe ??
              totalCount
            }
          />
        </div>
      </header>

      {/* 2. KPI Cards */}
      <StockAuditsKpiGrid
        auditKpi={auditKpi}
        isLoading={isLoadingKPI || isLoading}
        totalCount={totalCount}
        inProgressCount={inProgressCount}
        balancedCount={balancedCount}
        totalDiscrepancy={totalDiscrepancy}
      />

      {/* 3. Filter Bar */}
      <StockAuditsFilterBar
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearchSubmit={handleSearch}
        khoFilter={khoFilter}
        onKhoFilterChange={(val) => {
          setKhoFilter(val);
          setPage(1);
        }}
        khoOptions={khoOptions}
        isLoadingKhos={isLoadingKhos}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        statusOptions={auditStatusOptions}
        isLoadingStatuses={isLoadingAuditStatuses}
        totalAudits={
          auditKpi?.total_PhieuKiemKe ??
          auditKpi?.totalPhieuKiemKe ??
          totalCount
        }
        inProgressCount={inProgressCount}
        balancedCount={balancedCount}
        currentKhoName={currentKhoName}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        onRefresh={() => refetch()}
        isFetching={isFetching}
        onOpenCreate={handleOpenCreate}
      />

      {/* 4. Data Table with Standard Pagination */}
      <StockAuditsTable
        items={items}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        totalCount={totalCount}
        setPage={setPage}
        setPageSize={setPageSize}
        getAuditStatusBadge={getAuditStatusBadge}
        onOpenDetail={setDetailPhieu}
        onOpenCapNhat={setCapNhatPhieu}
        onOpenCreate={handleOpenCreate}
      />

      {/* 5. SlideOver Khởi tạo đợt kiểm kê */}
      <CreateStockAuditSlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={async (payload) => {
          await handleSubmitCreate(payload);
        }}
        isCreating={isCreating}
        khoOptions={khoOptions}
        isLoadingKhos={isLoadingKhos}
        defaultKhoId={khoFilter}
      />

      {/* 6. SlideOver Chi tiết biên bản kiểm kê & Đối soát */}
      <StockAuditDetailSlideOver
        open={Boolean(detailPhieu)}
        onClose={() => setDetailPhieu(null)}
        phieu={detailPhieu}
        getAuditStatusBadge={getAuditStatusBadge}
        onOpenCapNhat={(phieu) => {
          setDetailPhieu(null);
          setCapNhatPhieu(phieu);
        }}
        onCanBang={async (id) => {
          await handleCanBang(id);
          setDetailPhieu(null);
        }}
        isCanBang={isCanBang}
        onHuyPhieu={async (id) => {
          await handleHuyPhieu(id);
          setDetailPhieu(null);
        }}
        isHuyPhieu={isHuyPhieu}
      />

      {/* 7. SlideOver Cập nhật số đếm thực tế kiểm kê */}
      <UpdateStockAuditCountsSlideOver
        open={Boolean(capNhatPhieu)}
        onClose={() => setCapNhatPhieu(null)}
        phieu={capNhatPhieu}
        onSubmit={async (payload) => {
          await handleSubmitCapNhat(payload);
          setCapNhatPhieu(null);
        }}
        isUpdating={isCapNhatting}
        reasonDiscrepancyOptions={reasonDiscrepancyOptions}
        isLoadingReasons={isLoadingReasons}
      />
    </section>
  );
}

export default function StockAuditsPage() {
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
      <StockAuditsContent />
    </Suspense>
  );
}
