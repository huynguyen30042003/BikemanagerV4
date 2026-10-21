"use client";

import React, { Suspense, useMemo } from "react";
import { useDonNhapHang } from "@/hooks/DonNhapHang/useDonNhapHang";
import {
  PurchaseOrdersKpiGrid,
  PurchaseOrdersFilterBar,
  PurchaseOrdersTable,
  CreatePurchaseOrderSlideOver,
  PurchaseOrderStatusChangeModal,
  PurchaseOrderPaymentModal,
  PurchaseOrderDetailSlideOver,
  PurchaseOrdersSkeleton,
} from "@/components/PurchaseOrders";

function PurchaseOrdersContent() {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    supplierFilter,
    setSupplierFilter,
    khoFilter,
    setKhoFilter,
    statusFilter,
    setStatusFilter,
    searchInput,
    handleSearch,

    orderStatusOptions,
    getOrderStatusBadge,
    isLoadingStatuses,
    paymentMethodOptions,
    isLoadingPaymentMethods,

    supplierOptions,
    isLoadingSuppliers,
    khoOptions,
    isLoadingKhos,
    variantOptions,
    isLoadingVariants,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,
    kpiData,
    isLoadingKPI,
    refetchKPI,

    openCreate,
    setOpenCreate,
    handleOpenCreate,
    handleSubmitCreate,
    isCreating,

    openDetail,
    setOpenDetail,
    selectedOrder,
    handleOpenDetail,
    isLoadingDetail,
    isCompletedStatus,

    openStatusModal,
    setOpenStatusModal,
    handleOpenStatusChange,
    handleSubmitStatusChange,
    isChangingStatus,

    handleXacNhanNhapKho,
    isNhapKho,

    openPaymentModal,
    setOpenPaymentModal,
    handleOpenPayment,
    handleSubmitPayment,
    isPaying,
    paymentHistoryItems,
    isLoadingPaymentHistory,

    handleDelete,
    isDeleting,
  } = useDonNhapHang();

  // 1. Thống kê KPI ưu tiên từ Backend API GetKPI
  const totalPurchaseOrders =
    kpiData?.total_DonNhapHang ?? kpiData?.totalDonNhapHang ?? totalCount;

  const pendingCount =
    kpiData?.total_ChoDuyet ??
    kpiData?.totalChoDuyet ??
    items.filter((i) => {
      const b = getOrderStatusBadge(i.trangThaiID);
      return (
        b.color === "amber" || i.trangThaiID === 66 || i.trangThaiID === 67
      );
    }).length;

  const completedCount =
    kpiData?.total_DaNhapKho ??
    kpiData?.totalDaNhapKho ??
    items.filter((i) => {
      const b = getOrderStatusBadge(i.trangThaiID);
      return b.color === "emerald" || i.trangThaiID === 70;
    }).length;

  const totalDebt =
    kpiData?.total_ConNo ??
    kpiData?.totalConNo ??
    items.reduce((sum, i) => sum + (i.conNo || 0), 0);

  // 2. Xác định cờ đang có bộ lọc hoạt động
  const hasActiveFilters = Boolean(
    searchInput.trim() || supplierFilter || khoFilter || statusFilter !== null,
  );

  const handleResetFilters = () => {
    handleSearch("");
    setSupplierFilter("");
    setKhoFilter("");
    setStatusFilter(null);
    setPage(1);
  };

  const handleRefresh = async () => {
    await Promise.all([refetch(), refetchKPI()]);
  };

  return (
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-4 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header, Navigation Tabs & Multi-Filter Toolbar */}
      <PurchaseOrdersFilterBar
        searchInput={searchInput}
        onSearch={handleSearch}
        supplierFilter={supplierFilter}
        onSupplierFilterChange={(val) => {
          setSupplierFilter(val);
          setPage(1);
        }}
        supplierOptions={supplierOptions}
        isLoadingSuppliers={isLoadingSuppliers}
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
        orderStatusOptions={orderStatusOptions}
        isLoadingStatuses={isLoadingStatuses}
        onOpenCreate={handleOpenCreate}
        onRefresh={handleRefresh}
        isFetching={isFetching}
        isLoadingKPI={isLoadingKPI}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 2. Dải KPI Ribbon tương tác (.map() based, dùng KpiRibbon chuẩn) */}
      <PurchaseOrdersKpiGrid
        totalPurchaseOrders={totalPurchaseOrders}
        pendingCount={pendingCount}
        completedCount={completedCount}
        totalDebt={totalDebt}
        statusFilter={statusFilter}
        onSelectTotal={() => {
          setStatusFilter(null);
          setPage(1);
        }}
        onSelectPending={() => {
          setStatusFilter(66);
          setPage(1);
        }}
        onSelectCompleted={() => {
          setStatusFilter(70);
          setPage(1);
        }}
        isLoadingKPI={isLoadingKPI}
        isLoading={isLoading}
      />

      {/* 3. Bảng dữ liệu Đơn nhập hàng chuẩn hóa */}
      <PurchaseOrdersTable
        items={items}
        totalCount={totalCount}
        totalPages={totalPages}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        getOrderStatusBadge={getOrderStatusBadge}
        isCompletedStatus={isCompletedStatus}
        onOpenDetail={handleOpenDetail}
        onOpenPayment={handleOpenPayment}
        onOpenStatusChange={handleOpenStatusChange}
        onOpenCreate={handleOpenCreate}
      />

      {/* 4. SlideOver: Tạo đơn nhập hàng mới (State Form cô lập hoàn toàn) */}
      <CreatePurchaseOrderSlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        supplierOptions={supplierOptions}
        isLoadingSuppliers={isLoadingSuppliers}
        khoOptions={khoOptions}
        isLoadingKhos={isLoadingKhos}
        variantOptions={variantOptions}
        isLoadingVariants={isLoadingVariants}
        onSubmit={(payload) => handleSubmitCreate(undefined, payload)}
        isCreating={isCreating}
      />

      {/* 5. SlideOver: Đổi trạng thái đơn nhập hàng (State Form cô lập) */}
      <PurchaseOrderStatusChangeModal
        open={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
        selectedOrder={selectedOrder}
        orderStatusOptions={orderStatusOptions}
        isLoadingStatuses={isLoadingStatuses}
        isCompletedStatus={isCompletedStatus}
        onSubmit={handleSubmitStatusChange}
        isChangingStatus={isChangingStatus}
      />

      {/* 6. SlideOver: Ghi nhận thanh toán cho NCC (State Form cô lập) */}
      <PurchaseOrderPaymentModal
        open={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
        selectedOrder={selectedOrder}
        paymentMethodOptions={paymentMethodOptions}
        isLoadingPaymentMethods={isLoadingPaymentMethods}
        onSubmit={handleSubmitPayment}
        isPaying={isPaying}
      />

      {/* 7. SlideOver: Xem chi tiết đơn nhập & lịch sử thanh toán */}
      <PurchaseOrderDetailSlideOver
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        selectedOrder={selectedOrder}
        getOrderStatusBadge={getOrderStatusBadge}
        isLoadingDetail={isLoadingDetail}
        paymentHistoryItems={paymentHistoryItems}
        isLoadingPaymentHistory={isLoadingPaymentHistory}
        isCompletedStatus={isCompletedStatus}
        onXacNhanNhapKho={handleXacNhanNhapKho}
        isNhapKho={isNhapKho}
        onOpenPayment={handleOpenPayment}
        onOpenStatusChange={handleOpenStatusChange}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default function PurchaseOrdersPage() {
  return (
    <Suspense fallback={<PurchaseOrdersSkeleton />}>
      <PurchaseOrdersContent />
    </Suspense>
  );
}
