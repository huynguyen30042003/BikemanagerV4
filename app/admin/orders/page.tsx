"use client";

import React, { Suspense, useMemo } from "react";
import { useDonHang } from "@/hooks/DonHang/useDonHang";
import {
  OrdersKpiGrid,
  OrdersFilterBar,
  OrdersTable,
  CreateOrderSlideOver,
  OrderStatusChangeModal,
  OrderPaymentModal,
  OrderDetailSlideOver,
  OrdersSkeleton,
} from "@/components/Orders";

function OrdersContent() {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    searchInput,
    handleSearch,
    statusFilter,
    setStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    orderTypeFilter,
    setOrderTypeFilter,
    khoFilter,
    setKhoFilter,

    orderStatusOptions,
    getOrderStatusBadge,
    isLoadingOrderStatuses,
    paymentStatusOptions,
    getPaymentStatusBadge,
    isLoadingPaymentStatuses,
    orderTypeOptions,
    isLoadingOrderTypes,
    paymentMethodOptions,
    isLoadingPaymentMethods,

    customerOptions,
    isLoadingCustomers,
    diaDiemOptions,
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

    openStatusModal,
    setOpenStatusModal,
    handleOpenStatusChange,
    handleSubmitStatusChange,
    isChangingStatus,

    openPaymentModal,
    setOpenPaymentModal,
    handleOpenPayment,
    handleSubmitPayment,
    isPaying,
    paymentHistoryItems,
    isLoadingPaymentHistory,

    handleHoanThanhVaGiaoXe,
    handleDelete,
  } = useDonHang();

  // 1. Thống kê KPI ưu tiên từ Backend API GetKPI
  const totalOrders = kpiData?.total_DonHang ?? totalCount;
  const pendingCount =
    kpiData?.total_ChoXuLyVaGiao ??
    items.filter((i) => {
      const b = getOrderStatusBadge(i.trangThaiDonHangID);
      return (
        b.color === "amber" ||
        i.trangThaiDonHangID === 72 ||
        i.trangThaiDonHangID === 73
      );
    }).length;

  const completedCount =
    kpiData?.total_HoanThanh ??
    items.filter((i) => {
      const b = getOrderStatusBadge(i.trangThaiDonHangID);
      return (
        b.color === "emerald" ||
        i.trangThaiDonHangID === 75 ||
        i.trangThaiDonHangID === 76
      );
    }).length;

  const totalRevenue =
    kpiData?.total_DoanhThu ??
    items.reduce((sum, i) => sum + (i.tongTien || 0), 0);

  // 2. Xác định cờ đang có bộ lọc hoạt động
  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        searchInput.trim() ||
        statusFilter !== null ||
        paymentStatusFilter !== null ||
        orderTypeFilter !== null ||
        khoFilter !== "",
      ),
    [
      searchInput,
      statusFilter,
      paymentStatusFilter,
      orderTypeFilter,
      khoFilter,
    ],
  );

  const handleResetFilters = () => {
    handleSearch("");
    setStatusFilter(null);
    setPaymentStatusFilter(null);
    setOrderTypeFilter(null);
    setKhoFilter("");
  };

  const handleRefresh = async () => {
    await Promise.all([refetch(), refetchKPI()]);
  };

  return (
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-3 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Thanh tiêu đề, Tab điều hướng & Bộ lọc mở rộng */}
      <OrdersFilterBar
        totalCount={totalCount}
        searchInput={searchInput}
        onSearch={handleSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        orderStatusOptions={orderStatusOptions}
        isLoadingOrderStatuses={isLoadingOrderStatuses}
        paymentStatusFilter={paymentStatusFilter}
        setPaymentStatusFilter={setPaymentStatusFilter}
        paymentStatusOptions={paymentStatusOptions}
        isLoadingPaymentStatuses={isLoadingPaymentStatuses}
        orderTypeFilter={orderTypeFilter}
        setOrderTypeFilter={setOrderTypeFilter}
        orderTypeOptions={orderTypeOptions}
        isLoadingOrderTypes={isLoadingOrderTypes}
        khoFilter={khoFilter}
        setKhoFilter={setKhoFilter}
        khoOptions={khoOptions}
        isLoadingKhos={isLoadingKhos}
        isFetching={isFetching}
        isLoadingKPI={isLoadingKPI}
        onRefresh={handleRefresh}
        onOpenCreate={handleOpenCreate}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
      />

      {/* 2. Dải ruy băng KPI Ribbon tương tác */}
      <OrdersKpiGrid
        totalOrders={totalOrders}
        pendingCount={pendingCount}
        completedCount={completedCount}
        totalRevenue={totalRevenue}
        statusFilter={statusFilter}
        onFilterStatus={setStatusFilter}
        onResetFilters={handleResetFilters}
        isLoadingKPI={isLoadingKPI}
        isLoading={isLoading}
      />

      {/* 3. Bảng dữ liệu Đơn hàng chuẩn hóa */}
      <OrdersTable
        items={items}
        totalCount={totalCount}
        totalPages={totalPages}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        getOrderStatusBadge={getOrderStatusBadge}
        getPaymentStatusBadge={getPaymentStatusBadge}
        onOpenDetail={handleOpenDetail}
        onOpenStatusChange={handleOpenStatusChange}
        onOpenPayment={handleOpenPayment}
        onHoanThanhVaGiaoXe={handleHoanThanhVaGiaoXe}
        onDelete={handleDelete}
        onOpenCreate={handleOpenCreate}
      />

      {/* 4. Drawer Tạo mới đơn hàng (State Form cô lập hoàn toàn) */}
      <CreateOrderSlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        customerOptions={customerOptions}
        isLoadingCustomers={isLoadingCustomers}
        diaDiemOptions={diaDiemOptions}
        khoOptions={khoOptions}
        isLoadingKhos={isLoadingKhos}
        orderTypeOptions={orderTypeOptions}
        isLoadingOrderTypes={isLoadingOrderTypes}
        variantOptions={variantOptions}
        isLoadingVariants={isLoadingVariants}
        onSubmit={(payload) => handleSubmitCreate(undefined, payload)}
        isCreating={isCreating}
      />

      {/* 5. Drawer Chuyển trạng thái đơn hàng */}
      <OrderStatusChangeModal
        open={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
        selectedOrder={selectedOrder}
        orderStatusOptions={orderStatusOptions}
        isLoadingOrderStatuses={isLoadingOrderStatuses}
        onSubmit={handleSubmitStatusChange}
        isChangingStatus={isChangingStatus}
      />

      {/* 6. Drawer Ghi nhận thanh toán */}
      <OrderPaymentModal
        open={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
        selectedOrder={selectedOrder}
        paymentMethodOptions={paymentMethodOptions}
        isLoadingPaymentMethods={isLoadingPaymentMethods}
        onSubmit={handleSubmitPayment}
        isPaying={isPaying}
      />

      {/* 7. Drawer Xem chi tiết đơn hàng & Lịch sử thanh toán */}
      <OrderDetailSlideOver
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        selectedOrder={selectedOrder}
        paymentHistoryItems={paymentHistoryItems}
        isLoadingPaymentHistory={isLoadingPaymentHistory}
      />
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<OrdersSkeleton />}>
      <OrdersContent />
    </Suspense>
  );
}
