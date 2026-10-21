"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchSelect } from "@/components/ui/selectSearch";
import { useCreatePhieuBaoHanh } from "@/hooks/BaoHanh/useBaoHanhApi";
import { CreatePhieuBaoHanhPayload } from "@/types/baoHanh";
import { Store, AlertTriangle, Wrench, ShieldCheck, AlertCircle } from "lucide-react";

export const warrantyClaimSchema = z.object({
  MoTaLoi: z.string().trim().min(5, "Vui lòng mô tả chi tiết sự cố hư hỏng (tối thiểu 5 ký tự)"),
  DiaDiemID: z.string().optional().nullable(),
  HuongXuLyID: z.number().min(1, "Vui lòng chọn hướng xử lý"),
  TrangThaiID: z.number().min(1, "Vui lòng chọn trạng thái phiếu"),
  KetQuaKiemTra: z.string().optional().nullable(),
  ChiPhiHangHoTro: z.number().min(0, "Chi phí không được âm").optional().nullable(),
  ChiPhiKhachTra: z.number().min(0, "Chi phí không được âm").optional().nullable(),
  GhiChu: z.string().optional().nullable(),
});

interface OptionItem {
  value: string | number;
  label: string;
}

interface CreateWarrantyClaimSlideOverProps {
  open: boolean;
  onClose: () => void;
  diaDiemOptions: OptionItem[];
  claimStatusOptions: OptionItem[];
  isLoadingClaimStatuses?: boolean;
  actionOptions: OptionItem[];
  isLoadingActions?: boolean;
  onSuccess?: () => void;
}

export function CreateWarrantyClaimSlideOver({
  open,
  onClose,
  diaDiemOptions,
  claimStatusOptions,
  isLoadingClaimStatuses = false,
  actionOptions,
  isLoadingActions = false,
  onSuccess,
}: CreateWarrantyClaimSlideOverProps) {
  const [formData, setFormData] = useState<CreatePhieuBaoHanhPayload>({
    BaoHanhID: "",
    KhachHangID: "",
    SoSerialID: "",
    DiaDiemID: "",
    MoTaLoi: "",
    KetQuaKiemTra: "",
    HuongXuLyID: 102, // Sửa chữa tại trạm
    TrangThaiID: 96, // Tiếp nhận
    ChiPhiHangHoTro: 0,
    ChiPhiKhachTra: 0,
    GhiChu: "",
    ChiTiets: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const createMutation = useCreatePhieuBaoHanh();

  // Reset form when opened
  useEffect(() => {
    if (open) {
      const defaultDiaDiem = diaDiemOptions[0]?.value ? String(diaDiemOptions[0].value) : "";
      const defaultAction = actionOptions[0]?.value ? Number(actionOptions[0].value) : 102;
      const defaultStatus = claimStatusOptions[0]?.value ? Number(claimStatusOptions[0].value) : 96;

      setFormData({
        BaoHanhID: "",
        KhachHangID: "",
        SoSerialID: "",
        DiaDiemID: defaultDiaDiem,
        MoTaLoi: "",
        KetQuaKiemTra: "",
        HuongXuLyID: defaultAction,
        TrangThaiID: defaultStatus,
        ChiPhiHangHoTro: 0,
        ChiPhiKhachTra: 0,
        GhiChu: "",
        ChiTiets: [],
      });
      setErrors({});
    }
  }, [open, diaDiemOptions, actionOptions, claimStatusOptions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = warrantyClaimSchema.safeParse(formData);
    if (!validation.success) {
      const formattedErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        formattedErrors[path] = issue.message;
      });
      setErrors(formattedErrors);
      toast.warning("Vui lòng kiểm tra lại thông tin nhập!");
      return;
    }

    try {
      await createMutation.mutateAsync(formData);
      toast.success("Lập phiếu tiếp nhận bảo hành thành công!");
      onClose();
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Không thể tạo phiếu bảo hành!";
      toast.error(message);
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Tiếp Nhận Xe / Thiết Bị Bảo Hành"
      description="Ghi nhận thông tin sự cố, kết quả chẩn đoán và hướng xử lý bảo hành"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {/* Trạm tiếp nhận */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-blue-500" />
            <span>Trạm bảo hành / Showroom tiếp nhận</span>
          </label>
          <SearchSelect
            options={diaDiemOptions}
            value={formData.DiaDiemID || ""}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, DiaDiemID: String(val) }))
            }
          />
        </div>

        {/* Triệu chứng lỗi */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Mô tả triệu chứng hư hỏng</span>
            <span className="text-rose-500">*</span>
          </label>
          <Textarea
            placeholder="VD: Xe không nhận sạc pin, chập chờn đồng hồ hiển thị, động cơ kêu lạ..."
            rows={3}
            value={formData.MoTaLoi}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, MoTaLoi: e.target.value }));
              if (errors.MoTaLoi) {
                setErrors((prev) => ({ ...prev, MoTaLoi: "" }));
              }
            }}
            className="text-xs"
          />
          {errors.MoTaLoi && (
            <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.MoTaLoi}
            </p>
          )}
        </div>

        {/* Chẩn đoán */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-blue-500" />
            <span>Kết quả chẩn đoán kỹ thuật ban đầu</span>
          </label>
          <Textarea
            placeholder="VD: Hỏng mạch BMS của khối pin cell #3, cần thay cụm bo sạc mới..."
            rows={2}
            value={formData.KetQuaKiemTra || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                KetQuaKiemTra: e.target.value,
              }))
            }
            className="text-xs"
          />
        </div>

        {/* Hướng xử lý & Trạng thái */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Hướng xử lý</span>
            </label>
            <SearchSelect
              options={actionOptions}
              value={String(formData.HuongXuLyID)}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  HuongXuLyID: Number(val),
                }))
              }
              isLoading={isLoadingActions}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Trạng thái phiếu</span>
            </label>
            <SearchSelect
              options={claimStatusOptions}
              value={String(formData.TrangThaiID)}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  TrangThaiID: Number(val),
                }))
              }
              isLoading={isLoadingClaimStatuses}
            />
          </div>
        </div>

        {/* Chi phí ước tính */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Chi phí Hãng hỗ trợ (đ)
            </label>
            <Input
              type="number"
              min={0}
              step={10000}
              value={formData.ChiPhiHangHoTro ?? 0}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ChiPhiHangHoTro: parseFloat(e.target.value) || 0,
                }))
              }
              className="text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Chi phí Khách chi trả (đ)
            </label>
            <Input
              type="number"
              min={0}
              step={10000}
              value={formData.ChiPhiKhachTra ?? 0}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ChiPhiKhachTra: parseFloat(e.target.value) || 0,
                }))
              }
              className="text-xs font-mono"
            />
          </div>
        </div>

        {/* Ghi chú */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Ghi chú nội bộ
          </label>
          <Input
            placeholder="Ghi chú thêm về phụ kiện đi kèm khi nhận xe..."
            value={formData.GhiChu || ""}
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
            disabled={createMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium cursor-pointer"
          >
            {createMutation.isPending ? "Đang lưu..." : "Lập phiếu"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
}
