"use client";

import React, { useState, useEffect } from "react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { KHO_PhieuKiemKe, CapNhatSoDemPayload, ChiTietSoDemItem } from "@/types/phieuKiemKe";
import { Check, Copy, AlertTriangle, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

interface UpdateStockAuditCountsSlideOverProps {
  open: boolean;
  onClose: () => void;
  phieu: KHO_PhieuKiemKe | null;
  onSubmit: (payload: CapNhatSoDemPayload) => Promise<void>;
  isUpdating: boolean;
  reasonDiscrepancyOptions: SelectOption[];
  isLoadingReasons: boolean;
}

export const UpdateStockAuditCountsSlideOver: React.FC<UpdateStockAuditCountsSlideOverProps> = ({
  open,
  onClose,
  phieu,
  onSubmit,
  isUpdating,
  reasonDiscrepancyOptions,
  isLoadingReasons,
}) => {
  const [formData, setFormData] = useState<CapNhatSoDemPayload>({
    PhieuKiemKeID: "",
    ChiTiets: [],
  });

  useEffect(() => {
    if (open && phieu) {
      setFormData({
        PhieuKiemKeID: phieu.phieuKiemKeID,
        ChiTiets: (phieu.chiTiets || []).map((ct) => ({
          BienTheSanPhamID: ct.bienTheSanPhamID,
          SoSerialID: ct.soSerialID || null,
          SoLuongThucTe: ct.soLuongThucTe ?? ct.soLuongHeThong ?? 0,
          LyDoLechID: ct.lyDoLechID || (reasonDiscrepancyOptions[0]?.value ? Number(reasonDiscrepancyOptions[0].value) : 1),
          GhiChuLyDo: ct.ghiChuLyDo || "",
        })),
      });
    }
  }, [open, phieu, reasonDiscrepancyOptions]);

  if (!phieu) return null;

  // Gán tất cả số đếm thực tế bằng số lượng sổ sách
  const handleMatchAllWithBookCount = () => {
    if (!phieu.chiTiets) return;
    setFormData((prev) => ({
      ...prev,
      ChiTiets: prev.ChiTiets.map((ct) => {
        const itemRef = phieu.chiTiets?.find((c) => c.bienTheSanPhamID === ct.BienTheSanPhamID);
        return {
          ...ct,
          SoLuongThucTe: itemRef?.soLuongHeThong ?? 0,
        };
      }),
    }));
    toast.info("Đã đồng bộ toàn bộ số đếm thực tế bằng số tồn sổ sách");
  };

  const handleUpdateItem = (idx: number, patch: Partial<ChiTietSoDemItem>) => {
    setFormData((prev) => {
      const next = [...prev.ChiTiets];
      next[idx] = { ...next[idx], ...patch };
      return { ...prev, ChiTiets: next };
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Cập Nhật Số Đếm Thực Tế"
      description={`Nhập kết quả đếm hàng thực tế tại ${phieu.tenKho || "kho"} cho biên bản #${phieu.maPhieuKiemKe}`}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {/* Quick Bulk Actions */}
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-muted/40 border border-border/80">
          <span className="text-xs font-medium text-muted-foreground">
            Thao tác nhanh ({formData.ChiTiets.length} mặt hàng)
          </span>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleMatchAllWithBookCount}
            className="text-xs h-8 px-2.5 flex items-center gap-1.5 cursor-pointer text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-950/40"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Khớp tất cả theo sổ sách</span>
          </Button>
        </div>

        {/* List of count items */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {formData.ChiTiets.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              Không có mặt hàng nào trong biên bản kiểm kê này
            </div>
          ) : (
            formData.ChiTiets.map((ct, idx) => {
              const itemRef = phieu.chiTiets?.find((c) => c.bienTheSanPhamID === ct.BienTheSanPhamID);
              const heThong = itemRef?.soLuongHeThong ?? 0;
              const lech = ct.SoLuongThucTe - heThong;
              const hasDiff = lech !== 0;

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all duration-150 space-y-2.5 ${
                    hasDiff
                      ? "border-amber-500/40 bg-amber-500/5 shadow-2xs"
                      : "border-border/80 bg-card"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-foreground block">
                        {itemRef?.tenBienThe || `Mặt hàng #${idx + 1}`}
                      </span>
                      {itemRef?.maSKU && (
                        <span className="font-mono text-[10px] text-muted-foreground">
                          SKU: {itemRef.maSKU}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        Sổ sách: <strong className="text-foreground">{heThong}</strong>
                      </span>
                      {hasDiff && (
                        <span
                          className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                            lech > 0
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {lech > 0 ? `+${lech} (Thừa)` : `${lech} (Thiếu)`}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-end">
                    <div>
                      <label className="block text-[11px] font-semibold text-foreground mb-1">
                        Số lượng thực đếm <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        type="number"
                        min={0}
                        value={ct.SoLuongThucTe}
                        onChange={(e) =>
                          handleUpdateItem(idx, {
                            SoLuongThucTe: Math.max(0, parseInt(e.target.value) || 0),
                          })
                        }
                        className="text-xs font-mono font-bold h-9"
                      />
                    </div>

                    {hasDiff && (
                      <div>
                        <label className="block text-[11px] font-semibold text-foreground mb-1">
                          Lý do chênh lệch
                        </label>
                        <SearchSelect
                          options={reasonDiscrepancyOptions}
                          value={ct.LyDoLechID || (reasonDiscrepancyOptions[0]?.value ? Number(reasonDiscrepancyOptions[0].value) : 1)}
                          onChange={(val) =>
                            handleUpdateItem(idx, {
                              LyDoLechID: Number(val),
                            })
                          }
                          isLoading={isLoadingReasons}
                          height={9}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-border flex justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isUpdating}
            className="cursor-pointer text-xs h-9 px-4"
          >
            Hủy bỏ
          </Button>

          <Button
            type="submit"
            size="sm"
            disabled={isUpdating}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer text-xs font-semibold h-9 px-4 shadow-xs"
          >
            {isUpdating ? "Đang lưu số đếm..." : "Lưu kết quả kiểm kê"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
};
