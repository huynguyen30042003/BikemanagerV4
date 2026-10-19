"use client";

import React, { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/input";
import { SearchSelect } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { InstallmentNavTabs } from "@/components/Common/InstallmentNavTabs";
import {
  useHopDongTraGopHook,
  TRANG_THAI_HOP_DONG,
  TRANG_THAI_GIAI_NGAN,
  getTrangThaiHopDongBadge,
  getTrangThaiGiaiNganBadge,
} from "@/hooks/TraGop/useTraGop";

import { HopDongTraGop } from "@/types/traGop";
import {
  CreditCard,
  Plus,
  RefreshCw,
  Search,
  FolderOpen,
  Building2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRightLeft,
  DollarSign,
  User,
  FileText,
  BadgeCheck,
  SendHorizontal,
} from "lucide-react";

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

function InstallmentContractsContent() {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    searchInput,
    setSearchInput,
    providerFilter,
    setProviderFilter,
    statusFilter,
    setStatusFilter,
    disbursementFilter,
    setDisbursementFilter,
    providerOptions,
    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,
    openAdd,
    setOpenAdd,
    openStatusModal,
    setOpenStatusModal,
    openDisburseModal,
    setOpenDisburseModal,
    selectedContract,
    setSelectedContract,
    formData,
    setFormData,
    handleOpenAdd,
    handleSubmitAdd,
    handleChuyenTrangThai,
    handleXacNhanGiaiNgan,
    handleDelete,
    isSubmitting,
  } = useHopDongTraGopHook();

  // State cho Modal chuyển trạng thái thẩm định
  const [targetStatus, setTargetStatus] = useState<number>(TRANG_THAI_HOP_DONG.DA_DUYET);
  const [statusNote, setStatusNote] = useState("");

  // State cho Modal xác nhận giải ngân
  const [disburseForm, setDisburseForm] = useState({
    soTienThucNhan: 0,
    phiHoaHong: 0,
    maChuanChi: "",
    ghiChu: "",
  });

  const openApproveModal = (contract: HopDongTraGop) => {
    setSelectedContract(contract);
    setTargetStatus(TRANG_THAI_HOP_DONG.DA_DUYET);
    setStatusNote("");
    setOpenStatusModal(true);
  };

  const openDisbursementAction = (contract: HopDongTraGop) => {
    setSelectedContract(contract);
    const loanAmount = Number(contract.soTienVay || 0);
    // Ước tính phí sàn 2%
    const estimatedFee = Math.round(loanAmount * 0.02);
    setDisburseForm({
      soTienThucNhan: loanAmount - estimatedFee,
      phiHoaHong: estimatedFee,
      maChuanChi: `FT${Date.now().toString().slice(-8)}`,
      ghiChu: `Đối tác giải ngân khoản vay xe qua ngân hàng`,
    });
    setOpenDisburseModal(true);
  };

  const columns: Column<HopDongTraGop>[] = [
    {
      key: "soHopDong",
      title: "Hồ Sơ & Hợp Đồng",
      classNameHeader: "w-44 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="py-1 space-y-0.5">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 block w-fit">
            {row.soHopDong || "—"}
          </span>
          {row.maHoSoOnline && (
            <span className="text-[10px] text-muted-foreground font-mono block">
              Mã online: {row.maHoSoOnline}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "donViTraGopTen",
      title: "Đối Tác Cho Vay",
      classNameHeader: "min-w-[150px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex items-center gap-1.5 py-1">
          <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="font-semibold text-foreground text-xs">
            {row.donViTraGopTen || "Công ty tài chính"}
          </span>
        </div>
      ),
    },
    {
      key: "khachHangTen",
      title: "Khách Hàng Mua Xe",
      classNameHeader: "min-w-[160px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="text-xs space-y-0.5">
          <div className="font-medium text-foreground flex items-center gap-1">
            <User className="w-3 h-3 text-muted-foreground" />
            <span>{row.khachHangTen || "Khách lẻ"}</span>
          </div>
          {row.khachHangDienThoai && (
            <div className="text-[11px] text-muted-foreground font-mono">
              {row.khachHangDienThoai}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "soTienVay",
      title: "Khoản Vay & Trả Trước",
      classNameHeader: "w-40 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right",
      render: (_v, row) => (
        <div className="text-xs space-y-0.5">
          <div className="font-mono font-bold text-foreground">
            Vay: {formatCurrency(Number(row.soTienVay))}
          </div>
          <div className="font-mono text-[11px] text-muted-foreground">
            Trả trước: {formatCurrency(Number(row.tienTraTruoc))}
          </div>
        </div>
      ),
    },
    {
      key: "soThangTraGop",
      title: "Kỳ Hạn & Góp Tháng",
      classNameHeader: "w-36 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right",
      render: (_v, row) => (
        <div className="text-xs space-y-0.5">
          <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(Number(row.soTienTraHangThang))}/th
          </div>
          <div className="text-[11px] text-muted-foreground">
            {row.soThangTraGop} tháng · Lãi {row.laiSuat}%
          </div>
        </div>
      ),
    },
    {
      key: "trangThaiHopDongID",
      title: "Tiến Độ Thẩm Định",
      classNameHeader: "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => {
        const badge = getTrangThaiHopDongBadge(row.trangThaiHopDongID, row.trangThaiHopDong);
        let colorClasses = "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20";
        if (badge.color === "emerald") {
          colorClasses = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
        } else if (badge.color === "rose") {
          colorClasses = "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20";
        } else if (badge.color === "blue" || badge.color === "indigo") {
          colorClasses = "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20";
        }

        return (
          <button
            type="button"
            onClick={() => openApproveModal(row)}
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border cursor-pointer hover:opacity-85 transition ${colorClasses}`}
            title="Bấm để cập nhật trạng thái thẩm định"
          >
            <span>{badge.label}</span>
            <ArrowRightLeft className="w-2.5 h-2.5 opacity-60" />
          </button>
        );
      },
    },
    {
      key: "trangThaiGiaiNganID",
      title: "Giải Ngân Về Shop",
      classNameHeader: "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => {
        const isDisbursed = row.trangThaiGiaiNganID === TRANG_THAI_GIAI_NGAN.DA_GIAI_NGAN;
        if (isDisbursed) {
          return (
            <div className="text-center">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                Đã giải ngân
              </span>
              {row.soTienGiaiNganThucTe && (
                <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                  {formatCurrency(Number(row.soTienGiaiNganThucTe))}
                </div>
              )}
            </div>
          );
        }

        return (
          <Button
            variant="outline"
            size="xs"
            onClick={() => openDisbursementAction(row)}
            className="text-[11px] h-6 px-2 text-blue-600 border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer font-medium"
            title="Bấm để xác nhận tiền giải ngân chuyển về showroom"
          >
            <DollarSign className="w-3 h-3 mr-0.5" />
            Nhận giải ngân
          </Button>
        );
      },
    },
    {
      key: "actions",
      title: "Thao tác",
      classNameHeader: "w-16 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => handleDelete(row)}
          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
          title="Hủy hồ sơ"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Hợp Đồng & Hồ Sơ Mua Xe Trả Góp
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Theo dõi các gói vay mua xe điện, tiến độ duyệt thẩm định tín dụng và giải ngân về tài khoản showroom
              </p>
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
              onClick={handleOpenAdd}
              className="h-9 px-4 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs">Lập hồ sơ trả góp</span>
            </Button>
          </div>
        </div>

        <div className="pt-2">
          <InstallmentNavTabs activeTab="contracts" totalContracts={totalCount} />
        </div>

      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm theo số HĐ, tên khách hàng..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div>
            <SearchSelect
              placeholder="Đối tác cho vay..."
              options={[{ value: "", label: "Tất cả đối tác tài chính" }, ...providerOptions]}
              value={providerFilter}
              onChange={(val) => setProviderFilter(String(val))}
            />
          </div>

          <div>
            <SearchSelect
              placeholder="Tiến độ thẩm định..."
              options={[
                { value: "all", label: "Tất cả trạng thái thẩm định" },
                { value: "110", label: "Chờ thẩm định (110)" },
                { value: "111", label: "Đã duyệt vay (111)" },
                { value: "112", label: "Từ chối hồ sơ (112)" },
                { value: "113", label: "Đã ký hợp đồng (113)" },
                { value: "114", label: "Đang trả góp (114)" },
                { value: "115", label: "Đã tất toán (115)" },
              ]}
              value={statusFilter}
              onChange={(val) => setStatusFilter(String(val))}
            />
          </div>

          <div>
            <SearchSelect
              placeholder="Giải ngân về shop..."
              options={[
                { value: "all", label: "Tất cả giải ngân" },
                { value: "120", label: "Chưa giải ngân (120)" },
                { value: "121", label: "Đã giải ngân về shop (121)" },
              ]}
              value={disbursementFilter}
              onChange={(val) => setDisbursementFilter(String(val))}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <Card className="p-6">
          <Skeleton className="h-10 w-full mb-3" />
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-12 w-full" />
        </Card>
      ) : (
        <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
          <div className="p-3 flex flex-col gap-3 w-full">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <FolderOpen className="w-10 h-10 mb-2 stroke-[1.5]" />
                <p className="font-semibold text-foreground">Chưa có hợp đồng trả góp nào</p>
                <Button
                  size="sm"
                  onClick={handleOpenAdd}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-1" /> Lập hồ sơ mới
                </Button>
              </div>
            ) : (
              <>
                <Table<HopDongTraGop>
                  data={items}
                  columns={columns}
                  showIndex
                  startIndex={(page - 1) * pageSize}
                />

                <div className="flex justify-between items-center pt-3 border-t border-border/70 text-xs text-muted-foreground">
                  <span>Tổng {totalCount} hợp đồng trả góp</span>
                  <div className="flex gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="h-8 px-2.5 text-xs"
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="h-8 px-2.5 text-xs"
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

      {/* SlideOver Lập Hồ Sơ Vay Mua Xe */}
      <SlideOver
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        title="Lập Hồ Sơ Vay Mua Xe Trả Góp"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitAdd} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Số hợp đồng tín dụng <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.SoHopDong}
                onChange={(e) => setFormData((prev) => ({ ...prev, SoHopDong: e.target.value }))}
                className="text-xs font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Mã hồ sơ online (App thẩm định)
              </label>
              <Input
                type="text"
                placeholder="VD: APP-HD-99120"
                value={formData.MaHoSoOnline || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, MaHoSoOnline: e.target.value }))}
                className="text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Đơn vị tài chính cho vay <span className="text-rose-500">*</span>
            </label>
            <SearchSelect
              options={providerOptions}
              value={formData.DonViTraGopID}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, DonViTraGopID: String(val) }))
              }
            />
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-3">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              Thông tin khoản vay & tài chính
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Tổng giá trị xe (đ)
                </label>
                <Input
                  type="number"
                  value={formData.TongGiaTriDonHang}
                  onChange={(e) => {
                    const total = Number(e.target.value);
                    const prepay = formData.TienTraTruoc;
                    setFormData((prev) => ({
                      ...prev,
                      TongGiaTriDonHang: total,
                      SoTienVay: Math.max(0, total - prepay),
                    }));
                  }}
                  className="text-xs font-mono font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Khách trả trước (đ)
                </label>
                <Input
                  type="number"
                  value={formData.TienTraTruoc}
                  onChange={(e) => {
                    const prepay = Number(e.target.value);
                    const total = formData.TongGiaTriDonHang;
                    setFormData((prev) => ({
                      ...prev,
                      TienTraTruoc: prepay,
                      SoTienVay: Math.max(0, total - prepay),
                    }));
                  }}
                  className="text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Khoản vay tín dụng (đ)
                </label>
                <Input
                  type="number"
                  value={formData.SoTienVay}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, SoTienVay: Number(e.target.value) }))
                  }
                  className="text-xs font-mono font-bold text-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Kỳ hạn vay (tháng)
                </label>
                <Input
                  type="number"
                  value={formData.SoThangTraGop}
                  onChange={(e) => {
                    const months = Number(e.target.value);
                    const loan = formData.SoTienVay;
                    const monthly = months > 0 ? Math.round(loan / months) : 0;
                    setFormData((prev) => ({
                      ...prev,
                      SoThangTraGop: months,
                      SoTienTraHangThang: monthly,
                    }));
                  }}
                  className="text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Lãi suất (%/tháng)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="VD: 0 (gói 0%) hoặc 1.89"
                  value={formData.LaiSuat}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, LaiSuat: Number(e.target.value) }))
                  }
                  className="text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Góp hàng tháng (ước tính)
                </label>
                <Input
                  type="number"
                  value={formData.SoTienTraHangThang}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      SoTienTraHangThang: Number(e.target.value),
                    }))
                  }
                  className="text-xs font-mono font-semibold text-emerald-600"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Người tham chiếu bảo lãnh (nếu có)
              </label>
              <Input
                type="text"
                placeholder="VD: Nguyễn Thị Mai (Vợ - 0912 999 888)"
                value={formData.NguoiThamChieu || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, NguoiThamChieu: e.target.value }))
                }
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Ngày đến hạn đóng hàng tháng
              </label>
              <Input
                type="number"
                placeholder="VD: 5 (mùng 5 hàng tháng)"
                value={formData.NgayTraHangThang || 5}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    NgayTraHangThang: Number(e.target.value),
                  }))
                }
                className="text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Ghi chú hồ sơ
            </label>
            <Input
              type="text"
              placeholder="VD: Khách hàng mua xe Feliz S trả góp gói 0% lãi suất của HD Saison..."
              value={formData.GhiChu || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, GhiChu: e.target.value }))}
              className="text-xs"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpenAdd(false)}
              className="text-xs"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              {isSubmitting ? "Đang lưu..." : "Lập hồ sơ vay"}
            </Button>
          </div>
        </form>
      </SlideOver>

      {/* Dialog Chuyển Trạng Thái Thẩm Định */}
      <Dialog open={openStatusModal} onOpenChange={setOpenStatusModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cập Nhật Tiến Độ Thẩm Định Hồ Sơ</DialogTitle>
            <DialogDescription>
              Hợp đồng số: {selectedContract?.soHopDong || ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Chọn trạng thái phê duyệt từ đối tác tài chính
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetStatus(TRANG_THAI_HOP_DONG.DA_DUYET)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition ${
                    targetStatus === TRANG_THAI_HOP_DONG.DA_DUYET
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Đã duyệt khoản vay (111)
                </button>

                <button
                  type="button"
                  onClick={() => setTargetStatus(TRANG_THAI_HOP_DONG.TU_CHOI)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition ${
                    targetStatus === TRANG_THAI_HOP_DONG.TU_CHOI
                      ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  Từ chối hồ sơ (112)
                </button>

                <button
                  type="button"
                  onClick={() => setTargetStatus(TRANG_THAI_HOP_DONG.DA_KY_HD)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition ${
                    targetStatus === TRANG_THAI_HOP_DONG.DA_KY_HD
                      ? "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <BadgeCheck className="w-4 h-4 text-blue-500" />
                  Đã ký hợp đồng (113)
                </button>

                <button
                  type="button"
                  onClick={() => setTargetStatus(TRANG_THAI_HOP_DONG.DANG_TRA_GOP)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition ${
                    targetStatus === TRANG_THAI_HOP_DONG.DANG_TRA_GOP
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Clock className="w-4 h-4 text-indigo-500" />
                  Đang trả góp (114)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Ghi chú phản hồi từ bên tài chính
              </label>
              <Input
                type="text"
                placeholder="VD: Đối tác duyệt khoản vay 22.340.000đ, cho phép bàn giao xe"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpenStatusModal(false)}
                className="text-xs"
              >
                Hủy
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isSubmitting}
                onClick={() => {
                  const contractId = selectedContract?.hopDongTraGopID || selectedContract?.id;
                  if (!contractId) return;
                  handleChuyenTrangThai({
                    HopDongTraGopID: contractId,
                    TrangThaiHopDongID: targetStatus,
                    NgayPheDuyet: new Date().toISOString(),
                    GhiChu: statusNote,
                  });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
              >
                {isSubmitting ? "Đang xử lý..." : "Cập nhật tiến độ"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Xác Nhận Tiền Giải Ngân Chuyển Về Showroom */}
      <Dialog open={openDisburseModal} onOpenChange={setOpenDisburseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xác Nhận Giải Ngân Về Showroom</DialogTitle>
            <DialogDescription>
              Hồ sơ: {selectedContract?.soHopDong || ""} · Khoản vay: {formatCurrency(Number(selectedContract?.soTienVay))}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-800 dark:text-blue-300">
              Hệ thống sẽ tự động ghi nhận phiếu thu thanh toán cho đơn hàng tương ứng khi bạn xác nhận giải ngân.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Số tiền thực chuyển về shop (đ) <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="number"
                  value={disburseForm.soTienThucNhan}
                  onChange={(e) =>
                    setDisburseForm((prev) => ({
                      ...prev,
                      soTienThucNhan: Number(e.target.value),
                    }))
                  }
                  className="text-xs font-mono font-bold text-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Phí hoa hồng/chuyển đổi shop chịu (đ)
                </label>
                <Input
                  type="number"
                  value={disburseForm.phiHoaHong}
                  onChange={(e) =>
                    setDisburseForm((prev) => ({
                      ...prev,
                      phiHoaHong: Number(e.target.value),
                    }))
                  }
                  className="text-xs font-mono text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Mã giao dịch / Mã chuẩn chi ngân hàng
              </label>
              <Input
                type="text"
                placeholder="VD: FT2628890288219"
                value={disburseForm.maChuanChi}
                onChange={(e) =>
                  setDisburseForm((prev) => ({ ...prev, maChuanChi: e.target.value }))
                }
                className="text-xs font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Ghi chú đối soát giải ngân
              </label>
              <Input
                type="text"
                placeholder="VD: HD Saison giải ngân qua tài khoản Vietcombank showroom..."
                value={disburseForm.ghiChu}
                onChange={(e) =>
                  setDisburseForm((prev) => ({ ...prev, ghiChu: e.target.value }))
                }
                className="text-xs"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpenDisburseModal(false)}
                className="text-xs"
              >
                Hủy
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isSubmitting}
                onClick={() => {
                  const contractId = selectedContract?.hopDongTraGopID || selectedContract?.id;
                  if (!contractId) return;
                  handleXacNhanGiaiNgan({
                    HopDongTraGopID: contractId,
                    SoTienGiaiNganThucTe: disburseForm.soTienThucNhan,
                    PhiHoaHongDoiTac: disburseForm.phiHoaHong,
                    NgayGiaiNgan: new Date().toISOString(),
                    MaChuanChiGiaiNgan: disburseForm.maChuanChi,
                    GhiChu: disburseForm.ghiChu,
                  });
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium"
              >
                {isSubmitting ? "Đang xác nhận..." : "Xác nhận tiền về shop"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function InstallmentContractsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 space-y-4 max-w-[1600px] mx-auto">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <InstallmentContractsContent />
    </Suspense>
  );
}
