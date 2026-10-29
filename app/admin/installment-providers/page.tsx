"use client";

import React, { Suspense, useState } from "react";
import { useDonViTraGopHook } from "@/hooks/TraGop/useTraGop";
import { useGetDonViTraGopKPI } from "@/hooks/TraGop/useTraGopApi";
import { DonViTraGop } from "@/types/traGop";
import {
  InstallmentProvidersKpiGrid,
  InstallmentProvidersFilterBar,
  InstallmentProvidersTable,
  CreateInstallmentProviderSlideOver,
  UpdateInstallmentProviderSlideOver,
  InstallmentProvidersSkeleton,
} from "@/components/InstallmentProviders";

function InstallmentProvidersContent() {
  const { data: providerKpi, isLoading: isLoadingKPI } = useGetDonViTraGopKPI();

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,
    openAdd,
    setOpenAdd,
    handleSubmitAdd,
    handleSubmitEdit,
    handleDelete,
    isSubmitting,
  } = useDonViTraGopHook();

  // Single-state pattern for edit slideover (AGENTS.md Section 11.2)
  const [editingProvider, setEditingProvider] = useState<DonViTraGop | null>(
    null,
  );

  const handleFilterStatus = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleResetFilters = () => {
    setStatusFilter("all");
    setPage(1);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      {/* 1. Header, Tab navigation & Filter Toolbar */}
      <InstallmentProvidersFilterBar
        totalProviders={
          providerKpi?.total_DonViTraGop ??
          providerKpi?.totalDonViTraGop ??
          totalCount
        }
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        isFetching={isFetching}
        onRefresh={refetch}
        onOpenAdd={() => setOpenAdd(true)}
      />

      {/* 2. Dải KPI Ribbon chỉ số đối tác trả góp */}
      <InstallmentProvidersKpiGrid
        kpiData={providerKpi}
        totalCount={totalCount}
        statusFilter={statusFilter}
        onFilterStatus={handleFilterStatus}
        onResetFilters={handleResetFilters}
        isLoadingKPI={isLoadingKPI}
        isLoading={isLoading}
      />

      {/* 3. Bảng dữ liệu Đối tác cho vay trả góp */}
      {isLoading ? (
        <InstallmentProvidersSkeleton />
      ) : (
        <InstallmentProvidersTable
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onEdit={setEditingProvider}
          onDelete={handleDelete}
          onOpenAdd={() => setOpenAdd(true)}
        />
      )}

      {/* 4. SlideOver Form thêm mới đối tác (cô lập state) */}
      <CreateInstallmentProviderSlideOver
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={handleSubmitAdd}
        isSubmitting={isSubmitting}
        defaultOrder={items.length + 1}
      />

      {/* 5. SlideOver Form cập nhật thông tin đối tác (cô lập state) */}
      <UpdateInstallmentProviderSlideOver
        open={Boolean(editingProvider)}
        onClose={() => setEditingProvider(null)}
        item={editingProvider}
        onSubmit={async (payload) => {
          await handleSubmitEdit(payload);
          setEditingProvider(null);
        }}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default function InstallmentProvidersPage() {
  return (
    <Suspense fallback={<InstallmentProvidersSkeleton />}>
      <InstallmentProvidersContent />
    </Suspense>
  );
}
