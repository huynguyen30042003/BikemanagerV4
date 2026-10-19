"use client";

import React, { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SearchSelect } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { CustomerNavTabs } from "@/components/Common/CustomerNavTabs";
import { usePhuongTienKhachHang } from "@/hooks/PhuongTienKhachHang/usePhuongTienKhachHang";
import { KH_PhuongTienKhachHang } from "@/types/phuongTienKhachHang";
import {
  Bike,
  Plus,
  RefreshCw,
  Search,
  SquarePen,
  Trash2,
  FolderOpen,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BatteryCharging,
  Gauge,
  History,
  Tag,
  User,
} from "lucide-react";

function VehiclesContent() {
  const searchParams = useSearchParams();
  const initialKhachHangId = searchParams.get("khachHangId") || undefined;

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    khachHangFilter,
    setKhachHangFilter,
    searchInput,
    handleSearch,

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
    handleSubmit,
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
  } = usePhuongTienKhachHang(initialKhachHangId);

  // Metrics
  const activeCount = useMemo(
    () => items.filter((i) => i.trangThai === true).length,
    [items],
  );
  const inactiveCount = useMemo(
    () => items.filter((i) => i.trangThai === false).length,
    [items],
  );

  const avgKm = useMemo(() => {
    if (items.length === 0) return 0;
    const sum = items.reduce((acc, cur) => acc + (cur.soKmHienTai || 0), 0);
    return Math.round(sum / items.length);
  }, [items]);

  const columns: Column<KH_PhuongTienKhachHang>[] = [
    {
      key: "bienSo",
      title: "Biển số xe",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <div className="flex justify-center">
          <div className="inline-flex flex-col items-center justify-center px-2.5 py-1 rounded-md bg-amber-500/10 border-2 border-amber-500/30 text-amber-900 dark:text-amber-200 shadow-2xs font-mono font-bold tracking-wider text-xs">
            {v ? String(v).toUpperCase() : "CHƯA ĐĂNG KÝ"}
          </div>
        </div>
      ),
    },
    {
      key: "tenModel",
      title: "Dòng xe & Model",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex items-center gap-3 py-1">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/20">
            <Bike className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm hover:text-blue-600 transition-colors">
              {row.tenModel}
            </span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {row.mauSac && <span>Màu: {row.mauSac}</span>}
              {row.soPin && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  <BatteryCharging className="w-3 h-3" />
                  {row.soPin}
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "khachHangID",
      title: "Chủ sở hữu",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 text-xs py-1">
          <span className="font-medium text-foreground hover:text-blue-600">
            {row.tenKhachHang || "Khách #" + row.khachHangID.substring(0, 8)}
          </span>
          {row.dienThoaiKhachHang && (
            <span className="font-mono text-muted-foreground text-[11px]">
              {row.dienThoaiKhachHang}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "soKmHienTai",
      title: "Số Km (ODO)",
      classNameHeader:
        "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <div className="flex items-center justify-center gap-1 font-mono text-xs font-semibold text-foreground">
          <Gauge className="w-3.5 h-3.5 text-muted-foreground" />
          <span>{v != null ? Number(v).toLocaleString("vi-VN") : 0} km</span>
        </div>
      ),
    },
    {
      key: "soKhung",
      title: "Số Khung / Máy",
      classNameHeader:
        "w-40 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex flex-col text-[11px] font-mono text-muted-foreground">
          {row.soKhung && <span>Khung: {row.soKhung}</span>}
          {row.soMay && <span>Máy: {row.soMay}</span>}
          {!row.soKhung && !row.soMay && <span>—</span>}
        </div>
      ),
    },
    {
      key: "trangThai",
      title: "Trạng thái",
      classNameHeader:
        "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) =>
        v ? (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sử dụng
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Đã bán/Hỏng
            </span>
          </div>
        ),
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader:
        "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Link
            href={`/admin/customer/ownerships?vehicleId=${row.id}`}
            title="Lịch sử sở hữu & Sang tên xe"
            className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <History className="w-4 h-4" />
          </Link>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenEdit(row)}
            title="Chỉnh sửa xe"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <SquarePen className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenDelete(row)}
            title="Xóa phương tiện"
            className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const hasActiveFilters = Boolean(
    searchInput || statusFilter !== "all" || khachHangFilter,
  );

  const handleResetFilters = () => {
    handleSearch("");
    setStatusFilter("all");
    setKhachHangFilter("");
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
                <span className="text-foreground">Phương tiện của khách</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Phương tiện của Khách hàng
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Quản lý hồ sơ xe cộ, biển số, số khung số máy, số pin và
                    đồng hồ ODO bảo hành bảo dưỡng
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
                className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs font-medium">Thêm xe mới</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <CustomerNavTabs activeTab="vehicles" totalVehicles={totalCount} />
          </div>
        </div>
      )}

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <Card
          onClick={() => {
            setStatusFilter("all");
            setPage(1);
          }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === "all"
              ? "border-blue-500/50 bg-blue-500/5 shadow-xs ring-2 ring-blue-500/10"
              : "border-border/80 bg-card hover:border-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Tổng số phương tiện
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">
            {isLoading ? <Skeleton className="h-7 w-16" /> : totalCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Đăng ký thuộc các khách hàng
          </p>
        </Card>

        <Card
          onClick={() => {
            setStatusFilter("active");
            setPage(1);
          }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === "active"
              ? "border-emerald-500/50 bg-emerald-500/5 shadow-xs ring-2 ring-emerald-500/10"
              : "border-border/80 bg-card hover:border-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Đang sử dụng
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {isLoading ? <Skeleton className="h-7 w-16" /> : activeCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Sẵn sàng mang vào sửa chữa
          </p>
        </Card>

        <Card
          onClick={() => {
            setStatusFilter("inactive");
            setPage(1);
          }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === "inactive"
              ? "border-slate-500/50 bg-slate-500/5 shadow-xs ring-2 ring-slate-500/10"
              : "border-border/80 bg-card hover:border-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Đã chuyển nhượng / Hỏng
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-500/10 text-slate-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-700 dark:text-slate-300">
            {isLoading ? <Skeleton className="h-7 w-16" /> : inactiveCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Ngưng hoạt động hoặc đã đổi chủ
          </p>
        </Card>

        <Card className="p-4 rounded-xl border border-border/80 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Trung bình ODO
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-mono">
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              `${avgKm.toLocaleString()} km`
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Quãng đường lăn bánh trung bình
          </p>
        </Card>
      </div>

      {/* 3. Toolbar */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Tìm theo biển số xe, tên model, số khung hoặc số pin..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 pr-8 h-9.5 w-full bg-background/80 text-sm focus-visible:ring-blue-500/20"
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

          <div className="flex items-center gap-2 flex-wrap">
            {/* Lọc theo khách hàng */}
            <div className="w-56">
              <SearchSelect
                options={[
                  { value: "", label: "Tất cả chủ sở hữu" },
                  ...customerOptions,
                ]}
                value={khachHangFilter}
                onChange={(val) => {
                  setKhachHangFilter(String(val));
                  setPage(1);
                }}
                placeholder="Chọn chủ sở hữu"
                isLoading={isLoadingCustomers}
                className="h-9.5 text-xs"
              />
            </div>

            {/* Trạng thái filter */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0">
              <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1 mr-0.5" />
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("all");
                  setPage(1);
                }}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-background shadow-xs text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("active");
                  setPage(1);
                }}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  statusFilter === "active"
                    ? "bg-background shadow-xs text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Đang sử dụng
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("inactive");
                  setPage(1);
                }}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  statusFilter === "inactive"
                    ? "bg-background shadow-xs text-slate-700 dark:text-slate-300 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Đã bán/Hỏng
              </button>
            </div>
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
            {khachHangFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                Chủ xe ID: {khachHangFilter.substring(0, 8)}...
                <button
                  type="button"
                  onClick={() => setKhachHangFilter("")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer ml-auto"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
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
        <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
          <div className="p-3 flex flex-col gap-3 w-full">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-border/50 shadow-2xs">
                  <FolderOpen className="w-7 h-7 stroke-[1.5]" />
                </div>
                <p className="font-semibold text-base text-foreground">
                  Không tìm thấy phương tiện nào
                </p>
                <p className="text-xs text-muted-foreground max-w-sm mt-1">
                  {searchInput
                    ? "Không có xe nào khớp với từ khóa tìm kiếm."
                    : "Chưa có phương tiện nào được liên kết với khách hàng. Hãy thêm mới ngay!"}
                </p>
                <Button
                  size="sm"
                  onClick={handleModalAdd}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-1" /> Thêm xe mới
                </Button>
              </div>
            ) : (
              <>
                <Table<KH_PhuongTienKhachHang>
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
                    phương tiện)
                  </div>

                  <div className="flex items-center gap-1.5">
                    <SearchSelect
                      options={[
                        { value: 10, label: "10" },
                        { value: 20, label: "20" },
                        { value: 50, label: "50" },
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
              </>
            )}
          </div>
        </div>
      )}

      {/* 5. SlideOver: THÊM XE MỚI */}
      <SlideOver
        open={open}
        onClose={() => setOpen(false)}
        title="Đăng ký Phương tiện Mới"
        description="Ghi nhận phương tiện xe của khách hàng vào hệ thống bảo dưỡng"
        icon={Bike}
        footer={
          <>
            <Button
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={() => setOpen(false)}
              disabled={isCreating}
            >
              Hủy
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              onClick={handleSubmit}
              disabled={isCreating}
            >
              {isCreating ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
              ) : null}
              Lưu phương tiện
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-3.5">
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Khách hàng chủ sở hữu <span className="text-red-500">*</span>
            </label>
            <SearchSelect
              options={customerOptions}
              value={dataAdd.KhachHangID}
              onChange={(val) =>
                setDataAdd((prev) => ({ ...prev, KhachHangID: String(val) }))
              }
              placeholder="Chọn khách hàng sở hữu"
              isLoading={isLoadingCustomers}
              className={errors.khachHangID ? "border-red-500" : ""}
            />
            {errors.khachHangID && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.khachHangID}
              </p>
            )}
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Dòng xe / Model <span className="text-red-500">*</span>
            </label>
            <Input
              value={dataAdd.TenModel}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, TenModel: e.target.value }))
              }
              placeholder="Ví dụ: VinFast Feliz S, Klara..."
              className={`rounded-lg ${errors.tenModel ? "border-red-500" : ""}`}
            />
            {errors.tenModel && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.tenModel}
              </p>
            )}
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Biển số xe <span className="text-red-500">*</span>
            </label>
            <Input
              value={dataAdd.BienSo}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  BienSo: e.target.value.toUpperCase(),
                }))
              }
              placeholder="Ví dụ: 29A1-123.45"
              className={`font-mono uppercase rounded-lg ${errors.bienSo ? "border-red-500" : ""}`}
            />
            {errors.bienSo && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.bienSo}
              </p>
            )}
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Màu sắc
            </label>
            <Input
              value={dataAdd.MauSac || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, MauSac: e.target.value }))
              }
              placeholder="Đen nhám, Trắng, Đỏ..."
              className="rounded-lg"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Số Km hiện tại (ODO)
            </label>
            <Input
              type="number"
              min={0}
              value={dataAdd.SoKmHienTai || 0}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  SoKmHienTai: parseInt(e.target.value) || 0,
                }))
              }
              className="font-mono rounded-lg"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Số khung
            </label>
            <Input
              value={dataAdd.SoKhung || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  SoKhung: e.target.value.toUpperCase(),
                }))
              }
              placeholder="VF12345678..."
              className="font-mono uppercase rounded-lg"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Số máy
            </label>
            <Input
              value={dataAdd.SoMay || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  SoMay: e.target.value.toUpperCase(),
                }))
              }
              placeholder="ENG123456..."
              className="font-mono uppercase rounded-lg"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
              Mã Serial Pin (Dành cho xe máy điện)
            </label>
            <Input
              value={dataAdd.SoPin || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  SoPin: e.target.value.toUpperCase(),
                }))
              }
              placeholder="PIN-LFP-019283..."
              className="font-mono uppercase rounded-lg"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Ghi chú
            </label>
            <Input
              value={dataAdd.GhiChu || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, GhiChu: e.target.value }))
              }
              placeholder="Tình trạng xe khi tiếp nhận..."
              className="rounded-lg"
            />
          </div>

          <div className="col-span-2 flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/20">
            <div>
              <p className="text-sm font-medium text-foreground">
                Trạng thái xe
              </p>
              <p className="text-xs text-muted-foreground">
                Xe đang được khách hàng sở hữu & sử dụng bình thường
              </p>
            </div>
            <Switch
              id="isActivePhuongTienAdd"
              checked={dataAdd.TrangThai}
              onCheckedChange={(checked) =>
                setDataAdd((prev) => ({ ...prev, TrangThai: checked }))
              }
            />
          </div>
        </div>
      </SlideOver>

      {/* 6. SlideOver: CẬP NHẬT XE */}
      <SlideOver
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        title={`Cập nhật Phương tiện: ${dataUpdate.TenModel}`}
        description="Chỉnh sửa thông số kỹ thuật xe và ODO"
        icon={SquarePen}
        footer={
          <>
            <Button
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={() => setOpenUpdate(false)}
              disabled={isUpdating}
            >
              Hủy
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              onClick={handleSubmitUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
              ) : null}
              Lưu thay đổi
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-3.5">
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Khách hàng chủ sở hữu <span className="text-red-500">*</span>
            </label>
            <SearchSelect
              options={customerOptions}
              value={dataUpdate.KhachHangID}
              onChange={(val) =>
                setDataUpdate((prev) => ({ ...prev, KhachHangID: String(val) }))
              }
              placeholder="Chọn khách hàng sở hữu"
              isLoading={isLoadingCustomers}
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Dòng xe / Model <span className="text-red-500">*</span>
            </label>
            <Input
              value={dataUpdate.TenModel}
              onChange={(e) =>
                setDataUpdate((prev) => ({ ...prev, TenModel: e.target.value }))
              }
              className={`rounded-lg ${errors.tenModel ? "border-red-500" : ""}`}
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Biển số xe <span className="text-red-500">*</span>
            </label>
            <Input
              value={dataUpdate.BienSo}
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  BienSo: e.target.value.toUpperCase(),
                }))
              }
              className={`font-mono uppercase rounded-lg ${errors.bienSo ? "border-red-500" : ""}`}
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Màu sắc
            </label>
            <Input
              value={dataUpdate.MauSac || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({ ...prev, MauSac: e.target.value }))
              }
              className="rounded-lg"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Số Km hiện tại (ODO)
            </label>
            <Input
              type="number"
              min={0}
              value={dataUpdate.SoKmHienTai || 0}
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  SoKmHienTai: parseInt(e.target.value) || 0,
                }))
              }
              className="font-mono rounded-lg"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Số khung
            </label>
            <Input
              value={dataUpdate.SoKhung || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  SoKhung: e.target.value.toUpperCase(),
                }))
              }
              className="font-mono uppercase rounded-lg"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Số máy
            </label>
            <Input
              value={dataUpdate.SoMay || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  SoMay: e.target.value.toUpperCase(),
                }))
              }
              className="font-mono uppercase rounded-lg"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
              Mã Serial Pin
            </label>
            <Input
              value={dataUpdate.SoPin || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  SoPin: e.target.value.toUpperCase(),
                }))
              }
              className="font-mono uppercase rounded-lg"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Ghi chú
            </label>
            <Input
              value={dataUpdate.GhiChu || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({ ...prev, GhiChu: e.target.value }))
              }
              className="rounded-lg"
            />
          </div>

          <div className="col-span-2 flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/20">
            <div>
              <p className="text-sm font-medium text-foreground">
                Trạng thái xe
              </p>
              <p className="text-xs text-muted-foreground">
                Kích hoạt phương tiện trong danh sách
              </p>
            </div>
            <Switch
              id="isActivePhuongTienUpdate"
              checked={dataUpdate.TrangThai}
              onCheckedChange={(checked) =>
                setDataUpdate((prev) => ({ ...prev, TrangThai: checked }))
              }
            />
          </div>
        </div>
      </SlideOver>

      {/* 7. Modal Xóa */}
      <ConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleSubmitDelete}
        title="Xác nhận xóa phương tiện"
        description={
          <div>
            <p>
              Bạn có chắc chắn muốn xóa phương tiện &quot;
              <strong className="text-foreground">{selectItemName}</strong>
              &quot; không?
            </p>
            <span className="text-xs text-rose-600/90 dark:text-rose-400 mt-2 block bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              Lưu ý: Hành động này sẽ xóa dữ liệu phương tiện ra khỏi hệ thống
              nếu không có ràng buộc phiếu sửa chữa.
            </span>
          </div>
        }
        confirmText="Xác nhận xóa"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96" />
        </div>
      }
    >
      <VehiclesContent />
    </Suspense>
  );
}
