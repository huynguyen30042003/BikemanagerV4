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
import { WarehouseNavTabs } from "@/components/Common/WarehouseNavTabs";
import { useTonKho } from "@/hooks/TonKho/useTonKho";
import { KHO_TonKho, KHO_GiaoDichTonKho, KHO_LoChiPhiTonKho } from "@/types/tonKho";
import {
  Layers,
  RefreshCw,
  Search,
  FolderOpen,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Warehouse,
  History,
  SlidersHorizontal,
  Package,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
} from "lucide-react";

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function InventoryContent() {
  const searchParams = useSearchParams();
  const initialKhoId = searchParams.get("khoId") || undefined;

  const {
    activeTab,
    setActiveTab,
    page,
    setPage,
    pageSize,
    setPageSize,
    khoFilter,
    setKhoFilter,
    warningFilter,
    setWarningFilter,
    searchInput,
    handleSearch,

    khoOptions,
    isLoadingKhos,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    loChiPhiItems,
    totalLoChiPhis,
    isLoadingLoChiPhis,
    refetchLoChiPhis,

    allGiaoDichItems,
    totalAllGiaoDichs,
    isLoadingAllGiaoDichs,
    refetchAllGiaoDichs,

    openDinhMuc,
    setOpenDinhMuc,
    selectedItem,
    dataDinhMuc,
    setDataDinhMuc,
    handleOpenDinhMuc,
    handleSubmitDinhMuc,
    isUpdatingDinhMuc,

    openTheKho,
    setOpenTheKho,
    theKhoItems,
    isLoadingTheKho,
    handleOpenTheKho,
  } = useTonKho(initialKhoId);

  // Thống kê nhanh
  const lowStockCount = useMemo(
    () =>
      items.filter(
        (i) =>
          i.soLuongToiThieu != null &&
          i.soLuongKhaDung <= i.soLuongToiThieu &&
          i.soLuongKhaDung > 0
      ).length,
    [items]
  );

  const outOfStockCount = useMemo(
    () => items.filter((i) => i.soLuongKhaDung <= 0).length,
    [items]
  );

  const totalAvailable = useMemo(
    () => items.reduce((sum, i) => sum + (i.soLuongKhaDung || 0), 0),
    [items]
  );

  const columns: Column<KHO_TonKho>[] = [
    {
      key: "maSKU",
      title: "Mã SKU & Barcode",
      classNameHeader: "w-40 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-xs font-bold text-foreground">
            {row.maSKU || "—"}
          </span>
          {row.maVach && (
            <span className="font-mono text-[11px] text-muted-foreground">
              Vạch: {row.maVach}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "tenBienThe",
      title: "Sản phẩm & Biến thể",
      classNameHeader: "min-w-[200px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-xs text-foreground line-clamp-1">
            {row.tenBienThe || "Chưa đặt tên biến thể"}
          </span>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            {row.tenSanPham && <span>Dòng: {row.tenSanPham}</span>}
            {row.mauSac && <span>• Màu: {row.mauSac}</span>}
            {row.dungLuongPin && <span>• Pin: {row.dungLuongPin}</span>}
          </div>
        </div>
      ),
    },
    {
      key: "tenKho",
      title: "Kho & Vị trí kệ",
      classNameHeader: "w-44 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 text-xs font-medium text-foreground">
            <Warehouse className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">{row.tenKho || "Kho chung"}</span>
          </div>
          {row.viTriLuuTru ? (
            <span className="text-[11px] text-muted-foreground pl-4.5">
              Kệ: <strong className="text-foreground">{row.viTriLuuTru}</strong>
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground/60 italic pl-4.5">
              Chưa gán vị trí
            </span>
          )}
        </div>
      ),
    },
    {
      key: "soLuong",
      title: "Tồn thực tế",
      classNameHeader: "w-24 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right font-mono text-xs font-semibold text-foreground",
      render: (v) => v || 0,
    },
    {
      key: "soLuongDaDat",
      title: "Đã đặt giữ",
      classNameHeader: "w-24 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right font-mono text-xs text-muted-foreground",
      render: (v) => v || 0,
    },
    {
      key: "soLuongDangChuyen",
      title: "Đang chuyển",
      classNameHeader: "w-24 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right font-mono text-xs text-blue-600 dark:text-blue-400",
      render: (v) => v || 0,
    },
    {
      key: "soLuongKhaDung",
      title: "Khả dụng bán",
      classNameHeader: "w-28 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right",
      render: (_v, row) => {
        const kd = row.soLuongKhaDung || 0;
        const min = row.soLuongToiThieu ?? 5;

        if (kd <= 0) {
          return (
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
              0 (Hết hàng)
            </span>
          );
        }
        if (kd <= min) {
          return (
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              {kd} (Sắp hết)
            </span>
          );
        }
        return (
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            {kd}
          </span>
        );
      },
    },
    {
      key: "soLuongToiThieu",
      title: "Định mức tối thiểu",
      classNameHeader: "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center font-mono text-xs text-muted-foreground",
      render: (v) => (v != null ? v : "—"),
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader: "w-24 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenTheKho(row)}
            title="Xem Thẻ kho / Lịch sử xuất nhập tồn"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <History className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenDinhMuc(row)}
            title="Cài đặt định mức an toàn & vị trí kệ"
            className="h-8 w-8 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const theKhoColumns: Column<KHO_GiaoDichTonKho>[] = [
    {
      key: "ngayTaoLap",
      title: "Thời gian",
      classNameHeader: "w-36 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left text-xs text-muted-foreground",
      render: (v) => formatDate(v ? String(v) : null),
    },
    {
      key: "loaiGiaoDichID",
      title: "Loại giao dịch",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left text-xs",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-foreground">
            {row.tenLoaiGiaoDich || `Giao dịch ${row.loaiGiaoDichID}`}
          </span>
          {row.ghiChu && (
            <span className="text-[11px] text-muted-foreground truncate">
              {row.ghiChu}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "soLuong",
      title: "Biến động",
      classNameHeader: "w-24 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right font-mono text-xs font-bold",
      render: (v) => {
        const num = Number(v) || 0;
        if (num > 0) {
          return (
            <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-0.5">
              <ArrowDownLeft className="w-3 h-3" />+{num}
            </span>
          );
        }
        return (
          <span className="text-rose-600 dark:text-rose-400 inline-flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />{num}
          </span>
        );
      },
    },
    {
      key: "soLuongSau",
      title: "Tồn sau",
      classNameHeader: "w-20 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right font-mono text-xs text-foreground font-semibold",
      render: (v) => v || 0,
    },
    {
      key: "donGiaVon",
      title: "Đơn giá vốn",
      classNameHeader: "w-28 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right font-mono text-xs text-muted-foreground",
      render: (v) => formatCurrency(Number(v)),
    },
  ];

  const loChiPhiColumns: Column<KHO_LoChiPhiTonKho>[] = [
    {
      key: "maSKU",
      title: "Mặt hàng & Mã Lô",
      classNameHeader: "w-64 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left text-xs",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-foreground">
              {row.maSKU || "N/A"}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-muted rounded border border-border/70 text-muted-foreground">
              Lô: {row.loID ? row.loID.slice(0, 8) : "—"}
            </span>
          </div>
          <span className="font-medium text-foreground line-clamp-1">
            {row.tenBienThe || "Sản phẩm"}
          </span>
        </div>
      ),
    },
    {
      key: "soKhung",
      title: "Số khung / Serial",
      classNameHeader: "w-40 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left text-xs",
      render: (_v, row) =>
        row.soKhung || row.maSerial ? (
          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
            {row.soKhung || row.maSerial}
          </span>
        ) : (
          <span className="text-muted-foreground text-[11px] italic">Quản lý theo SL</span>
        ),
    },
    {
      key: "tenKho",
      title: "Kho lưu trữ",
      classNameHeader: "w-40 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left text-xs text-foreground font-medium",
      render: (v) => v || "—",
    },
    {
      key: "loaiThamChieu",
      title: "Nguồn gốc / Tham chiếu",
      classNameHeader: "w-36 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left text-xs",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-muted text-foreground border border-border/60 w-fit">
            {row.loaiThamChieu || "Đơn nhập hàng"}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {formatDate(row.ngayNhap)}
          </span>
        </div>
      ),
    },
    {
      key: "giaNhap",
      title: "Giá nhập gốc",
      classNameHeader: "w-28 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right font-mono text-xs text-muted-foreground",
      render: (v) => formatCurrency(Number(v)),
    },
    {
      key: "chiPhiPhanBo",
      title: "Chi phí PB",
      classNameHeader: "w-24 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right font-mono text-xs text-amber-600 dark:text-amber-400",
      render: (v) => `+${formatCurrency(Number(v))}`,
    },
    {
      key: "giaVonThucTe",
      title: "Giá vốn thực tế",
      classNameHeader: "w-32 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right font-mono text-xs font-bold text-foreground",
      render: (v) => (
        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
          {formatCurrency(Number(v))}
        </span>
      ),
    },
    {
      key: "soLuongConLai",
      title: "Còn lại / Nhập",
      classNameHeader: "w-28 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right font-mono text-xs",
      render: (_v, row) => (
        <div className="flex items-center justify-end gap-1">
          <span className="font-bold text-foreground">{row.soLuongConLai}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground text-[11px]">{row.soLuongNhap}</span>
        </div>
      ),
    },
  ];

  const allGiaoDichColumns: Column<KHO_GiaoDichTonKho>[] = [
    {
      key: "ngayTaoLap",
      title: "Thời gian",
      classNameHeader: "w-36 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left text-xs text-muted-foreground",
      render: (v) => formatDate(v ? String(v) : null),
    },
    {
      key: "tenKho",
      title: "Kho hàng",
      classNameHeader: "w-36 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left text-xs font-medium text-foreground",
      render: (v) => v || "—",
    },
    {
      key: "maSKU",
      title: "Sản phẩm & SKU",
      classNameHeader: "w-64 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left text-xs",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-foreground">
              {row.maSKU || "N/A"}
            </span>
            {row.maSerial && (
              <span className="text-[10px] font-mono px-1 py-0.2 bg-blue-500/10 text-blue-700 dark:text-blue-300 rounded border border-blue-500/20">
                SN: {row.maSerial}
              </span>
            )}
          </div>
          <span className="font-medium text-foreground line-clamp-1">
            {row.tenBienThe || "Sản phẩm"}
          </span>
        </div>
      ),
    },
    {
      key: "loaiGiaoDichID",
      title: "Loại giao dịch",
      classNameHeader: "w-48 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left text-xs",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-foreground">
            {row.tenLoaiGiaoDich || `Giao dịch ${row.loaiGiaoDichID}`}
          </span>
          {row.ghiChu && (
            <span className="text-[11px] text-muted-foreground line-clamp-1">
              {row.ghiChu}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "soLuong",
      title: "Biến động",
      classNameHeader: "w-24 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right font-mono text-xs font-bold",
      render: (v) => {
        const num = Number(v) || 0;
        if (num > 0) {
          return (
            <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-0.5">
              <ArrowDownLeft className="w-3 h-3" />+{num}
            </span>
          );
        }
        return (
          <span className="text-rose-600 dark:text-rose-400 inline-flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />{num}
          </span>
        );
      },
    },
    {
      key: "soLuongSau",
      title: "Tồn trước ➔ sau",
      classNameHeader: "w-28 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right font-mono text-xs",
      render: (_v, row) => (
        <span>
          <span className="text-muted-foreground">{row.soLuongTruoc ?? "—"}</span>
          <span className="text-muted-foreground mx-1">➔</span>
          <span className="font-bold text-foreground">{row.soLuongSau}</span>
        </span>
      ),
    },
    {
      key: "donGiaVon",
      title: "Đơn giá vốn",
      classNameHeader: "w-28 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right font-mono text-xs text-muted-foreground",
      render: (v) => formatCurrency(Number(v)),
    },
    {
      key: "giaTri",
      title: "Tổng giá trị",
      classNameHeader: "w-32 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right font-mono text-xs font-bold text-foreground",
      render: (v) => formatCurrency(Number(v)),
    },
  ];

  const hasActiveFilters = Boolean(searchInput || khoFilter || warningFilter !== "all");

  const handleResetFilters = () => {
    handleSearch("");
    setKhoFilter("");
    setWarningFilter("all");
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
                <span>Vận hành & Kho</span>
                <span className="text-muted-foreground/30">/</span>
                <span className="text-foreground">Tồn kho & Thẻ kho</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Quản Lý Tồn Kho & Thẻ Kho
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Theo dõi số lượng tồn thực tế, khả dụng bán, định mức an toàn và lịch sử xuất nhập thẻ kho
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
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="pt-2">
            <WarehouseNavTabs activeTab="inventory" totalInventory={totalCount} />
          </div>
        </div>
      )}

      {/* 2. Sub-Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-border/70 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => {
            setActiveTab("stock");
            setPage(1);
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "stock"
              ? "bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/20"
              : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Tồn kho thực tế</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === "stock"
                ? "bg-white/20 text-white"
                : "bg-background text-muted-foreground"
            }`}
          >
            {totalCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("costs");
            setPage(1);
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "costs"
              ? "bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/20"
              : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Lô chi phí & Giá vốn (KHO_LoChiPhiTonKho)</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === "costs"
                ? "bg-white/20 text-white"
                : "bg-background text-muted-foreground"
            }`}
          >
            {totalLoChiPhis}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("transactions");
            setPage(1);
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "transactions"
              ? "bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/20"
              : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Sổ giao dịch biến động (KHO_GiaoDichTonKho)</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === "transactions"
                ? "bg-white/20 text-white"
                : "bg-background text-muted-foreground"
            }`}
          >
            {totalAllGiaoDichs}
          </span>
        </button>
      </div>

      {/* 3. KPI Cards - Only on Stock Tab */}
      {activeTab === "stock" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Mặt hàng tồn (SKU)</span>
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">
              {isLoading ? <Skeleton className="h-7 w-12" /> : totalCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Phiên bản / Mã hàng quản lý</p>
          </Card>

          <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Tổng tồn khả dụng</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
              {isLoading ? <Skeleton className="h-7 w-12" /> : totalAvailable}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Số lượng sẵn sàng bán ra</p>
          </Card>

          <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Sắp hết hàng</span>
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">
              {isLoading ? <Skeleton className="h-7 w-12" /> : lowStockCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Dưới ngưỡng an toàn tối thiểu</p>
          </Card>

          <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Hết hàng</span>
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2">
              {isLoading ? <Skeleton className="h-7 w-12" /> : outOfStockCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Cần lập đơn mua / nhập kho gấp</p>
          </Card>
        </div>
      )}

      {/* 4. Filter Bar */}
      <div className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-1 flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={
                  activeTab === "stock"
                    ? "Tìm SKU, mã vạch, tên xe, phiên bản..."
                    : activeTab === "costs"
                    ? "Tìm mã SKU, số khung, mã lô chi phí..."
                    : "Tìm theo mã SKU, số serial, ghi chú..."
                }
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 h-9 text-xs bg-background/80"
              />
            </div>

            {/* Chọn Kho */}
            <div className="w-full sm:w-64">
              <SearchSelect
                placeholder="Tất cả kho hàng..."
                options={[{ value: "", label: "Tất cả kho hàng" }, ...khoOptions]}
                value={khoFilter}
                onChange={(val) => {
                  setKhoFilter(val ? String(val) : "");
                  setPage(1);
                }}
                isLoading={isLoadingKhos}
              />
            </div>
          </div>

          {activeTab === "stock" && (
            <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-lg text-xs self-start md:self-auto">
              <button
                type="button"
                onClick={() => setWarningFilter("all")}
                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  warningFilter === "all"
                    ? "bg-background shadow-xs text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Tất cả ({items.length})
              </button>
              <button
                type="button"
                onClick={() => setWarningFilter("low")}
                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  warningFilter === "low"
                    ? "bg-background shadow-xs text-amber-600 dark:text-amber-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sắp hết ({lowStockCount})
              </button>
              <button
                type="button"
                onClick={() => setWarningFilter("out")}
                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  warningFilter === "out"
                    ? "bg-background shadow-xs text-rose-600 dark:text-rose-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Hết hàng ({outOfStockCount})
              </button>
            </div>
          )}
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

      {/* 5. Main Table depending on Active Tab */}
      {activeTab === "stock" && (
        isLoading ? (
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
                    Không tìm thấy mặt hàng tồn kho nào
                  </p>
                  <p className="text-xs text-muted-foreground max-w-sm mt-1">
                    Chưa có số liệu tồn kho thỏa mãn điều kiện lọc tìm kiếm hiện tại.
                  </p>
                </div>
              ) : (
                <>
                  <Table<KHO_TonKho>
                    data={items}
                    columns={columns}
                    showIndex
                    startIndex={(page - 1) * pageSize}
                  />

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/70 text-sm text-muted-foreground">
                    <div className="text-xs">
                      Trang <strong className="text-foreground">{page}</strong> / {totalPages}{" "}
                      (Tổng <strong className="text-foreground">{totalCount}</strong> mặt hàng)
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
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
        )
      )}

      {/* Tab 2: Lô chi phí tồn kho (KHO_LoChiPhiTonKho) */}
      {activeTab === "costs" && (
        isLoadingLoChiPhis ? (
          <Card className="p-6">
            <Skeleton className="h-10 w-full mb-3" />
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-12 w-full" />
          </Card>
        ) : (
          <div className="rounded-xl border border-border/80 bg-card shadow-xs">
            <div className="p-3 flex flex-col gap-3 w-full">
              {loChiPhiItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-border/50 shadow-2xs">
                    <Receipt className="w-7 h-7 stroke-[1.5]" />
                  </div>
                  <p className="font-semibold text-base text-foreground">
                    Chưa có lô chi phí tồn kho nào
                  </p>
                  <p className="text-xs text-muted-foreground max-w-sm mt-1">
                    Các lô giá vốn và chi phí phân bổ sẽ được tự động ghi nhận khi hoàn thành đơn nhập hàng hoặc điều chuyển kho.
                  </p>
                </div>
              ) : (
                <>
                  <Table<KHO_LoChiPhiTonKho>
                    data={loChiPhiItems}
                    columns={loChiPhiColumns}
                    showIndex
                    startIndex={(page - 1) * pageSize}
                  />

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/70 text-sm text-muted-foreground">
                    <div className="text-xs">
                      Trang <strong className="text-foreground">{page}</strong> /{" "}
                      {Math.max(1, Math.ceil(totalLoChiPhis / pageSize))} (Tổng{" "}
                      <strong className="text-foreground">{totalLoChiPhis}</strong> lô chi phí)
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
                        {page} / {Math.max(1, Math.ceil(totalLoChiPhis / pageSize))}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPage((p) =>
                            Math.min(Math.max(1, Math.ceil(totalLoChiPhis / pageSize)), p + 1)
                          )
                        }
                        disabled={page >= Math.max(1, Math.ceil(totalLoChiPhis / pageSize))}
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
        )
      )}

      {/* Tab 3: Sổ giao dịch biến động thẻ kho (KHO_GiaoDichTonKho) */}
      {activeTab === "transactions" && (
        isLoadingAllGiaoDichs ? (
          <Card className="p-6">
            <Skeleton className="h-10 w-full mb-3" />
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-12 w-full" />
          </Card>
        ) : (
          <div className="rounded-xl border border-border/80 bg-card shadow-xs">
            <div className="p-3 flex flex-col gap-3 w-full">
              {allGiaoDichItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-border/50 shadow-2xs">
                    <History className="w-7 h-7 stroke-[1.5]" />
                  </div>
                  <p className="font-semibold text-base text-foreground">
                    Chưa có giao dịch biến động thẻ kho nào
                  </p>
                  <p className="text-xs text-muted-foreground max-w-sm mt-1">
                    Mọi hoạt động nhập hàng, xuất bán, chuyển kho và kiểm kê sẽ tự động ghi sổ tại đây.
                  </p>
                </div>
              ) : (
                <>
                  <Table<KHO_GiaoDichTonKho>
                    data={allGiaoDichItems}
                    columns={allGiaoDichColumns}
                    showIndex
                    startIndex={(page - 1) * pageSize}
                  />

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/70 text-sm text-muted-foreground">
                    <div className="text-xs">
                      Trang <strong className="text-foreground">{page}</strong> /{" "}
                      {Math.max(1, Math.ceil(totalAllGiaoDichs / pageSize))} (Tổng{" "}
                      <strong className="text-foreground">{totalAllGiaoDichs}</strong> giao dịch)
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
                        {page} / {Math.max(1, Math.ceil(totalAllGiaoDichs / pageSize))}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPage((p) =>
                            Math.min(Math.max(1, Math.ceil(totalAllGiaoDichs / pageSize)), p + 1)
                          )
                        }
                        disabled={page >= Math.max(1, Math.ceil(totalAllGiaoDichs / pageSize))}
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
        )
      )}

      {/* 5. SlideOver Cập nhật Định mức tồn tối thiểu & Vị trí kệ */}
      <SlideOver
        open={openDinhMuc}
        onClose={() => setOpenDinhMuc(false)}
        title="Cài Đặt Định Mức & Kệ Hàng"
        description="Thiết lập ngưỡng tồn kho an toàn và vị trí dãy/kệ lưu trữ trong kho"
        maxWidth="md"
      >
        <div className="space-y-4 py-2">
          {selectedItem && (
            <div className="p-3 rounded-lg border border-border/80 bg-muted/40 space-y-1">
              <span className="font-mono text-xs font-bold text-foreground">
                {selectedItem.maSKU}
              </span>
              <p className="text-xs font-semibold text-foreground">
                {selectedItem.tenBienThe}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Tại: {selectedItem.tenKho}
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Số lượng tồn kho tối thiểu (Ngưỡng cảnh báo)
            </label>
            <Input
              type="number"
              min={0}
              value={dataDinhMuc.SoLuongToiThieu}
              onChange={(e) =>
                setDataDinhMuc((prev) => ({
                  ...prev,
                  SoLuongToiThieu: parseInt(e.target.value) || 0,
                }))
              }
              className="text-xs font-mono"
            />
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Hệ thống sẽ gắn cờ cảnh báo màu vàng khi số lượng khả dụng thấp hơn mức này
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Vị trí lưu kho / Kệ hàng
            </label>
            <Input
              placeholder="Ví dụ: Kệ A1 - Tầng 2, Dãy Bãi 03"
              value={dataDinhMuc.ViTriLuuTru || ""}
              onChange={(e) =>
                setDataDinhMuc((prev) => ({
                  ...prev,
                  ViTriLuuTru: e.target.value,
                }))
              }
              className="text-xs"
            />
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenDinhMuc(false)}
              className="cursor-pointer text-xs"
            >
              Hủy bỏ
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitDinhMuc}
              disabled={isUpdatingDinhMuc}
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer text-xs font-semibold"
            >
              {isUpdatingDinhMuc ? "Đang lưu..." : "Lưu cài đặt"}
            </Button>
          </div>
        </div>
      </SlideOver>

      {/* 6. SlideOver Xem Thẻ kho */}
      <SlideOver
        open={openTheKho}
        onClose={() => setOpenTheKho(false)}
        title="Sổ Thẻ Kho / Lịch Sử Giao Dịch"
        description="Theo dõi toàn bộ biến động xuất, nhập, chuyển kho và đối soát số lượng tồn"
        maxWidth="xl"
      >
        <div className="space-y-4 py-2">
          {selectedItem && (
            <div className="p-3 rounded-lg border border-border/80 bg-muted/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground">
                  {selectedItem.maSKU}
                </span>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  Tồn hiện tại: {selectedItem.soLuong}
                </span>
              </div>
              <p className="text-xs font-semibold text-foreground">
                {selectedItem.tenBienThe}
              </p>
            </div>
          )}

          {isLoadingTheKho ? (
            <div className="space-y-2 py-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : theKhoItems.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-xs">
              Chưa có lịch sử giao dịch phát sinh cho mặt hàng này tại kho đã chọn.
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table<KHO_GiaoDichTonKho>
                data={theKhoItems}
                columns={theKhoColumns}
                showIndex
              />
            </div>
          )}
        </div>
      </SlideOver>
    </div>
  );
}

export default function InventoryPage() {
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
      <InventoryContent />
    </Suspense>
  );
}
