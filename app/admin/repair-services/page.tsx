"use client";

import React, { Suspense, useState } from "react";
import { useDichVuHook } from "@/hooks/SuaChua/useSuaChua";
import { useGetDichVuKPI } from "@/hooks/SuaChua/useSuaChuaApi";
import { SC_DichVu, CreateDichVuPayload, UpdateDichVuPayload } from "@/types/suaChua";
import {
  RepairServicesKpiGrid,
  RepairServicesFilterBar,
  RepairServicesTable,
  CreateRepairServiceSlideOver,
  UpdateRepairServiceSlideOver,
  RepairServicesSkeleton,
} from "@/components/RepairServices";

function RepairServicesContent() {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    searchInput,
    setSearchInput,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    serviceTypeOptions,
    getServiceTypeLabel,
    isLoadingServiceTypes,
    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,
    openAdd,
    setOpenAdd,
    handleOpenAdd,
    handleSubmitAdd,
    handleSubmitEdit,
    handleDelete,
    isSubmitting,
  } = useDichVuHook();

  const { data: kpi, isLoading: isLoadingKPI } = useGetDichVuKPI();

  // Selected item for update
  const [editingItem, setEditingItem] = useState<SC_DichVu | null>(null);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      {/* Header & Filter Bar */}
      <RepairServicesFilterBar
        totalCount={totalCount}
        totalServicesTab={kpi?.total_DichVu ?? totalCount}
        totalActive={kpi?.total_DangKinhDoanh}
        totalInactive={kpi?.total_NgungKinhDoanh}
        searchInput={searchInput}
        onSearchChange={(val) => {
          setSearchInput(val);
          setPage(1);
        }}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={(val) => {
          setCategoryFilter(val);
          setPage(1);
        }}
        serviceTypeOptions={serviceTypeOptions}
        getServiceTypeLabel={getServiceTypeLabel}
        isLoadingServiceTypes={isLoadingServiceTypes}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        onOpenCreate={handleOpenAdd}
        onReload={refetch}
        isFetching={isFetching}
      />

      {/* KPI Ribbon */}
      <RepairServicesKpiGrid
        kpi={kpi}
        isLoading={isLoadingKPI}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
      />

      {/* Data Table */}
      {isLoading ? (
        <div className="rounded-xl border border-border/80 bg-card p-6">
          <RepairServicesSkeleton />
        </div>
      ) : (
        <RepairServicesTable
          items={items}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          totalPages={totalPages}
          setPage={setPage}
          setPageSize={setPageSize}
          getServiceTypeLabel={getServiceTypeLabel}
          onEdit={(item) => setEditingItem(item)}
          onDelete={handleDelete}
          onOpenCreate={handleOpenAdd}
        />
      )}

      {/* Create SlideOver (Form State Isolated) */}
      <CreateRepairServiceSlideOver
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        serviceTypeOptions={serviceTypeOptions}
        isLoadingServiceTypes={isLoadingServiceTypes}
        onSubmit={async (payload: CreateDichVuPayload) => {
          await handleSubmitAdd(undefined, payload);
        }}
        isSubmitting={isSubmitting}
      />

      {/* Update SlideOver (Form State Isolated) */}
      <UpdateRepairServiceSlideOver
        open={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        item={editingItem}
        serviceTypeOptions={serviceTypeOptions}
        isLoadingServiceTypes={isLoadingServiceTypes}
        onSubmit={async (payload: UpdateDichVuPayload) => {
          await handleSubmitEdit(undefined, payload);
        }}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default function RepairServicesPage() {
  return (
    <Suspense fallback={<RepairServicesSkeleton />}>
      <RepairServicesContent />
    </Suspense>
  );
}
