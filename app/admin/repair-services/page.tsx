"use client";

import React, { Suspense, useState } from "react";
import { useDichVuHook } from "@/hooks/SuaChua/useSuaChua";
import { useGetDichVuKPI } from "@/hooks/SuaChua/useSuaChuaApi";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
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
    openEdit,
    setOpenEdit,
    handleOpenAdd,
    handleOpenEdit,
    handleSubmitAdd,
    handleSubmitEdit,
    handleDelete,
    isSubmitting,
  } = useDichVuHook();

  const { data: kpi, isLoading: isLoadingKPI } = useGetDichVuKPI();

  // Selected item for update
  const [editingItem, setEditingItem] = useState<SC_DichVu | null>(null);

  // State for delete modal
  const [itemToDelete, setItemToDelete] = useState<SC_DichVu | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStartEdit = (item: SC_DichVu) => {
    setEditingItem(item);
    handleOpenEdit(item);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setIsDeleting(true);
      await handleDelete(itemToDelete);
      setItemToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

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
          onEdit={handleStartEdit}
          onDelete={setItemToDelete}
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
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setEditingItem(null);
        }}
        item={editingItem}
        serviceTypeOptions={serviceTypeOptions}
        isLoadingServiceTypes={isLoadingServiceTypes}
        onSubmit={async (payload: UpdateDichVuPayload) => {
          await handleSubmitEdit(undefined, payload);
        }}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa dịch vụ"
        description={
          <span>
            Bạn có chắc chắn muốn xóa dịch vụ{" "}
            <strong className="text-foreground">
              &quot;{itemToDelete?.tenDichVu}&quot;
            </strong>{" "}
            (mã: <span className="font-mono text-blue-600">{itemToDelete?.maDichVu}</span>)?
            Thao tác này sẽ xóa vĩnh viễn dịch vụ khỏi bảng giá hệ thống.
          </span>
        }
        confirmText="Xóa vĩnh viễn"
        cancelText="Hủy"
        variant="danger"
        isLoading={isDeleting}
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
