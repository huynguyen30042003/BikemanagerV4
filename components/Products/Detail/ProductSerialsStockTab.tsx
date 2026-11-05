"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  Battery,
  Cpu,
  ExternalLink,
  Filter,
  QrCode,
  ShieldCheck,
  User,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { StatusBadgeInfo } from "@/hooks/DanhMucChiTiet/useDanhMucChiTietLookup";
import { SP_BienTheSanPham } from "@/types/bienTheSanPham";
import { SP_SoSerial } from "@/types/soSerial";
import { formatDateStr } from "@/components/Products/Detail/ProductDetailUtils";

export interface ProductSerialsStockTabProps {
  variants: SP_BienTheSanPham[];
  serials: SP_SoSerial[];
  selectedVariantId: string;
  setSelectedVariantId: (id: string) => void;
  selectedSerialStatusId: string;
  setSelectedSerialStatusId: (id: string) => void;
  serialStatusOptions: SelectOption[];
  isLoadingSerialStatuses?: boolean;
  getSerialStatusBadge: (statusId?: number | null) => StatusBadgeInfo;
}

export const ProductSerialsStockTab: React.FC<ProductSerialsStockTabProps> =
  React.memo(
    ({
      variants,
      serials,
      selectedVariantId,
      setSelectedVariantId,
      selectedSerialStatusId,
      setSelectedSerialStatusId,
      serialStatusOptions,
      isLoadingSerialStatuses = false,
      getSerialStatusBadge,
    }) => {
      const variantOptions = useMemo(
        () => [
          { label: "Tất cả biến thể sản phẩm", value: "" },
          ...variants.map((v) => ({
            label: `${v.tenBienThe} (${v.maSKU})`,
            value: v.bienTheSanPhamID,
          })),
        ],
        [variants],
      );

      const statusOptions = useMemo(
        () => [
          { label: "Tất cả trạng thái (DanhMucID = 12)", value: "" },
          ...serialStatusOptions.map((opt) => ({
            label: opt.label,
            value: String(opt.value),
          })),
        ],
        [serialStatusOptions],
      );

      const hasFilters = Boolean(selectedVariantId || selectedSerialStatusId);

      return (
        <div className="space-y-4">
          {/* Thanh lọc theo biến thể & trạng thái DanhMucID = 12 */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Danh sách Sản phẩm / Xe hiện có theo Số Serial ({serials.length})
              </h2>
              <p className="text-xs text-muted-foreground">
                Định danh từng chiếc xe hiện có theo Số khung (VIN), Số động cơ,
                Số Serial Pin, kho lưu trữ và trạng thái từ Danh mục chi tiết
                (DanhMucID = 12)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {variants.length > 0 && (
                <div className="w-full sm:w-64">
                  <SearchSelect
                    options={variantOptions}
                    value={selectedVariantId}
                    onChange={(val) => setSelectedVariantId(String(val ?? ""))}
                    placeholder="Lọc theo biến thể màu..."
                  />
                </div>
              )}

              <div className="w-full sm:w-60">
                <SearchSelect
                  options={statusOptions}
                  value={selectedSerialStatusId}
                  onChange={(val) =>
                    setSelectedSerialStatusId(String(val ?? ""))
                  }
                  placeholder="Lọc theo trạng thái..."
                  isLoading={isLoadingSerialStatuses}
                />
              </div>

              {hasFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedVariantId("");
                    setSelectedSerialStatusId("");
                  }}
                  className="h-9 px-3 rounded-xl text-xs cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5 mr-1" />
                  <span>Bỏ lọc</span>
                </Button>
              )}

              <Link href="/admin/product-serials">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 rounded-xl text-xs cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 mr-1.5 text-amber-600 dark:text-amber-400" />
                  <span>Quản lý Serial</span>
                  <ExternalLink className="w-3 h-3 ml-1 opacity-60" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Danh sách Số khung / Số máy / Số pin (`soSerials`) */}
          {serials.length === 0 ? (
            <Card className="rounded-2xl border border-border/80 bg-card p-10 text-center space-y-3 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                <QrCode className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Chưa có số khung / serial nào phù hợp
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                {hasFilters
                  ? "Không có xe / số serial nào khớp với bộ lọc biến thể hoặc trạng thái đang chọn."
                  : "Chưa có danh sách `soSerials` trả về từ API hoặc sản phẩm chưa được nhập số khung vào kho."}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {serials.map((serial) => {
                const badgeInfo = getSerialStatusBadge(serial.trangThaiID);

                const identityItems = [
                  {
                    id: "vin",
                    label: "Số khung (VIN)",
                    value: serial.soKhung || "-",
                    icon: QrCode,
                  },
                  {
                    id: "motor",
                    label: "Số máy / Động cơ",
                    value: serial.soMay || "-",
                    icon: Cpu,
                  },
                  {
                    id: "battery",
                    label: "Mã Serial Pin",
                    value: serial.soPin || "-",
                    icon: Battery,
                  },
                ];

                return (
                  <Card
                    key={serial.soSerialID}
                    className="p-4 rounded-2xl bg-card border border-border/80 hover:border-blue-500/40 transition-colors space-y-3 shadow-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/80">
                          {serial.maSerial}
                        </span>
                        {serial.bienSoXe && (
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                            BS: {serial.bienSoXe}
                          </span>
                        )}
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeInfo.className}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {serial.tenTrangThai || badgeInfo.label}
                      </span>
                    </div>

                    {serial.tenBienThe && (
                      <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        Phiên bản: {serial.tenBienThe}
                      </div>
                    )}

                    {/* 3 mã định danh: Số khung - Số máy - Số Pin (render qua .map()) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {identityItems.map((idItem) => {
                        const IdIcon = idItem.icon;
                        return (
                          <div
                            key={idItem.id}
                            className="p-2 rounded-lg bg-muted/25 border border-border/60"
                          >
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <IdIcon className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                              <span>{idItem.label}</span>
                            </div>
                            <div
                              className="font-mono text-xs font-bold text-foreground truncate mt-0.5"
                              title={idItem.value}
                            >
                              {idItem.value}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Thông tin Kho lưu trữ hoặc Khách hàng sở hữu */}
                    <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                      {serial.tenKho ? (
                        <span className="inline-flex items-center gap-1">
                          <Warehouse className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>
                            {serial.tenKho}
                            {serial.viTriLuuTru
                              ? ` (${serial.viTriLuuTru})`
                              : ""}
                          </span>
                        </span>
                      ) : (
                        <span>Kho: -</span>
                      )}

                      {serial.tenKhachHang && serial.khachHangID ? (
                        <Link
                          href={`/admin/customer/${serial.khachHangID}`}
                          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>KH: {serial.tenKhachHang}</span>
                        </Link>
                      ) : serial.ngayKetThucBaoHanh ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>
                            BH đến: {formatDateStr(serial.ngayKetThucBaoHanh)}
                          </span>
                        </span>
                      ) : (
                        <span>Nhập: {formatDateStr(serial.ngayNhap)}</span>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      );
    },
  );

ProductSerialsStockTab.displayName = "ProductSerialsStockTab";
