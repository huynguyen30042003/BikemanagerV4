"use client";

import React, { Suspense, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/input";
import { SearchSelect } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { WarehouseNavTabs } from "@/components/Common/WarehouseNavTabs";
import { usePhieuChuyenKho } from "@/hooks/PhieuChuyenKho/usePhieuChuyenKho";
import { useGetPhieuChuyenKhoKPI } from "@/hooks/PhieuChuyenKho/usePhieuChuyenKhoApi";
import {
  KHO_PhieuChuyenKho,
  KHO_ChiTietChuyenKho,
} from "@/types/phieuChuyenKho";
import {
  ArrowLeftRight,
  Plus,
  RefreshCw,
  Search,
  FolderOpen,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  Warehouse,
  Eye,
  Trash2,
  Calendar,
  AlertCircle,
  PackageCheck,
  Ban,
  ArrowRight,
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
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function StockTransfersContent() {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    khoFilter,
    setKhoFilter,
    statusFilter,
    setStatusFilter,
    searchInput,
    handleSearch,

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
    selectedPhieu,
    handleOpenDetail,
    handleXuatKho,
    isXuatKho,
    handleNhanHang,
    isNhanHang,
    handleHuyPhieu,
    isHuyPhieu,

    transferStatusOptions,
    getTransferStatusBadge,
    getTransferStatusLabel,
    isLoadingStatusList,
  } = usePhieuChuyenKho();

  const { data: transferKpi, isLoading: isLoadingKPI } =
    useGetPhieuChuyenKhoKPI();

  // Thống kê nhanh theo trạng thái động từ DM_DanhMucChiTiet
  const waitingCount = useMemo(
    () =>
      items.filter((i) => {
        const b = getTransferStatusBadge(i.trangThaiID);
        return (
          b.color === "amber" || i.trangThaiID === 22 || i.trangThaiID === 1
        );
      }).length,
    [items, getTransferStatusBadge],
  );
  const inTransitCount = useMemo(
    () =>
      items.filter((i) => {
        const b = getTransferStatusBadge(i.trangThaiID);
        return (
          b.color === "blue" || i.trangThaiID === 23 || i.trangThaiID === 2
        );
      }).length,
    [items, getTransferStatusBadge],
  );
  const completedCount = useMemo(
    () =>
      items.filter((i) => {
        const b = getTransferStatusBadge(i.trangThaiID);
        return (
          b.color === "emerald" || i.trangThaiID === 24 || i.trangThaiID === 3
        );
      }).length,
    [items, getTransferStatusBadge],
  );
  const canceledCount = useMemo(
    () => items.filter((i) => i.trangThaiID === 4).length,
    [items],
  );

  const columns: Column<KHO_PhieuChuyenKho>[] = [
    {
      key: "maPhieuChuyen",
      title: "Mã phiếu",
      classNameHeader:
        "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
          {v ? String(v).toUpperCase() : "—"}
        </span>
      ),
    },
    {
      key: "khoXuatID",
      title: "Tuyến điều chuyển (Kho xuất → Kho nhập)",
      classNameHeader:
        "min-w-[240px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex items-center gap-2 text-xs">
          <div className="flex flex-col">
            <span className="font-semibold text-foreground truncate max-w-[140px]">
              {row.tenKhoXuat || "Kho xuất"}
            </span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <div className="flex flex-col">
            <span className="font-semibold text-foreground truncate max-w-[140px]">
              {row.tenKhoNhap || "Kho nhập"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "tongSoLuong",
      title: "Số lượng & Trị giá",
      classNameHeader:
        "w-36 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-xs font-bold text-foreground">
            {row.tongSoLuong} xe / kiện
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            {formatCurrency(row.tongGiaTriVon)}
          </span>
        </div>
      ),
    },
    {
      key: "nguoiGiaoHang",
      title: "Vận chuyển",
      classNameHeader:
        "w-44 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
          {row.nguoiGiaoHang && (
            <div className="flex items-center gap-1">
              <Truck className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="text-foreground truncate">
                {row.nguoiGiaoHang}
              </span>
            </div>
          )}
          {row.bienSoXeVanChuyen && (
            <span className="font-mono text-[11px] pl-4">
              BS: {row.bienSoXeVanChuyen}
            </span>
          )}
          {!row.nguoiGiaoHang && !row.bienSoXeVanChuyen && (
            <span className="italic text-muted-foreground/60">—</span>
          )}
        </div>
      ),
    },
    {
      key: "ngayXuat",
      title: "Thời gian",
      classNameHeader:
        "w-36 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 text-[11px] text-muted-foreground">
          {row.ngayXuat && <span>Xuất: {formatDate(row.ngayXuat)}</span>}
          {row.ngayNhan && <span>Nhận: {formatDate(row.ngayNhan)}</span>}
          {!row.ngayXuat && !row.ngayNhan && <span>—</span>}
        </div>
      ),
    },
    {
      key: "trangThaiID",
      title: "Trạng thái",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => {
        const badge = getTransferStatusBadge(row.trangThaiID);
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
      classNameHeader:
        "w-24 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenDetail(row)}
            title="Xem chi tiết & Thao tác phiếu"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const hasActiveFilters = Boolean(
    searchInput || khoFilter || statusFilter !== null,
  );

  const handleResetFilters = () => {
    handleSearch("");
    setKhoFilter("");
    setStatusFilter(null);
    setPage(1);
  };

  return (
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-3 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 pb-2 sm:pb-4 border-b border-border/70 mb-2 sm:mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1">
                <span>Hệ thống</span>
                <span className="text-muted-foreground/30">/</span>
                <span>Vận hành & Kho</span>
                <span className="text-muted-foreground/30">/</span>
                <span className="text-foreground">Điều chuyển kho</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                  <ArrowLeftRight className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Điều Chuyển Kho Nội Bộ
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Quản lý phiếu luân chuyển xe và linh kiện giữa các kho tổng,
                    chi nhánh showroom và xưởng dịch vụ
                  </p>
                </div>
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
                <span className="text-xs">Tạo phiếu chuyển kho</span>
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="pt-2">
            <WarehouseNavTabs
              activeTab="transfers"
              totalTransfers={totalCount}
            />
          </div>
        </div>
      )}

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            title: "Tổng phiếu chuyển",
            value:
              transferKpi?.total_PhieuChuyenKho ??
              transferKpi?.totalPhieuChuyenKho ??
              totalCount,
            subtext: "Đã khởi tạo trong hệ thống",
            icon: ArrowLeftRight,
            color: "text-foreground",
            iconColor: "text-blue-600",
            bg: "bg-blue-500/10",
          },
          {
            title: "Chờ xuất kho",
            value:
              transferKpi?.total_ChoXuatKho ??
              transferKpi?.totalChoXuatKho ??
              waitingCount,
            subtext: "Chờ thủ kho xuất hàng",
            icon: Clock,
            color: "text-amber-600 dark:text-amber-400",
            iconColor: "text-amber-600",
            bg: "bg-amber-500/10",
          },
          {
            title: "Đang vận chuyển",
            value:
              transferKpi?.total_DangVanChuyen ??
              transferKpi?.totalDangVanChuyen ??
              inTransitCount,
            subtext: "Hàng đang đi trên đường",
            icon: Truck,
            color: "text-blue-600 dark:text-blue-400",
            iconColor: "text-blue-600",
            bg: "bg-blue-500/10",
          },
          {
            title: "Đã hoàn tất",
            value:
              transferKpi?.total_DaHoanTat ??
              transferKpi?.totalDaHoanTat ??
              completedCount,
            subtext: "Kho đích đã nhận đủ hàng",
            icon: CheckCircle2,
            color: "text-emerald-600 dark:text-emerald-400",
            iconColor: "text-emerald-600",
            bg: "bg-emerald-500/10",
          },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card
              key={idx}
              className="p-4 bg-card/60 backdrop-blur-sm border-border/80 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {card.title}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg ${card.bg} ${card.iconColor} flex items-center justify-center`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl font-bold mt-2 ${card.color}`}>
                {isLoadingKPI || isLoading ? (
                  <Skeleton className="h-7 w-12" />
                ) : (
                  card.value
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {card.subtext}
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
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm mã phiếu, người giao, biển số xe..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 h-9 text-xs bg-background/80"
              />
            </div>

            {/* Lọc theo kho */}
            <div className="w-full sm:w-60">
              <SearchSelect
                placeholder="Lọc theo kho hàng..."
                options={[{ value: "", label: "Tất cả kho" }, ...khoOptions]}
                value={khoFilter}
                onChange={(val) => {
                  setKhoFilter(val ? String(val) : "");
                  setPage(1);
                }}
                isLoading={isLoadingKhos}
              />
            </div>

            {/* Lọc theo trạng thái */}
            <div className="w-full sm:w-56">
              <SearchSelect
                placeholder="Tất cả trạng thái..."
                options={[
                  { value: "", label: "Tất cả trạng thái" },
                  ...transferStatusOptions.map((opt) => ({
                    value: String(opt.value),
                    label: opt.label,
                  })),
                ]}
                value={statusFilter !== null ? String(statusFilter) : ""}
                onChange={(val) => {
                  setStatusFilter(val ? Number(val) : null);
                  setPage(1);
                }}
                isLoading={isLoadingStatusList}
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

      {/* 4. Table */}
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
                  Không tìm thấy phiếu chuyển kho nào
                </p>
                <p className="text-xs text-muted-foreground max-w-sm mt-1">
                  Chưa có phiếu điều chuyển phù hợp với bộ lọc tìm kiếm.
                </p>
                <Button
                  size="sm"
                  onClick={handleOpenCreate}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-1" /> Tạo phiếu chuyển kho mới
                </Button>
              </div>
            ) : (
              <>
                <Table<KHO_PhieuChuyenKho>
                  data={items}
                  columns={columns}
                  showIndex
                  startIndex={(page - 1) * pageSize}
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/70 text-sm text-muted-foreground">
                  <div className="text-xs">
                    Trang <strong className="text-foreground">{page}</strong> /{" "}
                    {totalPages} (Tổng{" "}
                    <strong className="text-foreground">{totalCount}</strong>{" "}
                    phiếu chuyển)
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
                    <span className="text-xs px-1">
                      {page} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
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

      {/* 5. SlideOver Tạo phiếu chuyển kho mới */}
      <SlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Tạo Phiếu Điều Chuyển Kho Mới"
        description="Lập phiếu luân chuyển xe hoặc phụ tùng giữa 2 kho hàng trong mạng lưới"
        maxWidth="xl"
      >
        <div className="space-y-4 py-2">
          {/* Kho xuất & Kho nhập */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Kho xuất (Kho nguồn) <span className="text-rose-500">*</span>
              </label>
              <SearchSelect
                placeholder="Chọn kho xuất..."
                options={khoOptions}
                value={dataCreate.KhoXuatID}
                onChange={(val) =>
                  setDataCreate((prev) => ({
                    ...prev,
                    KhoXuatID: String(val || ""),
                  }))
                }
                isLoading={isLoadingKhos}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Kho nhập (Kho đích) <span className="text-rose-500">*</span>
              </label>
              <SearchSelect
                placeholder="Chọn kho nhập..."
                options={khoOptions}
                value={dataCreate.KhoNhapID}
                onChange={(val) =>
                  setDataCreate((prev) => ({
                    ...prev,
                    KhoNhapID: String(val || ""),
                  }))
                }
                isLoading={isLoadingKhos}
              />
            </div>
          </div>

          {/* Vận chuyển */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Người giao hàng / Tài xế
              </label>
              <Input
                placeholder="Họ tên tài xế hoặc đơn vị vận chuyển..."
                value={dataCreate.NguoiGiaoHang || ""}
                onChange={(e) =>
                  setDataCreate((prev) => ({
                    ...prev,
                    NguoiGiaoHang: e.target.value,
                  }))
                }
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Biển số xe vận chuyển
              </label>
              <Input
                placeholder="Ví dụ: 29C-999.88"
                value={dataCreate.BienSoXeVanChuyen || ""}
                onChange={(e) =>
                  setDataCreate((prev) => ({
                    ...prev,
                    BienSoXeVanChuyen: e.target.value,
                  }))
                }
                className="text-xs font-mono uppercase"
              />
            </div>
          </div>

          {/* Danh sách mặt hàng chuyển */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                Danh sách xe / mặt hàng chuyển
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddDetailRow}
                className="h-7 px-2.5 text-xs text-blue-600 dark:text-blue-400 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Thêm dòng
              </Button>
            </div>

            <div className="space-y-2">
              {dataCreate.ChiTiets.map((ct, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-border bg-muted/30 flex flex-col sm:flex-row gap-2.5 items-start sm:items-center"
                >
                  <div className="flex-1 w-full">
                    <SearchSelect
                      placeholder="Chọn sản phẩm / biến thể xe..."
                      options={variantOptions}
                      value={ct.BienTheSanPhamID}
                      onChange={(val) => {
                        const updated = [...dataCreate.ChiTiets];
                        updated[idx].BienTheSanPhamID = String(val || "");
                        setDataCreate((prev) => ({
                          ...prev,
                          ChiTiets: updated,
                        }));
                      }}
                      isLoading={isLoadingVariants}
                    />
                  </div>

                  <div className="w-28">
                    <Input
                      type="number"
                      min={1}
                      placeholder="Số lượng"
                      value={ct.SoLuongChuyen}
                      onChange={(e) => {
                        const updated = [...dataCreate.ChiTiets];
                        updated[idx].SoLuongChuyen =
                          parseInt(e.target.value) || 1;
                        setDataCreate((prev) => ({
                          ...prev,
                          ChiTiets: updated,
                        }));
                      }}
                      className="text-xs font-mono"
                    />
                  </div>

                  {dataCreate.ChiTiets.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleRemoveDetailRow(idx)}
                      className="text-rose-500 hover:text-rose-600 h-8 w-8 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Ghi chú điều chuyển
            </label>
            <textarea
              rows={2}
              placeholder="Lý do điều chuyển hoặc ghi chú thêm..."
              value={dataCreate.GhiChu || ""}
              onChange={(e) =>
                setDataCreate((prev) => ({ ...prev, GhiChu: e.target.value }))
              }
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenCreate(false)}
              className="cursor-pointer text-xs"
            >
              Hủy bỏ
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitCreate}
              disabled={isCreating}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer text-xs font-semibold"
            >
              {isCreating ? "Đang lưu..." : "Xác nhận tạo phiếu"}
            </Button>
          </div>
        </div>
      </SlideOver>

      {/* 6. SlideOver Chi tiết phiếu & Nghiệp vụ chuyển kho */}
      <SlideOver
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        title="Chi Tiết Phiếu Điều Chuyển Kho"
        description="Theo dõi tiến độ, danh sách mặt hàng và thực hiện nghiệp vụ xuất/nhập kho"
        maxWidth="xl"
      >
        <div className="space-y-4 py-2">
          {selectedPhieu && (
            <>
              {/* Header Card */}
              <div className="p-3.5 rounded-lg border border-border/80 bg-muted/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                    {selectedPhieu.maPhieuChuyen}
                  </span>
                  {(() => {
                    const badge = getTransferStatusBadge(
                      selectedPhieu.trangThaiID,
                    );
                    return (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}
                      >
                        {badge.label}
                      </span>
                    );
                  })()}
                </div>

                <div className="flex items-center gap-2 text-xs pt-1">
                  <span className="font-medium text-foreground">
                    {selectedPhieu.tenKhoXuat}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    {selectedPhieu.tenKhoNhap}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                  <span>Người giao: {selectedPhieu.nguoiGiaoHang || "—"}</span>
                  <span>
                    Biển số xe: {selectedPhieu.bienSoXeVanChuyen || "—"}
                  </span>
                  <span>Xuất: {formatDate(selectedPhieu.ngayXuat)}</span>
                  <span>Nhận: {formatDate(selectedPhieu.ngayNhan)}</span>
                </div>
              </div>

              {/* Danh sách mặt hàng trong phiếu */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-foreground">
                  Chi tiết mặt hàng luân chuyển
                </span>

                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                      <tr>
                        <th className="p-2 text-left font-semibold">
                          Sản phẩm / Biến thể
                        </th>
                        <th className="p-2 text-right font-semibold w-24">
                          SL xuất
                        </th>
                        <th className="p-2 text-right font-semibold w-24">
                          SL nhận
                        </th>
                        <th className="p-2 text-right font-semibold w-28">
                          Đơn giá vốn
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(selectedPhieu.chiTiets || []).map((ct, i) => (
                        <tr key={i}>
                          <td className="p-2">
                            <span className="font-medium text-foreground block">
                              {ct.tenBienThe || "Mặt hàng"}
                            </span>
                            {ct.maSerial && (
                              <span className="font-mono text-[10px] text-muted-foreground">
                                Serial: {ct.maSerial}
                              </span>
                            )}
                          </td>
                          <td className="p-2 text-right font-mono font-bold text-foreground">
                            {ct.soLuongChuyen}
                          </td>
                          <td className="p-2 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {ct.soLuongThucNhan ?? "—"}
                          </td>
                          <td className="p-2 text-right font-mono text-muted-foreground">
                            {formatCurrency(ct.donGiaVon)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Thao tác quy trình điều chuyển */}
              <div className="pt-4 border-t border-border flex flex-wrap justify-end gap-2">
                {selectedPhieu.trangThaiID === 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleHuyPhieu(selectedPhieu.phieuChuyenKhoID)
                      }
                      disabled={isHuyPhieu}
                      className="text-rose-600 hover:text-rose-700 border-rose-200 cursor-pointer text-xs"
                    >
                      <Ban className="w-3.5 h-3.5 mr-1" /> Hủy phiếu
                    </Button>

                    <Button
                      size="sm"
                      onClick={() =>
                        handleXuatKho(selectedPhieu.phieuChuyenKhoID)
                      }
                      disabled={isXuatKho}
                      className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer text-xs font-semibold"
                    >
                      <Truck className="w-3.5 h-3.5 mr-1" />
                      {isXuatKho ? "Đang xuất..." : "Duyệt xuất kho"}
                    </Button>
                  </>
                )}

                {selectedPhieu.trangThaiID === 2 && (
                  <Button
                    size="sm"
                    onClick={() => handleNhanHang(selectedPhieu)}
                    disabled={isNhanHang}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer text-xs font-semibold"
                  >
                    <PackageCheck className="w-3.5 h-3.5 mr-1" />
                    {isNhanHang ? "Đang xử lý..." : "Xác nhận nhận hàng"}
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenDetail(false)}
                  className="cursor-pointer text-xs"
                >
                  Đóng
                </Button>
              </div>
            </>
          )}
        </div>
      </SlideOver>
    </div>
  );
}

export default function StockTransfersPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 md:p-8 space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      }
    >
      <StockTransfersContent />
    </Suspense>
  );
}
