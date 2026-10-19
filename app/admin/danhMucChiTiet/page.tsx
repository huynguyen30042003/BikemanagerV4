"use client";

import React, { useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/input";
import {
  FolderTree,
  Plus,
  RefreshCw,
  Search,
  SquarePen,
  Trash2,
  FolderOpen,
  Filter,
  ListTree,
  CheckCircle2,
  XCircle,
  ExternalLink,
  LayoutGrid,
  List,
} from "lucide-react";
import { useDanhMucChiTiet } from "@/hooks/DanhMucChiTiet/useDanhMucChiTiet";
import { DM_DanhMucChiTiet } from "@/types/danhMucChiTiet";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { CategoryNavTabs } from "@/components/Common/CategoryNavTabs";
import { Pagination } from "@/components/Common/Pagination";
import { CreateDanhMucChiTietSlideOver } from "@/components/DanhMucChiTiet/CreateDanhMucChiTietSlideOver";
import { UpdateDanhMucChiTietSlideOver } from "@/components/DanhMucChiTiet/UpdateDanhMucChiTietSlideOver";

type ViewMode = "grid" | "table";

function DanhMucChiTietContent() {
  const searchParams = useSearchParams();
  const parentIdParam =
    searchParams.get("danhMucId") || searchParams.get("parentId") || "";

  const {
    // Pagination & Search
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    parentCategoryFilter,
    setParentCategoryFilter,
    searchInput,
    handleSearch,

    // Parent category options
    parentCategories,
    parentCategoryOptions,
    parentCategoryMap,
    isLoadingParent,

    // Data query
    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    // KPI data from /api/DanhMucChiTiet/GetKPI
    kpiData,
    isLoadingKPI,
    refetchKPI,

    // Delete state & actions
    openDelete,
    setOpenDelete,
    selectItemName,
    handleOpenDelete,
    handleSubmitDelete,
    isDeleting,

    // Sync
    handleSync,
    isSyncing,
  } = useDanhMucChiTiet(parentIdParam ? Number(parentIdParam) : "");

  // Local modal states to isolate form re-renders from the main catalog list
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<DM_DanhMucChiTiet | null>(
    null,
  );

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const shouldReduceMotion = useReducedMotion();

  // Derived KPI metrics (Lấy trực tiếp từ API GetKPI hoặc fallback tính cục bộ)
  const activeCount = useMemo(
    () =>
      items.filter((item: DM_DanhMucChiTiet) => item.trangThai === true).length,
    [items],
  );
  const inactiveCount = useMemo(
    () =>
      items.filter((item: DM_DanhMucChiTiet) => item.trangThai === false)
        .length,
    [items],
  );

  const total_DanhMucChiTiet = kpiData?.total_DanhMucChiTiet ?? totalCount;
  const total_HoatDong = kpiData?.total_HoatDong ?? activeCount;
  const total_NgungHoatDong = kpiData?.total_NgungHoatDong ?? inactiveCount;
  const total_DanhMucChung =
    kpiData?.total_DanhMucChung ?? parentCategories.length;

  const kpiCards = useMemo(
    () => [
      {
        id: "all",
        label: "Tổng mục chi tiết",
        value: total_DanhMucChiTiet,
        subtext: "Trên toàn bộ hệ thống",
        icon: ListTree,
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
        subtext: "Sẵn sàng để gán dữ liệu",
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
        subtext: "Không thể chọn mới",
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
        id: "parent",
        label: "Danh mục cha liên kết",
        value: total_DanhMucChung,
        subtext: "Nhóm danh mục dùng chung",
        icon: FolderTree,
        iconBg: "bg-purple-500/10",
        iconColor: "text-purple-600 dark:text-purple-400",
        valueColor: "text-purple-600 dark:text-purple-400",
        href: "/admin/danhMucChung",
        isLoading: isLoadingKPI && isLoadingParent,
      },
    ],
    [
      total_DanhMucChiTiet,
      total_HoatDong,
      total_NgungHoatDong,
      total_DanhMucChung,
      isLoadingKPI,
      isLoading,
      isLoadingParent,
    ],
  );

  const maxThuTu = useMemo(() => {
    return items.length > 0
      ? Math.max(...items.map((i: DM_DanhMucChiTiet) => i.thuTu ?? 0))
      : 0;
  }, [items]);

  // Filter options for parent category toolbar (includes "All" option)
  const filterParentOptions: SelectOption[] = useMemo(() => {
    return [
      { value: "", label: "Tất cả danh mục cha" },
      ...parentCategoryOptions,
    ];
  }, [parentCategoryOptions]);

  // Selected parent name for active filter chip display
  const currentParentName = useMemo(() => {
    if (!parentCategoryFilter) return "";
    return (
      parentCategoryMap.get(Number(parentCategoryFilter)) ||
      `Danh mục #${parentCategoryFilter}`
    );
  }, [parentCategoryFilter, parentCategoryMap]);

  // Helper to get parent category name
  const getParentName = (danhMucId?: number, row?: DM_DanhMucChiTiet) => {
    return (
      row?.tenDanhMuc ||
      row?.tenDanhMucChung ||
      (danhMucId ? parentCategoryMap.get(Number(danhMucId)) : "") ||
      `Danh mục #${danhMucId || 0}`
    );
  };

  // Cấu hình các cột của bảng
  const columns: Column<DM_DanhMucChiTiet>[] = [
    {
      key: "danhMucChiTietID",
      title: "Mã",
      classNameHeader:
        "w-20 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="font-mono text-xs text-muted-foreground font-medium px-2 py-0.5 rounded-md bg-muted/60 border border-border/50">
          #{v}
        </span>
      ),
    },
    {
      key: "ten",
      title: "Tên mục chi tiết",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (v, row) => (
        <div className="flex flex-col gap-1 py-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground text-sm hover:text-blue-600 transition-colors">
              {v}
            </span>
            {row.maSo && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/60">
                {row.maSo}
              </span>
            )}
          </div>
          {row.moTa ? (
            <span className="text-xs text-muted-foreground line-clamp-1 max-w-xl">
              {row.moTa}
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground/50 italic">
              Chưa có mô tả chi tiết
            </span>
          )}
        </div>
      ),
    },
    {
      key: "danhMucID",
      title: "Danh mục cha",
      classNameHeader: "font-semibold text-xs text-muted-foreground w-60",
      render: (danhMucId, row) => {
        const parentName = getParentName(Number(danhMucId), row);
        return (
          <Link
            href={`/admin/danhMucChung?search=${encodeURIComponent(parentName)}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-500/20 max-w-[230px] truncate shadow-2xs hover:bg-blue-500/20 transition-colors"
          >
            <FolderTree className="w-3.5 h-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
            <span className="truncate">{parentName}</span>
          </Link>
        );
      },
    },
    {
      key: "thuTu",
      title: "Thứ tự",
      classNameHeader:
        "text-center w-20 text-xs font-semibold text-muted-foreground",
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
      classNameHeader:
        "text-center w-32 text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) =>
        v === true ? (
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
            title="Chỉnh sửa danh mục chi tiết"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <SquarePen className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenDelete(row)}
            title="Xóa danh mục chi tiết"
            className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const hasActiveFilters = Boolean(
    searchInput || parentCategoryFilter || statusFilter !== "all",
  );

  const handleResetFilters = () => {
    handleSearch("");
    setParentCategoryFilter("");
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
                <span className="text-foreground">Quản lý danh mục</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                  <ListTree className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Danh mục chi tiết
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Quản lý các thuộc tính phân loại con liên kết với danh mục
                    dùng chung
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
                title="Đồng bộ danh mục con từ dữ liệu chuẩn"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    isSyncing ? "animate-spin text-blue-500" : ""
                  }`}
                />
                <span className="text-xs font-medium">Đồng bộ chuẩn</span>
              </Button>

              <Button
                size="sm"
                onClick={() => setOpenCreate(true)}
                className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer font-medium"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs font-medium">Thêm mới</span>
              </Button>
            </div>
          </div>

          {/* Quick Tab Switcher between DanhMucChung and DanhMucChiTiet */}
          <div className="flex items-center justify-between pt-1">
            <CategoryNavTabs
              activeTab="chiTiet"
              totalChiTiet={total_DanhMucChiTiet}
              totalChung={total_DanhMucChung}
            />
          </div>
        </div>
      )}

      {/* 2. Interactive KPI Overview Cards (Render động qua kpiCards.map) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          const isFilter = Boolean(card.filterKey);
          const isSelected = card.filterKey && statusFilter === card.filterKey;

          const cardBody = (
            <Card
              onClick={() => {
                if (card.filterKey) {
                  setStatusFilter(card.filterKey);
                  setPage(1);
                }
              }}
              className={`p-4 gap-0 rounded-xl border transition-all h-full ${
                isFilter ? "cursor-pointer" : ""
              } ${
                isSelected
                  ? card.activeBorderClass
                  : card.href
                  ? "border-border/80 bg-card hover:border-purple-500/40 hover:bg-purple-500/5 hover:shadow-xs cursor-pointer"
                  : "border-border/80 bg-card hover:border-border hover:shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {card.label}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg ${card.iconBg} ${card.iconColor} flex items-center justify-center transition-transform ${
                    card.href ? "group-hover/kpi:scale-105" : ""
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div
                className={`mt-2 text-2xl font-bold ${card.valueColor} flex items-center justify-between`}
              >
                <span>
                  {card.isLoading ? (
                    <Skeleton className="h-7 w-16" />
                  ) : (
                    card.value
                  )}
                </span>
                {card.href && (
                  <ExternalLink className="w-4 h-4 text-purple-400 opacity-0 group-hover/kpi:opacity-100 transition-opacity" />
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                {card.subtext}
              </p>
            </Card>
          );

          if (card.href) {
            return (
              <Link
                key={card.id}
                href={card.href}
                className="block group/kpi"
                title="Nhấn để xem danh sách Danh mục dùng chung"
              >
                {cardBody}
              </Link>
            );
          }

          return <div key={card.id}>{cardBody}</div>;
        })}
      </div>

      {/* 3. Smart Toolbar: Tìm kiếm, Chọn Danh mục cha và Lọc trạng thái */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Ô tìm kiếm từ khóa */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Tìm theo tên mục chi tiết..."
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

          {/* CUSTOM SEARCH SELECT: Lọc theo Danh mục chung cha (Tuân thủ rule) */}
          <div className="w-full lg:w-72 shrink-0">
            <SearchSelect
              options={filterParentOptions}
              value={parentCategoryFilter}
              onChange={(val) => {
                setParentCategoryFilter(val);
                setPage(1);
              }}
              placeholder="Chọn danh mục cha"
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Segmented Control: Lọc theo Trạng thái */}
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
                Tất cả ({total_DanhMucChiTiet})
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

            {/* Nút Reload */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                refetch();
                refetchKPI();
              }}
              disabled={isFetching || isLoadingKPI}
              title="Tải lại dữ liệu"
              className="h-9 w-9 shrink-0 cursor-pointer shadow-2xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""
                }`}
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
            {parentCategoryFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-medium">
                <FolderTree className="w-3 h-3" />
                Danh mục: {currentParentName}
                <button
                  type="button"
                  onClick={() => setParentCategoryFilter("")}
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

      {/* 4. Content (Showcase Grid or Table) */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <Card
              key={idx}
              className="p-4 rounded-xl border border-border/70 space-y-3"
            >
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-10 w-full" />
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
            Không tìm thấy danh mục chi tiết nào
          </p>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            {hasActiveFilters
              ? "Không có kết quả nào khớp với bộ lọc hiện tại. Bạn hãy thử điều chỉnh từ khóa hoặc xóa bớt bộ lọc."
              : "Hiện tại chưa có mục chi tiết nào trong hệ thống. Hãy tạo mục đầu tiên!"}
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
              <Plus className="w-4 h-4 mr-1" /> Thêm danh mục chi tiết
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
            {items.map((item: DM_DanhMucChiTiet) => {
              const parentName = getParentName(Number(item.danhMucID), item);
              return (
                <Card
                  key={item.danhMucChiTietID}
                  className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs hover:shadow-md hover:border-border transition-all flex flex-col justify-between gap-3"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-muted/80 text-muted-foreground border border-border/60">
                        #{item.danhMucChiTietID}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {item.maSo && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/60">
                            {item.maSo}
                          </span>
                        )}
                        {item.trangThai ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Sử dụng
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/25">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Khóa
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-base text-foreground line-clamp-1 hover:text-blue-600 transition-colors">
                      {item.ten}
                    </h3>

                    {/* Parent Category Badge */}
                    <div className="mt-2">
                      <Link
                        href={`/admin/danhMucChung?search=${encodeURIComponent(parentName)}`}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-500/20 max-w-full truncate hover:bg-blue-500/20 transition-colors"
                        title={`Xem danh mục cha: ${parentName}`}
                      >
                        <FolderTree className="w-3.5 h-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                        <span className="truncate">{parentName}</span>
                      </Link>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2 min-h-[32px]">
                      {item.moTa || (
                        <span className="text-muted-foreground/50 italic">
                          Chưa có mô tả chi tiết
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Card Bottom Meta & Actions */}
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="text-[11px]">Thứ tự:</span>
                      <span className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-muted text-foreground border border-border/50">
                        {item.thuTu ?? 0}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => setEditingItem(item)}
                        title="Chỉnh sửa danh mục chi tiết"
                        className="h-8 w-8 text-muted-foreground hover:text-blue-600 cursor-pointer"
                      >
                        <SquarePen className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => handleOpenDelete(item)}
                        title="Xóa danh mục chi tiết"
                        className="h-8 w-8 text-muted-foreground hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </motion.div>

          {/* Pagination Controls for Grid View */}
          <Pagination
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            itemName="mục chi tiết"
          />
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
          <div className="p-3 flex flex-col gap-3 w-full">
            <Table<DM_DanhMucChiTiet>
              data={items}
              columns={columns}
              showIndex
              startIndex={(page - 1) * pageSize}
            />

            {/* Pagination Controls for Table View */}
            <Pagination
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              itemName="mục chi tiết"
            />
          </div>
        </div>
      )}

      {/* 5. SlideOver Drawer: THÊM MỚI DANH MỤC CHI TIẾT (Tách component riêng chống Re-render) */}
      <CreateDanhMucChiTietSlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        parentCategoryOptions={parentCategoryOptions}
        defaultParentId={
          parentCategoryFilter ? Number(parentCategoryFilter) : undefined
        }
        defaultThuTu={maxThuTu + 1}
      />

      {/* 6. SlideOver Drawer: CẬP NHẬT DANH MỤC CHI TIẾT (Tách component riêng chống Re-render) */}
      <UpdateDanhMucChiTietSlideOver
        open={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        data={editingItem}
        parentCategoryOptions={parentCategoryOptions}
      />

      {/* 7. Modal XÁC NHẬN XÓA */}
      <ConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleSubmitDelete}
        title="Xác nhận xóa danh mục chi tiết"
        description={
          <div>
            <p>
              Bạn có chắc chắn muốn xóa mục &quot;
              <strong className="text-foreground">{selectItemName}</strong>
              &quot; không?
            </p>
            <span className="text-xs text-rose-600/90 dark:text-rose-400 mt-2 block bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              Hành động này không thể hoàn tác nếu danh mục con này đang được
              liên kết với sản phẩm, phụ tùng hoặc giao dịch trong hệ thống.
            </span>
          </div>
        }
        confirmText="Xác nhận xóa"
        cancelText="Hủy"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default function DanhMucChiTietPage() {
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
      <DanhMucChiTietContent />
    </Suspense>
  );
}
