"use client";

import React, { Suspense, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/input";
import { SearchSelect } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { WarehouseNavTabs } from "@/components/Common/WarehouseNavTabs";
import { usePhieuKiemKe } from "@/hooks/PhieuKiemKe/usePhieuKiemKe";
import { useGetPhieuKiemKeKPI } from "@/hooks/PhieuKiemKe/usePhieuKiemKeApi";
import { KHO_PhieuKiemKe } from "@/types/phieuKiemKe";
import {
  ClipboardCheck,
  Plus,
  RefreshCw,
  FolderOpen,
  CheckCircle2,
  Clock,
  Warehouse,
  Eye,
  Calendar,
  AlertTriangle,
  Scale,
  Ban,
  FileSpreadsheet,
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

function StockAuditsContent() {
  const { data: auditKpi, isLoading: isLoadingKPI } = useGetPhieuKiemKeKPI();

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    khoFilter,
    setKhoFilter,

    khoOptions,
    isLoadingKhos,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    openCreate,
    setOpenCreate,
    dataCreate,
    setDataCreate,
    handleOpenCreate,
    handleSubmitCreate,
    isCreating,

    openDetail,
    setOpenDetail,
    selectedPhieu,
    handleOpenDetail,

    openCapNhat,
    setOpenCapNhat,
    dataCapNhat,
    setDataCapNhat,
    handleOpenCapNhat,
    handleSubmitCapNhat,
    isCapNhatting,

    handleCanBang,
    isCanBang,
    handleHuyPhieu,
    isHuyPhieu,

    auditStatusOptions,
    getAuditStatusBadge,
    getAuditStatusLabel,
    isLoadingAuditStatuses,
    reasonDiscrepancyOptions,
    getReasonDiscrepancyLabel,
    isLoadingReasons,
  } = usePhieuKiemKe();

  // Thống kê nhanh theo trạng thái động từ DM_DanhMucChiTiet
  const inProgressCount = useMemo(
    () =>
      items.filter((i) => {
        const b = getAuditStatusBadge(i.trangThaiID);
        return (
          b.color === "amber" || i.trangThaiID === 26 || i.trangThaiID === 1
        );
      }).length,
    [items, getAuditStatusBadge],
  );
  const balancedCount = useMemo(
    () =>
      items.filter((i) => {
        const b = getAuditStatusBadge(i.trangThaiID);
        return (
          b.color === "emerald" || i.trangThaiID === 27 || i.trangThaiID === 2
        );
      }).length,
    [items, getAuditStatusBadge],
  );
  const totalDiscrepancy = useMemo(
    () => items.reduce((sum, i) => sum + Math.abs(i.tongSoLuongLech || 0), 0),
    [items],
  );

  const columns: Column<KHO_PhieuKiemKe>[] = [
    {
      key: "maPhieuKiemKe",
      title: "Mã phiếu",
      classNameHeader:
        "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
          {v ? String(v).toUpperCase() : "—"}
        </span>
      ),
    },
    {
      key: "tenKho",
      title: "Kho kiểm kê",
      classNameHeader:
        "min-w-[180px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (v) => (
        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
          <Warehouse className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>{v || "Kho chung"}</span>
        </div>
      ),
    },
    {
      key: "tongSoLuongHeThong",
      title: "Sổ sách / Thực tế",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex items-center justify-center gap-1 text-xs font-mono">
          <span className="text-muted-foreground">
            {row.tongSoLuongHeThong}
          </span>
          <span className="text-muted-foreground/40">/</span>
          <span className="font-bold text-foreground">
            {row.tongSoLuongThucTe}
          </span>
        </div>
      ),
    },
    {
      key: "tongSoLuongLech",
      title: "Chênh lệch",
      classNameHeader:
        "w-28 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right font-mono text-xs font-bold",
      render: (v) => {
        const num = Number(v) || 0;
        if (num === 0) {
          return (
            <span className="text-emerald-600 dark:text-emerald-400">
              Khớp (0)
            </span>
          );
        }
        if (num > 0) {
          return (
            <span className="text-blue-600 dark:text-blue-400">
              +{num} (Thừa)
            </span>
          );
        }
        return (
          <span className="text-rose-600 dark:text-rose-400">
            {num} (Thiếu)
          </span>
        );
      },
    },
    {
      key: "ngayKiemKe",
      title: "Thời gian",
      classNameHeader:
        "w-36 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 text-[11px] text-muted-foreground">
          <span>Kiểm: {formatDate(row.ngayKiemKe)}</span>
          {row.ngayCanBang && <span>Duyệt: {formatDate(row.ngayCanBang)}</span>}
        </div>
      ),
    },
    {
      key: "trangThaiID",
      title: "Trạng thái",
      classNameHeader:
        "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => {
        const badge = getAuditStatusBadge(Number(v));
        return (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {badge.label}
          </span>
        );
      },
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader:
        "w-24 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenDetail(row)}
            title="Xem chi tiết & Đối soát"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </Button>

          {row.trangThaiID === 1 && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => handleOpenCapNhat(row)}
              title="Cập nhật số đếm thực tế"
              className="h-8 w-8 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

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
                <span className="text-foreground">Kiểm kê kho</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Kiểm Kê Kho & Đối Soát Tồn
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Thực hiện kiểm đếm thực tế, đối soát chênh lệch sổ sách và
                    tự động cân bằng số liệu tồn kho
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
                onClick={handleOpenCreate}
                className="h-9 px-4 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer font-medium"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs">Tạo đợt kiểm kê</span>
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="pt-2">
            <WarehouseNavTabs
              activeTab="audits"
              totalAudits={
                auditKpi?.total_PhieuKiemKe ??
                auditKpi?.totalPhieuKiemKe ??
                totalCount
              }
            />
          </div>
        </div>
      )}

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            title: "Đợt kiểm kê",
            value:
              auditKpi?.total_PhieuKiemKe ??
              auditKpi?.totalPhieuKiemKe ??
              totalCount,
            subtext: "Biên bản đã lập",
            icon: ClipboardCheck,
            color: "text-foreground",
            iconColor: "text-blue-600",
            bg: "bg-blue-500/10",
          },
          {
            title: "Đang kiểm đếm",
            value:
              auditKpi?.total_DangKiemKe ??
              auditKpi?.totalDangKiemKe ??
              inProgressCount,
            subtext: "Chưa duyệt cân bằng kho",
            icon: Clock,
            color: "text-amber-600 dark:text-amber-400",
            iconColor: "text-amber-600",
            bg: "bg-amber-500/10",
          },
          {
            title: "Đã cân bằng",
            value:
              auditKpi?.total_DaCanBang ??
              auditKpi?.totalDaCanBang ??
              balancedCount,
            subtext: "Tồn kho đã được điều chỉnh",
            icon: CheckCircle2,
            color: "text-emerald-600 dark:text-emerald-400",
            iconColor: "text-emerald-600",
            bg: "bg-emerald-500/10",
          },
          {
            title: "Tổng sai lệch SL",
            value:
              auditKpi?.total_TongSoLuongLech ??
              auditKpi?.totalTongSoLuongLech ??
              totalDiscrepancy,
            subtext: "Chênh lệch giữa đếm và sổ sách",
            icon: AlertTriangle,
            color: "text-rose-600 dark:text-rose-400",
            iconColor: "text-rose-600",
            bg: "bg-rose-500/10",
          },
        ].map((card, idx) => {
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
                  className={`w-7 h-7 rounded-lg ${card.bg} ${card.iconColor} flex items-center justify-center`}
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
      <div className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-2xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="w-full sm:w-72">
          <SearchSelect
            placeholder="Lọc theo kho kiểm kê..."
            options={[{ value: "", label: "Tất cả kho hàng" }, ...khoOptions]}
            value={khoFilter}
            onChange={(val) => {
              setKhoFilter(val ? String(val) : "");
              setPage(1);
            }}
            isLoading={isLoadingKhos}
          />
        </div>

        {khoFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setKhoFilter("")}
            className="text-xs text-muted-foreground hover:text-foreground cursor-pointer self-start sm:self-auto"
          >
            Xóa lọc kho
          </Button>
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
                  Không tìm thấy phiếu kiểm kê nào
                </p>
                <p className="text-xs text-muted-foreground max-w-sm mt-1">
                  Chưa có đợt kiểm kê nào phù hợp với bộ lọc hiện tại.
                </p>
                <Button
                  size="sm"
                  onClick={handleOpenCreate}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-1" /> Tạo đợt kiểm kê mới
                </Button>
              </div>
            ) : (
              <>
                <Table<KHO_PhieuKiemKe>
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
                    đợt kiểm kê)
                  </div>

                  <div className="flex items-center gap-1.5">
                    <SearchSelect
                      options={[
                        { value: 10, label: "10 " },
                        { value: 20, label: "20 " },
                        { value: 50, label: "50 " },
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

      {/* 5. SlideOver Tạo phiếu kiểm kê */}
      <SlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Khởi Tạo Phiếu Kiểm Kê Kho"
        description="Chốt số liệu tồn kho sổ sách tại thời điểm lập để tiến hành kiểm đếm thực tế"
        maxWidth="md"
      >
        <div className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Kho thực hiện kiểm kê <span className="text-rose-500">*</span>
            </label>
            <SearchSelect
              placeholder="Chọn kho cần kiểm kê..."
              options={khoOptions}
              value={dataCreate.KhoID}
              onChange={(val) =>
                setDataCreate((prev) => ({
                  ...prev,
                  KhoID: String(val || ""),
                }))
              }
              isLoading={isLoadingKhos}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Ghi chú đợt kiểm kê
            </label>
            <textarea
              rows={3}
              placeholder="Ví dụ: Kiểm kê định kỳ tháng 10, đối soát đột xuất..."
              value={dataCreate.GhiChu || ""}
              onChange={(e) =>
                setDataCreate((prev) => ({ ...prev, GhiChu: e.target.value }))
              }
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-800 dark:text-blue-300">
            Hệ thống sẽ tự động quét và lưu toàn bộ số lượng tồn sổ sách hiện
            tại của kho vào biên bản đối soát.
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenCreate(false)}
              className="cursor-pointer text-xs"
            >
              Hủy bỏ
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitCreate}
              disabled={isCreating}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer text-xs font-semibold"
            >
              {isCreating ? "Đang tạo..." : "Bắt đầu kiểm kê"}
            </Button>
          </div>
        </div>
      </SlideOver>

      {/* 6. SlideOver Chi tiết biên bản kiểm kê */}
      <SlideOver
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        title="Biên Bản Kiểm Kê Kho"
        description="Đối soát số lượng tồn sổ sách và số đếm thực tế của từng mặt hàng"
        maxWidth="xl"
      >
        <div className="space-y-4 py-2">
          {selectedPhieu && (
            <>
              <div className="p-3.5 rounded-lg border border-border/80 bg-muted/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                    {selectedPhieu.maPhieuKiemKe}
                  </span>
                  {(() => {
                    const badge = getAuditStatusBadge(
                      selectedPhieu.trangThaiID,
                    );
                    return (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}
                      >
                        {badge.label}
                      </span>
                    );
                  })()}
                </div>

                <div className="text-xs">
                  Kho:{" "}
                  <strong className="text-foreground">
                    {selectedPhieu.tenKho}
                  </strong>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                  <span>Ngày kiểm: {formatDate(selectedPhieu.ngayKiemKe)}</span>
                  <span>
                    Ngày cân bằng: {formatDate(selectedPhieu.ngayCanBang)}
                  </span>
                  <span>Tổng sổ sách: {selectedPhieu.tongSoLuongHeThong}</span>
                  <span>Tổng thực đếm: {selectedPhieu.tongSoLuongThucTe}</span>
                </div>
              </div>

              {/* Chi tiết mặt hàng đối soát */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-foreground">
                  Chi tiết mặt hàng đối soát
                </span>

                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                      <tr>
                        <th className="p-2 text-left font-semibold">
                          Mặt hàng
                        </th>
                        <th className="p-2 text-right font-semibold w-20">
                          Sổ sách
                        </th>
                        <th className="p-2 text-right font-semibold w-20">
                          Thực đếm
                        </th>
                        <th className="p-2 text-right font-semibold w-20">
                          Lệch
                        </th>
                        <th className="p-2 text-left font-semibold w-36">
                          Lý do
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(selectedPhieu.chiTiets || []).map((ct, i) => (
                        <tr key={i}>
                          <td className="p-2">
                            <span className="font-medium text-foreground block">
                              {ct.tenBienThe || "Sản phẩm"}
                            </span>
                            {ct.maSKU && (
                              <span className="font-mono text-[10px] text-muted-foreground">
                                SKU: {ct.maSKU}
                              </span>
                            )}
                          </td>
                          <td className="p-2 text-right font-mono text-muted-foreground">
                            {ct.soLuongHeThong}
                          </td>
                          <td className="p-2 text-right font-mono font-bold text-foreground">
                            {ct.soLuongThucTe}
                          </td>
                          <td className="p-2 text-right font-mono font-bold">
                            {ct.soLuongLech === 0 ? (
                              <span className="text-emerald-600">0</span>
                            ) : ct.soLuongLech > 0 ? (
                              <span className="text-blue-600">
                                +{ct.soLuongLech}
                              </span>
                            ) : (
                              <span className="text-rose-600">
                                {ct.soLuongLech}
                              </span>
                            )}
                          </td>
                          <td className="p-2 text-[11px] text-muted-foreground truncate">
                            {ct.tenLyDoLech || ct.ghiChuLyDo || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Thao tác */}
              <div className="pt-4 border-t border-border flex flex-wrap justify-end gap-2">
                {selectedPhieu.trangThaiID === 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleHuyPhieu(selectedPhieu.phieuKiemKeID)
                      }
                      disabled={isHuyPhieu}
                      className="text-rose-600 hover:text-rose-700 border-rose-200 cursor-pointer text-xs"
                    >
                      <Ban className="w-3.5 h-3.5 mr-1" /> Hủy phiếu
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleCanBang(selectedPhieu.phieuKiemKeID)}
                      disabled={isCanBang}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer text-xs font-semibold"
                    >
                      <Scale className="w-3.5 h-3.5 mr-1" />
                      {isCanBang ? "Đang cân bằng..." : "Duyệt cân bằng kho"}
                    </Button>
                  </>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenDetail(false)}
                  className="cursor-pointer text-xs"
                >
                  Đóng
                </Button>
              </div>
            </>
          )}
        </div>
      </SlideOver>

      {/* 7. SlideOver Cập nhật số đếm thực tế */}
      <SlideOver
        open={openCapNhat}
        onClose={() => setOpenCapNhat(false)}
        title="Nhập Số Đếm Thực Tế Kiểm Kê"
        description="Cập nhật kết quả đếm hàng thực tế tại kho và lý do nếu phát sinh thừa/thiếu"
        maxWidth="lg"
      >
        <div className="space-y-4 py-2">
          {selectedPhieu && (
            <div className="space-y-3">
              {dataCapNhat.ChiTiets.map((ct, idx) => {
                const itemRef = selectedPhieu.chiTiets?.find(
                  (c) => c.bienTheSanPhamID === ct.BienTheSanPhamID,
                );
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-border bg-muted/30 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">
                        {itemRef?.tenBienThe || `Sản phẩm ${idx + 1}`}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        Sổ sách: {itemRef?.soLuongHeThong ?? 0}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                          Số lượng đếm thực tế
                        </label>
                        <Input
                          type="number"
                          min={0}
                          value={ct.SoLuongThucTe}
                          onChange={(e) => {
                            const updated = [...dataCapNhat.ChiTiets];
                            updated[idx].SoLuongThucTe =
                              parseInt(e.target.value) || 0;
                            setDataCapNhat((prev) => ({
                              ...prev,
                              ChiTiets: updated,
                            }));
                          }}
                          className="text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                          Lý do chênh lệch (nếu có)
                        </label>
                        <SearchSelect
                          options={reasonDiscrepancyOptions}
                          value={
                            ct.LyDoLechID ||
                            (reasonDiscrepancyOptions[0]?.value ?? 0)
                          }
                          onChange={(val) => {
                            const updated = [...dataCapNhat.ChiTiets];
                            updated[idx].LyDoLechID = Number(val);
                            setDataCapNhat((prev) => ({
                              ...prev,
                              ChiTiets: updated,
                            }));
                          }}
                          isLoading={isLoadingReasons}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenCapNhat(false)}
              className="cursor-pointer text-xs"
            >
              Hủy bỏ
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitCapNhat}
              disabled={isCapNhatting}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer text-xs font-semibold"
            >
              {isCapNhatting ? "Đang lưu..." : "Lưu số đếm kiểm kê"}
            </Button>
          </div>
        </div>
      </SlideOver>
    </div>
  );
}

export default function StockAuditsPage() {
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
      <StockAuditsContent />
    </Suspense>
  );
}
