"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Globe,
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
  Flag,
} from "lucide-react";
import { useQuocGia } from "@/hooks/QuocGia/useQuocGia";
import { DM_QuocGia } from "@/types/quocGia";
import { SlideOver } from "@/components/ui/SlideOver";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { LocationNavTabs } from "@/components/Common/LocationNavTabs";

export default function QuocGiaPage() {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    searchInput,
    handleSearch,

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

    handleSync,
    isSyncing,

    errors,
  } = useQuocGia();

  // Metrics
  const activeCount = useMemo(
    () => items.filter((item) => item.trangThai === true).length,
    [items]
  );
  const inactiveCount = useMemo(
    () => items.filter((item) => item.trangThai === false).length,
    [items]
  );

  const columns: Column<DM_QuocGia>[] = [
    {
      key: "quocGiaID",
      title: "ID",
      classNameHeader: "w-16 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="font-mono text-xs font-medium px-2 py-0.5 rounded-md bg-muted/60 border border-border/50 text-muted-foreground">
          #{v}
        </span>
      ),
    },
    {
      key: "maQuocGia",
      title: "Mã Quốc gia",
      classNameHeader: "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <div className="flex items-center justify-center gap-1.5">
          <Flag className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
            {v ? String(v).toUpperCase() : "—"}
          </span>
        </div>
      ),
    },
    {
      key: "ten",
      title: "Tên Quốc gia",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 py-0.5">
          <span className="font-semibold text-foreground text-sm hover:text-blue-600 transition-colors">
            {row.ten}
          </span>
          {row.tenKhongDau && (
            <span className="text-xs text-muted-foreground">
              {row.tenKhongDau}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "thuTu",
      title: "Thứ tự",
      classNameHeader: "text-center w-20 text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="inline-flex items-center justify-center min-w-6 px-1.5 py-0.5 rounded text-xs font-mono bg-muted/80 text-foreground border border-border/60">
          {v ?? 0}
        </span>
      ),
    },
    {
      key: "trangThai",
      title: "Trạng thái",
      classNameHeader: "text-center w-32 text-xs font-semibold text-muted-foreground",
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
              Khóa
            </span>
          </div>
        ),
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader: "text-center w-28 text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenEdit(row)}
            title="Chỉnh sửa quốc gia"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <SquarePen className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenDelete(row)}
            title="Xóa quốc gia"
            className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const hasActiveFilters = Boolean(searchInput || statusFilter !== "all");

  const handleResetFilters = () => {
    handleSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen space-y-6">
      {/* 1. Header & Navigation Hub */}
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
                <span className="text-foreground">Địa bàn & Cơ sở</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Danh mục Quốc gia
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Quản lý danh sách quốc gia chuẩn ISO dùng cho xuất nhập khẩu phụ tùng và liên kết địa bàn
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={isSyncing}
                className="h-9 px-3.5 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
                title="Đồng bộ danh mục quốc gia từ nguồn dữ liệu chuẩn"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-blue-500" : ""}`}
                />
                <span className="text-xs font-medium">Đồng bộ chuẩn</span>
              </Button>

              <Button
                size="sm"
                onClick={handleModalAdd}
                className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs font-medium">Thêm mới</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <LocationNavTabs activeTab="quocGia" totalQuocGia={totalCount} />
          </div>
        </div>
      )}

      {/* 2. KPI Overview Cards */}
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
              Tổng số Quốc gia
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">
            {isLoading ? <Skeleton className="h-7 w-16" /> : totalCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Khai báo trong toàn hệ thống
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
              Đang áp dụng
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {isLoading ? <Skeleton className="h-7 w-16" /> : activeCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Sẵn sàng liên kết xuất xứ sản phẩm
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
              Tạm ngưng / Khóa
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-500/10 text-slate-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-700 dark:text-slate-300">
            {isLoading ? <Skeleton className="h-7 w-16" /> : inactiveCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Vô hiệu hóa trong biểu mẫu
          </p>
        </Card>

        <Card className="p-4 rounded-xl border border-border/80 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Chuẩn mã ISO
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Flag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            ISO-3166
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Định dạng mã quốc gia quốc tế
          </p>
        </Card>
      </div>

      {/* 3. Toolbar: Tìm kiếm & Lọc trạng thái */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Tìm theo tên quốc gia hoặc mã (VN, US, JP...)..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 pr-8 h-9.5 w-full bg-background/80 text-sm focus-visible:ring-blue-500/20"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground w-4 h-4 rounded-full flex items-center justify-center hover:bg-muted cursor-pointer transition-colors"
                title="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0">
            <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1 mr-0.5" />
            <button
              type="button"
              onClick={() => {
                setStatusFilter("all");
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                statusFilter === "all"
                  ? "bg-background shadow-xs text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Tất cả ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("active");
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                statusFilter === "active"
                  ? "bg-background shadow-xs text-emerald-600 dark:text-emerald-400 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sử dụng ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("inactive");
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                statusFilter === "inactive"
                  ? "bg-background shadow-xs text-slate-700 dark:text-slate-300 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Khóa ({inactiveCount})
            </button>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Tải lại dữ liệu"
            className="h-9.5 w-9.5 shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-blue-500" : ""}`} />
          </Button>
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
            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                Trạng thái: {statusFilter === "active" ? "Đang sử dụng" : "Đã khóa"}
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
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
                  Không tìm thấy quốc gia nào
                </p>
                <p className="text-xs text-muted-foreground max-w-sm mt-1">
                  {searchInput
                    ? "Không có kết quả khớp với từ khóa tìm kiếm."
                    : "Chưa có danh mục quốc gia. Hãy thêm mới hoặc nhấn Đồng bộ chuẩn!"}
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={handleSync} className="cursor-pointer">
                    Đồng bộ ngay
                  </Button>
                  <Button size="sm" onClick={handleModalAdd} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                    <Plus className="w-4 h-4 mr-1" /> Thêm quốc gia mới
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Table<DM_QuocGia>
                  data={items}
                  columns={columns}
                  showIndex
                  startIndex={(page - 1) * pageSize}
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/70 text-sm text-muted-foreground">
                  <div className="text-xs">
                    Trang <strong className="text-foreground">{page}</strong> / {totalPages}{" "}
                    (Tổng <strong className="text-foreground">{totalCount}</strong> quốc gia)
                  </div>

                  <div className="flex items-center gap-1.5">
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1);
                      }}
                      className="h-8 border border-border/80 rounded-md px-2 bg-background text-foreground text-xs outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value={10}>10 / trang</option>
                      <option value={20}>20 / trang</option>
                      <option value={50}>50 / trang</option>
                      <option value={100}>100 / trang</option>
                    </select>

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
                      onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
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

      {/* 5. SlideOver: THÊM MỚI QUỐC GIA */}
      <SlideOver
        open={open}
        onClose={() => setOpen(false)}
        title="Thêm mới Quốc gia"
        description="Đăng ký quốc gia mới theo tiêu chuẩn mã quốc tế ISO"
        icon={Globe}
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
              {isCreating ? <RefreshCw className="w-4 h-4 animate-spin mr-1.5" /> : null}
              Lưu quốc gia
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Mã Quốc gia <span className="text-red-500">*</span>
            </label>
            <Input
              value={dataAdd.MaQuocGia}
              onChange={(e) => setDataAdd((prev) => ({ ...prev, MaQuocGia: e.target.value.toUpperCase() }))}
              placeholder="Ví dụ: VN, US, JP..."
              className={`font-mono uppercase rounded-lg ${errors.maQuocGia ? "border-red-500" : ""}`}
            />
            {errors.maQuocGia && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.maQuocGia}
              </p>
            )}
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Thứ tự hiển thị
            </label>
            <Input
              type="number"
              min={0}
              value={dataAdd.ThuTu}
              onChange={(e) => setDataAdd((prev) => ({ ...prev, ThuTu: parseInt(e.target.value) || 0 }))}
              className="rounded-lg font-mono"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Tên Quốc gia <span className="text-red-500">*</span>
            </label>
            <Input
              value={dataAdd.Ten}
              onChange={(e) => setDataAdd((prev) => ({ ...prev, Ten: e.target.value }))}
              placeholder="Ví dụ: Việt Nam, Nhật Bản, Hoa Kỳ..."
              className={`rounded-lg ${errors.ten ? "border-red-500" : ""}`}
            />
            {errors.ten && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.ten}
              </p>
            )}
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Tên không dấu
            </label>
            <Input
              value={dataAdd.TenKhongDau || ""}
              onChange={(e) => setDataAdd((prev) => ({ ...prev, TenKhongDau: e.target.value }))}
              placeholder="Ví dụ: Viet Nam, Nhat Ban..."
              className="rounded-lg"
            />
          </div>

          <div className="col-span-2 flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/20">
            <div>
              <p className="text-sm font-medium text-foreground">Trạng thái kích hoạt</p>
              <p className="text-xs text-muted-foreground">Cho phép chọn quốc gia này trong thông tin đối tác & xuất xứ xe</p>
            </div>
            <Switch
              id="isActiveQuocGiaAdd"
              checked={dataAdd.TrangThai}
              onCheckedChange={(checked) => setDataAdd((prev) => ({ ...prev, TrangThai: checked }))}
            />
          </div>
        </div>
      </SlideOver>

      {/* 6. SlideOver: CẬP NHẬT QUỐC GIA */}
      <SlideOver
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        title={`Cập nhật Quốc gia #${dataUpdate.QuocGiaID}`}
        description="Chỉnh sửa thông tin quốc gia"
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
              {isUpdating ? <RefreshCw className="w-4 h-4 animate-spin mr-1.5" /> : null}
              Lưu thay đổi
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Mã Quốc gia <span className="text-red-500">*</span>
            </label>
            <Input
              value={dataUpdate.MaQuocGia}
              onChange={(e) => setDataUpdate((prev) => ({ ...prev, MaQuocGia: e.target.value.toUpperCase() }))}
              placeholder="Nhập mã..."
              className={`font-mono uppercase rounded-lg ${errors.maQuocGia ? "border-red-500" : ""}`}
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Thứ tự hiển thị
            </label>
            <Input
              type="number"
              min={0}
              value={dataUpdate.ThuTu}
              onChange={(e) => setDataUpdate((prev) => ({ ...prev, ThuTu: parseInt(e.target.value) || 0 }))}
              className="rounded-lg font-mono"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Tên Quốc gia <span className="text-red-500">*</span>
            </label>
            <Input
              value={dataUpdate.Ten}
              onChange={(e) => setDataUpdate((prev) => ({ ...prev, Ten: e.target.value }))}
              placeholder="Nhập tên..."
              className={`rounded-lg ${errors.ten ? "border-red-500" : ""}`}
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Tên không dấu
            </label>
            <Input
              value={dataUpdate.TenKhongDau || ""}
              onChange={(e) => setDataUpdate((prev) => ({ ...prev, TenKhongDau: e.target.value }))}
              placeholder="Nhập tên không dấu..."
              className="rounded-lg"
            />
          </div>

          <div className="col-span-2 flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/20">
            <div>
              <p className="text-sm font-medium text-foreground">Trạng thái kích hoạt</p>
              <p className="text-xs text-muted-foreground">Kích hoạt sử dụng trong toàn bộ hệ thống</p>
            </div>
            <Switch
              id="isActiveQuocGiaUpdate"
              checked={dataUpdate.TrangThai}
              onCheckedChange={(checked) => setDataUpdate((prev) => ({ ...prev, TrangThai: checked }))}
            />
          </div>
        </div>
      </SlideOver>

      {/* 7. Modal Xóa */}
      <ConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleSubmitDelete}
        title="Xác nhận xóa quốc gia"
        description={
          <div>
            <p>
              Bạn có chắc chắn muốn xóa quốc gia &quot;
              <strong className="text-foreground">{selectItemName}</strong>&quot; không?
            </p>
            <span className="text-xs text-rose-600/90 dark:text-rose-400 mt-2 block bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              Hành động này không thể hoàn tác nếu quốc gia này đang được liên kết với sản phẩm xe, xuất xứ hoặc nhà cung cấp.
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
