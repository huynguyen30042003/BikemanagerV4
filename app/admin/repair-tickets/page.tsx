"use client";

import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchSelect } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { ServiceNavTabs } from "@/components/Common/ServiceNavTabs";
import { usePhieuSuaChuaHook } from "@/hooks/SuaChua/useSuaChua";
import { SC_PhieuSuaChua } from "@/types/suaChua";
import {
  Wrench,
  Plus,
  RefreshCw,
  Search,
  FolderOpen,
  Calendar,
  DollarSign,
  Receipt,
  ArrowRight,
  Trash2,
  Bike,
  User,
  Clock,
  Eye,
} from "lucide-react";

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

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
    dataCreate,
    setDataCreate,
    handleOpenCreate,
    handleAddDetailRow,
    handleRemoveDetailRow,
    handleSubmitCreate,

    openStatusModal,
    setOpenStatusModal,
    dataStatusChange,
    setDataStatusChange,
    handleOpenStatusChange,
    handleSubmitStatusChange,

    openPaymentModal,
    setOpenPaymentModal,
    dataPayment,
    setDataPayment,
    handleOpenPayment,
    handleSubmitPayment,
    openDetail,
    setOpenDetail,
    handleOpenDetail,

    handleDelete,
    selectedTicket,
    isSubmitting,
  } = usePhieuSuaChuaHook();

  const columns: Column<SC_PhieuSuaChua>[] = [
    {
      key: "maPhieuSuaChua",
      title: "Mã Phiếu Sửa Chữa",
      classNameHeader: "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
          {String(v || "—")}
        </span>
      ),
    },
    {
      key: "khachHang",
      title: "Khách hàng & Xe vào xưởng",
      classNameHeader: "min-w-[200px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 py-1">
          <span className="font-semibold text-foreground text-xs flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            {row.tenKhachHang || "Khách vãng lai"}
          </span>
          <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
            <Bike className="w-3 h-3" />
            {row.tenModelXe || "Xe ngoài"} {row.bienSoXe ? `[${row.bienSoXe}]` : ""}
          </span>
        </div>
      ),
    },
    {
      key: "loaiDichVuID",
      title: "Phân loại",
      classNameHeader: "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20">
          {row.tenLoaiDichVu || "Sửa chữa"}
        </span>
      ),
    },
    {
      key: "trangThaiID",
      title: "Tiến độ sửa",
      classNameHeader: "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => {
        const badge = getRepairStatusBadge(Number(v));
        return (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.className}`}
          >
            {badge.label}
          </span>
        );
      },
    },
    {
      key: "trangThaiThanhToanID",
      title: "Thanh toán",
      classNameHeader: "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => {
        const badge = getPaymentStatusBadge(Number(v));
        return (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.className}`}
          >
            {badge.label}
          </span>
        );
      },
    },
    {
      key: "tongTien",
      title: "Tổng chi phí",
      classNameHeader: "w-36 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right",
      render: (v) => (
        <span className="font-mono text-xs font-bold text-foreground">
          {formatCurrency(Number(v))}
        </span>
      ),
    },
    {
      key: "daThanhToan",
      title: "Đã thu / Còn nợ",
      classNameHeader: "w-40 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 text-xs font-mono">
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            Thu: {formatCurrency(row.daThanhToan)}
          </span>
          <span
            className={
              (row.conNo || 0) > 0
                ? "text-rose-600 dark:text-rose-400 font-bold"
                : "text-muted-foreground"
            }
          >
            Nợ: {formatCurrency(row.conNo)}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      title: "Thao tác",
      classNameHeader: "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleOpenDetail(row)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
            title="Xem chi tiết phiếu & phụ tùng SC"
          >
            <Eye className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleOpenStatusChange(row)}
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 cursor-pointer"
            title="Đổi tiến độ sửa chữa"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleOpenPayment(row)}
            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer"
            title="Thu tiền dịch vụ"
          >
            <Receipt className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleDelete(row)}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
            title="Hủy phiếu"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Phiếu Tiếp Nhận & Sửa Chữa Dịch Vụ
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Quản lý quy trình khám xe, báo giá công thợ, xuất kho phụ tùng thay thế và thanh toán
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

            <Button
              size="sm"
              onClick={handleOpenCreate}
              className="h-9 px-4 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs">Lập phiếu sửa chữa</span>
            </Button>
          </div>
        </div>

        <div className="pt-2">
          <ServiceNavTabs activeTab="repairs" totalRepairs={totalCount} />
        </div>
      </div>

      {/* Filter */}
      <div className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm theo mã phiếu, tên chủ xe, biển số..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-full sm:w-44">
              <SearchSelect
                placeholder="Tiến độ sửa..."
                options={[{ value: "", label: "Tất cả tiến độ" }, ...repairStatusOptions]}
                value={statusFilter !== null ? String(statusFilter) : ""}
                onChange={(val) => setStatusFilter(val ? Number(val) : null)}
                isLoading={isLoadingRepairStatuses}
              />
            </div>

            <div className="w-full sm:w-44">
              <SearchSelect
                placeholder="Thanh toán..."
                options={[{ value: "", label: "Tất cả thanh toán" }, ...paymentStatusOptions]}
                value={paymentStatusFilter !== null ? String(paymentStatusFilter) : ""}
                onChange={(val) => setPaymentStatusFilter(val ? Number(val) : null)}
                isLoading={isLoadingPaymentStatuses}
              />
            </div>

            <div className="w-full sm:w-44">
              <SearchSelect
                placeholder="Loại dịch vụ..."
                options={[{ value: "", label: "Tất cả loại DV" }, ...serviceTypeOptions]}
                value={serviceTypeFilter !== null ? String(serviceTypeFilter) : ""}
                onChange={(val) => setServiceTypeFilter(val ? Number(val) : null)}
                isLoading={isLoadingServiceTypes}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <Card className="p-6">
          <Skeleton className="h-10 w-full mb-3" />
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-12 w-full" />
        </Card>
      ) : (
        <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
          <div className="p-3 flex flex-col gap-3 w-full">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <FolderOpen className="w-10 h-10 mb-2 stroke-[1.5]" />
                <p className="font-semibold text-foreground">Chưa có xe nào đang sửa chữa</p>
                <Button
                  size="sm"
                  onClick={handleOpenCreate}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-1" /> Tiếp nhận xe mới
                </Button>
              </div>
            ) : (
              <>
                <Table<SC_PhieuSuaChua>
                  data={items}
                  columns={columns}
                  showIndex
                  startIndex={(page - 1) * pageSize}
                />

                <div className="flex justify-between items-center pt-3 border-t border-border/70 text-xs text-muted-foreground">
                  <span>Tổng {totalCount} phiếu sửa chữa & dịch vụ</span>
                  <div className="flex gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="h-8 px-2.5 text-xs"
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="h-8 px-2.5 text-xs"
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* SlideOver Tiếp nhận sửa chữa */}
      <SlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Tiếp Nhận Sửa Chữa & Bảo Dưỡng Xe"
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmitCreate} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Chủ xe / Khách hàng <span className="text-rose-500">*</span>
              </label>
              <SearchSelect
                placeholder="Chọn khách hàng..."
                options={customerOptions}
                value={dataCreate.KhachHangID}
                onChange={(val) =>
                  setDataCreate((prev) => ({ ...prev, KhachHangID: String(val) }))
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Phương tiện xe của khách
              </label>
              <SearchSelect
                placeholder="Chọn xe..."
                options={vehicleOptions}
                value={dataCreate.PhuongTienKhachHangID}
                onChange={(val) =>
                  setDataCreate((prev) => ({ ...prev, PhuongTienKhachHangID: String(val) }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Gói dịch vụ (Từ DM chi tiết)
              </label>
              <SearchSelect
                options={serviceTypeOptions}
                value={String(dataCreate.LoaiDichVuID)}
                onChange={(val) =>
                  setDataCreate((prev) => ({ ...prev, LoaiDichVuID: Number(val) }))
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Số Km (ODO) hiện tại
              </label>
              <Input
                type="number"
                min={0}
                value={dataCreate.SoKmHienTai || 0}
                onChange={(e) =>
                  setDataCreate((prev) => ({
                    ...prev,
                    SoKmHienTai: parseInt(e.target.value) || 0,
                  }))
                }
                className="text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Kho phụ tùng xuất linh kiện
              </label>
              <SearchSelect
                options={khoOptions}
                value={dataCreate.KhoID}
                onChange={(val) => setDataCreate((prev) => ({ ...prev, KhoID: String(val) }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Khách phản ánh / Triệu chứng xe <span className="text-rose-500">*</span>
            </label>
            <Textarea
              placeholder="VD: Xe đi bị kêu ở bánh sau, ga không bốc, pin sụt nhanh..."
              rows={2}
              value={dataCreate.MoTaVanDe || ""}
              onChange={(e) => setDataCreate((prev) => ({ ...prev, MoTaVanDe: e.target.value }))}
              className="text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Thợ máy chẩn đoán & Phương án xử lý
            </label>
            <Textarea
              placeholder="VD: Thay vòng bi moay-ơ bánh sau, cân chỉnh phanh đĩa..."
              rows={2}
              value={dataCreate.KetQuaChanDoan || ""}
              onChange={(e) =>
                setDataCreate((prev) => ({ ...prev, KetQuaChanDoan: e.target.value }))
              }
              className="text-xs"
            />
          </div>

          {/* Chi tiết hạng mục tiền công / phụ tùng */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-foreground">
                Hạng mục tiền công & Phụ tùng thay thế ({dataCreate.ChiTiets.length})
              </span>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={handleAddDetailRow}
                className="text-blue-600 text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Thêm hạng mục
              </Button>
            </div>

            {dataCreate.ChiTiets.map((row, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-border bg-muted/30 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
              >
                <div className="sm:col-span-6">
                  <Input
                    type="text"
                    placeholder="Tên công việc / Tên phụ tùng"
                    value={row.TenHangMuc}
                    onChange={(e) => {
                      const updated = [...dataCreate.ChiTiets];
                      updated[idx].TenHangMuc = e.target.value;
                      setDataCreate((prev) => ({ ...prev, ChiTiets: updated }));
                    }}
                    className="text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Input
                    type="number"
                    min={1}
                    placeholder="SL"
                    value={row.SoLuong}
                    onChange={(e) => {
                      const updated = [...dataCreate.ChiTiets];
                      const qty = Math.max(1, parseInt(e.target.value) || 1);
                      updated[idx].SoLuong = qty;
                      updated[idx].ThanhTien = qty * updated[idx].DonGia;
                      setDataCreate((prev) => ({ ...prev, ChiTiets: updated }));
                    }}
                    className="text-xs font-mono"
                  />
                </div>

                <div className="sm:col-span-3">
                  <Input
                    type="number"
                    min={0}
                    placeholder="Đơn giá"
                    value={row.DonGia}
                    onChange={(e) => {
                      const updated = [...dataCreate.ChiTiets];
                      const price = parseInt(e.target.value) || 0;
                      updated[idx].DonGia = price;
                      updated[idx].ThanhTien = updated[idx].SoLuong * price;
                      setDataCreate((prev) => ({ ...prev, ChiTiets: updated }));
                    }}
                    className="text-xs font-mono font-bold"
                  />
                </div>

                <div className="sm:col-span-1 flex justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleRemoveDetailRow(idx)}
                    className="text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpenCreate(false)}
              className="text-xs"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              {isSubmitting ? "Đang lưu..." : "Lập phiếu sửa chữa"}
            </Button>
          </div>
        </form>
      </SlideOver>

      {/* SlideOver Chuyển Trạng Thái (Dynamic) */}
      <SlideOver
        open={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
        title="Chuyển Tiến Độ Sửa Chữa"
        maxWidth="md"
      >
        <form onSubmit={handleSubmitStatusChange} className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Tiến độ kỹ thuật (Từ DM chi tiết)
            </label>
            <SearchSelect
              options={repairStatusOptions}
              value={String(dataStatusChange.TrangThaiID)}
              onChange={(val) =>
                setDataStatusChange((prev) => ({ ...prev, TrangThaiID: Number(val) }))
              }
              isLoading={isLoadingRepairStatuses}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Ghi chú cập nhật
            </label>
            <Textarea
              rows={3}
              placeholder="VD: Đã thay thế xong phụ tùng, đang chạy thử xe 5km..."
              value={dataStatusChange.GhiChu || ""}
              onChange={(e) =>
                setDataStatusChange((prev) => ({ ...prev, GhiChu: e.target.value }))
              }
              className="text-xs"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpenStatusModal(false)}
              className="text-xs"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              {isSubmitting ? "Đang lưu..." : "Cập nhật tiến độ"}
            </Button>
          </div>
        </form>
      </SlideOver>

      {/* SlideOver Thanh toán (Dynamic) */}
      <SlideOver
        open={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
        title="Thu Tiền Dịch Vụ Sửa Chữa"
        maxWidth="md"
      >
        <form onSubmit={handleSubmitPayment} className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Hình thức thu tiền (Từ DM chi tiết)
            </label>
            <SearchSelect
              options={paymentMethodOptions}
              value={String(dataPayment.PhuongTucThanhToanID)}
              onChange={(val) =>
                setDataPayment((prev) => ({ ...prev, PhuongTucThanhToanID: Number(val) }))
              }
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Số tiền thanh toán (đ)
            </label>
            <Input
              type="number"
              min={1000}
              value={dataPayment.SoTien}
              onChange={(e) =>
                setDataPayment((prev) => ({
                  ...prev,
                  SoTien: parseInt(e.target.value) || 0,
                }))
              }
              className="text-xs font-mono font-bold"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpenPaymentModal(false)}
              className="text-xs"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
            >
              {isSubmitting ? "Đang xử lý..." : "Xác nhận thu tiền"}
            </Button>
          </div>
        </form>
      </SlideOver>

      {/* SlideOver Chi tiết phiếu sửa chữa & Phụ tùng (SC_ChiTietSuaChua) */}
      <SlideOver
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        title={`Chi Tiết Phiếu Sửa Chữa ${selectedTicket?.maPhieuSuaChua || ""}`}
        description="Thông tin chẩn đoán kỹ thuật, linh kiện phụ tùng thay thế và thanh toán"
        maxWidth="xl"
      >
        {selectedTicket && (
          <div className="space-y-4 py-2 text-xs">
            {/* Header tóm tắt */}
            <div className="p-3.5 rounded-xl border border-border bg-muted/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                  {selectedTicket.maPhieuSuaChua}
                </span>
                <div className="flex items-center gap-1.5">
                  {(() => {
                    const badge = getRepairStatusBadge(selectedTicket.trangThaiID);
                    return (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${badge.className}`}>
                        {badge.label}
                      </span>
                    );
                  })()}
                  {(() => {
                    const badge = getPaymentStatusBadge(selectedTicket.trangThaiThanhToanID);
                    return (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${badge.className}`}>
                        {badge.label}
                      </span>
                    );
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-muted-foreground block">Khách hàng:</span>
                  <strong className="text-foreground">{selectedTicket.tenKhachHang || "Khách lẻ"}</strong>
                  {selectedTicket.dienThoaiKhachHang && (
                    <span className="block font-mono text-muted-foreground">
                      SĐT: {selectedTicket.dienThoaiKhachHang}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-muted-foreground block">Thông tin xe:</span>
                  <strong className="text-foreground">{selectedTicket.tenModelXe || "Xe khách"}</strong>
                  <span className="block font-mono text-muted-foreground">
                    BS: {selectedTicket.bienSoXe || "—"} | {selectedTicket.soKmHienTai ? `${selectedTicket.soKmHienTai} km` : ""}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                <span>Trạm xưởng: {selectedTicket.tenDiaDiem || "Trụ sở chính"}</span>
                <span>KTV phụ trách: {selectedTicket.tenKyThuatVien || "Kỹ thuật viên xưởng"}</span>
                <span>Tiếp nhận: {formatDate(selectedTicket.thoiGianTiepNhan)}</span>
                <span>Hẹn trả: {formatDate(selectedTicket.thoiGianHenTra)}</span>
              </div>
            </div>

            {/* Vấn đề & Chẩn đoán */}
            <div className="p-3 rounded-lg border border-border bg-card/60 space-y-1.5">
              <div>
                <span className="text-muted-foreground text-[11px] block font-medium">Hiện tượng / Vấn đề khách báo</span>
                <p className="text-foreground text-xs">{selectedTicket.moTaVanDe}</p>
              </div>
              {selectedTicket.ketQuaChanDoan && (
                <div className="pt-1.5 border-t border-border/50">
                  <span className="text-muted-foreground text-[11px] block font-medium">Kết quả chẩn đoán của KTV</span>
                  <p className="text-foreground text-xs">{selectedTicket.ketQuaChanDoan}</p>
                </div>
              )}
              {selectedTicket.giaiPhapXuLy && (
                <div className="pt-1.5 border-t border-border/50">
                  <span className="text-muted-foreground text-[11px] block font-medium">Phương án xử lý / Sửa chữa</span>
                  <p className="text-foreground text-xs">{selectedTicket.giaiPhapXuLy}</p>
                </div>
              )}
            </div>

            {/* Bảng chi tiết dịch vụ & phụ tùng thay thế (SC_ChiTietSuaChua) */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Hạng mục tiền công & phụ tùng ({selectedTicket.chiTiets?.length || 0})</span>
              </span>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                    <tr>
                      <th className="p-2 text-left font-medium">Tên hạng mục / Phụ tùng</th>
                      <th className="p-2 text-center font-medium w-16">Loại</th>
                      <th className="p-2 text-center font-medium w-12">SL</th>
                      <th className="p-2 text-right font-medium w-24">Đơn giá</th>
                      <th className="p-2 text-right font-medium w-24">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {selectedTicket.chiTiets && selectedTicket.chiTiets.length > 0 ? (
                      selectedTicket.chiTiets.map((ct, idx) => (
                        <tr key={idx} className="hover:bg-muted/30">
                          <td className="p-2 text-foreground font-medium">
                            {ct.tenHangMuc}
                            {ct.maHangMuc && (
                              <span className="block text-[10px] text-muted-foreground font-mono">
                                Mã: {ct.maHangMuc}
                              </span>
                            )}
                            {ct.thoiGianBaoHanhThang ? (
                              <span className="text-[10px] text-emerald-600 font-medium">
                                BH: {ct.thoiGianBaoHanhThang} tháng
                              </span>
                            ) : null}
                          </td>
                          <td className="p-2 text-center">
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-muted">
                              {ct.loaiHangMuc === 2 ? "Phụ tùng" : "Tiền công"}
                            </span>
                          </td>
                          <td className="p-2 text-center font-mono font-bold">{ct.soLuong}</td>
                          <td className="p-2 text-right font-mono text-muted-foreground">
                            {formatCurrency(ct.donGia)}
                          </td>
                          <td className="p-2 text-right font-mono font-semibold text-foreground">
                            {formatCurrency(ct.thanhTien)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-muted-foreground">
                          Không có dòng dịch vụ hoặc phụ tùng nào.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Chi phí tổng kết */}
            <div className="p-3.5 rounded-xl border border-border bg-muted/40 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tiền công dịch vụ:</span>
                <span className="font-mono">{formatCurrency(selectedTicket.tienCongDichVu)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tiền phụ tùng:</span>
                <span className="font-mono">{formatCurrency(selectedTicket.tienPhuTung)}</span>
              </div>
              {selectedTicket.tienGiamGia ? (
                <div className="flex justify-between text-muted-foreground">
                  <span>Giảm giá:</span>
                  <span className="font-mono">-{formatCurrency(selectedTicket.tienGiamGia)}</span>
                </div>
              ) : null}
              <div className="flex justify-between pt-1.5 border-t border-border/60">
                <span className="font-semibold text-foreground">Tổng chi phí phiếu:</span>
                <strong className="text-foreground font-mono text-sm">
                  {formatCurrency(selectedTicket.tongTien)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-600 font-medium">Đã thanh toán:</span>
                <strong className="text-emerald-600 font-mono">
                  {formatCurrency(selectedTicket.daThanhToan)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-rose-600 font-medium">Còn nợ:</span>
                <strong className="text-rose-600 font-mono">
                  {formatCurrency(selectedTicket.conNo)}
                </strong>
              </div>
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  );
}

export default function RepairTicketsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 space-y-4 max-w-[1600px] mx-auto">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <RepairTicketsContent />
    </Suspense>
  );
}
