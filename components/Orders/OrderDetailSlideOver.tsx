"use client";

import React from "react";
import { Package, CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SlideOver } from "@/components/ui/SlideOver";
import { DH_DonHang, DH_LichSuThanhToan } from "@/types/donHang";
import { formatCurrency } from "./OrdersKpiGrid";
import { useGetDonHangById } from "@/hooks/DonHang/useDonHangApi";

export interface OrderDetailSlideOverProps {
  open: boolean;
  onClose: () => void;
  selectedOrder: DH_DonHang | null;
  paymentHistoryItems: DH_LichSuThanhToan[];
  isLoadingPaymentHistory: boolean;
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export const OrderDetailSlideOver: React.FC<OrderDetailSlideOverProps> = ({
  open,
  onClose,
  selectedOrder,
  paymentHistoryItems,
  isLoadingPaymentHistory,
}) => {
  const { data: DonHangDetail } = useGetDonHangById(
    selectedOrder?.donHangID,
    open,
  );
  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title={`Chi Tiết Đơn Hàng ${DonHangDetail?.maDonHang || "—"}`}
      description="Thông tin chi tiết xe, phụ tùng, số serial/khung xuất bán và lịch sử thanh toán"
      maxWidth="2xl"
    >
      {DonHangDetail && (
        <div className="space-y-4 py-2 text-xs">
          {/* Tóm tắt khách hàng & đơn hàng */}
          <div className="p-3.5 rounded-xl border border-border bg-muted/40 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Khách hàng
                </span>
                <strong className="text-foreground text-xs">
                  {DonHangDetail?.tenKhachHang || "Khách lẻ"}
                </strong>
                {DonHangDetail?.dienThoaiKhachHang && (
                  <span className="block font-mono text-[11px] text-muted-foreground">
                    SĐT: {DonHangDetail?.dienThoaiKhachHang}
                  </span>
                )}
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Địa chỉ giao
                </span>
                <span className="text-foreground text-[11px]">
                  {DonHangDetail?.diaChiGiaoHang ||
                    "Nhận trực tiếp tại showroom"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60 text-center">
              <div className="p-2 rounded-lg bg-background/60 border border-border/50">
                <span className="text-muted-foreground text-[10px] block">
                  Tổng tiền
                </span>
                <span className="font-mono font-bold text-foreground text-xs">
                  {formatCurrency(DonHangDetail?.tongTien)}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-emerald-700 dark:text-emerald-400 text-[10px] block font-medium">
                  Đã trả
                </span>
                <span className="font-mono font-bold text-emerald-600 text-xs">
                  {formatCurrency(DonHangDetail?.daThanhToan)}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <span className="text-rose-700 dark:text-rose-400 text-[10px] block font-medium">
                  Còn nợ
                </span>
                <span className="font-mono font-bold text-rose-600 text-xs">
                  {formatCurrency(DonHangDetail?.conNo)}
                </span>
              </div>
            </div>
          </div>

          {/* Danh sách mặt hàng (DH_ChiTietDonHang) */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-blue-500" />
                Mặt hàng trong đơn ({DonHangDetail?.chiTiets?.length || 0})
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                Tạm tính: {formatCurrency(DonHangDetail?.tamTinh)}
              </span>
            </h3>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                  <tr>
                    <th className="p-2 text-left font-medium">Sản phẩm</th>
                    <th className="p-2 text-center font-medium w-14">SL</th>
                    <th className="p-2 text-right font-medium w-24">Đơn giá</th>
                    <th className="p-2 text-right font-medium w-20">
                      Giảm giá
                    </th>
                    <th className="p-2 text-right font-medium w-16">VAT</th>
                    <th className="p-2 text-right font-medium w-28">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {DonHangDetail?.chiTiets &&
                  DonHangDetail?.chiTiets.length > 0 ? (
                    DonHangDetail?.chiTiets.map((ct, idx) => (
                      <tr key={idx} className="hover:bg-muted/30">
                        <td className="p-2 text-foreground font-medium">
                          {ct.tenSanPham}
                          {ct.maSKU && (
                            <span className="block text-[10px] text-muted-foreground font-mono">
                              SKU: {ct.maSKU}
                            </span>
                          )}
                        </td>
                        <td className="p-2 text-center font-mono font-bold">
                          {ct.soLuong}
                        </td>
                        <td className="p-2 text-right font-mono">
                          {formatCurrency(ct.donGiaBan)}
                        </td>
                        <td className="p-2 text-right font-mono text-muted-foreground">
                          {ct.tienGiamGia
                            ? `-${formatCurrency(ct.tienGiamGia)}`
                            : "0 đ"}
                        </td>
                        <td className="p-2 text-right font-mono text-muted-foreground">
                          {ct.tienThueVAT
                            ? formatCurrency(ct.tienThueVAT)
                            : "0 đ"}
                        </td>
                        <td className="p-2 text-right font-mono font-semibold text-foreground">
                          {formatCurrency(ct.thanhTien)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-4 text-center text-muted-foreground"
                      >
                        Chưa có sản phẩm nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Danh sách Số khung / Serial xe xuất bán (DH_SerialXuatBan) */}
          {DonHangDetail?.serials && DonHangDetail?.serials.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border/60">
              <span className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Số Serial / Số khung xe xuất bán (Kích hoạt BH)</span>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">
                  {DonHangDetail?.serials.length} xe
                </span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                {DonHangDetail?.serials.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg border border-border/70 bg-card/50 text-[11px] space-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-foreground">
                        {s.maSerial}
                      </span>
                      {s.ngayKetThucBaoHanh && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 bg-emerald-500/10 rounded border border-emerald-500/20 font-semibold">
                          Hạn BH: {formatDate(s.ngayKetThucBaoHanh)}
                        </span>
                      )}
                    </div>
                    {s.soKhung && (
                      <div className="text-muted-foreground font-mono text-[10px]">
                        Khung:{" "}
                        <span className="text-foreground">{s.soKhung}</span>
                      </div>
                    )}
                    {s.soMay && (
                      <div className="text-muted-foreground font-mono text-[10px]">
                        Máy: <span className="text-foreground">{s.soMay}</span>
                      </div>
                    )}
                    {s.soPin && (
                      <div className="text-muted-foreground font-mono text-[10px]">
                        Pin: <span className="text-foreground">{s.soPin}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lịch sử thanh toán đơn hàng (DH_LichSuThanhToan) */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                Lịch sử thanh toán ({paymentHistoryItems.length})
              </span>
              {DonHangDetail?.conNo > 0 && (
                <span className="text-[11px] text-rose-600 font-semibold">
                  Còn nợ: {formatCurrency(DonHangDetail?.conNo)}
                </span>
              )}
            </div>

            {isLoadingPaymentHistory ? (
              <Skeleton className="h-16 w-full rounded-lg" />
            ) : paymentHistoryItems.length === 0 ? (
              <div className="py-4 text-center text-xs text-muted-foreground bg-muted/20 rounded-lg border border-border/40">
                Chưa có giao dịch thanh toán nào được ghi nhận cho đơn này.
              </div>
            ) : (
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                    <tr>
                      <th className="p-2 text-left font-medium">Ngày thu</th>
                      <th className="p-2 text-left font-medium">Mã GD</th>
                      <th className="p-2 text-left font-medium">Phương thức</th>
                      <th className="p-2 text-right font-medium">Số tiền</th>
                      <th className="p-2 text-left font-medium">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paymentHistoryItems.map((p, idx) => (
                      <tr key={idx} className="hover:bg-muted/30">
                        <td className="p-2 text-muted-foreground">
                          {formatDate(p.ngayThanhToan)}
                        </td>
                        <td className="p-2 font-mono font-medium text-foreground">
                          {p.maGiaoDich}
                        </td>
                        <td className="p-2 text-muted-foreground">
                          {p.phuongTucThanhToanTen || "Tiền mặt"}
                        </td>
                        <td className="p-2 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(p.soTien)}
                        </td>
                        <td className="p-2 text-[11px] text-muted-foreground truncate max-w-[140px]">
                          {p.ghiChu || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </SlideOver>
  );
};
