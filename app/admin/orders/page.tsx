"use client";

import React, { Suspense, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchSelect } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { OrderNavTabs } from "@/components/Common/OrderNavTabs";
import { useDonHang } from "@/hooks/DonHang/useDonHang";
import { DH_DonHang } from "@/types/donHang";
import {
  ShoppingCart,
  Plus,
  RefreshCw,
  Search,
  FolderOpen,
  Filter,
  CheckCircle2,
  Clock,
  Eye,
  CreditCard,
  Building2,
  DollarSign,
  ArrowRight,
  Trash2,
  Receipt,
  User,
  MapPin,
  Package,
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
    customerFilter,
    setCustomerFilter,
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

    openCreate,
    setOpenCreate,
    dataCreate,
    setDataCreate,
    handleOpenCreate,
    handleAddDetailRow,
    handleRemoveDetailRow,
    handleSubmitCreate,
    isCreating,

    openDetail,
    setOpenDetail,
    selectedOrder,
    handleOpenDetail,

    openStatusModal,
    setOpenStatusModal,
    dataStatusChange,
    setDataStatusChange,
    handleOpenStatusChange,
    handleSubmitStatusChange,
    isChangingStatus,

    openPaymentModal,
    setOpenPaymentModal,
    dataPayment,
    setDataPayment,
    handleOpenPayment,
    handleSubmitPayment,
    isPaying,
    paymentHistoryItems,
    isLoadingPaymentHistory,

    handleHoanThanhVaGiaoXe,
    handleDelete,
  } = useDonHang();

  // Thống kê nhanh
  const completedCount = useMemo(
    () =>
      items.filter((i) => {
        const b = getOrderStatusBadge(i.trangThaiDonHangID);
        return b.color === "emerald" || i.trangThaiDonHangID === 75;
      }).length,
    [items, getOrderStatusBadge]
  );

  const pendingCount = useMemo(
    () =>
      items.filter((i) => {
        const b = getOrderStatusBadge(i.trangThaiDonHangID);
        return b.color === "amber" || i.trangThaiDonHangID === 72 || i.trangThaiDonHangID === 73;
      }).length,
    [items, getOrderStatusBadge]
  );

  const totalRevenue = useMemo(
    () => items.reduce((sum, i) => sum + (i.tongTien || 0), 0),
    [items]
  );

  const columns: Column<DH_DonHang>[] = [
    {
      key: "maDonHang",
      title: "Mã Đơn Hàng",
      classNameHeader: "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
          {String(v || "—")}
        </span>
      ),
    },
    {
      key: "khachHang",
      title: "Khách hàng & Nhận hàng",
      classNameHeader: "min-w-[200px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 py-1">
          <span className="font-semibold text-foreground text-sm flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            {row.tenKhachHang || row.tenNguoiNhan || "Khách lẻ"}
          </span>
          <span className="text-xs text-muted-foreground">
            SĐT: {row.soDienThoaiKhachHang || row.dienThoaiNguoiNhan || "—"}
          </span>
        </div>
      ),
    },
    {
      key: "loaiDonHang",
      title: "Phân loại",
      classNameHeader: "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20">
          {row.tenLoaiDonHang || "Bán lẻ"}
        </span>
      ),
    },
    {
      key: "trangThaiDonHangID",
      title: "Trạng thái đơn",
      classNameHeader: "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => {
        const badge = getOrderStatusBadge(Number(v));
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
      title: "Tổng tiền đơn",
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
      title: "Đã trả / Còn nợ",
      classNameHeader: "w-40 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 text-xs font-mono">
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            Đã trả: {formatCurrency(row.daThanhToan)}
          </span>
          <span
            className={
              (row.conNo || 0) > 0
                ? "text-rose-600 dark:text-rose-400 font-bold"
                : "text-muted-foreground"
            }
          >
            Còn nợ: {formatCurrency(row.conNo)}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      title: "Thao tác",
      classNameHeader: "w-44 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleOpenDetail(row)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer"
            title="Xem chi tiết đơn hàng"
          >
            <Eye className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleOpenStatusChange(row)}
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/50 cursor-pointer"
            title="Chuyển trạng thái đơn hàng"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleOpenPayment(row)}
            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 cursor-pointer"
            title="Ghi nhận thanh toán"
          >
            <Receipt className="w-3.5 h-3.5" />
          </Button>

          {row.trangThaiDonHangID !== 76 && row.trangThaiDonHangID !== 77 && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => handleHoanThanhVaGiaoXe(row)}
              className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/50 cursor-pointer"
              title="Xác nhận hoàn thành & Bàn giao xe (Trừ kho, xuất BH)"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleDelete(row)}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
            title="Hủy đơn hàng"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  const hasActiveFilters =
    searchInput !== "" ||
    statusFilter !== null ||
    paymentStatusFilter !== null ||
    orderTypeFilter !== null ||
    customerFilter !== "" ||
    khoFilter !== "";

  const handleResetFilters = () => {
    handleSearch("");
    setStatusFilter(null);
    setPaymentStatusFilter(null);
    setOrderTypeFilter(null);
    setCustomerFilter("");
    setKhoFilter("");
    setPage(1);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      {/* 1. Header & Navigation */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Quản Lý Đơn Hàng & Bán Hàng
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Theo dõi quy trình bán xe điện, phụ tùng, xuất kho serial và tiến độ thanh toán
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
              <span className="text-xs">Tạo đơn hàng mới</span>
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="pt-2">
          <OrderNavTabs activeTab="orders" totalOrders={totalCount} />
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Tổng đơn hàng</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">
            {isLoading ? <Skeleton className="h-7 w-12" /> : totalCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Tất cả kênh bán</p>
        </Card>

        <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Chờ xử lý & Giao</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">
            {isLoading ? <Skeleton className="h-7 w-12" /> : pendingCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Cần xuất kho hoặc vận chuyển</p>
        </Card>

        <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Hoàn thành</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            {isLoading ? <Skeleton className="h-7 w-12" /> : completedCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Đã bàn giao xe cho khách</p>
        </Card>

        <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Tổng doanh thu trang</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-foreground mt-2 truncate">
            {isLoading ? <Skeleton className="h-7 w-24" /> : formatCurrency(totalRevenue)}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Giá trị tiền hàng thực tế</p>
        </Card>
      </div>

      {/* 3. Filter Bar */}
      <div className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm theo mã đơn, tên khách, số điện thoại..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 h-9 text-xs bg-background/80"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Lọc Trạng thái đơn động */}
            <div className="w-full sm:w-44">
              <SearchSelect
                placeholder="Trạng thái đơn..."
                options={[{ value: "", label: "Tất cả trạng thái" }, ...orderStatusOptions]}
                value={statusFilter !== null ? Number(statusFilter) : ""}
                onChange={(val) => {
                  setStatusFilter(val ? Number(val) : null);
                  setPage(1);
                }}
                isLoading={isLoadingOrderStatuses}
              />
            </div>

            {/* Lọc Trạng thái thanh toán động */}
            <div className="w-full sm:w-44">
              <SearchSelect
                placeholder="Thanh toán..."
                options={[{ value: "", label: "Tất cả thanh toán" }, ...paymentStatusOptions]}
                value={paymentStatusFilter !== null ? String(paymentStatusFilter) : ""}
                onChange={(val) => {
                  setPaymentStatusFilter(val ? Number(val) : null);
                  setPage(1);
                }}
                isLoading={isLoadingPaymentStatuses}
              />
            </div>

            {/* Lọc Loại đơn hàng động */}
            <div className="w-full sm:w-40">
              <SearchSelect
                placeholder="Phân loại đơn..."
                options={[{ value: "", label: "Tất cả loại đơn" }, ...orderTypeOptions]}
                value={orderTypeFilter !== null ? String(orderTypeFilter) : ""}
                onChange={(val) => {
                  setOrderTypeFilter(val ? Number(val) : null);
                  setPage(1);
                }}
                isLoading={isLoadingOrderTypes}
              />
            </div>

            {/* Lọc Kho xuất */}
            <div className="w-full sm:w-44">
              <SearchSelect
                placeholder="Kho xuất hàng..."
                options={[{ value: "", label: "Tất cả kho xuất" }, ...khoOptions]}
                value={khoFilter}
                onChange={(val) => {
                  setKhoFilter(val ? String(val) : "");
                  setPage(1);
                }}
                isLoading={isLoadingKhos}
              />
            </div>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
            >
              <Filter className="w-3.5 h-3.5 mr-1" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>

      {/* 4. Table view */}
      {isLoading ? (
        <Card className="p-6">
          <Skeleton className="h-10 w-full mb-3" />
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-12 w-full" />
        </Card>
      ) : (
        <div className="rounded-xl border border-border/80 bg-card shadow-xs">
          <div className="p-3 flex flex-col gap-3 w-full">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-border/50 shadow-2xs">
                  <FolderOpen className="w-7 h-7 stroke-[1.5]" />
                </div>
                <p className="font-semibold text-base text-foreground">
                  Không tìm thấy đơn hàng nào
                </p>
                <p className="text-xs text-muted-foreground max-w-sm mt-1">
                  Chưa có đơn hàng nào khớp với các tiêu chí tìm kiếm hiện tại.
                </p>
                <Button
                  size="sm"
                  onClick={handleOpenCreate}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-1" /> Tạo đơn hàng mới
                </Button>
              </div>
            ) : (
              <>
                <Table<DH_DonHang>
                  data={items}
                  columns={columns}
                  showIndex
                  startIndex={(page - 1) * pageSize}
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/70 text-sm text-muted-foreground">
                  <div className="text-xs">
                    Trang <strong className="text-foreground">{page}</strong> / {totalPages}{" "}
                    (Tổng <strong className="text-foreground">{totalCount}</strong> đơn hàng)
                  </div>

                  <div className="flex items-center gap-1.5">
                    <SearchSelect
                      options={[
                        { value: 10, label: "10" },
                        { value: 20, label: "20" },
                        { value: 50, label: "50" },
                        { value: 100, label: "100" },
                      ]}
                      value={pageSize}
                      onChange={(val) => {
                        setPageSize(Number(val));
                        setPage(1);
                      }}
                      className="w-28 text-xs"
                    />

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="h-8 px-2.5 text-xs cursor-pointer"
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="h-8 px-2.5 text-xs cursor-pointer"
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

      {/* 5. SlideOver Tạo Đơn Mới */}
      <SlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Tạo Đơn Hàng Mới"
        description="Lập phiếu bán xe điện, phụ tùng linh kiện hoặc bán trả góp"
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmitCreate} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Khách hàng <span className="text-rose-500">*</span>
              </label>
              <SearchSelect
                placeholder="Chọn khách hàng..."
                options={customerOptions}
                value={dataCreate.KhachHangID}
                onChange={(val) =>
                  setDataCreate((prev) => ({ ...prev, KhachHangID: String(val) }))
                }
                isLoading={isLoadingCustomers}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Chi nhánh / Cửa hàng
              </label>
              <SearchSelect
                placeholder="Chọn showroom..."
                options={diaDiemOptions}
                value={dataCreate.DiaDiemID}
                onChange={(val) =>
                  setDataCreate((prev) => ({ ...prev, DiaDiemID: String(val) }))
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Kho xuất hàng <span className="text-rose-500">*</span>
              </label>
              <SearchSelect
                placeholder="Chọn kho xuất..."
                options={khoOptions}
                value={dataCreate.KhoXuatID}
                onChange={(val) =>
                  setDataCreate((prev) => ({ ...prev, KhoXuatID: String(val) }))
                }
                isLoading={isLoadingKhos}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Hình thức bán hàng
              </label>
              <SearchSelect
                options={orderTypeOptions}
                value={String(dataCreate.LoaiDonHangID)}
                onChange={(val) =>
                  setDataCreate((prev) => ({ ...prev, LoaiDonHangID: Number(val) }))
                }
                isLoading={isLoadingOrderTypes}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Phí giao xe (đ)
              </label>
              <Input
                type="number"
                min={0}
                value={dataCreate.PhiVanChuyen || 0}
                onChange={(e) =>
                  setDataCreate((prev) => ({
                    ...prev,
                    PhiVanChuyen: parseInt(e.target.value) || 0,
                  }))
                }
                className="text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Phí dịch vụ biển số (đ)
              </label>
              <Input
                type="number"
                min={0}
                value={dataCreate.PhiDichVuBienSo || 0}
                onChange={(e) =>
                  setDataCreate((prev) => ({
                    ...prev,
                    PhiDichVuBienSo: parseInt(e.target.value) || 0,
                  }))
                }
                className="text-xs font-mono"
              />
            </div>
          </div>

          {/* Danh sách mặt hàng */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                Danh sách sản phẩm bán ({dataCreate.ChiTiets.length})
              </span>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={handleAddDetailRow}
                className="text-blue-600 hover:text-blue-700 text-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Thêm sản phẩm
              </Button>
            </div>

            <div className="space-y-3">
              {dataCreate.ChiTiets.map((row, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-border bg-muted/30 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Mặt hàng #{idx + 1}
                    </span>
                    {dataCreate.ChiTiets.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => handleRemoveDetailRow(idx)}
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
                    <div className="md:col-span-5">
                      <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                        Sản phẩm / Biến thể
                      </label>
                      <SearchSelect
                        placeholder="Chọn biến thể..."
                        options={variantOptions}
                        value={row.BienTheSanPhamID}
                        onChange={(val) => {
                          const updated = [...dataCreate.ChiTiets];
                          const selectedVar = (variantOptions as Array<{ value: string; sku?: string; name?: string; defaultPrice?: number }>).find(
                            (v) => v.value === val
                          );
                          updated[idx].BienTheSanPhamID = String(val);
                          updated[idx].MaSKU = selectedVar?.sku || "";
                          updated[idx].TenSanPham = selectedVar?.name || "";
                          if (selectedVar?.defaultPrice && !updated[idx].DonGiaBan) {
                            updated[idx].DonGiaBan = selectedVar.defaultPrice;
                          }
                          const qty = updated[idx].SoLuong || 1;
                          const price = updated[idx].DonGiaBan || 0;
                          const vat = Number(updated[idx].ThueVAT) || 0;
                          const sub = qty * price;
                          updated[idx].TienThueVAT = (sub * vat) / 100;
                          updated[idx].ThanhTien = sub + updated[idx].TienThueVAT;
                          setDataCreate((prev) => ({ ...prev, ChiTiets: updated }));
                        }}
                        isLoading={isLoadingVariants}
                      />
                    </div>

                    <div className="grid grid-cols-3 md:col-span-7 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                          Số lượng
                        </label>
                        <Input
                          type="number"
                          min={1}
                          value={row.SoLuong}
                          onChange={(e) => {
                            const updated = [...dataCreate.ChiTiets];
                            const qty = Math.max(1, parseInt(e.target.value) || 1);
                            updated[idx].SoLuong = qty;
                            const price = updated[idx].DonGiaBan || 0;
                            const vat = Number(updated[idx].ThueVAT) || 0;
                            const sub = qty * price;
                            updated[idx].TienThueVAT = (sub * vat) / 100;
                            updated[idx].ThanhTien = sub + updated[idx].TienThueVAT;
                            setDataCreate((prev) => ({ ...prev, ChiTiets: updated }));
                          }}
                          className="text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                          Đơn giá bán (đ)
                        </label>
                        <Input
                          type="number"
                          min={0}
                          value={row.DonGiaBan}
                          onChange={(e) => {
                            const updated = [...dataCreate.ChiTiets];
                            const price = parseInt(e.target.value) || 0;
                            updated[idx].DonGiaBan = price;
                            const qty = updated[idx].SoLuong || 1;
                            const vat = Number(updated[idx].ThueVAT) || 0;
                            const sub = qty * price;
                            updated[idx].TienThueVAT = (sub * vat) / 100;
                            updated[idx].ThanhTien = sub + updated[idx].TienThueVAT;
                            setDataCreate((prev) => ({ ...prev, ChiTiets: updated }));
                          }}
                          className="text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                          % Thuế VAT
                        </label>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          step={1}
                          value={row.ThueVAT === undefined || row.ThueVAT === null ? "" : row.ThueVAT}
                          onChange={(e) => {
                            const updated = [...dataCreate.ChiTiets];
                            const inputVal = e.target.value;
                            if (inputVal === "") {
                              updated[idx].ThueVAT = "" as unknown as number;
                            } else {
                              const parsed = parseFloat(inputVal);
                              updated[idx].ThueVAT = isNaN(parsed) ? 0 : Math.max(0, Math.min(100, parsed));
                            }
                            const qty = updated[idx].SoLuong || 1;
                            const price = updated[idx].DonGiaBan || 0;
                            const vat = Number(updated[idx].ThueVAT) || 0;
                            const sub = qty * price;
                            updated[idx].TienThueVAT = (sub * vat) / 100;
                            updated[idx].ThanhTien = sub + updated[idx].TienThueVAT;
                            setDataCreate((prev) => ({ ...prev, ChiTiets: updated }));
                          }}
                          onBlur={() => {
                            if (row.ThueVAT === ("" as unknown as number) || row.ThueVAT === undefined || row.ThueVAT === null) {
                              const updated = [...dataCreate.ChiTiets];
                              updated[idx].ThueVAT = 0;
                              setDataCreate((prev) => ({ ...prev, ChiTiets: updated }));
                            }
                          }}
                          placeholder="VD: 10"
                          className="text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50">
                    <span className="text-muted-foreground">
                      Tiền thuế VAT: {formatCurrency(row.TienThueVAT || 0)} (áp dụng {Number(row.ThueVAT) || 0}%)
                    </span>
                    <span className="font-semibold text-foreground">
                      Thành tiền: {formatCurrency(row.ThanhTien)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bảng tổng hợp tài chính đơn hàng */}
            <div className="p-3 rounded-lg border border-border/70 bg-card/60 space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Tiền hàng (tạm tính):</span>
                <span className="font-mono font-medium text-foreground">
                  {formatCurrency(
                    dataCreate.ChiTiets.reduce((sum, item) => sum + (item.SoLuong || 0) * (item.DonGiaBan || 0), 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tổng thuế VAT:</span>
                <span className="font-mono font-medium text-foreground">
                  {formatCurrency(
                    dataCreate.ChiTiets.reduce((sum, item) => sum + (item.TienThueVAT || 0), 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-border/60 text-sm font-bold">
                <span className="text-foreground">Tổng cộng đơn hàng:</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">
                  {formatCurrency(
                    dataCreate.ChiTiets.reduce((sum, item) => sum + (item.ThanhTien || 0), 0)
                  )}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Ghi chú đơn hàng
            </label>
            <Textarea
              placeholder="VD: Khách yêu cầu đăng ký biển số TP.HCM, giao sau 17h..."
              rows={2}
              value={dataCreate.GhiChu || ""}
              onChange={(e) => setDataCreate((prev) => ({ ...prev, GhiChu: e.target.value }))}
              className="text-xs"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpenCreate(false)}
              className="text-xs cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isCreating}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs cursor-pointer font-medium"
            >
              {isCreating ? "Đang tạo..." : "Lập đơn hàng"}
            </Button>
          </div>
        </form>
      </SlideOver>

      {/* 6. Modal Chuyển Trạng Thái (Dynamic) */}
      <SlideOver
        open={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
        title="Chuyển Trạng Thái Đơn Hàng"
        description={`Cập nhật quy trình vận chuyển / xử lý của đơn ${selectedOrder?.maDonHang}`}
        maxWidth="md"
      >
        <form onSubmit={handleSubmitStatusChange} className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Trạng thái tiếp theo (Từ danh mục chi tiết)
            </label>
            <SearchSelect
              options={orderStatusOptions}
              value={Number(dataStatusChange.TrangThaiDonHangID)}
              onChange={(val) =>
                setDataStatusChange((prev) => ({ ...prev, TrangThaiDonHangID: Number(val) }))
              }
              isLoading={isLoadingOrderStatuses}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Ghi chú chuyển trạng thái
            </label>
            <Textarea
              placeholder="VD: Đã đóng gói xong và bàn giao cho đơn vị vận chuyển..."
              rows={3}
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
              className="text-xs cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isChangingStatus}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs cursor-pointer font-medium"
            >
              {isChangingStatus ? "Đang lưu..." : "Xác nhận chuyển"}
            </Button>
          </div>
        </form>
      </SlideOver>

      {/* 7. Modal Thanh Toán (Dynamic) */}
      <SlideOver
        open={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
        title="Ghi Nhận Thu Tiền / Thanh Toán"
        description={`Lập phiếu thu cho đơn hàng ${selectedOrder?.maDonHang}`}
        maxWidth="md"
      >
        <form onSubmit={handleSubmitPayment} className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Phương thức thanh toán (Từ danh mục chi tiết)
            </label>
            <SearchSelect
              options={paymentMethodOptions}
              value={String(dataPayment.PhuongTucThanhToanID)}
              onChange={(val) =>
                setDataPayment((prev) => ({ ...prev, PhuongTucThanhToanID: Number(val) }))
              }
              isLoading={isLoadingPaymentMethods}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Số tiền thu (đ)
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

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Mã giao dịch / Biên lai ngân hàng
            </label>
            <Input
              type="text"
              value={dataPayment.MaGiaoDich}
              onChange={(e) =>
                setDataPayment((prev) => ({ ...prev, MaGiaoDich: e.target.value }))
              }
              className="text-xs font-mono"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpenPaymentModal(false)}
              className="text-xs cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPaying}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer font-medium"
            >
              {isPaying ? "Đang xử lý..." : "Xác nhận thu tiền"}
            </Button>
          </div>
        </form>
      </SlideOver>

      {/* 8. SlideOver Xem Chi Tiết Đơn */}
      <SlideOver
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        title={`Chi Tiết Đơn Hàng ${selectedOrder?.maDonHang}`}
        description="Thông tin chi tiết xe, phụ tùng, số serial/khung xuất bán và lịch sử thanh toán"
        maxWidth="2xl"
      >
        {selectedOrder && (
          <div className="space-y-4 py-2 text-xs">
            {/* Tóm tắt khách hàng & đơn hàng */}
            <div className="p-3.5 rounded-xl border border-border bg-muted/40 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Khách hàng</span>
                  <strong className="text-foreground text-xs">{selectedOrder.tenKhachHang || "Khách lẻ"}</strong>
                  {selectedOrder.soDienThoaiKhachHang && (
                    <span className="block font-mono text-[11px] text-muted-foreground">
                      SĐT: {selectedOrder.soDienThoaiKhachHang}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Địa chỉ giao</span>
                  <span className="text-foreground text-[11px]">
                    {selectedOrder.diaChiGiaoHang || "Nhận trực tiếp tại showroom"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60 text-center">
                <div className="p-2 rounded-lg bg-background/60 border border-border/50">
                  <span className="text-muted-foreground text-[10px] block">Tổng tiền</span>
                  <span className="font-mono font-bold text-foreground text-xs">
                    {formatCurrency(selectedOrder.tongTien)}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-emerald-700 dark:text-emerald-400 text-[10px] block font-medium">Đã trả</span>
                  <span className="font-mono font-bold text-emerald-600 text-xs">
                    {formatCurrency(selectedOrder.daThanhToan)}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <span className="text-rose-700 dark:text-rose-400 text-[10px] block font-medium">Còn nợ</span>
                  <span className="font-mono font-bold text-rose-600 text-xs">
                    {formatCurrency(selectedOrder.conNo)}
                  </span>
                </div>
              </div>
            </div>

            {/* Danh sách mặt hàng (DH_ChiTietDonHang) */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-blue-500" />
                  Mặt hàng trong đơn ({selectedOrder.chiTiets?.length || 0})
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  Tạm tính: {formatCurrency(selectedOrder.tamTinh)}
                </span>
              </h3>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                    <tr>
                      <th className="p-2 text-left font-medium">Sản phẩm</th>
                      <th className="p-2 text-center font-medium w-14">SL</th>
                      <th className="p-2 text-right font-medium w-24">Đơn giá</th>
                      <th className="p-2 text-right font-medium w-20">Giảm giá</th>
                      <th className="p-2 text-right font-medium w-16">VAT</th>
                      <th className="p-2 text-right font-medium w-28">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {selectedOrder.chiTiets && selectedOrder.chiTiets.length > 0 ? (
                      selectedOrder.chiTiets.map((ct, idx) => (
                        <tr key={idx} className="hover:bg-muted/30">
                          <td className="p-2 text-foreground font-medium">
                            {ct.tenSanPham}
                            {ct.maSKU && (
                              <span className="block text-[10px] text-muted-foreground font-mono">
                                SKU: {ct.maSKU}
                              </span>
                            )}
                          </td>
                          <td className="p-2 text-center font-mono font-bold">{ct.soLuong}</td>
                          <td className="p-2 text-right font-mono">
                            {formatCurrency(ct.donGiaBan)}
                          </td>
                          <td className="p-2 text-right font-mono text-muted-foreground">
                            {ct.tienGiamGia ? `-${formatCurrency(ct.tienGiamGia)}` : "0 đ"}
                          </td>
                          <td className="p-2 text-right font-mono text-muted-foreground">
                            {ct.tienThueVAT ? formatCurrency(ct.tienThueVAT) : "0 đ"}
                          </td>
                          <td className="p-2 text-right font-mono font-semibold text-foreground">
                            {formatCurrency(ct.thanhTien)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-muted-foreground">
                          Chưa có sản phẩm nào.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Danh sách Số khung / Serial xe xuất bán (DH_SerialXuatBan) */}
            {selectedOrder.serials && selectedOrder.serials.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border/60">
                <span className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Số Serial / Số khung xe xuất bán (Kích hoạt BH)</span>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">
                    {selectedOrder.serials.length} xe
                  </span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                  {selectedOrder.serials.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg border border-border/70 bg-card/50 text-[11px] space-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-foreground">
                          {s.maSerial}
                        </span>
                        {s.ngayKetThucBaoHanh && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 bg-emerald-500/10 rounded border border-emerald-500/20 font-semibold">
                            Hạn BH: {formatDate(s.ngayKetThucBaoHanh)}
                          </span>
                        )}
                      </div>
                      {s.soKhung && (
                        <div className="text-muted-foreground font-mono text-[10px]">
                          Khung: <span className="text-foreground">{s.soKhung}</span>
                        </div>
                      )}
                      {s.soMay && (
                        <div className="text-muted-foreground font-mono text-[10px]">
                          Máy: <span className="text-foreground">{s.soMay}</span>
                        </div>
                      )}
                      {s.soPin && (
                        <div className="text-muted-foreground font-mono text-[10px]">
                          Pin: <span className="text-foreground">{s.soPin}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lịch sử thanh toán đơn hàng (DH_LichSuThanhToan) */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  Lịch sử thanh toán ({paymentHistoryItems.length})
                </span>
                {selectedOrder.conNo > 0 && (
                  <span className="text-[11px] text-rose-600 font-semibold">
                    Còn nợ: {formatCurrency(selectedOrder.conNo)}
                  </span>
                )}
              </div>

              {isLoadingPaymentHistory ? (
                <Skeleton className="h-16 w-full rounded-lg" />
              ) : paymentHistoryItems.length === 0 ? (
                <div className="py-4 text-center text-xs text-muted-foreground bg-muted/20 rounded-lg border border-border/40">
                  Chưa có giao dịch thanh toán nào được ghi nhận cho đơn này.
                </div>
              ) : (
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                      <tr>
                        <th className="p-2 text-left font-medium">Ngày thu</th>
                        <th className="p-2 text-left font-medium">Mã GD</th>
                        <th className="p-2 text-left font-medium">Phương thức</th>
                        <th className="p-2 text-right font-medium">Số tiền</th>
                        <th className="p-2 text-left font-medium">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {paymentHistoryItems.map((p, idx) => (
                        <tr key={idx} className="hover:bg-muted/30">
                          <td className="p-2 text-muted-foreground">{formatDate(p.ngayThanhToan)}</td>
                          <td className="p-2 font-mono font-medium text-foreground">{p.maGiaoDich}</td>
                          <td className="p-2 text-muted-foreground">{p.phuongTucThanhToanTen || "Tiền mặt"}</td>
                          <td className="p-2 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(p.soTien)}
                          </td>
                          <td className="p-2 text-[11px] text-muted-foreground truncate max-w-[140px]">
                            {p.ghiChu || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  );
}

export default function OrdersPage() {
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
      <OrdersContent />
    </Suspense>
  );
}
