"use client";

import React, { useState, useMemo } from "react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/components/Common/ConfirmContext";
import { KHO_PhieuKiemKe, KHO_ChiTietKiemKe } from "@/types/phieuKiemKe";
import { useGetPhieuKiemKeById } from "@/hooks/PhieuKiemKe/usePhieuKiemKeApi";
import { StatusBadgeInfo } from "@/hooks/DanhMucChiTiet/useDanhMucChiTietLookup";
import {
  Scale,
  Ban,
  FileSpreadsheet,
  Warehouse,
  Calendar,
  User,
  Search,
  AlertTriangle,
  CheckCircle2,
  Package,
} from "lucide-react";

interface StockAuditDetailSlideOverProps {
  open: boolean;
  onClose: () => void;
  phieu: KHO_PhieuKiemKe | null;
  getAuditStatusBadge: (id?: number | null) => StatusBadgeInfo;
  onOpenCapNhat: (phieu: KHO_PhieuKiemKe) => void;
  onCanBang: (phieuId: string) => Promise<void>;
  isCanBang: boolean;
  onHuyPhieu: (phieuId: string) => Promise<void>;
  isHuyPhieu: boolean;
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

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

export const StockAuditDetailSlideOver: React.FC<StockAuditDetailSlideOverProps> = ({
  open,
  onClose,
  phieu,
  getAuditStatusBadge,
  onOpenCapNhat,
  onCanBang,
  isCanBang,
  onHuyPhieu,
  isHuyPhieu,
}) => {
  const { confirm } = useConfirm();
  const [filterText, setFilterText] = useState("");

  // Lấy chi tiết tươi mới nhất từ API /api/PhieuKiemKeApi/Get nếu có id
  const { data: detailData, isLoading: isLoadingDetail } = useGetPhieuKiemKeById(
    open && phieu?.phieuKiemKeID ? phieu.phieuKiemKeID : undefined
  );

  const activePhieu: KHO_PhieuKiemKe | null = useMemo(() => {
    if (detailData?.data) return detailData.data as KHO_PhieuKiemKe;
    if (detailData && !detailData.data && !detailData.isSuccess) return detailData as unknown as KHO_PhieuKiemKe;
    return phieu;
  }, [detailData, phieu]);

  const chiTiets: KHO_ChiTietKiemKe[] = useMemo(() => {
    const list = activePhieu?.chiTiets || [];
    if (!filterText.trim()) return list;
    const lower = filterText.toLowerCase();
    return list.filter(
      (c) =>
        c.tenBienThe?.toLowerCase().includes(lower) ||
        c.maSKU?.toLowerCase().includes(lower) ||
        c.tenLyDoLech?.toLowerCase().includes(lower)
    );
  }, [activePhieu, filterText]);

  if (!activePhieu) return null;

  const badge = getAuditStatusBadge(activePhieu.trangThaiID);
  const isDangKiemKe = activePhieu.trangThaiID === 26 || activePhieu.trangThaiID === 1;

  const handleConfirmCanBang = async () => {
    const isConfirmed = await confirm({
      title: "Duyệt cân bằng số liệu tồn kho?",
      description: (
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <p>
            Hệ thống sẽ tự động điều chỉnh số lượng tồn thực tế trong kho{" "}
            <strong className="text-foreground">{activePhieu.tenKho}</strong> theo kết quả kiểm đếm của biên bản{" "}
            <strong className="text-foreground">#{activePhieu.maPhieuKiemKe}</strong>.
          </p>
          <p className="text-amber-600 dark:text-amber-400 font-medium">
            Lưu ý: Thao tác này sẽ cập nhật thẻ kho và không thể hoàn tác!
          </p>
        </div>
      ),
      confirmText: "Xác nhận cân bằng",
      variant: "warning",
    });
    if (!isConfirmed) return;
    await onCanBang(activePhieu.phieuKiemKeID);
  };

  const handleConfirmHuy = async () => {
    const isConfirmed = await confirm({
      title: "Hủy bỏ đợt kiểm kê này?",
      description: (
        <p className="text-xs text-muted-foreground">
          Bạn có chắc chắn muốn hủy phiếu kiểm kê <strong className="text-foreground">#{activePhieu.maPhieuKiemKe}</strong>? Số liệu tồn kho sẽ không bị thay đổi.
        </p>
      ),
      confirmText: "Đồng ý hủy",
      variant: "danger",
    });
    if (!isConfirmed) return;
    await onHuyPhieu(activePhieu.phieuKiemKeID);
  };

  return (
    <>
      <SlideOver
        open={open}
        onClose={onClose}
        title={`Biên Bản Kiểm Kê #${activePhieu.maPhieuKiemKe}`}
        description="Đối soát số lượng tồn sổ sách và số đếm thực tế của từng mặt hàng"
        maxWidth="2xl"
      >
        <div className="space-y-4 py-2">
          {/* Header Summary Card */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/30 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/20">
                  {activePhieu.maPhieuKiemKe}
                </span>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border inline-flex items-center gap-1.5 ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                  {badge.label}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <Warehouse className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>{activePhieu.tenKho || "Kho chung"}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-muted-foreground pt-2.5 border-t border-border/60">
              <div>
                <span className="block text-[11px] text-muted-foreground/70">Ngày kiểm kê</span>
                <span className="font-medium text-foreground">{formatDate(activePhieu.ngayKiemKe)}</span>
              </div>
              <div>
                <span className="block text-[11px] text-muted-foreground/70">Người kiểm kê</span>
                <span className="font-medium text-foreground">{activePhieu.tenNguoiKiemKe || "Hệ thống"}</span>
              </div>
              <div>
                <span className="block text-[11px] text-muted-foreground/70">Ngày cân bằng</span>
                <span className="font-medium text-foreground">{formatDate(activePhieu.ngayCanBang)}</span>
              </div>
              <div>
                <span className="block text-[11px] text-muted-foreground/70">Người duyệt</span>
                <span className="font-medium text-foreground">{activePhieu.tenNguoiDuyet || "—"}</span>
              </div>
            </div>

            {activePhieu.ghiChu && (
              <div className="pt-2 border-t border-border/60 text-xs">
                <span className="text-muted-foreground">Ghi chú: </span>
                <span className="text-foreground italic">{activePhieu.ghiChu}</span>
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <Card className="p-3 rounded-xl border border-border/70 text-center">
              <span className="text-[11px] text-muted-foreground">Tổng sổ sách</span>
              <p className="text-lg font-bold font-mono text-foreground mt-0.5">
                {activePhieu.tongSoLuongHeThong?.toLocaleString("vi-VN") ?? 0}
              </p>
            </Card>

            <Card className="p-3 rounded-xl border border-border/70 text-center">
              <span className="text-[11px] text-muted-foreground">Tổng thực đếm</span>
              <p className="text-lg font-bold font-mono text-foreground mt-0.5">
                {activePhieu.tongSoLuongThucTe?.toLocaleString("vi-VN") ?? 0}
              </p>
            </Card>

            <Card className="p-3 rounded-xl border border-border/70 text-center">
              <span className="text-[11px] text-muted-foreground">Tổng chênh lệch</span>
              <p
                className={`text-lg font-bold font-mono mt-0.5 ${
                  (activePhieu.tongSoLuongLech || 0) === 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : (activePhieu.tongSoLuongLech || 0) > 0
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {(activePhieu.tongSoLuongLech || 0) > 0 ? `+${activePhieu.tongSoLuongLech}` : activePhieu.tongSoLuongLech ?? 0}
              </p>
            </Card>

            <Card className="p-3 rounded-xl border border-border/70 text-center">
              <span className="text-[11px] text-muted-foreground">Giá trị lệch</span>
              <p className="text-xs font-bold font-mono text-foreground mt-1 truncate">
                {formatCurrency(activePhieu.tongGiaTriLech)}
              </p>
            </Card>
          </div>

          {/* Table Items */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-semibold text-foreground">
                Danh sách mặt hàng đối soát ({chiTiets.length})
              </span>

              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Lọc SKU, tên sản phẩm..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="pl-8 h-8 text-xs bg-background/80 w-full"
                />
              </div>
            </div>

            <div className="rounded-xl border border-border/80 overflow-hidden shadow-2xs">
              <div className="max-h-[360px] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted/60 border-b border-border text-muted-foreground sticky top-0 z-10 backdrop-blur-sm">
                    <tr>
                      <th className="p-2.5 text-left font-semibold">Mặt hàng</th>
                      <th className="p-2.5 text-right font-semibold w-24">Sổ sách</th>
                      <th className="p-2.5 text-right font-semibold w-24">Thực đếm</th>
                      <th className="p-2.5 text-right font-semibold w-24">Chênh lệch</th>
                      <th className="p-2.5 text-left font-semibold w-40">Lý do chênh lệch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {chiTiets.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground text-xs">
                          <Package className="w-8 h-8 text-muted-foreground/30 mx-auto mb-1.5" />
                          Không có mặt hàng nào phù hợp
                        </td>
                      </tr>
                    ) : (
                      chiTiets.map((ct, i) => (
                        <tr key={i} className="hover:bg-muted/40 transition-colors">
                          <td className="p-2.5">
                            <span className="font-medium text-foreground block">
                              {ct.tenBienThe || "Sản phẩm"}
                            </span>
                            {ct.maSKU && (
                              <span className="font-mono text-[10px] text-muted-foreground">
                                SKU: {ct.maSKU}
                              </span>
                            )}
                          </td>
                          <td className="p-2.5 text-right font-mono text-muted-foreground">
                            {ct.soLuongHeThong?.toLocaleString("vi-VN") ?? 0}
                          </td>
                          <td className="p-2.5 text-right font-mono font-bold text-foreground">
                            {ct.soLuongThucTe?.toLocaleString("vi-VN") ?? 0}
                          </td>
                          <td className="p-2.5 text-right font-mono font-bold">
                            {ct.soLuongLech === 0 ? (
                              <span className="text-emerald-600 dark:text-emerald-400">0</span>
                            ) : ct.soLuongLech > 0 ? (
                              <span className="text-blue-600 dark:text-blue-400">+{ct.soLuongLech}</span>
                            ) : (
                              <span className="text-rose-600 dark:text-rose-400">{ct.soLuongLech}</span>
                            )}
                          </td>
                          <td className="p-2.5 text-[11px] text-muted-foreground">
                            {ct.tenLyDoLech || ct.ghiChuLyDo || "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              {isDangKiemKe && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onOpenCapNhat(activePhieu);
                    onClose();
                  }}
                  className="text-xs h-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 border-blue-200 dark:border-blue-900 cursor-pointer shadow-2xs font-medium"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
                  Nhập số đếm thực tế
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isDangKiemKe && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleConfirmHuy}
                    disabled={isHuyPhieu}
                    className="text-xs h-9 text-rose-600 hover:text-rose-700 border-rose-200 dark:border-rose-900 cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <Ban className="w-3.5 h-3.5 mr-1" />
                    Hủy phiếu
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleConfirmCanBang}
                    disabled={isCanBang}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer text-xs font-semibold h-9 shadow-xs"
                  >
                    <Scale className="w-3.5 h-3.5 mr-1.5" />
                    {isCanBang ? "Đang cân bằng..." : "Duyệt cân bằng kho"}
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="cursor-pointer text-xs h-9 px-4"
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      </SlideOver>


    </>
  );
};
