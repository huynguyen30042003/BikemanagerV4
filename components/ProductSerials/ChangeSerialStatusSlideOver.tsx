"use client";

import React, { useState, useEffect } from "react";
import { ArrowRightLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { useChuyenTrangThaiSerial } from "@/hooks/SoSerial/useSoSerialApi";
import { ChuyenTrangThaiSerialPayload, SP_SoSerial } from "@/types/soSerial";

interface ChangeSerialStatusSlideOverProps {
  open: boolean;
  onClose: () => void;
  serial: SP_SoSerial | null;
  serialStatusOptions: SelectOption[];
  isLoadingSerialStatuses?: boolean;
  getSerialStatusLabel: (statusId?: number | null) => string;
  onSuccess?: () => void;
}

export const ChangeSerialStatusSlideOver: React.FC<
  ChangeSerialStatusSlideOverProps
> = ({
  open,
  onClose,
  serial,
  serialStatusOptions,
  isLoadingSerialStatuses = false,
  getSerialStatusLabel,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<ChuyenTrangThaiSerialPayload>({
    SoSerialID: "",
    TrangThaiID: 1,
    GhiChu: "",
  });

  const statusMutation = useChuyenTrangThaiSerial();

  useEffect(() => {
    if (open && serial) {
      setFormData({
        SoSerialID: serial.soSerialID,
        TrangThaiID: serial.trangThaiID,
        GhiChu: "",
      });
    }
  }, [open, serial]);

  const handleSubmit = async () => {
    try {
      await statusMutation.mutateAsync(formData);
      onClose();
      onSuccess?.();
    } catch {
      // Handled in mutation
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Chuyển Trạng thái Thiết bị"
      description="Điều chuyển tình trạng vận hành của số serial trong chuỗi cung ứng và bảo dưỡng"
      icon={ArrowRightLeft}
      footer={
        <div className="flex items-center gap-2 w-full">
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={onClose}
            disabled={statusMutation.isPending}
          >
            Hủy bỏ
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-semibold"
            onClick={handleSubmit}
            disabled={statusMutation.isPending}
          >
            {statusMutation.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
            ) : null}
            Cập nhật trạng thái
          </Button>
        </div>
      }
    >
      <div className="space-y-4 py-1">
        {/* Card Serial đang chọn */}
        {serial && (
          <div className="p-3.5 rounded-lg border border-border bg-muted/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-foreground">
                {serial.maSerial}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">
                Hiện tại: {getSerialStatusLabel(serial.trangThaiID)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {serial.tenBienThe || "Chưa đặt tên"}
            </p>
          </div>
        )}

        {/* Chọn trạng thái mới */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Trạng thái mới <span className="text-rose-500">*</span>
          </label>
          <SearchSelect
            placeholder="Chọn trạng thái thiết bị"
            options={serialStatusOptions}
            value={formData.TrangThaiID}
            onChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                TrangThaiID: Number(val),
              }))
            }
            isLoading={isLoadingSerialStatuses}
            height={10}
          />
        </div>

        {/* Lý do / Ghi chú */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Lý do chuyển trạng thái / Ghi chú
          </label>
          <textarea
            rows={3}
            placeholder="Ghi rõ lý do tiếp nhận bảo dưỡng, hoàn hàng, hoặc lỗi linh kiện..."
            value={formData.GhiChu || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                GhiChu: e.target.value,
              }))
            }
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>
    </SlideOver>
  );
};
