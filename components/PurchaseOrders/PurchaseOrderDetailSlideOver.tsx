"use client";

import React from "react";
import {
  CreditCard,
  Clock,
  CheckCircle2,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SlideOver } from "@/components/ui/SlideOver";
import { NH_DonNhapHang, NH_LichSuThanhToan } from "@/types/donNhapHang";
import { formatCurrency } from "./PurchaseOrdersKpiGrid";

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export interface PurchaseOrderDetailSlideOverProps {
  open: boolean;
  onClose: () => void;
  selectedOrder: NH_DonNhapHang | null;
  getOrderStatusBadge: (statusId: number) => {
    bgClass: string;
    textClass: string;
    borderClass: string;
    label: string;
  };
  isLoadingDetail?: boolean;
  paymentHistoryItems: NH_LichSuThanhToan[];
  isLoadingPaymentHistory?: boolean;
  isCompletedStatus: (statusId?: number | null) => boolean;
  onXacNhanNhapKho: (orderId: string) => void;
  isNhapKho: boolean;
  onOpenPayment: (order: NH_DonNhapHang) => void;
  onOpenStatusChange: (order: NH_DonNhapHang) => void;
  onDelete: (orderId: string) => void;
  isDeleting: boolean;
}

export const PurchaseOrderDetailSlideOver: React.FC<
  PurchaseOrderDetailSlideOverProps
> = ({
  open,
  onClose,
  selectedOrder,
  getOrderStatusBadge,
  isLoadingDetail = false,
  paymentHistoryItems,
  isLoadingPaymentHistory = false,
  isCompletedStatus,
  onXacNhanNhapKho,
  isNhapKho,
  onOpenPayment,
  onOpenStatusChange,
  onDelete,
  isDeleting,
}) => {
  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Chi Tiết Đơn Nhập Hàng"
      description="Thông tin các mặt hàng, trạng thái nhập kho và thanh toán NCC"
      maxWidth="2xl"
    >
      <div className="space-y-4 py-2">
        {selectedOrder && (
          <>
            {/* Header Card */}
            <div className="p-3.5 rounded-lg border border-border/80 bg-muted/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                  {selectedOrder.maDonNhap}
                </span>
                {(() => {
                  const badge = getOrderStatusBadge(selectedOrder.trangThaiID);
                  return (
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}
                    >
                      {badge.label}
                    </span>
                  );
                })()}
              </div>

              <div className="text-xs">
                Nhà cung cấp:{" "}
                <strong className="text-foreground">
                  {selectedOrder.tenNhaCungCap}
                </strong>
                <br />
                Kho tiếp nhận:{" "}
                <strong className="text-foreground">
                  {selectedOrder.tenKho}
                </strong>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                <span>Hóa đơn: {selectedOrder.soHoaDonChungTu || "—"}</span>
                <span>Ngày HĐ: {formatDate(selectedOrder.ngayHoaDon)}</span>
                <span>Hạn TT: {formatDate(selectedOrder.hanThanhToan)}</span>
                <span>
                  Tổng tiền:{" "}
                  <strong className="text-foreground">
                    {formatCurrency(selectedOrder.tongTien)}
                  </strong>
                </span>
                <span>
                  Đã trả:{" "}
                  <strong className="text-emerald-600">
                    {formatCurrency(selectedOrder.daThanhToan)}
                  </strong>
                </span>
                <span>
                  Còn nợ:{" "}
                  <strong className="text-rose-600">
                    {formatCurrency(selectedOrder.conNo)}
                  </strong>
                </span>
              </div>
            </div>

            {/* Danh sách mặt hàng (NH_ChiTietDonNhapHang) */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-foreground">
                Danh mục mặt hàng trong đơn ({selectedOrder.chiTiets?.length || 0})
              </span>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                    <tr>
                      <th className="p-2 text-left font-medium">Sản phẩm</th>
                      <th className="p-2 text-center font-medium w-14">SL</th>
                      <th className="p-2 text-right font-medium w-24">
                        Đơn giá
                      </th>
                      <th className="p-2 text-right font-medium w-20">CK (%)</th>
                      <th className="p-2 text-right font-medium w-16">VAT</th>
                      <th className="p-2 text-right font-medium w-28">
                        Thành tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {isLoadingDetail ? (
                      <tr>
                        <td colSpan={6} className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
                            Đang tải dữ liệu chi tiết mặt hàng từ hệ thống...
                          </div>
                        </td>
                      </tr>
                    ) : selectedOrder.chiTiets &&
                      selectedOrder.chiTiets.length > 0 ? (
                      selectedOrder.chiTiets.map((ct, idx) => (
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
                            {formatCurrency(ct.donGiaNhap)}
                          </td>
                          <td className="p-2 text-right font-mono text-muted-foreground">
                            {ct.phanTramGiamGia ? `${ct.phanTramGiamGia}%` : "0%"}
                          </td>
                          <td className="p-2 text-right font-mono text-muted-foreground">
                            {ct.thueVAT ? `${ct.thueVAT}%` : "0%"}
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
                          Chưa có dòng mặt hàng nào.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Danh sách Số Serial / Số Khung đã nhập (NH_SerialNhapHang) */}
            {isLoadingDetail ? (
              <div className="p-3 text-center text-xs text-muted-foreground border-t border-border/60">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500 inline mr-1.5" />
                Đang tải danh sách serial & số khung...
              </div>
            ) : selectedOrder.serials && selectedOrder.serials.length > 0 ? (
              <div className="space-y-2 pt-2 border-t border-border/60">
                <span className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Số Serial / Số khung nhập kho</span>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">
                    {selectedOrder.serials.length} xe / linh kiện
                  </span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                  {selectedOrder.serials.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg border border-border/70 bg-card/50 text-[11px] space-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-foreground">
                          {s.maSerial}
                        </span>
                        {s.viTriLuuTru && (
                          <span className="text-[10px] text-muted-foreground px-1.5 py-0.2 bg-muted rounded">
                            {s.viTriLuuTru}
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
                          Máy:{" "}
                          <span className="text-foreground">{s.soMay}</span>
                        </div>
                      )}
                      {s.soPin && (
                        <div className="text-muted-foreground font-mono text-[10px]">
                          Pin:{" "}
                          <span className="text-foreground">{s.soPin}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Lịch sử thanh toán đơn nhập (NH_LichSuThanhToan) */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  Lịch sử thanh toán NCC ({paymentHistoryItems.length})
                </span>
                {selectedOrder.conNo > 0 && (
                  <span className="text-[11px] text-rose-600 font-semibold">
                    Còn nợ: {formatCurrency(selectedOrder.conNo)}
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
                        <th className="p-2 text-left font-medium">Ngày trả</th>
                        <th className="p-2 text-left font-medium">
                          Mã GD / UNC
                        </th>
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
                            {p.tenPhuongThuc || "Chuyển khoản"}
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

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-border">
              <div className="flex gap-2 flex-wrap">
                {selectedOrder.trangThaiID === 68 && (
                  <Button
                    size="sm"
                    onClick={() =>
                      onXacNhanNhapKho(selectedOrder.donNhapHangID)
                    }
                    disabled={isNhapKho}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    {isNhapKho ? "Đang xử lý..." : "Xác nhận nhập kho thực tế"}
                  </Button>
                )}

                {selectedOrder.conNo > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenPayment(selectedOrder)}
                    className="text-emerald-600 border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-xs cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5 mr-1" />
                    Thanh toán NCC
                  </Button>
                )}

                {!isCompletedStatus(selectedOrder.trangThaiID) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenStatusChange(selectedOrder)}
                    className="text-xs cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    Đổi trạng thái
                  </Button>
                )}
              </div>

              {(selectedOrder.trangThaiID === 66 ||
                selectedOrder.trangThaiID === 71) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(selectedOrder.donNhapHangID)}
                  disabled={isDeleting}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Xóa đơn nhập
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </SlideOver>
  );
};
export default PurchaseOrderDetailSlideOver;
