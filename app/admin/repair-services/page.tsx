"use client";

import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SearchSelect } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { ServiceNavTabs } from "@/components/Common/ServiceNavTabs";
import { useDichVuHook } from "@/hooks/SuaChua/useSuaChua";
import { SC_DichVu } from "@/types/suaChua";
import {
  Sparkles,
  Plus,
  RefreshCw,
  Search,
  FolderOpen,
  SquarePen,
  Trash2,
  Clock,
  DollarSign,
  Tag,
} from "lucide-react";

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

function RepairServicesContent() {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    searchInput,
    setSearchInput,
    categoryFilter,
    setCategoryFilter,
    serviceTypeOptions,
    getServiceTypeLabel,
    isLoadingServiceTypes,
    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,
    openAdd,
    setOpenAdd,
    openEdit,
    setOpenEdit,
    formData,
    setFormData,
    handleOpenAdd,
    handleOpenEdit,
    handleSubmitAdd,
    handleSubmitEdit,
    handleDelete,
    isSubmitting,
  } = useDichVuHook();

  const columns: Column<SC_DichVu>[] = [
    {
      key: "maDichVu",
      title: "Mã Dịch Vụ",
      classNameHeader: "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
          {String(v || "—")}
        </span>
      ),
    },
    {
      key: "tenDichVu",
      title: "Tên Dịch Vụ & Mô Tả",
      classNameHeader: "min-w-[220px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 py-1">
          <span className="font-semibold text-foreground text-sm">
            {row.tenDichVu}
          </span>
          {row.moTa && (
            <span className="text-xs text-muted-foreground line-clamp-1">
              {row.moTa}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "danhMucChiTietID",
      title: "Phân loại",
      classNameHeader: "w-40 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20">
          {getServiceTypeLabel(Number(v)) || "Dịch vụ chung"}
        </span>
      ),
    },
    {
      key: "giaCoBan",
      title: "Giá tiền công",
      classNameHeader: "w-36 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right",
      render: (v) => (
        <span className="font-mono text-xs font-bold text-foreground">
          {formatCurrency(Number(v))}
        </span>
      ),
    },
    {
      key: "thoiGianDuKienPhut",
      title: "Thời gian làm",
      classNameHeader: "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          <Clock className="w-3.5 h-3.5 text-blue-500" /> {v} phút
        </span>
      ),
    },
    {
      key: "trangThai",
      title: "Trạng thái",
      classNameHeader: "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) =>
        v ? (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            Kinh doanh
          </span>
        ) : (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-600 border border-slate-500/20">
            Tạm dừng
          </span>
        ),
    },
    {
      key: "actions",
      title: "Thao tác",
      classNameHeader: "w-24 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleOpenEdit(row)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer"
          >
            <SquarePen className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleDelete(row)}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
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
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Bảng Giá Tiền Công & Gói Dịch Vụ
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Cấu hình đơn giá tiền công bảo dưỡng định kỳ, sửa chữa cơ điện, cứu hộ xe điện
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
              <span className="text-xs">Thêm dịch vụ mới</span>
            </Button>
          </div>
        </div>

        <div className="pt-2">
          <ServiceNavTabs activeTab="services" />
        </div>
      </div>

      {/* Filter */}
      <div className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm theo tên dịch vụ, mã dịch vụ..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="w-full sm:w-56">
            <SearchSelect
              placeholder="Nhóm dịch vụ..."
              options={[{ value: "", label: "Tất cả nhóm dịch vụ" }, ...serviceTypeOptions]}
              value={categoryFilter !== null ? String(categoryFilter) : ""}
              onChange={(val) => setCategoryFilter(val ? Number(val) : null)}
              isLoading={isLoadingServiceTypes}
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
                <p className="font-semibold text-foreground">Chưa có dịch vụ nào trong bảng giá</p>
                <Button
                  size="sm"
                  onClick={handleOpenAdd}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-1" /> Thêm dịch vụ
                </Button>
              </div>
            ) : (
              <>
                <Table<SC_DichVu>
                  data={items}
                  columns={columns}
                  showIndex
                  startIndex={(page - 1) * pageSize}
                />

                <div className="flex justify-between items-center pt-3 border-t border-border/70 text-xs text-muted-foreground">
                  <span>Tổng {totalCount} dịch vụ kỹ thuật</span>
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

      {/* SlideOver Add / Edit */}
      <SlideOver
        open={openAdd || openEdit}
        onClose={() => {
          setOpenAdd(false);
          setOpenEdit(false);
        }}
        title={openAdd ? "Thêm Dịch Vụ Mới" : "Chỉnh Sửa Dịch Vụ"}
        maxWidth="md"
      >
        <form
          onSubmit={openAdd ? handleSubmitAdd : handleSubmitEdit}
          className="space-y-4 py-2"
        >
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Tên dịch vụ / Tiền công <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="VD: Cân vành xe điện, Vá lốp không săm..."
              value={formData.TenDichVu}
              onChange={(e) => setFormData((prev) => ({ ...prev, TenDichVu: e.target.value }))}
              className="text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Nhóm dịch vụ (Từ DM chi tiết)
            </label>
            <SearchSelect
              options={serviceTypeOptions}
              value={String(formData.DanhMucChiTietID)}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, DanhMucChiTietID: Number(val) }))
              }
              isLoading={isLoadingServiceTypes}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Giá cơ bản (đ)
              </label>
              <Input
                type="number"
                min={0}
                value={formData.GiaCoBan}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    GiaCoBan: parseInt(e.target.value) || 0,
                  }))
                }
                className="text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Thời gian ước tính (phút)
              </label>
              <Input
                type="number"
                min={5}
                value={formData.ThoiGianDuKienPhut}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    ThoiGianDuKienPhut: parseInt(e.target.value) || 30,
                  }))
                }
                className="text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Mô tả chi tiết hạng mục công việc
            </label>
            <Textarea
              rows={3}
              value={formData.MoTa || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, MoTa: e.target.value }))}
              className="text-xs"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Switch
              checked={formData.TrangThai}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, TrangThai: checked }))
              }
            />
            <label className="text-xs text-foreground font-medium">Đang kinh doanh dịch vụ này</label>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setOpenAdd(false);
                setOpenEdit(false);
              }}
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
              {isSubmitting ? "Đang lưu..." : "Lưu dịch vụ"}
            </Button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}

export default function RepairServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 space-y-4 max-w-[1600px] mx-auto">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <RepairServicesContent />
    </Suspense>
  );
}
