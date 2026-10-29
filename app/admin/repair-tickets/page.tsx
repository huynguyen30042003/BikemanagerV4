"use client";

import React, { Suspense, useState } from "react";
import { usePhieuSuaChuaHook } from "@/hooks/SuaChua/useSuaChua";
import { useGetPhieuSuaChuaKPI } from "@/hooks/SuaChua/useSuaChuaApi";
import { useConfirm } from "@/components/Common/ConfirmContext";
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

  const { confirm } = useConfirm();

  // Selected ticket for modal interactions (Single-State Pattern)
  const [editingTicket, setEditingTicket] = useState<SC_PhieuSuaChua | null>(null);
  const [statusTicket, setStatusTicket] = useState<SC_PhieuSuaChua | null>(null);
  const [paymentTicket, setPaymentTicket] = useState<SC_PhieuSuaChua | null>(null);
  const [detailTicket, setDetailTicket] = useState<SC_PhieuSuaChua | null>(null);

  const handleDeliverVehicle = async (ticket: SC_PhieuSuaChua) => {
    const isConfirmed = await confirm({
      title: "Xác nhận hoàn thành & Bàn giao xe",
      description: (
        <div className="space-y-2 text-xs">
          <p>
            Bạn có chắc chắn muốn hoàn thành phiếu tiếp nhận{" "}
            <strong className="text-foreground font-mono">
              &quot;{ticket.maPhieuSuaChua}&quot;
            </strong>{" "}
            và bàn giao xe cho khách hàng{" "}
            <strong className="text-blue-600 dark:text-blue-400">
              {ticket.tenKhachHang || "Khách lẻ"}
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
          {(ticket.conNo || 0) > 0 && (
            <p className="text-rose-600 dark:text-rose-400 font-bold bg-rose-500/10 p-2 rounded border border-rose-500/20">
              Lưu ý tài chính: Phiếu hiện vẫn còn dư nợ{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(ticket.conNo || 0)}.
            </p>
          )}
        </div>
      ),
      confirmText: "Bàn giao xe & Trừ kho",
      cancelText: "Đóng",
      variant: "warning",
    });
    if (!isConfirmed) return;
    await handleHoanThanhVaGiaoXe(ticket);
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
          onDetail={(ticket) => setDetailTicket(ticket)}
          onEdit={(ticket) => setEditingTicket(ticket)}
          onStatusChange={(ticket) => setStatusTicket(ticket)}
          onDeliverVehicle={handleDeliverVehicle}
          onPayment={(ticket) => setPaymentTicket(ticket)}
          onDelete={handleDelete}
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
        open={Boolean(editingTicket)}
        onClose={() => setEditingTicket(null)}
        ticket={editingTicket}
        customerOptions={customerOptions}
        vehicleOptions={vehicleOptions}
        serviceTypeOptions={serviceTypeOptions}
        diaDiemOptions={diaDiemOptions}
        khoOptions={khoOptions}
        serviceOptions={serviceOptions}
        partOptions={partOptions}
        onSubmit={async (payload: UpdatePhieuSuaChuaPayload) => {
          await handleSubmitEdit(undefined, payload);
          setEditingTicket(null);
        }}
        isSubmitting={isSubmitting}
      />

      {/* SlideOver Chuyển Trạng Thái (Form State Isolated) */}
      <RepairTicketStatusModal
        open={Boolean(statusTicket)}
        onClose={() => setStatusTicket(null)}
        ticket={statusTicket}
        repairStatusOptions={repairStatusOptions}
        isLoadingRepairStatuses={isLoadingRepairStatuses}
        onSubmit={async (payload) => {
          await handleSubmitStatusChange(undefined, payload);
          setStatusTicket(null);
        }}
        isSubmitting={isSubmitting}
      />

      {/* SlideOver Thanh toán (Form State Isolated) */}
      <RepairTicketPaymentModal
        open={Boolean(paymentTicket)}
        onClose={() => setPaymentTicket(null)}
        ticket={paymentTicket}
        paymentMethodOptions={paymentMethodOptions}
        isLoadingPaymentMethods={isLoadingPaymentMethods}
        onSubmit={async (payload: ThanhToanSuaChuaPayload) => {
          await handleSubmitPayment(undefined, payload);
          setPaymentTicket(null);
        }}
        isSubmitting={isSubmitting}
      />

      {/* SlideOver Chi tiết phiếu & Phụ tùng */}
      <RepairTicketDetailSlideOver
        open={Boolean(detailTicket)}
        onClose={() => setDetailTicket(null)}
        ticket={detailTicket}
        getRepairStatusBadge={getRepairStatusBadge}
        getPaymentStatusBadge={getPaymentStatusBadge}
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
