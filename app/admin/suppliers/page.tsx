"use client";

import React, { Suspense, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SearchSelect } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { PurchaseNavTabs } from "@/components/Common/PurchaseNavTabs";
import { useNhaCungCap } from "@/hooks/NhaCungCap/useNhaCungCap";
import { NH_NhaCungCap } from "@/types/nhaCungCap";
import {
  Truck,
  Plus,
  RefreshCw,
  Search,
  SquarePen,
  Trash2,
  FolderOpen,
  Filter,
  CheckCircle2,
  XCircle,
  Building2,
  Phone,
  Mail,
  CreditCard,
  MapPin,
  DollarSign,
  AlertCircle,
} from "lucide-react";

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

function SuppliersContent() {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    quocGiaFilter,
    setQuocGiaFilter,
    coCongNoFilter,
    setCoCongNoFilter,
    searchInput,
    handleSearch,

    countryOptions,
    isLoadingCountries,
    provinceOptions,
    isLoadingProvinces,
    communeOptionsAdd,
    communeOptionsUpdate,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    open,
    setOpen,
    dataAdd,
    setDataAdd,
    handleModalAdd,
    handleSubmitAdd,
    isCreating,

    openUpdate,
    setOpenUpdate,
    dataUpdate,
    setDataUpdate,
    handleOpenEdit,
    handleSubmitUpdate,
    isUpdating,

    openDelete,
    setOpenDelete,
    selectItemName,
    handleOpenDelete,
    handleSubmitDelete,
    isDeleting,

    errors,
  } = useNhaCungCap();

  // Thống kê nhanh
  const activeCount = useMemo(
    () => items.filter((i) => i.trangThai).length,
    [items]
  );
  const debtCount = useMemo(
    () => items.filter((i) => (i.congNoHienTai || 0) > 0).length,
    [items]
  );
  const totalDebt = useMemo(
    () => items.reduce((sum, i) => sum + (i.congNoHienTai || 0), 0),
    [items]
  );

  const columns: Column<NH_NhaCungCap>[] = [
    {
      key: "maNhaCungCap",
      title: "Mã NCC",
      classNameHeader: "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
          {String(v || "—")}
        </span>
      ),
    },
    {
      key: "tenNhaCungCap",
      title: "Nhà cung cấp & Liên hệ",
      classNameHeader: "min-w-[220px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 py-1">
          <span className="font-semibold text-foreground text-sm hover:text-blue-600 transition-colors">
            {row.tenNhaCungCap}
          </span>
          {row.nguoiLienHe && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              Người LH: <strong className="text-foreground">{row.nguoiLienHe}</strong>
            </span>
          )}
          {row.maSoThue && (
            <span className="text-[11px] text-muted-foreground font-mono">
              MST: {row.maSoThue}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "dienThoai",
      title: "Thông tin liên lạc",
      classNameHeader: "w-48 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
          {row.dienThoai && (
            <div className="flex items-center gap-1 text-foreground font-medium">
              <Phone className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>{row.dienThoai}</span>
            </div>
          )}
          {row.hopThu && (
            <div className="flex items-center gap-1 truncate max-w-[180px]">
              <Mail className="w-3 h-3 text-blue-500 shrink-0" />
              <span>{row.hopThu}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "diaChi",
      title: "Khu vực & Ngân hàng",
      classNameHeader: "min-w-[200px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
          {(row.diaChi || row.tenQuocGia) && (
            <div className="flex items-center gap-1 truncate" title={row.diaChi || ""}>
              <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
              <span>
                {row.tenQuocGia ? `[${row.tenQuocGia}] ` : ""}
                {row.diaChi || "Chưa có địa chỉ"}
              </span>
            </div>
          )}
          {row.soTaiKhoanNganHang && (
            <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
              <CreditCard className="w-3 h-3 text-purple-500 shrink-0" />
              <span>{row.soTaiKhoanNganHang} ({row.tenNganHang || "NH"})</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "congNoHienTai",
      title: "Công nợ phải trả",
      classNameHeader: "w-36 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right",
      render: (v) => {
        const debt = Number(v) || 0;
        return (
          <span
            className={`font-semibold font-mono text-xs ${
              debt > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {formatCurrency(debt)}
          </span>
        );
      },
    },
    {
      key: "trangThai",
      title: "Trạng thái",
      classNameHeader: "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
            v
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {v ? "Đang giao dịch" : "Tạm ngưng"}
        </span>
      ),
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader: "w-24 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleOpenEdit(row)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer"
            title="Chỉnh sửa thông tin"
          >
            <SquarePen className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleOpenDelete(row)}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
            title="Xóa nhà cung cấp"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  const hasActiveFilters =
    searchInput !== "" ||
    quocGiaFilter !== "" ||
    coCongNoFilter !== "all" ||
    statusFilter !== "all";

  const handleResetFilters = () => {
    handleSearch("");
    setQuocGiaFilter("");
    setCoCongNoFilter("all");
    setStatusFilter("all");
    setPage(1);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      {/* 1. Header & Navigation */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Nhà Cung Cấp & Đối Tác
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Quản lý hồ sơ nhà cung cấp xe điện, phụ tùng, pin và theo dõi công nợ nhập hàng
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
              onClick={handleModalAdd}
              className="h-9 px-4 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs">Thêm nhà cung cấp</span>
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="pt-2">
          <PurchaseNavTabs activeTab="suppliers" totalSuppliers={totalCount} />
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Tổng nhà cung cấp</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">
            {isLoading ? <Skeleton className="h-7 w-12" /> : totalCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Đã lưu trong hệ thống</p>
        </Card>

        <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Đang giao dịch</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            {isLoading ? <Skeleton className="h-7 w-12" /> : activeCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Hợp tác kinh doanh tích cực</p>
        </Card>

        <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Có công nợ</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">
            {isLoading ? <Skeleton className="h-7 w-12" /> : debtCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">NCC cần thanh toán đợt tới</p>
        </Card>

        <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Tổng nợ phải trả</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-2 truncate">
            {isLoading ? <Skeleton className="h-7 w-20" /> : formatCurrency(totalDebt)}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Công nợ toàn hệ thống</p>
        </Card>
      </div>

      {/* 3. Filter Bar */}
      <div className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-1 flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm mã NCC, tên nhà cung cấp, SĐT, MST, người LH..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 h-9 text-xs bg-background/80"
              />
            </div>

            {/* Lọc theo Quốc gia */}
            <div className="w-full sm:w-48">
              <SearchSelect
                placeholder="Tất cả quốc gia..."
                options={[{ value: "", label: "Tất cả quốc gia" }, ...countryOptions]}
                value={quocGiaFilter}
                onChange={(val) => {
                  setQuocGiaFilter(val ? String(val) : "");
                  setPage(1);
                }}
                isLoading={isLoadingCountries}
              />
            </div>

            {/* Lọc theo Công nợ */}
            <div className="w-full sm:w-44">
              <SearchSelect
                placeholder="Trạng thái nợ..."
                options={[
                  { value: "all", label: "Tất cả công nợ" },
                  { value: "hasDebt", label: "Có công nợ (>0)" },
                  { value: "noDebt", label: "Đã hết nợ (=0)" },
                ]}
                value={coCongNoFilter}
                onChange={(val) => {
                  setCoCongNoFilter(String(val) || "all");
                  setPage(1);
                }}
              />
            </div>

            {/* Lọc theo Trạng thái hoạt động */}
            <div className="w-full sm:w-44">
              <SearchSelect
                placeholder="Trạng thái..."
                options={[
                  { value: "all", label: "Tất cả trạng thái" },
                  { value: "active", label: "Đang giao dịch" },
                  { value: "inactive", label: "Tạm ngưng" },
                ]}
                value={statusFilter}
                onChange={(val) => {
                  setStatusFilter(String(val) || "all");
                  setPage(1);
                }}
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
                  Không tìm thấy nhà cung cấp nào
                </p>
                <p className="text-xs text-muted-foreground max-w-sm mt-1">
                  Chưa có nhà cung cấp phù hợp với bộ lọc tìm kiếm hiện tại.
                </p>
                <Button
                  size="sm"
                  onClick={handleModalAdd}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-1" /> Thêm nhà cung cấp mới
                </Button>
              </div>
            ) : (
              <>
                <Table<NH_NhaCungCap>
                  data={items}
                  columns={columns}
                  showIndex
                  startIndex={(page - 1) * pageSize}
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/70 text-sm text-muted-foreground">
                  <div className="text-xs">
                    Trang <strong className="text-foreground">{page}</strong> / {totalPages}{" "}
                    (Tổng <strong className="text-foreground">{totalCount}</strong> nhà cung cấp)
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

      {/* 5. SlideOver Thêm mới */}
      <SlideOver
        open={open}
        onClose={() => setOpen(false)}
        title="Thêm Nhà Cung Cấp Mới"
        description="Đăng ký hồ sơ đối tác, kênh nhập xe điện, pin hoặc phụ tùng"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitAdd} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Mã nhà cung cấp <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="VD: NCC-VINFAST (bỏ trống tự sinh)"
                value={dataAdd.MaNhaCungCap || ""}
                onChange={(e) =>
                  setDataAdd((prev) => ({ ...prev, MaNhaCungCap: e.target.value }))
                }
                className="text-xs font-mono"
              />
              {errors.maNhaCungCap && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.maNhaCungCap}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Tên nhà cung cấp <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="VD: Công ty TNHH VinFast Auto"
                value={dataAdd.TenNhaCungCap}
                onChange={(e) =>
                  setDataAdd((prev) => ({ ...prev, TenNhaCungCap: e.target.value }))
                }
                className={`text-xs ${errors.tenNhaCungCap ? "border-rose-500" : ""}`}
              />
              {errors.tenNhaCungCap && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.tenNhaCungCap}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Số điện thoại liên hệ <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="VD: 02431234567 hoặc 1900..."
                value={dataAdd.DienThoai}
                onChange={(e) =>
                  setDataAdd((prev) => ({ ...prev, DienThoai: e.target.value }))
                }
                className={`text-xs ${errors.dienThoai ? "border-rose-500" : ""}`}
              />
              {errors.dienThoai && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.dienThoai}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Hộp thư (Email)
              </label>
              <Input
                type="email"
                placeholder="VD: cskh@vinfast.vn"
                value={dataAdd.HopThu || ""}
                onChange={(e) =>
                  setDataAdd((prev) => ({ ...prev, HopThu: e.target.value }))
                }
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Người liên hệ / Đại diện
              </label>
              <Input
                type="text"
                placeholder="VD: Nguyễn Văn Phụ Trách"
                value={dataAdd.NguoiLienHe || ""}
                onChange={(e) =>
                  setDataAdd((prev) => ({ ...prev, NguoiLienHe: e.target.value }))
                }
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Mã số thuế
              </label>
              <Input
                type="text"
                placeholder="VD: 0108928374"
                value={dataAdd.MaSoThue || ""}
                onChange={(e) =>
                  setDataAdd((prev) => ({ ...prev, MaSoThue: e.target.value }))
                }
                className="text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Quốc gia
              </label>
              <SearchSelect
                options={countryOptions}
                value={dataAdd.QuocGiaID || 1}
                onChange={(val) =>
                  setDataAdd((prev) => ({ ...prev, QuocGiaID: Number(val) || 1 }))
                }
                isLoading={isLoadingCountries}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Tỉnh / Thành phố
              </label>
              <SearchSelect
                placeholder="Chọn tỉnh..."
                options={provinceOptions}
                value={dataAdd.TinhID || ""}
                onChange={(val) =>
                  setDataAdd((prev) => ({
                    ...prev,
                    TinhID: val ? Number(val) : null,
                    XaID: null,
                  }))
                }
                isLoading={isLoadingProvinces}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Phường / Xã
              </label>
              <SearchSelect
                placeholder="Chọn phường xã..."
                options={communeOptionsAdd}
                value={dataAdd.XaID || ""}
                onChange={(val) =>
                  setDataAdd((prev) => ({ ...prev, XaID: val ? Number(val) : null }))
                }
                disabled={!dataAdd.TinhID}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Địa chỉ chi tiết
            </label>
            <Input
              type="text"
              placeholder="VD: Tòa nhà VinFast, Khu đô thị Vinhomes Riverside"
              value={dataAdd.DiaChi || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, DiaChi: e.target.value }))
              }
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Số tài khoản ngân hàng
              </label>
              <Input
                type="text"
                placeholder="VD: 19034567890123"
                value={dataAdd.SoTaiKhoanNganHang || ""}
                onChange={(e) =>
                  setDataAdd((prev) => ({
                    ...prev,
                    SoTaiKhoanNganHang: e.target.value,
                  }))
                }
                className="text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Tên ngân hàng
              </label>
              <Input
                type="text"
                placeholder="VD: Techcombank - CN Hà Nội"
                value={dataAdd.TenNganHang || ""}
                onChange={(e) =>
                  setDataAdd((prev) => ({ ...prev, TenNganHang: e.target.value }))
                }
                className="text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Ghi chú hợp tác
            </label>
            <Textarea
              rows={2}
              placeholder="Nhập thông tin hợp đồng, điều khoản công nợ..."
              value={dataAdd.GhiChu || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, GhiChu: e.target.value }))
              }
              className="text-xs"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
            <div>
              <span className="text-xs font-semibold text-foreground block">
                Trạng thái hợp tác
              </span>
              <span className="text-[11px] text-muted-foreground">
                Cho phép tạo đơn đặt hàng và giao dịch với nhà cung cấp này
              </span>
            </div>
            <Switch
              checked={dataAdd.TrangThai ?? true}
              onCheckedChange={(checked) =>
                setDataAdd((prev) => ({ ...prev, TrangThai: checked }))
              }
            />
          </div>

          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
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
              {isCreating ? "Đang xử lý..." : "Lưu nhà cung cấp"}
            </Button>
          </div>
        </form>
      </SlideOver>

      {/* 6. SlideOver Cập nhật */}
      <SlideOver
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        title="Chỉnh Sửa Nhà Cung Cấp"
        description="Cập nhật thông tin đối tác và chi tiết liên hệ"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitUpdate} className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Tên nhà cung cấp <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              value={dataUpdate.TenNhaCungCap}
              onChange={(e) =>
                setDataUpdate((prev) => ({ ...prev, TenNhaCungCap: e.target.value }))
              }
              className={`text-xs ${errors.tenNhaCungCap ? "border-rose-500" : ""}`}
            />
            {errors.tenNhaCungCap && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.tenNhaCungCap}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Số điện thoại liên hệ <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                value={dataUpdate.DienThoai}
                onChange={(e) =>
                  setDataUpdate((prev) => ({ ...prev, DienThoai: e.target.value }))
                }
                className={`text-xs ${errors.dienThoai ? "border-rose-500" : ""}`}
              />
              {errors.dienThoai && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.dienThoai}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Hộp thư (Email)
              </label>
              <Input
                type="email"
                value={dataUpdate.HopThu || ""}
                onChange={(e) =>
                  setDataUpdate((prev) => ({ ...prev, HopThu: e.target.value }))
                }
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Người liên hệ
              </label>
              <Input
                type="text"
                value={dataUpdate.NguoiLienHe || ""}
                onChange={(e) =>
                  setDataUpdate((prev) => ({ ...prev, NguoiLienHe: e.target.value }))
                }
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Mã số thuế
              </label>
              <Input
                type="text"
                value={dataUpdate.MaSoThue || ""}
                onChange={(e) =>
                  setDataUpdate((prev) => ({ ...prev, MaSoThue: e.target.value }))
                }
                className="text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Quốc gia
              </label>
              <SearchSelect
                options={countryOptions}
                value={dataUpdate.QuocGiaID || 1}
                onChange={(val) =>
                  setDataUpdate((prev) => ({ ...prev, QuocGiaID: Number(val) || 1 }))
                }
                isLoading={isLoadingCountries}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Tỉnh / Thành phố
              </label>
              <SearchSelect
                placeholder="Chọn tỉnh..."
                options={provinceOptions}
                value={dataUpdate.TinhID || ""}
                onChange={(val) =>
                  setDataUpdate((prev) => ({
                    ...prev,
                    TinhID: val ? Number(val) : null,
                    XaID: null,
                  }))
                }
                isLoading={isLoadingProvinces}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Phường / Xã
              </label>
              <SearchSelect
                placeholder="Chọn phường xã..."
                options={communeOptionsUpdate}
                value={dataUpdate.XaID || ""}
                onChange={(val) =>
                  setDataUpdate((prev) => ({ ...prev, XaID: val ? Number(val) : null }))
                }
                disabled={!dataUpdate.TinhID}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Địa chỉ chi tiết
            </label>
            <Input
              type="text"
              value={dataUpdate.DiaChi || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({ ...prev, DiaChi: e.target.value }))
              }
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Số tài khoản ngân hàng
              </label>
              <Input
                type="text"
                value={dataUpdate.SoTaiKhoanNganHang || ""}
                onChange={(e) =>
                  setDataUpdate((prev) => ({
                    ...prev,
                    SoTaiKhoanNganHang: e.target.value,
                  }))
                }
                className="text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Tên ngân hàng
              </label>
              <Input
                type="text"
                value={dataUpdate.TenNganHang || ""}
                onChange={(e) =>
                  setDataUpdate((prev) => ({ ...prev, TenNganHang: e.target.value }))
                }
                className="text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Ghi chú hợp tác
            </label>
            <Textarea
              rows={2}
              value={dataUpdate.GhiChu || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({ ...prev, GhiChu: e.target.value }))
              }
              className="text-xs"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
            <div>
              <span className="text-xs font-semibold text-foreground block">
                Trạng thái hợp tác
              </span>
              <span className="text-[11px] text-muted-foreground">
                Đang kích hoạt giao dịch với nhà cung cấp
              </span>
            </div>
            <Switch
              checked={dataUpdate.TrangThai ?? true}
              onCheckedChange={(checked) =>
                setDataUpdate((prev) => ({ ...prev, TrangThai: checked }))
              }
            />
          </div>

          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpenUpdate(false)}
              className="text-xs cursor-pointer"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isUpdating}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs cursor-pointer font-medium"
            >
              {isUpdating ? "Đang lưu..." : "Cập nhật thay đổi"}
            </Button>
          </div>
        </form>
      </SlideOver>

      {/* 7. Confirm Modal Xóa */}
      <ConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleSubmitDelete}
        isLoading={isDeleting}
        title="Xóa Nhà Cung Cấp"
        description={`Bạn có chắc chắn muốn xóa đối tác "${selectItemName}"? Hành động này sẽ không thể khôi phục nếu đã xóa.`}
        confirmText="Xác nhận xóa"
        variant="danger"
      />
    </div>
  );
}

export default function SuppliersPage() {
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
      <SuppliersContent />
    </Suspense>
  );
}
