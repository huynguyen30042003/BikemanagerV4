"use client";

import React, { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RoleGuard } from "@/components/Common/RoleGuard";
import { ServiceNavTabs } from "@/components/Common/ServiceNavTabs";
import { usePhieuBaoHanhHook } from "@/hooks/BaoHanh/useBaoHanh";
import { useGetPhieuBaoHanhKPI } from "@/hooks/BaoHanh/useBaoHanhApi";
import { BH_PhieuBaoHanh } from "@/types/baoHanh";
import {
  WarrantyClaimsKpiGrid,
  WarrantyClaimsFilterBar,
  WarrantyClaimsTable,
  CreateWarrantyClaimSlideOver,
  WarrantyClaimDetailSlideOver,
} from "@/components/WarrantyClaims";
import { FileText, Plus, RefreshCw } from "lucide-react";

function WarrantyClaimsContent() {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
    actionFilter,
    setActionFilter,
    claimStatusOptions,
    getClaimStatusBadge,
    isLoadingClaimStatuses,
    actionOptions,
    getActionBadge,
    isLoadingActions,
    diaDiemOptions,
    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,
    handleDelete,
  } = usePhieuBaoHanhHook();

  const { data: kpi } = useGetPhieuBaoHanhKPI();

  // Dialog and drawer states (Single-State Pattern)
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<BH_PhieuBaoHanh | null>(null);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Phiếu Tiếp Nhận & Xử Lý Bảo Hành
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Quy trình tiếp nhận xe lỗi, chẩn đoán, đổi mới pin/linh kiện hoặc bảo hành hãng
              </p>
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

            <RoleGuard
              allowedRoles={[
                "Administrator",
                "AdminAccess",
                "TechnicalAccess",
              ]}
            >
              <Button
                size="sm"
                onClick={() => setOpenCreate(true)}
                className="h-9 px-4 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer font-medium"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs">Lập phiếu tiếp nhận</span>
              </Button>
            </RoleGuard>
          </div>
        </div>

        <div className="pt-2">
          <ServiceNavTabs
            activeTab="claims"
            totalClaims={kpi?.total_PhieuBaoHanh ?? totalCount}
          />
        </div>
      </div>

      {/* KPI Ribbon */}
      <WarrantyClaimsKpiGrid />

      {/* Filter Bar */}
      <WarrantyClaimsFilterBar
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        actionFilter={actionFilter}
        onActionFilterChange={setActionFilter}
        claimStatusOptions={claimStatusOptions}
        isLoadingClaimStatuses={isLoadingClaimStatuses}
        actionOptions={actionOptions}
        isLoadingActions={isLoadingActions}
      />

      {/* Table & Pagination */}
      <WarrantyClaimsTable
        items={items}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onViewDetail={(item) => setSelectedDetail(item)}
        onDelete={handleDelete}
        onAddNew={() => setOpenCreate(true)}
        getClaimStatusBadge={getClaimStatusBadge}
        getActionBadge={getActionBadge}
      />

      {/* SlideOver Lập phiếu tiếp nhận mới (Isolated state) */}
      <CreateWarrantyClaimSlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        diaDiemOptions={diaDiemOptions}
        claimStatusOptions={claimStatusOptions}
        isLoadingClaimStatuses={isLoadingClaimStatuses}
        actionOptions={actionOptions}
        isLoadingActions={isLoadingActions}
        onSuccess={() => refetch()}
      />

      {/* SlideOver Xem chi tiết phiếu & linh kiện bảo hành */}
      <WarrantyClaimDetailSlideOver
        open={Boolean(selectedDetail)}
        onClose={() => setSelectedDetail(null)}
        selectedItem={selectedDetail}
        getClaimStatusBadge={getClaimStatusBadge}
        getActionBadge={getActionBadge}
      />
    </div>
  );
}

export default function WarrantyClaimsPage() {
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
      <WarrantyClaimsContent />
    </Suspense>
  );
}
