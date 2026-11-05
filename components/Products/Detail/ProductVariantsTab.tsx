"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Barcode,
  BatteryCharging,
  Boxes,
  ExternalLink,
  Gauge,
  ImageIcon,
  Layers,
  Palette,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SP_BienTheSanPham } from "@/types/bienTheSanPham";
import {
  formatCurrency,
  parseJsonSpecs,
  ProductDetailTabKey,
} from "@/components/Products/Detail/ProductDetailUtils";
import { takeImage } from "@/utils";

export interface ProductVariantsTabProps {
  sanPhamId: string;
  variants: SP_BienTheSanPham[];
  onFilterByVariant: (
    variantId: string,
    targetTab: ProductDetailTabKey,
  ) => void;
}

export const ProductVariantsTab: React.FC<ProductVariantsTabProps> = React.memo(
  ({ sanPhamId, variants, onFilterByVariant }) => {
    if (variants.length === 0) {
      return (
        <Card className="rounded-2xl border border-border/80 bg-card p-10 text-center space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
            <Boxes className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold text-foreground">
            Chưa có biến thể màu sắc / cấu hình pin
          </h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            Sản phẩm này chưa có danh sách biến thể (`bienThes`) trả về từ API
            hoặc chưa được khởi tạo biến thể SKU màu sắc, dung lượng pin và bảng
            giá.
          </p>
          <div className="pt-2">
            <Link href={`/admin/product-variants?productId=${sanPhamId}`}>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer rounded-xl"
              >
                <Boxes className="w-4 h-4 mr-1.5" />
                <span>Thiết lập biến thể cho sản phẩm</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Danh sách biến thể cấu hình & Bảng giá ({variants.length})
            </h2>
            <p className="text-xs text-muted-foreground">
              Chi tiết mã SKU, màu sắc, cấu hình pin/động cơ, chính sách giá và
              tồn kho từng phiên bản
            </p>
          </div>

          <Link href={`/admin/product-variants?productId=${sanPhamId}`}>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer rounded-xl text-xs h-8"
            >
              <Boxes className="w-3.5 h-3.5 mr-1.5 text-indigo-600 dark:text-indigo-400" />
              <span>Quản lý & Thêm biến thể</span>
              <ExternalLink className="w-3 h-3 ml-1 opacity-60" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {variants.map((variant) => {
            const rawImg = variant.hinhAnh || variant.anhDaiDien;
            const imgUrl = rawImg
              ? takeImage(rawImg, 480, variant.maxSize)
              : null;
            const extraAttributes = parseJsonSpecs(variant.thuocTinhJson);

            const priceBlocks = [
              {
                id: "retail",
                label: "Giá bán lẻ niêm yết",
                value: formatCurrency(variant.giaBan),
                accent: "text-blue-600 dark:text-blue-400 font-bold",
              },
              {
                id: "wholesale",
                label: "Giá bán sỉ / Đại lý",
                value: formatCurrency(variant.giaBanSi),
                accent: "text-emerald-600 dark:text-emerald-400 font-semibold",
              },
              {
                id: "import",
                label: "Giá vốn nhập kho",
                value: formatCurrency(variant.giaNhap),
                accent: "text-foreground font-semibold",
              },
              {
                id: "repair",
                label: "Giá dịch vụ thay thế",
                value:
                  variant.giaSuaChua != null
                    ? formatCurrency(variant.giaSuaChua)
                    : "-",
                accent: "text-amber-600 dark:text-amber-400 font-semibold",
              },
            ];

            const specPills = [
              {
                id: "color",
                icon: Palette,
                label: "Màu sắc",
                value: variant.mauSac || "Tiêu chuẩn",
              },
              {
                id: "battery",
                icon: BatteryCharging,
                label: "Dung lượng Pin",
                value: variant.dungLuongPin || "-",
              },
              {
                id: "motor",
                icon: Gauge,
                label: "Động cơ",
                value: variant.congSuatDongCo || "-",
              },
              {
                id: "warranty",
                icon: ShieldCheck,
                label: "Bảo hành",
                value: `${variant.soThangBaoHanh ?? 12} tháng`,
              },
            ];

            return (
              <Card
                key={variant.bienTheSanPhamID}
                className="rounded-2xl border border-border/80 bg-card hover:border-blue-500/40 transition-all p-4 space-y-3.5 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Phần đầu: Ảnh biến thể + Tên & SKU */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-20 h-20 rounded-xl bg-muted/40 border border-border/70 flex items-center justify-center overflow-hidden shrink-0">
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={variant.tenBienThe}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <Boxes className="w-7 h-7 text-muted-foreground/60" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                          SKU: {variant.maSKU}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                            variant.trangThai
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25"
                              : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/25"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              variant.trangThai
                                ? "bg-emerald-500"
                                : "bg-zinc-400"
                            }`}
                          />
                          {variant.trangThai ? "Đang mở bán" : "Ngừng bán"}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug">
                        {variant.tenBienThe}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        {variant.maVach && (
                          <span className="inline-flex items-center gap-1 font-mono bg-muted px-1.5 py-0.5 rounded border border-border/60">
                            <Barcode className="w-3 h-3" />
                            {variant.maVach}
                          </span>
                        )}

                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-medium border ${
                            variant.quanLyTheoSerial
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25"
                              : "bg-muted text-muted-foreground border-border/60"
                          }`}
                        >
                          <QrCode className="w-3 h-3" />
                          {variant.quanLyTheoSerial
                            ? "Quản lý theo Số khung / Serial"
                            : "Quản lý theo số lượng"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Thông số Màu sắc / Pin / Động cơ / Bảo hành (render qua .map()) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {specPills.map((pill) => {
                      const PillIcon = pill.icon;
                      return (
                        <div
                          key={pill.id}
                          className="p-2 rounded-xl bg-muted/30 border border-border/60"
                        >
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <PillIcon className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                            <span className="truncate">{pill.label}</span>
                          </div>
                          <div
                            className="text-xs font-semibold text-foreground truncate mt-0.5"
                            title={pill.value}
                          >
                            {pill.value}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Ma trận 4 mức giá của biến thể (render qua .map()) */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-muted/20 border border-border/60">
                    {priceBlocks.map((pb) => (
                      <div key={pb.id} className="space-y-0.5">
                        <div className="text-[11px] text-muted-foreground">
                          {pb.label}
                        </div>
                        <div className={`text-xs sm:text-sm ${pb.accent}`}>
                          {pb.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Thuộc tính mở rộng từ thuocTinhJson (nếu có) */}
                  {extraAttributes.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {extraAttributes.map((attr) => (
                        <span
                          key={attr.id}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-muted/70 text-foreground border border-border/60"
                        >
                          <strong className="font-medium text-muted-foreground">
                            {attr.label}:
                          </strong>{" "}
                          {attr.value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Chân thẻ: Tồn kho & Nút lọc nhanh Ảnh / Serial của biến thể này */}
                <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 text-xs">
                    <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-muted-foreground">Tồn kho:</span>
                    <span className="font-bold text-foreground">
                      {(variant.soLuongTon ?? 0).toLocaleString("vi-VN")}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onFilterByVariant(variant.bienTheSanPhamID, "gallery")
                      }
                      className="h-7 px-2.5 text-[11px] rounded-lg cursor-pointer"
                    >
                      <ImageIcon className="w-3 h-3 mr-1 text-sky-600 dark:text-sky-400" />
                      <span>Ảnh màu này</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onFilterByVariant(
                          variant.bienTheSanPhamID,
                          "serials-stock",
                        )
                      }
                      className="h-7 px-2.5 text-[11px] rounded-lg cursor-pointer"
                    >
                      <QrCode className="w-3 h-3 mr-1 text-amber-600 dark:text-amber-400" />
                      <span>Xe / Serial màu này</span>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  },
);

ProductVariantsTab.displayName = "ProductVariantsTab";
