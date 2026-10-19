"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/input";
import { SearchSelect } from "@/components/ui/selectSearch";
import {
  Building2,
  Plus,
  RefreshCw,
  Search,
  SquarePen,
  Trash2,
  FolderOpen,
  Filter,
  CheckCircle2,
  XCircle,
  Compass,
  Store,
  Landmark,
  LayoutGrid,
  List,
  Copy,
  Check,
  ArrowRight,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useDiaPhuongCapTinh } from "@/hooks/DiaPhuongCapTinh/useDiaPhuongCapTinh";
import { DM_DiaPhuongCapTinh, DiaPhuongCapTinhKPI } from "@/types/diaPhuongCapTinh";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { LocationNavTabs } from "@/components/Common/LocationNavTabs";
import { Pagination } from "@/components/Common/Pagination";
import { CreateDiaPhuongCapTinhSlideOver } from "@/components/DiaPhuongCapTinh/CreateDiaPhuongCapTinhSlideOver";
import { UpdateDiaPhuongCapTinhSlideOver } from "@/components/DiaPhuongCapTinh/UpdateDiaPhuongCapTinhSlideOver";

type ViewMode = "grid" | "table";

export default function DiaPhuongCapTinhPage() {
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<DM_DiaPhuongCapTinh | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const shouldReduceMotion = useReducedMotion();

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

    kpiData,
    isLoadingKPI,
    refetchKPI,

    openDelete,
    setOpenDelete,
    selectItemName,
    handleOpenDelete,
    handleSubmitDelete,
    isDeleting,

    handleSync,
    isSyncing,
  } = useDiaPhuongCapTinh();

  // Metrics (Derived KPI metrics - Ưu tiên lấy từ API GetKPI hoặc fallback lọc cục bộ)
  const activeCount = useMemo(
    () => items.filter((item) => item.trangThai === true).length,
    [items],
  );
  const inactiveCount = useMemo(
    () => items.filter((item) => item.trangThai === false).length,
    [items],
  );
  const cityCount = useMemo(
    () => items.filter((item) => item.loai === 2).length,
    [items],
  );

  const kpi = kpiData as unknown as (DiaPhuongCapTinhKPI & { data?: DiaPhuongCapTinhKPI }) | undefined;

  const total_DiaPhuongCapTinh = kpi?.data?.total_DiaPhuongCapTinh ?? kpi?.total_DiaPhuongCapTinh ?? totalCount;
  const total_HoatDong = kpi?.data?.total_HoatDong ?? kpi?.total_HoatDong ?? activeCount;
  const total_NgungHoatDong = kpi?.data?.total_NgungHoatDong ?? kpi?.total_NgungHoatDong ?? inactiveCount;
  const total_ThanhPho = kpi?.data?.total_ThanhPho ?? kpi?.total_ThanhPho ?? cityCount;

  const handleReload = () => {
    refetch();
    refetchKPI();
  };

  const kpiCards = useMemo(
    () => [
      {
        id: "all",
        label: "Tổng Tỉnh / Thành phố",
        value: total_DiaPhuongCapTinh,
        subtext: "Địa bàn cấp tỉnh trên toàn quốc",
        icon: Building2,
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-600 dark:text-blue-400",
        valueColor: "text-foreground",
        filterKey: "all",
        activeBorderClass:
          "border-blue-500/50 bg-blue-500/5 shadow-xs ring-2 ring-blue-500/10",
        isLoading: isLoadingKPI && isLoading,
      },
      {
        id: "active",
        label: "Đang hoạt động",
        value: total_HoatDong,
        subtext: "Sẵn sàng liên kết xã phường & cơ sở",
        icon: CheckCircle2,
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        valueColor: "text-emerald-600 dark:text-emerald-400",
        filterKey: "active",
        activeBorderClass:
          "border-emerald-500/50 bg-emerald-500/5 shadow-xs ring-2 ring-emerald-500/10",
        isLoading: isLoadingKPI && isLoading,
      },
      {
        id: "inactive",
        label: "Tạm ngưng / Khóa",
        value: total_NgungHoatDong,
        subtext: "Vô hiệu hóa trong biểu mẫu chọn",
        icon: XCircle,
        iconBg: "bg-slate-500/10",
        iconColor: "text-slate-600 dark:text-slate-400",
        valueColor: "text-slate-700 dark:text-slate-300",
        filterKey: "inactive",
        activeBorderClass:
          "border-slate-500/50 bg-slate-500/5 shadow-xs ring-2 ring-slate-500/10",
        isLoading: isLoadingKPI && isLoading,
      },
      {
        id: "cities",
        label: "Thành phố trực thuộc TW",
        value: total_ThanhPho,
        subtext: "Đô thị loại đặc biệt & cấp TW",
        icon: Landmark,
        iconBg: "bg-purple-500/10",
        iconColor: "text-purple-600 dark:text-purple-400",
        valueColor: "text-purple-600 dark:text-purple-400",
        isLoading: isLoadingKPI && isLoading,
      },
    ],
    [
      total_DiaPhuongCapTinh,
      total_HoatDong,
      total_NgungHoatDong,
      total_ThanhPho,
      isLoadingKPI,
      isLoading,
    ]
  );

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    toast.success(`Đã sao chép mã tỉnh: ${code}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const columns: Column<DM_DiaPhuongCapTinh>[] = [
    {
      key: "maTinh",
      title: "Mã Tỉnh",
      classNameHeader:
        "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <button
          type="button"
          onClick={(e) => handleCopyCode(String(v || ""), e)}
          title="Nhấn để sao chép mã tỉnh"
          className="group/btn inline-flex items-center gap-1.5 font-mono text-xs font-medium px-2.5 py-1 rounded-md bg-muted/70 hover:bg-muted border border-border/60 hover:border-border text-foreground transition-all cursor-pointer shadow-2xs"
        >
          <span>{v || "-"}</span>
          {copiedId === v ? (
            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Copy className="w-3 h-3 opacity-40 group-hover/btn:opacity-100 transition-opacity" />
          )}
        </button>
      ),
    },
    {
      key: "ten",
      title: "Tên Tỉnh / Thành phố",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 py-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              onClick={() => setEditingItem(row)}
              className="font-semibold text-foreground text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              {row.ten}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                row.loai === 2
                  ? "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/25"
                  : "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/25"
              }`}
            >
              {row.loai === 2 ? (
                <>
                  <Landmark className="w-2.5 h-2.5" />
                  Thành phố TW
                </>
              ) : (
                <>
                  <Building2 className="w-2.5 h-2.5" />
                  Tỉnh
                </>
              )}
            </span>
          </div>
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
      classNameHeader:
        "text-center w-20 text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="inline-flex items-center justify-center min-w-7 px-2 py-0.5 rounded text-xs font-mono bg-muted/80 text-foreground border border-border/60">
          {v ?? 0}
        </span>
      ),
    },
    {
      key: "lienKet",
      title: "Liên kết địa bàn",
      classNameHeader:
        "text-center w-48 text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex items-center justify-center gap-2">
          <Link
            href={`/admin/diaPhuongCapXa?tinhId=${row.tinhID}`}
            title="Xem danh sách Xã / Phường trực thuộc"
            className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 transition-colors cursor-pointer"
          >
            <Compass className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>Xã / Phường</span>
          </Link>

          <Link
            href={`/admin/diaDiem?tinhId=${row.tinhID}`}
            title="Xem các cơ sở, showroom thuộc tỉnh này"
            className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40 transition-colors cursor-pointer"
          >
            <Store className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            <span>Cơ sở</span>
          </Link>
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
      classNameHeader:
        "text-center w-28 text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setEditingItem(row)}
            title="Chỉnh sửa tỉnh / thành phố"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer active:scale-95"
          >
            <SquarePen className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenDelete(row)}
            title="Xóa tỉnh / thành phố"
            className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer active:scale-95"
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
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Cấp Tỉnh & Thành phố
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Quản lý danh mục địa phương cấp tỉnh, thành phố trực thuộc
                    trung ương và mạng lưới địa bàn
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
                className="h-9 px-3.5 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs active:scale-[0.98] transition-transform"
                title="Đồng bộ danh sách tỉnh/thành phố từ dữ liệu chuẩn quốc gia"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-blue-500" : ""}`}
                />
                <span className="text-xs font-medium">Đồng bộ chuẩn</span>
              </Button>

              <Button
                size="sm"
                onClick={() => setOpenCreate(true)}
                className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs font-medium">Thêm mới</span>
              </Button>
            </div>
          </div>

          {/* Location Navigation Hub */}
          <div className="flex items-center justify-between pt-1">
            <LocationNavTabs
              activeTab="tinh"
              total_DiaPhuongCapTinh={total_DiaPhuongCapTinh}
            />
          </div>
        </div>
      )}

      {/* 2. Interactive KPI Overview Cards (Render bằng map data) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          const isActive = Boolean(
            card.filterKey && statusFilter === card.filterKey
          );

          return (
            <Card
              key={card.id}
              onClick={
                card.filterKey
                  ? () => {
                      setStatusFilter(card.filterKey);
                      setPage(1);
                    }
                  : undefined
              }
              className={`p-4 gap-0 rounded-xl border transition-all ${
                card.filterKey ? "cursor-pointer" : ""
              } h-full ${
                isActive
                  ? card.activeBorderClass
                  : "border-border/80 bg-card hover:border-border hover:shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {card.label}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg ${card.iconBg} ${card.iconColor} flex items-center justify-center`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className={`mt-2 text-2xl font-bold ${card.valueColor}`}>
                {card.isLoading ? <Skeleton className="h-7 w-16" /> : card.value}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                {card.subtext}
              </p>
            </Card>
          );
        })}
      </div>

      {/* 3. Toolbar: Tìm kiếm, Lọc trạng thái & Switcher View Mode */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc mã tỉnh..."
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
                Tất cả ({total_DiaPhuongCapTinh})
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
                Sử dụng ({total_HoatDong})
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
                Khóa ({total_NgungHoatDong})
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
              onClick={handleReload}
              disabled={isFetching || isLoadingKPI}
              title="Tải lại dữ liệu"
              className="h-9 w-9 shrink-0 cursor-pointer shadow-2xs active:scale-95"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""}`}
              />
            </Button>
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
            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                Trạng thái:{" "}
                {statusFilter === "active" ? "Đang sử dụng" : "Đã khóa"}
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

      {/* 4. Content Area (Showcase Grid vs Data Table) */}
      {isLoading ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <Card
                key={idx}
                className="rounded-xl border border-border/70 p-4 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
                <div className="pt-2 border-t border-border/40 flex justify-between gap-2">
                  <Skeleton className="h-8 flex-1 rounded-lg" />
                  <Skeleton className="h-8 flex-1 rounded-lg" />
                </div>
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
            Không tìm thấy tỉnh / thành phố nào
          </p>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            {hasActiveFilters
              ? "Không có kết quả khớp với bộ lọc hiện tại. Hãy điều chỉnh từ khóa hoặc xóa bớt tiêu chí lọc."
              : "Chưa có dữ liệu tỉnh / thành phố nào trong hệ thống. Hãy thêm mới hoặc nhấn Đồng bộ chuẩn!"}
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
              variant="outline"
              size="sm"
              onClick={handleSync}
              className="cursor-pointer"
            >
              Đồng bộ ngay
            </Button>
            <Button
              size="sm"
              onClick={() => setOpenCreate(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1" /> Thêm tỉnh mới
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
            {items.map((loc: DM_DiaPhuongCapTinh) => (
              <Card
                key={loc.tinhID}
                className="group rounded-xl border border-border/80 bg-card p-4 pb-1.5 shadow-2xs hover:shadow-md hover:border-border transition-all flex flex-col justify-between gap-3 relative"
              >
                <div className="space-y-3">
                  {/* Top Bar: Loai Badge & Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${
                        loc.loai === 2
                          ? "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/25"
                          : "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/25"
                      }`}
                    >
                      {loc.loai === 2 ? (
                        <>
                          <Landmark className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                          Thành phố TW
                        </>
                      ) : (
                        <>
                          <Building2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          Tỉnh
                        </>
                      )}
                    </span>

                    {loc.trangThai ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Sử dụng
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Khóa
                      </span>
                    )}
                  </div>

                  {/* Main Header */}
                  <div>
                    <h3
                      onClick={() => setEditingItem(loc)}
                      className="text-base font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer line-clamp-1"
                      title={loc.ten}
                    >
                      {loc.ten}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {loc.tenKhongDau || "Chưa có tên không dấu"}
                    </p>
                  </div>

                  {/* Meta Chips: Mã Tỉnh & Thứ tự */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <button
                      type="button"
                      onClick={(e) => handleCopyCode(loc.maTinh, e)}
                      title="Nhấn để sao chép mã tỉnh"
                      className="group/code inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-xs bg-muted/70 hover:bg-muted text-foreground border border-border/60 transition-colors cursor-pointer shadow-2xs"
                    >
                      <span className="text-muted-foreground text-[10px]">
                        Mã:
                      </span>
                      <span className="font-semibold">{loc.maTinh}</span>
                      {copiedId === loc.maTinh ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-40 group-hover/code:opacity-100 transition-opacity" />
                      )}
                    </button>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono bg-muted/50 text-muted-foreground border border-border/40">
                      <span>#</span>
                      <span>{loc.thuTu ?? 0}</span>
                    </span>
                  </div>

                  {/* Relation Hub: Quick Links to Wards & Showrooms */}
                  <div className="pt-2 border-t border-border/50 grid grid-cols-2 gap-2 text-xs">
                    <Link
                      href={`/admin/diaPhuongCapXa?tinhId=${loc.tinhID}`}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/40 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-border/50 hover:border-blue-500/30 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer group/link"
                      title="Xem danh sách Xã / Phường trực thuộc"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Compass className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="font-medium text-[11px] truncate">
                          Xã / Phường
                        </span>
                      </div>
                      <ArrowRight className="w-3 h-3 opacity-50 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all shrink-0" />
                    </Link>

                    <Link
                      href={`/admin/diaDiem?tinhId=${loc.tinhID}`}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-border/50 hover:border-indigo-500/30 text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer group/link"
                      title="Xem các cơ sở, showroom tại tỉnh này"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Store className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="font-medium text-[11px] truncate">
                          Showroom
                        </span>
                      </div>
                      <ArrowRight className="w-3 h-3 opacity-50 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-2 border-t border-border/60 flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingItem(loc)}
                    className="h-8 px-2.5 text-xs text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer active:scale-95 flex items-center gap-1"
                  >
                    <SquarePen className="w-3.5 h-3.5" />
                    <span>Sửa</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDelete(loc)}
                    className="h-8 px-2.5 text-xs text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer active:scale-95 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa</span>
                  </Button>
                </div>
              </Card>
            ))}
          </motion.div>

          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            itemName="tỉnh/thành"
          />
        </div>
      ) : (
        /* DATA TABLE VIEW */
        <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
          <div className="p-3 flex flex-col gap-3 w-full">
            <Table<DM_DiaPhuongCapTinh>
              data={items}
              columns={columns}
              showIndex
              startIndex={(page - 1) * pageSize}
            />

            {/* Pagination */}
            <Pagination
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              itemName="tỉnh/thành"
            />
          </div>
        </div>
      )}

      {/* SlideOver: THÊM MỚI TỈNH / THÀNH PHỐ */}
      <CreateDiaPhuongCapTinhSlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={handleReload}
      />

      {/* SlideOver: CẬP NHẬT TỈNH / THÀNH PHỐ */}
      <UpdateDiaPhuongCapTinhSlideOver
        open={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        data={editingItem}
        onSuccess={handleReload}
      />

      {/* Modal Xóa */}
      <ConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleSubmitDelete}
        title="Xác nhận xóa tỉnh / thành phố"
        description={
          <div>
            <p>
              Bạn có chắc chắn muốn xóa &quot;
              <strong className="text-foreground">{selectItemName}</strong>
              &quot; không?
            </p>
            <span className="text-xs text-rose-600/90 dark:text-rose-400 mt-2 block bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              Hành động này không thể hoàn tác nếu tỉnh / thành phố này đang có
              các xã / phường hoặc cơ sở showroom liên kết.
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
