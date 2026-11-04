"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
  Package,
  ShieldCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDonHangById } from "@/hooks/DonHang/useDonHangApi";
import {
  DH_DonHang,
  DH_ChiTietDonHang,
  DH_SerialXuatBan,
} from "@/types/donHang";
import {
  formatCurrency,
  formatDate,
} from "@/components/Customer/Detail/CustomerDetailUtils";

export interface OrderPurchasedItemsCardProps {
  donHang: DH_DonHang;
  defaultExpanded?: boolean;
}

export const OrderPurchasedItemsCard: React.FC<OrderPurchasedItemsCardProps> =
  React.memo(({ donHang, defaultExpanded = false }) => {
    const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

    const { data: orderDetail, isLoading } = useGetDonHangById(
      donHang.donHangID,
      expanded,
    );

    const chiTiets: DH_ChiTietDonHang[] =
      orderDetail?.chiTiets ?? donHang.chiTiets ?? [];
    const orderSerials: DH_SerialXuatBan[] =
      orderDetail?.serials ?? donHang.serials ?? [];

    return (
      <Card className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs hover:border-blue-500/30 transition-all">
        {/* Order Summary Header */}
        <div
          onClick={() => setExpanded((prev) => !prev)}
          className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-sm font-bold text-foreground">
                  #{donHang.maDonHang}
                </span>
                {donHang.tenTrangThaiDonHang && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    {donHang.tenTrangThaiDonHang}
                  </span>
                )}
                {donHang.tenTrangThaiThanhToan && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                    {donHang.tenTrangThaiThanhToan}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Ngày mua:{" "}
                    {formatDate(donHang.ngayHoanThanh || donHang.ngayTaoLap)}
                  </span>
                </span>
                {donHang.tenDiaDiem && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{donHang.tenDiaDiem}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50 shrink-0">
            <div className="text-left sm:text-right">
              <div className="text-[11px] text-muted-foreground">
                Tổng thanh toán
              </div>
              <div className="text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400 font-mono">
                {formatCurrency(donHang.tongTien)}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((prev) => !prev);
              }}
            >
              <span>{expanded ? "Thu gọn" : "Sản phẩm đã mua"}</span>
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
        </div>

        {/* Expandable Purchased Products List */}
        {expanded && (
          <div className="px-4 pb-4 pt-3 border-t border-border/60 bg-muted/20 space-y-3">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            ) : chiTiets.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2 text-center">
                Không có thông tin chi tiết mặt hàng cho đơn hàng này.
              </p>
            ) : (
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>
                    Danh sách sản phẩm & linh kiện trong đơn ({chiTiets.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {chiTiets.map((item, idx) => {
                    const itemSerials =
                      item.serials && item.serials.length > 0
                        ? item.serials
                        : orderSerials.filter(
                            (s) => s.bienTheSanPhamID === item.bienTheSanPhamID,
                          );

                    return (
                      <div
                        key={item.id || `${item.bienTheSanPhamID}-${idx}`}
                        className="rounded-lg border border-border/70 bg-card p-3 flex flex-col gap-2"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-xs sm:text-sm text-foreground">
                                {item.tenSanPham}
                              </span>
                              {item.maSKU && (
                                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/50">
                                  SKU: {item.maSKU}
                                </span>
                              )}
                              {item.laPhuongTien && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                  Phương tiện xe
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                              <span>
                                Số lượng:{" "}
                                <strong className="text-foreground">
                                  {item.soLuong}
                                </strong>{" "}
                                {item.donViTinhTen || "chiếc"}
                              </span>
                              <span>•</span>
                              <span>
                                Đơn giá: {formatCurrency(item.donGiaBan)}
                              </span>
                              {item.soThangBaoHanh > 0 && (
                                <>
                                  <span>•</span>
                                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                    <span>
                                      Bảo hành {item.soThangBaoHanh} tháng
                                    </span>
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="text-left sm:text-right font-mono text-xs sm:text-sm font-bold text-foreground shrink-0">
                            {formatCurrency(item.thanhTien)}
                          </div>
                        </div>

                        {/* Serial / Số khung của sản phẩm đã mua */}
                        {itemSerials.length > 0 && (
                          <div className="pt-2 border-t border-dashed border-border/60 flex flex-wrap gap-2">
                            {itemSerials.map((sr, sIdx) => (
                              <div
                                key={sr.soSerialID || sIdx}
                                className="inline-flex flex-wrap items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/5 border border-blue-500/20 text-[11px]"
                              >
                                <span className="font-mono font-semibold text-blue-700 dark:text-blue-300">
                                  Serial: {sr.maSerial}
                                </span>
                                {sr.soKhung && (
                                  <span className="font-mono text-muted-foreground">
                                    | Số khung:{" "}
                                    <strong className="text-foreground">
                                      {sr.soKhung}
                                    </strong>
                                  </span>
                                )}
                                {sr.soMay && (
                                  <span className="font-mono text-muted-foreground">
                                    | Số máy:{" "}
                                    <strong className="text-foreground">
                                      {sr.soMay}
                                    </strong>
                                  </span>
                                )}
                                {sr.bienSoXe && (
                                  <span className="font-mono px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold">
                                    BS: {sr.bienSoXe}
                                  </span>
                                )}
                                {sr.ngayKetThucBaoHanh && (
                                  <span className="text-emerald-600 dark:text-emerald-400">
                                    (BH đến:{" "}
                                    {formatDate(sr.ngayKetThucBaoHanh)})
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    );
  });

OrderPurchasedItemsCard.displayName = "OrderPurchasedItemsCard";

