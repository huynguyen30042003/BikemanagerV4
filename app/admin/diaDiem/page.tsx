"use client";

import React, { useMemo, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  AlertCircle,
  Upload,
  Wrench,
  Warehouse,
  ImageIcon,
} from "lucide-react";
import { useDiaDiem } from "@/hooks/DiaDiem/useDiaDiem";
import { DM_DiaDiem } from "@/types/diaDiem";
import { SlideOver } from "@/components/ui/SlideOver";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { LocationNavTabs } from "@/components/Common/LocationNavTabs";

const LOAI_DIA_DIEM_OPTIONS = [
  { value: 1, label: "Showroom & Bán lẻ" },
  { value: 2, label: "Trạm bảo hành & Dịch vụ" },
  { value: 3, label: "Kho tổng & Chi nhánh kho" },
];

function DiaDiemContent() {
  const searchParams = useSearchParams();
  const tinhIdFromUrl = searchParams.get("tinhId") || searchParams.get("TinhID") || "";
  const fileInputRefAdd = useRef<HTMLInputElement>(null);
  const fileInputRefUpdate = useRef<HTMLInputElement>(null);

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
    communeOptions,
    parentLocationOptions,
    isLoadingTinh,

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
  } = useDiaDiem(tinhIdFromUrl ? Number(tinhIdFromUrl) : "");

  // Metrics
  const activeCount = useMemo(
    () => items.filter((item) => item.trangThai === true).length,
    [items]
  );
  const inactiveCount = useMemo(
    () => items.filter((item) => item.trangThai === false).length,
    [items]
  );
  const showroomCount = useMemo(
    () => items.filter((item) => item.loaiDiaDiemID === 1).length,
    [items]
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
    switch (loaiId) {
      case 2:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            <Wrench className="w-2.5 h-2.5" /> Trạm dịch vụ
          </span>
        );
      case 3:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20">
            <Warehouse className="w-2.5 h-2.5" /> Kho hàng
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
            <Store className="w-2.5 h-2.5" /> Showroom
          </span>
        );
    }
  };

  const columns: Column<DM_DiaDiem>[] = [
    {
      key: "diaDiemID",
      title: "Mã",
      classNameHeader: "w-20 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span
          className="font-mono text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted/60 border border-border/50 text-muted-foreground"
          title={String(v)}
        >
          #{String(v).substring(0, 6)}...
        </span>
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
      classNameHeader: "w-48 text-left text-xs font-semibold text-muted-foreground",
      render: (tinhId, row) => {
        const tName =
          row.tenTinh || provinceMap.get(Number(tinhId)) || `Tỉnh #${tinhId}`;
        return (
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-500/20 max-w-[180px] truncate shadow-2xs">
            <Building2 className="w-3 h-3 shrink-0 text-blue-600 dark:text-blue-400" />
            <span className="truncate">{tName}</span>
          </div>
        );
      },
    },
    {
      key: "diaChiSo",
      title: "Địa chỉ cụ thể",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground max-w-xs",
      render: (v) => (
        <div className="flex items-center gap-1.5 text-xs text-foreground truncate max-w-xs">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="truncate">{v || "Chưa cập nhật địa chỉ"}</span>
        </div>
      ),
    },
    {
      key: "trangThai",
      title: "Trạng thái",
      classNameHeader: "text-center w-32 text-xs font-semibold text-muted-foreground",
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
      classNameHeader: "text-center w-28 text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenEdit(row)}
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

  const hasActiveFilters = Boolean(searchInput || tinhFilter || statusFilter !== "all");

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
                    Quản lý mạng lưới showroom bán hàng, trạm dịch vụ kỹ thuật và kho chi nhánh
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
                onClick={handleModalAdd}
                className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs font-medium">Thêm cơ sở</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <LocationNavTabs activeTab="diaDiem" totalDiaDiem={totalCount} />
          </div>
        </div>
      )}

      {/* 2. KPI Overview Cards */}
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
            Mở cửa tiếp nhận dịch vụ & bán hàng
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
              Tạm ngưng / Đóng cửa
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-500/10 text-slate-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-700 dark:text-slate-300">
            {isLoading ? <Skeleton className="h-7 w-16" /> : inactiveCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Bảo trì hoặc tạm ngưng hoạt động
          </p>
        </Card>

        <Card className="p-4 rounded-xl border border-border/80 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Showroom xe điện
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {isLoading ? <Skeleton className="h-7 w-16" /> : showroomCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Điểm bán hàng trưng bày xe
          </p>
        </Card>
      </div>

      {/* 3. Toolbar: Tìm kiếm, SearchSelect Tỉnh thành & Trạng thái */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px]">
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

          {/* CUSTOM SEARCH SELECT: Lọc theo Tỉnh / Thành phố */}
          <div className="w-full lg:w-72 shrink-0">
            <SearchSelect
              options={filterProvinceOptions}
              value={tinhFilter}
              onChange={(val) => {
                setTinhFilter(val);
                setPage(1);
              }}
              placeholder="-- Chọn Tỉnh / Thành phố --"
              className="w-full"
            />
          </div>

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

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Tải lại dữ liệu"
            className="h-9.5 w-9.5 shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-blue-500" : ""}`} />
          </Button>
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
                Trạng thái: {statusFilter === "active" ? "Đang hoạt động" : "Đã đóng"}
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

      {/* 4. Table */}
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
                  Không tìm thấy cơ sở hoặc showroom nào
                </p>
                <p className="text-xs text-muted-foreground max-w-sm mt-1">
                  {hasActiveFilters
                    ? "Không có kết quả khớp với bộ lọc. Hãy điều chỉnh từ khóa hoặc xóa bớt tiêu chí lọc."
                    : "Chưa có địa điểm chi nhánh nào trong hệ thống. Hãy tạo cơ sở đầu tiên!"}
                </p>
                <div className="flex items-center gap-2 mt-4">
                  {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={handleResetFilters} className="cursor-pointer">
                      Xóa bộ lọc
                    </Button>
                  )}
                  <Button size="sm" onClick={handleModalAdd} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                    <Plus className="w-4 h-4 mr-1" /> Thêm cơ sở mới
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Table<DM_DiaDiem>
                  data={items}
                  columns={columns}
                  showIndex
                  startIndex={(page - 1) * pageSize}
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/70 text-sm text-muted-foreground">
                  <div className="text-xs">
                    Trang <strong className="text-foreground">{page}</strong> / {totalPages}{" "}
                    (Tổng <strong className="text-foreground">{totalCount}</strong> cơ sở)
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

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
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

      {/* 5. SlideOver: THÊM MỚI CƠ SỞ / SHOWROOM */}
      <SlideOver
        open={open}
        onClose={() => setOpen(false)}
        title="Thêm mới Cơ sở / Showroom"
        description="Đăng ký điểm bán hàng, trạm dịch vụ bảo hành hoặc kho chi nhánh"
        icon={Store}
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
              {isCreating ? <RefreshCw className="w-4 h-4 animate-spin mr-1.5" /> : null}
              Lưu cơ sở
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Tên địa điểm / Showroom <span className="text-red-500">*</span>
            </label>
            <Input
              value={dataAdd.TenDiaDiem}
              onChange={(e) => setDataAdd((prev) => ({ ...prev, TenDiaDiem: e.target.value }))}
              placeholder="Ví dụ: Showroom BikeManager Cầu Giấy..."
              className={`rounded-lg ${errors.tenDiaDiem ? "border-red-500" : ""}`}
            />
            {errors.tenDiaDiem && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.tenDiaDiem}
              </p>
            )}
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Loại hình cơ sở <span className="text-red-500">*</span>
            </label>
            <SearchSelect
              options={LOAI_DIA_DIEM_OPTIONS}
              value={dataAdd.LoaiDiaDiemID}
              onChange={(val) => setDataAdd((prev) => ({ ...prev, LoaiDiaDiemID: Number(val) || 1 }))}
              placeholder="Chọn loại..."
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Trực thuộc cơ sở cha (nếu có)
            </label>
            <SearchSelect
              options={[{ value: "", label: "-- Không có (Độc lập) --" }, ...parentLocationOptions]}
              value={dataAdd.DiaDiemCapChaID || ""}
              onChange={(val) => setDataAdd((prev) => ({ ...prev, DiaDiemCapChaID: val ? String(val) : null }))}
              placeholder="Chọn cơ sở cha..."
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Tỉnh / Thành phố <span className="text-red-500">*</span>
            </label>
            <SearchSelect
              options={provinceOptions}
              value={dataAdd.TinhID || ""}
              onChange={(val) =>
                setDataAdd((prev) => ({
                  ...prev,
                  TinhID: Number(val) || 0,
                  XaID: 0,
                }))
              }
              placeholder="-- Chọn Tỉnh / TP --"
            />
            {errors.tinhID && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.tinhID}
              </p>
            )}
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Phường / Xã <span className="text-red-500">*</span>
            </label>
            <SearchSelect
              options={communeOptions}
              value={dataAdd.XaID || ""}
              onChange={(val) => setDataAdd((prev) => ({ ...prev, XaID: Number(val) || 0 }))}
              placeholder={dataAdd.TinhID ? "-- Chọn Phường / Xã --" : "Vui lòng chọn Tỉnh trước"}
            />
            {errors.xaID && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.xaID}
              </p>
            )}
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Địa chỉ số (Số nhà, Tên đường, Tòa nhà) <span className="text-red-500">*</span>
            </label>
            <Input
              value={dataAdd.DiaChiSo}
              onChange={(e) => setDataAdd((prev) => ({ ...prev, DiaChiSo: e.target.value }))}
              placeholder="Ví dụ: 123 Đường Cầu Giấy, Tòa nhà Indochina..."
              className={`rounded-lg ${errors.diaChiSo ? "border-red-500" : ""}`}
            />
            {errors.diaChiSo && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.diaChiSo}
              </p>
            )}
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Kinh độ (Longitude)
            </label>
            <Input
              type="number"
              step="any"
              value={dataAdd.KinhDo ?? ""}
              onChange={(e) => setDataAdd((prev) => ({ ...prev, KinhDo: e.target.value ? parseFloat(e.target.value) : null }))}
              placeholder="Ví dụ: 105.7832"
              className="rounded-lg font-mono text-sm"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Vĩ độ (Latitude)
            </label>
            <Input
              type="number"
              step="any"
              value={dataAdd.ViDo ?? ""}
              onChange={(e) => setDataAdd((prev) => ({ ...prev, ViDo: e.target.value ? parseFloat(e.target.value) : null }))}
              placeholder="Ví dụ: 21.0333"
              className="rounded-lg font-mono text-sm"
            />
          </div>

          {/* Upload ảnh đại diện */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Ảnh đại diện cơ sở
            </label>
            <input
              type="file"
              ref={fileInputRefAdd}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setDataAdd((prev) => ({ ...prev, file }));
              }}
            />
            <div
              onClick={() => fileInputRefAdd.current?.click()}
              className="border-2 border-dashed border-border/80 rounded-xl p-4 text-center hover:bg-muted/30 transition-colors cursor-pointer flex flex-col items-center justify-center gap-1.5"
            >
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">
                {dataAdd.file ? dataAdd.file.name : "Nhấn để chọn ảnh đại diện showroom (PNG, JPG)"}
              </span>
              <span className="text-[11px] text-muted-foreground">Kích thước tối đa 5MB</span>
            </div>
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Mô tả chi tiết
            </label>
            <Textarea
              value={dataAdd.MoTa || ""}
              onChange={(e) => setDataAdd((prev) => ({ ...prev, MoTa: e.target.value }))}
              placeholder="Ghi chú về dịch vụ, giờ mở cửa, năng lực trạm sửa chữa..."
              className="h-24 resize-none rounded-lg text-sm"
            />
          </div>

          <div className="col-span-2 flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/20">
            <div>
              <p className="text-sm font-medium text-foreground">Trạng thái hoạt động</p>
              <p className="text-xs text-muted-foreground">Cho phép giao dịch và hiển thị trên bản đồ dịch vụ</p>
            </div>
            <Switch
              id="isActiveDiaDiemAdd"
              checked={dataAdd.TrangThai}
              onCheckedChange={(checked) => setDataAdd((prev) => ({ ...prev, TrangThai: checked }))}
            />
          </div>
        </div>
      </SlideOver>

      {/* 6. SlideOver: CẬP NHẬT CƠ SỞ / SHOWROOM */}
      <SlideOver
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        title="Cập nhật Cơ sở / Showroom"
        description="Chỉnh sửa thông tin cơ sở chi nhánh"
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
              {isUpdating ? <RefreshCw className="w-4 h-4 animate-spin mr-1.5" /> : null}
              Lưu thay đổi
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Tên địa điểm / Showroom <span className="text-red-500">*</span>
            </label>
            <Input
              value={dataUpdate.TenDiaDiem}
              onChange={(e) => setDataUpdate((prev) => ({ ...prev, TenDiaDiem: e.target.value }))}
              placeholder="Nhập tên cơ sở..."
              className={`rounded-lg ${errors.tenDiaDiem ? "border-red-500" : ""}`}
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Loại hình cơ sở <span className="text-red-500">*</span>
            </label>
            <SearchSelect
              options={LOAI_DIA_DIEM_OPTIONS}
              value={dataUpdate.LoaiDiaDiemID}
              onChange={(val) => setDataUpdate((prev) => ({ ...prev, LoaiDiaDiemID: Number(val) || 1 }))}
              placeholder="Chọn loại..."
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Trực thuộc cơ sở cha
            </label>
            <SearchSelect
              options={[{ value: "", label: "-- Không có --" }, ...parentLocationOptions]}
              value={dataUpdate.DiaDiemCapChaID || ""}
              onChange={(val) => setDataUpdate((prev) => ({ ...prev, DiaDiemCapChaID: val ? String(val) : null }))}
              placeholder="Chọn cơ sở cha..."
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Tỉnh / Thành phố <span className="text-red-500">*</span>
            </label>
            <SearchSelect
              options={provinceOptions}
              value={dataUpdate.TinhID || ""}
              onChange={(val) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  TinhID: Number(val) || 0,
                  XaID: 0,
                }))
              }
              placeholder="-- Chọn Tỉnh / TP --"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Phường / Xã <span className="text-red-500">*</span>
            </label>
            <SearchSelect
              options={communeOptions}
              value={dataUpdate.XaID || ""}
              onChange={(val) => setDataUpdate((prev) => ({ ...prev, XaID: Number(val) || 0 }))}
              placeholder="-- Chọn Phường / Xã --"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Địa chỉ số <span className="text-red-500">*</span>
            </label>
            <Input
              value={dataUpdate.DiaChiSo}
              onChange={(e) => setDataUpdate((prev) => ({ ...prev, DiaChiSo: e.target.value }))}
              placeholder="Nhập địa chỉ..."
              className={`rounded-lg ${errors.diaChiSo ? "border-red-500" : ""}`}
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Kinh độ (Longitude)
            </label>
            <Input
              type="number"
              step="any"
              value={dataUpdate.KinhDo ?? ""}
              onChange={(e) => setDataUpdate((prev) => ({ ...prev, KinhDo: e.target.value ? parseFloat(e.target.value) : null }))}
              className="rounded-lg font-mono text-sm"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Vĩ độ (Latitude)
            </label>
            <Input
              type="number"
              step="any"
              value={dataUpdate.ViDo ?? ""}
              onChange={(e) => setDataUpdate((prev) => ({ ...prev, ViDo: e.target.value ? parseFloat(e.target.value) : null }))}
              className="rounded-lg font-mono text-sm"
            />
          </div>

          {/* Đổi ảnh đại diện */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Cập nhật ảnh đại diện cơ sở
            </label>
            <input
              type="file"
              ref={fileInputRefUpdate}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setDataUpdate((prev) => ({ ...prev, file, XoaFile: false }));
              }}
            />
            <div
              onClick={() => fileInputRefUpdate.current?.click()}
              className="border-2 border-dashed border-border/80 rounded-xl p-4 text-center hover:bg-muted/30 transition-colors cursor-pointer flex flex-col items-center justify-center gap-1.5"
            >
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">
                {dataUpdate.file ? dataUpdate.file.name : "Nhấn để tải lên ảnh mới thay thế"}
              </span>
            </div>
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Mô tả chi tiết
            </label>
            <Textarea
              value={dataUpdate.MoTa || ""}
              onChange={(e) => setDataUpdate((prev) => ({ ...prev, MoTa: e.target.value }))}
              placeholder="Nhập mô tả..."
              className="h-24 resize-none rounded-lg text-sm"
            />
          </div>

          <div className="col-span-2 flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/20">
            <div>
              <p className="text-sm font-medium text-foreground">Trạng thái hoạt động</p>
              <p className="text-xs text-muted-foreground">Kích hoạt tiếp nhận đơn hàng & dịch vụ</p>
            </div>
            <Switch
              id="isActiveDiaDiemUpdate"
              checked={dataUpdate.TrangThai}
              onCheckedChange={(checked) => setDataUpdate((prev) => ({ ...prev, TrangThai: checked }))}
            />
          </div>
        </div>
      </SlideOver>

      {/* 7. Modal Xóa */}
      <ConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleSubmitDelete}
        title="Xác nhận xóa cơ sở / showroom"
        description={
          <div>
            <p>
              Bạn có chắc chắn muốn xóa cơ sở &quot;
              <strong className="text-foreground">{selectItemName}</strong>&quot; không?
            </p>
            <span className="text-xs text-rose-600/90 dark:text-rose-400 mt-2 block bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              Hành động này không thể hoàn tác nếu cơ sở đang có giao dịch đơn hàng hoặc kho hàng liên kết.
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
