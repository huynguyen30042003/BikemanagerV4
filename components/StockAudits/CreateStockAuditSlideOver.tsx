"use client";

import React, { useState, useEffect } from "react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/button";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { CreatePhieuKiemKePayload } from "@/types/phieuKiemKe";
import { Warehouse, Info, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface CreateStockAuditSlideOverProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreatePhieuKiemKePayload) => Promise<void>;
  isCreating: boolean;
  khoOptions: SelectOption[];
  isLoadingKhos: boolean;
  defaultKhoId?: string;
}

export const CreateStockAuditSlideOver: React.FC<CreateStockAuditSlideOverProps> = ({
  open,
  onClose,
  onSubmit,
  isCreating,
  khoOptions,
  isLoadingKhos,
  defaultKhoId = "",
}) => {
  const [formData, setFormData] = useState<CreatePhieuKiemKePayload>({
    KhoID: defaultKhoId,
    GhiChu: "",
    BienTheSanPhamIDs: [],
  });
  const [errorKho, setErrorKho] = useState("");

  useEffect(() => {
    if (open) {
      setFormData({
        KhoID: defaultKhoId || (khoOptions[0]?.value ? String(khoOptions[0].value) : ""),
        GhiChu: "",
        BienTheSanPhamIDs: [],
      });
      setErrorKho("");
    }
  }, [open, defaultKhoId, khoOptions]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.KhoID) {
      setErrorKho("Vui lòng chọn kho thực hiện kiểm kê");
      toast.error("Vui lòng chọn kho cần tiến hành kiểm kê!");
      return;
    }
    setErrorKho("");

    await onSubmit(formData);
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Khởi Tạo Đợt Kiểm Kê Kho"
      description="Chốt số liệu tồn kho sổ sách tại thời điểm lập để tiến hành kiểm đếm thực tế"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {/* Chọn kho hàng */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Kho hàng cần kiểm kê <span className="text-rose-500">*</span>
          </label>
          <SearchSelect
            placeholder="Chọn kho cần kiểm kê..."
            options={khoOptions}
            value={formData.KhoID}
            onChange={(val) => {
              setFormData((prev) => ({ ...prev, KhoID: String(val || "") }));
              if (val) setErrorKho("");
            }}
            isLoading={isLoadingKhos}
            height={9.5}
          />
          {errorKho && (
            <div className="flex items-center gap-1 text-[11px] text-rose-500 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorKho}</span>
            </div>
          )}
        </div>

        {/* Ghi chú đợt kiểm kê */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Ghi chú / Mục đích đợt kiểm kê
          </label>
          <textarea
            rows={3}
            placeholder="Ví dụ: Kiểm kê định kỳ tháng 10, đối soát đột xuất, rà soát kho phụ tùng..."
            value={formData.GhiChu || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, GhiChu: e.target.value }))
            }
            className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </div>

        {/* Thông tin giải thích quy trình */}
        <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-900 dark:text-blue-200 flex gap-2.5 items-start">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-[11px] leading-relaxed">
            <p className="font-semibold text-blue-800 dark:text-blue-300">
              Cơ chế quét số lượng sổ sách tự động:
            </p>
            <p className="text-muted-foreground">
              Hệ thống sẽ tự động quét toàn bộ mặt hàng hiện có trong kho được chọn và chốt số lượng tồn sổ sách hiện tại vào biên bản đối soát. Bạn có thể tiến hành kiểm đếm thực tế ngay sau khi tạo.
            </p>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="pt-4 border-t border-border flex justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isCreating}
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
            {isCreating ? "Đang khởi tạo..." : "Bắt đầu kiểm kê"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
};
