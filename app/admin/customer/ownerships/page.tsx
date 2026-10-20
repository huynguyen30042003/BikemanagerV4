"use client";

import React, { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useLichSuSoHuuPhuongTien } from "@/hooks/LichSuSoHuuPhuongTien/useLichSuSoHuuPhuongTien";
import {
  CustomerOwnershipsKpiGrid,
  CustomerOwnershipsFilterBar,
  CustomerOwnershipsTable,
  TransferOwnershipSlideOver,
} from "@/components/Customer/Ownerships";

function OwnershipsContent() {
  const searchParams = useSearchParams();
  const initialVehicleId = searchParams.get("vehicleId") || undefined;
  const initialKhachHangId = searchParams.get("khachHangId") || undefined;

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    lyDoFilter,
    setLyDoFilter,
    vehicleFilter,
    setVehicleFilter,
    customerFilter,
    setCustomerFilter,
    searchInput,
    handleSearch,

    vehicleOptions,
    isLoadingVehicles,
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
  } = useLichSuSoHuuPhuongTien(initialVehicleId, initialKhachHangId);

  // Modal State
  const [openTransfer, setOpenTransfer] = useState(false);
  const [transferVehicleId, setTransferVehicleId] = useState("");

  const handleOpenTransfer = (vehicleId?: string) => {
    setTransferVehicleId(vehicleId || vehicleFilter || "");
    setOpenTransfer(true);
  };

  const handleResetFilters = () => {
    handleSearch("");
    setLyDoFilter("all");
    setVehicleFilter("");
    setCustomerFilter("");
    setPage(1);
  };

  // KPI Metrics calculation (Prioritize backend KPI, fallback to local counts)
  const totalLichSuSoHuu = useMemo(() => {
    return kpiData?.total_LichSuSoHuuPhuongTien ?? totalCount;
  }, [kpiData?.total_LichSuSoHuuPhuongTien, totalCount]);

  const totalChuSoHuuHienTai = useMemo(() => {
    return (
      kpiData?.total_ChuSoHuuHienTai ??
      items.filter((i) => i.laChuSoHuuHienTai === true).length
    );
  }, [kpiData?.total_ChuSoHuuHienTai, items]);

  const totalSangTen = useMemo(() => {
    return (
      kpiData?.total_SangTen ??
      items.filter((i) => i.laChuSoHuuHienTai === false).length
    );
  }, [kpiData?.total_SangTen, items]);

  const totalThuCuDoiMoi = useMemo(() => {
    return (
      kpiData?.total_ThuCuDoiMoi ??
      items.filter((i) => i.lyDo === "ThuCuDoiMoi").length
    );
  }, [kpiData?.total_ThuCuDoiMoi, items]);

  const hasActiveFilters = Boolean(
    searchInput || lyDoFilter !== "all" || vehicleFilter || customerFilter
  );

  return (
    <div className="p-4 md:p-8 min-h-screen space-y-6">
      {/* 1. Header, CustomerNavTabs & Filter Toolbar */}
      <CustomerOwnershipsFilterBar
        totalLichSuSoHuu={totalLichSuSoHuu}
        searchInput={searchInput}
        onSearch={handleSearch}
        vehicleFilter={vehicleFilter}
        onVehicleFilterChange={(val) => {
          setVehicleFilter(val);
          setPage(1);
        }}
        vehicleOptions={vehicleOptions}
        isLoadingVehicles={isLoadingVehicles}
        customerFilter={customerFilter}
        onCustomerFilterChange={(val) => {
          setCustomerFilter(val);
          setPage(1);
        }}
        customerOptions={customerOptions}
        isLoadingCustomers={isLoadingCustomers}
        lyDoFilter={lyDoFilter}
        onLyDoFilterChange={(val) => {
          setLyDoFilter(val);
          setPage(1);
        }}
        onOpenTransfer={() => handleOpenTransfer()}
        onRefresh={() => {
          refetch();
          refetchKPI();
        }}
        isFetching={isFetching}
        isLoadingKPI={isLoadingKPI}
        onResetFilters={handleResetFilters}
      />

      {/* 2. KPI Cards Grid (.map() based, responsive down to 390px) */}
      <CustomerOwnershipsKpiGrid
        totalLichSuSoHuu={totalLichSuSoHuu}
        totalChuSoHuuHienTai={totalChuSoHuuHienTai}
        totalSangTen={totalSangTen}
        totalThuCuDoiMoi={totalThuCuDoiMoi}
        lyDoFilter={lyDoFilter}
        onSelectLyDo={(val) => {
          setLyDoFilter(val);
          setPage(1);
        }}
        isLoadingKPI={isLoadingKPI}
        isLoading={isLoading}
      />

      {/* 3. Main Data Table */}
      {isLoading ? (
        <Card className="p-6">
          <Skeleton className="h-10 w-full mb-3" />
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-12 w-full" />
        </Card>
      ) : (
        <CustomerOwnershipsTable
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onTransfer={(vId) => handleOpenTransfer(vId)}
          onOpenTransfer={() => handleOpenTransfer()}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      {/* 4. SlideOver: Sang tên xe / Chuyển quyền sở hữu (State Isolation) */}
      <TransferOwnershipSlideOver
        open={openTransfer}
        onClose={() => setOpenTransfer(false)}
        vehicleOptions={vehicleOptions}
        customerOptions={customerOptions}
        isLoadingVehicles={isLoadingVehicles}
        isLoadingCustomers={isLoadingCustomers}
        defaultVehicleId={transferVehicleId}
        onSuccess={() => {
          refetch();
          refetchKPI();
        }}
      />
    </div>
  );
}

export default function OwnershipsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96" />
        </div>
      }
    >
      <OwnershipsContent />
    </Suspense>
  );
}
