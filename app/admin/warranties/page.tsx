"use client";

import React, { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RoleGuard } from "@/components/Common/RoleGuard";
import { ServiceNavTabs } from "@/components/Common/ServiceNavTabs";
import { useBaoHanhHook } from "@/hooks/BaoHanh/useBaoHanh";
import { useGetBaoHanhKPI } from "@/hooks/BaoHanh/useBaoHanhApi";
import { BH_BaoHanh } from "@/types/baoHanh";
import {
  WarrantiesKpiGrid,
  WarrantiesFilterBar,
  WarrantiesTable,
  CreateWarrantySlideOver,
  DeleteWarrantyModal,
} from "@/components/Warranties";
import { SerialImagesSlideOver } from "@/components/ProductSerials";
import { ShieldCheck, Plus, RefreshCw } from "lucide-react";

function WarrantiesContent() {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
    warrantyStatusOptions,
    getWarrantyStatusBadge,
    isLoadingStatuses,
    customerOptions,
    serialOptions,
    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,
  } = useBaoHanhHook();

  const { data: kpi } = useGetBaoHanhKPI();

  // Dialog states (Isolated from page re-renders)
  const [openCreate, setOpenCreate] = useState(false);
  const [deleteItem, setDeleteItem] = useState<BH_BaoHanh | null>(null);
  const [imageSerial, setImageSerial] = useState<{
    soSerialID: string;
    maSerial?: string;
    soKhung?: string;
    tenBienThe?: string;
  } | null>(null);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Sổ Bảo Hành Điện Tử Xe & Pin
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tra cứu bảo hành theo Số Khung VIN, Số Pin, Số Máy và quản lý thời hạn cam kết bảo hành
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
                "SaleAccess",
              ]}
            >
              <Button
                size="sm"
                onClick={() => setOpenCreate(true)}
                className="h-9 px-4 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer font-medium"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs">Kích hoạt sổ bảo hành</span>
              </Button>
            </RoleGuard>
          </div>
        </div>

        <div className="pt-2">
          <ServiceNavTabs
            activeTab="warranties"
            totalWarranties={kpi?.total_BaoHanh ?? totalCount}
          />
        </div>
      </div>

      {/* KPI Ribbon */}
      <WarrantiesKpiGrid />

      {/* Filter Bar */}
      <WarrantiesFilterBar
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        warrantyStatusOptions={warrantyStatusOptions}
        isLoadingStatuses={isLoadingStatuses}
      />

      {/* Table & Pagination */}
      <WarrantiesTable
        items={items}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onDelete={(item) => setDeleteItem(item)}
        onAddNew={() => setOpenCreate(true)}
        onOpenImages={(item) =>
          setImageSerial({
            soSerialID: item.soSerialID,
            maSerial: item.maSerial || "",
            soKhung: item.soKhung || "",
            tenBienThe: item.tenBienThe || "",
          })
        }
        getWarrantyStatusBadge={getWarrantyStatusBadge}
      />

      {/* Slide-over xem & tải lên thư viện ảnh xe / bảo hành */}
      <SerialImagesSlideOver
        open={Boolean(imageSerial)}
        onClose={() => setImageSerial(null)}
        serial={imageSerial}
      />

      {/* SlideOver Kích hoạt sổ mới (Isolated state) */}
      <CreateWarrantySlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        serialOptions={serialOptions}
        customerOptions={customerOptions}
        warrantyStatusOptions={warrantyStatusOptions}
        isLoadingStatuses={isLoadingStatuses}
        onSuccess={() => refetch()}
      />

      {/* Modal xác nhận hủy sổ bảo hành */}
      <DeleteWarrantyModal
        open={Boolean(deleteItem)}
        item={deleteItem}
        onClose={() => setDeleteItem(null)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}

export default function WarrantiesPage() {
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
      <WarrantiesContent />
    </Suspense>
  );
}
