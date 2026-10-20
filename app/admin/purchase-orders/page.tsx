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
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { PurchaseNavTabs } from "@/components/Common/PurchaseNavTabs";
import { useDonNhapHang } from "@/hooks/DonNhapHang/useDonNhapHang";
import { NH_DonNhapHang } from "@/types/donNhapHang";
import {
  ShoppingBag,
  Plus,
  RefreshCw,
  Search,
  FolderOpen,
  Filter,
  CheckCircle2,
  Clock,
  Warehouse,
  Eye,
  Calendar,
  CreditCard,
  Building2,
  Truck,
  ArrowRight,
  AlertTriangle,
  FileSpreadsheet,
  Trash2,
  DollarSign,
  ArrowDownLeft,
} from "lucide-react";

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

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
    isLoadingDetail,
    isCompletedStatus,

    openStatusModal,
    setOpenStatusModal,
    dataStatusChange,
    setDataStatusChange,
    handleOpenStatusChange,
    handleSubmitStatusChange,
    isChangingStatus,

    handleXacNhanNhapKho,
    isNhapKho,

    openPaymentModal,
    setOpenPaymentModal,
    dataPayment,
    setDataPayment,
    handleOpenPayment,
    handleSubmitPayment,
    isPaying,
    paymentHistoryItems,
    isLoadingPaymentHistory,

    handleDelete,
    isDeleting,
  } = useDonNhapHang();
  
  // Thống kê KPI ưu tiên từ Backend API GetKPI
  const totalPurchaseOrders =
    kpiData?.total_DonNhapHang ?? kpiData?.totalDonNhapHang ?? totalCount;
  const pendingCount =
    kpiData?.total_ChoDuyet ??
    kpiData?.totalChoDuyet ??
    items.filter((i) => {
      const b = getOrderStatusBadge(i.trangThaiID);
      return b.color === "amber" || i.trangThaiID === 66 || i.trangThaiID === 67;
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

  const kpiConfigs = useMemo(
    () => [
      {
        id: "total",
        title: "Tổng đơn nhập",
        subTitle: "Đã tạo trong hệ thống",
        value: totalPurchaseOrders.toLocaleString("vi-VN"),
        icon: FileSpreadsheet,
        colorClass: "text-foreground",
        iconBgClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        isActive: statusFilter === null,
        onClick: () => {
          setStatusFilter(null);
          setPage(1);
        },
      },
      {
        id: "pending",
        title: "Chờ duyệt & Đang tạo",
        subTitle: "Cần phê duyệt đơn hàng",
        value: pendingCount.toLocaleString("vi-VN"),
        icon: Clock,
        colorClass: "text-amber-600 dark:text-amber-400",
        iconBgClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        isActive: statusFilter === 66 || statusFilter === 67,
        onClick: () => {
          setStatusFilter(66);
          setPage(1);
        },
      },
      {
        id: "completed",
        title: "Đã nhập kho",
        subTitle: "Đã tăng tồn kho thực tế",
        value: completedCount.toLocaleString("vi-VN"),
        icon: CheckCircle2,
        colorClass: "text-emerald-600 dark:text-emerald-400",
        iconBgClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        isActive: statusFilter === 70,
        onClick: () => {
          setStatusFilter(70);
          setPage(1);
        },
      },
      {
        id: "debt",
        title: "Còn nợ đơn nhập",
        subTitle: "Tổng nợ cần trả NCC",
        value: formatCurrency(totalDebt),
        icon: DollarSign,
        colorClass: "text-rose-600 dark:text-rose-400",
        iconBgClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
        isActive: false,
      },
    ],
    [totalPurchaseOrders, pendingCount, completedCount, totalDebt, statusFilter, setStatusFilter, setPage]
  );

  const columns: Column<NH_DonNhapHang>[] = [
    {
      key: "maDonNhap",
      title: "Mã đơn nhập",
      classNameHeader: "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
          {String(v || "—")}
        </span>
      ),
    },
    {
      key: "nhaCungCapID",
      title: "Nhà cung cấp & Kho đích",
      classNameHeader: "min-w-[220px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 py-1">
          <span className="font-semibold text-foreground text-sm flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            {row.tenNhaCungCap || "NCC"}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Warehouse className="w-3 h-3 text-muted-foreground shrink-0" />
            Kho: <strong className="text-foreground">{row.tenKho || "Kho tiếp nhận"}</strong>
          </span>
          {row.soHoaDonChungTu && (
            <span className="text-[11px] text-muted-foreground font-mono">
              HĐ: {row.soHoaDonChungTu}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "ngayHoaDon",
      title: "Ngày chứng từ & Hạn",
      classNameHeader: "w-36 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
          <span>Ngày HĐ: {formatDate(row.ngayHoaDon)}</span>
          {row.hanThanhToan && (
            <span className="text-amber-600 dark:text-amber-400">
              Hạn TT: {formatDate(row.hanThanhToan)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "tongTien",
      title: "Tổng tiền hàng",
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
      title: "Đã thanh toán / Còn nợ",
      classNameHeader: "w-44 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 text-xs font-mono">
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            Đã trả: {formatCurrency(row.daThanhToan)}
          </span>
          <span
            className={
              row.conNo > 0
                ? "text-rose-600 dark:text-rose-400 font-semibold"
                : "text-muted-foreground"
            }
          >
            Nợ: {formatCurrency(row.conNo)}
          </span>
        </div>
      ),
    },
    {
      key: "trangThaiID",
      title: "Trạng thái",
      classNameHeader: "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => {
        const badge = getOrderStatusBadge(Number(v));
        return (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {badge.label}
          </span>
        );
      },
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader: "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleOpenDetail(row)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer"
            title="Xem chi tiết đơn"
          >
            <Eye className="w-3.5 h-3.5" />
          </Button>

          {row.conNo > 0 && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => handleOpenPayment(row)}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 cursor-pointer"
              title="Thanh toán tiền hàng"
            >
              <CreditCard className="w-3.5 h-3.5" />
            </Button>
          )}

          {isCompletedStatus(row.trangThaiID) ? (
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded text-muted-foreground/30 cursor-not-allowed"
              title="Đơn đã hoàn thành (nhập kho thành công), không thể thay đổi trạng thái"
            >
              <Clock className="w-3.5 h-3.5 opacity-30" />
            </span>
          ) : (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => handleOpenStatusChange(row)}
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/50 cursor-pointer"
              title="Đổi trạng thái đơn"
            >
              <Clock className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const hasActiveFilters =
    searchInput !== "" ||
    supplierFilter !== "" ||
    khoFilter !== "" ||
    statusFilter !== null;

  const handleResetFilters = () => {
    handleSearch("");
    setSupplierFilter("");
    setKhoFilter("");
    setStatusFilter(null);
    setPage(1);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      {/* 1. Header & Navigation */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Đơn Nhập Hàng & Nhập Kho
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Quản lý quy trình đặt hàng từ hãng, kiểm đếm serial, nạp kho và thanh toán cho NCC
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetch();
                refetchKPI();
              }}
              disabled={isFetching || isLoadingKPI}
              className="h-9 px-3.5 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""}`}
              />
              <span className="text-xs font-medium">Làm mới</span>
            </Button>

            <Button
              size="sm"
              onClick={handleOpenCreate}
              className="h-9 px-4 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs">Tạo đơn nhập hàng</span>
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="pt-2">
          <PurchaseNavTabs activeTab="orders" totalOrders={totalPurchaseOrders} />
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {kpiConfigs.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.id}
              onClick={kpi.onClick}
              className={`p-3 sm:p-4 bg-card/60 backdrop-blur-sm border-border/80 shadow-2xs transition-all ${
                kpi.onClick ? "cursor-pointer hover:border-primary/40 active:scale-[0.99]" : ""
              } ${
                kpi.isActive ? "border-primary/50 bg-primary/5 shadow-xs ring-2 ring-primary/10" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground truncate">
                  {kpi.title}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${kpi.iconBgClass}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div
                className={`text-xl sm:text-2xl font-bold mt-2 truncate ${kpi.colorClass}`}
              >
                {isLoading || isLoadingKPI ? (
                  <Skeleton className="h-7 w-16" />
                ) : (
                  kpi.value
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                {kpi.subTitle}
              </p>
            </Card>
          );
        })}
      </div>

      {/* 3. Filter Bar */}
      <div className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-1 flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm mã đơn nhập, số hóa đơn, ghi chú..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 h-9 text-xs bg-background/80"
              />
            </div>

            {/* Lọc theo Nhà cung cấp */}
            <div className="w-full sm:w-60">
              <SearchSelect
                placeholder="Lọc theo nhà cung cấp..."
                options={[{ value: "", label: "Tất cả nhà cung cấp" }, ...supplierOptions]}
                value={supplierFilter}
                onChange={(val) => {
                  setSupplierFilter(val ? String(val) : "");
                  setPage(1);
                }}
                isLoading={isLoadingSuppliers}
              />
            </div>

            {/* Lọc theo Kho */}
            <div className="w-full sm:w-52">
              <SearchSelect
                placeholder="Lọc theo kho đích..."
                options={[{ value: "", label: "Tất cả kho" }, ...khoOptions]}
                value={khoFilter}
                onChange={(val) => {
                  setKhoFilter(val ? String(val) : "");
                  setPage(1);
                }}
                isLoading={isLoadingKhos}
              />
            </div>

            {/* Lọc theo Trạng thái động từ DM_DanhMucChiTiet */}
            <div className="w-full sm:w-52">
              <SearchSelect
                placeholder="Tất cả trạng thái..."
                options={[
                  { value: "", label: "Tất cả trạng thái" },
                  ...orderStatusOptions.map((opt) => ({
                    value: String(opt.value),
                    label: opt.label,
                  })),
                ]}
                value={statusFilter !== null ? String(statusFilter) : ""}
                onChange={(val) => {
                  setStatusFilter(val ? Number(val) : null);
                  setPage(1);
                }}
                isLoading={isLoadingStatuses}
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

      {/* 4. Table View */}
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
                  Không tìm thấy đơn nhập hàng nào
                </p>
                <p className="text-xs text-muted-foreground max-w-sm mt-1">
                  Chưa có đơn nhập nào phù hợp với bộ lọc tìm kiếm hiện tại.
                </p>
                <Button
                  size="sm"
                  onClick={handleOpenCreate}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-1" /> Tạo đơn nhập hàng mới
                </Button>
              </div>
            ) : (
              <>
                <Table<NH_DonNhapHang>
                  data={items}
                  columns={columns}
                  showIndex
                  startIndex={(page - 1) * pageSize}
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/70 text-sm text-muted-foreground">
                  <div className="text-xs">
                    Trang <strong className="text-foreground">{page}</strong> / {totalPages}{" "}
                    (Tổng <strong className="text-foreground">{totalCount}</strong> đơn nhập hàng)
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

      {/* 5. SlideOver Tạo đơn nhập hàng mới */}
      <SlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Tạo Đơn Nhập Hàng Mới"
        description="Lập phiếu đặt hàng từ nhà sản xuất / NCC và cấu hình mặt hàng nhập kho"
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmitCreate} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Nhà cung cấp <span className="text-rose-500">*</span>
              </label>
              <SearchSelect
                placeholder="Chọn nhà cung cấp..."
                options={supplierOptions}
                value={dataCreate.NhaCungCapID}
                onChange={(val) =>
                  setDataCreate((prev) => ({ ...prev, NhaCungCapID: String(val) }))
                }
                isLoading={isLoadingSuppliers}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Kho tiếp nhận <span className="text-rose-500">*</span>
              </label>
              <SearchSelect
                placeholder="Chọn kho tiếp nhận..."
                options={khoOptions}
                value={dataCreate.KhoID}
                onChange={(val) =>
                  setDataCreate((prev) => ({ ...prev, KhoID: String(val) }))
                }
                isLoading={isLoadingKhos}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Số hóa đơn / Chứng từ
              </label>
              <Input
                type="text"
                placeholder="VD: HD-VAT-2024001"
                value={dataCreate.SoHoaDonChungTu || ""}
                onChange={(e) =>
                  setDataCreate((prev) => ({
                    ...prev,
                    SoHoaDonChungTu: e.target.value,
                  }))
                }
                className="text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Ngày hóa đơn
              </label>
              <Input
                type="date"
                value={dataCreate.NgayHoaDon ? dataCreate.NgayHoaDon.slice(0, 10) : ""}
                onChange={(e) =>
                  setDataCreate((prev) => ({
                    ...prev,
                    NgayHoaDon: e.target.value ? new Date(e.target.value).toISOString() : null,
                  }))
                }
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Chi phí vận chuyển (đ)
              </label>
              <Input
                type="number"
                min={0}
                placeholder="VD: 500000"
                value={dataCreate.ChiPhiVanChuyen || 0}
                onChange={(e) =>
                  setDataCreate((prev) => ({
                    ...prev,
                    ChiPhiVanChuyen: parseInt(e.target.value) || 0,
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
                Danh sách mặt hàng nhập ({dataCreate.ChiTiets.length})
              </span>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={handleAddDetailRow}
                className="text-blue-600 hover:text-blue-700 text-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Thêm mặt hàng
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
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleRemoveDetailRow(idx)}
                      className="text-rose-500 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
                    <div className="md:col-span-5">
                      <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                        Sản phẩm / Dòng xe / Phiên bản
                      </label>
                      <SearchSelect
                        placeholder="Chọn biến thể sản phẩm..."
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
                          if (selectedVar?.defaultPrice && !updated[idx].DonGiaNhap) {
                            updated[idx].DonGiaNhap = selectedVar.defaultPrice;
                          }
                          const donGia = updated[idx].DonGiaNhap || 0;
                          const soLuong = updated[idx].SoLuong || 1;
                          const vat = Number(updated[idx].ThueVAT) || 0;
                          const sub = soLuong * donGia;
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
                            const sl = parseInt(e.target.value) || 0;
                            updated[idx].SoLuong = sl;
                            const donGia = updated[idx].DonGiaNhap || 0;
                            const vat = Number(updated[idx].ThueVAT) || 0;
                            const sub = sl * donGia;
                            updated[idx].TienThueVAT = (sub * vat) / 100;
                            updated[idx].ThanhTien = sub + updated[idx].TienThueVAT;
                            setDataCreate((prev) => ({ ...prev, ChiTiets: updated }));
                          }}
                          className="text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                          Đơn giá nhập (đ)
                        </label>
                        <Input
                          type="number"
                          min={0}
                          value={row.DonGiaNhap}
                          onChange={(e) => {
                            const updated = [...dataCreate.ChiTiets];
                            const gia = parseInt(e.target.value) || 0;
                            updated[idx].DonGiaNhap = gia;
                            const sl = updated[idx].SoLuong || 1;
                            const vat = Number(updated[idx].ThueVAT) || 0;
                            const sub = sl * gia;
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
                            const sl = updated[idx].SoLuong || 1;
                            const donGia = updated[idx].DonGiaNhap || 0;
                            const vat = Number(updated[idx].ThueVAT) || 0;
                            const sub = sl * donGia;
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
                      Tiền thuế VAT: {formatCurrency(row.TienThueVAT)} (áp dụng {Number(row.ThueVAT) || 0}%)
                    </span>
                    <span className="font-semibold text-foreground">
                      Thành tiền: {formatCurrency(row.ThanhTien)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bảng tổng hợp tài chính đơn nhập */}
            <div className="p-3 rounded-lg border border-border/70 bg-card/60 space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Tiền hàng (tạm tính):</span>
                <span className="font-mono font-medium text-foreground">
                  {formatCurrency(
                    dataCreate.ChiTiets.reduce((sum, item) => sum + (item.SoLuong || 0) * (item.DonGiaNhap || 0), 0)
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
              {Boolean(dataCreate.ChiPhiVanChuyen) && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Chi phí vận chuyển:</span>
                  <span className="font-mono font-medium text-foreground">
                    {formatCurrency(dataCreate.ChiPhiVanChuyen)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-1.5 border-t border-border/60 text-sm font-bold">
                <span className="text-foreground">Tổng cộng thanh toán:</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">
                  {formatCurrency(
                    dataCreate.ChiTiets.reduce((sum, item) => sum + (item.ThanhTien || 0), 0) + (dataCreate.ChiPhiVanChuyen || 0)
                  )}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Ghi chú đơn nhập
            </label>
            <Textarea
              rows={2}
              placeholder="Nhập thông tin kiểm đếm, ghi chú bàn giao..."
              value={dataCreate.GhiChu || ""}
              onChange={(e) =>
                setDataCreate((prev) => ({ ...prev, GhiChu: e.target.value }))
              }
              className="text-xs"
            />
          </div>

          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpenCreate(false)}
              className="text-xs cursor-pointer"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isCreating}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs cursor-pointer font-medium"
            >
              {isCreating ? "Đang xử lý..." : "Tạo đơn nhập hàng"}
            </Button>
          </div>
        </form>
      </SlideOver>

      {/* 6. SlideOver Chi tiết đơn nhập hàng */}
      <SlideOver
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        title="Chi Tiết Đơn Nhập Hàng"
        description="Thông tin các mặt hàng, trạng thái nhập kho và thanh toán NCC"
        maxWidth="2xl"
      >
        <div className="space-y-4 py-2">
          {selectedOrder && (
            <>
              {/* Header Card */}
              <div className="p-3.5 rounded-lg border border-border/80 bg-muted/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                    {selectedOrder.maDonNhap}
                  </span>
                  {(() => {
                    const badge = getOrderStatusBadge(selectedOrder.trangThaiID);
                    return (
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}
                      >
                        {badge.label}
                      </span>
                    );
                  })()}
                </div>

                <div className="text-xs">
                  Nhà cung cấp: <strong className="text-foreground">{selectedOrder.tenNhaCungCap}</strong>
                  <br />
                  Kho tiếp nhận: <strong className="text-foreground">{selectedOrder.tenKho}</strong>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                  <span>Hóa đơn: {selectedOrder.soHoaDonChungTu || "—"}</span>
                  <span>Ngày HĐ: {formatDate(selectedOrder.ngayHoaDon)}</span>
                  <span>Hạn TT: {formatDate(selectedOrder.hanThanhToan)}</span>
                  <span>Tổng tiền: <strong className="text-foreground">{formatCurrency(selectedOrder.tongTien)}</strong></span>
                  <span>Đã trả: <strong className="text-emerald-600">{formatCurrency(selectedOrder.daThanhToan)}</strong></span>
                  <span>Còn nợ: <strong className="text-rose-600">{formatCurrency(selectedOrder.conNo)}</strong></span>
                </div>
              </div>

              {/* Danh sách mặt hàng (NH_ChiTietDonNhapHang) */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-foreground">
                  Danh mục mặt hàng trong đơn ({selectedOrder.chiTiets?.length || 0})
                </span>
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                      <tr>
                        <th className="p-2 text-left font-medium">Sản phẩm</th>
                        <th className="p-2 text-center font-medium w-14">SL</th>
                        <th className="p-2 text-right font-medium w-24">Đơn giá</th>
                        <th className="p-2 text-right font-medium w-20">CK (%)</th>
                        <th className="p-2 text-right font-medium w-16">VAT</th>
                        <th className="p-2 text-right font-medium w-28">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {isLoadingDetail ? (
                        <tr>
                          <td colSpan={6} className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
                              Đang tải dữ liệu chi tiết mặt hàng từ hệ thống...
                            </div>
                          </td>
                        </tr>
                      ) : selectedOrder.chiTiets && selectedOrder.chiTiets.length > 0 ? (
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
                              {formatCurrency(ct.donGiaNhap)}
                            </td>
                            <td className="p-2 text-right font-mono text-muted-foreground">
                              {ct.phanTramGiamGia ? `${ct.phanTramGiamGia}%` : "0%"}
                            </td>
                            <td className="p-2 text-right font-mono text-muted-foreground">
                              {ct.thueVAT ? `${ct.thueVAT}%` : "0%"}
                            </td>
                            <td className="p-2 text-right font-mono font-semibold text-foreground">
                              {formatCurrency(ct.thanhTien)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-muted-foreground">
                            Chưa có dòng mặt hàng nào.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Danh sách Số Serial / Số Khung đã nhập (NH_SerialNhapHang) */}
              {isLoadingDetail ? (
                <div className="p-3 text-center text-xs text-muted-foreground border-t border-border/60">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500 inline mr-1.5" />
                  Đang tải danh sách serial & số khung...
                </div>
              ) : selectedOrder.serials && selectedOrder.serials.length > 0 ? (
                <div className="space-y-2 pt-2 border-t border-border/60">
                  <span className="text-xs font-semibold text-foreground flex items-center justify-between">
                    <span>Số Serial / Số khung nhập kho</span>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">
                      {selectedOrder.serials.length} xe / linh kiện
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
                          {s.viTriLuuTru && (
                            <span className="text-[10px] text-muted-foreground px-1.5 py-0.2 bg-muted rounded">
                              {s.viTriLuuTru}
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
              ) : null}

              {/* Lịch sử thanh toán đơn nhập (NH_LichSuThanhToan) */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                    Lịch sử thanh toán NCC ({paymentHistoryItems.length})
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
                          <th className="p-2 text-left font-medium">Ngày trả</th>
                          <th className="p-2 text-left font-medium">Mã GD / UNC</th>
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
                            <td className="p-2 text-muted-foreground">{p.tenPhuongThuc || "Chuyển khoản"}</td>
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

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-border">
                <div className="flex gap-2">
                  {selectedOrder.trangThaiID === 68 && (
                    <Button
                      size="sm"
                      onClick={() => handleXacNhanNhapKho(selectedOrder.donNhapHangID)}
                      disabled={isNhapKho}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      {isNhapKho ? "Đang xử lý..." : "Xác nhận nhập kho thực tế"}
                    </Button>
                  )}

                  {selectedOrder.conNo > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleOpenPayment(selectedOrder);
                      }}
                      className="text-emerald-600 border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-xs cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5 mr-1" />
                      Thanh toán NCC
                    </Button>
                  )}

                  {!isCompletedStatus(selectedOrder.trangThaiID) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenStatusChange(selectedOrder)}
                      className="text-xs cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      Đổi trạng thái
                    </Button>
                  )}
                </div>

                {(selectedOrder.trangThaiID === 66 || selectedOrder.trangThaiID === 71) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(selectedOrder.donNhapHangID)}
                    disabled={isDeleting}
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Xóa đơn nhập
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </SlideOver>

      {/* 7. SlideOver Thanh toán cho Nhà cung cấp */}
      <SlideOver
        open={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
        title="Thanh Toán Tiền Hàng Cho NCC"
        description="Ghi nhận phiếu chi / thanh toán giảm công nợ nhà cung cấp"
        maxWidth="md"
      >
        <form onSubmit={handleSubmitPayment} className="space-y-4 py-2">
          {selectedOrder && (
            <div className="p-3 rounded-lg border border-border bg-muted/30 text-xs space-y-1">
              <div>Đơn nhập: <strong className="font-mono">{selectedOrder.maDonNhap}</strong></div>
              <div>Nhà cung cấp: <strong>{selectedOrder.tenNhaCungCap}</strong></div>
              <div>
                Tổng nợ đơn:{" "}
                <strong className="text-rose-600 font-mono">
                  {formatCurrency(selectedOrder.conNo)}
                </strong>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Số tiền thanh toán (đ) <span className="text-rose-500">*</span>
            </label>
            <Input
              type="number"
              min={1}
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
              Phương thức thanh toán <span className="text-rose-500">*</span>
            </label>
            <SearchSelect
              options={paymentMethodOptions}
              value={dataPayment.PhuongTucThanhToanID}
              onChange={(val) =>
                setDataPayment((prev) => ({
                  ...prev,
                  PhuongTucThanhToanID: Number(val),
                }))
              }
              isLoading={isLoadingPaymentMethods}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Mã giao dịch / UNC ngân hàng
            </label>
            <Input
              type="text"
              placeholder="VD: UNC-TECH-20240101"
              value={dataPayment.MaGiaoDich}
              onChange={(e) =>
                setDataPayment((prev) => ({
                  ...prev,
                  MaGiaoDich: e.target.value,
                }))
              }
              className="text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Ghi chú thanh toán
            </label>
            <Textarea
              rows={2}
              value={dataPayment.GhiChu || ""}
              onChange={(e) =>
                setDataPayment((prev) => ({ ...prev, GhiChu: e.target.value }))
              }
              className="text-xs"
            />
          </div>

          <div className="pt-3 border-t border-border flex justify-end gap-2">
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
              {isPaying ? "Đang xử lý..." : "Xác nhận thanh toán"}
            </Button>
          </div>
        </form>
      </SlideOver>

      {/* 8. SlideOver Chuyển trạng thái đơn nhập */}
      <SlideOver
        open={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
        title="Chuyển Trạng Thái Đơn Nhập"
        description="Cập nhật tiến trình phê duyệt, chuẩn bị hàng hoặc hủy đơn"
        maxWidth="md"
      >
        <form onSubmit={handleSubmitStatusChange} className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Trạng thái mới <span className="text-rose-500">*</span>
            </label>
            <SearchSelect
              options={orderStatusOptions}
              value={dataStatusChange.TrangThaiID}
              onChange={(val) =>
                setDataStatusChange((prev) => ({
                  ...prev,
                  TrangThaiID: Number(val),
                }))
              }
              isLoading={isLoadingStatuses}
            />
          </div>

          {dataStatusChange.TrangThaiID === 70 && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
              <span className="font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                Xác nhận hoàn thành & Nhập kho thực tế
              </span>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
                Khi chuyển sang trạng thái <strong>Đã nhập kho / Hoàn thành</strong>, hệ thống sẽ tự động cập nhật tăng tồn kho thực tế và đơn hàng sẽ được chốt hoàn tất (không thể đổi lại trạng thái khác sau khi hoàn thành).
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Ghi chú lý do chuyển trạng thái
            </label>
            <Textarea
              rows={3}
              placeholder="VD: Phê duyệt đặt hàng từ hãng VinFast..."
              value={dataStatusChange.GhiChu || ""}
              onChange={(e) =>
                setDataStatusChange((prev) => ({
                  ...prev,
                  GhiChu: e.target.value,
                }))
              }
              className="text-xs"
            />
          </div>

          <div className="pt-3 border-t border-border flex justify-end gap-2">
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
              {isChangingStatus ? "Đang lưu..." : "Cập nhật trạng thái"}
            </Button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}

export default function PurchaseOrdersPage() {
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
      <PurchaseOrdersContent />
    </Suspense>
  );
}
