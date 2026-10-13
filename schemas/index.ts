import { z } from "zod";

// ─── Category ────────────────────────────────────────────────────────────────
export const categorySchema = z.object({
  parentId: z.string().uuid().nullable().optional(),
  name: z.string().min(1, "Tên danh mục là bắt buộc"),
  slug: z.string().min(1, "Slug là bắt buộc"),
  imageUrl: z.string().url("URL không hợp lệ").nullable().optional(),
  description: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

// ─── Product ─────────────────────────────────────────────────────────────────
export const productSchema = z.object({
  categoryId: z.string().uuid("Vui lòng chọn danh mục"),
  brandId: z.string().uuid("Vui lòng chọn thương hiệu"),
  name: z.string().min(1, "Tên sản phẩm là bắt buộc").max(255),
  slug: z.string().min(1, "Slug là bắt buộc").max(255),
  shortDescription: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  thumbnail: z.instanceof(File).nullable().optional(),
  isPublished: z.boolean().default(false),
});

export type ProductFormValues = z.infer<typeof productSchema>;

// ─── Product Variant ─────────────────────────────────────────────────────────
export const productVariantSchema = z.object({
  color: z.string().nullable().optional(),
  battery: z.string().nullable().optional(),
  motorPower: z.string().nullable().optional(),
  importPrice: z.coerce.number().min(0, "Giá nhập >= 0"),
  sellingPrice: z.coerce.number().min(0, "Giá bán >= 0"),
  wholesalePrice: z.coerce.number().min(0, "Giá sỉ >= 0"),
  stockQuantity: z.coerce.number().int().min(0, "Số lượng >= 0"),
  warrantyMonths: z.coerce.number().int().min(0, "Bảo hành >= 0"),
});

export type ProductVariantFormValues = z.infer<typeof productVariantSchema>;

// ─── Serial Number ────────────────────────────────────────────────────────────
export const serialNumberSchema = z.object({
  frameNumber: z.string().nullable().optional(),
  engineNumber: z.string().nullable().optional(),
  batterySerial: z.string().nullable().optional(),
  motorSerial: z.string().nullable().optional(),
  qrCode: z.string().nullable().optional(),
  manufacturingDate: z.string().nullable().optional(),
  importDate: z.string().nullable().optional(),
  warrantyStart: z.string().nullable().optional(),
  warrantyEnd: z.string().nullable().optional(),
  currentStatus: z
    .enum(["IN_STOCK", "SOLD"])
    .nullable()
    .optional(),
  warehouseId: z.string().uuid().nullable().optional(),
});

export type SerialNumberFormValues = z.infer<typeof serialNumberSchema>;

// ─── Create Product (full form: product + variant + serial) ──────────────────
export const createProductFullSchema = z.object({
  product: productSchema,
  variant: productVariantSchema,
  serial: serialNumberSchema,
});

export type CreateProductFullFormValues = z.infer<typeof createProductFullSchema>;