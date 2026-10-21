"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Trash2, ArrowRight, Warehouse, Truck, AlertCircle } from "lucide-react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect } from "@/components/ui/selectSearch";
import { CreatePhieuChuyenPayload, CreateChiTietChuyenItem } from "@/types/phieuChuyenKho";

interface CreateStockTransferSlideOverProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreatePhieuChuyenPayload) => Promise<void>;
  isCreating: boolean;
  khoOptions: Array<{ value: string; label: string }>;
  isLoadingKhos: boolean;
  variantOptions: Array<{ value: string; label: string }>;
  isLoadingVariants: boolean;
}

const INITIAL_ITEM: CreateChiTietChuyenItem = {
  BienTheSanPhamID: "",
  SoLuongChuyen: 1,
  DonGiaVon: 0,
  GhiChu: "",
};

const INITIAL_FORM: CreatePhieuChuyenPayload = {
  KhoXuatID: "",
  KhoNhapID: "",
  NguoiGiaoHang: "",
  BienSoXeVanChuyen: "",
  GhiChu: "",
  ChiTiets: [{ ...INITIAL_ITEM }],
};

export const CreateStockTransferSlideOver: React.FC<CreateStockTransferSlideOverProps> = ({
  open,
  onClose,
  onSubmit,
  isCreating,
  khoOptions,
  isLoadingKhos,
  variantOptions,
  isLoadingVariants,
}) => {
  const [formData, setFormData] = useState<CreatePhieuChuyenPayload>(INITIAL_FORM);

  // Reset form whenever drawer opens
  useEffect(() => {
    if (open) {
      setFormData(INITIAL_FORM);
    }
  }, [open]);

  const handleAddDetailRow = () => {
    setFormData((prev) => ({
      ...prev,
      ChiTiets: [...prev.ChiTiets, { ...INITIAL_ITEM }],
    }));
  };

  const handleRemoveDetailRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ChiTiets: prev.ChiTiets.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateItem = (
    index: number,
    field: keyof CreateChiTietChuyenItem,
    value: unknown
  ) => {
    setFormData((prev) => {
      const updated = [...prev.ChiTiets];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return { ...prev, ChiTiets: updated };
    });
  };

  const totalQuantity = formData.ChiTiets.reduce(
    (sum, item) => sum + (Number(item.SoLuongChuyen) || 0),
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.KhoXuatID || !formData.KhoNhapID) {
      toast.error("Vui lòng chọn cả kho xuất và kho nhập!");
      return;
    }

    if (formData.KhoXuatID === formData.KhoNhapID) {
      toast.error("Kho xuất và kho nhập không được trùng nhau!");
      return;
    }

    const validChiTiets = formData.ChiTiets.filter(
      (c) => c.BienTheSanPhamID && c.SoLuongChuyen > 0
    );

    if (validChiTiets.length === 0) {
      toast.error("Vui lòng thêm ít nhất 1 sản phẩm với số lượng chuyển hợp lệ!");
      return;
    }

    // Check duplicate variants in list
    const seen = new Set<string>();
    for (const c of validChiTiets) {
      if (seen.has(c.BienTheSanPhamID)) {
        toast.warning(
          "Có sản phẩm được chọn trùng lặp ở nhiều dòng! Vui lòng gộp số lượng."
        );
        return;
      }
      seen.add(c.BienTheSanPhamID);
    }

    await onSubmit({
      ...formData,
      ChiTiets: validChiTiets,
    });
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Tạo Phiếu Điều Chuyển Kho Mới"
      description="Lập phiếu luân chuyển xe hoặc linh kiện giữa hai kho trong mạng lưới chi nhánh"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {/* Kho xuất & Kho nhập Card */}
        <div className="p-3.5 rounded-xl border border-border/80 bg-muted/30 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Warehouse className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Tuyến kho điều chuyển</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Kho xuất (Kho nguồn) <span className="text-rose-500">*</span>
              </label>
              <SearchSelect
                placeholder="Chọn kho xuất hàng..."
                options={khoOptions}
                value={formData.KhoXuatID}
                onChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    KhoXuatID: String(val || ""),
                  }))
                }
                isLoading={isLoadingKhos}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Kho nhập (Kho đích) <span className="text-rose-500">*</span>
              </label>
              <SearchSelect
                placeholder="Chọn kho nhận hàng..."
                options={khoOptions}
                value={formData.KhoNhapID}
                onChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    KhoNhapID: String(val || ""),
                  }))
                }
                isLoading={isLoadingKhos}
              />
            </div>
          </div>

          {formData.KhoXuatID &&
            formData.KhoNhapID &&
            formData.KhoXuatID === formData.KhoNhapID && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1.5 rounded-md">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Kho xuất và kho nhập không được trùng nhau!</span>
              </div>
            )}
        </div>

        {/* Thông tin vận chuyển */}
        <div className="p-3.5 rounded-xl border border-border/80 bg-muted/30 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Truck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Thông tin giao nhận / Vận chuyển</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Người giao hàng / Tài xế
              </label>
              <Input
                placeholder="Họ tên tài xế hoặc đơn vị vận chuyển..."
                value={formData.NguoiGiaoHang || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    NguoiGiaoHang: e.target.value,
                  }))
                }
                className="text-xs h-9 bg-background"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Biển số xe vận chuyển
              </label>
              <Input
                placeholder="Ví dụ: 29C-999.88"
                value={formData.BienSoXeVanChuyen || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    BienSoXeVanChuyen: e.target.value.toUpperCase(),
                  }))
                }
                className="text-xs font-mono uppercase h-9 bg-background"
              />
            </div>
          </div>
        </div>

        {/* Danh sách mặt hàng chuyển */}
        <div className="space-y-2 pt-2 border-t border-border/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">
                Danh sách xe / mặt hàng chuyển
              </span>
              <span className="text-[11px] font-mono text-muted-foreground px-2 py-0.5 rounded-full bg-muted border border-border/60">
                {formData.ChiTiets.length} dòng ({totalQuantity} kiện)
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddDetailRow}
              className="h-7 px-2.5 text-xs text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Thêm dòng
            </Button>
          </div>

          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {formData.ChiTiets.map((ct, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-border/80 bg-card flex flex-col sm:flex-row gap-2.5 items-start sm:items-center shadow-2xs"
              >
                <div className="flex-1 w-full">
                  <label className="block sm:hidden text-[11px] text-muted-foreground mb-1">
                    Sản phẩm #{idx + 1}
                  </label>
                  <SearchSelect
                    placeholder="Chọn sản phẩm / biến thể xe..."
                    options={variantOptions}
                    value={ct.BienTheSanPhamID}
                    onChange={(val) =>
                      handleUpdateItem(idx, "BienTheSanPhamID", String(val || ""))
                    }
                    isLoading={isLoadingVariants}
                    className="text-xs"
                  />
                </div>

                <div className="w-full sm:w-28">
                  <label className="block sm:hidden text-[11px] text-muted-foreground mb-1">
                    Số lượng
                  </label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Số lượng"
                    value={ct.SoLuongChuyen}
                    onChange={(e) =>
                      handleUpdateItem(
                        idx,
                        "SoLuongChuyen",
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                    className="text-xs font-mono h-9 bg-background"
                  />
                </div>

                {formData.ChiTiets.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveDetailRow(idx)}
                    title="Xóa dòng này"
                    className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 h-8 w-8 cursor-pointer shrink-0 self-end sm:self-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Ghi chú */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Ghi chú điều chuyển
          </label>
          <textarea
            rows={2}
            placeholder="Lý do điều chuyển, hướng dẫn giao nhận đặc thù..."
            value={formData.GhiChu || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, GhiChu: e.target.value }))
            }
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-border/80 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="cursor-pointer text-xs h-9 px-4"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isCreating}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer text-xs font-semibold h-9 px-4 shadow-xs"
          >
            {isCreating ? "Đang khởi tạo..." : "Xác nhận tạo phiếu"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
};
