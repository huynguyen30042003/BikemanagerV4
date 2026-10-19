"use client";

import React, { Suspense, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchSelect } from "@/components/ui/selectSearch";
import { OrderNavTabs } from "@/components/Common/OrderNavTabs";
import { useDonHang } from "@/hooks/DonHang/useDonHang";
import {
  Store,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Search,
  User,
  CreditCard,
  Receipt,
  CheckCircle2,
  RefreshCw,
  QrCode,
  Sparkles,
  Building2,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

interface CartItem {
  bienTheSanPhamID: string;
  sku: string;
  tenBienThe: string;
  donGia: number;
  soLuong: number;
  thanhTien: number;
}

function SalesContent() {
  const {
    customerOptions,
    isLoadingCustomers,
    khoOptions,
    isLoadingKhos,
    diaDiemOptions,
    variantOptions,
    isLoadingVariants,
    paymentMethodOptions,
    dataCreate,
    setDataCreate,
    handleSubmitCreate,
    isCreating,
  } = useDonHang();

  const [filterText, setFilterText] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedKhoId, setSelectedKhoId] = useState("");
  const [selectedDiaDiemId, setSelectedDiaDiemId] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [registrationFee, setRegistrationFee] = useState(0);
  const [paymentMethodId, setPaymentMethodId] = useState("78"); // Mặc định tiền mặt

  const filteredVariants = useMemo(() => {
    if (!filterText.trim()) return variantOptions;
    const lower = filterText.toLowerCase();
    return (variantOptions as Array<{ value: string; sku?: string; name?: string; defaultPrice?: number }>).filter(
      (v) =>
        v.name?.toLowerCase().includes(lower) ||
        v.sku?.toLowerCase().includes(lower)
    );
  }, [variantOptions, filterText]);

  const addToCart = (v: { value: string; sku?: string; name?: string; defaultPrice?: number }) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.bienTheSanPhamID === v.value);
      if (existing) {
        return prev.map((i) =>
          i.bienTheSanPhamID === v.value
            ? {
                ...i,
                soLuong: i.soLuong + 1,
                thanhTien: (i.soLuong + 1) * i.donGia,
              }
            : i
        );
      }
      return [
        ...prev,
        {
          bienTheSanPhamID: v.value,
          sku: v.sku || "",
          tenBienThe: v.name || "",
          donGia: v.defaultPrice || 0,
          soLuong: 1,
          thanhTien: v.defaultPrice || 0,
        },
      ];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.bienTheSanPhamID === id) {
            const nextQty = Math.max(0, i.soLuong + delta);
            return {
              ...i,
              soLuong: nextQty,
              thanhTien: nextQty * i.donGia,
            };
          }
          return i;
        })
        .filter((i) => i.soLuong > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.bienTheSanPhamID !== id));
  };

  const subTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.thanhTien, 0),
    [cart]
  );

  const grandTotal = useMemo(
    () => Math.max(0, subTotal - discountAmount + deliveryFee + registrationFee),
    [subTotal, discountAmount, deliveryFee, registrationFee]
  );

  const handleCheckout = async () => {
    if (!selectedCustomerId) {
      toast.warning("Vui lòng chọn khách hàng thanh toán!");
      return;
    }
    if (cart.length === 0) {
      toast.warning("Giỏ hàng đang trống! Vui lòng chọn sản phẩm.");
      return;
    }

    const payload = {
      KhachHangID: selectedCustomerId,
      KhoXuatID: selectedKhoId || (khoOptions[0]?.value as string) || "",
      DiaDiemID: selectedDiaDiemId || (diaDiemOptions[0]?.value as string) || "",
      LoaiDonHangID: 87, // Bán lẻ tại quầy
      TrangThaiDonHangID: 72, // Hoàn thành ngay tại quầy
      TrangThaiThanhToanID: 83, // Đã thanh toán đủ
      TamTinh: subTotal,
      TienGiamGia: discountAmount,
      PhiVanChuyen: deliveryFee,
      PhiDichVuBienSo: registrationFee,
      TongTien: grandTotal,
      DaThanhToan: grandTotal,
      ChiTiets: cart.map((i) => ({
        BienTheSanPhamID: i.bienTheSanPhamID,
        MaSKU: i.sku,
        TenSanPham: i.tenBienThe,
        SoLuong: i.soLuong,
        DonGiaBan: i.donGia,
        TienGiamGia: 0,
        ThueVAT: 0,
        TienThueVAT: 0,
        ThanhTien: i.thanhTien,
        QuanLyTheoSerial: false,
        LaPhuongTien: false,
      })),
    };

    setDataCreate(payload);
    try {
      await handleSubmitCreate({ preventDefault: () => {} } as React.FormEvent);
      setCart([]);
      setDiscountAmount(0);
      setDeliveryFee(0);
      setRegistrationFee(0);
    } catch {
      // error handled in hook
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-[1700px] mx-auto min-h-screen">
      {/* 1. Header & Navigation */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Bán Hàng Tại Quầy & POS Showroom
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Giao diện thu ngân bán nhanh xe điện, pin, phụ tùng và xuất hóa đơn tức thì
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="pt-2">
          <OrderNavTabs activeTab="sales" />
        </div>
      </div>

      {/* 2. Main Sales Interface (2-column layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Product Selection Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-3.5">
          <Card className="p-3.5 bg-card/60 backdrop-blur-sm border-border/80 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Quét mã vạch hoặc tìm tên xe, SKU..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>

              <div className="w-full sm:w-48">
                <SearchSelect
                  placeholder="Kho xuất..."
                  options={khoOptions}
                  value={selectedKhoId}
                  onChange={(val) => setSelectedKhoId(String(val))}
                  isLoading={isLoadingKhos}
                />
              </div>
            </div>

            {/* Product Variant Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[600px] overflow-y-auto p-1 scrollbar-thin">
              {isLoadingVariants ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="p-3 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-5 w-20" />
                  </Card>
                ))
              ) : filteredVariants.length === 0 ? (
                <div className="col-span-full py-12 text-center text-muted-foreground text-xs">
                  Không tìm thấy biến thể sản phẩm nào phù hợp
                </div>
              ) : (
                (filteredVariants as Array<{ value: string; sku?: string; name?: string; defaultPrice?: number }>).map((v) => (
                  <button
                    key={v.value}
                    type="button"
                    onClick={() => addToCart(v)}
                    className="p-3 rounded-xl border border-border/70 hover:border-blue-500 bg-background/80 hover:bg-blue-500/5 transition-all text-left flex flex-col justify-between gap-2 shadow-2xs group cursor-pointer"
                  >
                    <div>
                      <span className="font-semibold text-xs text-foreground group-hover:text-blue-600 line-clamp-2">
                        {v.name}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {v.sku}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-border/50">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(v.defaultPrice)}
                      </span>
                      <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Checkout Cart & Billing (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/80 shadow-2xs space-y-3.5">
            {/* Customer selector */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-500" />
                Khách hàng mua hàng <span className="text-rose-500">*</span>
              </label>
              <SearchSelect
                placeholder="Chọn hoặc tìm khách hàng..."
                options={customerOptions}
                value={selectedCustomerId}
                onChange={(val) => setSelectedCustomerId(String(val))}
                isLoading={isLoadingCustomers}
              />
            </div>

            {/* Cart Items List */}
            <div className="space-y-2 border-y border-border/60 py-3 max-h-[300px] overflow-y-auto scrollbar-thin">
              <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                <span>Giỏ hàng ({cart.length})</span>
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCart([])}
                    className="text-rose-500 hover:underline text-[11px] cursor-pointer"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-xs flex flex-col items-center">
                  <ShoppingCart className="w-8 h-8 text-muted-foreground/40 mb-2" />
                  Chưa có sản phẩm nào trong giỏ
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.bienTheSanPhamID}
                    className="p-2 rounded-lg border border-border/70 bg-background flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{item.tenBienThe}</p>
                      <p className="text-[11px] font-mono text-muted-foreground">
                        {formatCurrency(item.donGia)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-xs"
                        onClick={() => updateQuantity(item.bienTheSanPhamID, -1)}
                        className="h-6 w-6 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-center font-mono font-bold text-xs">
                        {item.soLuong}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-xs"
                        onClick={() => updateQuantity(item.bienTheSanPhamID, 1)}
                        className="h-6 w-6 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => removeFromCart(item.bienTheSanPhamID)}
                        className="text-rose-500 h-6 w-6 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <span className="font-mono font-bold text-foreground text-right w-20 shrink-0">
                      {formatCurrency(item.thanhTien)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Calculations & Fees */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Tạm tính tiền hàng:</span>
                <span className="font-mono font-semibold text-foreground">
                  {formatCurrency(subTotal)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div>
                  <label className="block text-[10px] text-muted-foreground mb-0.5">Giảm giá (đ)</label>
                  <Input
                    type="number"
                    min={0}
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(parseInt(e.target.value) || 0)}
                    className="h-7 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-muted-foreground mb-0.5">Phí giao xe (đ)</label>
                  <Input
                    type="number"
                    min={0}
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(parseInt(e.target.value) || 0)}
                    className="h-7 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-muted-foreground mb-0.5">Phí biển số (đ)</label>
                  <Input
                    type="number"
                    min={0}
                    value={registrationFee}
                    onChange={(e) => setRegistrationFee(parseInt(e.target.value) || 0)}
                    className="h-7 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-border text-sm font-bold">
                <span className="text-foreground">Tổng thanh toán:</span>
                <span className="text-blue-600 dark:text-blue-400 font-mono text-lg">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>

            {/* Payment method selector (Dynamic) */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Phương thức thanh toán
              </label>
              <SearchSelect
                placeholder="Chọn phương thức thanh toán..."
                options={paymentMethodOptions}
                value={Number(paymentMethodId)}
                onChange={(val) => setPaymentMethodId(String(val))}
              />
            </div>

            {/* Checkout Button */}
            <Button
              type="button"
              onClick={handleCheckout}
              disabled={isCreating || cart.length === 0}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              <span>{isCreating ? "Đang xử lý xuất đơn..." : "Hoàn Tất Thanh Toán & In Hóa Đơn"}</span>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function SalesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 space-y-4 max-w-[1700px] mx-auto">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <SalesContent />
    </Suspense>
  );
}
