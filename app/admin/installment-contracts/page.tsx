"use client";

import React, { Suspense, useState } from "react";
import { useHopDongTraGopHook } from "@/hooks/TraGop/useTraGop";
import { useGetTraGopKPI } from "@/hooks/TraGop/useTraGopApi";
import { HopDongTraGop } from "@/types/traGop";
import {
  InstallmentContractsKpiGrid,
  InstallmentContractsFilterBar,
  InstallmentContractsTable,
  CreateContractSlideOver,
  ApproveContractModal,
  DisburseContractModal,
  InstallmentContractsSkeleton,
} from "@/components/InstallmentContracts";

function InstallmentContractsContent() {
  const { data: contractKpi, isLoading: isLoadingKPI } = useGetTraGopKPI();

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    searchInput,
    setSearchInput,
    providerFilter,
    setProviderFilter,
    statusFilter,
    setStatusFilter,
    disbursementFilter,
    setDisbursementFilter,
    providerOptions,
    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,
    openAdd,
    setOpenAdd,
    handleSubmitAdd,
    handleChuyenTrangThai,
    handleXacNhanGiaiNgan,
    handleDelete,
    isSubmitting,
  } = useHopDongTraGopHook();

  // Single-state pattern for action modals (AGENTS.md Section 11.2)
  const [approvingContract, setApprovingContract] =
    useState<HopDongTraGop | null>(null);
  const [disbursingContract, setDisbursingContract] =
    useState<HopDongTraGop | null>(null);

  const handleFilterStatus = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleFilterDisbursement = (disbursement: string) => {
    setDisbursementFilter(disbursement);
    setPage(1);
  };

  const handleResetKpiFilters = () => {
    setStatusFilter("all");
    setDisbursementFilter("all");
    setPage(1);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      {/* 1. Header, Tab navigation & Filter Toolbar */}
      <InstallmentContractsFilterBar
        totalContracts={
          contractKpi?.total_HopDongTraGop ??
          contractKpi?.totalHopDongTraGop ??
          totalCount
        }
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        providerFilter={providerFilter}
        setProviderFilter={setProviderFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        disbursementFilter={disbursementFilter}
        setDisbursementFilter={setDisbursementFilter}
        providerOptions={providerOptions}
        isFetching={isFetching}
        onRefresh={refetch}
        onOpenAdd={() => setOpenAdd(true)}
      />

      {/* 2. Dải KPI Ribbon chỉ số hợp đồng trả góp */}
      <InstallmentContractsKpiGrid
        kpiData={contractKpi}
        totalCount={totalCount}
        statusFilter={statusFilter}
        disbursementFilter={disbursementFilter}
        onFilterStatus={handleFilterStatus}
        onFilterDisbursement={handleFilterDisbursement}
        onResetFilters={handleResetKpiFilters}
        isLoadingKPI={isLoadingKPI}
        isLoading={isLoading}
      />

      {/* 3. Bảng dữ liệu Hợp đồng trả góp */}
      {isLoading ? (
        <InstallmentContractsSkeleton />
      ) : (
        <InstallmentContractsTable
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onApprove={setApprovingContract}
          onDisburse={setDisbursingContract}
          onDelete={handleDelete}
          onOpenAdd={() => setOpenAdd(true)}
        />
      )}

      {/* 4. SlideOver Form thêm mới hợp đồng vay mua xe (cô lập state) */}
      <CreateContractSlideOver
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        providerOptions={providerOptions}
        onSubmit={handleSubmitAdd}
        isSubmitting={isSubmitting}
      />

      {/* 5. Modal Cập nhật tiến độ thẩm định hồ sơ */}
      <ApproveContractModal
        open={Boolean(approvingContract)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setApprovingContract(null);
        }}
        contract={approvingContract}
        onSubmit={async (payload) => {
          await handleChuyenTrangThai(payload);
          setApprovingContract(null);
        }}
        isSubmitting={isSubmitting}
      />

      {/* 6. Modal Xác nhận tiền giải ngân về showroom */}
      <DisburseContractModal
        open={Boolean(disbursingContract)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDisbursingContract(null);
        }}
        contract={disbursingContract}
        onSubmit={async (payload) => {
          await handleXacNhanGiaiNgan(payload);
          setDisbursingContract(null);
        }}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default function InstallmentContractsPage() {
  return (
    <Suspense fallback={<InstallmentContractsSkeleton />}>
      <InstallmentContractsContent />
    </Suspense>
  );
}
