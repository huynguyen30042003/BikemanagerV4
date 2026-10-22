"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ShieldCheck, RefreshCw, Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { useKichHoatBaoHanh, useUploadSoSerialHinhAnh } from "@/hooks/SoSerial/useSoSerialApi";
import { useDanhMucChiTietLookup } from "@/hooks/DanhMucChiTiet/useDanhMucChiTietLookup";
import { KichHoatBaoHanhPayload, SP_SoSerial } from "@/types/soSerial";

interface ActivateWarrantySlideOverProps {
  open: boolean;
  onClose: () => void;
  serial: SP_SoSerial | null;
  customerOptions: SelectOption[];
  isLoadingCustomers?: boolean;
  getSerialStatusBadge: (statusId?: number | null) => {
    bgClass: string;
    textClass: string;
    borderClass: string;
    label: string;
  };
  onSuccess?: () => void;
}

export const ActivateWarrantySlideOver: React.FC<
  ActivateWarrantySlideOverProps
> = ({
  open,
  onClose,
  serial,
  customerOptions,
  isLoadingCustomers = false,
  getSerialStatusBadge,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<KichHoatBaoHanhPayload>({
    SoSerialID: "",
    KhachHangID: "",
    DonHangID: null,
    TrangThaiDaBanID: 61,
    BienSoXe: "",
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const warrantyMutation = useKichHoatBaoHanh();
  const uploadMutation = useUploadSoSerialHinhAnh();
  const { options: imageTypeOptions } = useDanhMucChiTietLookup(25);

  useEffect(() => {
    if (open && serial) {
      setFormData({
        SoSerialID: serial.soSerialID,
        KhachHangID: serial.khachHangID || "",
        DonHangID: null,
        TrangThaiDaBanID: 61,
        BienSoXe: serial.bienSoXe || "",
      });
      setSelectedFiles([]);
      setPreviews([]);
    }
  }, [open, serial]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const newFiles = [...selectedFiles, ...filesArray];
      setSelectedFiles(newFiles);

      const newUrls = filesArray.map((f) => URL.createObjectURL(f));
      setPreviews((prev) => [...prev, ...newUrls]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async () => {
    if (!formData.KhachHangID) {
      toast.error("Vui lòng chọn khách hàng để kích hoạt bảo hành!");
      return;
    }

    try {
      await warrantyMutation.mutateAsync(formData);

      // Nếu có chọn ảnh bàn giao, upload ngay
      if (selectedFiles.length > 0 && serial?.soSerialID) {
        try {
          const banGiaoOption = imageTypeOptions.find((o) =>
            o.label.toLowerCase().includes("bàn giao")
          );
          const loaiAnhIdToSave = banGiaoOption ? String(banGiaoOption.value) : "129";

          const uploadFd = new FormData();
          uploadFd.append("soSerialID", serial.soSerialID);
          uploadFd.append("loaiAnhID", loaiAnhIdToSave);
          uploadFd.append("ghiChu", "Ảnh chụp bàn giao xe và kích hoạt bảo hành");
          selectedFiles.forEach((file) => {
            uploadFd.append("files", file);
          });
          await uploadMutation.mutateAsync(uploadFd);
        } catch {
          toast.warning("Bảo hành đã kích hoạt nhưng có lỗi khi tải lên một số ảnh.");
        }
      }

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
      title="Kích hoạt Bảo hành Điện tử"
      description="Gán chủ sở hữu phương tiện, cập nhật biển số xe và kích hoạt bảo hành theo quy định"
      icon={ShieldCheck}
      footer={
        <div className="flex items-center gap-2 w-full">
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={onClose}
            disabled={warrantyMutation.isPending || uploadMutation.isPending}
          >
            Hủy bỏ
          </Button>
          <Button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer font-semibold"
            onClick={handleSubmit}
            disabled={warrantyMutation.isPending || uploadMutation.isPending}
          >
            {warrantyMutation.isPending || uploadMutation.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
            ) : null}
            Kích hoạt bảo hành
          </Button>
        </div>
      }
    >
      <div className="space-y-4 py-1">
        {/* Card Serial đang chọn */}
        {serial && (
          <div className="p-3.5 rounded-lg border border-blue-500/30 bg-blue-500/5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
                {serial.maSerial}
              </span>
              {(() => {
                const badge = getSerialStatusBadge(serial.trangThaiID);
                return (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}
                  >
                    {badge.label}
                  </span>
                );
              })()}
            </div>
            <p className="text-xs font-semibold text-foreground">
              {serial.tenBienThe}
            </p>
            {serial.soKhung && (
              <p className="text-[11px] text-muted-foreground font-mono">
                Số khung: {serial.soKhung}
              </p>
            )}
          </div>
        )}

        {/* Chọn Khách hàng */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Chủ sở hữu / Khách hàng mua xe <span className="text-rose-500">*</span>
          </label>
          <SearchSelect
            placeholder="Chọn khách hàng theo họ tên & SĐT"
            options={customerOptions}
            value={formData.KhachHangID}
            onChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                KhachHangID: String(val || ""),
              }))
            }
            isLoading={isLoadingCustomers}
            height={10}
          />
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Tra cứu hồ sơ khách hàng đã đăng ký trong hệ thống
          </p>
        </div>

        {/* Biển số xe */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Biển số xe đăng ký (nếu có)
          </label>
          <Input
            placeholder="Ví dụ: 29-MD1 889.33"
            value={formData.BienSoXe || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                BienSoXe: e.target.value.toUpperCase(),
              }))
            }
            className="text-xs font-mono font-bold uppercase"
          />
        </div>

        {/* Ảnh bàn giao xe & Ngoại quan lúc bán */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Ảnh bàn giao & Ngoại quan xe{" "}
              <span className="text-muted-foreground font-normal">(tùy chọn)</span>
            </label>
            <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
              {selectedFiles.length} ảnh đã chọn
            </span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border border-dashed border-border hover:border-blue-500 rounded-lg p-3 text-center cursor-pointer transition-colors bg-muted/20 hover:bg-muted/40"
          >
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Camera className="w-4 h-4 text-blue-500" />
              <span>Chụp ảnh hoặc bấm để chọn ảnh xe khi bàn giao</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Ảnh công tơ mét ODO, số khung, toàn cảnh xe, trầy xước lúc bán
            </p>
          </div>

          {/* Danh sách ảnh previews */}
          {previews.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-2.5">
              {previews.map((previewUrl, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-md overflow-hidden border border-border aspect-square bg-muted"
                >
                  <Image
                    src={previewUrl}
                    alt={`Preview ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(idx);
                    }}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-black/70 hover:bg-rose-600 text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <span className="absolute bottom-1 left-1 text-[9px] bg-black/60 text-white px-1 py-0.2 rounded font-mono">
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-800 dark:text-emerald-300">
          <p className="font-semibold flex items-center gap-1 mb-0.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Kích hoạt hệ thống
          </p>
          Khi bấm xác nhận, trạng thái thiết bị sẽ tự động chuyển thành{" "}
          <strong>Đã xuất bán</strong> và hệ thống sẽ bắt đầu tính thời hạn bảo
          hành điện tử cho khách hàng.
        </div>
      </div>
    </SlideOver>
  );
};
