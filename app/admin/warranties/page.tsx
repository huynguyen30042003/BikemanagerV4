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
import { useBaoHanhHook } from "@/hooks/BaoHanh/useBaoHanh";
import { BH_BaoHanh } from "@/types/baoHanh";
import {
  ShieldCheck,
  Plus,
  RefreshCw,
  Search,
  FolderOpen,
  Calendar,
  Barcode,
  User,
  Trash2,
  Clock,
  Sparkles,
} from "lucide-react";

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function WarrantiesContent() {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
    warrantyStatusOptions,
    getWarrantyStatusBadge,
    isLoadingStatuses,
    customerOptions,
    serialOptions,
    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,
    openAdd,
    setOpenAdd,
    formData,
    setFormData,
    handleOpenAdd,
    handleSubmitAdd,
    handleDelete,
    isSubmitting,
  } = useBaoHanhHook();

  const columns: Column<BH_BaoHanh>[] = [
    {
      key: "maBaoHanh",
      title: "Mã Sổ Bảo Hành",
      classNameHeader: "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
          {String(v || "—")}
        </span>
      ),
    },
    {
      key: "xePin",
      title: "Phương Tiện / Serial / Khung VIN",
      classNameHeader: "min-w-[200px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 py-1">
          <span className="font-semibold text-foreground text-xs flex items-center gap-1.5">
            <Barcode className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            Serial: {row.maSerial || "Chưa có"}
          </span>
          {row.soKhung && (
            <span className="text-[11px] font-mono text-muted-foreground">
              Số khung VIN: {row.soKhung}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "khachHang",
      title: "Chủ xe",
      classNameHeader: "min-w-[160px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 py-1">
          <span className="font-semibold text-foreground text-xs flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            {row.tenKhachHang || "Khách lẻ"}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {row.dienThoaiKhachHang || "—"}
          </span>
        </div>
      ),
    },
    {
      key: "ngayKetThuc",
      title: "Thời hạn bảo hành",
      classNameHeader: "w-44 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 text-xs">
          <span className="text-muted-foreground">Từ: {formatDate(row.ngayBatDau)}</span>
          <span className="font-semibold text-foreground">Đến: {formatDate(row.ngayKetThuc)}</span>
        </div>
      ),
    },
    {
      key: "trangThaiID",
      title: "Trạng thái",
      classNameHeader: "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => {
        const badge = getWarrantyStatusBadge(Number(v));
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
      key: "actions",
      title: "Thao tác",
      classNameHeader: "w-20 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => handleDelete(row)}
          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Sổ Bảo Hành Điện Tử Xe & Pin
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tra cứu bảo hành theo Số Khung VIN, Số Pin, Số Máy và quản lý thời hạn cam kết bảo hành
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
              onClick={handleOpenAdd}
              className="h-9 px-4 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs">Kích hoạt sổ bảo hành</span>
            </Button>
          </div>
        </div>

        <div className="pt-2">
          <ServiceNavTabs activeTab="warranties" totalWarranties={totalCount} />
        </div>
      </div>

      {/* Filter */}
      <div className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm theo số khung, số serial, tên chủ xe..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="w-full sm:w-56">
            <SearchSelect
              placeholder="Trạng thái bảo hành..."
              options={[{ value: "", label: "Tất cả trạng thái" }, ...warrantyStatusOptions]}
              value={statusFilter !== null ? String(statusFilter) : ""}
              onChange={(val) => setStatusFilter(val ? Number(val) : null)}
              isLoading={isLoadingStatuses}
            />
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
                <p className="font-semibold text-foreground">Chưa có sổ bảo hành nào</p>
                <Button
                  size="sm"
                  onClick={handleOpenAdd}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-1" /> Kích hoạt sổ mới
                </Button>
              </div>
            ) : (
              <>
                <Table<BH_BaoHanh>
                  data={items}
                  columns={columns}
                  showIndex
                  startIndex={(page - 1) * pageSize}
                />

                <div className="flex justify-between items-center pt-3 border-t border-border/70 text-xs text-muted-foreground">
                  <span>Tổng {totalCount} sổ bảo hành điện tử</span>
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

      {/* SlideOver Kích hoạt sổ */}
      <SlideOver
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        title="Kích Hoạt Sổ Bảo Hành Điện Tử"
        maxWidth="md"
      >
        <form onSubmit={handleSubmitAdd} className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Xe / Serial / Số Khung <span className="text-rose-500">*</span>
            </label>
            <SearchSelect
              placeholder="Chọn số serial / khung xe..."
              options={serialOptions}
              value={formData.SoSerialID}
              onChange={(val) => {
                const s = serialOptions.find((x: any) => x.value === val);
                setFormData((prev) => ({
                  ...prev,
                  SoSerialID: String(val),
                  BienTheSanPhamID: s?.bienTheID || prev.BienTheSanPhamID,
                }));
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Khách hàng sở hữu <span className="text-rose-500">*</span>
            </label>
            <SearchSelect
              placeholder="Chọn khách hàng..."
              options={customerOptions}
              value={formData.KhachHangID}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, KhachHangID: String(val) }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Thời hạn BH (tháng)
              </label>
              <Input
                type="number"
                min={1}
                value={formData.SoThangBaoHanh}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    SoThangBaoHanh: parseInt(e.target.value) || 12,
                  }))
                }
                className="text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Giới hạn Km (ODO)
              </label>
              <Input
                type="number"
                min={0}
                value={formData.GioiHanKm || 0}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    GioiHanKm: parseInt(e.target.value) || 0,
                  }))
                }
                className="text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Trạng thái (Từ Danh mục chi tiết)
            </label>
            <SearchSelect
              options={warrantyStatusOptions}
              value={String(formData.TrangThaiID)}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, TrangThaiID: Number(val) }))
              }
              isLoading={isLoadingStatuses}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Điều kiện & Chính sách cam kết
            </label>
            <Textarea
              rows={3}
              value={formData.DieuKienBaoHanh || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, DieuKienBaoHanh: e.target.value }))
              }
              className="text-xs"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpenAdd(false)}
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
              {isSubmitting ? "Đang lưu..." : "Kích hoạt bảo hành"}
            </Button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}

export default function WarrantiesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 space-y-4 max-w-[1600px] mx-auto">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <WarrantiesContent />
    </Suspense>
  );
}
