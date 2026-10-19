"use client";

import React, { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/input";
import { SearchSelect } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { CustomerNavTabs } from "@/components/Common/CustomerNavTabs";
import { useLichSuSoHuuPhuongTien } from "@/hooks/LichSuSoHuuPhuongTien/useLichSuSoHuuPhuongTien";
import { KH_LichSuSoHuuPhuongTien } from "@/types/lichSuSoHuuPhuongTien";
import {
  History,
  ArrowRightLeft,
  Search,
  FolderOpen,
  Filter,
  CheckCircle2,
  Clock,
  Bike,
  UserCheck,
  AlertCircle,
  RefreshCw,
  Tag,
} from "lucide-react";

function formatDate(val?: string | null): string {
  if (!val) return "Hiện tại";
  try {
    const d = new Date(val);
    return d.toLocaleDateString("vi-VN");
  } catch {
    return val;
  }
}

const LY_DO_OPTIONS = [
  { value: "SangTen", label: "Sang tên xe (Chuyển quyền chủ mới)" },
  { value: "ThuCuDoiMoi", label: "Thu cũ đổi mới (Trade-in)" },
  { value: "BanLai", label: "Bán lại xe cũ cho cửa hàng" },
];

function OwnershipsContent() {
  const searchParams = useSearchParams();
  const initialVehicleId = searchParams.get("vehicleId") || undefined;
  const initialKhachHangId = searchParams.get("khachHangId") || undefined;

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    lyDoFilter,
    setLyDoFilter,
    vehicleFilter,
    setVehicleFilter,
    customerFilter,
    setCustomerFilter,
    searchInput,
    handleSearch,

    vehicleOptions,
    isLoadingVehicles,
    customerOptions,
    isLoadingCustomers,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    openTransfer,
    setOpenTransfer,
    dataTransfer,
    setDataTransfer,
    handleOpenTransfer,
    handleSubmitTransfer,
    isTransferring,

    errors,
  } = useLichSuSoHuuPhuongTien(initialVehicleId, initialKhachHangId);

  // Metrics
  const currentOwnersCount = useMemo(
    () => items.filter((i) => i.laChuSoHuuHienTai === true).length,
    [items],
  );
  const transferredCount = useMemo(
    () => items.filter((i) => i.laChuSoHuuHienTai === false).length,
    [items],
  );
  const tradeInCount = useMemo(
    () => items.filter((i) => i.lyDo === "ThuCuDoiMoi").length,
    [items],
  );

  const renderLyDoBadge = (lyDo?: string | null) => {
    switch (lyDo) {
      case "MuaMoi":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
            Mua mới
          </span>
        );
      case "SangTen":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
            Sang tên đổi chủ
          </span>
        );
      case "ThuCuDoiMoi":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
            Thu cũ đổi mới
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border/60">
            {lyDo || "Khác"}
          </span>
        );
    }
  };

  const columns: Column<KH_LichSuSoHuuPhuongTien>[] = [
    {
      key: "phuongTienKhachHangID",
      title: "Phương tiện xe",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex items-center gap-2.5 py-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/20">
            <Bike className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm">
              {row.tenModel ||
                "Phương tiện #" + row.phuongTienKhachHangID.substring(0, 8)}
            </span>
            <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
              {row.bienSo || "Chưa có biển số"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "khachHangID",
      title: "Chủ sở hữu",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 text-xs py-1">
          <span className="font-semibold text-foreground">
            {row.tenKhachHang || "Khách #" + row.khachHangID.substring(0, 8)}
          </span>
          {row.dienThoaiKhachHang && (
            <span className="font-mono text-muted-foreground text-[11px]">
              {row.dienThoaiKhachHang}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "ngayBatDauSoHuu",
      title: "Thời gian sở hữu",
      classNameHeader:
        "w-48 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex flex-col items-center text-xs">
          <span className="font-mono text-foreground font-medium">
            {formatDate(row.ngayBatDauSoHuu)} →{" "}
            {formatDate(row.ngayKetThucSoHuu)}
          </span>
          <span className="text-[10px] text-muted-foreground mt-0.5">
            {row.laChuSoHuuHienTai ? "Đang sở hữu" : "Đã sang tên"}
          </span>
        </div>
      ),
    },
    {
      key: "lyDo",
      title: "Lý do ghi nhận",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <div className="flex justify-center">{renderLyDoBadge(String(v))}</div>
      ),
    },
    {
      key: "laChuSoHuuHienTai",
      title: "Trạng thái",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) =>
        v ? (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Chủ hiện tại
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
              <Clock className="w-3 h-3 text-slate-400" />
              Đã chuyển nhượng
            </span>
          </div>
        ),
    },
  ];

  const hasActiveFilters = Boolean(
    searchInput || lyDoFilter !== "all" || vehicleFilter || customerFilter,
  );

  const handleResetFilters = () => {
    handleSearch("");
    setLyDoFilter("all");
    setVehicleFilter("");
    setCustomerFilter("");
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
                <span className="text-foreground">Lịch sử sở hữu xe</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20 shadow-xs ring-4 ring-indigo-500/5">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Lịch sử Sở hữu & Sang tên Phương tiện
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Truy vết vòng đời sở hữu của phương tiện qua các đời chủ,
                    thực hiện nghiệp vụ sang tên và thu cũ đổi mới
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
                  className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-indigo-500" : ""}`}
                />
                <span className="text-xs font-medium">Làm mới</span>
              </Button>

              <Button
                size="sm"
                onClick={() => handleOpenTransfer()}
                className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span className="text-xs font-medium">Sang tên xe</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <CustomerNavTabs
              activeTab="ownerships"
              totalOwnerships={totalCount}
            />
          </div>
        </div>
      )}

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <Card
          onClick={() => {
            setLyDoFilter("all");
            setPage(1);
          }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            lyDoFilter === "all"
              ? "border-blue-500/50 bg-blue-500/5 shadow-xs ring-2 ring-blue-500/10"
              : "border-border/80 bg-card hover:border-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Tổng số lượt sở hữu
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">
            {isLoading ? <Skeleton className="h-7 w-16" /> : totalCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Toàn bộ lịch sử sở hữu đã lưu
          </p>
        </Card>

        <Card className="p-4 rounded-xl border border-border/80 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Chủ sở hữu hiện tại
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {isLoading ? <Skeleton className="h-7 w-16" /> : currentOwnersCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Các xe đang có người đứng tên
          </p>
        </Card>

        <Card
          onClick={() => {
            setLyDoFilter("SangTen");
            setPage(1);
          }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            lyDoFilter === "SangTen"
              ? "border-indigo-500/50 bg-indigo-500/5 shadow-xs ring-2 ring-indigo-500/10"
              : "border-border/80 bg-card hover:border-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Lượt sang tên đổi chủ
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {isLoading ? <Skeleton className="h-7 w-16" /> : transferredCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Chuyển giao quyền sở hữu thành công
          </p>
        </Card>

        <Card
          onClick={() => {
            setLyDoFilter("ThuCuDoiMoi");
            setPage(1);
          }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            lyDoFilter === "ThuCuDoiMoi"
              ? "border-amber-500/50 bg-amber-500/5 shadow-xs ring-2 ring-amber-500/10"
              : "border-border/80 bg-card hover:border-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Thu cũ đổi mới (Trade-in)
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
            {isLoading ? <Skeleton className="h-7 w-16" /> : tradeInCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Thu hồi xe cũ lên đời xe mới
          </p>
        </Card>
      </div>

      {/* 3. Toolbar */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Tìm theo biển số, dòng xe hoặc tên khách hàng..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 pr-8 h-9.5 w-full bg-background/80 text-sm focus-visible:ring-indigo-500/20"
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

          <div className="flex items-center gap-2 flex-wrap">
            {/* Lọc Xe */}
            <div className="w-52">
              <SearchSelect
                options={[
                  { value: "", label: "Tất cả phương tiện" },
                  ...vehicleOptions,
                ]}
                value={vehicleFilter}
                onChange={(val) => {
                  setVehicleFilter(String(val));
                  setPage(1);
                }}
                placeholder="Chọn xe"
                isLoading={isLoadingVehicles}
                className="h-9.5 text-xs"
              />
            </div>

            {/* Lọc Khách hàng */}
            <div className="w-52">
              <SearchSelect
                options={[
                  { value: "", label: "Tất cả chủ sở hữu" },
                  ...customerOptions,
                ]}
                value={customerFilter}
                onChange={(val) => {
                  setCustomerFilter(String(val));
                  setPage(1);
                }}
                placeholder="Chọn chủ sở hữu"
                isLoading={isLoadingCustomers}
                className="h-9.5 text-xs"
              />
            </div>

            {/* Lọc Lý do */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0">
              <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1 mr-0.5" />
              <button
                type="button"
                onClick={() => {
                  setLyDoFilter("all");
                  setPage(1);
                }}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  lyDoFilter === "all"
                    ? "bg-background shadow-xs text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Tất cả lý do
              </button>
              <button
                type="button"
                onClick={() => {
                  setLyDoFilter("MuaMoi");
                  setPage(1);
                }}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  lyDoFilter === "MuaMoi"
                    ? "bg-background shadow-xs text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Mua mới
              </button>
              <button
                type="button"
                onClick={() => {
                  setLyDoFilter("SangTen");
                  setPage(1);
                }}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  lyDoFilter === "SangTen"
                    ? "bg-background shadow-xs text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sang tên
              </button>
              <button
                type="button"
                onClick={() => {
                  setLyDoFilter("ThuCuDoiMoi");
                  setPage(1);
                }}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  lyDoFilter === "ThuCuDoiMoi"
                    ? "bg-background shadow-xs text-amber-600 dark:text-amber-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Thu cũ đổi mới
              </button>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-1 border-t border-border/50 text-xs flex-wrap">
            <span className="text-muted-foreground font-medium">Đang lọc:</span>
            {vehicleFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                Xe: {vehicleFilter.substring(0, 8)}...
                <button
                  type="button"
                  onClick={() => setVehicleFilter("")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}
            {customerFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                Chủ xe: {customerFilter.substring(0, 8)}...
                <button
                  type="button"
                  onClick={() => setCustomerFilter("")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}
            {lyDoFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                Lý do: {lyDoFilter}
                <button
                  type="button"
                  onClick={() => setLyDoFilter("all")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer ml-auto"
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
                  Không tìm thấy lịch sử sở hữu
                </p>
                <p className="text-xs text-muted-foreground max-w-sm mt-1">
                  Chưa có giao dịch sở hữu xe nào khớp với điều kiện tìm kiếm.
                </p>
              </div>
            ) : (
              <>
                <Table<KH_LichSuSoHuuPhuongTien>
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
                    bản ghi)
                  </div>

                  <div className="flex items-center gap-1.5">
                    <SearchSelect
                      options={[
                        { value: 10, label: "10" },
                        { value: 20, label: "20" },
                        { value: 50, label: "50" },
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

      {/* 5. SlideOver: SANG TÊN XE / CHUYỂN QUYỀN SỞ HỮU */}
      <SlideOver
        open={openTransfer}
        onClose={() => setOpenTransfer(false)}
        title="Chuyển quyền Sở hữu / Sang tên xe"
        description="Bàn giao phương tiện cho chủ sở hữu mới hoặc ghi nhận thu cũ đổi mới"
        icon={ArrowRightLeft}
        footer={
          <>
            <Button
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={() => setOpenTransfer(false)}
              disabled={isTransferring}
            >
              Hủy
            </Button>
            <Button
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
              onClick={handleSubmitTransfer}
              disabled={isTransferring}
            >
              {isTransferring ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
              ) : null}
              Xác nhận sang tên
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-200">
            Hệ thống sẽ cập nhật thời gian kết thúc sở hữu của chủ cũ và thiết
            lập khách hàng mới làm <strong>Chủ sở hữu hiện tại</strong> của
            phương tiện.
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Phương tiện xe cần sang tên{" "}
                <span className="text-red-500">*</span>
              </label>
              <SearchSelect
                options={vehicleOptions}
                value={dataTransfer.PhuongTienKhachHangID}
                onChange={(val) =>
                  setDataTransfer((prev) => ({
                    ...prev,
                    PhuongTienKhachHangID: String(val),
                  }))
                }
                placeholder="Chọn xe cần sang tên"
                isLoading={isLoadingVehicles}
                className={errors.phuongTienKhachHangID ? "border-red-500" : ""}
              />
              {errors.phuongTienKhachHangID && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.phuongTienKhachHangID}
                </p>
              )}
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Khách hàng chủ sở hữu mới{" "}
                <span className="text-red-500">*</span>
              </label>
              <SearchSelect
                options={customerOptions}
                value={dataTransfer.KhachHangMoiID}
                onChange={(val) =>
                  setDataTransfer((prev) => ({
                    ...prev,
                    KhachHangMoiID: String(val),
                  }))
                }
                placeholder="Chọn người nhận quyền sở hữu mới"
                isLoading={isLoadingCustomers}
                className={errors.khachHangMoiID ? "border-red-500" : ""}
              />
              {errors.khachHangMoiID && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.khachHangMoiID}
                </p>
              )}
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Hình thức chuyển giao <span className="text-red-500">*</span>
              </label>
              <SearchSelect
                options={LY_DO_OPTIONS}
                value={dataTransfer.LyDo}
                onChange={(val) =>
                  setDataTransfer((prev) => ({ ...prev, LyDo: String(val) }))
                }
              />
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Ghi chú bàn giao
              </label>
              <Input
                value={dataTransfer.GhiChu || ""}
                onChange={(e) =>
                  setDataTransfer((prev) => ({
                    ...prev,
                    GhiChu: e.target.value,
                  }))
                }
                placeholder="Ghi chú về giấy tờ bàn giao, số tiền chuyển nhượng..."
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </SlideOver>
    </div>
  );
}

export default function OwnershipsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96" />
        </div>
      }
    >
      <OwnershipsContent />
    </Suspense>
  );
}
