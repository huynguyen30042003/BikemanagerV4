"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { z } from "zod";
import { toast } from "sonner";
import {
  SquarePen,
  Upload,
  AlertCircle,
  RefreshCw,
  Package,
  Plus,
  Trash2,
  Cpu,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import {
  useGetSanPhamById,
  useUpdateSanPham,
} from "@/hooks/SanPham/useSanPhamApi";
import { SP_SanPham, UpdateSanPhamPayload } from "@/types/sanPham";
import { parseJsonSpecs } from "@/components/Products/Detail/ProductDetailUtils";
import { takeImage } from "@/utils";

const sanPhamSchema = z.object({
  maSanPham: z.string().trim().min(1, "Vui lòng nhập mã sản phẩm"),
  tenSanPham: z.string().trim().min(1, "Vui lòng nhập tên sản phẩm"),
  thuongHieuID: z.string().min(1, "Vui lòng chọn thương hiệu / hãng sản xuất"),
  danhMucChiTietID: z
    .number()
    .min(1, "Vui lòng chọn ngành hàng / danh mục chi tiết"),
});

interface SpecKeyValueRow {
  id: string;
  label: string;
  value: string;
}

const toSlug = (text: string): string =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const serializeSpecRows = (rows: SpecKeyValueRow[]): string => {
  const validEntries = rows.filter((r) => r.label.trim() !== "");
  if (validEntries.length === 0) return "";
  const obj: Record<string, string> = {};
  validEntries.forEach((r) => {
    obj[r.label.trim()] = r.value.trim();
  });
  return JSON.stringify(obj);
};

interface UpdateProductSlideOverProps {
  open: boolean;
  onClose: () => void;
  product: SP_SanPham | null;
  brandOptions: SelectOption[];
  isLoadingBrands?: boolean;
  categoryOptions: SelectOption[];
  isLoadingCategories?: boolean;
  donViTinhOptions?: SelectOption[];
  isLoadingDonViTinh?: boolean;
  onSuccess?: () => void;
}

export const UpdateProductSlideOver: React.FC<UpdateProductSlideOverProps> = ({
  open,
  onClose,
  product,
  brandOptions,
  isLoadingBrands = false,
  categoryOptions,
  isLoadingCategories = false,
  donViTinhOptions = [],
  isLoadingDonViTinh = false,
  onSuccess,
}) => {
  // Lấy đầy đủ chi tiết sản phẩm (MoTa, ThongSoKyThuatJson) khi mở Modal (Lazy Query chuẩn AGENTS.md)
  const { data: fullProductDetail } = useGetSanPhamById(
    open && product?.sanPhamID ? product.sanPhamID : undefined,
  );

  const sourceProduct = fullProductDetail ?? product;

  const [formData, setFormData] = useState<UpdateSanPhamPayload>({
    SanPhamID: "",
    MaSanPham: "",
    TenSanPham: "",
    DanhMucChiTietID: 0,
    ThuongHieuID: "",
    DuongDan: "",
    DonViTinhID: null,
    MoTaNgan: "",
    MoTa: "",
    ThongSoKyThuatJson: "",
    SoThangBaoHanhMacDinh: 12,
    LaPhuongTien: false,
    DaXuatBan: true,
    TrangThai: true,
    AnhDaiDien: "",
    XoaFile: false,
    file: null,
  });

  const [specRows, setSpecRows] = useState<SpecKeyValueRow[]>([]);
  const [rawJsonMode, setRawJsonMode] = useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const updateMutation = useUpdateSanPham();

  useEffect(() => {
    if (open && sourceProduct) {
      const initialSpecJson = sourceProduct.thongSoKyThuatJson || "";
      const parsed = parseJsonSpecs(initialSpecJson);

      setFormData({
        SanPhamID: sourceProduct.sanPhamID,
        MaSanPham: sourceProduct.maSanPham || "",
        TenSanPham: sourceProduct.tenSanPham || "",
        DanhMucChiTietID: sourceProduct.danhMucChiTietID || 0,
        ThuongHieuID: sourceProduct.thuongHieuID || "",
        DuongDan: sourceProduct.duongDan || "",
        DonViTinhID: sourceProduct.donViTinhID ?? null,
        MoTaNgan: sourceProduct.moTaNgan || "",
        MoTa: sourceProduct.moTa || "",
        ThongSoKyThuatJson: initialSpecJson,
        SoThangBaoHanhMacDinh: sourceProduct.soThangBaoHanhMacDinh ?? 12,
        LaPhuongTien: sourceProduct.laPhuongTien ?? false,
        DaXuatBan: sourceProduct.daXuatBan ?? true,
        TrangThai: sourceProduct.trangThai ?? true,
        AnhDaiDien: sourceProduct.anhDaiDien || "",
        XoaFile: false,
        file: null,
      });

      setSpecRows(
        parsed.map((item, idx) => ({
          id: `row-${idx}-${Date.now()}`,
          label: item.label,
          value: item.value === "-" ? "" : item.value,
        })),
      );
      setAvatarPreview((prevUrl) => {
        if (prevUrl) URL.revokeObjectURL(prevUrl);
        return null;
      });
      setErrors({});
    }
  }, [open, sourceProduct]);

  // Chống rò rỉ bộ nhớ ObjectURL khi unmount
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const existingAvatar = sourceProduct?.anhDaiDien;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
      setFormData((prev) => ({ ...prev, file, XoaFile: true }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleClearAvatar = () => {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setFormData((prev) => ({
      ...prev,
      file: null,
      XoaFile: true,
      AnhDaiDien: "",
    }));
    setAvatarPreview(null);
  };

  const handleAddSpecRow = () => {
    setSpecRows((prev) => [
      ...prev,
      { id: `spec-${Date.now()}-${prev.length}`, label: "", value: "" },
    ]);
  };

  const handleUpdateSpecRow = (
    id: string,
    field: "label" | "value",
    val: string,
  ) => {
    setSpecRows((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, [field]: val } : r));
      setFormData((f) => ({
        ...f,
        ThongSoKyThuatJson: serializeSpecRows(next),
      }));
      return next;
    });
  };

  const handleRemoveSpecRow = (id: string) => {
    setSpecRows((prev) => {
      const next = prev.filter((r) => r.id !== id);
      setFormData((f) => ({
        ...f,
        ThongSoKyThuatJson: serializeSpecRows(next),
      }));
      return next;
    });
  };

  const handleSubmit = async () => {
    try {
      sanPhamSchema.parse({
        maSanPham: formData.MaSanPham,
        tenSanPham: formData.TenSanPham,
        thuongHieuID: formData.ThuongHieuID,
        danhMucChiTietID: Number(formData.DanhMucChiTietID),
      });

      const finalSlug =
        formData.DuongDan.trim() ||
        toSlug(formData.TenSanPham) ||
        toSlug(formData.MaSanPham);

      const finalSpecsJson = rawJsonMode
        ? formData.ThongSoKyThuatJson || ""
        : serializeSpecRows(specRows);

      setErrors({});
      await updateMutation.mutateAsync({
        ...formData,
        DuongDan: finalSlug,
        ThongSoKyThuatJson: finalSpecsJson,
      });
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Vui lòng kiểm tra lại các trường bắt buộc!");
      }
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title={`Chỉnh sửa Sản phẩm: ${formData.TenSanPham}`}
      description="Cập nhật thông tin định danh, mô tả chi tiết, thông số kỹ thuật và thiết lập kinh doanh"
      icon={SquarePen}
      footer={
        <div className="flex items-center gap-2 w-full">
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={onClose}
            disabled={updateMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-medium"
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
            ) : null}
            Lưu thay đổi
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Mã sản phẩm */}
        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Mã sản phẩm <span className="text-rose-500">*</span>
          </label>
          <Input
            value={formData.MaSanPham}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                MaSanPham: e.target.value.toUpperCase(),
              }))
            }
            className={`font-mono uppercase rounded-lg bg-background ${
              errors.maSanPham ? "border-rose-500 ring-1 ring-rose-500/20" : ""
            }`}
          />
          {errors.maSanPham && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.maSanPham}
            </p>
          )}
        </div>

        {/* Tên sản phẩm */}
        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Tên sản phẩm <span className="text-rose-500">*</span>
          </label>
          <Input
            value={formData.TenSanPham}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, TenSanPham: e.target.value }))
            }
            className={`rounded-lg bg-background ${
              errors.tenSanPham ? "border-rose-500 ring-1 ring-rose-500/20" : ""
            }`}
          />
          {errors.tenSanPham && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.tenSanPham}
            </p>
          )}
        </div>

        {/* Thương hiệu hãng */}
        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Thương hiệu hãng <span className="text-rose-500">*</span>
          </label>
          <SearchSelect
            options={brandOptions}
            value={formData.ThuongHieuID}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, ThuongHieuID: String(val) }))
            }
            placeholder="Chọn hãng sản xuất"
            isLoading={isLoadingBrands}
            height={10}
            className={
              errors.thuongHieuID
                ? "border-rose-500 ring-1 ring-rose-500/20"
                : ""
            }
          />
          {errors.thuongHieuID && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.thuongHieuID}
            </p>
          )}
        </div>

        {/* Ngành hàng / Danh mục */}
        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Ngành hàng / Danh mục <span className="text-rose-500">*</span>
          </label>
          <SearchSelect
            options={categoryOptions}
            value={formData.DanhMucChiTietID || ""}
            onChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                DanhMucChiTietID: Number(val),
              }))
            }
            placeholder="Chọn ngành hàng"
            isLoading={isLoadingCategories}
            height={10}
            className={
              errors.danhMucChiTietID
                ? "border-rose-500 ring-1 ring-rose-500/20"
                : ""
            }
          />
          {errors.danhMucChiTietID && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.danhMucChiTietID}
            </p>
          )}
        </div>

        {/* Đường dẫn Slug */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Đường dẫn Slug URL
            </label>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  DuongDan: toSlug(prev.TenSanPham || prev.MaSanPham),
                }))
              }
              className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Tạo tự động từ tên SP
            </button>
          </div>
          <Input
            value={formData.DuongDan}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, DuongDan: e.target.value }))
            }
            className="font-mono rounded-lg bg-background"
          />
          <p className="text-[11px] text-muted-foreground font-mono">
            Đường dẫn thân thiện: /san-pham/
            {formData.DuongDan || "ten-san-pham"}
          </p>
        </div>

        {/* Bảo hành mặc định */}
        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Bảo hành mặc định (tháng)
          </label>
          <Input
            type="number"
            min={0}
            value={formData.SoThangBaoHanhMacDinh}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                SoThangBaoHanhMacDinh: parseInt(e.target.value) || 0,
              }))
            }
            className="rounded-lg font-mono bg-background"
          />
        </div>

        {/* Đơn vị tính */}
        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Đơn vị tính
          </label>
          <SearchSelect
            options={donViTinhOptions}
            value={formData.DonViTinhID || ""}
            onChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                DonViTinhID: val ? Number(val) : null,
              }))
            }
            placeholder="Chọn đơn vị tính (Chiếc, Xe...)"
            isLoading={isLoadingDonViTinh}
            height={10}
          />
        </div>

        {/* Mô tả ngắn */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Mô tả ngắn (Hiển thị thẻ sản phẩm)
          </label>
          <Input
            value={formData.MoTaNgan || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, MoTaNgan: e.target.value }))
            }
            placeholder="Tóm tắt ngắn gọn đặc điểm nổi bật của dòng xe..."
            className="rounded-lg bg-background"
          />
        </div>

        {/* Mô tả chi tiết (MoTa) - Bổ sung trường bị thiếu */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Mô tả chi tiết & Đặc điểm nổi bật
          </label>
          <textarea
            rows={4}
            value={formData.MoTa || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, MoTa: e.target.value }))
            }
            placeholder="Nhập bài viết giới thiệu chi tiết về thiết kế, khả năng vận hành, công nghệ pin và chính sách bảo hành..."
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
          />
        </div>

        {/* Thông số kỹ thuật (ThongSoKyThuatJson) - Bổ sung trường bị thiếu */}
        <div className="col-span-2 flex flex-col gap-2 p-3.5 rounded-xl border border-border/80 bg-muted/15">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Bảng thông số kỹ thuật ({specRows.length})
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (rawJsonMode) {
                    const parsed = parseJsonSpecs(formData.ThongSoKyThuatJson);
                    setSpecRows(
                      parsed.map((item, idx) => ({
                        id: `row-${idx}-${Date.now()}`,
                        label: item.label,
                        value: item.value === "-" ? "" : item.value,
                      })),
                    );
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      ThongSoKyThuatJson: serializeSpecRows(specRows),
                    }));
                  }
                  setRawJsonMode((prev) => !prev);
                }}
                className="h-7 px-2 text-[11px] rounded-lg cursor-pointer"
              >
                <Code2 className="w-3 h-3 mr-1" />
                <span>{rawJsonMode ? "Nhập theo dòng" : "Sửa JSON thuần"}</span>
              </Button>

              {!rawJsonMode && (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddSpecRow}
                  className="h-7 px-2.5 text-[11px] rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  <span>Thêm thông số</span>
                </Button>
              )}
            </div>
          </div>

          {rawJsonMode ? (
            <textarea
              rows={4}
              value={formData.ThongSoKyThuatJson || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ThongSoKyThuatJson: e.target.value,
                }))
              }
              placeholder='{"Động cơ": "1500W", "Tốc độ tối đa": "70 km/h", "Quãng đường": "203 km/lần sạc"}'
              className="w-full font-mono rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
            />
          ) : specRows.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">
              Chưa có thông số kỹ thuật. Bấm <strong>+ Thêm thông số</strong> để
              khai báo Động cơ, Tốc độ tối đa, Quãng đường, Trọng lượng...
            </p>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {specRows.map((row) => (
                <div key={row.id} className="flex items-center gap-2">
                  <Input
                    value={row.label}
                    onChange={(e) =>
                      handleUpdateSpecRow(row.id, "label", e.target.value)
                    }
                    placeholder="Tên thông số (VD: Động cơ)"
                    className="h-8 text-xs bg-background flex-1"
                  />
                  <Input
                    value={row.value}
                    onChange={(e) =>
                      handleUpdateSpecRow(row.id, "value", e.target.value)
                    }
                    placeholder="Giá trị (VD: 1500W - Chống nước IP67)"
                    className="h-8 text-xs bg-background flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleRemoveSpecRow(row.id)}
                    className="h-8 w-8 text-rose-600 hover:bg-rose-500/10 shrink-0 cursor-pointer"
                    title="Xóa dòng thông số"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cập nhật ảnh đại diện */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Ảnh đại diện sản phẩm
          </label>
          <div className="p-3 rounded-xl border border-dashed border-border/80 bg-muted/20 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl border border-border/70 bg-background flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Ảnh mới"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : !formData.XoaFile && existingAvatar ? (
                <Image
                  src={takeImage(existingAvatar, 768, sourceProduct?.maxSize)}
                  alt="Ảnh hiện tại"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <Package className="w-7 h-7 text-muted-foreground/40 stroke-[1.5]" />
              )}
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-background hover:bg-muted text-xs font-medium cursor-pointer transition-colors shadow-2xs">
                  <Upload className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Chọn ảnh mới
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
                {(avatarPreview || (!formData.XoaFile && existingAvatar)) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAvatar}
                    className="h-8 px-2 text-xs text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                  >
                    Xóa ảnh hiện tại
                  </Button>
                )}
              </div>
              {avatarPreview ? (
                <p className="text-[11px] text-emerald-600 font-medium">
                  Đã chọn ảnh mới, bấm Lưu thay đổi để hoàn tất.
                </p>
              ) : formData.XoaFile ? (
                <p className="text-[11px] text-amber-600 font-medium">
                  Ảnh đại diện sẽ được gỡ bỏ sau khi lưu.
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  Chọn tệp hình ảnh mới nếu muốn thay đổi ảnh hiện tại.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Switches */}
        <div className="col-span-2 flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-muted/20">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Xe nguyên chiếc
            </p>
            <p className="text-xs text-muted-foreground">
              Tự động sinh hồ sơ phương tiện khi bán
            </p>
          </div>
          <Switch
            id="isVehicleUpdate"
            checked={formData.LaPhuongTien}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, LaPhuongTien: checked }))
            }
          />
        </div>

        <div className="col-span-2 flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-muted/20">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Niêm yết bán tại quầy
            </p>
            <p className="text-xs text-muted-foreground">
              Cho phép bán hàng tại quầy POS
            </p>
          </div>
          <Switch
            id="isPublishedUpdate"
            checked={formData.DaXuatBan}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, DaXuatBan: checked }))
            }
          />
        </div>

        <div className="col-span-2 flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-muted/20">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Trạng thái kinh doanh
            </p>
            <p className="text-xs text-muted-foreground">
              Kích hoạt sản phẩm trong toàn hệ thống
            </p>
          </div>
          <Switch
            id="isActiveSanPhamUpdate"
            checked={formData.TrangThai}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, TrangThai: checked }))
            }
          />
        </div>
      </div>
    </SlideOver>
  );
};
