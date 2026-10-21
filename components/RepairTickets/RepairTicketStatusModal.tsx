"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { SC_PhieuSuaChua } from "@/types/suaChua";

interface RepairTicketStatusModalProps {
  open: boolean;
  onClose: () => void;
  ticket: SC_PhieuSuaChua | null;
  repairStatusOptions: SelectOption[];
  isLoadingRepairStatuses?: boolean;
  onSubmit: (data: {
    PhieuSuaChuaID: string;
    TrangThaiID: number;
    GhiChu?: string;
  }) => Promise<void>;
  isSubmitting?: boolean;
}

export function RepairTicketStatusModal({
  open,
  onClose,
  ticket,
  repairStatusOptions,
  isLoadingRepairStatuses,
  onSubmit,
  isSubmitting = false,
}: RepairTicketStatusModalProps) {
  const [formData, setFormData] = useState<{
    PhieuSuaChuaID: string;
    TrangThaiID: number;
    GhiChu: string;
  }>({
    PhieuSuaChuaID: "",
    TrangThaiID: 108,
    GhiChu: "",
  });

  useEffect(() => {
    if (open && ticket) {
      setFormData({
        PhieuSuaChuaID: ticket.phieuSuaChuaID,
        TrangThaiID: ticket.trangThaiID,
        GhiChu: "",
      });
    }
  }, [open, ticket]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket) return;
    await onSubmit({
      PhieuSuaChuaID: ticket.phieuSuaChuaID,
      TrangThaiID: formData.TrangThaiID,
      GhiChu: formData.GhiChu,
    });
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Chuyển Tiến Độ Sửa Chữa"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {/* Banner */}
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
          <ArrowRight className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            Cập nhật trạng thái tiến độ cho phiếu{" "}
            <strong className="font-mono">{ticket?.maPhieuSuaChua}</strong> ({ticket?.tenKhachHang || "Khách lẻ"}).
          </span>
        </div>

        {/* Tiến độ kỹ thuật SearchSelect with height={10} */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Tiến độ kỹ thuật (Từ DM chi tiết)
          </label>
          <SearchSelect
            options={repairStatusOptions}
            value={String(formData.TrangThaiID)}
            onChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                TrangThaiID: Number(val),
              }))
            }
            isLoading={isLoadingRepairStatuses}
            height={10}
            placeholder="Chọn tiến độ mới..."
          />
        </div>

        {/* Ghi chú */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Ghi chú cập nhật
          </label>
          <Textarea
            rows={3}
            placeholder="VD: Đã thay thế xong phụ tùng, đang chạy thử xe 5km..."
            value={formData.GhiChu}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, GhiChu: e.target.value }))
            }
            className="text-xs"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2.5 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs cursor-pointer font-medium"
          >
            {isSubmitting ? "Đang lưu..." : "Cập nhật tiến độ"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
}
