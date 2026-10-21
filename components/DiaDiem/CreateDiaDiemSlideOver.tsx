"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { toast } from "sonner";
import { Store, RefreshCw, AlertCircle, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SlideOver } from "@/components/ui/SlideOver";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { CreateDiaDiemPayload } from "@/types/diaDiem";
import { useCreateDiaDiem } from "@/hooks/DiaDiem/useDiaDiemApi";
import { diaDiemSchema } from "@/hooks/DiaDiem/useDiaDiem";
import { useGetDiaPhuongCapXa } from "@/hooks/DiaPhuongCapXa/useDiaPhuongCapXaApi";
import { DM_DiaPhuongCapXa } from "@/types/diaPhuongCapXa";

interface CreateDiaDiemSlideOverProps {
  open: boolean;
  onClose: () => void;
  provinceOptions: SelectOption[];
  parentLocationOptions: SelectOption[];
  loaiDiaDiemOptions: SelectOption[];
  isLoadingLoaiDiaDiem?: boolean;
  defaultTinhId?: number;
  onSuccess?: () => void;
}

export function CreateDiaDiemSlideOver({
  open,
  onClose,
  provinceOptions,
  parentLocationOptions,
  loaiDiaDiemOptions,
  isLoadingLoaiDiaDiem,
  defaultTinhId = 0,
  onSuccess,
}: CreateDiaDiemSlideOverProps) {
  const createMutation = useCreateDiaDiem();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CreateDiaDiemPayload>({
    DiaDiemCapChaID: null,
    LoaiDiaDiemID: 1,
    TenDiaDiem: "",
    MoTa: "",
    TinhID: defaultTinhId,
    XaID: 0,
    KinhDo: null,
    ViDo: null,
    DiaChiSo: "",
    TrangThai: true,
    file: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form khi modal mở
  useEffect(() => {
    if (open) {
      setFormData({
        DiaDiemCapChaID: null,
        LoaiDiaDiemID: 1,
        TenDiaDiem: "",
        MoTa: "",
        TinhID: defaultTinhId,
        XaID: 0,
        KinhDo: null,
        ViDo: null,
        DiaChiSo: "",
        TrangThai: true,
        file: null,
      });
      setErrors({});
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [open, defaultTinhId]);

  // Lấy danh sách xã/phường phụ thuộc theo TỉnhID đã chọn trong form
  const { data: dataXa, isLoading: isLoadingXa } = useGetDiaPhuongCapXa({
    TinhID: formData.TinhID > 0 ? formData.TinhID : null,
    PageIndex: 1,
    PageSize: 200,
  });

  const communeOptions = useMemo(() => {
    const communes: DM_DiaPhuongCapXa[] = dataXa?.data ?? [];
    return communes.map((c) => ({
      value: c.xaID,
      label: c.ten,
    }));
  }, [dataXa]);

  const handleSubmit = async () => {
    const result = diaDiemSchema.safeParse({
      tenDiaDiem: formData.TenDiaDiem,
      loaiDiaDiemID: formData.LoaiDiaDiemID,
      tinhID: formData.TinhID,
      xaID: formData.XaID,
      diaChiSo: formData.DiaChiSo,
    });

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) {
          newErrors[String(field)] = issue.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      await createMutation.mutateAsync(formData);
      toast.success("Thêm mới cơ sở / showroom thành công");
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Đã có lỗi xảy ra khi tạo cơ sở mới";
      toast.error(msg);
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Thêm mới Cơ sở / Showroom"
      description="Đăng ký điểm bán hàng, trạm dịch vụ bảo hành hoặc kho chi nhánh"
      icon={Store}
      footer={
        <>
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={onClose}
            disabled={createMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            onClick={handleSubmit}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
            ) : null}
            Lưu cơ sở
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Tên địa điểm / Showroom <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.TenDiaDiem}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, TenDiaDiem: e.target.value }))
            }
            placeholder="Ví dụ: Showroom BikeManager Cầu Giấy..."
            className={`rounded-lg ${errors.tenDiaDiem ? "border-red-500" : ""}`}
          />
          {errors.tenDiaDiem && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.tenDiaDiem}
            </p>
          )}
        </div>

        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Loại hình cơ sở <span className="text-red-500">*</span>
          </label>
          <SearchSelect
            options={loaiDiaDiemOptions}
            value={formData.LoaiDiaDiemID}
            onChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                LoaiDiaDiemID: Number(val) || 1,
              }))
            }
            placeholder="Chọn loại cơ sở..."
            isLoading={isLoadingLoaiDiaDiem}
            height={10}
          />
        </div>

        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Trực thuộc cơ sở cha (nếu có)
          </label>
          <SearchSelect
            options={[
              { value: "", label: "-- Không có (Độc lập) --" },
              ...parentLocationOptions,
            ]}
            value={formData.DiaDiemCapChaID || ""}
            onChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                DiaDiemCapChaID: val ? String(val) : null,
              }))
            }
            placeholder="Chọn cơ sở cha..."
            height={10}
          />
        </div>

        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Tỉnh / Thành phố <span className="text-red-500">*</span>
          </label>
          <SearchSelect
            options={provinceOptions}
            value={formData.TinhID || ""}
            onChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                TinhID: Number(val) || 0,
                XaID: 0,
              }))
            }
            placeholder="-- Chọn Tỉnh / TP --"
            height={10}
          />
          {errors.tinhID && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.tinhID}
            </p>
          )}
        </div>

        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Phường / Xã <span className="text-red-500">*</span>
          </label>
          <SearchSelect
            options={communeOptions}
            value={formData.XaID || ""}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, XaID: Number(val) || 0 }))
            }
            placeholder={
              formData.TinhID ? "-- Chọn Phường / Xã --" : "Vui lòng chọn Tỉnh trước"
            }
            isLoading={isLoadingXa}
            height={10}
          />
          {errors.xaID && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.xaID}
            </p>
          )}
        </div>

        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Địa chỉ số (Số nhà, Tên đường, Tòa nhà) <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.DiaChiSo}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, DiaChiSo: e.target.value }))
            }
            placeholder="Ví dụ: 123 Đường Cầu Giấy, Tòa nhà Indochina..."
            className={`rounded-lg ${errors.diaChiSo ? "border-red-500" : ""}`}
          />
          {errors.diaChiSo && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.diaChiSo}
            </p>
          )}
        </div>

        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Kinh độ (Longitude)
          </label>
          <Input
            type="number"
            step="any"
            value={formData.KinhDo ?? ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                KinhDo: e.target.value ? parseFloat(e.target.value) : null,
              }))
            }
            placeholder="Ví dụ: 105.7832"
            className="rounded-lg font-mono text-sm"
          />
        </div>

        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Vĩ độ (Latitude)
          </label>
          <Input
            type="number"
            step="any"
            value={formData.ViDo ?? ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                ViDo: e.target.value ? parseFloat(e.target.value) : null,
              }))
            }
            placeholder="Ví dụ: 21.0333"
            className="rounded-lg font-mono text-sm"
          />
        </div>

        {/* Upload ảnh đại diện */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Ảnh đại diện cơ sở
          </label>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setFormData((prev) => ({ ...prev, file }));
            }}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border/80 rounded-xl p-4 text-center hover:bg-muted/30 transition-colors cursor-pointer flex flex-col items-center justify-center gap-1.5 relative"
          >
            <Upload className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">
              {formData.file
                ? formData.file.name
                : "Nhấn để chọn ảnh đại diện showroom (PNG, JPG)"}
            </span>
            <span className="text-[11px] text-muted-foreground">Kích thước tối đa 5MB</span>
            {formData.file && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-red-500 hover:text-red-600 mt-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setFormData((prev) => ({ ...prev, file: null }));
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                <X className="w-3.5 h-3.5 mr-1" /> Bỏ chọn ảnh
              </Button>
            )}
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Mô tả chi tiết</label>
          <Textarea
            value={formData.MoTa || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, MoTa: e.target.value }))
            }
            placeholder="Ghi chú về dịch vụ, giờ mở cửa, năng lực trạm sửa chữa..."
            className="h-24 resize-none rounded-lg text-sm"
          />
        </div>

        <div className="col-span-2 flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/20">
          <div>
            <p className="text-sm font-medium text-foreground">Trạng thái hoạt động</p>
            <p className="text-xs text-muted-foreground">
              Cho phép giao dịch và hiển thị trên bản đồ dịch vụ
            </p>
          </div>
          <Switch
            id="isActiveDiaDiemAdd"
            checked={formData.TrangThai}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, TrangThai: checked }))
            }
          />
        </div>
      </div>
    </SlideOver>
  );
}
