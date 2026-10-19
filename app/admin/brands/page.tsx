"use client";

import React, { Suspense, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SearchSelect } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Pagination } from "@/components/Common/Pagination";
import { ProductNavTabs } from "@/components/Common/ProductNavTabs";
import { useThuongHieu } from "@/hooks/ThuongHieu/useThuongHieu";
import { SP_ThuongHieu } from "@/types/thuongHieu";
import { getImageUrl } from "@/shared/constants/apiConstants";
import {
  Tags,
  Plus,
  RefreshCw,
  Search,
  SquarePen,
  Trash2,
  FolderOpen,
  Filter,
  CheckCircle2,
  XCircle,
  Globe,
  Upload,
  AlertCircle,
  Package,
  LayoutGrid,
  List,
  ExternalLink,
  ImagePlus,
  X,
  Layers,
} from "lucide-react";

type ViewMode = "grid" | "table";

function BrandsContent() {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    searchInput,
    handleSearch,

    countryOptions,

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
  } = useThuongHieu();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [logoPreviewAdd, setLogoPreviewAdd] = useState<string | null>(null);
  const [logoPreviewUpdate, setLogoPreviewUpdate] = useState<string | null>(
    null,
  );

  const existingBrandLogo = useMemo(() => {
    return items.find((i) => i.thuongHieuID === dataUpdate.ThuongHieuID)
      ?.duongDanLogo;
  }, [items, dataUpdate.ThuongHieuID]);

  const shouldReduceMotion = useReducedMotion();

  const activeCount = useMemo(
    () => items.filter((i) => i.trangThai === true).length,
    [items],
  );
  const inactiveCount = useMemo(
    () => items.filter((i) => i.trangThai === false).length,
    [items],
  );
  const globalCount = useMemo(
    () => items.filter((i) => Boolean(i.quocGiaID)).length,
    [items],
  );

  const handleLogoChangeAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDataAdd((prev) => ({ ...prev, file }));
      setLogoPreviewAdd(URL.createObjectURL(file));
    }
  };

  const handleClearLogoAdd = () => {
    setDataAdd((prev) => ({ ...prev, file: null }));
    setLogoPreviewAdd(null);
  };

  const handleLogoChangeUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDataUpdate((prev) => ({ ...prev, file, XoaFile: false }));
      setLogoPreviewUpdate(URL.createObjectURL(file));
    }
  };

  const handleClearLogoUpdate = () => {
    setDataUpdate((prev) => ({ ...prev, file: null, XoaFile: true }));
    setLogoPreviewUpdate(null);
  };

  const hasActiveFilters = Boolean(searchInput || statusFilter !== "all");

  const handleResetFilters = () => {
    handleSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  const columns: Column<SP_ThuongHieu>[] = [
    {
      key: "maThuongHieu",
      title: "Mã hãng",
      classNameHeader:
        "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/80">
          {v ? String(v).toUpperCase() : "N/A"}
        </span>
      ),
    },
    {
      key: "tenThuongHieu",
      title: "Thương hiệu & Định danh",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => {
        const logoUrl = getImageUrl(row.duongDanLogo);
        return (
          <div className="flex items-center gap-3 py-1">
            <div className="w-10 h-10 rounded-lg bg-muted/60 border border-border/70 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={row.tenThuongHieu}
                  width={40}
                  height={40}
                  className="w-full h-full object-contain p-1"
                  unoptimized
                />
              ) : (
                <Tags className="w-4 h-4 text-muted-foreground/60" />
              )}
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-semibold text-foreground text-sm truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {row.tenThuongHieu}
              </span>
              <span className="text-[11px] text-muted-foreground font-mono truncate">
                slug: /{row.duongDan}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "quocGia",
      title: "Xuất xứ",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) =>
        v ? (
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/50 border border-border/60 text-xs text-foreground font-medium">
            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>{v}</span>
          </div>
        ) : (
          <span className="text-muted-foreground/60 text-xs">Toàn cầu</span>
        ),
    },
    {
      key: "thuTu",
      title: "Thứ tự",
      classNameHeader:
        "w-20 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="font-mono text-xs text-muted-foreground">
          {v ?? 0}
        </span>
      ),
    },
    {
      key: "trangThai",
      title: "Trạng thái",
      classNameHeader:
        "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) =>
        v ? (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Đang áp dụng
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              Tạm ngừng
            </span>
          </div>
        ),
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader:
        "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Link
            href={`/admin/products?brandId=${row.thuongHieuID}`}
            title="Xem danh mục sản phẩm của hãng"
            className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-500/10 dark:hover:text-blue-400 rounded-lg transition-colors cursor-pointer"
          >
            <Package className="w-4 h-4" />
          </Link>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setLogoPreviewUpdate(null);
              handleOpenEdit(row);
            }}
            title="Chỉnh sửa thương hiệu"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-500/10 dark:hover:text-blue-400 rounded-lg transition-colors cursor-pointer"
          >
            <SquarePen className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenDelete(row)}
            title="Xóa thương hiệu"
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
                <span>Sản phẩm</span>
                <span className="text-muted-foreground/40">/</span>
                <span className="text-foreground">Thương hiệu</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                  <Tags className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Hãng sản xuất & Thương hiệu
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Hồ sơ thương hiệu xe điện, phụ tùng và xuất xứ quốc gia được
                    công nhận
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
                  setLogoPreviewAdd(null);
                  handleModalAdd();
                }}
                className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs font-medium">Thêm thương hiệu</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <ProductNavTabs activeTab="brands" />
          </div>
        </div>
      )}

      {/* 2. Interactive KPI Metric Bar */}
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
              Tổng số thương hiệu
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Tags className="w-4 h-4" />
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
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {isLoading ? <Skeleton className="h-7 w-16" /> : activeCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Sẵn sàng liên kết khi tạo xe
          </p>
        </Card>

        <Card
          onClick={() => {
            setStatusFilter("inactive");
            setPage(1);
          }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === "inactive"
              ? "border-zinc-500/50 bg-zinc-500/5 shadow-xs ring-2 ring-zinc-500/10"
              : "border-border/80 bg-card hover:border-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Tạm ngừng / Lưu trữ
            </span>
            <div className="w-7 h-7 rounded-lg bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">
            {isLoading ? <Skeleton className="h-7 w-16" /> : inactiveCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Không xuất hiện trên bộ lọc khách
          </p>
        </Card>

        <Card className="p-4 rounded-xl border border-border/80 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Xuất xứ quốc tế
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
            {isLoading ? <Skeleton className="h-7 w-16" /> : globalCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Đã liên kết quốc gia xuất xứ
          </p>
        </Card>
      </div>

      {/* 3. Toolbar: Search, Filters & View Mode Switcher */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Tìm theo tên thương hiệu hoặc mã (HONDA, VINFAST, YADEA...)..."
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

          <div className="flex items-center gap-2">
            {/* Status Filter Segment */}
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
                    ? "bg-background shadow-xs text-zinc-700 dark:text-zinc-300 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Khóa ({inactiveCount})
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Chế độ xem lưới thương hiệu"
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
            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                Trạng thái:{" "}
                {statusFilter === "active" ? "Đang áp dụng" : "Đã khóa"}
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

      {/* 4. Main Showcase / Table Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card
              key={i}
              className="p-4 rounded-xl border border-border/70 space-y-3"
            >
              <Skeleton className="h-28 w-full rounded-lg" />
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
            Không tìm thấy thương hiệu phù hợp
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
              <Plus className="w-4 h-4 mr-1" /> Thêm thương hiệu mới
            </Button>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        /* Showcase Grid View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((brand, idx) => (
              <motion.div
                key={brand.thuongHieuID}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  delay: Math.min(idx * 0.03, 0.3),
                }}
              >
                <Card className="rounded-xl p-4 border border-border/80 bg-card hover:border-blue-500/40 hover:shadow-md transition-all duration-200 overflow-hidden group flex flex-col h-full">
                  {/* Top Bar: Brand Code & Status Dot */}
                  <div className="flex items-center justify-between border-b border-border/40 bg-muted/20">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/70">
                      {brand.maThuongHieu
                        ? brand.maThuongHieu.toUpperCase()
                        : "N/A"}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        brand.trangThai
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          brand.trangThai
                            ? "bg-emerald-500 animate-pulse"
                            : "bg-zinc-400"
                        }`}
                      />
                      {brand.trangThai ? "Hoạt động" : "Tạm khóa"}
                    </span>
                  </div>

                  {/* Logo Canvas Showcase */}
                  <div className="flex items-center justify-center bg-muted/30 relative">
                    <div className="w-24 h-24 rounded-xl bg-background border border-border/70 flex items-center justify-center p-2 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                      {brand.duongDanLogo && getImageUrl(brand.duongDanLogo) ? (
                        <Image
                          src={getImageUrl(brand.duongDanLogo)}
                          alt={brand.tenThuongHieu}
                          width={96}
                          height={96}
                          className="w-full h-full object-contain"
                          unoptimized
                        />
                      ) : (
                        <Tags className="w-8 h-8 text-muted-foreground/40 stroke-[1.5]" />
                      )}
                    </div>
                  </div>

                  {/* Info Body */}
                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-bold text-base text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                        {brand.tenThuongHieu}
                      </h3>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5 truncate">
                        slug: /{brand.duongDan}
                      </p>

                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground px-2 py-0.5 rounded bg-muted/60 border border-border/60">
                          <Globe className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          {brand.quocGia || "Toàn cầu"}
                        </span>

                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground px-2 py-0.5 rounded bg-muted/60 border border-border/60 font-mono">
                          Thứ tự: {brand.thuTu ?? 0}
                        </span>
                      </div>

                      {brand.moTa && (
                        <p className="text-xs text-muted-foreground/90 mt-2 line-clamp-2 leading-relaxed">
                          {brand.moTa}
                        </p>
                      )}
                    </div>

                    {/* Actions Row */}
                    <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                      <Link
                        href={`/admin/products?brandId=${brand.thuongHieuID}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline py-1 px-1.5 rounded hover:bg-blue-500/10 transition-colors"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Xem sản phẩm</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </Link>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => {
                            setLogoPreviewUpdate(null);
                            handleOpenEdit(brand);
                          }}
                          title="Chỉnh sửa thông tin"
                          className="h-7 w-7 text-muted-foreground hover:text-blue-600 hover:bg-blue-500/10 dark:hover:text-blue-400 rounded-md cursor-pointer"
                        >
                          <SquarePen className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleOpenDelete(brand)}
                          title="Xóa thương hiệu"
                          className="h-7 w-7 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 dark:hover:text-rose-400 rounded-md cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination Controls */}
          <Pagination
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            itemName="thương hiệu"
          />
        </div>
      ) : (
        /* Detailed Table View */
        <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
          <div className="p-3 flex flex-col gap-3 w-full">
            <Table<SP_ThuongHieu>
              data={items}
              columns={columns}
              showIndex
              startIndex={(page - 1) * pageSize}
            />

            {/* Table Pagination */}
            <Pagination
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              itemName="thương hiệu"
            />
          </div>
        </div>
      )}

      {/* 5. SlideOver: THÊM THƯƠNG HIỆU */}
      <SlideOver
        open={open}
        onClose={() => setOpen(false)}
        title="Thêm mới Thương hiệu"
        description="Đăng ký hãng sản xuất xe và linh kiện phụ tùng vào hệ thống"
        icon={Tags}
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
              Lưu thương hiệu
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Mã thương hiệu <span className="text-rose-500">*</span>
            </label>
            <Input
              value={dataAdd.MaThuongHieu}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  MaThuongHieu: e.target.value.toUpperCase(),
                  DuongDan:
                    prev.DuongDan ||
                    e.target.value.toLowerCase().replace(/\s+/g, "-"),
                }))
              }
              placeholder="HONDA, VINFAST..."
              className={`font-mono uppercase rounded-lg bg-background ${
                errors.maThuongHieu
                  ? "border-rose-500 ring-1 ring-rose-500/20"
                  : ""
              }`}
            />
            {errors.maThuongHieu && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.maThuongHieu}
              </p>
            )}
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Tên thương hiệu <span className="text-rose-500">*</span>
            </label>
            <Input
              value={dataAdd.TenThuongHieu}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  TenThuongHieu: e.target.value,
                }))
              }
              placeholder="VinFast Auto, Honda..."
              className={`rounded-lg bg-background ${
                errors.tenThuongHieu
                  ? "border-rose-500 ring-1 ring-rose-500/20"
                  : ""
              }`}
            />
            {errors.tenThuongHieu && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.tenThuongHieu}
              </p>
            )}
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Đường dẫn Slug <span className="text-rose-500">*</span>
            </label>
            <Input
              value={dataAdd.DuongDan}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, DuongDan: e.target.value }))
              }
              placeholder="vinfast-auto"
              className={`font-mono rounded-lg bg-background ${
                errors.duongDan ? "border-rose-500 ring-1 ring-rose-500/20" : ""
              }`}
            />
            <p className="text-[11px] text-muted-foreground font-mono">
              Đường dẫn thân thiện: /thuong-hieu/
              {dataAdd.DuongDan || "ten-hang"}
            </p>
            {errors.duongDan && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.duongDan}
              </p>
            )}
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Xuất xứ Quốc gia
            </label>
            <SearchSelect
              options={countryOptions}
              value={dataAdd.QuocGiaID || ""}
              onChange={(val) => {
                const opt = countryOptions.find(
                  (c: { value: number | string }) => c.value === val,
                );
                setDataAdd((prev) => ({
                  ...prev,
                  QuocGiaID: val ? Number(val) : null,
                  QuocGia: opt?.label || "",
                }));
              }}
              placeholder="Chọn quốc gia xuất xứ"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Thứ tự ưu tiên
            </label>
            <Input
              type="number"
              min={0}
              value={dataAdd.ThuTu}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  ThuTu: parseInt(e.target.value) || 0,
                }))
              }
              className="rounded-lg font-mono bg-background"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Mô tả hãng sản xuất
            </label>
            <Input
              value={dataAdd.MoTa || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, MoTa: e.target.value }))
              }
              placeholder="Mô tả về lịch sử, phân khúc sản phẩm..."
              className="rounded-lg bg-background"
            />
          </div>

          {/* Logo Uploader */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Logo thương hiệu
            </label>
            <div className="p-3 rounded-xl border border-dashed border-border/80 bg-muted/20 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl border border-border/70 bg-background flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                {logoPreviewAdd ? (
                  <Image
                    src={logoPreviewAdd}
                    alt="Logo preview"
                    width={64}
                    height={64}
                    className="w-full h-full object-contain p-1"
                    unoptimized
                  />
                ) : (
                  <Tags className="w-7 h-7 text-muted-foreground/40 stroke-[1.5]" />
                )}
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-background hover:bg-muted text-xs font-medium cursor-pointer transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Tải logo lên
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChangeAdd}
                    />
                  </label>
                  {logoPreviewAdd && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearLogoAdd}
                      className="h-8 px-2 text-xs text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                    >
                      Xóa ảnh
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Hỗ trợ định dạng PNG, JPG, SVG hoặc WebP. Kích thước đề xuất
                  200x200px.
                </p>
              </div>
            </div>
          </div>

          {/* Activation Switch */}
          <div className="col-span-2 flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-muted/20">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Trạng thái kích hoạt
              </p>
              <p className="text-xs text-muted-foreground">
                Cho phép liên kết hãng này khi quản lý xe và phụ tùng
              </p>
            </div>
            <Switch
              id="isActiveThuongHieuAdd"
              checked={dataAdd.TrangThai}
              onCheckedChange={(checked) =>
                setDataAdd((prev) => ({ ...prev, TrangThai: checked }))
              }
            />
          </div>
        </div>
      </SlideOver>

      {/* 6. SlideOver: CẬP NHẬT THƯƠNG HIỆU */}
      <SlideOver
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        title={`Chỉnh sửa Thương hiệu: ${dataUpdate.TenThuongHieu}`}
        description="Cập nhật thông tin nhận diện hãng sản xuất"
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
              Mã thương hiệu <span className="text-rose-500">*</span>
            </label>
            <Input
              value={dataUpdate.MaThuongHieu}
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  MaThuongHieu: e.target.value.toUpperCase(),
                }))
              }
              className={`font-mono uppercase rounded-lg bg-background ${
                errors.maThuongHieu
                  ? "border-rose-500 ring-1 ring-rose-500/20"
                  : ""
              }`}
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Tên thương hiệu <span className="text-rose-500">*</span>
            </label>
            <Input
              value={dataUpdate.TenThuongHieu}
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  TenThuongHieu: e.target.value,
                }))
              }
              className={`rounded-lg bg-background ${
                errors.tenThuongHieu
                  ? "border-rose-500 ring-1 ring-rose-500/20"
                  : ""
              }`}
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Đường dẫn Slug <span className="text-rose-500">*</span>
            </label>
            <Input
              value={dataUpdate.DuongDan}
              onChange={(e) =>
                setDataUpdate((prev) => ({ ...prev, DuongDan: e.target.value }))
              }
              className={`font-mono rounded-lg bg-background ${
                errors.duongDan ? "border-rose-500 ring-1 ring-rose-500/20" : ""
              }`}
            />
            <p className="text-[11px] text-muted-foreground font-mono">
              Đường dẫn thân thiện: /thuong-hieu/
              {dataUpdate.DuongDan || "ten-hang"}
            </p>
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Xuất xứ Quốc gia
            </label>
            <SearchSelect
              options={countryOptions}
              value={dataUpdate.QuocGiaID || ""}
              onChange={(val) => {
                const opt = countryOptions.find(
                  (c: { value: number | string }) => c.value === val,
                );
                setDataUpdate((prev) => ({
                  ...prev,
                  QuocGiaID: val ? Number(val) : null,
                  QuocGia: opt?.label || "",
                }));
              }}
              placeholder="Chọn quốc gia"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Thứ tự ưu tiên
            </label>
            <Input
              type="number"
              min={0}
              value={dataUpdate.ThuTu}
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  ThuTu: parseInt(e.target.value) || 0,
                }))
              }
              className="rounded-lg font-mono bg-background"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Mô tả hãng sản xuất
            </label>
            <Input
              value={dataUpdate.MoTa || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({ ...prev, MoTa: e.target.value }))
              }
              placeholder="Mô tả thông tin..."
              className="rounded-lg bg-background"
            />
          </div>

          {/* Logo Update Section */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Cập nhật Logo
            </label>
            <div className="p-3 rounded-xl border border-dashed border-border/80 bg-muted/20 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl border border-border/70 bg-background flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                {logoPreviewUpdate ? (
                  <Image
                    src={logoPreviewUpdate}
                    alt="Logo mới"
                    width={64}
                    height={64}
                    className="w-full h-full object-contain p-1"
                    unoptimized
                  />
                ) : !dataUpdate.XoaFile && existingBrandLogo ? (
                  <Image
                    src={getImageUrl(existingBrandLogo)}
                    alt="Logo hiện tại"
                    width={64}
                    height={64}
                    className="w-full h-full object-contain p-1"
                    unoptimized
                  />
                ) : (
                  <Tags className="w-7 h-7 text-muted-foreground/40 stroke-[1.5]" />
                )}
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-background hover:bg-muted text-xs font-medium cursor-pointer transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Chọn logo mới
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChangeUpdate}
                    />
                  </label>
                  {(logoPreviewUpdate || !dataUpdate.XoaFile) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearLogoUpdate}
                      className="h-8 px-2 text-xs text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                    >
                      Xóa ảnh hiện tại
                    </Button>
                  )}
                </div>
                {logoPreviewUpdate ? (
                  <p className="text-[11px] text-emerald-600 font-medium">
                    Đã chọn logo mới, bấm Lưu thay đổi để hoàn tất.
                  </p>
                ) : dataUpdate.XoaFile ? (
                  <p className="text-[11px] text-amber-600 font-medium">
                    Logo sẽ được gỡ bỏ sau khi lưu.
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    Chọn tệp hình ảnh mới nếu muốn thay đổi logo hiện có.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Activation Switch */}
          <div className="col-span-2 flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-muted/20">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Trạng thái kích hoạt
              </p>
              <p className="text-xs text-muted-foreground">
                Kích hoạt thương hiệu trong toàn hệ thống
              </p>
            </div>
            <Switch
              id="isActiveThuongHieuUpdate"
              checked={dataUpdate.TrangThai}
              onCheckedChange={(checked) =>
                setDataUpdate((prev) => ({ ...prev, TrangThai: checked }))
              }
            />
          </div>
        </div>
      </SlideOver>

      {/* 7. Modal Xóa Thương hiệu */}
      <ConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleSubmitDelete}
        title="Xác nhận xóa thương hiệu"
        description={
          <div className="space-y-2">
            <p>
              Bạn có chắc chắn muốn xóa thương hiệu &quot;
              <strong className="text-foreground">{selectItemName}</strong>
              &quot; không?
            </p>
            <span className="text-xs text-rose-600 dark:text-rose-400 block bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
              Lưu ý: Không thể xóa nếu thương hiệu này đang chứa các sản phẩm xe
              điện hoặc linh kiện phụ tùng đang lưu hành.
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

export default function BrandsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <BrandsContent />
    </Suspense>
  );
}
