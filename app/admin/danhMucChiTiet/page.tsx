"use client";

import React, { useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  AlertCircle,
  BookmarkPlus,
} from "lucide-react";
import { useDanhMucChiTiet } from "@/hooks/DanhMucChiTiet/useDanhMucChiTiet";
import { DM_DanhMucChiTiet } from "@/types/danhMucChiTiet";
import { SlideOver } from "@/components/ui/SlideOver";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { CategoryNavTabs } from "@/components/Common/CategoryNavTabs";

function DanhMucChiTietContent() {
  const searchParams = useSearchParams();
  const parentIdParam = searchParams.get("danhMucId") || searchParams.get("parentId") || "";

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

    // Add state & actions
    open,
    setOpen,
    dataAdd,
    setDataAdd,
    handleModalAdd,
    handleSubmit,
    isCreating,

    // Update state & actions
    openUpdate,
    setOpenUpdate,
    dataUpdate,
    setDataUpdate,
    handleOpenEdit,
    handleSubmitUpdate,
    isUpdating,

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

    // Validation
    errors,
  } = useDanhMucChiTiet(parentIdParam ? Number(parentIdParam) : "");

  // Derived KPI metrics
  const activeCount = useMemo(
    () => items.filter((item: DM_DanhMucChiTiet) => item.trangThai === true).length,
    [items]
  );
  const inactiveCount = useMemo(
    () => items.filter((item: DM_DanhMucChiTiet) => item.trangThai === false).length,
    [items]
  );

  // Filter options for parent category toolbar (includes "All" option)
  const filterParentOptions: SelectOption[] = useMemo(() => {
    return [
      { value: "", label: "-- Tất cả danh mục cha --" },
      ...parentCategoryOptions,
    ];
  }, [parentCategoryOptions]);

  // Selected parent name for active filter chip display
  const currentParentName = useMemo(() => {
    if (!parentCategoryFilter) return "";
    return parentCategoryMap.get(Number(parentCategoryFilter)) || `Danh mục #${parentCategoryFilter}`;
  }, [parentCategoryFilter, parentCategoryMap]);

  // Cấu hình các cột của bảng
  const columns: Column<DM_DanhMucChiTiet>[] = [
    {
      key: "danhMucChiTietID",
      title: "Mã",
      classNameHeader: "w-18 text-center text-xs font-semibold text-muted-foreground",
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
        const parentName =
          row.tenDanhMuc ||
          row.tenDanhMucChung ||
          parentCategoryMap.get(Number(danhMucId)) ||
          `Danh mục #${danhMucId}`;
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-500/20 max-w-[230px] truncate shadow-2xs">
            <FolderTree className="w-3.5 h-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
            <span className="truncate">{parentName}</span>
          </div>
        );
      },
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
      classNameHeader: "text-center w-28 text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenEdit(row)}
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

  const hasActiveFilters = Boolean(searchInput || parentCategoryFilter || statusFilter !== "all");

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
                    Quản lý các thuộc tính phân loại con liên kết với danh mục dùng chung
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

          {/* Quick Tab Switcher between DanhMucChung and DanhMucChiTiet */}
          <div className="flex items-center justify-between pt-1">
            <CategoryNavTabs activeTab="chiTiet" totalChiTiet={totalCount} />
          </div>
        </div>
      )}

      {/* 2. Interactive KPI Overview Cards */}
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
              Tổng mục chi tiết
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <ListTree className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">
            {isLoading ? <Skeleton className="h-7 w-16" /> : totalCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Trên toàn bộ hệ thống
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
            Sẵn sàng để gán dữ liệu
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
            Không thể chọn mới
          </p>
        </Card>

        <Link
          href="/admin/danhMucChung"
          className="block group/kpi"
          title="Nhấn để xem danh sách Danh mục dùng chung"
        >
          <Card className="p-4 rounded-xl border border-border/80 bg-card hover:border-purple-500/40 hover:bg-purple-500/5 hover:shadow-xs transition-all cursor-pointer h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Danh mục cha liên kết
              </span>
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center group-hover/kpi:scale-105 transition-transform">
                <FolderTree className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400 flex items-center justify-between">
              <span>{isLoadingParent ? <Skeleton className="h-7 w-16" /> : parentCategories.length}</span>
              <ExternalLink className="w-4 h-4 text-purple-400 opacity-0 group-hover/kpi:opacity-100 transition-opacity" />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Nhóm danh mục dùng chung
            </p>
          </Card>
        </Link>
      </div>

      {/* 3. Smart Toolbar: Tìm kiếm, Chọn Danh mục cha (SearchSelect Custom) và Lọc trạng thái */}
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

          {/* CUSTOM SEARCH SELECT: Lọc theo Danh mục chung cha (Tuân thủ ruleFE.md) */}
          <div className="w-full lg:w-72 shrink-0">
            <SearchSelect
              options={filterParentOptions}
              value={parentCategoryFilter}
              onChange={(val) => {
                setParentCategoryFilter(val);
                setPage(1);
              }}
              placeholder="-- Chọn danh mục cha --"
              className="w-full"
            />
          </div>

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

          {/* Nút Reload */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Tải lại dữ liệu"
            className="h-9.5 w-9.5 shrink-0 cursor-pointer"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin text-blue-500" : ""}`}
            />
          </Button>
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

      {/* 4. Data Table */}
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
                    onClick={handleModalAdd}
                    className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Thêm danh mục chi tiết
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Table<DM_DanhMucChiTiet>
                  data={items}
                  columns={columns}
                  showIndex
                  startIndex={(page - 1) * pageSize}
                />

                {/* Điều khiển Phân trang */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/70 text-sm text-muted-foreground">
                  <div className="text-xs">
                    Trang <strong className="text-foreground">{page}</strong> /{" "}
                    {totalPages} (Tổng <strong className="text-foreground">{totalCount}</strong> mục chi tiết)
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

                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                      .filter(
                        (p) =>
                          p === 1 ||
                          p === totalPages ||
                          Math.abs(p - page) <= 2
                      )
                      .map((p, idx, arr) => {
                        const prev = arr[idx - 1];
                        return (
                          <React.Fragment key={p}>
                            {prev && p - prev > 1 && (
                              <span className="px-1 text-muted-foreground text-xs">
                                ...
                              </span>
                            )}
                            <Button
                              variant={page === p ? "default" : "outline"}
                              size="sm"
                              className={`h-8 w-8 p-0 text-xs cursor-pointer ${
                                page === p
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : ""
                              }`}
                              onClick={() => setPage(p)}
                            >
                              {p}
                            </Button>
                          </React.Fragment>
                        );
                      })}

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
              </>
            )}
          </div>
        </div>
      )}

      {/* 5. SlideOver Drawer: THÊM MỚI DANH MỤC CHI TIẾT */}
      <SlideOver
        open={open}
        onClose={() => setOpen(false)}
        title="Thêm mới danh mục chi tiết"
        description="Tạo một mục con thuộc danh mục dùng chung đã chọn"
        icon={BookmarkPlus}
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
              Tạo danh mục
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          {/* CUSTOM SEARCH SELECT: Danh mục chung cha (Bắt buộc theo ruleFE.md) */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground flex items-center justify-between">
              <span>
                Danh mục chung (cha) <span className="text-red-500">*</span>
              </span>
              <span className="text-[11px] text-muted-foreground">Bắt buộc</span>
            </label>
            <SearchSelect
              options={parentCategoryOptions}
              value={dataAdd.DanhMucID || ""}
              onChange={(val) =>
                setDataAdd((prev) => ({
                  ...prev,
                  DanhMucID: Number(val) || 0,
                }))
              }
              placeholder="-- Chọn danh mục chung cha --"
              className="w-full"
            />
            {errors.danhMucID && (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.danhMucID}
              </p>
            )}
          </div>

          {/* Tên mục chi tiết */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground flex items-center justify-between">
              <span>
                Tên mục chi tiết <span className="text-red-500">*</span>
              </span>
              <span className="text-[11px] text-muted-foreground">Bắt buộc</span>
            </label>
            <Input
              value={dataAdd.Ten}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, Ten: e.target.value }))
              }
              placeholder="Ví dụ: Pin Lithium 48V, Xe đạp địa hình..."
              className={`rounded-lg ${errors.ten ? "border-red-500 focus-visible:ring-red-500/30" : ""}`}
            />
            {errors.ten && (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.ten}
              </p>
            )}
          </div>

          {/* Thứ tự sắp xếp */}
          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Thứ tự hiển thị
            </label>
            <Input
              type="number"
              min={0}
              value={dataAdd.ThuTu}
              className="rounded-lg font-mono"
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  ThuTu: parseInt(e.target.value) || 0,
                }))
              }
            />
            {errors.thuTu && (
              <p className="text-xs text-red-600">{errors.thuTu}</p>
            )}
          </div>

          {/* Trạng thái sử dụng (Switch Radix) */}
          <div className="col-span-1 flex flex-col gap-1.5 justify-end pb-1">
            <span className="text-sm font-medium text-foreground">
              Trạng thái
            </span>
            <div className="flex items-center gap-2.5 h-9.5 px-3 rounded-lg border border-border/70 bg-muted/30">
              <Switch
                id="isActiveDetailAdd"
                checked={dataAdd.TrangThai}
                onCheckedChange={(checked) =>
                  setDataAdd((prev) => ({
                    ...prev,
                    TrangThai: checked,
                  }))
                }
              />
              <label
                htmlFor="isActiveDetailAdd"
                className="text-xs font-medium text-foreground cursor-pointer select-none"
              >
                {dataAdd.TrangThai ? "Kích hoạt sử dụng" : "Tạm khóa"}
              </label>
            </div>
          </div>

          {/* Mô tả */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Mô tả chi tiết
            </label>
            <Textarea
              value={dataAdd.MoTa || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  MoTa: e.target.value,
                }))
              }
              placeholder="Nhập mô tả tóm tắt thuộc tính này..."
              className="h-28 resize-none rounded-lg text-sm"
            />
          </div>
        </div>
      </SlideOver>

      {/* 6. SlideOver Drawer: CẬP NHẬT DANH MỤC CHI TIẾT */}
      <SlideOver
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        title={`Cập nhật mục #${dataUpdate.DanhMucChiTietID}`}
        description="Chỉnh sửa thông tin danh mục chi tiết"
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
        <div className="grid grid-cols-2 gap-4">
          {/* CUSTOM SEARCH SELECT: Danh mục chung cha (Bắt buộc theo ruleFE.md) */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground flex items-center justify-between">
              <span>
                Danh mục chung (cha) <span className="text-red-500">*</span>
              </span>
              <span className="text-[11px] text-muted-foreground">Bắt buộc</span>
            </label>
            <SearchSelect
              options={parentCategoryOptions}
              value={dataUpdate.DanhMucID || ""}
              onChange={(val) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  DanhMucID: Number(val) || 0,
                }))
              }
              placeholder="-- Chọn danh mục chung cha --"
              className="w-full"
            />
            {errors.danhMucID && (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.danhMucID}
              </p>
            )}
          </div>

          {/* Tên danh mục con */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground flex items-center justify-between">
              <span>
                Tên mục chi tiết <span className="text-red-500">*</span>
              </span>
              <span className="text-[11px] text-muted-foreground">Bắt buộc</span>
            </label>
            <Input
              value={dataUpdate.Ten}
              onChange={(e) =>
                setDataUpdate((prev) => ({ ...prev, Ten: e.target.value }))
              }
              placeholder="Nhập tên mục chi tiết..."
              className={`rounded-lg ${errors.ten ? "border-red-500 focus-visible:ring-red-500/30" : ""}`}
            />
            {errors.ten && (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.ten}
              </p>
            )}
          </div>

          {/* Thứ tự */}
          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Thứ tự hiển thị
            </label>
            <Input
              type="number"
              min={0}
              value={dataUpdate.ThuTu}
              className="rounded-lg font-mono"
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  ThuTu: parseInt(e.target.value) || 0,
                }))
              }
            />
            {errors.thuTu && (
              <p className="text-xs text-red-600">{errors.thuTu}</p>
            )}
          </div>

          {/* Trạng thái sử dụng (Switch Radix) */}
          <div className="col-span-1 flex flex-col gap-1.5 justify-end pb-1">
            <span className="text-sm font-medium text-foreground">
              Trạng thái
            </span>
            <div className="flex items-center gap-2.5 h-9.5 px-3 rounded-lg border border-border/70 bg-muted/30">
              <Switch
                id="isActiveDetailUpdate"
                checked={dataUpdate.TrangThai}
                onCheckedChange={(checked) =>
                  setDataUpdate((prev) => ({
                    ...prev,
                    TrangThai: checked,
                  }))
                }
              />
              <label
                htmlFor="isActiveDetailUpdate"
                className="text-xs font-medium text-foreground cursor-pointer select-none"
              >
                {dataUpdate.TrangThai ? "Kích hoạt sử dụng" : "Tạm khóa"}
              </label>
            </div>
          </div>

          {/* Mô tả */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Mô tả chi tiết
            </label>
            <Textarea
              value={dataUpdate.MoTa || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  MoTa: e.target.value,
                }))
              }
              placeholder="Nhập mô tả..."
              className="h-28 resize-none rounded-lg text-sm"
            />
          </div>
        </div>
      </SlideOver>

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
              <strong className="text-foreground">{selectItemName}</strong>&quot; không?
            </p>
            <span className="text-xs text-rose-600/90 dark:text-rose-400 mt-2 block bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              Hành động này không thể hoàn tác nếu danh mục con này đang được liên kết với sản phẩm, phụ tùng hoặc giao dịch trong hệ thống.
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
