"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SlideOver } from "@/components/ui/SlideOver";
import { KHO_TonKho, UpdateDinhMucPayload } from "@/types/tonKho";

export interface UpdateDinhMucSlideOverProps {
  open: boolean;
  onClose: () => void;
  selectedItem: KHO_TonKho | null;
  onSubmit: (data: UpdateDinhMucPayload) => Promise<void> | void;
  isUpdating: boolean;
}

export const UpdateDinhMucSlideOver: React.FC<UpdateDinhMucSlideOverProps> = ({
  open,
  onClose,
  selectedItem,
  onSubmit,
  isUpdating,
}) => {
  const [formData, setFormData] = useState<UpdateDinhMucPayload>({
    KhoID: "",
    BienTheSanPhamID: "",
    SoLuongToiThieu: 5,
    ViTriLuuTru: "",
  });

  useEffect(() => {
    if (open && selectedItem) {
      setFormData({
        KhoID: selectedItem.khoID,
        BienTheSanPhamID: selectedItem.bienTheSanPhamID,
        SoLuongToiThieu: selectedItem.soLuongToiThieu ?? 5,
        ViTriLuuTru: selectedItem.viTriLuuTru || "",
      });
    }
  }, [open, selectedItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    await onSubmit(formData);
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Cài Đặt Định Mức & Kệ Hàng"
      description="Thiết lập ngưỡng tồn kho an toàn và vị trí dãy/kệ lưu trữ trong kho"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {selectedItem && (
          <div className="p-3.5 rounded-xl border border-border/80 bg-muted/40 space-y-1">
            <span className="font-mono text-xs font-bold text-foreground block">
              {selectedItem.maSKU}
            </span>
            <p className="text-xs font-semibold text-foreground">
              {selectedItem.tenBienThe}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Tại kho: {selectedItem.tenKho}
            </p>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Số lượng tồn kho tối thiểu (Ngưỡng cảnh báo)
          </label>
          <Input
            type="number"
            min={0}
            value={formData.SoLuongToiThieu}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                SoLuongToiThieu: parseInt(e.target.value) || 0,
              }))
            }
            className="text-xs font-mono"
            required
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            Hệ thống sẽ gắn cờ cảnh báo màu vàng khi số lượng khả dụng thấp hơn mức này
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Vị trí lưu kho / Kệ hàng
          </label>
          <Input
            placeholder="Ví dụ: Kệ A1 - Tầng 2, Dãy Bãi 03"
            value={formData.ViTriLuuTru || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                ViTriLuuTru: e.target.value,
              }))
            }
            className="text-xs"
          />
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="cursor-pointer text-xs"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isUpdating}
            className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer text-xs font-semibold"
          >
            {isUpdating ? "Đang lưu..." : "Lưu cài đặt"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
};
