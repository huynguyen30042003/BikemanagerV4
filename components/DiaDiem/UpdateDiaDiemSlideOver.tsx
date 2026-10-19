"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { SquarePen, RefreshCw, AlertCircle, Upload, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SlideOver } from "@/components/ui/SlideOver";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { DM_DiaDiem, UpdateDiaDiemPayload } from "@/types/diaDiem";
import { useUpdateDiaDiem } from "@/hooks/DiaDiem/useDiaDiemApi";
import { diaDiemSchema } from "@/hooks/DiaDiem/useDiaDiem";
import { useGetDiaPhuongCapXa } from "@/hooks/DiaPhuongCapXa/useDiaPhuongCapXaApi";
import { DM_DiaPhuongCapXa } from "@/types/diaPhuongCapXa";
import { getImageUrl } from "@/shared/constants/apiConstants";

interface UpdateDiaDiemSlideOverProps {
  open: boolean;
  onClose: () => void;
  data: DM_DiaDiem | null;
  provinceOptions: SelectOption[];
  parentLocationOptions: SelectOption[];
  loaiDiaDiemOptions: SelectOption[];
  isLoadingLoaiDiaDiem?: boolean;
  onSuccess?: () => void;
}

export function UpdateDiaDiemSlideOver({
  open,
  onClose,
  data,
  provinceOptions,
  parentLocationOptions,
  loaiDiaDiemOptions,
  isLoadingLoaiDiaDiem,
  onSuccess,
}: UpdateDiaDiemSlideOverProps) {
  const updateMutation = useUpdateDiaDiem();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<UpdateDiaDiemPayload>({
    DiaDiemID: "",
    DiaDiemCapChaID: null,
    LoaiDiaDiemID: 1,
    TenDiaDiem: "",
    MoTa: "",
    TinhID: 0,
    XaID: 0,
    KinhDo: null,
    ViDo: null,
    DiaChiSo: "",
    TrangThai: true,
    XoaFile: false,
    file: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cập nhật dữ liệu vào form khi data thay đổi hoặc mở modal
  useEffect(() => {
    if (open && data) {
      setFormData({
        DiaDiemID: data.diaDiemID,
        DiaDiemCapChaID: data.diaDiemCapChaID || null,
        LoaiDiaDiemID: data.loaiDiaDiemID || 1,
        TenDiaDiem: data.tenDiaDiem || "",
        MoTa: data.moTa || "",
        TinhID: data.tinhID || 0,
        XaID: data.xaID || 0,
        KinhDo: data.kinhDo ?? null,
        ViDo: data.viDo ?? null,
        DiaChiSo: data.diaChiSo || "",
        TrangThai: data.trangThai ?? true,
        XoaFile: false,
        file: null,
      });
      setErrors({});
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [open, data]);

  // Lấy danh sách xã/phường phụ thuộc theo TỉnhID đã chọn
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

  // Lọc bỏ chính cơ sở đang sửa khỏi danh sách cơ sở cha
  const filteredParentOptions = useMemo(() => {
    return parentLocationOptions.filter((opt) => opt.value !== data?.diaDiemID);
  }, [parentLocationOptions, data?.diaDiemID]);

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
      await updateMutation.mutateAsync(formData);
      toast.success("Cập nhật thông tin cơ sở thành công");
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Đã có lỗi xảy ra khi cập nhật cơ sở";
      toast.error(msg);
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Cập nhật Cơ sở / Showroom"
      description="Chỉnh sửa thông tin cơ sở chi nhánh"
      icon={SquarePen}
      footer={
        <>
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={onClose}
            disabled={updateMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
            ) : null}
            Lưu thay đổi
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
            placeholder="Nhập tên cơ sở..."
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
          />
        </div>

        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Trực thuộc cơ sở cha
          </label>
          <SearchSelect
            options={[
              { value: "", label: "-- Không có (Độc lập) --" },
              ...filteredParentOptions,
            ]}
            value={formData.DiaDiemCapChaID || ""}
            onChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                DiaDiemCapChaID: val ? String(val) : null,
              }))
            }
            placeholder="Chọn cơ sở cha..."
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
            Địa chỉ số <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.DiaChiSo}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, DiaChiSo: e.target.value }))
            }
            placeholder="Nhập địa chỉ..."
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

        {/* Cập nhật ảnh đại diện */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Ảnh đại diện cơ sở
          </label>

          {data?.anhDaiDien && !formData.XoaFile && !formData.file && (
            <div className="relative w-full h-32 rounded-xl overflow-hidden border border-border/80 bg-muted/40 mb-1 group">
              <Image
                src={getImageUrl(data.anhDaiDien)}
                alt={data.tenDiaDiem}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="h-8 text-xs cursor-pointer"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, XoaFile: true, file: null }))
                  }
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Xóa ảnh này
                </Button>
              </div>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setFormData((prev) => ({ ...prev, file, XoaFile: false }));
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
                : formData.XoaFile
                ? "Đã chọn xóa ảnh cũ. Nhấn nếu muốn tải ảnh mới"
                : "Nhấn để tải lên ảnh mới thay thế (PNG, JPG)"}
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
                <X className="w-3.5 h-3.5 mr-1" /> Bỏ chọn ảnh mới
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
            placeholder="Nhập mô tả..."
            className="h-24 resize-none rounded-lg text-sm"
          />
        </div>

        <div className="col-span-2 flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/20">
          <div>
            <p className="text-sm font-medium text-foreground">Trạng thái hoạt động</p>
            <p className="text-xs text-muted-foreground">
              Kích hoạt tiếp nhận đơn hàng & dịch vụ
            </p>
          </div>
          <Switch
            id="isActiveDiaDiemUpdate"
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
