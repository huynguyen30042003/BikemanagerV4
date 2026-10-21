"use client";

import React, { Suspense, useState } from "react";
import { usePhieuSuaChuaHook } from "@/hooks/SuaChua/useSuaChua";
import { useGetPhieuSuaChuaKPI } from "@/hooks/SuaChua/useSuaChuaApi";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  SC_PhieuSuaChua,
  CreatePhieuSuaChuaPayload,
  ThanhToanSuaChuaPayload,
} from "@/types/suaChua";
import {
  RepairTicketsKpiGrid,
  RepairTicketsFilterBar,
  RepairTicketsTable,
  CreateRepairTicketSlideOver,
  RepairTicketStatusModal,
  RepairTicketPaymentModal,
  RepairTicketDetailSlideOver,
  RepairTicketsSkeleton,
} from "@/components/RepairTickets";

function RepairTicketsContent() {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    serviceTypeFilter,
    setServiceTypeFilter,

    repairStatusOptions,
    getRepairStatusBadge,
    isLoadingRepairStatuses,
    paymentStatusOptions,
    getPaymentStatusBadge,
    isLoadingPaymentStatuses,
    serviceTypeOptions,
    isLoadingServiceTypes,
    paymentMethodOptions,
    isLoadingPaymentMethods,

    customerOptions,
    vehicleOptions,
    diaDiemOptions,
    khoOptions,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    openCreate,
    setOpenCreate,
    handleOpenCreate,
    handleSubmitCreate,

    openStatusModal,
    setOpenStatusModal,
    handleSubmitStatusChange,

    openPaymentModal,
    setOpenPaymentModal,
    handleSubmitPayment,

    openDetail,
    setOpenDetail,

    handleDelete,
    isSubmitting,
  } = usePhieuSuaChuaHook();

  const { data: kpi, isLoading: isLoadingKPI } = useGetPhieuSuaChuaKPI();

  // Selected ticket for modal interactions
  const [activeTicket, setActiveTicket] = useState<SC_PhieuSuaChua | null>(null);

  // State for delete modal
  const [ticketToDelete, setTicketToDelete] = useState<SC_PhieuSuaChua | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenDetailModal = (ticket: SC_PhieuSuaChua) => {
    setActiveTicket(ticket);
    setOpenDetail(true);
  };

  const handleOpenStatusModal = (ticket: SC_PhieuSuaChua) => {
    setActiveTicket(ticket);
    setOpenStatusModal(true);
  };

  const handleOpenPaymentModal = (ticket: SC_PhieuSuaChua) => {
    setActiveTicket(ticket);
    setOpenPaymentModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!ticketToDelete) return;
    try {
      setIsDeleting(true);
      await handleDelete(ticketToDelete);
      setTicketToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      {/* Header & Filter Bar */}
      <RepairTicketsFilterBar
        totalCount={totalCount}
        totalRepairsTab={kpi?.total_PhieuSuaChua ?? totalCount}
        searchInput={searchInput}
        onSearchChange={(val) => {
          setSearchInput(val);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        repairStatusOptions={repairStatusOptions}
        isLoadingRepairStatuses={isLoadingRepairStatuses}
        paymentStatusFilter={paymentStatusFilter}
        onPaymentStatusFilterChange={(val) => {
          setPaymentStatusFilter(val);
          setPage(1);
        }}
        paymentStatusOptions={paymentStatusOptions}
        isLoadingPaymentStatuses={isLoadingPaymentStatuses}
        serviceTypeFilter={serviceTypeFilter}
        onServiceTypeFilterChange={(val) => {
          setServiceTypeFilter(val);
          setPage(1);
        }}
        serviceTypeOptions={serviceTypeOptions}
        isLoadingServiceTypes={isLoadingServiceTypes}
        onOpenCreate={handleOpenCreate}
        onReload={refetch}
        isFetching={isFetching}
      />

      {/* KPI Ribbon */}
      <RepairTicketsKpiGrid
        kpi={kpi}
        isLoading={isLoadingKPI}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
      />

      {/* Table Data */}
      {isLoading ? (
        <div className="rounded-xl border border-border/80 bg-card p-6">
          <RepairTicketsSkeleton />
        </div>
      ) : (
        <RepairTicketsTable
          items={items}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          totalPages={totalPages}
          setPage={setPage}
          setPageSize={setPageSize}
          getRepairStatusBadge={getRepairStatusBadge}
          getPaymentStatusBadge={getPaymentStatusBadge}
          onDetail={handleOpenDetailModal}
          onStatusChange={handleOpenStatusModal}
          onPayment={handleOpenPaymentModal}
          onDelete={setTicketToDelete}
          onOpenCreate={handleOpenCreate}
        />
      )}

      {/* SlideOver Tiếp nhận sửa chữa (Form State Isolated) */}
      <CreateRepairTicketSlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        customerOptions={customerOptions}
        vehicleOptions={vehicleOptions}
        serviceTypeOptions={serviceTypeOptions}
        diaDiemOptions={diaDiemOptions}
        khoOptions={khoOptions}
        onSubmit={async (payload: CreatePhieuSuaChuaPayload) => {
          await handleSubmitCreate(undefined, payload);
        }}
        isSubmitting={isSubmitting}
      />

      {/* SlideOver Chuyển Trạng Thái (Form State Isolated) */}
      <RepairTicketStatusModal
        open={openStatusModal}
        onClose={() => {
          setOpenStatusModal(false);
          setActiveTicket(null);
        }}
        ticket={activeTicket}
        repairStatusOptions={repairStatusOptions}
        isLoadingRepairStatuses={isLoadingRepairStatuses}
        onSubmit={async (payload) => {
          await handleSubmitStatusChange(undefined, payload);
        }}
        isSubmitting={isSubmitting}
      />

      {/* SlideOver Thanh toán (Form State Isolated) */}
      <RepairTicketPaymentModal
        open={openPaymentModal}
        onClose={() => {
          setOpenPaymentModal(false);
          setActiveTicket(null);
        }}
        ticket={activeTicket}
        paymentMethodOptions={paymentMethodOptions}
        isLoadingPaymentMethods={isLoadingPaymentMethods}
        onSubmit={async (payload: ThanhToanSuaChuaPayload) => {
          await handleSubmitPayment(undefined, payload);
        }}
        isSubmitting={isSubmitting}
      />

      {/* SlideOver Chi tiết phiếu & Phụ tùng */}
      <RepairTicketDetailSlideOver
        open={openDetail}
        onClose={() => {
          setOpenDetail(false);
          setActiveTicket(null);
        }}
        ticket={activeTicket}
        getRepairStatusBadge={getRepairStatusBadge}
        getPaymentStatusBadge={getPaymentStatusBadge}
      />

      {/* Modal xác nhận xóa / hủy phiếu */}
      <ConfirmModal
        open={Boolean(ticketToDelete)}
        onClose={() => setTicketToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận hủy phiếu sửa chữa"
        description={
          <span>
            Bạn có chắc chắn muốn hủy phiếu tiếp nhận{" "}
            <strong className="text-foreground">
              &quot;{ticketToDelete?.maPhieuSuaChua}&quot;
            </strong>{" "}
            của khách hàng{" "}
            <strong className="text-blue-600 dark:text-blue-400">
              {ticketToDelete?.tenKhachHang || "Khách lẻ"}
            </strong>?
            Thao tác này sẽ hủy phiếu và hoàn kho các linh kiện phụ tùng liên quan.
          </span>
        }
        confirmText="Hủy phiếu ngay"
        cancelText="Đóng"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default function RepairTicketsPage() {
  return (
    <Suspense fallback={<RepairTicketsSkeleton />}>
      <RepairTicketsContent />
    </Suspense>
  );
}
