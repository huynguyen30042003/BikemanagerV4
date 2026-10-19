"use client";

import React, { useMemo, Suspense, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import {
  Store,
  Plus,
  RefreshCw,
  Search,
  SquarePen,
  Trash2,
  FolderOpen,
  Filter,
  CheckCircle2,
  XCircle,
  Building2,
  MapPin,
  Compass,
  LayoutGrid,
  List,
  Navigation,
  ExternalLink,
  Layers,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useDiaDiem } from "@/hooks/DiaDiem/useDiaDiem";
import { DM_DiaDiem } from "@/types/diaDiem";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { LocationNavTabs } from "@/components/Common/LocationNavTabs";
import { Pagination } from "@/components/Common/Pagination";
import { CreateDiaDiemSlideOver } from "@/components/DiaDiem/CreateDiaDiemSlideOver";
import { UpdateDiaDiemSlideOver } from "@/components/DiaDiem/UpdateDiaDiemSlideOver";
import { getImageUrl } from "@/shared/constants/apiConstants";

function DiaDiemContent() {
  const searchParams = useSearchParams();
  const tinhIdFromUrl = searchParams.get("tinhId") || "";

  // Dual View Mode (Showcase Grid vs Data Table)
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const shouldReduceMotion = useReducedMotion();

  // Local state for modals to isolate form re-renders from the main catalog list
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<DM_DiaDiem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    tinhFilter,
    setTinhFilter,
    searchInput,
    handleSearch,

    provinceOptions,
    provinceMap,
    parentLocationOptions,

    loaiDiaDiemOptions,
    getLoaiDiaDiemBadge,
    isLoadingLoaiDiaDiem,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    openDelete,
    setOpenDelete,
    selectItemName,
    handleOpenDelete,
    handleSubmitDelete,
    isDeleting,
  } = useDiaDiem(tinhIdFromUrl ? Number(tinhIdFromUrl) : "");

  // Metrics
  const activeCount = useMemo(
    () => items.filter((item) => item.trangThai === true).length,
    [items],
  );
  const inactiveCount = useMemo(
    () => items.filter((item) => item.trangThai === false).length,
    [items],
  );
  const showroomCount = useMemo(
    () => items.filter((item) => item.loaiDiaDiemID === 1).length,
    [items],
  );

  const filterProvinceOptions: SelectOption[] = useMemo(() => {
    return [
      { value: "", label: "-- Tất cả Tỉnh / Thành phố --" },
      ...provinceOptions,
    ];
  }, [provinceOptions]);

  const currentProvinceName = useMemo(() => {
    if (!tinhFilter) return "";
    return provinceMap.get(Number(tinhFilter)) || `Tỉnh #${tinhFilter}`;
  }, [tinhFilter, provinceMap]);

  const getLoaiBadge = (loaiId?: number | null) => {
    const badge = getLoaiDiaDiemBadge(loaiId);
    return (
      <span
        className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${badge.bgClass} ${badge.textClass} border ${badge.borderClass}`}
      >
        <Store className="w-2.5 h-2.5" />
        {badge.label}
      </span>
    );
  };

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Đã sao chép mã cơ sở!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const columns: Column<DM_DiaDiem>[] = [
    {
      key: "anhDaiDien",
      title: "Ảnh",
      classNameHeader:
        "w-16 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => {
        const imgUrl = getImageUrl(row.anhDaiDien);
        return (
          <div className="flex justify-center">
            {imgUrl ? (
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-border/60 relative bg-muted/40 shrink-0 shadow-2xs">
                <Image
                  unoptimized
                  src={imgUrl}
                  alt={row.tenDiaDiem}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg border border-border/60 bg-muted/50 flex items-center justify-center text-muted-foreground shrink-0 shadow-2xs">
                <Store className="w-4 h-4 text-muted-foreground/70" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "diaDiemID",
      title: "Mã",
      classNameHeader:
        "w-24 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <button
          type="button"
          onClick={(e) => handleCopyId(String(v), e)}
          title="Nhấn để sao chép mã"
          className="group inline-flex items-center gap-1 font-mono text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted/60 hover:bg-muted border border-border/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <span>#{String(v).substring(0, 6)}</span>
          {copiedId === String(v) ? (
            <Check className="w-3 h-3 text-emerald-500" />
          ) : (
            <Copy className="w-3 h-3 opacity-0 group-hover:opacity-70 transition-opacity" />
          )}
        </button>
      ),
    },
    {
      key: "tenDiaDiem",
      title: "Tên cơ sở / Showroom",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-1 py-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground text-sm hover:text-blue-600 transition-colors">
              {row.tenDiaDiem}
            </span>
            {getLoaiBadge(row.loaiDiaDiemID)}
          </div>
          {row.diaDiemCapChaID && (
            <div className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Layers className="w-3 h-3 text-muted-foreground/70" />
              <span>Trực thuộc: {row.tenDiaDiemCha || "Cơ sở cấp trên"}</span>
            </div>
          )}
          {row.moTa && (
            <span className="text-xs text-muted-foreground line-clamp-1 max-w-md">
              {row.moTa}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "tinhID",
      title: "Khu vực",
      classNameHeader:
        "w-52 text-left text-xs font-semibold text-muted-foreground",
      render: (tinhId, row) => {
        const tName =
          row.tenTinh ||
          provinceMap.get(Number(tinhId)) ||
          (tinhId ? `Tỉnh #${tinhId}` : "Chưa chọn tỉnh");
        return (
          <div className="flex flex-col gap-1 py-0.5">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-500/20 max-w-[190px] truncate shadow-2xs">
              <Building2 className="w-3 h-3 shrink-0 text-blue-600 dark:text-blue-400" />
              <span className="truncate">{tName}</span>
            </div>
            {row.tenXa && (
              <div className="inline-flex items-center gap-1 text-[11px] text-muted-foreground pl-0.5">
                <Compass className="w-3 h-3 text-indigo-500/80" />
                <span className="truncate">{row.tenXa}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "diaChiSo",
      title: "Địa chỉ cụ thể & Bản đồ",
      classNameHeader:
        "text-left text-xs font-semibold text-muted-foreground max-w-xs",
      render: (v, row) => (
        <div className="flex flex-col gap-1 text-xs text-foreground max-w-xs">
          <div className="flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <span className="line-clamp-2">{v || "Chưa cập nhật địa chỉ"}</span>
          </div>
          {row.kinhDo != null && row.viDo != null && (
            <a
              href={`https://www.google.com/maps?q=${row.viDo},${row.kinhDo}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-600 dark:text-blue-400 hover:underline pl-5"
              title="Mở Google Maps"
            >
              <Navigation className="w-3 h-3" />
              <span>
                {row.viDo.toFixed(4)}, {row.kinhDo.toFixed(4)}
              </span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
          )}
        </div>
      ),
    },
    {
      key: "trangThai",
      title: "Trạng thái",
      classNameHeader:
        "text-center w-32 text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) =>
        v ? (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Hoạt động
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Tạm đóng
            </span>
          </div>
        ),
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader:
        "text-center w-28 text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setEditingItem(row)}
            title="Chỉnh sửa cơ sở"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <SquarePen className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenDelete(row)}
            title="Xóa cơ sở"
            className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const hasActiveFilters = Boolean(
    searchInput || tinhFilter || statusFilter !== "all",
  );

  const handleResetFilters = () => {
    handleSearch("");
    setTinhFilter("");
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
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Chi nhánh & Showroom
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Quản lý mạng lưới showroom bán hàng, trạm dịch vụ kỹ thuật
                    và kho chi nhánh
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
                title="Tải lại danh sách cơ sở"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
                />
                <span className="text-xs font-medium">Làm mới</span>
              </Button>

              <Button
                size="sm"
                onClick={() => setOpenCreate(true)}
                className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs font-medium">Thêm cơ sở</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <LocationNavTabs activeTab="diaDiem" total_DiaDiem={totalCount} />
          </div>
        </div>
      )}

      {/* 2. Interactive KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card
          onClick={() => {
            setStatusFilter("all");
            setTinhFilter("");
            setPage(1);
          }}
          className={`p-4 rounded-xl border transition-all cursor-pointer gap-0 ${
            statusFilter === "all" && !tinhFilter
              ? "border-blue-500/50 bg-blue-500/5 shadow-xs ring-2 ring-blue-500/10"
              : "border-border/80 bg-card hover:border-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Tổng số cơ sở
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">
            {isLoading ? <Skeleton className="h-7 w-16" /> : totalCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Toàn bộ mạng lưới phân phối
          </p>
        </Card>

        <Card
          onClick={() => {
            setStatusFilter("active");
            setPage(1);
          }}
          className={`gap-0 p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === "active"
              ? "border-emerald-500/50 bg-emerald-500/5 shadow-xs ring-2 ring-emerald-500/10"
              : "border-border/80 bg-card hover:border-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Đang hoạt động
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {isLoading ? <Skeleton className="h-7 w-16" /> : activeCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Mở cửa đón khách & xuất kho
          </p>
        </Card>

        <Card
          onClick={() => {
            setStatusFilter("inactive");
            setPage(1);
          }}
          className={`gap-0 p-4 rounded-xl border transition-all cursor-pointer ${
            statusFilter === "inactive"
              ? "border-slate-500/50 bg-slate-500/5 shadow-xs ring-2 ring-slate-500/10"
              : "border-border/80 bg-card hover:border-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Tạm đóng / Khóa
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-500/10 text-slate-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-700 dark:text-slate-300">
            {isLoading ? <Skeleton className="h-7 w-16" /> : inactiveCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Bảo trì hoặc ngừng hoạt động
          </p>
        </Card>

        <Card className="gap-0 p-4 rounded-xl border border-border/80 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Showroom bán hàng
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {isLoading ? <Skeleton className="h-7 w-16" /> : showroomCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Điểm bán lẻ trực tiếp
          </p>
        </Card>
      </div>

      {/* 3. Toolbar: Tìm kiếm, Lọc tỉnh, Lọc trạng thái & Switcher View Mode */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Tìm theo tên cơ sở, địa chỉ..."
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

          {/* Filter Tỉnh / Thành phố */}
          <div className="w-full lg:w-64">
            <SearchSelect
              options={filterProvinceOptions}
              value={tinhFilter}
              onChange={(val) => {
                setTinhFilter(val ? Number(val) : "");
                setPage(1);
              }}
              placeholder="Lọc theo Tỉnh / TP..."
              className="h-9.5 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Segment Control */}
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
                Hoạt động ({activeCount})
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
                Đóng ({inactiveCount})
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-0.5 shrink-0 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Chế độ xem lưới thẻ (Showcase Grid)"
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
                title="Chế độ xem bảng chi tiết (Data Table)"
                className={`flex items-center justify-center w-8 h-8 rounded-md transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-background text-foreground shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Reload Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              disabled={isFetching}
              title="Tải lại dữ liệu"
              className="h-9 w-9 shrink-0 cursor-pointer shadow-2xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* Active Filter Chips */}
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
            {tinhFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-medium">
                <Building2 className="w-3 h-3" />
                Tỉnh: {currentProvinceName}
                <button
                  type="button"
                  onClick={() => setTinhFilter("")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                Trạng thái:{" "}
                {statusFilter === "active" ? "Đang hoạt động" : "Đã đóng"}
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

      {/* 4. Content Display (Showcase Grid vs Data Table) */}
      {isLoading ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <Card
                key={idx}
                className="rounded-xl border border-border/70 overflow-hidden space-y-3 p-4"
              >
                <Skeleton className="h-36 w-full rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6">
            <Skeleton className="h-10 w-full mb-3" />
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-12 w-full" />
          </Card>
        )
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-border/80 bg-card p-12 flex flex-col items-center justify-center text-center text-muted-foreground shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-border/50 shadow-2xs">
            <FolderOpen className="w-7 h-7 stroke-[1.5]" />
          </div>
          <p className="font-semibold text-base text-foreground">
            Không tìm thấy cơ sở hoặc showroom nào
          </p>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            {hasActiveFilters
              ? "Không có kết quả khớp với bộ lọc. Hãy điều chỉnh từ khóa hoặc xóa bớt tiêu chí lọc."
              : "Chưa có địa điểm chi nhánh nào trong hệ thống. Hãy tạo cơ sở đầu tiên!"}
          </p>
          <div className="flex items-center gap-2 mt-4">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="cursor-pointer"
              >
                Xóa bộ lọc
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => setOpenCreate(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-medium"
            >
              <Plus className="w-4 h-4 mr-1" /> Thêm cơ sở mới
            </Button>
          </div>
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
            {items.map((loc: DM_DiaDiem) => {
              const imgUrl = getImageUrl(loc.anhDaiDien);
              const tName =
                loc.tenTinh ||
                provinceMap.get(Number(loc.tinhID)) ||
                (loc.tinhID ? `Tỉnh #${loc.tinhID}` : "");

              return (
                <Card
                  key={loc.diaDiemID}
                  className="gap-0 p-0 group rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs hover:shadow-md hover:border-border transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Card Thumbnail Banner */}
                    <div className="relative h-40 w-full bg-muted/40 overflow-hidden border-b border-border/50">
                      {imgUrl ? (
                        <>
                          <Image
                            unoptimized
                            src={imgUrl}
                            alt={loc.tenDiaDiem}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-muted/40 to-indigo-500/10 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-xl bg-background/80 shadow-2xs border border-border/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                            <Store className="w-6 h-6 stroke-[1.5]" />
                          </div>
                        </div>
                      )}

                      {/* Floating Header Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 z-10">
                        {getLoaiBadge(loc.loaiDiaDiemID)}

                        {loc.trangThai ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/90 text-white backdrop-blur-md shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-900/80 text-slate-200 backdrop-blur-md shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Tạm đóng
                          </span>
                        )}
                      </div>

                      {/* ID Chip bottom overlay */}
                      <div className="absolute bottom-2 left-2.5 z-10">
                        <button
                          type="button"
                          onClick={(e) => handleCopyId(loc.diaDiemID, e)}
                          title="Nhấn để sao chép mã cơ sở"
                          className="group/btn inline-flex items-center gap-1 font-mono text-[10px] font-semibold px-2 py-0.5 rounded-md bg-background/90 hover:bg-background text-foreground border border-border/70 backdrop-blur-md transition-colors shadow-2xs cursor-pointer"
                        >
                          <span>#{loc.diaDiemID.slice(0, 8)}</span>
                          {copiedId === loc.diaDiemID ? (
                            <Check className="w-2.5 h-2.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-2.5 h-2.5 opacity-60 group-hover/btn:opacity-100" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-3.5 space-y-2.5">
                      <div>
                        <h3 className="font-semibold text-sm text-foreground line-clamp-1 hover:text-blue-600 transition-colors">
                          {loc.tenDiaDiem}
                        </h3>

                        {loc.diaDiemCapChaID && (
                          <div className="inline-flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                            <Layers className="w-3 h-3 text-muted-foreground/70" />
                            <span className="truncate">
                              Trực thuộc:{" "}
                              {loc.tenDiaDiemCha || "Cơ sở cấp trên"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Regional Tags */}
                      <div className="flex items-center gap-1.5 flex-wrap text-xs">
                        {tName && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 font-medium border border-blue-500/20 text-[11px]">
                            <Building2 className="w-3 h-3" />
                            {tName}
                          </span>
                        )}
                        {loc.tenXa && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-500/20 text-[11px]">
                            <Compass className="w-3 h-3" />
                            {loc.tenXa}
                          </span>
                        )}
                      </div>

                      {/* Specific Address */}
                      <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                          {loc.diaChiSo || "Chưa cập nhật địa chỉ chi tiết"}
                        </span>
                      </div>

                      {/* GPS Coordinates with Direct Map Link */}
                      {loc.kinhDo != null && loc.viDo != null && (
                        <div className="pt-0.5">
                          <a
                            href={`https://www.google.com/maps?q=${loc.viDo},${loc.kinhDo}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/60 hover:bg-muted text-foreground text-[11px] font-mono border border-border/60 transition-colors"
                            title="Mở Google Maps"
                          >
                            <Navigation className="w-3 h-3 text-emerald-500" />
                            <span>
                              {loc.viDo.toFixed(4)}, {loc.kinhDo.toFixed(4)}
                            </span>
                            <ExternalLink className="w-2.5 h-2.5 text-muted-foreground" />
                          </a>
                        </div>
                      )}

                      {/* Description */}
                      {loc.moTa && (
                        <p className="text-xs text-muted-foreground/80 line-clamp-2 pt-1 border-t border-border/40">
                          {loc.moTa}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-3 bg-muted/20 border-t border-border/60 flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingItem(loc)}
                      className="flex-1 h-8 text-xs cursor-pointer flex items-center justify-center gap-1.5 hover:text-blue-600 hover:border-blue-500/40"
                    >
                      <SquarePen className="w-3.5 h-3.5" />
                      <span>Chỉnh sửa</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDelete(loc)}
                      className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer shrink-0"
                      title="Xóa cơ sở"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </motion.div>

          {/* Grid View Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            itemName="cơ sở"
          />
        </div>
      ) : (
        /* DATA TABLE VIEW */
        <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
          <div className="p-3 flex flex-col gap-3 w-full">
            <Table<DM_DiaDiem>
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
              itemName="cơ sở"
            />
          </div>
        </div>
      )}

      {/* SlideOver: THÊM MỚI CƠ SỞ / SHOWROOM (Tách component riêng, cách ly form state) */}
      <CreateDiaDiemSlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        provinceOptions={provinceOptions}
        parentLocationOptions={parentLocationOptions}
        loaiDiaDiemOptions={loaiDiaDiemOptions}
        isLoadingLoaiDiaDiem={isLoadingLoaiDiaDiem}
        defaultTinhId={tinhFilter ? Number(tinhFilter) : 0}
        onSuccess={() => refetch()}
      />

      {/* SlideOver: CẬP NHẬT CƠ SỞ / SHOWROOM (Tách component riêng, cách ly form state) */}
      <UpdateDiaDiemSlideOver
        open={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        data={editingItem}
        provinceOptions={provinceOptions}
        parentLocationOptions={parentLocationOptions}
        loaiDiaDiemOptions={loaiDiaDiemOptions}
        isLoadingLoaiDiaDiem={isLoadingLoaiDiaDiem}
        onSuccess={() => refetch()}
      />

      {/* Modal Xác nhận Xóa */}
      <ConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleSubmitDelete}
        title="Xác nhận xóa cơ sở / showroom"
        description={
          <div>
            <p>
              Bạn có chắc chắn muốn xóa cơ sở &quot;
              <strong className="text-foreground">{selectItemName}</strong>
              &quot; không?
            </p>
            <span className="text-xs text-rose-600/90 dark:text-rose-400 mt-2 block bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              Hành động này không thể hoàn tác nếu cơ sở đang có giao dịch đơn
              hàng hoặc kho hàng liên kết.
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

export default function DiaDiemPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 md:p-8 min-h-screen space-y-6">
          <Skeleton className="h-8 w-60" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <DiaDiemContent />
    </Suspense>
  );
}
