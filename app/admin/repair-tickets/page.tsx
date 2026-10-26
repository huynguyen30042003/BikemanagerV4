"use client";

import React, { Suspense, useState } from "react";
import { usePhieuSuaChuaHook } from "@/hooks/SuaChua/useSuaChua";
import { useGetPhieuSuaChuaKPI } from "@/hooks/SuaChua/useSuaChuaApi";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  SC_PhieuSuaChua,
  CreatePhieuSuaChuaPayload,
  UpdatePhieuSuaChuaPayload,
  ThanhToanSuaChuaPayload,
} from "@/types/suaChua";
import {
  RepairTicketsKpiGrid,
  RepairTicketsFilterBar,
  RepairTicketsTable,
  CreateRepairTicketSlideOver,
  UpdateRepairTicketSlideOver,
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
    serviceOptions,
    partOptions,

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

    openEdit,
    setOpenEdit,
    handleSubmitEdit,

    openStatusModal,
    setOpenStatusModal,
    handleSubmitStatusChange,

    openPaymentModal,
    setOpenPaymentModal,
    handleSubmitPayment,

    openDetail,
    setOpenDetail,

    handleDelete,
    handleHoanThanhVaGiaoXe,
    isSubmitting,
  } = usePhieuSuaChuaHook();

  const { data: kpi, isLoading: isLoadingKPI } = useGetPhieuSuaChuaKPI();

  // Selected ticket for modal interactions
  const [activeTicket, setActiveTicket] = useState<SC_PhieuSuaChua | null>(null);
  const [ticketToEdit, setTicketToEdit] = useState<SC_PhieuSuaChua | null>(null);

  // State for delete modal
  const [ticketToDelete, setTicketToDelete] = useState<SC_PhieuSuaChua | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for deliver modal (Bàn giao xe & Trừ kho)
  const [ticketToDeliver, setTicketToDeliver] = useState<SC_PhieuSuaChua | null>(null);
  const [isDelivering, setIsDelivering] = useState(false);

  const handleOpenDetailModal = (ticket: SC_PhieuSuaChua) => {
    setActiveTicket(ticket);
    setOpenDetail(true);
  };

  const handleOpenEditModal = (ticket: SC_PhieuSuaChua) => {
    setTicketToEdit(ticket);
    setOpenEdit(true);
  };

  const handleOpenStatusModal = (ticket: SC_PhieuSuaChua) => {
    setActiveTicket(ticket);
    setOpenStatusModal(true);
  };

  const handleOpenPaymentModal = (ticket: SC_PhieuSuaChua) => {
    setActiveTicket(ticket);
    setOpenPaymentModal(true);
  };

  const handleConfirmDeliver = async () => {
    if (!ticketToDeliver) return;
    try {
      setIsDelivering(true);
      await handleHoanThanhVaGiaoXe(ticketToDeliver);
      setTicketToDeliver(null);
    } finally {
      setIsDelivering(false);
    }
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
          onEdit={handleOpenEditModal}
          onStatusChange={handleOpenStatusModal}
          onDeliverVehicle={setTicketToDeliver}
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
        serviceOptions={serviceOptions}
        partOptions={partOptions}
        onSubmit={async (payload: CreatePhieuSuaChuaPayload) => {
          await handleSubmitCreate(undefined, payload);
        }}
        isSubmitting={isSubmitting}
      />

      {/* SlideOver Chỉnh sửa phiếu sửa chữa (Form State Isolated) */}
      <UpdateRepairTicketSlideOver
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setTicketToEdit(null);
        }}
        ticket={ticketToEdit}
        customerOptions={customerOptions}
        vehicleOptions={vehicleOptions}
        serviceTypeOptions={serviceTypeOptions}
        diaDiemOptions={diaDiemOptions}
        khoOptions={khoOptions}
        serviceOptions={serviceOptions}
        partOptions={partOptions}
        onSubmit={async (payload: UpdatePhieuSuaChuaPayload) => {
          await handleSubmitEdit(undefined, payload);
          setTicketToEdit(null);
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

      {/* Modal xác nhận Bàn Giao Xe & Trừ kho */}
      <ConfirmModal
        open={Boolean(ticketToDeliver)}
        onClose={() => setTicketToDeliver(null)}
        onConfirm={handleConfirmDeliver}
        title="Xác nhận hoàn thành & Bàn giao xe"
        description={
          <div className="space-y-2 text-xs">
            <p>
              Bạn có chắc chắn muốn hoàn thành phiếu tiếp nhận{" "}
              <strong className="text-foreground font-mono">
                &quot;{ticketToDeliver?.maPhieuSuaChua}&quot;
              </strong>{" "}
              và bàn giao xe cho khách hàng{" "}
              <strong className="text-blue-600 dark:text-blue-400">
                {ticketToDeliver?.tenKhachHang || "Khách lẻ"}
              </strong>?
            </p>
            <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] space-y-1">
              <p className="font-semibold">⚠️ Cơ chế tác động tự động:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>
                  Tự động chuyển trạng thái phiếu sang{" "}
                  <strong>Hoàn thành / Đã giao (112)</strong>.
                </li>
                <li>
                  Tự động trừ số lượng tồn kho của các phụ tùng trong phiếu tại{" "}
                  <strong>Kho xuất liên kết</strong>.
                </li>
                <li>Ghi nhận nhật ký thẻ kho và khóa toàn bộ phiếu.</li>
              </ul>
            </div>
            {(ticketToDeliver?.conNo || 0) > 0 && (
              <p className="text-rose-600 dark:text-rose-400 font-bold bg-rose-500/10 p-2 rounded border border-rose-500/20">
                Lưu ý tài chính: Phiếu hiện vẫn còn dư nợ{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(ticketToDeliver?.conNo || 0)}.
              </p>
            )}
          </div>
        }
        confirmText="Bàn giao xe & Trừ kho"
        cancelText="Đóng"
        variant="warning"
        isLoading={isDelivering}
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
