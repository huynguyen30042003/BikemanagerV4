"use client";

import React, { Suspense, useState, useMemo, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDonHang } from "@/hooks/DonHang/useDonHang";
import { CreateDonHangPayload, SerialKhaDungBanHang } from "@/types/donHang";
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
import { format } from "date-fns";

function SalesContent() {
  // Mobile tab state: "catalog" (chọn sản phẩm) hoặc "cart" (giỏ hàng & thanh toán)
  const [mobileTab, setMobileTab] = useState<"catalog" | "cart">("catalog");

  // State tìm kiếm và lọc danh mục
  const [filterText, setFilterText] = useState("");
  const [selectedCategoryTab, setSelectedCategoryTab] = useState("all");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedKhoId, setSelectedKhoId] = useState("");
  const [selectedDiaDiemId, setSelectedDiaDiemId] = useState("");

  // State giao nhận & ghi chú
  const [orderNote, setOrderNote] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

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
        const nextQty = existing.soLuong + 1;
        let nextSelectedSerials = existing.selectedSerials || [];
        if (existing.quanLyTheoSerial) {
          const availableList = existing.danhSachSerialKhaDung || [];
          const unselected = availableList.filter(
            (s) =>
              !nextSelectedSerials.some(
                (cur) => cur.soSerialID === s.soSerialID,
              ),
          );
          if (unselected.length > 0) {
            nextSelectedSerials = [...nextSelectedSerials, unselected[0]];
          }
        }

        const donGia = existing.donGia;
        const tienGiamGia = existing.tienGiamGia || 0;
        const thueVAT = existing.thueVAT || 0;
        const tienThueVAT = Math.round(
          ((donGia * nextQty - tienGiamGia) * thueVAT) / 100,
        );
        const thanhTien = donGia * nextQty - tienGiamGia + tienThueVAT;

        return prev.map((i) =>
          i.bienTheSanPhamID === v.value
            ? {
                ...i,
                soLuong: nextQty,
                tienThueVAT,
                thanhTien,
                selectedSerials: nextSelectedSerials,
              }
            : i,
        );
      }

      toast.success(`Đã thêm vào giỏ: ${v.name}`);
      const donGia = v.defaultPrice || 0;
      const thueVAT = v.thueVAT || 0;
      const tienGiamGia = 0;
      const tienThueVAT = Math.round(
        ((donGia * 1 - tienGiamGia) * thueVAT) / 100,
      );
      const thanhTien = donGia * 1 - tienGiamGia + tienThueVAT;

      const initialSerials =
        v.quanLyTheoSerial &&
        v.danhSachSerialKhaDung &&
        v.danhSachSerialKhaDung.length > 0
          ? [v.danhSachSerialKhaDung[0]]
          : [];

      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          bienTheSanPhamID: v.value,
          sku: v.sku || "",
          tenBienThe: v.tenBienThe || v.name || "",
          tenSanPham: v.tenSanPham || v.name || "",
          donGia,
          soLuong: 1,
          tienGiamGia,
          thueVAT,
          tienThueVAT,
          thanhTien,
          quanLyTheoSerial: Boolean(v.quanLyTheoSerial),
          laPhuongTien: Boolean(v.laPhuongTien),
          soThangBaoHanh: v.soThangBaoHanh || 12,
          danhSachSerialKhaDung: v.danhSachSerialKhaDung || [],
          selectedSerials: initialSerials,
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
            let nextSelectedSerials = i.selectedSerials || [];
            if (i.quanLyTheoSerial) {
              if (delta > 0) {
                const availableList = i.danhSachSerialKhaDung || [];
                const unselected = availableList.filter(
                  (s) =>
                    !nextSelectedSerials.some(
                      (cur) => cur.soSerialID === s.soSerialID,
                    ),
                );
                if (unselected.length > 0) {
                  nextSelectedSerials = [...nextSelectedSerials, unselected[0]];
                }
              } else if (delta < 0 && nextSelectedSerials.length > nextQty) {
                nextSelectedSerials = nextSelectedSerials.slice(0, nextQty);
              }
            }

            const donGia = i.donGia;
            const tienGiamGia = i.tienGiamGia || 0;
            const thueVAT = i.thueVAT || 0;
            const tienThueVAT = Math.round(
              ((donGia * nextQty - tienGiamGia) * thueVAT) / 100,
            );
            const thanhTien = donGia * nextQty - tienGiamGia + tienThueVAT;

            return {
              ...i,
              soLuong: nextQty,
              tienThueVAT,
              thanhTien,
              selectedSerials: nextSelectedSerials,
            };
          }
          return i;
        })
        .filter((i) => i.soLuong > 0),
    );
  };

  const handleSelectSerial = (
    bienTheSanPhamID: string,
    slotIdx: number,
    serial: SerialKhaDungBanHang,
  ) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.bienTheSanPhamID !== bienTheSanPhamID) return item;
        const updated = [...(item.selectedSerials || [])];
        updated[slotIdx] = serial;
        return {
          ...item,
          selectedSerials: updated,
        };
      }),
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

  // Chọn khách hàng và điền thông tin người nhận
  const handleCustomerChange = (id: string) => {
    setSelectedCustomerId(id);
    setDataCreate((prev) => ({ ...prev, KhachHangID: id }));
    const customer = (
      customerOptions as Array<{
        value: string;
        label: string;
        tenKhachHang?: string;
        dienThoai?: string;
        diaChi?: string;
      }>
    ).find((c) => c.value === id);
    if (customer) {
      if (!recipientName) setRecipientName(customer.tenKhachHang || "");
      if (!recipientPhone) setRecipientPhone(customer.dienThoai || "");
      if (!deliveryAddress) setDeliveryAddress(customer.diaChi || "");
    }
  };

  // Chọn khách hàng vãng lai tại quầy
  const handleSelectWalkInCustomer = () => {
    console.log(customerOptions);

    if (customerOptions.length > 0) {
      handleCustomerChange("a200fd5a-c5cd-4576-bfc6-61aeabca9d52");
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

    // Kiểm tra số lượng serial đã chọn cho mặt hàng quản lý theo serial
    for (const item of cart) {
      if (item.quanLyTheoSerial) {
        const chosen = item.selectedSerials?.length || 0;
        if (chosen < item.soLuong) {
          toast.warning(
            `Sản phẩm "${item.tenBienThe}" yêu cầu chọn đủ ${item.soLuong} số khung/serial (hiện mới có ${chosen})!`,
          );
          if (window.innerWidth < 1024) setMobileTab("cart");
          return;
        }
      }
    }

    const selectedCustomer = (
      customerOptions as Array<{
        value: string;
        label: string;
        tenKhachHang?: string;
        dienThoai?: string;
        diaChi?: string;
      }>
    ).find((c) => c.value === selectedCustomerId);

    const actualPaid =
      typeof receivedCash === "number" && receivedCash > 0
        ? Math.min(receivedCash, grandTotal)
        : grandTotal;

    // NgayBan: ngày chọn (cho phép nhập bù) + giờ hiện tại, gửi dạng ISO UTC (vd 2024-02-15T10:30:00Z)
    const ngayBanIso = saleDate;
    const chiTiets = cart.map((i) => ({
      ID: i.id || crypto.randomUUID(),
      BienTheSanPhamID: i.bienTheSanPhamID,
      MaSKU: i.sku,
      TenSanPham: i.tenBienThe || i.tenSanPham || "",
      SoLuong: i.soLuong,
      DonGiaBan: i.donGia,
      TienGiamGia: i.tienGiamGia || 0,
      ThueVAT: i.thueVAT || 0,
      TienThueVAT: i.tienThueVAT || 0,
      ThanhTien: i.thanhTien,
      QuanLyTheoSerial: i.quanLyTheoSerial,
      LaPhuongTien: i.laPhuongTien,
      SoThangBaoHanh: i.soThangBaoHanh || 12,
      GhiChu: i.ghiChu || "",
    }));

    const serials = cart.flatMap((i) => {
      if (!i.quanLyTheoSerial || !i.selectedSerials) return [];
      return i.selectedSerials.map((s) => ({
        ChiTietDonHangID: i.id,
        BienTheSanPhamID: i.bienTheSanPhamID,
        SoSerialID: s.soSerialID,
        MaSerial: s.maSerial,
        SoKhung: s.soKhung ?? null,
        SoMay: s.soMay ?? null,
        SoPin: s.soPin ?? null,
        BienSoXe: null,
      }));
    });

    const payload: CreateDonHangPayload = {
      MaDonHang: null, // Backend tự sinh mã
      KhachHangID: selectedCustomerId,
      DiaDiemID: diaDiemId,
      KhoXuatID: khoId,
      LoaiDonHangID: 87, // Bán lẻ tại quầy
      TrangThaiDonHangID: 72, // Lưu tạm / Chờ xử lý
      TrangThaiThanhToanID: 83, // Chờ thanh toán
      NgayBan: ngayBanIso,
      TamTinh: subTotal,
      TienGiamGia: discountAmount,
      PhiVanChuyen: deliveryFee,
      PhiDichVuBienSo: registrationFee,
      TongTien: grandTotal,
      DaThanhToan: actualPaid,
      TenNguoiNhan: recipientName || selectedCustomer?.tenKhachHang || "",
      DienThoaiNguoiNhan: recipientPhone || selectedCustomer?.dienThoai || "",
      DiaChiGiaoHang: deliveryAddress || selectedCustomer?.diaChi || "",
      GhiChu: orderNote || "",
      ChiTiets: chiTiets,
      Serials: serials,
    };

    setDataCreate(payload);
    try {
      await handleSubmitCreate(undefined, payload);
      setCart([]);
      setDiscountAmount(0);
      setDeliveryFee(0);
      setRegistrationFee(0);
      setReceivedCash("");
      setOrderNote("");
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
          onCustomerChange={handleCustomerChange}
          customerOptions={customerOptions}
          isLoadingCustomers={isLoadingCustomers}
          onSelectWalkInCustomer={handleSelectWalkInCustomer}
          cart={cart}
          totalItemCount={totalItemCount}
          onUpdateQuantity={updateQuantity}
          onRemoveFromCart={removeFromCart}
          onClearCart={() => setCart([])}
          onSelectSerial={handleSelectSerial}
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
          orderNote={orderNote}
          onOrderNoteChange={setOrderNote}
          recipientName={recipientName}
          onRecipientNameChange={setRecipientName}
          recipientPhone={recipientPhone}
          onRecipientPhoneChange={setRecipientPhone}
          deliveryAddress={deliveryAddress}
          onDeliveryAddressChange={setDeliveryAddress}
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
