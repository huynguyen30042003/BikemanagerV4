"use client";

import React, { Suspense, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SearchSelect } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { WarehouseNavTabs } from "@/components/Common/WarehouseNavTabs";
import { useKho } from "@/hooks/Kho/useKho";
import { useGetKhoKPI } from "@/hooks/Kho/useKhoApi";
import { KHO_Kho } from "@/types/kho";
import {
  Warehouse,
  Plus,
  RefreshCw,
  Search,
  SquarePen,
  Trash2,
  FolderOpen,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Layers,
  MapPin,
  Phone,
  Store,
  Star,
} from "lucide-react";

function WarehousesContent() {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    searchInput,
    handleSearch,

    locationOptions,
    isLoadingLocations,

    loaiKhoOptions,
    getLoaiKhoLabel,
    isLoadingLoaiKho,

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
  } = useKho();

  const { data: kpiData, isLoading: isLoadingKPI } = useGetKhoKPI();

  const activeCount = useMemo(
    () => items.filter((i) => i.trangThai === true).length,
    [items],
  );
  const inactiveCount = useMemo(
    () => items.filter((i) => i.trangThai === false).length,
    [items],
  );
  const defaultWarehouseCount = useMemo(
    () => items.filter((i) => i.laKhoMacDinh === true).length,
    [items],
  );

  const kpiCards = [
    {
      title: "Tổng số kho bãi",
      value: kpiData?.total_Kho ?? kpiData?.totalKho ?? totalCount,
      subtext: "Điểm lưu trữ toàn hệ thống",
      icon: Warehouse,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Đang hoạt động",
      value: kpiData?.total_HoatDong ?? kpiData?.totalHoatDong ?? activeCount,
      subtext: "Sẵn sàng xuất nhập hàng",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Kho mặc định ưu tiên",
      value:
        kpiData?.total_KhoMacDinh ??
        kpiData?.totalKhoMacDinh ??
        defaultWarehouseCount,
      subtext: "Tự động chọn khi lập đơn bán",
      icon: Star,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      title: "Tạm ngưng",
      value:
        kpiData?.total_NgungHoatDong ??
        kpiData?.totalNgungHoatDong ??
        inactiveCount,
      subtext: "Kho bảo trì hoặc dừng hoạt động",
      icon: XCircle,
      color: "text-slate-600 dark:text-slate-400",
      bg: "bg-slate-500/10",
    },
  ];

  const columns: Column<KHO_Kho>[] = [
    {
      key: "maKho",
      title: "Mã kho",
      classNameHeader:
        "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v, row) => (
        <div className="flex items-center justify-center gap-1">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
            {v ? String(v).toUpperCase() : "—"}
          </span>
          {row.laKhoMacDinh && (
            <span
              title="Kho mặc định bán hàng"
              className="inline-flex items-center"
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </span>
          )}
        </div>
      ),
    },
    {
      key: "tenKho",
      title: "Tên kho hàng & Chi nhánh",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-xs text-foreground">
            {row.tenKho}
          </span>
          {row.tenDiaDiem ? (
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Store className="w-3 h-3 text-blue-500" />
              Chi nhánh: {row.tenDiaDiem}
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground/60 italic">
              Kho độc lập / Trung tâm
            </span>
          )}
        </div>
      ),
    },
    {
      key: "loaiKhoID",
      title: "Loại kho",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => {
        return (
          <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
            {getLoaiKhoLabel(Number(v))}
          </span>
        );
      },
    },
    {
      key: "diaChi",
      title: "Địa chỉ & Liên hệ",
      classNameHeader:
        "min-w-[200px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
          {row.diaChi && (
            <div
              className="flex items-center gap-1 truncate"
              title={row.diaChi}
            >
              <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="truncate">{row.diaChi}</span>
            </div>
          )}
          {row.dienThoai && (
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-muted-foreground shrink-0" />
              <span>{row.dienThoai}</span>
            </div>
          )}
          {!row.diaChi && !row.dienThoai && <span>—</span>}
        </div>
      ),
    },
    {
      key: "choPhepTonAm",
      title: "Chính sách xuất",
      classNameHeader:
        "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) =>
        v ? (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            Cho phép tồn âm
          </span>
        ) : (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground">
            Chặn xuất âm
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
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Sử dụng
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Tạm khóa
          </span>
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
            href={`/admin/inventory?khoId=${row.khoID}`}
            title="Xem danh mục tồn kho tại kho này"
            className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4" />
          </Link>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenEdit(row)}
            title="Chỉnh sửa kho hàng"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <SquarePen className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenDelete(row)}
            title="Xóa kho hàng"
            className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
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
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-4 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 pb-2 sm:pb-4 border-b border-border/70 mb-2 sm:mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1">
                <span>Hệ thống</span>
                <span className="text-muted-foreground/30">/</span>
                <span>Vận hành & Kho</span>
                <span className="text-muted-foreground/30">/</span>
                <span className="text-foreground">Kho hàng & Bãi xe</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                  <Warehouse className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Kho Hàng & Bãi Lưu Trữ
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Quản lý mạng lưới kho tổng, kho chi nhánh showroom, kho bảo
                    hành và điểm xuất bán
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
                onClick={handleModalAdd}
                className="h-9 px-4 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer font-medium"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs">Thêm kho mới</span>
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="pt-2">
            <WarehouseNavTabs
              activeTab="warehouses"
              totalWarehouses={totalCount}
            />
          </div>
        </div>
      )}

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card
              key={idx}
              className="p-4 bg-card/60 backdrop-blur-sm border-border/80 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {card.title}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg ${card.bg} ${card.color} flex items-center justify-center`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl font-bold mt-2 ${card.color}`}>
                {isLoadingKPI || isLoading ? (
                  <Skeleton className="h-7 w-12" />
                ) : (
                  card.value
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {card.subtext}
              </p>
            </Card>
          );
        })}
      </div>

      {/* 3. Filter Bar */}
      <div className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo mã kho, tên kho, địa chỉ..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 h-9 text-xs bg-background/80"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-lg text-xs self-start md:self-auto">
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
              Tạm khóa ({inactiveCount})
            </button>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-1 border-t border-border/50 text-xs">
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
        <div className="rounded-xl border border-border/80 bg-card shadow-xs">
          <div className="p-3 flex flex-col gap-3 w-full">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-border/50 shadow-2xs">
                  <FolderOpen className="w-7 h-7 stroke-[1.5]" />
                </div>
                <p className="font-semibold text-base text-foreground">
                  Không tìm thấy kho hàng nào
                </p>
                <p className="text-xs text-muted-foreground max-w-sm mt-1">
                  Chưa có kho hàng phù hợp với bộ lọc tìm kiếm hiện tại.
                </p>
                <Button
                  size="sm"
                  onClick={handleModalAdd}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-1" /> Thêm kho hàng mới
                </Button>
              </div>
            ) : (
              <>
                <Table<KHO_Kho>
                  data={items}
                  columns={columns}
                  showIndex
                  startIndex={(page - 1) * pageSize}
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/70 text-sm text-muted-foreground">
                  <div className="text-xs">
                    Trang <strong className="text-foreground">{page}</strong> /{" "}
                    {totalPages} (Tổng{" "}
                    <strong className="text-foreground">{totalCount}</strong>{" "}
                    kho hàng)
                  </div>

                  <div className="flex items-center gap-1.5">
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
                      className="w-28 text-xs"
                    />

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="h-8 px-2.5 text-xs cursor-pointer"
                    >
                      Trước
                    </Button>
                    <span className="text-xs px-1">
                      {page} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page >= totalPages}
                      className="h-8 px-2.5 text-xs cursor-pointer"
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

      {/* 5. SlideOver Thêm kho mới */}
      <SlideOver
        open={open}
        onClose={() => setOpen(false)}
        title="Thêm Kho Hàng Mới"
        description="Khai báo kho tổng, kho showroom hoặc bãi xe vào hệ thống quản lý chuỗi"
        maxWidth="lg"
      >
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Mã kho <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="Ví dụ: KHO-HN01"
                value={dataAdd.MaKho}
                onChange={(e) =>
                  setDataAdd((prev) => ({
                    ...prev,
                    MaKho: e.target.value.toUpperCase(),
                  }))
                }
                className="text-xs font-mono uppercase"
              />
              {errors.maKho && (
                <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.maKho}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Tên kho hàng <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="Ví dụ: Kho Tổng Hà Nội"
                value={dataAdd.TenKho}
                onChange={(e) =>
                  setDataAdd((prev) => ({ ...prev, TenKho: e.target.value }))
                }
                className="text-xs"
              />
              {errors.tenKho && (
                <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.tenKho}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Trực thuộc Chi nhánh / Showroom
              </label>
              <SearchSelect
                placeholder="Chọn chi nhánh liên kết..."
                options={[
                  { value: "", label: "Kho độc lập / Trung tâm" },
                  ...locationOptions,
                ]}
                value={dataAdd.DiaDiemID || ""}
                onChange={(val) =>
                  setDataAdd((prev) => ({
                    ...prev,
                    DiaDiemID: val ? String(val) : null,
                  }))
                }
                isLoading={isLoadingLocations}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Loại kho
              </label>
              <SearchSelect
                options={loaiKhoOptions}
                value={dataAdd.LoaiKhoID || (loaiKhoOptions[0]?.value ?? 0)}
                onChange={(val) =>
                  setDataAdd((prev) => ({
                    ...prev,
                    LoaiKhoID: Number(val),
                  }))
                }
                isLoading={isLoadingLoaiKho}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Số điện thoại liên hệ
              </label>
              <Input
                placeholder="0243..."
                value={dataAdd.DienThoai || ""}
                onChange={(e) =>
                  setDataAdd((prev) => ({ ...prev, DienThoai: e.target.value }))
                }
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Địa chỉ kho
              </label>
              <Input
                placeholder="Địa chỉ số nhà, đường, quận..."
                value={dataAdd.DiaChi || ""}
                onChange={(e) =>
                  setDataAdd((prev) => ({ ...prev, DiaChi: e.target.value }))
                }
                className="text-xs"
              />
            </div>
          </div>

          {/* Cờ cấu hình */}
          <div className="p-3 rounded-lg border border-border/80 bg-muted/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-foreground block">
                  Đặt làm Kho mặc định
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Hệ thống sẽ tự động ưu tiên kho này khi tạo đơn hàng bán
                </span>
              </div>
              <Switch
                checked={dataAdd.LaKhoMacDinh}
                onCheckedChange={(v) =>
                  setDataAdd((prev) => ({ ...prev, LaKhoMacDinh: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <div>
                <span className="text-xs font-medium text-foreground block">
                  Cho phép tồn âm
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Cho phép xuất hàng kể cả khi tồn kho sổ sách đang bằng 0
                </span>
              </div>
              <Switch
                checked={dataAdd.ChoPhepTonAm}
                onCheckedChange={(v) =>
                  setDataAdd((prev) => ({ ...prev, ChoPhepTonAm: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <div>
                <span className="text-xs font-medium text-foreground block">
                  Trạng thái hoạt động
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Bật để cho phép xuất nhập kho bình thường
                </span>
              </div>
              <Switch
                checked={dataAdd.TrangThai}
                onCheckedChange={(v) =>
                  setDataAdd((prev) => ({ ...prev, TrangThai: v }))
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Ghi chú
            </label>
            <textarea
              rows={2}
              placeholder="Thông tin quy mô, diện tích hoặc ghi chú nội bộ..."
              value={dataAdd.GhiChu || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, GhiChu: e.target.value }))
              }
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              className="cursor-pointer text-xs"
            >
              Hủy bỏ
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isCreating}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer text-xs"
            >
              {isCreating ? "Đang lưu..." : "Xác nhận tạo kho"}
            </Button>
          </div>
        </div>
      </SlideOver>

      {/* 6. SlideOver Sửa kho */}
      <SlideOver
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        title="Cập Nhật Kho Hàng"
        description="Điều chỉnh thông tin địa chỉ, chi nhánh liên kết hoặc chính sách xuất kho"
        maxWidth="lg"
      >
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Mã kho <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="Ví dụ: KHO-HN01"
                value={dataUpdate.MaKho}
                onChange={(e) =>
                  setDataUpdate((prev) => ({
                    ...prev,
                    MaKho: e.target.value.toUpperCase(),
                  }))
                }
                className="text-xs font-mono uppercase"
              />
              {errors.maKho && (
                <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.maKho}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Tên kho hàng <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="Ví dụ: Kho Tổng Hà Nội"
                value={dataUpdate.TenKho}
                onChange={(e) =>
                  setDataUpdate((prev) => ({ ...prev, TenKho: e.target.value }))
                }
                className="text-xs"
              />
              {errors.tenKho && (
                <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.tenKho}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Trực thuộc Chi nhánh / Showroom
              </label>
              <SearchSelect
                placeholder="Chọn chi nhánh liên kết..."
                options={[
                  { value: "", label: "Kho độc lập / Trung tâm" },
                  ...locationOptions,
                ]}
                value={dataUpdate.DiaDiemID || ""}
                onChange={(val) =>
                  setDataUpdate((prev) => ({
                    ...prev,
                    DiaDiemID: val ? String(val) : null,
                  }))
                }
                isLoading={isLoadingLocations}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Loại kho
              </label>
              <SearchSelect
                options={loaiKhoOptions}
                value={dataUpdate.LoaiKhoID || (loaiKhoOptions[0]?.value ?? 0)}
                onChange={(val) =>
                  setDataUpdate((prev) => ({
                    ...prev,
                    LoaiKhoID: Number(val),
                  }))
                }
                isLoading={isLoadingLoaiKho}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Số điện thoại liên hệ
              </label>
              <Input
                placeholder="0243..."
                value={dataUpdate.DienThoai || ""}
                onChange={(e) =>
                  setDataUpdate((prev) => ({
                    ...prev,
                    DienThoai: e.target.value,
                  }))
                }
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Địa chỉ kho
              </label>
              <Input
                placeholder="Địa chỉ số nhà, đường..."
                value={dataUpdate.DiaChi || ""}
                onChange={(e) =>
                  setDataUpdate((prev) => ({ ...prev, DiaChi: e.target.value }))
                }
                className="text-xs"
              />
            </div>
          </div>

          {/* Cờ cấu hình */}
          <div className="p-3 rounded-lg border border-border/80 bg-muted/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-foreground block">
                  Đặt làm Kho mặc định
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Hệ thống tự động ưu tiên khi bán hàng
                </span>
              </div>
              <Switch
                checked={dataUpdate.LaKhoMacDinh}
                onCheckedChange={(v) =>
                  setDataUpdate((prev) => ({ ...prev, LaKhoMacDinh: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <div>
                <span className="text-xs font-medium text-foreground block">
                  Cho phép tồn âm
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Cho phép xuất hàng khi tồn bằng 0
                </span>
              </div>
              <Switch
                checked={dataUpdate.ChoPhepTonAm}
                onCheckedChange={(v) =>
                  setDataUpdate((prev) => ({ ...prev, ChoPhepTonAm: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <div>
                <span className="text-xs font-medium text-foreground block">
                  Trạng thái hoạt động
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Bật để kho mở cửa hoạt động
                </span>
              </div>
              <Switch
                checked={dataUpdate.TrangThai}
                onCheckedChange={(v) =>
                  setDataUpdate((prev) => ({ ...prev, TrangThai: v }))
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Ghi chú
            </label>
            <textarea
              rows={2}
              placeholder="Ghi chú thêm..."
              value={dataUpdate.GhiChu || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({ ...prev, GhiChu: e.target.value }))
              }
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenUpdate(false)}
              className="cursor-pointer text-xs"
            >
              Hủy bỏ
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitUpdate}
              disabled={isUpdating}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer text-xs"
            >
              {isUpdating ? "Đang lưu..." : "Cập nhật kho"}
            </Button>
          </div>
        </div>
      </SlideOver>

      {/* 7. Modal Xóa kho */}
      <ConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleSubmitDelete}
        title="Xác nhận xóa kho hàng"
        description={`Bạn có chắc chắn muốn xóa kho "${selectItemName}"? Lưu ý: Không thể xóa nếu kho đang có dữ liệu tồn kho.`}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default function WarehousesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 md:p-8 space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      }
    >
      <WarehousesContent />
    </Suspense>
  );
}
