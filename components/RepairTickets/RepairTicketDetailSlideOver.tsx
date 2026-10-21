"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { SlideOver } from "@/components/ui/SlideOver";
import { SC_PhieuSuaChua } from "@/types/suaChua";

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

interface RepairTicketDetailSlideOverProps {
  open: boolean;
  onClose: () => void;
  ticket: SC_PhieuSuaChua | null;
  getRepairStatusBadge: (id?: number | null) => {
    label: string;
    className: string;
  };
  getPaymentStatusBadge: (id?: number | null) => {
    label: string;
    className: string;
  };
}

export function RepairTicketDetailSlideOver({
  open,
  onClose,
  ticket,
  getRepairStatusBadge,
  getPaymentStatusBadge,
}: RepairTicketDetailSlideOverProps) {
  if (!ticket) return null;

  const repairBadge = getRepairStatusBadge(ticket.trangThaiID);
  const paymentBadge = getPaymentStatusBadge(ticket.trangThaiThanhToanID);

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title={`Chi Tiết Phiếu Sửa Chữa ${ticket.maPhieuSuaChua || ""}`}
      description="Thông tin chẩn đoán kỹ thuật, linh kiện phụ tùng thay thế và thanh toán"
      maxWidth="xl"
    >
      <div className="space-y-4 py-2 text-xs">
        {/* Header tóm tắt */}
        <div className="p-3.5 rounded-xl border border-border bg-muted/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
              {ticket.maPhieuSuaChua}
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${repairBadge.className}`}
              >
                {repairBadge.label}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${paymentBadge.className}`}
              >
                {paymentBadge.label}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
            <div>
              <span className="text-muted-foreground block">Khách hàng:</span>
              <strong className="text-foreground">
                {ticket.tenKhachHang || "Khách lẻ"}
              </strong>
              {ticket.dienThoaiKhachHang && (
                <span className="block font-mono text-muted-foreground">
                  SĐT: {ticket.dienThoaiKhachHang}
                </span>
              )}
            </div>
            <div>
              <span className="text-muted-foreground block">Thông tin xe:</span>
              <strong className="text-foreground">
                {ticket.tenModelXe || "Xe khách"}
              </strong>
              <span className="block font-mono text-muted-foreground">
                BS: {ticket.bienSoXe || "—"}{" "}
                {ticket.soKmHienTai ? `| ${ticket.soKmHienTai} km` : ""}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground pt-1 border-t border-border/60">
            <span>Trạm xưởng: {ticket.tenDiaDiem || "Trụ sở chính"}</span>
            <span>
              KTV phụ trách: {ticket.tenKyThuatVien || "Kỹ thuật viên xưởng"}
            </span>
            <span>Tiếp nhận: {formatDate(ticket.thoiGianTiepNhan)}</span>
            <span>Hẹn trả: {formatDate(ticket.thoiGianHenTra)}</span>
          </div>
        </div>

        {/* Vấn đề & Chẩn đoán */}
        <div className="p-3 rounded-lg border border-border bg-card/60 space-y-1.5">
          <div>
            <span className="text-muted-foreground text-[11px] block font-medium">
              Hiện tượng / Vấn đề khách báo
            </span>
            <p className="text-foreground text-xs">{ticket.moTaVanDe}</p>
          </div>
          {ticket.ketQuaChanDoan && (
            <div className="pt-1.5 border-t border-border/50">
              <span className="text-muted-foreground text-[11px] block font-medium">
                Kết quả chẩn đoán của KTV
              </span>
              <p className="text-foreground text-xs">{ticket.ketQuaChanDoan}</p>
            </div>
          )}
          {ticket.giaiPhapXuLy && (
            <div className="pt-1.5 border-t border-border/50">
              <span className="text-muted-foreground text-[11px] block font-medium">
                Phương án xử lý / Sửa chữa
              </span>
              <p className="text-foreground text-xs">{ticket.giaiPhapXuLy}</p>
            </div>
          )}
        </div>

        {/* Bảng chi tiết dịch vụ & phụ tùng thay thế */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span>
              Hạng mục tiền công & phụ tùng ({ticket.chiTiets?.length || 0})
            </span>
          </span>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                  <tr>
                    <th className="p-2 text-left font-medium">
                      Tên hạng mục / Phụ tùng
                    </th>
                    <th className="p-2 text-center font-medium w-16">Loại</th>
                    <th className="p-2 text-center font-medium w-12">SL</th>
                    <th className="p-2 text-right font-medium w-24">Đơn giá</th>
                    <th className="p-2 text-right font-medium w-24">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ticket.chiTiets && ticket.chiTiets.length > 0 ? (
                    ticket.chiTiets.map((ct, idx) => (
                      <tr key={idx} className="hover:bg-muted/30">
                        <td className="p-2 text-foreground font-medium">
                          {ct.tenHangMuc}
                          {ct.maHangMuc && (
                            <span className="block text-[10px] text-muted-foreground font-mono">
                              Mã: {ct.maHangMuc}
                            </span>
                          )}
                          {ct.thoiGianBaoHanhThang ? (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                              BH: {ct.thoiGianBaoHanhThang} tháng
                            </span>
                          ) : null}
                        </td>
                        <td className="p-2 text-center">
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-muted">
                            {ct.loaiHangMuc === 2 ? "Phụ tùng" : "Tiền công"}
                          </span>
                        </td>
                        <td className="p-2 text-center font-mono font-bold">
                          {ct.soLuong}
                        </td>
                        <td className="p-2 text-right font-mono text-muted-foreground">
                          {formatCurrency(ct.donGia)}
                        </td>
                        <td className="p-2 text-right font-mono font-semibold text-foreground">
                          {formatCurrency(ct.thanhTien)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-4 text-center text-muted-foreground"
                      >
                        Không có dòng dịch vụ hoặc phụ tùng nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Chi phí tổng kết */}
        <div className="p-3.5 rounded-xl border border-border bg-muted/40 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tiền công dịch vụ:</span>
            <span className="font-mono">
              {formatCurrency(ticket.tienCongDichVu)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tiền phụ tùng:</span>
            <span className="font-mono">
              {formatCurrency(ticket.tienPhuTung)}
            </span>
          </div>
          {ticket.tienGiamGia ? (
            <div className="flex justify-between text-muted-foreground">
              <span>Giảm giá:</span>
              <span className="font-mono">
                -{formatCurrency(ticket.tienGiamGia)}
              </span>
            </div>
          ) : null}
          <div className="flex justify-between pt-1.5 border-t border-border/60">
            <span className="font-semibold text-foreground">
              Tổng chi phí phiếu:
            </span>
            <strong className="text-foreground font-mono text-sm">
              {formatCurrency(ticket.tongTien)}
            </strong>
          </div>
          <div className="flex justify-between">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              Đã thanh toán:
            </span>
            <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
              {formatCurrency(ticket.daThanhToan)}
            </strong>
          </div>
          <div className="flex justify-between">
            <span className="text-rose-600 dark:text-rose-400 font-medium">
              Còn nợ:
            </span>
            <strong className="text-rose-600 dark:text-rose-400 font-mono">
              {formatCurrency(ticket.conNo)}
            </strong>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs cursor-pointer"
          >
            Đóng
          </Button>
        </div>
      </div>
    </SlideOver>
  );
}
