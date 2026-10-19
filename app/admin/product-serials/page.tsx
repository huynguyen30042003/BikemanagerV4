"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/input";
import { SearchSelect } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { ProductNavTabs } from "@/components/Common/ProductNavTabs";
import { useSoSerial } from "@/hooks/SoSerial/useSoSerial";
import { SP_SoSerial } from "@/types/soSerial";
import {
  Barcode,
  Plus,
  RefreshCw,
  Search,
  FolderOpen,
  Filter,
  CheckCircle2,
  AlertCircle,
  Package,
  BatteryCharging,
  Zap,
  ShieldCheck,
  ShieldAlert,
  ArrowRightLeft,
  Warehouse,
  Calendar,
  User,
  Car,
  QrCode,
  Tag,
  LayoutGrid,
  List,
  Copy,
  Check,
  Clock,
} from "lucide-react";

type ViewMode = "grid" | "table";

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "Chưa cập nhật";
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

function SerialsContent() {
  const searchParams = useSearchParams();
  const initialVariantId = searchParams.get("variantId") || undefined;

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    bienTheFilter,
    setBienTheFilter,
    searchInput,
    handleSearch,

    variantOptions,
    isLoadingVariants,
    customerOptions,
    isLoadingCustomers,

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

    openWarranty,
    setOpenWarranty,
    selectedSerial,
    dataWarranty,
    setDataWarranty,
    handleOpenWarranty,
    handleSubmitWarranty,
    isActivatingWarranty,

    openChangeStatus,
    setOpenChangeStatus,
    dataChangeStatus,
    setDataChangeStatus,
    handleOpenChangeStatus,
    handleSubmitChangeStatus,
    isChangingStatus,

    errors,

    serialStatusOptions,
    getSerialStatusBadge,
    getSerialStatusLabel,
    isLoadingSerialStatuses,
  } = useSoSerial(initialVariantId);

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const shouldReduceMotion = useReducedMotion();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Thống kê nhanh theo trạng thái động từ DM_DanhMucChiTiet
  const inStockCount = useMemo(
    () =>
      items.filter((i) => {
        const b = getSerialStatusBadge(i.trangThaiID);
        return (
          b.color === "emerald" || i.trangThaiID === 59 || i.trangThaiID === 1
        );
      }).length,
    [items, getSerialStatusBadge],
  );
  const soldCount = useMemo(
    () =>
      items.filter((i) => {
        const b = getSerialStatusBadge(i.trangThaiID);
        return (
          b.color === "blue" || i.trangThaiID === 61 || i.trangThaiID === 2
        );
      }).length,
    [items, getSerialStatusBadge],
  );
  const maintenanceCount = useMemo(
    () =>
      items.filter((i) => {
        const b = getSerialStatusBadge(i.trangThaiID);
        return (
          b.color === "purple" || i.trangThaiID === 62 || i.trangThaiID === 3
        );
      }).length,
    [items, getSerialStatusBadge],
  );
  const errorCount = useMemo(
    () =>
      items.filter((i) => {
        const b = getSerialStatusBadge(i.trangThaiID);
        return (
          b.color === "rose" || i.trangThaiID === 65 || i.trangThaiID === 5
        );
      }).length,
    [items, getSerialStatusBadge],
  );

  const columns: Column<SP_SoSerial>[] = [
    {
      key: "maSerial",
      title: "Mã Serial & Định danh",
      classNameHeader:
        "w-60 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
              {row.maSerial}
            </span>
            {row.maQR && (
              <span
                title={`Mã QR: ${row.maQR}`}
                className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/60"
              >
                <QrCode className="w-3 h-3" /> QR
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Calendar className="w-3 h-3 text-muted-foreground/60" />
            <span>SX: {formatDate(row.ngaySanXuat)}</span>
            {row.ngayNhap && (
              <>
                <span>•</span>
                <span>Nhập: {formatDate(row.ngayNhap)}</span>
              </>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "tenBienThe",
      title: "Sản phẩm / Biến thể",
      classNameHeader:
        "w-50 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-xs text-foreground line-clamp-1">
            {row.tenBienThe || "Biến thể chưa đặt tên"}
          </span>
          {row.tenSanPham && (
            <span className="text-[11px] text-muted-foreground line-clamp-1">
              Dòng: {row.tenSanPham}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "soKhung",
      title: "Số Khung / Máy / Pin",
      classNameHeader:
        "w-44 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-1 text-[11px]">
          {row.soKhung ? (
            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <span className="font-medium text-muted-foreground/80 w-12 shrink-0">
                Khung:
              </span>
              <span className="font-mono font-medium px-1.5 py-0.2 rounded bg-muted border border-border/50">
                {row.soKhung}
              </span>
            </div>
          ) : (
            <div className="text-muted-foreground/60 italic text-[11px]">
              Khung: Chưa cập nhật
            </div>
          )}

          {row.soMay ? (
            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <span className="font-medium text-muted-foreground/80 w-12 shrink-0 flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5 text-amber-500" /> Máy:
              </span>
              <span className="font-mono font-medium px-1.5 py-0.2 rounded bg-muted border border-border/50">
                {row.soMay}
              </span>
            </div>
          ) : null}

          {row.soPin ? (
            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <span className="font-medium text-muted-foreground/80 w-12 shrink-0 flex items-center gap-0.5">
                <BatteryCharging className="w-2.5 h-2.5 text-emerald-500" />{" "}
                Pin:
              </span>
              <span className="font-mono font-medium px-1.5 py-0.2 rounded bg-muted border border-border/50">
                {row.soPin}
              </span>
            </div>
          ) : null}
        </div>
      ),
    },
    {
      key: "trangThaiID",
      title: "Trạng thái",
      classNameHeader:
        "w-44 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => {
        const badge = getSerialStatusBadge(row.trangThaiID);
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
      key: "khachHangID",
      title: "Khách hàng & Biển số",
      classNameHeader:
        "w-56 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => {
        if (row.khachHangID || row.tenKhachHang) {
          return (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1 text-xs font-medium text-foreground">
                <User className="w-3 h-3 text-blue-500 shrink-0" />
                <span className="truncate">{row.tenKhachHang}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground pl-4">
                {row.dienThoaiKhachHang && (
                  <span>{row.dienThoaiKhachHang}</span>
                )}
                {row.bienSoXe && (
                  <span className="font-mono font-bold text-foreground px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
                    <Car className="w-2.5 h-2.5 inline mr-0.5" />
                    {row.bienSoXe}
                  </span>
                )}
              </div>
            </div>
          );
        }
        return (
          <span className="text-muted-foreground/60 italic text-xs">
            Chưa xuất bán
          </span>
        );
      },
    },
    {
      key: "ngayBatDauBaoHanh",
      title: "Bảo hành điện tử",
      classNameHeader:
        "w-44 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => {
        if (!row.ngayBatDauBaoHanh && !row.ngayKetThucBaoHanh) {
          return (
            <span className="text-muted-foreground/60 italic text-xs">
              Chưa kích hoạt
            </span>
          );
        }

        const isExpired =
          row.ngayKetThucBaoHanh &&
          new Date(row.ngayKetThucBaoHanh).getTime() < new Date().getTime();

        return (
          <div className="flex flex-col gap-0.5 text-[11px]">
            <div className="flex items-center gap-1">
              {isExpired ? (
                <span className="inline-flex items-center gap-0.5 text-rose-600 dark:text-rose-400 font-semibold">
                  <ShieldAlert className="w-3 h-3" /> Hết hạn
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3 h-3" /> Còn hạn
                </span>
              )}
            </div>
            <span className="text-muted-foreground">
              Đến: {formatDate(row.ngayKetThucBaoHanh)}
            </span>
          </div>
        );
      },
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader:
        "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenWarranty(row)}
            title="Kích hoạt / Cập nhật bảo hành điện tử"
            className="h-8 w-8 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenChangeStatus(row)}
            title="Chuyển trạng thái serial"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const hasActiveFilters = Boolean(
    searchInput || statusFilter !== null || bienTheFilter,
  );

  const handleResetFilters = () => {
    handleSearch("");
    setStatusFilter(null);
    setBienTheFilter("");
    setPage(1);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen space-y-6">
      {/* 1. Header */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
      ) : (
        <div className="flex flex-col gap-4 pb-4 border-b border-border/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1">
                <span>Hệ thống</span>
                <span className="text-muted-foreground/30">/</span>
                <span>Kinh doanh</span>
                <span className="text-muted-foreground/30">/</span>
                <span className="text-foreground">Số Serial & Khung Xe</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                  <Barcode className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Số Serial & Khung Máy Pin
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Quản lý định danh từng chiếc xe, số khung VIN, số động cơ,
                    khối pin & kích hoạt bảo hành điện tử
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
                onClick={handleModalAdd}
                className="h-9 px-4 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer font-medium active:scale-[0.98] transition-transform"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs font-medium">Đăng ký Serial mới</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <ProductNavTabs activeTab="serials" />
          </div>
        </div>
      )}

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <Card
          onClick={() => {
            setStatusFilter(null);
            setPage(1);
          }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === null
              ? "border-blue-500/50 bg-blue-500/5 shadow-xs ring-2 ring-blue-500/10"
              : "border-border/80 bg-card hover:border-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Tổng số Serial
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Barcode className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">
            {isLoading ? <Skeleton className="h-7 w-12" /> : totalCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Mã định danh đã cấp
          </p>
        </Card>

        <Card
          onClick={() => {
            setStatusFilter(59);
            setPage(1);
          }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 59 || statusFilter === 1
              ? "border-emerald-500/50 bg-emerald-500/5 shadow-xs ring-2 ring-emerald-500/10"
              : "border-border/80 bg-card hover:border-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Trong kho (Sẵn sàng)
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            {isLoading ? <Skeleton className="h-7 w-12" /> : inStockCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Sẵn sàng xuất bán
          </p>
        </Card>

        <Card
          onClick={() => {
            setStatusFilter(61);
            setPage(1);
          }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 61 || statusFilter === 2
              ? "border-blue-500/50 bg-blue-500/5 shadow-xs ring-2 ring-blue-500/10"
              : "border-border/80 bg-card hover:border-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Đã xuất bán
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            {isLoading ? <Skeleton className="h-7 w-12" /> : soldCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Khách hàng đang lưu hành
          </p>
        </Card>

        <Card className="p-4 rounded-xl border border-border/80 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Bảo hành / Xưởng
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">
            {isLoading ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              maintenanceCount + errorCount
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Đang sửa chữa hoặc lỗi
          </p>
        </Card>
      </div>

      {/* 3. Filter Bar */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-1 flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm mã serial, số khung, số máy, pin, biển số..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 pr-8 h-9.5 text-xs bg-background/80 focus-visible:ring-blue-500/20"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => handleSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground w-4 h-4 rounded-full flex items-center justify-center hover:bg-muted cursor-pointer transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Lọc theo Biến thể sản phẩm */}
            <div className="w-full sm:w-64">
              <SearchSelect
                placeholder="Tất cả dòng xe & biến thể"
                options={[
                  { value: "", label: "Tất cả dòng xe & biến thể" },
                  ...variantOptions,
                ]}
                value={bienTheFilter}
                onChange={(val) => {
                  setBienTheFilter(val ? String(val) : "");
                  setPage(1);
                }}
                isLoading={isLoadingVariants}
                className="h-9.5 text-xs"
              />
            </div>

            {/* Lọc theo Trạng thái */}
            <div className="w-full sm:w-56">
              <SearchSelect
                placeholder="Tất cả trạng thái"
                options={[
                  { value: "", label: "Tất cả trạng thái serial" },
                  ...serialStatusOptions.map((opt) => ({
                    value: String(opt.value),
                    label: opt.label,
                  })),
                ]}
                value={statusFilter !== null ? String(statusFilter) : ""}
                onChange={(val) => {
                  setStatusFilter(val ? Number(val) : null);
                  setPage(1);
                }}
                isLoading={isLoadingSerialStatuses}
                className="h-9.5 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-0.5 shrink-0 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Dạng lưới thẻ tài sản"
                className={`flex items-center justify-center w-8 h-8 rounded-md transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-background text-foreground shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                title="Dạng bảng chi tiết"
                className={`flex items-center justify-center w-8 h-8 rounded-md transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-background text-foreground shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-9 px-3 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 cursor-pointer shrink-0"
              >
                <Filter className="w-3.5 h-3.5 mr-1" />
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-1 border-t border-border/50 text-xs flex-wrap">
            <span className="text-muted-foreground font-medium">Đang lọc:</span>
            {searchInput && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                Từ khóa: &quot;{searchInput}&quot;
                <button
                  type="button"
                  onClick={() => handleSearch("")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}
            {bienTheFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                Biến thể đã chọn
                <button
                  type="button"
                  onClick={() => {
                    setBienTheFilter("");
                    setPage(1);
                  }}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}
            {statusFilter !== null && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                Trạng thái: {getSerialStatusLabel(statusFilter)}
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter(null);
                    setPage(1);
                  }}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* 4. Content (Grid or Table) */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card
              key={idx}
              className="p-4 rounded-xl border border-border/70 space-y-3"
            >
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-8 w-full" />
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-border/80 bg-card p-12 flex flex-col items-center justify-center text-center text-muted-foreground shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-border/50 shadow-2xs">
            <FolderOpen className="w-7 h-7 stroke-[1.5]" />
          </div>
          <p className="font-semibold text-base text-foreground">
            Không tìm thấy số Serial nào
          </p>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            Chưa có dữ liệu số serial phù hợp với bộ lọc tìm kiếm hiện tại.
          </p>
          <Button
            size="sm"
            onClick={handleModalAdd}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1" /> Đăng ký Serial mới
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        /* INVENTORY ASSET GRID VIEW */
        <div className="space-y-4">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {items.map((serial) => {
              const badge = getSerialStatusBadge(serial.trangThaiID);
              const isExpired =
                serial.ngayKetThucBaoHanh &&
                new Date(serial.ngayKetThucBaoHanh).getTime() <
                  new Date().getTime();

              return (
                <Card
                  key={serial.soSerialID}
                  className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs hover:shadow-md hover:border-border transition-all flex flex-col justify-between gap-3"
                >
                  {/* Top Header */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                          {serial.maSerial}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(serial.maSerial, serial.soSerialID)
                          }
                          title="Sao chép mã Serial"
                          className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
                        >
                          {copiedId === serial.soSerialID ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                        {serial.maQR && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/60">
                            <QrCode className="w-2.5 h-2.5" /> QR
                          </span>
                        )}
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {badge.label}
                      </span>
                    </div>

                    <h3
                      className="font-bold text-sm text-foreground line-clamp-1"
                      title={serial.tenBienThe}
                    >
                      {serial.tenBienThe || "Biến thể chưa đặt tên"}
                    </h3>
                    {serial.tenSanPham && (
                      <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                        Dòng xe: {serial.tenSanPham}
                      </p>
                    )}
                  </div>

                  {/* Hardware Specs Grid */}
                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-[11px]">
                        Số khung (VIN):
                      </span>
                      <span className="font-mono font-medium text-foreground">
                        {serial.soKhung || "Chưa cập nhật"}
                      </span>
                    </div>

                    {serial.soMay && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-500" /> Số máy:
                        </span>
                        <span className="font-mono font-medium text-foreground">
                          {serial.soMay}
                        </span>
                      </div>
                    )}

                    {serial.soPin && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                          <BatteryCharging className="w-3 h-3 text-emerald-500" />{" "}
                          Serial Pin:
                        </span>
                        <span className="font-mono font-medium text-foreground">
                          {serial.soPin}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                      <span>SX: {formatDate(serial.ngaySanXuat)}</span>
                      {serial.viTriLuuTru && (
                        <span className="flex items-center gap-1">
                          <Warehouse className="w-3 h-3 text-muted-foreground/70" />
                          {serial.viTriLuuTru}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Customer & Warranty Info */}
                  <div className="text-xs space-y-1 pt-1">
                    {serial.khachHangID || serial.tenKhachHang ? (
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1 font-medium text-foreground truncate max-w-[60%]">
                          <User className="w-3 h-3 text-blue-500 shrink-0" />
                          <span className="truncate">
                            {serial.tenKhachHang}
                          </span>
                        </div>
                        {serial.bienSoXe && (
                          <span className="font-mono font-bold text-amber-700 dark:text-amber-400 px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20">
                            <Car className="w-2.5 h-2.5 inline mr-0.5" />
                            {serial.bienSoXe}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-[11px] text-muted-foreground/70 italic">
                        Chưa xuất bán cho khách
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Bảo hành:</span>
                      {serial.ngayKetThucBaoHanh ? (
                        isExpired ? (
                          <span className="text-rose-600 dark:text-rose-400 font-medium flex items-center gap-0.5">
                            <ShieldAlert className="w-3 h-3" /> Hết hạn (
                            {formatDate(serial.ngayKetThucBaoHanh)})
                          </span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" /> Đến{" "}
                            {formatDate(serial.ngayKetThucBaoHanh)}
                          </span>
                        )
                      ) : (
                        <span className="italic">Chưa kích hoạt</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 pt-2 border-t border-border/50">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenWarranty(serial)}
                      className="flex-1 h-8 text-xs flex items-center justify-center gap-1 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer shadow-2xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Bảo hành</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenChangeStatus(serial)}
                      className="flex-1 h-8 text-xs flex items-center justify-center gap-1 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer shadow-2xs"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
                      <span>Trạng thái</span>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </motion.div>

          {/* Pagination */}
          <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <div>
              Trang <strong className="text-foreground">{page}</strong> /{" "}
              {totalPages} (Tổng{" "}
              <strong className="text-foreground">{totalCount}</strong> số
              serial)
            </div>

            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap">Hiển thị:</span>
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
                className="w-22 h-8 text-xs"
              />

              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="h-8 text-xs cursor-pointer"
              >
                Trước
              </Button>

              <span className="font-mono px-1">
                {page} / {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                className="h-8 text-xs cursor-pointer"
              >
                Sau
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
          <div className="p-3 flex flex-col gap-3 w-full">
            <Table<SP_SoSerial>
              data={items}
              columns={columns}
              showIndex
              startIndex={(page - 1) * pageSize}
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/70 text-sm text-muted-foreground">
              <div className="text-xs">
                Trang <strong className="text-foreground">{page}</strong> /{" "}
                {totalPages} (Tổng{" "}
                <strong className="text-foreground">{totalCount}</strong> số
                serial)
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs whitespace-nowrap">Hiển thị:</span>
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
                  className="w-22 h-8 text-xs"
                />

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="h-8 text-xs cursor-pointer"
                >
                  Trước
                </Button>

                <span className="text-xs font-mono px-1">
                  {page} / {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  className="h-8 text-xs cursor-pointer"
                >
                  Sau
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. SlideOver Đăng ký Serial mới */}
      <SlideOver
        open={open}
        onClose={() => setOpen(false)}
        title="Đăng ký Số Serial & Khung Xe"
        description="Khai báo mã serial, số khung VIN, số động cơ và khối pin để quản lý định danh tài sản"
        maxWidth="lg"
      >
        <div className="space-y-4 py-2">
          {/* Biến thể sản phẩm */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Dòng xe / Biến thể sản phẩm{" "}
              <span className="text-rose-500">*</span>
            </label>
            <SearchSelect
              placeholder="Chọn biến thể xe hoặc phụ tùng"
              options={variantOptions}
              value={dataAdd.BienTheSanPhamID}
              onChange={(val) =>
                setDataAdd((prev) => ({
                  ...prev,
                  BienTheSanPhamID: String(val || ""),
                }))
              }
              isLoading={isLoadingVariants}
            />
            {errors.bienTheSanPhamID && (
              <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.bienTheSanPhamID}
              </p>
            )}
          </div>

          {/* Mã Serial tem dán */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Mã Serial tem dán / Barcode{" "}
              <span className="text-rose-500">*</span>
            </label>
            <Input
              placeholder="Ví dụ: SR-VIN-2026-8890"
              value={dataAdd.MaSerial}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, MaSerial: e.target.value }))
              }
              className="text-xs font-mono"
            />
            {errors.maSerial && (
              <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.maSerial}
              </p>
            )}
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Mã barcode dán tem trên thân xe hoặc bao bì linh kiện
            </p>
          </div>

          {/* Định danh xe: Số khung, máy, pin */}
          <div className="p-3.5 rounded-lg border border-border/80 bg-muted/40 space-y-3">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-blue-500" />
              Định danh xe máy điện / Phương tiện
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Số khung (Số VIN)
                </label>
                <Input
                  placeholder="Ví dụ: RL4HF0500... (17 ký tự)"
                  value={dataAdd.SoKhung || ""}
                  onChange={(e) =>
                    setDataAdd((prev) => ({ ...prev, SoKhung: e.target.value }))
                  }
                  className="text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" /> Số máy / Động cơ
                </label>
                <Input
                  placeholder="Ví dụ: EM-1500W-2026-X"
                  value={dataAdd.SoMay || ""}
                  onChange={(e) =>
                    setDataAdd((prev) => ({ ...prev, SoMay: e.target.value }))
                  }
                  className="text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1 flex items-center gap-1">
                <BatteryCharging className="w-3 h-3 text-emerald-500" /> Số
                Serial khối Pin
              </label>
              <Input
                placeholder="Ví dụ: BAT-LFP-72V30AH-889"
                value={dataAdd.SoPin || ""}
                onChange={(e) =>
                  setDataAdd((prev) => ({ ...prev, SoPin: e.target.value }))
                }
                className="text-xs font-mono"
              />
            </div>
          </div>

          {/* Vị trí lưu kho & Ngày sản xuất */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Vị trí lưu kho / Kệ hàng
              </label>
              <Input
                placeholder="Ví dụ: Kệ A1 - Tầng 2"
                value={dataAdd.ViTriLuuTru || ""}
                onChange={(e) =>
                  setDataAdd((prev) => ({
                    ...prev,
                    ViTriLuuTru: e.target.value,
                  }))
                }
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Ngày sản xuất
              </label>
              <Input
                type="date"
                value={dataAdd.NgaySanXuat || ""}
                onChange={(e) =>
                  setDataAdd((prev) => ({
                    ...prev,
                    NgaySanXuat: e.target.value,
                  }))
                }
                className="text-xs"
              />
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Ghi chú nội bộ
            </label>
            <textarea
              rows={2}
              placeholder="Thông tin thêm về nguồn gốc lô hàng hoặc kiểm định..."
              value={dataAdd.GhiChu || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, GhiChu: e.target.value }))
              }
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              className="cursor-pointer text-xs"
            >
              Hủy bỏ
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitAdd}
              disabled={isCreating}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer text-xs font-semibold"
            >
              {isCreating ? "Đang lưu..." : "Xác nhận tạo Serial"}
            </Button>
          </div>
        </div>
      </SlideOver>

      {/* 6. SlideOver Kích hoạt bảo hành điện tử */}
      <SlideOver
        open={openWarranty}
        onClose={() => setOpenWarranty(false)}
        title="Kích hoạt Bảo hành Điện tử"
        description="Gán chủ sở hữu phương tiện, cập nhật biển số xe và kích hoạt bảo hành theo quy định"
        maxWidth="md"
      >
        <div className="space-y-4 py-2">
          {/* Card Serial đang chọn */}
          {selectedSerial && (
            <div className="p-3.5 rounded-lg border border-blue-500/30 bg-blue-500/5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
                  {selectedSerial.maSerial}
                </span>
                {(() => {
                  const badge = getSerialStatusBadge(
                    selectedSerial.trangThaiID,
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
              <p className="text-xs font-semibold text-foreground">
                {selectedSerial.tenBienThe}
              </p>
              {selectedSerial.soKhung && (
                <p className="text-[11px] text-muted-foreground font-mono">
                  Số khung: {selectedSerial.soKhung}
                </p>
              )}
            </div>
          )}

          {/* Chọn Khách hàng */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Chủ sở hữu / Khách hàng mua xe{" "}
              <span className="text-rose-500">*</span>
            </label>
            <SearchSelect
              placeholder="Chọn khách hàng theo họ tên & SĐT"
              options={customerOptions}
              value={dataWarranty.KhachHangID}
              onChange={(val) =>
                setDataWarranty((prev) => ({
                  ...prev,
                  KhachHangID: String(val || ""),
                }))
              }
              isLoading={isLoadingCustomers}
            />
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Tra cứu hồ sơ khách hàng đã đăng ký trong hệ thống
            </p>
          </div>

          {/* Biển số xe */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Biển số xe đăng ký (nếu có)
            </label>
            <Input
              placeholder="Ví dụ: 29-MD1 889.33"
              value={dataWarranty.BienSoXe || ""}
              onChange={(e) =>
                setDataWarranty((prev) => ({
                  ...prev,
                  BienSoXe: e.target.value,
                }))
              }
              className="text-xs font-mono font-bold uppercase"
            />
          </div>

          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-800 dark:text-emerald-300">
            <p className="font-semibold flex items-center gap-1 mb-0.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Kích hoạt hệ thống
            </p>
            Khi bấm xác nhận, trạng thái thiết bị sẽ tự động chuyển thành{" "}
            <strong>Đã xuất bán</strong> và hệ thống sẽ bắt đầu tính thời hạn
            bảo hành điện tử.
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenWarranty(false)}
              className="cursor-pointer text-xs"
            >
              Hủy bỏ
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitWarranty}
              disabled={isActivatingWarranty}
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer text-xs font-semibold"
            >
              {isActivatingWarranty
                ? "Đang kích hoạt..."
                : "Kích hoạt bảo hành"}
            </Button>
          </div>
        </div>
      </SlideOver>

      {/* 7. SlideOver Chuyển trạng thái thiết bị */}
      <SlideOver
        open={openChangeStatus}
        onClose={() => setOpenChangeStatus(false)}
        title="Chuyển Trạng thái Thiết bị"
        description="Điều chuyển tình trạng vận hành của số serial trong chuỗi cung ứng và bảo dưỡng"
        maxWidth="md"
      >
        <div className="space-y-4 py-2">
          {/* Card Serial đang chọn */}
          {selectedSerial && (
            <div className="p-3 rounded-lg border border-border bg-muted/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground">
                  {selectedSerial.maSerial}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Hiện tại: {getSerialStatusLabel(selectedSerial.trangThaiID)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedSerial.tenBienThe}
              </p>
            </div>
          )}

          {/* Chọn trạng thái mới */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Trạng thái mới <span className="text-rose-500">*</span>
            </label>
            <SearchSelect
              placeholder="Chọn trạng thái thiết bị"
              options={serialStatusOptions}
              value={
                dataChangeStatus.TrangThaiID ||
                (serialStatusOptions[0]?.value ?? 0)
              }
              onChange={(val) =>
                setDataChangeStatus((prev) => ({
                  ...prev,
                  TrangThaiID: Number(val),
                }))
              }
              isLoading={isLoadingSerialStatuses}
            />
          </div>

          {/* Lý do / Ghi chú */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Lý do chuyển trạng thái / Ghi chú
            </label>
            <textarea
              rows={3}
              placeholder="Ghi rõ lý do tiếp nhận bảo dưỡng, hoàn hàng, hoặc lỗi linh kiện..."
              value={dataChangeStatus.GhiChu || ""}
              onChange={(e) =>
                setDataChangeStatus((prev) => ({
                  ...prev,
                  GhiChu: e.target.value,
                }))
              }
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenChangeStatus(false)}
              className="cursor-pointer text-xs"
            >
              Hủy bỏ
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitChangeStatus}
              disabled={isChangingStatus}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer text-xs font-semibold"
            >
              {isChangingStatus ? "Đang xử lý..." : "Cập nhật trạng thái"}
            </Button>
          </div>
        </div>
      </SlideOver>
    </div>
  );
}

export default function ProductSerialsPage() {
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
      <SerialsContent />
    </Suspense>
  );
}
