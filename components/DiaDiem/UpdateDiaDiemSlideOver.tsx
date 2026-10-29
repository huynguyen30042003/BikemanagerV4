"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  SquarePen,
  RefreshCw,
  AlertCircle,
  Upload,
  X,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SlideOver } from "@/components/ui/SlideOver";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { DM_DiaDiem, UpdateDiaDiemPayload } from "@/types/diaDiem";
import { useUpdateDiaDiem } from "@/hooks/DiaDiem/useDiaDiemApi";
import { diaDiemSchema, DiaDiemFormData } from "@/hooks/DiaDiem/useDiaDiem";
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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [xoaFile, setXoaFile] = useState<boolean>(false);
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
      tinhID: 0,
      xaID: 0,
      kinhDo: null,
      viDo: null,
      diaChiSo: "",
      trangThai: true,
    },
  });

  const watchedTinhID = watch("tinhID");

  // Cập nhật dữ liệu vào form khi data thay đổi hoặc mở modal
  useEffect(() => {
    if (open && data) {
      reset({
        diaDiemCapChaID: data.diaDiemCapChaID || null,
        loaiDiaDiemID: data.loaiDiaDiemID || 1,
        tenDiaDiem: data.tenDiaDiem || "",
        moTa: data.moTa || "",
        tinhID: data.tinhID || 0,
        xaID: data.xaID || 0,
        kinhDo: data.kinhDo ?? null,
        viDo: data.viDo ?? null,
        diaChiSo: data.diaChiSo || "",
        trangThai: data.trangThai ?? true,
      });
      setSelectedFile(null);
      setXoaFile(false);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else if (!open) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  }, [open, data, reset]);

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
      setXoaFile(false);
    } else {
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  };

  const handleRemoveNewFile = (e?: React.MouseEvent) => {
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

  const handleDeleteExistingImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setXoaFile(true);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRestoreExistingImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setXoaFile(false);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Lấy danh sách xã/phường phụ thuộc theo TỉnhID đã chọn
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

  // Lọc bỏ chính cơ sở đang sửa khỏi danh sách cơ sở cha
  const filteredParentOptions = useMemo(() => {
    return parentLocationOptions.filter((opt) => opt.value !== data?.diaDiemID);
  }, [parentLocationOptions, data?.diaDiemID]);

  const onSubmit = async (values: DiaDiemFormData) => {
    if (!data?.diaDiemID) return;
    try {
      const payload: UpdateDiaDiemPayload = {
        DiaDiemID: data.diaDiemID,
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
        XoaFile: xoaFile,
        file: selectedFile,
        AnhDaiDien: data.anhDaiDien,
      };

      await updateMutation.mutateAsync(payload);
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
      description={`Chỉnh sửa thông số hoạt động và địa chỉ của "${data?.tenDiaDiem || ""}"`}
      icon={SquarePen}
      footer={
        <>
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={onClose}
            disabled={updateMutation.isPending || isSubmitting}
          >
            Hủy
          </Button>
          <Button
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white cursor-pointer font-medium"
            onClick={handleSubmit(onSubmit)}
            disabled={updateMutation.isPending || isSubmitting}
          >
            {updateMutation.isPending || isSubmitting ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
            ) : null}
            Cập nhật cơ sở
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
                  ...filteredParentOptions,
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

        {/* Cập nhật ảnh đại diện */}
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

          {/* Trường hợp 1: Có file ảnh mới vừa chọn -> Preview ảnh mới */}
          {previewUrl ? (
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-border/80 bg-muted/40 group shadow-2xs">
              <Image
                src={previewUrl}
                alt="Ảnh mới chọn"
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
                  onClick={handleRemoveNewFile}
                >
                  <X className="w-3.5 h-3.5 mr-1" /> Bỏ chọn ảnh mới
                </Button>
              </div>

              {/* Tag thông tin file mới */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                <div className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-xs text-[11px] text-white flex items-center gap-1.5 max-w-[80%]">
                  <span className="font-semibold text-emerald-400">Ảnh mới:</span>
                  <span className="truncate">{selectedFile?.name}</span>
                  {selectedFile && (
                    <span className="text-zinc-300 shrink-0">
                      ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleRemoveNewFile}
                  className="pointer-events-auto p-1.5 rounded-md bg-black/70 hover:bg-red-600 text-white transition-colors cursor-pointer sm:hidden"
                  title="Bỏ chọn ảnh mới"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : data?.anhDaiDien && !xoaFile ? (
            /* Trường hợp 2: Có ảnh hiện tại từ hệ thống và chưa đánh dấu xóa */
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-border/80 bg-muted/40 group shadow-2xs">
              <Image
                src={getImageUrl(data.anhDaiDien)}
                alt={data.tenDiaDiem || "Ảnh showroom"}
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
                  <Upload className="w-3.5 h-3.5 mr-1" /> Tải ảnh mới thay thế
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="h-8 text-xs cursor-pointer shadow"
                  onClick={handleDeleteExistingImage}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Xóa ảnh này
                </Button>
              </div>

              {/* Tag ảnh hiện tại */}
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-xs text-[11px] text-white flex items-center gap-1.5 pointer-events-none">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Ảnh hiện tại trên hệ thống</span>
              </div>
            </div>
          ) : xoaFile ? (
            /* Trường hợp 3: Đã chọn xóa ảnh hiện tại */
            <div className="rounded-xl border border-dashed border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20 p-4 text-center flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                  Đã đánh dấu xóa ảnh đại diện hiện tại
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Ảnh sẽ bị gỡ bỏ khi bạn lưu thay đổi. Bạn có thể tải ảnh mới hoặc hoàn tác.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs cursor-pointer border-rose-300 dark:border-rose-800"
                  onClick={handleRestoreExistingImage}
                >
                  Hoàn tác giữ lại ảnh cũ
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-7 text-xs cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-3.5 h-3.5 mr-1" /> Tải ảnh mới
                </Button>
              </div>
            </div>
          ) : (
            /* Trường hợp 4: Chưa có ảnh nào */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border/80 rounded-xl p-5 text-center hover:bg-muted/30 hover:border-primary/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <Upload className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-foreground">
                  Nhấn để tải lên ảnh đại diện showroom (PNG, JPG, WebP)
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Kích thước tối đa 5MB • Khuyến nghị ảnh phong cảnh 16:9
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Mô tả chi tiết
          </label>
          <Textarea
            {...register("moTa")}
            placeholder="Nhập mô tả..."
            className="h-24 resize-none rounded-lg text-sm"
          />
        </div>

        <div className="col-span-2 flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/20">
          <div>
            <p className="text-sm font-medium text-foreground">
              Trạng thái hoạt động
            </p>
            <p className="text-xs text-muted-foreground">
              Kích hoạt tiếp nhận đơn hàng & dịch vụ
            </p>
          </div>
          <Controller
            name="trangThai"
            control={control}
            render={({ field }) => (
              <Switch
                id="isActiveDiaDiemUpdate"
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
