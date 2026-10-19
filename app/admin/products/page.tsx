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
import { useSanPham } from "@/hooks/SanPham/useSanPham";
import { SP_SanPham } from "@/types/sanPham";
import { getImageUrl } from "@/shared/constants/apiConstants";
import {
  Package,
  Plus,
  RefreshCw,
  Search,
  SquarePen,
  Trash2,
  FolderOpen,
  Filter,
  CheckCircle2,
  XCircle,
  Bike,
  ShieldCheck,
  Boxes,
  ImageIcon,
  Upload,
  AlertCircle,
  ShoppingBag,
  LayoutGrid,
  List,
  ExternalLink,
  X,
  Layers,
  Sparkles,
} from "lucide-react";

type ViewMode = "grid" | "table";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialBrandId = searchParams.get("brandId") || undefined;
  const initialCategoryId = searchParams.get("categoryId")
    ? Number(searchParams.get("categoryId"))
    : undefined;

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    brandFilter,
    setBrandFilter,
    categoryFilter,
    setCategoryFilter,
    searchInput,
    handleSearch,

    brandOptions,
    isLoadingBrands,
    categoryOptions,
    isLoadingCategories,

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
  } = useSanPham(initialBrandId, initialCategoryId);

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [avatarPreviewAdd, setAvatarPreviewAdd] = useState<string | null>(null);
  const [avatarPreviewUpdate, setAvatarPreviewUpdate] = useState<string | null>(
    null,
  );

  const shouldReduceMotion = useReducedMotion();

  // Metrics
  const vehicleCount = useMemo(
    () => items.filter((i) => i.laPhuongTien === true).length,
    [items],
  );
  const publishedCount = useMemo(
    () => items.filter((i) => i.daXuatBan === true).length,
    [items],
  );
  const activeCount = useMemo(
    () => items.filter((i) => i.trangThai === true).length,
    [items],
  );
  const inactiveCount = useMemo(
    () => items.filter((i) => i.trangThai === false).length,
    [items],
  );

  const existingProductAvatar = useMemo(() => {
    return items.find((i) => i.sanPhamID === dataUpdate.SanPhamID)?.anhDaiDien;
  }, [items, dataUpdate.SanPhamID]);

  const handleAvatarChangeAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDataAdd((prev) => ({ ...prev, file }));
      setAvatarPreviewAdd(URL.createObjectURL(file));
    }
  };

  const handleClearAvatarAdd = () => {
    setDataAdd((prev) => ({ ...prev, file: null }));
    setAvatarPreviewAdd(null);
  };

  const handleAvatarChangeUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDataUpdate((prev) => ({ ...prev, file, XoaFile: false }));
      setAvatarPreviewUpdate(URL.createObjectURL(file));
    }
  };

  const handleClearAvatarUpdate = () => {
    setDataUpdate((prev) => ({ ...prev, file: null, XoaFile: true }));
    setAvatarPreviewUpdate(null);
  };

  const hasActiveFilters = Boolean(
    searchInput || statusFilter !== "all" || brandFilter || categoryFilter,
  );

  const handleResetFilters = () => {
    handleSearch("");
    setStatusFilter("all");
    setBrandFilter("");
    setCategoryFilter("");
    setPage(1);
  };

  const columns: Column<SP_SanPham>[] = [
    {
      key: "maSanPham",
      title: "Mã SP",
      classNameHeader:
        "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/80">
          {v ? String(v).toUpperCase() : "N/A"}
        </span>
      ),
    },
    {
      key: "tenSanPham",
      title: "Sản phẩm / Dòng xe",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => {
        const avatarUrl = getImageUrl(row.anhDaiDien);
        return (
          <div className="flex items-center gap-3 py-1">
            <div className="w-11 h-11 rounded-lg bg-muted/60 border border-border/70 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={row.tenSanPham}
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : row.laPhuongTien ? (
                <Bike className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              ) : (
                <Package className="w-5 h-5 text-muted-foreground/60" />
              )}
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground text-sm truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {row.tenSanPham}
                </span>
                {row.laPhuongTien ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                    <Bike className="w-3 h-3" />
                    Xe nguyên chiếc
                  </span>
                ) : (
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border/60">
                    Phụ tùng
                  </span>
                )}
              </div>
              <span className="text-[11px] text-muted-foreground line-clamp-1 font-mono">
                {row.moTaNgan || `slug: /${row.duongDan}`}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "thuongHieuID",
      title: "Hãng sản xuất",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <span className="font-medium text-xs text-foreground px-2 py-0.5 rounded-md bg-muted/60 border border-border/60">
          {row.tenThuongHieu || "N/A"}
        </span>
      ),
    },
    {
      key: "danhMucChiTietID",
      title: "Ngành hàng",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <span className="text-xs text-muted-foreground">
          {row.tenDanhMucChiTiet || "Chưa phân loại"}
        </span>
      ),
    },
    {
      key: "soThangBaoHanhMacDinh",
      title: "Bảo hành",
      classNameHeader:
        "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          {v ?? 12} tháng
        </span>
      ),
    },
    {
      key: "trangThai",
      title: "Trạng thái",
      classNameHeader:
        "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v, row) => (
        <div className="flex flex-col items-center gap-1">
          {v ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Kinh doanh
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              Ngừng bán
            </span>
          )}

          {row.daXuatBan && (
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
              Niêm yết quầy
            </span>
          )}
        </div>
      ),
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Link
            href={`/admin/product-variants?productId=${row.sanPhamID}`}
            title="Quản lý biến thể màu / pin"
            className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-500/10 dark:hover:text-indigo-400 rounded-lg transition-colors cursor-pointer"
          >
            <Boxes className="w-4 h-4" />
          </Link>

          <Link
            href={`/admin/product-images?productId=${row.sanPhamID}`}
            title="Quản lý album ảnh gallery"
            className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-sky-600 hover:bg-sky-500/10 dark:hover:text-sky-400 rounded-lg transition-colors cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" />
          </Link>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setAvatarPreviewUpdate(null);
              handleOpenEdit(row);
            }}
            title="Chỉnh sửa sản phẩm"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-500/10 dark:hover:text-blue-400 rounded-lg transition-colors cursor-pointer"
          >
            <SquarePen className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenDelete(row)}
            title="Xóa sản phẩm"
            className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 dark:hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-8 min-h-screen space-y-6 max-w-[1600px] mx-auto">
      {/* 1. Header Section */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
      ) : (
        <div className="flex flex-col gap-4 pb-4 border-b border-border/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider mb-1">
                <span>Hệ thống</span>
                <span className="text-muted-foreground/40">/</span>
                <span>Kinh doanh</span>
                <span className="text-muted-foreground/40">/</span>
                <span className="text-foreground">Sản phẩm</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Sản phẩm & Dòng xe điện
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Hồ sơ phương tiện, xe máy điện, pin ắc quy và phụ tùng thay
                    thế chính hãng
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
                  setAvatarPreviewAdd(null);
                  handleModalAdd();
                }}
                className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs font-medium">Thêm sản phẩm</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <ProductNavTabs activeTab="products" />
          </div>
        </div>
      )}

      {/* 2. Interactive KPI Metric Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <Card
          onClick={() => {
            setBrandFilter("");
            setCategoryFilter("");
            setStatusFilter("all");
            setPage(1);
          }}
          className={`p-4 gap-0 rounded-xl border transition-all cursor-pointer ${
            !brandFilter && !categoryFilter && statusFilter === "all"
              ? "border-blue-500/50 bg-blue-500/5 shadow-xs ring-2 ring-blue-500/10"
              : "border-border/80 bg-card hover:border-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Tổng số dòng sản phẩm
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">
            {isLoading ? <Skeleton className="h-7 w-16" /> : totalCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Đăng ký trong toàn hệ thống
          </p>
        </Card>

        <Card className="p-4 gap-0 rounded-xl border border-border/80 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Dòng xe nguyên chiếc
            </span>
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-sky-600 dark:text-sky-400">
            {isLoading ? <Skeleton className="h-7 w-16" /> : vehicleCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Tự động sinh hồ sơ phương tiện
          </p>
        </Card>

        <Card className="p-4 gap-0 rounded-xl border border-border/80 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Niêm yết bán POS
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {isLoading ? <Skeleton className="h-7 w-16" /> : publishedCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Cho phép xuất bán tại quầy
          </p>
        </Card>

        <Card
          onClick={() => {
            setStatusFilter("active");
            setPage(1);
          }}
          className={`p-4 gap-0 rounded-xl border transition-all cursor-pointer ${
            statusFilter === "active"
              ? "border-emerald-500/50 bg-emerald-500/5 shadow-xs ring-2 ring-emerald-500/10"
              : "border-border/80 bg-card hover:border-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Đang kinh doanh
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {isLoading ? <Skeleton className="h-7 w-16" /> : activeCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Sản phẩm đang lưu hành
          </p>
        </Card>
      </div>

      {/* 3. Toolbar & Multi-Filter Bar */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Tìm theo tên sản phẩm, mã (SP-FELIZ-S, SP-KLARA...)..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 pr-8 h-9.5 w-full bg-background/90 text-sm focus-visible:ring-blue-500/20"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground w-4 h-4 rounded-full flex items-center justify-center hover:bg-muted cursor-pointer transition-colors"
                aria-label="Xóa từ khóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Lọc Hãng */}
            <div className="w-48">
              <SearchSelect
                options={[
                  { value: "", label: "Tất cả thương hiệu" },
                  ...brandOptions,
                ]}
                value={brandFilter}
                onChange={(val) => {
                  setBrandFilter(String(val));
                  setPage(1);
                }}
                placeholder="Chọn thương hiệu"
                isLoading={isLoadingBrands}
                className="h-9.5 text-xs"
                height={9.5}
              />
            </div>

            {/* Lọc Ngành hàng */}
            <div className="w-48">
              <SearchSelect
                options={[
                  { value: "", label: "Tất cả ngành hàng" },
                  ...categoryOptions,
                ]}
                value={categoryFilter}
                onChange={(val) => {
                  setCategoryFilter(val ? Number(val) : "");
                  setPage(1);
                }}
                placeholder="Chọn ngành hàng"
                isLoading={isLoadingCategories}
                className="h-9.5 text-xs"
                height={9.5}
              />
            </div>

            {/* Lọc Trạng thái */}
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
                Kinh doanh
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("inactive");
                  setPage(1);
                }}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  statusFilter === "inactive"
                    ? "bg-background shadow-xs text-zinc-700 dark:text-zinc-300 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Ngừng bán
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Chế độ xem lưới sản phẩm"
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-background text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                title="Chế độ xem bảng dữ liệu"
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-background text-blue-600 dark:text-blue-400 shadow-xs"
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
                  className="hover:text-rose-500 cursor-pointer ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {brandFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                Hãng:{" "}
                {brandOptions.find(
                  (b: { value: string | number; label: string }) =>
                    String(b.value) === String(brandFilter),
                )?.label || brandFilter}
                <button
                  type="button"
                  onClick={() => setBrandFilter("")}
                  className="hover:text-rose-500 cursor-pointer ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {categoryFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                Ngành hàng:{" "}
                {categoryOptions.find(
                  (c: { value: string | number; label: string }) =>
                    String(c.value) === String(categoryFilter),
                )?.label || categoryFilter}
                <button
                  type="button"
                  onClick={() => setCategoryFilter("")}
                  className="hover:text-rose-500 cursor-pointer ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                Trạng thái:{" "}
                {statusFilter === "active" ? "Kinh doanh" : "Ngừng bán"}
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className="hover:text-rose-500 cursor-pointer ml-0.5"
                >
                  <X className="w-3 h-3" />
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

      {/* 4. Main Products Showcase / Table Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card
              key={i}
              className="p-4 rounded-xl border border-border/70 space-y-3"
            >
              <Skeleton className="h-36 w-full rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-border/80 bg-card p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mx-auto mb-3 border border-border/50 shadow-2xs">
            <FolderOpen className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h2 className="font-semibold text-base text-foreground">
            Không tìm thấy sản phẩm phù hợp
          </h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
            Không có kết quả nào tương ứng với điều kiện tìm kiếm hoặc bộ lọc
            hiện tại.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="cursor-pointer"
              >
                Đặt lại bộ lọc
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleModalAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1" /> Thêm sản phẩm mới
            </Button>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        /* Showcase Grid View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((product, idx) => {
              const avatarUrl = getImageUrl(product.anhDaiDien);
              return (
                <motion.div
                  key={product.sanPhamID}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: Math.min(idx * 0.03, 0.3),
                  }}
                >
                  <Card className="rounded-xl border border-border/80 bg-card hover:border-blue-500/40 hover:shadow-md transition-all duration-200 overflow-hidden group flex flex-col h-full">
                    {/* Top Bar: Code & Category Tag */}
                    <div className="px-4 flex items-center justify-between border-b border-border/40 bg-muted/20">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/70">
                        {product.maSanPham
                          ? product.maSanPham.toUpperCase()
                          : "N/A"}
                      </span>

                      {product.laPhuongTien ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                          <Bike className="w-3 h-3" />
                          Xe nguyên chiếc
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border/60">
                          <Package className="w-3 h-3" />
                          Phụ tùng
                        </span>
                      )}
                    </div>

                    {/* Image Canvas Showcase */}
                    <div className="relative aspect-16/10 w-full bg-muted/30 flex items-center justify-center overflow-hidden border-b border-border/40">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt={product.tenSanPham}
                          width={400}
                          height={250}
                          className="w-auto h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      ) : product.laPhuongTien ? (
                        <div className="w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400">
                          <Bike className="w-8 h-8" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground/60">
                          <Package className="w-8 h-8" />
                        </div>
                      )}

                      {/* Floating Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium backdrop-blur-md shadow-xs ${
                            product.trangThai
                              ? "bg-emerald-500/90 text-white"
                              : "bg-zinc-800/80 text-zinc-300"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          {product.trangThai ? "Kinh doanh" : "Ngừng bán"}
                        </span>
                      </div>

                      {product.daXuatBan && (
                        <div className="absolute top-2 right-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600/90 text-white shadow-xs backdrop-blur-md">
                            <ShoppingBag className="w-3 h-3" />
                            POS
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info Body */}
                    <div className="px-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-bold text-base text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                          {product.tenSanPham}
                        </h3>

                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {product.tenThuongHieu && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted/80 text-foreground border border-border/60">
                              {product.tenThuongHieu}
                            </span>
                          )}

                          {product.tenDanhMucChiTiet && (
                            <span className="text-xs text-muted-foreground">
                              {product.tenDanhMucChiTiet}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground px-2 py-0.5 rounded bg-muted/60 border border-border/60">
                            <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            BH: {product.soThangBaoHanhMacDinh ?? 12} tháng
                          </span>

                          <span className="text-[11px] font-mono text-muted-foreground truncate max-w-[140px]">
                            /{product.duongDan}
                          </span>
                        </div>

                        {product.moTaNgan && (
                          <p className="text-xs text-muted-foreground/90 mt-2 line-clamp-2 leading-relaxed">
                            {product.moTaNgan}
                          </p>
                        )}
                      </div>

                      {/* Action Links & Buttons */}
                      <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/admin/product-variants?productId=${product.sanPhamID}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline py-1 px-1.5 rounded hover:bg-indigo-500/10 transition-colors"
                            title="Quản lý biến thể màu sắc và dung lượng pin"
                          >
                            <Boxes className="w-3.5 h-3.5" />
                            <span>Biến thể</span>
                          </Link>

                          <Link
                            href={`/admin/product-images?productId=${product.sanPhamID}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline py-1 px-1.5 rounded hover:bg-sky-500/10 transition-colors"
                            title="Quản lý bộ sưu tập ảnh"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Ảnh</span>
                          </Link>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => {
                              setAvatarPreviewUpdate(null);
                              handleOpenEdit(product);
                            }}
                            title="Chỉnh sửa sản phẩm"
                            className="h-7 w-7 text-muted-foreground hover:text-blue-600 hover:bg-blue-500/10 dark:hover:text-blue-400 rounded-md cursor-pointer"
                          >
                            <SquarePen className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => handleOpenDelete(product)}
                            title="Xóa sản phẩm"
                            className="h-7 w-7 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 dark:hover:text-rose-400 rounded-md cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Grid Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl border border-border/80 bg-card shadow-2xs text-xs text-muted-foreground">
            <div>
              Hiển thị{" "}
              <strong className="text-foreground">{items.length}</strong> trên
              tổng số <strong className="text-foreground">{totalCount}</strong>{" "}
              sản phẩm (Trang {page} / {totalPages})
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground text-xs whitespace-nowrap">
                  Hiển thị:
                </span>
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
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="h-8 px-2.5 text-xs cursor-pointer"
              >
                Trang trước
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                className="h-8 px-2.5 text-xs cursor-pointer"
              >
                Trang sau
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Detailed Table View */
        <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
          <div className="p-3 flex flex-col gap-3 w-full">
            <Table<SP_SanPham>
              data={items}
              columns={columns}
              showIndex
              startIndex={(page - 1) * pageSize}
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/70 text-xs text-muted-foreground">
              <div>
                Trang <strong className="text-foreground">{page}</strong> /{" "}
                {totalPages} (Tổng{" "}
                <strong className="text-foreground">{totalCount}</strong> sản
                phẩm)
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-xs whitespace-nowrap">
                    Hiển thị:
                  </span>
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
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="h-8 px-2.5 text-xs cursor-pointer"
                >
                  Trang trước
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  className="h-8 px-2.5 text-xs cursor-pointer"
                >
                  Trang sau
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. SlideOver: THÊM SẢN PHẨM */}
      <SlideOver
        open={open}
        onClose={() => setOpen(false)}
        title="Thêm mới Sản phẩm / Dòng xe"
        description="Đăng ký mã sản phẩm, thương hiệu và cấu hình kinh doanh"
        icon={Package}
        footer={
          <div className="flex items-center gap-2 w-full">
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
              Lưu sản phẩm
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Mã sản phẩm <span className="text-rose-500">*</span>
            </label>
            <Input
              value={dataAdd.MaSanPham}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  MaSanPham: e.target.value.toUpperCase(),
                  DuongDan:
                    prev.DuongDan ||
                    e.target.value.toLowerCase().replace(/\s+/g, "-"),
                }))
              }
              placeholder="SP-FELIZ-S..."
              className={`font-mono uppercase rounded-lg bg-background ${
                errors.maSanPham
                  ? "border-rose-500 ring-1 ring-rose-500/20"
                  : ""
              }`}
            />
            {errors.maSanPham && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.maSanPham}
              </p>
            )}
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Tên sản phẩm <span className="text-rose-500">*</span>
            </label>
            <Input
              value={dataAdd.TenSanPham}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, TenSanPham: e.target.value }))
              }
              placeholder="Xe máy điện VinFast Feliz S..."
              className={`rounded-lg bg-background ${
                errors.tenSanPham
                  ? "border-rose-500 ring-1 ring-rose-500/20"
                  : ""
              }`}
            />
            {errors.tenSanPham && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.tenSanPham}
              </p>
            )}
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Thương hiệu hãng <span className="text-rose-500">*</span>
            </label>
            <SearchSelect
              options={brandOptions}
              value={dataAdd.ThuongHieuID}
              onChange={(val) =>
                setDataAdd((prev) => ({ ...prev, ThuongHieuID: String(val) }))
              }
              placeholder="Chọn hãng sản xuất"
              isLoading={isLoadingBrands}
              className={
                errors.thuongHieuID
                  ? "border-rose-500 ring-1 ring-rose-500/20"
                  : ""
              }
            />
            {errors.thuongHieuID && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.thuongHieuID}
              </p>
            )}
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Ngành hàng / Danh mục <span className="text-rose-500">*</span>
            </label>
            <SearchSelect
              options={categoryOptions}
              value={dataAdd.DanhMucChiTietID || ""}
              onChange={(val) =>
                setDataAdd((prev) => ({
                  ...prev,
                  DanhMucChiTietID: Number(val),
                }))
              }
              placeholder="Chọn ngành hàng"
              isLoading={isLoadingCategories}
              className={
                errors.danhMucChiTietID
                  ? "border-rose-500 ring-1 ring-rose-500/20"
                  : ""
              }
            />
            {errors.danhMucChiTietID && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.danhMucChiTietID}
              </p>
            )}
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Đường dẫn Slug URL
            </label>
            <Input
              value={dataAdd.DuongDan}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, DuongDan: e.target.value }))
              }
              placeholder="vinfast-feliz-s"
              className="font-mono rounded-lg bg-background"
            />
            <p className="text-[11px] text-muted-foreground font-mono">
              Đường dẫn thân thiện: /san-pham/
              {dataAdd.DuongDan || "ten-san-pham"}
            </p>
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Bảo hành mặc định (tháng)
            </label>
            <Input
              type="number"
              min={0}
              value={dataAdd.SoThangBaoHanhMacDinh}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  SoThangBaoHanhMacDinh: parseInt(e.target.value) || 0,
                }))
              }
              className="rounded-lg font-mono bg-background"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Mô tả ngắn
            </label>
            <Input
              value={dataAdd.MoTaNgan || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, MoTaNgan: e.target.value }))
              }
              placeholder="Dòng xe máy điện đô thị thanh lịch, pin LFP bền bỉ..."
              className="rounded-lg bg-background"
            />
          </div>

          {/* Avatar Uploader */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Ảnh đại diện sản phẩm
            </label>
            <div className="p-3 rounded-xl border border-dashed border-border/80 bg-muted/20 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl border border-border/70 bg-background flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                {avatarPreviewAdd ? (
                  <Image
                    src={avatarPreviewAdd}
                    alt="Preview"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <Package className="w-7 h-7 text-muted-foreground/40 stroke-[1.5]" />
                )}
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-background hover:bg-muted text-xs font-medium cursor-pointer transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Tải ảnh lên
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChangeAdd}
                    />
                  </label>
                  {avatarPreviewAdd && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAvatarAdd}
                      className="h-8 px-2 text-xs text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                    >
                      Xóa ảnh
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Hỗ trợ định dạng PNG, JPG hoặc WebP. Kích thước đề xuất
                  800x600px.
                </p>
              </div>
            </div>
          </div>

          {/* Switches */}
          <div className="col-span-2 flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-muted/20">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Xe nguyên chiếc
              </p>
              <p className="text-xs text-muted-foreground">
                Tự động sinh hồ sơ phương tiện khách hàng khi bán xe
              </p>
            </div>
            <Switch
              id="isVehicleAdd"
              checked={dataAdd.LaPhuongTien}
              onCheckedChange={(checked) =>
                setDataAdd((prev) => ({ ...prev, LaPhuongTien: checked }))
              }
            />
          </div>

          <div className="col-span-2 flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-muted/20">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Niêm yết bán tại quầy
              </p>
              <p className="text-xs text-muted-foreground">
                Cho phép hiển thị và tạo đơn bán hàng tại quầy POS
              </p>
            </div>
            <Switch
              id="isPublishedAdd"
              checked={dataAdd.DaXuatBan}
              onCheckedChange={(checked) =>
                setDataAdd((prev) => ({ ...prev, DaXuatBan: checked }))
              }
            />
          </div>

          <div className="col-span-2 flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-muted/20">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Trạng thái kinh doanh
              </p>
              <p className="text-xs text-muted-foreground">
                Kích hoạt dòng sản phẩm trong toàn hệ thống
              </p>
            </div>
            <Switch
              id="isActiveSanPhamAdd"
              checked={dataAdd.TrangThai}
              onCheckedChange={(checked) =>
                setDataAdd((prev) => ({ ...prev, TrangThai: checked }))
              }
            />
          </div>
        </div>
      </SlideOver>

      {/* 6. SlideOver: CẬP NHẬT SẢN PHẨM */}
      <SlideOver
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        title={`Chỉnh sửa Sản phẩm: ${dataUpdate.TenSanPham}`}
        description="Cập nhật thông số dòng xe và cấu hình hệ thống"
        icon={SquarePen}
        footer={
          <div className="flex items-center gap-2 w-full">
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
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Mã sản phẩm <span className="text-rose-500">*</span>
            </label>
            <Input
              value={dataUpdate.MaSanPham}
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  MaSanPham: e.target.value.toUpperCase(),
                }))
              }
              className={`font-mono uppercase rounded-lg bg-background ${
                errors.maSanPham
                  ? "border-rose-500 ring-1 ring-rose-500/20"
                  : ""
              }`}
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Tên sản phẩm <span className="text-rose-500">*</span>
            </label>
            <Input
              value={dataUpdate.TenSanPham}
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  TenSanPham: e.target.value,
                }))
              }
              className={`rounded-lg bg-background ${
                errors.tenSanPham
                  ? "border-rose-500 ring-1 ring-rose-500/20"
                  : ""
              }`}
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Thương hiệu hãng
            </label>
            <SearchSelect
              options={brandOptions}
              value={dataUpdate.ThuongHieuID}
              onChange={(val) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  ThuongHieuID: String(val),
                }))
              }
              placeholder="Chọn hãng sản xuất"
              isLoading={isLoadingBrands}
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Ngành hàng / Danh mục
            </label>
            <SearchSelect
              options={categoryOptions}
              value={dataUpdate.DanhMucChiTietID}
              onChange={(val) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  DanhMucChiTietID: Number(val),
                }))
              }
              placeholder="Chọn ngành hàng"
              isLoading={isLoadingCategories}
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Đường dẫn Slug URL
            </label>
            <Input
              value={dataUpdate.DuongDan}
              onChange={(e) =>
                setDataUpdate((prev) => ({ ...prev, DuongDan: e.target.value }))
              }
              className="font-mono rounded-lg bg-background"
            />
            <p className="text-[11px] text-muted-foreground font-mono">
              Đường dẫn thân thiện: /san-pham/
              {dataUpdate.DuongDan || "ten-san-pham"}
            </p>
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Bảo hành (tháng)
            </label>
            <Input
              type="number"
              min={0}
              value={dataUpdate.SoThangBaoHanhMacDinh}
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  SoThangBaoHanhMacDinh: parseInt(e.target.value) || 0,
                }))
              }
              className="rounded-lg font-mono bg-background"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Mô tả ngắn
            </label>
            <Input
              value={dataUpdate.MoTaNgan || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({ ...prev, MoTaNgan: e.target.value }))
              }
              className="rounded-lg bg-background"
            />
          </div>

          {/* Avatar Update Section */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Cập nhật Ảnh đại diện
            </label>
            <div className="p-3 rounded-xl border border-dashed border-border/80 bg-muted/20 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl border border-border/70 bg-background flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                {avatarPreviewUpdate ? (
                  <Image
                    src={avatarPreviewUpdate}
                    alt="Preview mới"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : !dataUpdate.XoaFile && existingProductAvatar ? (
                  <Image
                    src={getImageUrl(existingProductAvatar)}
                    alt="Ảnh hiện tại"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <Package className="w-7 h-7 text-muted-foreground/40 stroke-[1.5]" />
                )}
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-background hover:bg-muted text-xs font-medium cursor-pointer transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Chọn ảnh mới
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChangeUpdate}
                    />
                  </label>
                  {(avatarPreviewUpdate || !dataUpdate.XoaFile) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAvatarUpdate}
                      className="h-8 px-2 text-xs text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                    >
                      Xóa ảnh hiện tại
                    </Button>
                  )}
                </div>
                {avatarPreviewUpdate ? (
                  <p className="text-[11px] text-emerald-600 font-medium">
                    Đã chọn ảnh mới, bấm Lưu thay đổi để hoàn tất.
                  </p>
                ) : dataUpdate.XoaFile ? (
                  <p className="text-[11px] text-amber-600 font-medium">
                    Ảnh đại diện sẽ được gỡ bỏ sau khi lưu.
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    Chọn tệp hình ảnh mới nếu muốn thay đổi ảnh hiện tại.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Switches */}
          <div className="col-span-2 flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-muted/20">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Xe nguyên chiếc
              </p>
              <p className="text-xs text-muted-foreground">
                Tự động sinh hồ sơ phương tiện khi bán
              </p>
            </div>
            <Switch
              id="isVehicleUpdate"
              checked={dataUpdate.LaPhuongTien}
              onCheckedChange={(checked) =>
                setDataUpdate((prev) => ({ ...prev, LaPhuongTien: checked }))
              }
            />
          </div>

          <div className="col-span-2 flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-muted/20">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Niêm yết bán tại quầy
              </p>
              <p className="text-xs text-muted-foreground">
                Cho phép bán hàng tại quầy POS
              </p>
            </div>
            <Switch
              id="isPublishedUpdate"
              checked={dataUpdate.DaXuatBan}
              onCheckedChange={(checked) =>
                setDataUpdate((prev) => ({ ...prev, DaXuatBan: checked }))
              }
            />
          </div>

          <div className="col-span-2 flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-muted/20">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Trạng thái kinh doanh
              </p>
              <p className="text-xs text-muted-foreground">
                Kích hoạt sản phẩm trong toàn hệ thống
              </p>
            </div>
            <Switch
              id="isActiveSanPhamUpdate"
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
        title="Xác nhận xóa sản phẩm"
        description={
          <div className="space-y-2">
            <p>
              Bạn có chắc chắn muốn xóa sản phẩm &quot;
              <strong className="text-foreground">{selectItemName}</strong>
              &quot; không?
            </p>
            <span className="text-xs text-rose-600 dark:text-rose-400 block bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
              Lưu ý: Không thể xóa nếu sản phẩm này đã có các biến thể màu/pin
              hoặc phát sinh dữ liệu tồn kho.
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

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
