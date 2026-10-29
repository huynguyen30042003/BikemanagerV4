"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowRight,
  Warehouse,
  Truck,
  Calendar,
  PackageCheck,
  Ban,
  Clock,
  CheckCircle2,
  Search,
  AlertTriangle,
  FileSpreadsheet,
} from "lucide-react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/components/Common/ConfirmContext";
import {
  KHO_PhieuChuyenKho,
  KHO_ChiTietChuyenKho,
  NhanHangPayload,
} from "@/types/phieuChuyenKho";
import { useGetPhieuChuyenKhoById } from "@/hooks/PhieuChuyenKho/usePhieuChuyenKhoApi";
import { StatusBadgeInfo } from "@/hooks/DanhMucChiTiet/useDanhMucChiTietLookup";

interface StockTransferDetailSlideOverProps {
  open: boolean;
  onClose: () => void;
  phieu: KHO_PhieuChuyenKho | null;
  getTransferStatusBadge: (id?: number | null) => StatusBadgeInfo;
  onXuatKho: (phieuId: string) => Promise<void>;
  isXuatKho: boolean;
  onNhanHang: (phieuOrPayload: KHO_PhieuChuyenKho | NhanHangPayload) => Promise<void>;
  isNhanHang: boolean;
  onHuyPhieu: (phieuId: string) => Promise<void>;
  isHuyPhieu: boolean;
}

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 ₫";
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

export const StockTransferDetailSlideOver: React.FC<StockTransferDetailSlideOverProps> = ({
  open,
  onClose,
  phieu,
  getTransferStatusBadge,
  onXuatKho,
  isXuatKho,
  onNhanHang,
  isNhanHang,
  onHuyPhieu,
  isHuyPhieu,
}) => {
  const { confirm } = useConfirm();
  const [filterText, setFilterText] = useState("");

  const handleXuatKhoClick = async () => {
    const isConfirmed = await confirm({
      title: "Duyệt xuất kho điều chuyển?",
      description: `Xác nhận xuất hàng khỏi kho [${activePhieu?.tenKhoXuat}]. Hàng sẽ được trừ khỏi tồn khả dụng và chuyển sang trạng thái đang vận chuyển.`,
      confirmText: "Xác nhận xuất kho",
      variant: "info",
    });
    if (!isConfirmed || !activePhieu) return;
    await onXuatKho(activePhieu.phieuChuyenKhoID);
  };

  const handleNhanHangClick = async () => {
    const isConfirmed = await confirm({
      title: "Xác nhận nhận hàng tại kho đích?",
      description: `Kho [${activePhieu?.tenKhoNhap}] xác nhận đã nhận đủ ${activePhieu?.tongSoLuong} kiện hàng. Tồn kho đích sẽ được cập nhật cộng tăng ngay lập tức.`,
      confirmText: "Nhận hàng & Nhập kho",
      variant: "info",
    });
    if (!isConfirmed || !activePhieu) return;
    await onNhanHang(activePhieu);
  };

  const handleHuyPhieuClick = async () => {
    const isConfirmed = await confirm({
      title: "Hủy phiếu điều chuyển kho?",
      description: `Bạn có chắc chắn muốn hủy phiếu ${activePhieu?.maPhieuChuyen}? Thao tác này không thể hoàn tác.`,
      confirmText: "Hủy phiếu ngay",
      variant: "danger",
    });
    if (!isConfirmed || !activePhieu) return;
    await onHuyPhieu(activePhieu.phieuChuyenKhoID);
  };

  // Fetch fresh transfer details when drawer is open
  const { data: detailData, isLoading: isLoadingDetail } = useGetPhieuChuyenKhoById(
    open && phieu?.phieuChuyenKhoID ? phieu.phieuChuyenKhoID : undefined
  );

  const activePhieu: KHO_PhieuChuyenKho | null = useMemo(() => {
    if (detailData?.data) return detailData.data;
    if (detailData?.item) return detailData.item;
    return phieu;
  }, [detailData, phieu]);

  const itemsList: KHO_ChiTietChuyenKho[] = useMemo(() => {
    return activePhieu?.chiTiets || [];
  }, [activePhieu]);

  const filteredItems = useMemo(() => {
    if (!filterText.trim()) return itemsList;
    const q = filterText.toLowerCase();
    return itemsList.filter(
      (ct) =>
        ct.tenBienThe?.toLowerCase().includes(q) ||
        ct.maSKU?.toLowerCase().includes(q) ||
        ct.maSerial?.toLowerCase().includes(q)
    );
  }, [itemsList, filterText]);

  if (!activePhieu) return null;

  const badge = getTransferStatusBadge(activePhieu.trangThaiID);
  const isChoXuat = activePhieu.trangThaiID === 1 || activePhieu.trangThaiID === 22;
  const isDangVanChuyen = activePhieu.trangThaiID === 2 || activePhieu.trangThaiID === 23;
  const isDaNhan = activePhieu.trangThaiID === 3 || activePhieu.trangThaiID === 24;
  const isDaHuy = activePhieu.trangThaiID === 4 || activePhieu.trangThaiID === 25;

  return (
    <>
      <SlideOver
        open={open}
        onClose={onClose}
        title="Chi Tiết Phiếu Điều Chuyển Kho"
        description="Theo dõi hành trình, danh sách mặt hàng và thực thi nghiệp vụ xuất/nhập kho"
        maxWidth="xl"
      >
        <div className="space-y-4 py-2">
          {/* Timeline Process Stepper */}
          <div className="p-3.5 rounded-xl border border-border/80 bg-muted/20">
            <div className="flex items-center justify-between text-xs">
              <div
                className={`flex items-center gap-1.5 font-semibold ${
                  isDaHuy
                    ? "text-muted-foreground"
                    : "text-blue-600 dark:text-blue-400"
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                  1
                </div>
                <span>Chờ xuất kho</span>
              </div>

              <div
                className={`h-0.5 flex-1 mx-2 ${
                  isDangVanChuyen || isDaNhan
                    ? "bg-blue-500"
                    : "bg-border/60"
                }`}
              />

              <div
                className={`flex items-center gap-1.5 font-semibold ${
                  isDangVanChuyen || isDaNhan
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-muted-foreground/60"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isDangVanChuyen || isDaNhan
                      ? "bg-blue-500/20 text-blue-600"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  2
                </div>
                <span>Đang vận chuyển</span>
              </div>

              <div
                className={`h-0.5 flex-1 mx-2 ${
                  isDaNhan ? "bg-emerald-500" : "bg-border/60"
                }`}
              />

              <div
                className={`flex items-center gap-1.5 font-semibold ${
                  isDaNhan
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground/60"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isDaNhan
                      ? "bg-emerald-500/20 text-emerald-600"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  3
                </div>
                <span>Đã nhận đủ</span>
              </div>
            </div>
          </div>

          {/* Header Card */}
          <div className="p-3.5 sm:p-4 rounded-xl border border-border/80 bg-card shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                  {activePhieu.maPhieuChuyen}
                </span>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}
                >
                  {badge.label}
                </span>
              </div>

              <span className="text-[11px] text-muted-foreground font-mono">
                Tạo: {formatDate(activePhieu.ngayTao)}
              </span>
            </div>

            {/* Warehouse Route */}
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs">
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <Warehouse className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                    Kho xuất
                  </span>
                  <span className="font-semibold text-foreground truncate">
                    {activePhieu.tenKhoXuat || "Kho xuất"}
                  </span>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-muted-foreground/60 shrink-0" />

              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <Warehouse className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                    Kho nhập
                  </span>
                  <span className="font-semibold text-foreground truncate">
                    {activePhieu.tenKhoNhap || "Kho nhập"}
                  </span>
                </div>
              </div>
            </div>

            {/* Logistics & Timestamps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground pt-1 border-t border-border/60">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span>Người giao: </span>
                <strong className="text-foreground font-medium">
                  {activePhieu.nguoiGiaoHang || "Chưa có"}
                </strong>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground font-mono">Biển số:</span>
                <strong className="text-foreground font-mono">
                  {activePhieu.bienSoXeVanChuyen || "Chưa có"}
                </strong>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <span>Ngày xuất:</span>
                <span className="text-foreground">{formatDate(activePhieu.ngayXuat)}</span>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <span>Ngày nhận:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {formatDate(activePhieu.ngayNhan)}
                </span>
              </div>
            </div>

            {activePhieu.ghiChu && (
              <div className="p-2 rounded-lg bg-muted/30 border border-border/60 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Ghi chú: </span>
                {activePhieu.ghiChu}
              </div>
            )}
          </div>

          {/* Items Table Card */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">
                  Chi tiết mặt hàng luân chuyển
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-muted border border-border/60 text-muted-foreground">
                  {itemsList.length} mặt hàng
                </span>
              </div>

              {itemsList.length > 3 && (
                <div className="relative w-full sm:w-48">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="Lọc mặt hàng..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="h-7 text-xs pl-8 pr-2 bg-background rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border/80 overflow-hidden shadow-2xs">
              <table className="w-full text-xs">
                <thead className="bg-muted/50 border-b border-border/80 text-muted-foreground">
                  <tr>
                    <th className="p-2.5 text-left font-semibold">
                      Sản phẩm / Biến thể
                    </th>
                    <th className="p-2.5 text-right font-semibold w-20">
                      SL xuất
                    </th>
                    <th className="p-2.5 text-right font-semibold w-24">
                      SL thực nhận
                    </th>
                    <th className="p-2.5 text-right font-semibold w-28">
                      Đơn giá vốn
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 bg-card">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-6 text-center text-muted-foreground italic text-xs"
                      >
                        {isLoadingDetail
                          ? "Đang tải dữ liệu chi tiết..."
                          : "Không có mặt hàng nào phù hợp với tìm kiếm"}
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((ct, idx) => (
                      <tr key={idx} className="hover:bg-muted/20 transition-colors">
                        <td className="p-2.5">
                          <span className="font-semibold text-foreground block">
                            {ct.tenBienThe || "Mặt hàng"}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            {ct.maSKU && (
                              <span className="font-mono text-[10px] text-muted-foreground">
                                SKU: {ct.maSKU}
                              </span>
                            )}
                            {ct.maSerial && (
                              <span className="font-mono text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded">
                                S/N: {ct.maSerial}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-foreground">
                          {ct.soLuongChuyen?.toLocaleString("vi-VN")}
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold">
                          {ct.soLuongThucNhan != null ? (
                            <span
                              className={
                                ct.soLuongThucNhan === ct.soLuongChuyen
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-amber-600 dark:text-amber-400"
                              }
                            >
                              {ct.soLuongThucNhan.toLocaleString("vi-VN")}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/50 italic">—</span>
                          )}
                        </td>
                        <td className="p-2.5 text-right font-mono text-muted-foreground">
                          {formatCurrency(ct.donGiaVon)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="bg-muted/30 border-t border-border/80 font-semibold text-xs">
                  <tr>
                    <td className="p-2.5 text-left text-muted-foreground">
                      Tổng cộng ({itemsList.length} mặt hàng)
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-foreground">
                      {activePhieu.tongSoLuong?.toLocaleString("vi-VN") ?? 0}
                    </td>
                    <td className="p-2.5 text-right font-mono text-muted-foreground">
                      —
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-foreground">
                      {formatCurrency(activePhieu.tongGiaTriVon)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Action Operations Bar */}
          <div className="pt-4 border-t border-border/80 flex flex-wrap items-center justify-end gap-2.5">
            {/* If Status = 1 (Chờ xuất kho): Allow Hủy phiếu & Duyệt xuất kho */}
            {isChoXuat && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleHuyPhieuClick}
                  disabled={isHuyPhieu}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 cursor-pointer text-xs h-9 px-3.5"
                >
                  <Ban className="w-3.5 h-3.5 mr-1.5" />
                  Hủy phiếu chuyển
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleXuatKhoClick}
                  disabled={isXuatKho}
                  className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer text-xs font-semibold h-9 px-4 shadow-xs"
                >
                  <Truck className="w-3.5 h-3.5 mr-1.5" />
                  {isXuatKho ? "Đang duyệt..." : "Duyệt xuất kho"}
                </Button>
              </>
            )}

            {/* If Status = 2 (Đang vận chuyển): Allow Nhận hàng */}
            {isDangVanChuyen && (
              <Button
                type="button"
                size="sm"
                onClick={handleNhanHangClick}
                disabled={isNhanHang}
                className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer text-xs font-semibold h-9 px-4 shadow-xs"
              >
                <PackageCheck className="w-3.5 h-3.5 mr-1.5" />
                {isNhanHang ? "Đang xử lý..." : "Xác nhận nhận hàng"}
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="cursor-pointer text-xs h-9 px-4"
            >
              Đóng
            </Button>
          </div>
        </div>
      </SlideOver>


    </>
  );
};
