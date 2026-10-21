"use client";

import React, { Suspense, useState, useMemo } from "react";
import { Warehouse, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RoleGuard } from "@/components/Common/RoleGuard";
import { WarehouseNavTabs } from "@/components/Common/WarehouseNavTabs";
import { useKho } from "@/hooks/Kho/useKho";
import { useGetKhoKPI } from "@/hooks/Kho/useKhoApi";
import { KHO_Kho } from "@/types/kho";
import {
  WarehousesKpiGrid,
  WarehousesFilterBar,
  WarehousesTable,
  CreateWarehouseSlideOver,
  UpdateWarehouseSlideOver,
  DeleteWarehouseModal,
} from "@/components/Warehouses";

function WarehousesContent() {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    searchInput,
    handleSearch,

    locationOptions,
    isLoadingLocations,

    loaiKhoOptions,
    getLoaiKhoLabel,
    isLoadingLoaiKho,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,
  } = useKho();

  const { data: kpiData, isLoading: isLoadingKPI } = useGetKhoKPI();

  // Quản lý trạng thái mở modal/drawer độc lập (cô lập state chống re-render toàn trang)
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [selectedWarehouseForEdit, setSelectedWarehouseForEdit] =
    useState<KHO_Kho | null>(null);
  const [selectedWarehouseForDelete, setSelectedWarehouseForDelete] =
    useState<KHO_Kho | null>(null);

  const activeCount = useMemo(
    () => items.filter((i) => i.trangThai === true).length,
    [items],
  );
  const inactiveCount = useMemo(
    () => items.filter((i) => i.trangThai === false).length,
    [items],
  );

  const hasActiveFilters = Boolean(searchInput || statusFilter !== "all");

  const handleResetFilters = () => {
    handleSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  return (
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-3 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header & Navigation */}
      <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 pb-2 sm:pb-4 border-b border-border/70 mb-2 sm:mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1">
              <span>Hệ thống</span>
              <span className="text-muted-foreground/30">/</span>
              <span>Vận hành & Kho</span>
              <span className="text-muted-foreground/30">/</span>
              <span className="text-foreground">Kho hàng & Bãi xe</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                <Warehouse className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Kho Hàng & Bãi Lưu Trữ
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Quản lý mạng lưới kho tổng, kho chi nhánh showroom, kho bảo
                  hành và điểm xuất bán
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-9 px-3.5 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
              />
              <span className="text-xs font-medium">Làm mới</span>
            </Button>

            {/* Quyền thêm kho: Administrator, AdminAccess, WarehouseAccess */}
            <RoleGuard
              allowedRoles={[
                "Administrator",
                "AdminAccess",
                "WarehouseAccess",
              ]}
            >
              <Button
                size="sm"
                onClick={() => setOpenCreate(true)}
                className="h-9 px-4 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer font-medium"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs">Thêm kho mới</span>
              </Button>
            </RoleGuard>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="pt-2">
          <WarehouseNavTabs
            activeTab="warehouses"
            totalWarehouses={totalCount}
          />
        </div>
      </div>

      {/* 2. KPI Cards */}
      <WarehousesKpiGrid
        kpiData={kpiData as Record<string, unknown>}
        items={items}
        totalCount={totalCount}
        isLoading={isLoading}
        isLoadingKPI={isLoadingKPI}
      />

      {/* 3. Filter Bar */}
      <WarehousesFilterBar
        searchInput={searchInput}
        onSearchChange={handleSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        totalCount={totalCount}
        activeCount={activeCount}
        inactiveCount={inactiveCount}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
      />

      {/* 4. Table */}
      <WarehousesTable
        items={items}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onEdit={(item) => setSelectedWarehouseForEdit(item)}
        onDelete={(item) => setSelectedWarehouseForDelete(item)}
        onAddNew={() => setOpenCreate(true)}
        getLoaiKhoLabel={getLoaiKhoLabel}
      />

      {/* 5. SlideOver Thêm kho mới */}
      <CreateWarehouseSlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        locationOptions={locationOptions}
        loaiKhoOptions={loaiKhoOptions}
        isLoadingLocations={isLoadingLocations}
        isLoadingLoaiKho={isLoadingLoaiKho}
      />

      {/* 6. SlideOver Cập nhật */}
      <UpdateWarehouseSlideOver
        open={Boolean(selectedWarehouseForEdit)}
        onClose={() => setSelectedWarehouseForEdit(null)}
        warehouse={selectedWarehouseForEdit}
        locationOptions={locationOptions}
        loaiKhoOptions={loaiKhoOptions}
        isLoadingLocations={isLoadingLocations}
        isLoadingLoaiKho={isLoadingLoaiKho}
      />

      {/* 7. Modal Xác nhận xóa */}
      <DeleteWarehouseModal
        open={Boolean(selectedWarehouseForDelete)}
        onClose={() => setSelectedWarehouseForDelete(null)}
        warehouse={selectedWarehouseForDelete}
      />
    </div>
  );
}

export default function WarehousesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 space-y-4 max-w-[1600px] mx-auto">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <WarehousesContent />
    </Suspense>
  );
}
