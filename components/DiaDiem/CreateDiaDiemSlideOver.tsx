"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Store, RefreshCw, AlertCircle, Upload, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SlideOver } from "@/components/ui/SlideOver";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { CreateDiaDiemPayload } from "@/types/diaDiem";
import { useCreateDiaDiem } from "@/hooks/DiaDiem/useDiaDiemApi";
import { diaDiemSchema, DiaDiemFormData } from "@/hooks/DiaDiem/useDiaDiem";
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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DiaDiemFormData>({
    resolver: zodResolver(diaDiemSchema),
    defaultValues: {
      diaDiemCapChaID: null,
      loaiDiaDiemID: 1,
      tenDiaDiem: "",
      moTa: "",
      tinhID: defaultTinhId || 0,
      xaID: 0,
      kinhDo: null,
      viDo: null,
      diaChiSo: "",
      trangThai: true,
    },
  });

  const watchedTinhID = watch("tinhID");

  // Reset form khi modal đóng/mở
  useEffect(() => {
    if (open) {
      reset({
        diaDiemCapChaID: null,
        loaiDiaDiemID: 1,
        tenDiaDiem: "",
        moTa: "",
        tinhID: defaultTinhId || 0,
        xaID: 0,
        kinhDo: null,
        viDo: null,
        diaChiSo: "",
        trangThai: true,
      });
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  }, [open, defaultTinhId, reset]);

  // Thu hồi bộ nhớ blob URL khi unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setSelectedFile(file);
    } else {
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  };

  const handleRemoveFile = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Lấy danh sách xã/phường phụ thuộc theo TỉnhID đã chọn trong form
  const { data: dataXa, isLoading: isLoadingXa } = useGetDiaPhuongCapXa(
    {
      TinhID: watchedTinhID > 0 ? watchedTinhID : null,
      PageIndex: 1,
      PageSize: 200,
    },
    Boolean(open && watchedTinhID > 0),
  );

  const communeOptions = useMemo(() => {
    const communes: DM_DiaPhuongCapXa[] = dataXa?.data ?? [];
    return communes.map((c) => ({
      value: c.xaID,
      label: c.ten,
    }));
  }, [dataXa]);

  const onSubmit = async (values: DiaDiemFormData) => {
    try {
      const payload: CreateDiaDiemPayload = {
        DiaDiemCapChaID: values.diaDiemCapChaID || null,
        LoaiDiaDiemID: values.loaiDiaDiemID,
        TenDiaDiem: values.tenDiaDiem,
        MoTa: values.moTa || "",
        TinhID: values.tinhID,
        XaID: values.xaID,
        KinhDo: values.kinhDo ?? null,
        ViDo: values.viDo ?? null,
        DiaChiSo: values.diaChiSo,
        TrangThai: values.trangThai,
        file: selectedFile,
      };

      await createMutation.mutateAsync(payload);
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
            disabled={createMutation.isPending || isSubmitting}
          >
            Hủy
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-medium"
            onClick={handleSubmit(onSubmit)}
            disabled={createMutation.isPending || isSubmitting}
          >
            {createMutation.isPending || isSubmitting ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
            ) : null}
            Lưu cơ sở
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Tên địa điểm / Showroom <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("tenDiaDiem")}
            placeholder="Ví dụ: Showroom BikeManager Cầu Giấy..."
            className={`rounded-lg ${errors.tenDiaDiem ? "border-red-500 ring-1 ring-red-500/20" : ""}`}
          />
          {errors.tenDiaDiem && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.tenDiaDiem.message}
            </p>
          )}
        </div>

        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Loại hình cơ sở <span className="text-red-500">*</span>
          </label>
          <Controller
            name="loaiDiaDiemID"
            control={control}
            render={({ field }) => (
              <SearchSelect
                options={loaiDiaDiemOptions}
                value={field.value}
                onChange={(val) => field.onChange(Number(val) || 1)}
                placeholder="Chọn loại cơ sở..."
                isLoading={isLoadingLoaiDiaDiem}
                height={10}
                className={errors.loaiDiaDiemID ? "border-red-500 ring-1 ring-red-500/20" : ""}
              />
            )}
          />
          {errors.loaiDiaDiemID && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.loaiDiaDiemID.message}
            </p>
          )}
        </div>

        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Trực thuộc cơ sở cha (nếu có)
          </label>
          <Controller
            name="diaDiemCapChaID"
            control={control}
            render={({ field }) => (
              <SearchSelect
                options={[
                  { value: "", label: "-- Không có (Độc lập) --" },
                  ...parentLocationOptions,
                ]}
                value={field.value || ""}
                onChange={(val) => field.onChange(val ? String(val) : null)}
                placeholder="Chọn cơ sở cha..."
                height={10}
              />
            )}
          />
        </div>

        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Tỉnh / Thành phố <span className="text-red-500">*</span>
          </label>
          <Controller
            name="tinhID"
            control={control}
            render={({ field }) => (
              <SearchSelect
                options={provinceOptions}
                value={field.value || ""}
                onChange={(val) => {
                  field.onChange(Number(val) || 0);
                  setValue("xaID", 0);
                }}
                placeholder="-- Chọn Tỉnh / TP --"
                height={10}
                className={errors.tinhID ? "border-red-500 ring-1 ring-red-500/20" : ""}
              />
            )}
          />
          {errors.tinhID && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.tinhID.message}
            </p>
          )}
        </div>

        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Phường / Xã <span className="text-red-500">*</span>
          </label>
          <Controller
            name="xaID"
            control={control}
            render={({ field }) => (
              <SearchSelect
                options={communeOptions}
                value={field.value || ""}
                onChange={(val) => field.onChange(Number(val) || 0)}
                placeholder={
                  watchedTinhID ? "-- Chọn Phường / Xã --" : "Vui lòng chọn Tỉnh trước"
                }
                isLoading={isLoadingXa}
                height={10}
                className={errors.xaID ? "border-red-500 ring-1 ring-red-500/20" : ""}
              />
            )}
          />
          {errors.xaID && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.xaID.message}
            </p>
          )}
        </div>

        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Địa chỉ số (Số nhà, Tên đường, Tòa nhà) <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("diaChiSo")}
            placeholder="Ví dụ: 123 Đường Cầu Giấy, Tòa nhà Indochina..."
            className={`rounded-lg ${errors.diaChiSo ? "border-red-500 ring-1 ring-red-500/20" : ""}`}
          />
          {errors.diaChiSo && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.diaChiSo.message}
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
            {...register("kinhDo", {
              setValueAs: (v) =>
                v === "" || v === null || v === undefined || isNaN(Number(v)) ? null : Number(v),
            })}
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
            {...register("viDo", {
              setValueAs: (v) =>
                v === "" || v === null || v === undefined || isNaN(Number(v)) ? null : Number(v),
            })}
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
            onChange={handleFileChange}
          />

          {previewUrl ? (
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-border/80 bg-muted/40 group shadow-2xs">
              <Image
                src={previewUrl}
                alt="Ảnh xem trước showroom"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-8 text-xs cursor-pointer shadow bg-white/95 hover:bg-white text-zinc-900"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-3.5 h-3.5 mr-1" /> Đổi ảnh khác
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="h-8 text-xs cursor-pointer shadow"
                  onClick={handleRemoveFile}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Bỏ chọn ảnh
                </Button>
              </div>

              {/* Tag thông tin file ở góc dưới */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                <div className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-xs text-[11px] text-white flex items-center gap-1.5 max-w-[80%]">
                  <span className="truncate">{selectedFile?.name}</span>
                  {selectedFile && (
                    <span className="text-zinc-300 shrink-0">
                      ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="pointer-events-auto p-1.5 rounded-md bg-black/70 hover:bg-red-600 text-white transition-colors cursor-pointer sm:hidden"
                  title="Bỏ chọn ảnh"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border/80 rounded-xl p-5 text-center hover:bg-muted/30 hover:border-primary/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <Upload className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-foreground">
                  Nhấn để chọn ảnh đại diện showroom (PNG, JPG, WebP)
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Kích thước tối đa 5MB • Khuyến nghị ảnh phong cảnh 16:9
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Mô tả chi tiết</label>
          <Textarea
            {...register("moTa")}
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
          <Controller
            name="trangThai"
            control={control}
            render={({ field }) => (
              <Switch
                id="isActiveDiaDiemAdd"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
      </form>
    </SlideOver>
  );
}
