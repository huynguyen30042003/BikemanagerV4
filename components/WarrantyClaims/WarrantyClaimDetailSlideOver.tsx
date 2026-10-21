"use client";

import React from "react";
import { SlideOver } from "@/components/ui/SlideOver";
import { BH_PhieuBaoHanh } from "@/types/baoHanh";
import { User, Store, Calendar, Gauge, Barcode, Wrench, ShieldCheck } from "lucide-react";

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

interface WarrantyClaimDetailSlideOverProps {
  open: boolean;
  onClose: () => void;
  selectedItem: BH_PhieuBaoHanh | null;
  getClaimStatusBadge: (statusId: number) => { label: string; className: string };
  getActionBadge: (actionId: number) => { label: string; className: string };
}

export function WarrantyClaimDetailSlideOver({
  open,
  onClose,
  selectedItem,
  getClaimStatusBadge,
  getActionBadge,
}: WarrantyClaimDetailSlideOverProps) {
  if (!selectedItem) return null;

  const statusBadge = getClaimStatusBadge(selectedItem.trangThaiID);
  const actionBadge = getActionBadge(selectedItem.huongXuLyID);

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title={`Chi Tiết Phiếu Tiếp Nhận ${selectedItem.maPhieuBaoHanh}`}
      description="Thông tin sự cố, kết quả chẩn đoán và linh kiện/pin thay thế bảo hành"
      maxWidth="xl"
    >
      <div className="space-y-4 py-2 text-xs">
        {/* Card thông tin cơ bản */}
        <div className="p-3.5 rounded-xl border border-border bg-muted/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
              {selectedItem.maPhieuBaoHanh}
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${statusBadge.className}`}
              >
                {statusBadge.label}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${actionBadge.className}`}
              >
                {actionBadge.label}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div>
              <span className="text-muted-foreground block flex items-center gap-1">
                <User className="w-3 h-3" />
                Khách hàng:
              </span>
              <strong className="text-foreground">
                {selectedItem.tenKhachHang || "Khách hàng"}
              </strong>
              {selectedItem.dienThoaiKhachHang && (
                <span className="block font-mono text-muted-foreground">
                  SĐT: {selectedItem.dienThoaiKhachHang}
                </span>
              )}
            </div>
            <div>
              <span className="text-muted-foreground block flex items-center gap-1">
                <Store className="w-3 h-3" />
                Trạm tiếp nhận:
              </span>
              <span className="text-foreground font-medium">
                {selectedItem.tenDiaDiem || "Showroom chính"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground pt-2 border-t border-border/60">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-blue-500" />
              Tiếp nhận: {formatDate(selectedItem.ngayTiepNhan)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-500" />
              Hẹn trả: {formatDate(selectedItem.ngayHenTra)}
            </span>
            <span className="flex items-center gap-1">
              <Gauge className="w-3 h-3 text-emerald-500" />
              Số KM xe: {selectedItem.soKmHienTai ? `${selectedItem.soKmHienTai} km` : "—"}
            </span>
            <span className="flex items-center gap-1">
              <Barcode className="w-3 h-3 text-indigo-500" />
              Số khung VIN: {selectedItem.soKhung || "—"}
            </span>
          </div>
        </div>

        {/* Chẩn đoán lỗi */}
        <div className="p-3 rounded-lg border border-border bg-card/60 space-y-2">
          <div>
            <span className="text-muted-foreground text-[11px] block font-medium flex items-center gap-1">
              <Wrench className="w-3 h-3 text-amber-500" />
              Mô tả triệu chứng hư hỏng
            </span>
            <p className="text-foreground text-xs mt-0.5">{selectedItem.moTaLoi}</p>
          </div>
          {selectedItem.ketQuaKiemTra && (
            <div className="pt-2 border-t border-border/50">
              <span className="text-muted-foreground text-[11px] block font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-500" />
                Kết quả chẩn đoán kỹ thuật
              </span>
              <p className="text-foreground text-xs mt-0.5">{selectedItem.ketQuaKiemTra}</p>
            </div>
          )}
        </div>

        {/* Chi tiết linh kiện xử lý bảo hành (BH_ChiTietBaoHanh) */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span>Danh mục linh kiện / phụ tùng bảo hành ({selectedItem.chiTiets?.length || 0})</span>
          </span>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                <tr>
                  <th className="p-2 text-left font-medium">Hạng mục / Linh kiện</th>
                  <th className="p-2 text-center font-medium w-20">Loại xử lý</th>
                  <th className="p-2 text-right font-medium w-28">Hãng hỗ trợ</th>
                  <th className="p-2 text-right font-medium w-28">Khách trả</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {selectedItem.chiTiets && selectedItem.chiTiets.length > 0 ? (
                  selectedItem.chiTiets.map((ct, idx) => (
                    <tr key={idx} className="hover:bg-muted/30">
                      <td className="p-2 text-foreground font-medium">
                        {ct.tenBienThe || "Linh kiện"}
                        {ct.soSerialCuMa && (
                          <div className="text-[10px] font-mono text-rose-600">
                            Thu hồi cũ: {ct.soSerialCuMa}
                          </div>
                        )}
                        {ct.soSerialMoiMa && (
                          <div className="text-[10px] font-mono text-emerald-600">
                            Đổi mới sang: {ct.soSerialMoiMa}
                          </div>
                        )}
                      </td>
                      <td className="p-2 text-center">
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-muted">
                          {ct.loaiXuLy === 2 ? "Đổi mới" : "Sửa chữa"}
                        </span>
                      </td>
                      <td className="p-2 text-right font-mono font-medium text-emerald-600">
                        {formatCurrency(ct.chiPhiHangHoTro)}
                      </td>
                      <td className="p-2 text-right font-mono font-medium text-foreground">
                        {formatCurrency(ct.chiPhiKhachTra)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-muted-foreground">
                      Không có linh kiện thay thế hoặc chi phí phát sinh.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chi phí tổng kết */}
        <div className="flex justify-between items-center p-3 rounded-lg border border-border/80 bg-muted/30">
          <div>
            <span className="text-[11px] text-muted-foreground block">Hãng bảo hành hỗ trợ</span>
            <strong className="text-emerald-600 font-mono text-xs">
              {formatCurrency(selectedItem.chiPhiHangHoTro)}
            </strong>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-muted-foreground block">Khách hàng chi trả</span>
            <strong className="text-foreground font-mono text-xs">
              {formatCurrency(selectedItem.chiPhiKhachTra)}
            </strong>
          </div>
        </div>
      </div>
    </SlideOver>
  );
}
