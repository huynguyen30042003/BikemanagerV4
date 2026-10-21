"use client";

import React, { Suspense, useState, useMemo, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDonHang } from "@/hooks/DonHang/useDonHang";
import { CreateDonHangPayload } from "@/types/donHang";
import { toast } from "sonner";
import {
  CartItem,
  VariantItem,
  SalesHeader,
  SalesMobileTabs,
  SalesCatalog,
  SalesCart,
  SalesFloatingCheckoutBar,
} from "@/components/Sales";

function SalesContent() {
  // Mobile tab state: "catalog" (chọn sản phẩm) hoặc "cart" (giỏ hàng & thanh toán)
  const [mobileTab, setMobileTab] = useState<"catalog" | "cart">("catalog");

  // State tìm kiếm và lọc danh mục
  const [filterText, setFilterText] = useState("");
  const [selectedCategoryTab, setSelectedCategoryTab] = useState("all");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedKhoId, setSelectedKhoId] = useState("");
  const [selectedDiaDiemId, setSelectedDiaDiemId] = useState("");

  // State giỏ hàng & thanh toán
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [registrationFee, setRegistrationFee] = useState(0);
  const [paymentMethodId, setPaymentMethodId] = useState("78"); // Mặc định tiền mặt
  const [receivedCash, setReceivedCash] = useState<number | "">(""); // Tiền khách đưa
  const [saleDate, setSaleDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  // Hook quản lý đơn hàng & biến thể sản phẩm (BienTheSanPhamApi/Gets đã có đầy đủ tồn kho theo KhoID)
  const {
    customerOptions,
    isLoadingCustomers,
    khoOptions,
    isLoadingKhos,
    diaDiemOptions,
    isLoadingDiaDiems,
    variantOptions,
    isLoadingVariants,
    refetchVariants,
    isFetchingVariants,
    paymentMethodOptions,
    setDataCreate,
    handleSubmitCreate,
    isCreating,
    refetch,
    isFetching,
    categoryOptions,
    isLoadingCategories,
  } = useDonHang({
    KhoID: selectedKhoId || undefined,
    DanhMucChiTietID:
      selectedCategoryTab !== "all" ? Number(selectedCategoryTab) : null,
    waitForKho: true,
  });

  // Tự động gán Kho xuất mặc định
  useEffect(() => {
    if (!selectedKhoId && khoOptions.length > 0) {
      setSelectedKhoId(String(khoOptions[0].value));
    }
  }, [khoOptions, selectedKhoId]);

  // Tự động gán Cơ sở Showroom mặc định
  useEffect(() => {
    if (!selectedDiaDiemId && diaDiemOptions.length > 0) {
      setSelectedDiaDiemId(String(diaDiemOptions[0].value));
    }
  }, [diaDiemOptions, selectedDiaDiemId]);

  // 1. Lấy danh mục sản phẩm động từ useDanhMucChiTietLookup (DANH_MUC_CHUNG.NGANH_HANG)
  const categorySelectOptions = useMemo(() => {
    const list = categoryOptions || [];
    return [
      { value: "all", label: "Tất cả danh mục" },
      ...list.map((c) => ({
        value: String(c.value),
        label: c.label,
      })),
    ];
  }, [categoryOptions]);

  // 2. Lọc sản phẩm theo từ khóa tìm kiếm (Danh mục đã được lọc trực tiếp qua API BienTheSanPhamApi/Gets qua DanhMucChiTietID)
  const filteredVariants = useMemo(() => {
    let list = (variantOptions as VariantItem[]) || [];

    // Lọc theo từ khóa tìm kiếm
    if (filterText.trim()) {
      const lower = filterText.toLowerCase();
      list = list.filter(
        (v) =>
          v.name?.toLowerCase().includes(lower) ||
          v.sku?.toLowerCase().includes(lower),
      );
    }

    return list;
  }, [variantOptions, filterText]);

  // Thao tác giỏ hàng có kiểm tra tồn kho
  const addToCart = (v: VariantItem) => {
    const available = v.soLuongKhaDung ?? v.soLuongTon;

    // Kiểm tra hết hàng tại kho
    if (available !== undefined && available <= 0) {
      toast.error(`Sản phẩm "${v.name}" đã hết hàng trong kho được chọn!`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((i) => i.bienTheSanPhamID === v.value);
      if (existing) {
        if (available !== undefined && existing.soLuong >= available) {
          toast.warning(`Kho chỉ còn khả dụng ${available} sản phẩm!`);
          return prev;
        }

        toast.info(`Tăng số lượng: ${v.name}`);
        return prev.map((i) =>
          i.bienTheSanPhamID === v.value
            ? {
                ...i,
                soLuong: i.soLuong + 1,
                thanhTien: (i.soLuong + 1) * i.donGia,
              }
            : i,
        );
      }

      toast.success(`Đã thêm vào giỏ: ${v.name}`);
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
            const itemInWarehouse = (variantOptions as VariantItem[]).find(
              (w) => w.value === id,
            );
            const available =
              itemInWarehouse?.soLuongKhaDung ?? itemInWarehouse?.soLuongTon;

            if (
              delta > 0 &&
              available !== undefined &&
              i.soLuong + delta > available
            ) {
              toast.warning(`Kho chỉ còn khả dụng ${available} sản phẩm!`);
              return i;
            }

            const nextQty = Math.max(0, i.soLuong + delta);
            return {
              ...i,
              soLuong: nextQty,
              thanhTien: nextQty * i.donGia,
            };
          }
          return i;
        })
        .filter((i) => i.soLuong > 0),
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.bienTheSanPhamID !== id));
  };

  const handleClearCart = () => {
    if (confirm("Bạn có chắc chắn muốn làm mới toàn bộ giỏ hàng này?")) {
      setCart([]);
    }
  };

  // Tính toán số tiền
  const subTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.thanhTien, 0),
    [cart],
  );

  const grandTotal = useMemo(
    () =>
      Math.max(0, subTotal - discountAmount + deliveryFee + registrationFee),
    [subTotal, discountAmount, deliveryFee, registrationFee],
  );

  const totalItemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.soLuong, 0),
    [cart],
  );

  // Tính tiền thừa thối lại cho khách
  const changeMoney = useMemo(() => {
    if (typeof receivedCash !== "number" || receivedCash <= 0) return 0;
    return receivedCash - grandTotal;
  }, [receivedCash, grandTotal]);

  // Chọn khách hàng vãng lai tại quầy
  const handleSelectWalkInCustomer = () => {
    if (customerOptions.length > 0) {
      const firstId = String(customerOptions[0].value);
      setSelectedCustomerId(firstId);
      setDataCreate((prev) => ({ ...prev, KhachHangID: firstId }));
      toast.info("Đã chọn khách hàng vãng lai tại quầy");
    }
  };

  // Hoàn tất đơn hàng POS
  const handleCheckout = async () => {
    if (!selectedCustomerId) {
      toast.warning("Vui lòng chọn khách hàng thanh toán!");
      if (window.innerWidth < 1024) setMobileTab("cart");
      return;
    }
    if (cart.length === 0) {
      toast.warning("Giỏ hàng đang trống! Vui lòng chọn sản phẩm.");
      if (window.innerWidth < 1024) setMobileTab("catalog");
      return;
    }

    const khoId = selectedKhoId || (khoOptions[0]?.value as string) || "";
    if (!khoId) {
      toast.warning("Vui lòng chọn kho hàng xuất!");
      return;
    }

    const diaDiemId =
      selectedDiaDiemId || (diaDiemOptions[0]?.value as string) || "";

    const actualPaid =
      typeof receivedCash === "number" && receivedCash > 0
        ? Math.min(receivedCash, grandTotal)
        : grandTotal;

    const payload: CreateDonHangPayload = {
      KhachHangID: selectedCustomerId,
      KhoXuatID: khoId,
      DiaDiemID: diaDiemId,
      LoaiDonHangID: 87, // Bán lẻ tại quầy
      TrangThaiDonHangID: 72, // Hoàn thành ngay tại quầy
      TrangThaiThanhToanID: 83,
      NgayBan: saleDate || null,
      TamTinh: subTotal,
      TienGiamGia: discountAmount,
      PhiVanChuyen: deliveryFee,
      PhiDichVuBienSo: registrationFee,
      TongTien: grandTotal,
      DaThanhToan: actualPaid,
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
      await handleSubmitCreate(undefined, payload);
      setCart([]);
      setDiscountAmount(0);
      setDeliveryFee(0);
      setRegistrationFee(0);
      setReceivedCash("");
      refetchVariants(); // Tự động làm mới số lượng biến thể sau khi xuất bán
      toast.success("Xuất hóa đơn bán lẻ POS thành công!");
    } catch {
      // error handled in hook
    }
  };

  const handleRefreshAll = () => {
    refetch();
    refetchVariants();
  };

  return (
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-4 sm:space-y-6 max-w-[1700px] mx-auto min-w-0 pb-20 sm:pb-6">
      {/* 1. Header Section */}
      <SalesHeader
        isFetching={isFetching || isFetchingVariants}
        onRefresh={handleRefreshAll}
        hasCartItems={cart.length > 0}
        onClearCart={handleClearCart}
      />

      {/* 2. Mobile View Switcher */}
      <SalesMobileTabs
        mobileTab={mobileTab}
        onTabChange={setMobileTab}
        totalItemCount={totalItemCount}
      />

      {/* 3. Main Sales Workspace (2 Columns on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Product Catalog from Warehouse Inventory (7 cols) */}
        <SalesCatalog
          mobileTab={mobileTab}
          categoryOptions={categorySelectOptions}
          isLoadingCategories={isLoadingCategories}
          selectedCategoryTab={selectedCategoryTab}
          onCategoryTabChange={setSelectedCategoryTab}
          filterText={filterText}
          onFilterTextChange={setFilterText}
          selectedDiaDiemId={selectedDiaDiemId}
          onDiaDiemChange={setSelectedDiaDiemId}
          diaDiemOptions={diaDiemOptions}
          isLoadingDiaDiems={isLoadingDiaDiems}
          selectedKhoId={selectedKhoId}
          onKhoChange={(val) => {
            setSelectedKhoId(val);
          }}
          khoOptions={khoOptions}
          isLoadingKhos={isLoadingKhos}
          filteredVariants={filteredVariants}
          isLoadingVariants={isLoadingVariants}
          cart={cart}
          onAddToCart={addToCart}
        />

        {/* RIGHT COLUMN: Checkout & Cart (5 cols) */}
        <SalesCart
          mobileTab={mobileTab}
          selectedCustomerId={selectedCustomerId}
          onCustomerChange={(id) => {
            setSelectedCustomerId(id);
            setDataCreate((prev) => ({ ...prev, KhachHangID: id }));
          }}
          customerOptions={customerOptions}
          isLoadingCustomers={isLoadingCustomers}
          onSelectWalkInCustomer={handleSelectWalkInCustomer}
          cart={cart}
          totalItemCount={totalItemCount}
          onUpdateQuantity={updateQuantity}
          onRemoveFromCart={removeFromCart}
          onClearCart={() => setCart([])}
          subTotal={subTotal}
          discountAmount={discountAmount}
          onDiscountChange={setDiscountAmount}
          deliveryFee={deliveryFee}
          onDeliveryFeeChange={setDeliveryFee}
          registrationFee={registrationFee}
          onRegistrationFeeChange={setRegistrationFee}
          grandTotal={grandTotal}
          receivedCash={receivedCash}
          onReceivedCashChange={setReceivedCash}
          changeMoney={changeMoney}
          onQuickCash={setReceivedCash}
          paymentMethodId={paymentMethodId}
          onPaymentMethodChange={setPaymentMethodId}
          paymentMethodOptions={paymentMethodOptions}
          saleDate={saleDate}
          onSaleDateChange={setSaleDate}
          isCreating={isCreating}
          onCheckout={handleCheckout}
        />
      </div>

      {/* 4. Floating Checkout Bar on Mobile */}
      {mobileTab === "catalog" && cart.length > 0 && (
        <SalesFloatingCheckoutBar
          totalItemCount={totalItemCount}
          grandTotal={grandTotal}
          onOpenCart={() => setMobileTab("cart")}
        />
      )}
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
