"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SearchSelect } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ProductNavTabs } from "@/components/Common/ProductNavTabs";
import { useBienTheSanPham } from "@/hooks/BienTheSanPham/useBienTheSanPham";
import { SP_BienTheSanPham } from "@/types/bienTheSanPham";
import { getImageUrl } from "@/shared/constants/apiConstants";
import {
  Boxes,
  Plus,
  RefreshCw,
  Search,
  SquarePen,
  Trash2,
  FolderOpen,
  Filter,
  CheckCircle2,
  Barcode,
  BatteryCharging,
  Zap,
  Tag,
  DollarSign,
  Upload,
  AlertCircle,
  Package,
  LayoutGrid,
  List,
  ExternalLink,
  X,
  ShieldCheck,
} from "lucide-react";

type ViewMode = "grid" | "table";

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

function VariantsContent() {
  const searchParams = useSearchParams();
  const initialSanPhamId = searchParams.get("productId") || undefined;

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    sanPhamFilter,
    setSanPhamFilter,
    searchInput,
    handleSearch,

    productOptions,
    isLoadingProducts,

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
  } = useBienTheSanPham(initialSanPhamId);

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [imagePreviewAdd, setImagePreviewAdd] = useState<string | null>(null);
  const [imagePreviewUpdate, setImagePreviewUpdate] = useState<string | null>(
    null,
  );

  const shouldReduceMotion = useReducedMotion();

  // Metrics
  const serialManagedCount = useMemo(
    () => items.filter((i) => i.quanLyTheoSerial === true).length,
    [items],
  );
  const activeCount = useMemo(
    () => items.filter((i) => i.trangThai === true).length,
    [items],
  );
  const maxPrice = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.max(...items.map((i) => i.giaBan || 0));
  }, [items]);

  const existingVariantImage = useMemo(() => {
    return items.find((i) => i.bienTheSanPhamID === dataUpdate.BienTheSanPhamID)
      ?.hinhAnh;
  }, [items, dataUpdate.BienTheSanPhamID]);

  const handleImageChangeAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDataAdd((prev) => ({ ...prev, file }));
      setImagePreviewAdd(URL.createObjectURL(file));
    }
  };

  const handleClearImageAdd = () => {
    setDataAdd((prev) => ({ ...prev, file: null }));
    setImagePreviewAdd(null);
  };

  const handleImageChangeUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDataUpdate((prev) => ({ ...prev, file, XoaFile: false }));
      setImagePreviewUpdate(URL.createObjectURL(file));
    }
  };

  const handleClearImageUpdate = () => {
    setDataUpdate((prev) => ({ ...prev, file: null, XoaFile: true }));
    setImagePreviewUpdate(null);
  };

  const columns: Column<SP_BienTheSanPham>[] = [
    {
      key: "maSKU",
      title: "Mã SKU / Barcode",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex flex-col items-center">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted/80 text-foreground border border-border/60">
            {row.maSKU}
          </span>
          {row.maVach && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono mt-0.5">
              <Barcode className="w-3 h-3 text-muted-foreground" />
              {row.maVach}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "tenBienThe",
      title: "Biến thể & Thuộc tính",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex items-center gap-3 py-1">
          <div className="w-10 h-10 rounded-xl bg-muted/60 border border-border/60 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
            {row.hinhAnh && getImageUrl(row.hinhAnh) ? (
              <Image
                src={getImageUrl(row.hinhAnh)}
                alt={row.tenBienThe}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <Boxes className="w-5 h-5 text-muted-foreground/60" />
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-foreground text-sm hover:text-blue-600 transition-colors">
              {row.tenBienThe}
            </span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              {row.mauSac && (
                <span className="font-medium text-foreground/80">
                  Màu: {row.mauSac}
                </span>
              )}
              {row.dungLuongPin && (
                <span className="inline-flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400">
                  <BatteryCharging className="w-3 h-3" />
                  {row.dungLuongPin}
                </span>
              )}
              {row.congSuatDongCo && (
                <span className="inline-flex items-center gap-1 font-mono text-amber-600 dark:text-amber-400">
                  <Zap className="w-3 h-3" />
                  {row.congSuatDongCo}
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "sanPhamID",
      title: "Dòng sản phẩm cha",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <span className="text-xs text-foreground font-medium">
          {row.tenSanPham || `SP #${row.sanPhamID.substring(0, 8)}`}
        </span>
      ),
    },
    {
      key: "giaBan",
      title: "Giá bán lẻ",
      classNameHeader:
        "w-32 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right",
      render: (v) => (
        <span className="font-mono text-xs font-bold text-foreground">
          {formatCurrency(Number(v))}
        </span>
      ),
    },
    {
      key: "giaBanSi",
      title: "Giá sỉ / Thợ",
      classNameHeader:
        "w-32 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right",
      render: (v) => (
        <span className="font-mono text-xs text-muted-foreground">
          {formatCurrency(Number(v))}
        </span>
      ),
    },
    {
      key: "quanLyTheoSerial",
      title: "Quản lý Serial",
      classNameHeader:
        "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) =>
        v ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
            Số Khung/Pin
          </span>
        ) : (
          <span className="text-[10px] text-muted-foreground">
            Theo số lượng
          </span>
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
              Kinh doanh
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Ngừng bán
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
            href={`/admin/product-serials?variantId=${row.bienTheSanPhamID}`}
            title="Quản lý danh sách Serial / Số khung của biến thể"
            className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <Barcode className="w-4 h-4" />
          </Link>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setImagePreviewUpdate(null);
              handleOpenEdit(row);
            }}
            title="Chỉnh sửa biến thể"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <SquarePen className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenDelete(row)}
            title="Xóa biến thể"
            className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const hasActiveFilters = Boolean(searchInput || sanPhamFilter);

  const handleResetFilters = () => {
    handleSearch("");
    setSanPhamFilter("");
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
                <span className="text-foreground">Biến thể sản phẩm</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                  <Boxes className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Biến thể Sản phẩm & SKU
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Quản lý phiên bản màu sắc xe, dung lượng pin, công suất động
                    cơ, mã SKU và định giá bán lẻ / sỉ
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
                onClick={() => {
                  setImagePreviewAdd(null);
                  handleModalAdd();
                }}
                className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs font-medium">Thêm biến thể</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <ProductNavTabs activeTab="variants" />
          </div>
        </div>
      )}

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <Card
          onClick={() => {
            setSanPhamFilter("");
            setPage(1);
          }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            !sanPhamFilter
              ? "border-blue-500/50 bg-blue-500/5 shadow-xs ring-2 ring-blue-500/10"
              : "border-border/80 bg-card hover:border-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Tổng số biến thể SKU
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">
            {isLoading ? <Skeleton className="h-7 w-16" /> : totalCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Mã định danh bán lẻ & quản lý kho
          </p>
        </Card>

        <Card className="p-4 rounded-xl border border-border/80 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Quản lý theo Serial / Số khung
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Barcode className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {isLoading ? <Skeleton className="h-7 w-16" /> : serialManagedCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Bắt buộc truy vết tem xe / pin
          </p>
        </Card>

        <Card className="p-4 rounded-xl border border-border/80 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Giá bán cao nhất
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono truncate">
            {isLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              formatCurrency(maxPrice)
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Mức giá niêm yết tối đa
          </p>
        </Card>

        <Card className="p-4 rounded-xl border border-border/80 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Đang kinh doanh
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {isLoading ? <Skeleton className="h-7 w-16" /> : activeCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Sẵn sàng bán ra thị trường
          </p>
        </Card>
      </div>

      {/* 3. Toolbar */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Tìm theo mã SKU, tên biến thể hoặc màu sắc..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 pr-8 h-9.5 w-full bg-background/80 text-xs focus-visible:ring-blue-500/20"
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

          <div className="flex items-center gap-2">
            <div className="w-64">
              <SearchSelect
                options={[
                  { value: "", label: "Tất cả dòng sản phẩm" },
                  ...productOptions,
                ]}
                value={sanPhamFilter}
                onChange={(val) => {
                  setSanPhamFilter(String(val));
                  setPage(1);
                }}
                placeholder="Lọc theo sản phẩm"
                isLoading={isLoadingProducts}
                className="h-9.5 text-xs"
              />
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-0.5 shrink-0 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Dạng lưới thẻ"
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
            {sanPhamFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                Sản phẩm đã chọn
                <button
                  type="button"
                  onClick={() => {
                    setSanPhamFilter("");
                    setPage(1);
                  }}
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

      {/* 4. Content Display (Grid or Table) */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <Card
              key={idx}
              className="p-4 rounded-xl border border-border/70 space-y-3"
            >
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
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
            Không tìm thấy biến thể nào
          </p>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            Chưa có biến thể màu sắc / pin nào phù hợp với bộ lọc tìm kiếm hiện
            tại.
          </p>
          <Button
            size="sm"
            onClick={handleModalAdd}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1" /> Thêm biến thể mới
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        /* SHOWCASE GRID VIEW */
        <div className="space-y-4">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {items.map((variant) => (
              <Card
                key={variant.bienTheSanPhamID}
                className="group relative rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs hover:shadow-md hover:border-border transition-all flex flex-col"
              >
                {/* Media Section */}
                <div className="relative aspect-4/3 w-full bg-muted/30 overflow-hidden flex items-center justify-center p-3">
                  {variant.hinhAnh && getImageUrl(variant.hinhAnh) ? (
                    <Image
                      src={getImageUrl(variant.hinhAnh)}
                      alt={variant.tenBienThe}
                      width={320}
                      height={240}
                      className="w-auto h-full max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground/50 border border-border/40">
                      <Boxes className="w-8 h-8" />
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-background/90 backdrop-blur-sm text-foreground border border-border/70 shadow-2xs">
                      {variant.maSKU}
                    </span>
                    {variant.quanLyTheoSerial && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-indigo-500/15 backdrop-blur-sm text-indigo-700 dark:text-indigo-300 border border-indigo-500/25">
                        <Barcode className="w-3 h-3" />
                        Serial
                      </span>
                    )}
                  </div>

                  {/* Status Pill */}
                  <div className="absolute top-2.5 right-2.5">
                    {variant.trangThai ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 backdrop-blur-sm text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Kinh doanh
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-500/15 backdrop-blur-sm text-slate-700 dark:text-slate-300 border border-slate-500/25">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Ngừng bán
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3 border-t border-border/60">
                  <div>
                    <div className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 truncate mb-0.5">
                      <Package className="w-3 h-3 shrink-0 text-muted-foreground/70" />
                      <span className="truncate">
                        {variant.tenSanPham ||
                          `Dòng xe #${variant.sanPhamID.substring(0, 8)}`}
                      </span>
                    </div>

                    <h3
                      className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-blue-600 transition-colors"
                      title={variant.tenBienThe}
                    >
                      {variant.tenBienThe}
                    </h3>

                    {/* Spec Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      {variant.mauSac && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                          {variant.mauSac}
                        </span>
                      )}
                      {variant.dungLuongPin && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                          <BatteryCharging className="w-3 h-3" />
                          {variant.dungLuongPin}
                        </span>
                      )}
                      {variant.congSuatDongCo && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                          <Zap className="w-3 h-3" />
                          {variant.congSuatDongCo}
                        </span>
                      )}
                      {variant.soThangBaoHanh != null &&
                        variant.soThangBaoHanh > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                            <ShieldCheck className="w-3 h-3 text-blue-500" />
                            {variant.soThangBaoHanh}T
                          </span>
                        )}
                    </div>
                  </div>

                  {/* Pricing & Footer Actions */}
                  <div className="pt-2 border-t border-border/50">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                          Giá niêm yết
                        </span>
                        <span className="font-mono text-base font-bold text-foreground">
                          {formatCurrency(variant.giaBan)}
                        </span>
                      </div>
                      {variant.giaBanSi != null && variant.giaBanSi > 0 && (
                        <div className="text-right">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                            Giá sỉ
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {formatCurrency(variant.giaBanSi)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <Link
                        href={`/admin/product-serials?variantId=${variant.bienTheSanPhamID}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-lg border border-border/80 bg-background hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-muted-foreground hover:text-indigo-600 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
                        title="Quản lý tem serial xe"
                      >
                        <Barcode className="w-3.5 h-3.5" />
                        <span>Kho Serial</span>
                      </Link>

                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => {
                          setImagePreviewUpdate(null);
                          handleOpenEdit(variant);
                        }}
                        title="Chỉnh sửa biến thể"
                        className="h-8 w-8 text-muted-foreground hover:text-blue-600 cursor-pointer"
                      >
                        <SquarePen className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => handleOpenDelete(variant)}
                        title="Xóa biến thể"
                        className="h-8 w-8 text-muted-foreground hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>

          {/* Pagination */}
          <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <div>
              Trang <strong className="text-foreground">{page}</strong> /{" "}
              {totalPages} (Tổng{" "}
              <strong className="text-foreground">{totalCount}</strong> biến
              thể)
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
            <Table<SP_BienTheSanPham>
              data={items}
              columns={columns}
              showIndex
              startIndex={(page - 1) * pageSize}
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/70 text-sm text-muted-foreground">
              <div className="text-xs">
                Trang <strong className="text-foreground">{page}</strong> /{" "}
                {totalPages} (Tổng{" "}
                <strong className="text-foreground">{totalCount}</strong> biến
                thể)
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

      {/* 5. SlideOver: THÊM BIẾN THỂ */}
      <SlideOver
        open={open}
        onClose={() => setOpen(false)}
        title="Thêm mới Biến thể & SKU"
        description="Đăng ký màu sắc xe, dung lượng pin, công suất và giá niêm yết"
        icon={Boxes}
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
              Lưu biến thể
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-3.5">
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Dòng sản phẩm cha <span className="text-red-500">*</span>
            </label>
            <SearchSelect
              options={productOptions}
              value={dataAdd.SanPhamID}
              onChange={(val) =>
                setDataAdd((prev) => ({ ...prev, SanPhamID: String(val) }))
              }
              placeholder="Chọn sản phẩm cha"
              isLoading={isLoadingProducts}
              className={errors.sanPhamID ? "border-red-500" : ""}
            />
            {errors.sanPhamID && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.sanPhamID}
              </p>
            )}
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Mã SKU <span className="text-red-500">*</span>
            </label>
            <Input
              value={dataAdd.MaSKU}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  MaSKU: e.target.value.toUpperCase(),
                }))
              }
              placeholder="SKU-FELIZS-DEN..."
              className={`font-mono uppercase rounded-lg text-xs ${errors.maSKU ? "border-red-500" : ""}`}
            />
            {errors.maSKU && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.maSKU}
              </p>
            )}
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Mã vạch Barcode
            </label>
            <Input
              value={dataAdd.MaVach || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, MaVach: e.target.value }))
              }
              placeholder="8931234567890"
              className="font-mono rounded-lg text-xs"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Tên biến thể <span className="text-red-500">*</span>
            </label>
            <Input
              value={dataAdd.TenBienThe}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, TenBienThe: e.target.value }))
              }
              placeholder="Ví dụ: Màu Đen Nhám - Pin LFP 3.5kWh"
              className={`rounded-lg text-xs ${errors.tenBienThe ? "border-red-500" : ""}`}
            />
            {errors.tenBienThe && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.tenBienThe}
              </p>
            )}
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Màu sắc
            </label>
            <Input
              value={dataAdd.MauSac || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, MauSac: e.target.value }))
              }
              placeholder="Đen nhám, Đỏ, Trắng..."
              className="rounded-lg text-xs"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Dung lượng Pin
            </label>
            <Input
              value={dataAdd.DungLuongPin || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  DungLuongPin: e.target.value,
                }))
              }
              placeholder="3.5 kWh, 72V-20Ah..."
              className="rounded-lg text-xs font-mono"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Công suất động cơ
            </label>
            <Input
              value={dataAdd.CongSuatDongCo || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  CongSuatDongCo: e.target.value,
                }))
              }
              placeholder="3000W, 1200W..."
              className="rounded-lg text-xs font-mono"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Bảo hành (tháng)
            </label>
            <Input
              type="number"
              min={0}
              value={dataAdd.SoThangBaoHanh}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  SoThangBaoHanh: parseInt(e.target.value) || 0,
                }))
              }
              className="rounded-lg font-mono text-xs"
            />
          </div>

          {/* Pricing */}
          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Giá nhập tham chiếu (VNĐ)
            </label>
            <Input
              type="number"
              min={0}
              value={dataAdd.GiaNhap}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  GiaNhap: parseFloat(e.target.value) || 0,
                }))
              }
              className="font-mono rounded-lg text-xs"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Giá bán lẻ (VNĐ) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              min={0}
              value={dataAdd.GiaBan}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  GiaBan: parseFloat(e.target.value) || 0,
                }))
              }
              className="font-mono rounded-lg text-xs"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Giá bán sỉ / thợ (VNĐ)
            </label>
            <Input
              type="number"
              min={0}
              value={dataAdd.GiaBanSi}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  GiaBanSi: parseFloat(e.target.value) || 0,
                }))
              }
              className="font-mono rounded-lg text-xs"
            />
          </div>

          {/* Image Upload */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Ảnh biến thể / màu xe
            </label>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl border border-dashed border-border bg-muted/40 flex items-center justify-center overflow-hidden shrink-0">
                {imagePreviewAdd ? (
                  <Image
                    src={imagePreviewAdd}
                    alt="Preview"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <Boxes className="w-6 h-6 text-muted-foreground/60" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium cursor-pointer transition-colors shadow-2xs">
                  <Upload className="w-3.5 h-3.5" />
                  Tải ảnh lên
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChangeAdd}
                  />
                </label>
                {imagePreviewAdd && (
                  <button
                    type="button"
                    onClick={handleClearImageAdd}
                    className="text-xs text-rose-600 hover:underline cursor-pointer"
                  >
                    Xóa ảnh
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-2 flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/20">
            <div>
              <p className="text-xs font-medium text-foreground">
                Quản lý theo Serial
              </p>
              <p className="text-[11px] text-muted-foreground">
                Theo dõi từng chiếc theo số Khung, Máy, Pin
              </p>
            </div>
            <Switch
              id="isSerialManagedAdd"
              checked={dataAdd.QuanLyTheoSerial}
              onCheckedChange={(checked) =>
                setDataAdd((prev) => ({ ...prev, QuanLyTheoSerial: checked }))
              }
            />
          </div>

          <div className="col-span-2 flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/20">
            <div>
              <p className="text-xs font-medium text-foreground">
                Trạng thái kinh doanh
              </p>
              <p className="text-[11px] text-muted-foreground">
                Kích hoạt biến thể trong toàn hệ thống
              </p>
            </div>
            <Switch
              id="isActiveBienTheAdd"
              checked={dataAdd.TrangThai}
              onCheckedChange={(checked) =>
                setDataAdd((prev) => ({ ...prev, TrangThai: checked }))
              }
            />
          </div>
        </div>
      </SlideOver>

      {/* 6. SlideOver: CẬP NHẬT BIẾN THỂ */}
      <SlideOver
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        title={`Cập nhật Biến thể: ${dataUpdate.TenBienThe}`}
        description="Chỉnh sửa thông số SKU và giá bán"
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
          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Mã SKU <span className="text-red-500">*</span>
            </label>
            <Input
              value={dataUpdate.MaSKU}
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  MaSKU: e.target.value.toUpperCase(),
                }))
              }
              className={`font-mono uppercase rounded-lg text-xs ${errors.maSKU ? "border-red-500" : ""}`}
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Mã vạch Barcode
            </label>
            <Input
              value={dataUpdate.MaVach || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({ ...prev, MaVach: e.target.value }))
              }
              className="font-mono rounded-lg text-xs"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Tên biến thể <span className="text-red-500">*</span>
            </label>
            <Input
              value={dataUpdate.TenBienThe}
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  TenBienThe: e.target.value,
                }))
              }
              className={`rounded-lg text-xs ${errors.tenBienThe ? "border-red-500" : ""}`}
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Màu sắc
            </label>
            <Input
              value={dataUpdate.MauSac || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({ ...prev, MauSac: e.target.value }))
              }
              className="rounded-lg text-xs"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Dung lượng Pin
            </label>
            <Input
              value={dataUpdate.DungLuongPin || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  DungLuongPin: e.target.value,
                }))
              }
              className="rounded-lg text-xs font-mono"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Công suất động cơ
            </label>
            <Input
              value={dataUpdate.CongSuatDongCo || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  CongSuatDongCo: e.target.value,
                }))
              }
              className="rounded-lg text-xs font-mono"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Bảo hành (tháng)
            </label>
            <Input
              type="number"
              min={0}
              value={dataUpdate.SoThangBaoHanh}
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  SoThangBaoHanh: parseInt(e.target.value) || 0,
                }))
              }
              className="rounded-lg font-mono text-xs"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Giá bán lẻ (VNĐ) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              min={0}
              value={dataUpdate.GiaBan}
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  GiaBan: parseFloat(e.target.value) || 0,
                }))
              }
              className="font-mono rounded-lg text-xs"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Giá sỉ (VNĐ)
            </label>
            <Input
              type="number"
              min={0}
              value={dataUpdate.GiaBanSi}
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  GiaBanSi: parseFloat(e.target.value) || 0,
                }))
              }
              className="font-mono rounded-lg text-xs"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Đổi ảnh biến thể
            </label>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl border border-dashed border-border bg-muted/40 flex items-center justify-center overflow-hidden shrink-0">
                {imagePreviewUpdate ? (
                  <Image
                    src={imagePreviewUpdate}
                    alt="Preview mới"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : existingVariantImage &&
                  getImageUrl(existingVariantImage) ? (
                  <Image
                    src={getImageUrl(existingVariantImage)}
                    alt="Ảnh hiện tại"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <Boxes className="w-6 h-6 text-muted-foreground/60" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium cursor-pointer transition-colors shadow-2xs">
                  <Upload className="w-3.5 h-3.5" />
                  Chọn ảnh mới
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChangeUpdate}
                  />
                </label>
                {(imagePreviewUpdate || existingVariantImage) && (
                  <button
                    type="button"
                    onClick={handleClearImageUpdate}
                    className="text-xs text-rose-600 hover:underline cursor-pointer"
                  >
                    Xóa ảnh
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-2 flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/20">
            <div>
              <p className="text-xs font-medium text-foreground">
                Quản lý theo Serial
              </p>
              <p className="text-[11px] text-muted-foreground">
                Theo dõi từng chiếc theo số Khung, Máy, Pin
              </p>
            </div>
            <Switch
              id="isSerialManagedUpdate"
              checked={dataUpdate.QuanLyTheoSerial}
              onCheckedChange={(checked) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  QuanLyTheoSerial: checked,
                }))
              }
            />
          </div>

          <div className="col-span-2 flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/20">
            <div>
              <p className="text-xs font-medium text-foreground">
                Trạng thái kinh doanh
              </p>
              <p className="text-[11px] text-muted-foreground">
                Kích hoạt biến thể trong toàn hệ thống
              </p>
            </div>
            <Switch
              id="isActiveBienTheUpdate"
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
        title="Xác nhận xóa biến thể"
        description={
          <div>
            <p>
              Bạn có chắc chắn muốn xóa biến thể &quot;
              <strong className="text-foreground">{selectItemName}</strong>
              &quot; không?
            </p>
            <span className="text-xs text-rose-600/90 dark:text-rose-400 mt-2 block bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              Lưu ý: Không thể xóa nếu biến thể này đang có số Serial xe hoặc số
              lượng tồn kho.
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

export default function VariantsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96" />
        </div>
      }
    >
      <VariantsContent />
    </Suspense>
  );
}
