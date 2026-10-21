"use client";

import React, { Suspense, useState } from "react";
import { Truck, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RoleGuard } from "@/components/Common/RoleGuard";
import { PurchaseNavTabs } from "@/components/Common/PurchaseNavTabs";
import { useNhaCungCap } from "@/hooks/NhaCungCap/useNhaCungCap";
import { NH_NhaCungCap } from "@/types/nhaCungCap";
import {
  SuppliersKpiGrid,
  SuppliersFilterBar,
  SuppliersTable,
  CreateSupplierSlideOver,
  UpdateSupplierSlideOver,
  DeleteSupplierModal,
} from "@/components/Suppliers";

function SuppliersContent() {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    quocGiaFilter,
    setQuocGiaFilter,
    coCongNoFilter,
    setCoCongNoFilter,
    searchInput,
    handleSearch,

    countryOptions,
    isLoadingCountries,
    provinceOptions,
    isLoadingProvinces,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,
    kpiData,
    isLoadingKPI,
    refetchKPI,
  } = useNhaCungCap();

  // Quản lý trạng thái mở modal/drawer độc lập (cô lập state chống re-render toàn trang)
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [selectedSupplierForEdit, setSelectedSupplierForEdit] =
    useState<NH_NhaCungCap | null>(null);
  const [selectedSupplierForDelete, setSelectedSupplierForDelete] =
    useState<NH_NhaCungCap | null>(null);

  const hasActiveFilters =
    searchInput !== "" ||
    quocGiaFilter !== "" ||
    coCongNoFilter !== "all" ||
    statusFilter !== "all";

  const handleResetFilters = () => {
    handleSearch("");
    setQuocGiaFilter("");
    setCoCongNoFilter("all");
    setStatusFilter("all");
    setPage(1);
  };

  const totalSuppliers = kpiData?.total_NhaCungCap ?? totalCount;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      {/* 1. Header & Navigation */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Nhà Cung Cấp & Đối Tác
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Quản lý hồ sơ nhà cung cấp xe điện, phụ tùng, pin và theo dõi
                công nợ nhập hàng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetch();
                refetchKPI();
              }}
              disabled={isFetching || isLoadingKPI}
              className="h-9 px-3.5 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""
                }`}
              />
              <span className="text-xs font-medium">Làm mới</span>
            </Button>

            {/* Quyền thêm nhà cung cấp: Administrator, AdminAccess, PurchaseAccess */}
            <RoleGuard
              allowedRoles={[
                "Administrator",
                "AdminAccess",
                "PurchaseAccess",
              ]}
            >
              <Button
                size="sm"
                onClick={() => setOpenCreate(true)}
                className="h-9 px-4 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer font-medium"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs">Thêm nhà cung cấp</span>
              </Button>
            </RoleGuard>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="pt-2">
          <PurchaseNavTabs
            activeTab="suppliers"
            totalSuppliers={totalSuppliers}
          />
        </div>
      </div>

      {/* 2. Ribbon KPI Cards */}
      <SuppliersKpiGrid
        kpiData={kpiData}
        totalCount={totalCount}
        items={items}
        isLoading={isLoading}
        isLoadingKPI={isLoadingKPI}
      />

      {/* 3. Filter Bar */}
      <SuppliersFilterBar
        searchInput={searchInput}
        onSearchChange={handleSearch}
        countryOptions={countryOptions}
        isLoadingCountries={isLoadingCountries}
        quocGiaFilter={quocGiaFilter}
        onQuocGiaFilterChange={(val) => {
          setQuocGiaFilter(val);
          setPage(1);
        }}
        coCongNoFilter={coCongNoFilter}
        onCoCongNoFilterChange={(val) => {
          setCoCongNoFilter(val);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 4. Table view */}
      <SuppliersTable
        items={items}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onEdit={(item) => setSelectedSupplierForEdit(item)}
        onDelete={(item) => setSelectedSupplierForDelete(item)}
        onAddNew={() => setOpenCreate(true)}
      />

      {/* 5. SlideOver Thêm mới (State cô lập trong component) */}
      <CreateSupplierSlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        countryOptions={countryOptions}
        provinceOptions={provinceOptions}
        isLoadingCountries={isLoadingCountries}
        isLoadingProvinces={isLoadingProvinces}
      />

      {/* 6. SlideOver Cập nhật (State cô lập trong component) */}
      <UpdateSupplierSlideOver
        open={Boolean(selectedSupplierForEdit)}
        onClose={() => setSelectedSupplierForEdit(null)}
        supplier={selectedSupplierForEdit}
        countryOptions={countryOptions}
        provinceOptions={provinceOptions}
        isLoadingCountries={isLoadingCountries}
        isLoadingProvinces={isLoadingProvinces}
      />

      {/* 7. Modal Xác nhận xóa */}
      <DeleteSupplierModal
        open={Boolean(selectedSupplierForDelete)}
        onClose={() => setSelectedSupplierForDelete(null)}
        supplier={selectedSupplierForDelete}
      />
    </div>
  );
}

export default function SuppliersPage() {
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
      <SuppliersContent />
    </Suspense>
  );
}
