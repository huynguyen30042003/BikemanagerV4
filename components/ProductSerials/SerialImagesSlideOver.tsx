"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Camera,
  Upload,
  Trash2,
  Copy,
  Check,
  Eye,
  FileImage,
  Layers,
  Sparkles,
  AlertCircle,
  X,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SearchSelect } from "@/components/ui/selectSearch";
import { SP_SoSerial, SP_SoSerial_HinhAnh } from "@/types/soSerial";
import {
  useGetSoSerialHinhAnh,
  useUploadSoSerialHinhAnh,
  useDeleteSoSerialHinhAnh,
} from "@/hooks/SoSerial/useSoSerialApi";

interface SerialImagesSlideOverProps {
  open: boolean;
  onClose: () => void;
  serial: Partial<SP_SoSerial> | null;
}

const LOAI_ANH_OPTIONS = [
  { value: "1", label: "🔢 Số Khung / Số Máy / Mã Pin" },
  { value: "2", label: "🤝 Bàn giao xe cho khách hàng" },
  { value: "3", label: "🔍 Ngoại quan xe lúc bán (Trầy xước/Odo)" },
  { value: "4", label: "⚠️ Ảnh lỗi tiếp nhận bảo hành" },
  { value: "5", label: "✨ Sau sửa chữa / Thay thế hoàn thiện" },
];

export function SerialImagesSlideOver({
  open,
  onClose,
  serial,
}: SerialImagesSlideOverProps) {
  const serialId = serial?.soSerialID || "";
  const { data: images = [], isLoading, refetch } = useGetSoSerialHinhAnh(serialId);
  const uploadMutation = useUploadSoSerialHinhAnh();
  const deleteMutation = useDeleteSoSerialHinhAnh(serialId);

  const [selectedLoaiAnh, setSelectedLoaiAnh] = useState("2");
  const [ghiChu, setGhiChu] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewModalImg, setPreviewModalImg] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset when closing or opening
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((f) => URL.createObjectURL(f));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveSelectedFile = (idx: number) => {
    URL.revokeObjectURL(previews[idx]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpload = async () => {
    if (!serialId) {
      toast.error("Không xác định được số Serial thiết bị!");
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error("Vui lòng chọn ít nhất một hình ảnh để tải lên!");
      return;
    }

    const formData = new FormData();
    formData.append("soSerialID", serialId);
    if (serial?.donHangID) {
      formData.append("donHangID", serial.donHangID);
    }
    formData.append("loaiAnhID", selectedLoaiAnh);
    if (ghiChu.trim()) {
      formData.append("ghiChu", ghiChu.trim());
    }

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      await uploadMutation.mutateAsync(formData);
      // Clean up
      previews.forEach((p) => URL.revokeObjectURL(p));
      setSelectedFiles([]);
      setPreviews([]);
      setGhiChu("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      // error handled by mutation
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa hình ảnh này khỏi hồ sơ thiết bị?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleCopyLink = (url: string, id: string) => {
    const fullUrl = url.startsWith("http")
      ? url
      : `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    toast.success("Đã sao chép link ảnh vào bộ nhớ tạm!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredImages = images.filter((img) => {
    if (filterType === "all") return true;
    return img.loaiAnhID.toString() === filterType;
  });

  const getLoaiBadge = (loaiId: number) => {
    switch (loaiId) {
      case 1:
        return { label: "Số khung / Pin", color: "bg-blue-500/10 text-blue-600 border-blue-200" };
      case 2:
        return { label: "Bàn giao xe", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200" };
      case 3:
        return { label: "Ngoại quan lúc bán", color: "bg-amber-500/10 text-amber-600 border-amber-200" };
      case 4:
        return { label: "Lỗi bảo hành", color: "bg-rose-500/10 text-rose-600 border-rose-200" };
      case 5:
        return { label: "Sau sửa chữa", color: "bg-purple-500/10 text-purple-600 border-purple-200" };
      default:
        return { label: "Ảnh xe", color: "bg-muted text-foreground border-border" };
    }
  };

  return (
    <>
      <SlideOver
        open={open}
        onClose={onClose}
        maxWidth="2xl"
        icon={Camera}
        title={
          <div className="flex items-center gap-2">
            <span>Hồ sơ Hình ảnh Xe & Thiết bị</span>
            <Badge variant="outline" className="font-mono text-xs">
              {serial?.maSerial}
            </Badge>
          </div>
        }
        description={
          <div>
            <span>{serial?.tenSanPham || serial?.tenBienThe || "Sản phẩm"}</span>
            {serial?.soKhung && (
              <span className="ml-2 font-mono text-xs text-muted-foreground">
                (Số khung: {serial.soKhung})
              </span>
            )}
          </div>
        }
      >
        <div className="space-y-6">
          {/* 1. KHU VỰC TẢI LÊN HÌNH ẢNH MỚI */}
          <div className="p-4 bg-muted/40 border border-border/80 rounded-xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                <Upload className="w-4 h-4 text-primary" />
                <span>Tải lên hình ảnh mới cho thiết bị</span>
              </h4>
              <span className="text-xs text-muted-foreground">
                Hỗ trợ JPG, PNG, WEBP tối đa 10MB
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Phân loại hình ảnh <span className="text-destructive">*</span>
                </label>
                <SearchSelect
                  options={LOAI_ANH_OPTIONS}
                  value={selectedLoaiAnh}
                  onChange={(val) => setSelectedLoaiAnh(String(val))}
                  placeholder="Chọn loại hình ảnh..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Ghi chú hiện trạng / Vị trí
                </label>
                <Input
                  value={ghiChu}
                  onChange={(e) => setGhiChu(e.target.value)}
                  placeholder="VD: Odo 5km, xước nhẹ yếm phải lúc giao..."
                  className="h-10 text-xs"
                />
              </div>
            </div>

            {/* Drag & drop upload area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 rounded-xl p-5 text-center cursor-pointer transition-colors space-y-2"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-foreground">
                Nhấn để chọn ảnh hoặc mở camera chụp trực tiếp
              </p>
              <p className="text-[11px] text-muted-foreground">
                Có thể chọn nhiều ảnh cùng lúc để đính kèm vào số serial này
              </p>
            </div>

            {/* Danh sách ảnh tạm đang chuẩn bị upload */}
            {previews.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span>Ảnh đã chọn ({previews.length}):</span>
                  <button
                    type="button"
                    onClick={() => {
                      previews.forEach((p) => URL.revokeObjectURL(p));
                      setSelectedFiles([]);
                      setPreviews([]);
                    }}
                    className="text-destructive hover:underline text-xs"
                  >
                    Xóa tất cả
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {previews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-background"
                    >
                      <Image
                        src={preview}
                        alt={`Preview ${index}`}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSelectedFile(index);
                        }}
                        className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-90 hover:opacity-100 hover:bg-destructive transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={uploadMutation.isPending}
                  className="w-full text-xs font-medium h-9 gap-1.5"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang tải lên hệ thống...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Lưu {selectedFiles.length} ảnh vào hồ sơ Serial</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* 2. BỘ LỌC PHÂN LOẠI ALBUM ẢNH */}
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Thư viện ảnh đã lưu ({images.length})
              </h3>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant={filterType === "all" ? "default" : "ghost"}
                size="sm"
                className="h-7 text-xs px-2.5"
                onClick={() => setFilterType("all")}
              >
                Tất cả
              </Button>
              <Button
                variant={filterType === "2" ? "default" : "ghost"}
                size="sm"
                className="h-7 text-xs px-2.5"
                onClick={() => setFilterType("2")}
              >
                Bàn giao
              </Button>
              <Button
                variant={filterType === "1" ? "default" : "ghost"}
                size="sm"
                className="h-7 text-xs px-2.5"
                onClick={() => setFilterType("1")}
              >
                Số khung/Pin
              </Button>
              <Button
                variant={filterType === "4" ? "default" : "ghost"}
                size="sm"
                className="h-7 text-xs px-2.5"
                onClick={() => setFilterType("4")}
              >
                Bảo hành
              </Button>
            </div>
          </div>

          {/* 3. DANH SÁCH ẢNH ĐÃ LƯU TRÊN HỆ THỐNG */}
          {isLoading ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground text-xs gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-primary" />
              <span>Đang tải danh sách ảnh...</span>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center p-8 bg-muted/20 border border-dashed border-border rounded-xl space-y-2">
              <FileImage className="w-10 h-10 text-muted-foreground/60 mx-auto" />
              <p className="text-sm font-medium text-foreground">
                Chưa có hình ảnh nào trong hồ sơ này
              </p>
              <p className="text-xs text-muted-foreground">
                Tải lên ảnh số khung, ảnh hiện trạng trầy xước hoặc ảnh bàn giao xe ở trên để lưu trữ.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredImages.map((img) => {
                const badge = getLoaiBadge(img.loaiAnhID);
                return (
                  <div
                    key={img.id}
                    className="group bg-card border border-border/80 hover:border-primary/50 rounded-xl overflow-hidden shadow-2xs hover:shadow-sm transition-all flex flex-col"
                  >
                    {/* Thumbnail Image */}
                    <div
                      className="relative aspect-video bg-muted/30 cursor-pointer overflow-hidden"
                      onClick={() => setPreviewModalImg(img.duongDanAnh)}
                    >
                      <Image
                        src={img.duongDanAnh}
                        alt={img.tieuDe || "Ảnh xe"}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-medium border shadow-xs backdrop-blur-xs ${badge.color}`}
                        >
                          {badge.label}
                        </Badge>
                      </div>

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <span className="p-1.5 rounded-full bg-white/20 text-white backdrop-blur-xs hover:bg-white/40">
                          <Eye className="w-4 h-4" />
                        </span>
                      </div>
                    </div>

                    {/* Meta info & Action buttons */}
                    <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-foreground line-clamp-1">
                          {img.tieuDe || "Ảnh phương tiện"}
                        </div>
                        {img.ghiChu && (
                          <p className="text-[11px] text-muted-foreground line-clamp-2">
                            {img.ghiChu}
                          </p>
                        )}
                        <p className="text-[10px] text-muted-foreground/80">
                          {new Date(img.ngayTaoLap).toLocaleString("vi-VN")}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 pt-1 border-t border-border/50">
                        {/* Nút sao chép link ảnh theo đúng yêu cầu */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyLink(img.duongDanAnh, img.id)}
                          className="h-7 text-[11px] flex-1 gap-1"
                        >
                          {copiedId === img.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600 font-medium">Đã chép link</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-muted-foreground" />
                              <span>Sao chép link</span>
                            </>
                          )}
                        </Button>

                        {/* Nút xóa ảnh */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteImage(img.id)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                          title="Xóa ảnh"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SlideOver>

      {/* Lightbox Preview Modal phóng to ảnh */}
      {previewModalImg && (
        <div
          onClick={() => setPreviewModalImg(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center">
            <button
              onClick={() => setPreviewModalImg(null)}
              className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-destructive transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative w-full h-full">
              <Image
                src={previewModalImg}
                alt="Phóng to ảnh"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
