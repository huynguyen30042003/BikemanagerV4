"use client";

import React, { useEffect } from "react";
import {
  User,
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  DollarSign,
  CreditCard,
  RefreshCw,
  Receipt,
  Calendar,
  Barcode,
  Truck,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchSelect } from "@/components/ui/selectSearch";
import { CartItem, formatCurrency } from "./types";
import { SerialKhaDungBanHang } from "@/types/donHang";
import DatePickerInput from "../ui/DatePickerInput";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SalesCartProps {
  mobileTab: "catalog" | "cart";
  selectedCustomerId: string;
  onCustomerChange: (val: string) => void;
  customerOptions: SelectOption[];
  isLoadingCustomers: boolean;
  onSelectWalkInCustomer: () => void;
  cart: CartItem[];
  totalItemCount: number;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveFromCart: (id: string) => void;
  onClearCart: () => void;
  onSelectSerial?: (
    bienTheSanPhamID: string,
    slotIdx: number,
    serial: SerialKhaDungBanHang,
  ) => void;
  subTotal: number;
  discountAmount: number;
  onDiscountChange: (val: number) => void;
  deliveryFee: number;
  onDeliveryFeeChange: (val: number) => void;
  registrationFee: number;
  onRegistrationFeeChange: (val: number) => void;
  grandTotal: number;
  receivedCash: number | "";
  onReceivedCashChange: (val: number | "") => void;
  changeMoney: number;
  onQuickCash: (amount: number) => void;
  paymentMethodId: string;
  onPaymentMethodChange: (val: string) => void;
  paymentMethodOptions: SelectOption[];
  saleDate: string;
  onSaleDateChange: (val: string) => void;
  orderNote?: string;
  onOrderNoteChange?: (val: string) => void;
  recipientName?: string;
  onRecipientNameChange?: (val: string) => void;
  recipientPhone?: string;
  onRecipientPhoneChange?: (val: string) => void;
  deliveryAddress?: string;
  onDeliveryAddressChange?: (val: string) => void;
  isCreating: boolean;
  onCheckout: () => void;
}

// Preset tiền mặt nhanh
const QUICK_CASH_PRESETS = [
  { label: "Đủ tiền", amount: "exact" as const },
  { label: "500k", amount: 500000 },
  { label: "1 tr", amount: 1000000 },
  { label: "2 tr", amount: 2000000 },
  { label: "5 tr", amount: 5000000 },
];

export const SalesCart: React.FC<SalesCartProps> = ({
  mobileTab,
  selectedCustomerId,
  onCustomerChange,
  customerOptions,
  isLoadingCustomers,
  onSelectWalkInCustomer,
  cart,
  totalItemCount,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onSelectSerial,
  subTotal,
  discountAmount,
  onDiscountChange,
  deliveryFee,
  onDeliveryFeeChange,
  registrationFee,
  onRegistrationFeeChange,
  grandTotal,
  receivedCash,
  onReceivedCashChange,
  changeMoney,
  onQuickCash,
  paymentMethodId,
  onPaymentMethodChange,
  paymentMethodOptions,
  saleDate,
  onSaleDateChange,
  orderNote = "",
  onOrderNoteChange,
  recipientName = "",
  onRecipientNameChange,
  recipientPhone = "",
  onRecipientPhoneChange,
  deliveryAddress = "",
  onDeliveryAddressChange,
  isCreating,
  onCheckout,
}) => {
  const [showDeliveryInfo, setShowDeliveryInfo] = React.useState(false);

  return (
    <div
      className={`${
        mobileTab === "cart" ? "block" : "hidden"
      } lg:block lg:col-span-5 space-y-3.5`}
    >
      <Card className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card shadow-xs space-y-4">
        {/* Customer Selector */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-500" />
              <span>Khách hàng thanh toán</span>
              <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={onSelectWalkInCustomer}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
            >
              Khách vãng lai
            </button>
          </div>

          <SearchSelect
            placeholder="Chọn hoặc tìm khách hàng..."
            options={customerOptions}
            value={selectedCustomerId}
            onChange={(val) => onCustomerChange(String(val || ""))}
            isLoading={isLoadingCustomers}
            height={9.5}
          />
        </div>

        {/* Cart Items List */}
        <div className="space-y-2 border-y border-border/60 py-3">
          <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
            <span>Danh sách giỏ hàng ({totalItemCount} sản phẩm)</span>
            {cart.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-rose-500 hover:underline text-[11px] cursor-pointer"
              >
                Xóa tất cả
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[260px] scrollbar-thin pr-1">
            {cart.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground text-xs flex flex-col items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-muted-foreground/30 mb-2" />
                <p className="font-medium text-foreground">
                  Giỏ hàng đang trống
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Chọn sản phẩm bên cột danh mục để thêm vào đơn
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.bienTheSanPhamID}
                  className="p-2.5 rounded-xl border border-border/70 bg-background/90 flex flex-col gap-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0 pr-1">
                      <p className="font-semibold text-foreground truncate">
                        {item.tenBienThe}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                        <span>{formatCurrency(item.donGia)}</span>
                        {item.thueVAT ? (
                          <span className="text-[10px] text-muted-foreground">
                            (VAT {item.thueVAT}%)
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          onUpdateQuantity(item.bienTheSanPhamID, -1)
                        }
                        className="h-7 w-7 rounded-lg cursor-pointer shadow-2xs"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-center font-mono font-bold text-xs">
                        {item.soLuong}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          onUpdateQuantity(item.bienTheSanPhamID, 1)
                        }
                        className="h-7 w-7 rounded-lg cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveFromCart(item.bienTheSanPhamID)}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-500/10 h-7 w-7 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <span className="font-mono font-bold text-foreground text-right w-24 shrink-0 text-xs sm:text-sm">
                      {formatCurrency(item.thanhTien)}
                    </span>
                  </div>

                  {/* Chọn số khung / serial khả dụng */}
                  {item.quanLyTheoSerial && (
                    <div className="pt-2 border-t border-dashed border-border/80 space-y-1.5 w-full">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                          <Barcode className="w-3.5 h-3.5" />
                          Số khung / Serial ({item.selectedSerials?.length || 0}
                          /{item.soLuong}):
                        </span>
                        {(!item.selectedSerials ||
                          item.selectedSerials.length < item.soLuong) && (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                            Chưa chọn đủ serial
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        {Array.from({ length: item.soLuong }).map(
                          (_, slotIdx) => {
                            const curSerial = item.selectedSerials?.[slotIdx];
                            const availableOptions = (
                              item.danhSachSerialKhaDung || []
                            ).map((s) => ({
                              value: s.soSerialID,
                              label: `Khung: ${s.soKhung || s.maSerial} ${
                                s.soMay ? `- Máy: ${s.soMay}` : ""
                              } ${s.viTriLuuTru ? `[${s.viTriLuuTru}]` : ""}`,
                            }));

                            return (
                              <div
                                key={slotIdx}
                                className="flex items-center gap-2 bg-muted/40 p-1.5 rounded-lg border border-border/60 text-[11px]"
                              >
                                <span className="text-[10px] font-mono text-muted-foreground w-12 shrink-0">
                                  Xe #{slotIdx + 1}:
                                </span>
                                <div className="flex-1 min-w-0">
                                  <SearchSelect
                                    placeholder="Chọn số khung / serial khả dụng..."
                                    options={availableOptions}
                                    value={curSerial?.soSerialID || ""}
                                    onChange={(val) => {
                                      const picked =
                                        item.danhSachSerialKhaDung?.find(
                                          (s) => s.soSerialID === val,
                                        );
                                      if (picked && onSelectSerial) {
                                        onSelectSerial(
                                          item.bienTheSanPhamID,
                                          slotIdx,
                                          picked,
                                        );
                                      }
                                    }}
                                    height={8}
                                  />
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Calculations & Fees */}
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Tạm tính tiền hàng:</span>
            <span className="font-mono font-semibold text-foreground">
              {formatCurrency(subTotal)}
            </span>
          </div>

          {/* Phụ phí & Giảm giá */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div>
              <label className="block text-[10px] uppercase font-semibold text-muted-foreground mb-1">
                Giảm giá (đ)
              </label>
              <Input
                type="number"
                min={0}
                value={discountAmount || ""}
                onChange={(e) =>
                  onDiscountChange(parseInt(e.target.value) || 0)
                }
                placeholder="0"
                className="h-8 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-semibold text-muted-foreground mb-1">
                Phí giao xe (đ)
              </label>
              <Input
                type="number"
                min={0}
                value={deliveryFee || ""}
                onChange={(e) =>
                  onDeliveryFeeChange(parseInt(e.target.value) || 0)
                }
                placeholder="0"
                className="h-8 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-semibold text-muted-foreground mb-1">
                Phí biển số (đ)
              </label>
              <Input
                type="number"
                min={0}
                value={registrationFee || ""}
                onChange={(e) =>
                  onRegistrationFeeChange(parseInt(e.target.value) || 0)
                }
                placeholder="0"
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>

          {/* Tổng thanh toán */}
          <div className="flex justify-between items-center p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <span className="text-foreground font-bold text-sm">
              Tổng thanh toán:
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-mono text-lg sm:text-xl font-black">
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </div>

        {/* Payment Method & Sale Date Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
              <span>Phương thức thanh toán</span>
            </label>
            <SearchSelect
              placeholder="Chọn phương thức thanh toán..."
              options={paymentMethodOptions}
              value={Number(paymentMethodId)}
              onChange={(val) => onPaymentMethodChange(String(val))}
              height={9.5}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>Ngày bán</span>
            </label>
            <DatePickerInput
              value={saleDate}
              onChange={onSaleDateChange}
              max={new Date()}
              placeholder="dd/MM/yyyy"
            />
          </div>
        </div>

        {/* Ghi chú đơn hàng */}
        <div>
          <label className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>Ghi chú đơn hàng</span>
          </label>
          <Textarea
            value={orderNote}
            onChange={(e) => onOrderNoteChange?.(e.target.value)}
            placeholder="Nhập ghi chú thêm (VD: Thu cũ đổi mới, tặng kèm phụ kiện, hẹn ngày lấy biển số...)"
            rows={2}
            className="text-xs resize-none"
          />
        </div>

        {/* Checkout Button */}
        <Button
          type="button"
          onClick={onCheckout}
          disabled={isCreating || cart.length === 0}
          className="w-full h-11 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
        >
          {isCreating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Đang xử lý xuất đơn...</span>
            </>
          ) : (
            <>
              <Receipt className="w-4 h-4" />
              <span>Hoàn Tất Thanh Toán & In Hóa Đơn</span>
            </>
          )}
        </Button>
      </Card>
    </div>
  );
};

export default SalesCart;
