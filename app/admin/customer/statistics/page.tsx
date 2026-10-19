"use client";

import React, { Suspense, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/input";
import { SearchSelect } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { CustomerNavTabs } from "@/components/Common/CustomerNavTabs";
import { useThongKeKhachHang } from "@/hooks/ThongKeKhachHang/useThongKeKhachHang";
import { KH_ThongKeKhachHang } from "@/types/thongKeKhachHang";
import {
  Award,
  Crown,
  Search,
  SquarePen,
  FolderOpen,
  Filter,
  DollarSign,
  Wrench,
  ShoppingBag,
  CreditCard,
  Percent,
  Sparkles,
  RefreshCw,
  Calendar,
} from "lucide-react";

const TIER_OPTIONS = [
  { value: "BinhThuong", label: "Hạng Chuẩn (Bình thường)" },
  { value: "Bac", label: "Hạng Bạc (Silver)" },
  { value: "Vang", label: "Hạng Vàng (Gold)" },
  { value: "KimCuong", label: "Hạng Kim Cương (Diamond)" },
];

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

function formatDate(val?: string | null): string {
  if (!val) return "Chưa có";
  try {
    const d = new Date(val);
    return d.toLocaleDateString("vi-VN");
  } catch {
    return val;
  }
}

function StatisticsContent() {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    tierFilter,
    setTierFilter,
    searchInput,
    handleSearch,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    openUpdate,
    setOpenUpdate,
    selectedItem,
    dataUpdate,
    setDataUpdate,
    handleOpenEdit,
    handleSubmitUpdate,
    isUpdating,
  } = useThongKeKhachHang();

  // Metrics
  const vipCount = useMemo(
    () =>
      items.filter(
        (i) => i.hangKhachHang === "Vang" || i.hangKhachHang === "KimCuong",
      ).length,
    [items],
  );

  const totalSpent = useMemo(
    () => items.reduce((acc, cur) => acc + (cur.tongTienDaChi || 0), 0),
    [items],
  );

  const totalDebt = useMemo(
    () => items.reduce((acc, cur) => acc + (cur.congNoHienTai || 0), 0),
    [items],
  );

  const renderTierBadge = (tier: string) => {
    switch (tier) {
      case "KimCuong":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20 shadow-2xs">
            <Crown className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            Kim Cương
          </span>
        );
      case "Vang":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 shadow-2xs">
            <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Hạng Vàng
          </span>
        );
      case "Bac":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20">
            <Sparkles className="w-3.5 h-3.5 text-slate-500" />
            Hạng Bạc
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border/60">
            Chuẩn
          </span>
        );
    }
  };

  const columns: Column<KH_ThongKeKhachHang>[] = [
    {
      key: "khachHangID",
      title: "Khách hàng",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 py-1">
          <span className="font-semibold text-foreground text-sm hover:text-blue-600 transition-colors">
            {row.tenKhachHang || "Hồ sơ #" + row.khachHangID.substring(0, 8)}
          </span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            {row.maKhachHang && (
              <span className="px-1.5 py-0.2 rounded bg-muted border border-border/50 text-[10px]">
                {row.maKhachHang}
              </span>
            )}
            {row.dienThoai && <span>{row.dienThoai}</span>}
          </div>
        </div>
      ),
    },
    {
      key: "hangKhachHang",
      title: "Hạng thẻ",
      classNameHeader:
        "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <div className="flex justify-center">{renderTierBadge(String(v))}</div>
      ),
    },
    {
      key: "diemTichLuy",
      title: "Điểm & Chiết khấu",
      classNameHeader:
        "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex flex-col items-center gap-0.5">
          <span className="font-mono text-xs font-bold text-foreground">
            {row.diemTichLuy ?? 0} pts
          </span>
          {row.tyLeGiamGia > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-500/20">
              Giảm {row.tyLeGiamGia}%
            </span>
          )}
        </div>
      ),
    },
    {
      key: "tongSoDonHang",
      title: "Đơn / Sửa chữa",
      classNameHeader:
        "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex items-center justify-center gap-2 text-xs">
          <span
            className="inline-flex items-center gap-1 font-mono font-medium text-foreground"
            title="Tổng số đơn mua hàng"
          >
            <ShoppingBag className="w-3 h-3 text-blue-500" />
            {row.tongSoDonHang ?? 0}
          </span>
          <span className="text-muted-foreground/30">/</span>
          <span
            className="inline-flex items-center gap-1 font-mono font-medium text-muted-foreground"
            title="Tổng lượt sửa chữa & bảo dưỡng"
          >
            <Wrench className="w-3 h-3 text-amber-500" />
            {row.tongSoLanSuaChua ?? 0}
          </span>
        </div>
      ),
    },
    {
      key: "tongTienDaChi",
      title: "Tổng chi tiêu",
      classNameHeader:
        "w-36 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right",
      render: (v) => (
        <span className="font-mono text-xs font-bold text-foreground">
          {formatCurrency(Number(v))}
        </span>
      ),
    },
    {
      key: "congNoHienTai",
      title: "Công nợ hiện tại",
      classNameHeader:
        "w-36 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right",
      render: (v) => {
        const debt = Number(v) || 0;
        return debt > 0 ? (
          <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
            {formatCurrency(debt)}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground/80 font-mono">
            0 đ
          </span>
        );
      },
    },
    {
      key: "lanMuaHangGanNhat",
      title: "Giao dịch cuối",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex flex-col text-[11px] text-muted-foreground">
          <span title="Lần mua gần nhất">
            Mua: {formatDate(row.lanMuaHangGanNhat)}
          </span>
          <span title="Lần sửa gần nhất" className="text-[10px]">
            Sửa: {formatDate(row.lanSuaChuaGanNhat)}
          </span>
        </div>
      ),
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader:
        "w-20 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => handleOpenEdit(row)}
          title="Điều chỉnh hạng thẻ & công nợ"
          className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
        >
          <SquarePen className="w-4 h-4" />
        </Button>
      ),
    },
  ];

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
                <span className="text-foreground">Xếp hạng & Thống kê</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20 shadow-xs ring-4 ring-amber-500/5">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Xếp hạng & Thống kê Khách hàng
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Theo dõi tích lũy điểm thưởng, hạng thành viên, công nợ mua
                    chịu và chu kỳ dịch vụ
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-9 px-3.5 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs self-start sm:self-auto"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-amber-500" : ""}`}
              />
              <span className="text-xs font-medium">Làm mới dữ liệu</span>
            </Button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <CustomerNavTabs
              activeTab="statistics"
              totalStatistics={totalCount}
            />
          </div>
        </div>
      )}

      {/* 2. KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <Card
          onClick={() => {
            setTierFilter("all");
            setPage(1);
          }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            tierFilter === "all"
              ? "border-blue-500/50 bg-blue-500/5 shadow-xs ring-2 ring-blue-500/10"
              : "border-border/80 bg-card hover:border-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Tổng số hồ sơ tích lũy
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">
            {isLoading ? <Skeleton className="h-7 w-16" /> : totalCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Khách có dữ liệu giao dịch
          </p>
        </Card>

        <Card
          onClick={() => {
            setTierFilter("Vang");
            setPage(1);
          }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            tierFilter === "Vang" || tierFilter === "KimCuong"
              ? "border-amber-500/50 bg-amber-500/5 shadow-xs ring-2 ring-amber-500/10"
              : "border-border/80 bg-card hover:border-border hover:shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Hội viên VIP (Vàng / Kim Cương)
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
            {isLoading ? <Skeleton className="h-7 w-16" /> : vipCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Được hưởng chiết khấu ưu đãi cao
          </p>
        </Card>

        <Card className="p-4 rounded-xl border border-border/80 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Tổng chi tiêu trong trang
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono truncate">
            {isLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              formatCurrency(totalSpent)
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Doanh số tích lũy khách hàng
          </p>
        </Card>

        <Card className="p-4 rounded-xl border border-border/80 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Tổng công nợ hiện tại
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-bold text-rose-600 dark:text-rose-400 font-mono truncate">
            {isLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              formatCurrency(totalDebt)
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Dư nợ mua sỉ / nợ sửa chữa
          </p>
        </Card>
      </div>

      {/* 3. Toolbar */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Tìm theo tên khách hàng hoặc mã..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 pr-8 h-9.5 w-full bg-background/80 text-sm focus-visible:ring-amber-500/20"
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

          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1 mr-0.5" />
            <button
              type="button"
              onClick={() => {
                setTierFilter("all");
                setPage(1);
              }}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                tierFilter === "all"
                  ? "bg-background shadow-xs text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Tất cả hạng
            </button>
            <button
              type="button"
              onClick={() => {
                setTierFilter("BinhThuong");
                setPage(1);
              }}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                tierFilter === "BinhThuong"
                  ? "bg-background shadow-xs text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Chuẩn
            </button>
            <button
              type="button"
              onClick={() => {
                setTierFilter("Bac");
                setPage(1);
              }}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                tierFilter === "Bac"
                  ? "bg-background shadow-xs text-slate-700 dark:text-slate-300 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Bạc
            </button>
            <button
              type="button"
              onClick={() => {
                setTierFilter("Vang");
                setPage(1);
              }}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                tierFilter === "Vang"
                  ? "bg-background shadow-xs text-amber-600 dark:text-amber-400 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Vàng
            </button>
            <button
              type="button"
              onClick={() => {
                setTierFilter("KimCuong");
                setPage(1);
              }}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                tierFilter === "KimCuong"
                  ? "bg-background shadow-xs text-violet-600 dark:text-violet-400 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Kim Cương
            </button>
          </div>
        </div>
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
                  Không có dữ liệu thống kê
                </p>
                <p className="text-xs text-muted-foreground max-w-sm mt-1">
                  Chưa có thông số tích lũy phù hợp với bộ lọc tìm kiếm.
                </p>
              </div>
            ) : (
              <>
                <Table<KH_ThongKeKhachHang>
                  data={items}
                  columns={columns}
                  showIndex
                  startIndex={(page - 1) * pageSize}
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/70 text-sm text-muted-foreground">
                  <div className="text-xs">
                    Trang <strong className="text-foreground">{page}</strong> /{" "}
                    {totalPages} (Tổng{" "}
                    <strong className="text-foreground">{totalCount}</strong> hồ
                    sơ)
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

      {/* 5. SlideOver: CẬP NHẬT HẠNG & CÔNG NỢ */}
      <SlideOver
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        title="Điều chỉnh Hạng Thẻ & Công Nợ"
        description={`Cập nhật đặc quyền và kiểm soát dư nợ cho ${selectedItem?.tenKhachHang || "khách hàng"}`}
        icon={Award}
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
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
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
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
            Khách hàng: <strong>{selectedItem?.tenKhachHang}</strong> (Mã:{" "}
            {selectedItem?.maKhachHang || "—"})
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Hạng thẻ thành viên
              </label>
              <SearchSelect
                options={TIER_OPTIONS}
                value={dataUpdate.HangKhachHang}
                onChange={(val) =>
                  setDataUpdate((prev) => ({
                    ...prev,
                    HangKhachHang: String(val),
                  }))
                }
              />
            </div>

            <div className="col-span-1 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-emerald-500" />
                Tỷ lệ giảm giá (%)
              </label>
              <Input
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={dataUpdate.TyLeGiamGia}
                onChange={(e) =>
                  setDataUpdate((prev) => ({
                    ...prev,
                    TyLeGiamGia: parseFloat(e.target.value) || 0,
                  }))
                }
                className="font-mono rounded-lg"
              />
            </div>

            <div className="col-span-1 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Điểm tích lũy (pts)
              </label>
              <Input
                type="number"
                min={0}
                value={dataUpdate.DiemTichLuy}
                onChange={(e) =>
                  setDataUpdate((prev) => ({
                    ...prev,
                    DiemTichLuy: parseInt(e.target.value) || 0,
                  }))
                }
                className="font-mono rounded-lg"
              />
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-rose-500" />
                Công nợ hiện tại (VNĐ)
              </label>
              <Input
                type="number"
                min={0}
                value={dataUpdate.CongNoHienTai}
                onChange={(e) =>
                  setDataUpdate((prev) => ({
                    ...prev,
                    CongNoHienTai: parseFloat(e.target.value) || 0,
                  }))
                }
                className="font-mono rounded-lg"
                placeholder="Nhập số tiền nợ..."
              />
              <p className="text-[11px] text-muted-foreground">
                Được cập nhật tự động khi khách hàng mua hàng nợ hoặc trả tiền.
              </p>
            </div>
          </div>
        </div>
      </SlideOver>
    </div>
  );
}

export default function CustomerStatisticsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96" />
        </div>
      }
    >
      <StatisticsContent />
    </Suspense>
  );
}
