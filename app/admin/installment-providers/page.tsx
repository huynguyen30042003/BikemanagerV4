"use client";

import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SlideOver } from "@/components/ui/SlideOver";
import { InstallmentNavTabs } from "@/components/Common/InstallmentNavTabs";
import { useDonViTraGopHook } from "@/hooks/TraGop/useTraGop";

import { DonViTraGop } from "@/types/traGop";
import {
  Building2,
  Plus,
  RefreshCw,
  Search,
  SquarePen,
  Trash2,
  FolderOpen,
  Phone,
  Mail,
  MapPin,
  User,
  Globe,
  Key,
} from "lucide-react";

function InstallmentProvidersContent() {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
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
  } = useDonViTraGopHook();

  const columns: Column<DonViTraGop>[] = [
    {
      key: "maDonVi",
      title: "Mã Đơn Vị",
      classNameHeader: "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v, row) => (
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
          {String(v || row.maDonVi || "—")}
        </span>
      ),
    },
    {
      key: "tenDonVi",
      title: "Tên Đơn Vị Trả Góp",
      classNameHeader: "min-w-[220px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => {
        const name = row.tenDonVi || row.ten || "—";
        return (
          <div className="flex items-center gap-2.5 py-1">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
              {name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-foreground text-sm block truncate" title={name}>
                {name}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-blue-500" /> {row.dienThoai || "—"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "tenNguoiLienHe",
      title: "Nhân Sự Phụ Trách",
      classNameHeader: "min-w-[180px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="text-xs space-y-0.5">
          <div className="font-medium text-foreground flex items-center gap-1">
            <User className="w-3 h-3 text-muted-foreground" />
            <span>{row.tenNguoiLienHe || "Chưa phân công"}</span>
          </div>
          {row.sdtNguoiLienHe && (
            <div className="text-[11px] text-muted-foreground font-mono">
              {row.sdtNguoiLienHe}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "email",
      title: "Email & Địa Chỉ",
      classNameHeader: "min-w-[200px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="text-xs space-y-0.5 max-w-xs">
          {row.email && (
            <div className="flex items-center gap-1 text-muted-foreground truncate" title={row.email}>
              <Mail className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="truncate">{row.email}</span>
            </div>
          )}
          {row.diaChi && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground/80 truncate" title={row.diaChi}>
              <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="truncate">{row.diaChi}</span>
            </div>
          )}
          {!row.email && !row.diaChi && <span className="text-muted-foreground">—</span>}
        </div>
      ),
    },
    {
      key: "dangHoatDong",
      title: "Trạng Thái",
      classNameHeader: "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) =>
        v ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Đang hợp tác
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
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
            title="Chỉnh sửa thông tin đối tác"
          >
            <SquarePen className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleDelete(row)}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
            title="Xóa đối tác"
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
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Đối Tác & Đơn Vị Cho Vay Trả Góp
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Quản lý danh mục các công ty tài chính / ngân hàng liên kết (HD Saison, FE Credit, Home Credit, Mirae Asset...)
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
              <span className="text-xs">Thêm đối tác</span>
            </Button>
          </div>
        </div>

        <div className="pt-2">
          <InstallmentNavTabs activeTab="providers" />
        </div>

      </div>

      {/* Filter */}
      <div className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm theo mã đối tác, tên công ty tài chính, hotline..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-md font-medium cursor-pointer ${
                statusFilter === "all" ? "bg-muted font-bold text-foreground" : "text-muted-foreground"
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1.5 rounded-md font-medium cursor-pointer ${
                statusFilter === "active" ? "bg-muted font-bold text-emerald-600" : "text-muted-foreground"
              }`}
            >
              Đang hợp tác
            </button>
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
                <p className="font-semibold text-foreground">Chưa có đối tác trả góp nào</p>
                <Button
                  size="sm"
                  onClick={handleOpenAdd}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-1" /> Thêm đối tác mới
                </Button>
              </div>
            ) : (
              <>
                <Table<DonViTraGop>
                  data={items}
                  columns={columns}
                  showIndex
                  startIndex={(page - 1) * pageSize}
                />

                <div className="flex justify-between items-center pt-3 border-t border-border/70 text-xs text-muted-foreground">
                  <span>Tổng {totalCount} đơn vị đối tác</span>
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
        title={openAdd ? "Thêm Đối Tác Trả Góp" : "Chỉnh Sửa Đối Tác Trả Góp"}
        maxWidth="lg"
      >
        <form
          onSubmit={openAdd ? handleSubmitAdd : handleSubmitEdit}
          className="space-y-4 py-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Mã đơn vị (UNIQUE) <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="VD: HDSAISON, HOMECREDIT"
                value={formData.MaDonVi}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, MaDonVi: e.target.value.toUpperCase() }))
                }
                className="text-xs font-mono font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Tên công ty tài chính <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="VD: Công ty Tài chính TNHH HD SAISON"
                value={formData.TenDonVi}
                onChange={(e) => setFormData((prev) => ({ ...prev, TenDonVi: e.target.value }))}
                className="text-xs font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Hotline hỗ trợ <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="VD: 1900 558 854"
                value={formData.DienThoai}
                onChange={(e) => setFormData((prev) => ({ ...prev, DienThoai: e.target.value }))}
                className="text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Email liên hệ
              </label>
              <Input
                type="email"
                placeholder="VD: hotro@hdsaison.com.vn"
                value={formData.Email || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, Email: e.target.value }))}
                className="text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Địa chỉ trụ sở / chi nhánh
            </label>
            <Input
              type="text"
              placeholder="VD: 24C Phan Đăng Lưu, Phường 6, Bình Thạnh, TP.HCM"
              value={formData.DiaChi || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, DiaChi: e.target.value }))}
              className="text-xs"
            />
          </div>

          {/* Thông tin nhân viên tín dụng phụ trách tại showroom */}
          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-3">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-500" />
              Nhân viên tín dụng phụ trách showroom
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Họ tên Sale đối tác
                </label>
                <Input
                  type="text"
                  placeholder="VD: Nguyễn Văn Tuấn"
                  value={formData.TenNguoiLienHe || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, TenNguoiLienHe: e.target.value }))
                  }
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Số điện thoại Sale
                </label>
                <Input
                  type="text"
                  placeholder="VD: 0988 123 456"
                  value={formData.SdtNguoiLienHe || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, SdtNguoiLienHe: e.target.value }))
                  }
                  className="text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Tích hợp kỹ thuật API */}
          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-3">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              Cấu hình tích hợp duyệt hồ sơ online / API
            </h4>
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Endpoint URL API
              </label>
              <Input
                type="text"
                placeholder="VD: https://api-partner.hdsaison.com.vn/v1/loan"
                value={formData.DiaChiAPI || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, DiaChiAPI: e.target.value }))}
                className="text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Api Key / Secret Token
              </label>
              <Input
                type="password"
                placeholder="Nhập API Key liên kết nếu có..."
                value={formData.ApiKey || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, ApiKey: e.target.value }))}
                className="text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Cấu hình gói vay JSON (kỳ hạn, ưu đãi 0%...)
              </label>
              <Input
                type="text"
                placeholder='VD: {"GoiUuDai": ["LaiSuat0%", "Kỳ hạn 6-12-24 tháng"]}'
                value={formData.CauHinhGoiVayJson || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, CauHinhGoiVayJson: e.target.value }))
                }
                className="text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Ghi chú nghiệp vụ
            </label>
            <Input
              type="text"
              placeholder="VD: Đối tác trả góp 0% cho dòng xe VinFast Feliz & Klara"
              value={formData.GhiChu || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, GhiChu: e.target.value }))}
              className="text-xs"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Switch
              checked={formData.DangHoatDong}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, DangHoatDong: checked }))
              }
            />
            <label className="text-xs text-foreground font-medium">Đang hợp tác hoạt động</label>
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
              {isSubmitting ? "Đang lưu..." : "Lưu đối tác"}
            </Button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}

export default function InstallmentProvidersPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 space-y-4 max-w-[1600px] mx-auto">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <InstallmentProvidersContent />
    </Suspense>
  );
}
