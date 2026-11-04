"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useGetKhachHangById } from "@/hooks/KhachHang/useKhachHangApi";
import { useGetThongKeKhachHangById } from "@/hooks/ThongKeKhachHang/useThongKeKhachHangApi";
import { useGetPhuongTienKhachHang } from "@/hooks/PhuongTienKhachHang/usePhuongTienKhachHangApi";
import {
  useGetBaoHanh,
  useGetPhieuBaoHanh,
} from "@/hooks/BaoHanh/useBaoHanhApi";
import { useGetDonHang } from "@/hooks/DonHang/useDonHangApi";
import { KH_KhachHang } from "@/types/khachHang";
import { KH_ThongKeKhachHang } from "@/types/thongKeKhachHang";
import { KH_PhuongTienKhachHang } from "@/types/phuongTienKhachHang";
import { BH_BaoHanh, BH_PhieuBaoHanh } from "@/types/baoHanh";
import { DH_DonHang } from "@/types/donHang";
import {
  DetailTabKey,
  EnrichedCustomerVehicle,
  getWarrantyTimeStatus,
} from "@/components/Customer/Detail/CustomerDetailUtils";

export function useCustomerDetail(
  khachHangId: string,
  isAdminMode: boolean = false,
) {
  const [activeTab, setActiveTab] = useState<DetailTabKey>("vehicles-warranty");
  const [previewPublic, setPreviewPublic] = useState<boolean>(!isAdminMode);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  // 1. Thông tin hồ sơ khách hàng
  const { data: rawCustomer, isLoading: isLoadingCustomer } =
    useGetKhachHangById(khachHangId);
  const customer: KH_KhachHang | null = useMemo(
    () => (rawCustomer?.data ?? null) as KH_KhachHang | null,
    [rawCustomer],
  );

  // 2. Thống kê hạng thẻ & điểm tích lũy
  const { data: rawStats, isLoading: isLoadingStats } =
    useGetThongKeKhachHangById(khachHangId);
  const stats: KH_ThongKeKhachHang | null = useMemo(
    () => (rawStats?.data ?? null) as KH_ThongKeKhachHang | null,
    [rawStats],
  );

  // 3. Danh sách phương tiện thuộc sở hữu của khách
  const { data: rawVehicles, isLoading: isLoadingVehicles } =
    useGetPhuongTienKhachHang({
      KhachHangID: khachHangId,
      PageIndex: 1,
      PageSize: 50,
    });
  const vehicles: KH_PhuongTienKhachHang[] = useMemo(
    () => (rawVehicles?.data ?? []) as KH_PhuongTienKhachHang[],
    [rawVehicles],
  );

  // 4. Danh sách sổ bảo hành điện tử của khách
  const { data: rawWarranties, isLoading: isLoadingWarranties } = useGetBaoHanh(
    {
      KhachHangID: khachHangId,
      PageIndex: 1,
      PageSize: 50,
    },
  );
  const warranties: BH_BaoHanh[] = useMemo(
    () => (rawWarranties?.data ?? []) as BH_BaoHanh[],
    [rawWarranties],
  );

  // 5. Danh sách phiếu tiếp nhận bảo hành (Lịch sử bảo hành)
  const { data: rawClaims, isLoading: isLoadingClaims } = useGetPhieuBaoHanh({
    KhachHangID: khachHangId,
    PageIndex: 1,
    PageSize: 50,
  });
  const warrantyClaims: BH_PhieuBaoHanh[] = useMemo(
    () => (rawClaims?.data ?? []) as BH_PhieuBaoHanh[],
    [rawClaims],
  );

  // 6. Danh sách đơn hàng đã mua
  const { data: rawOrders, isLoading: isLoadingOrders } = useGetDonHang({
    KhachHangID: khachHangId,
    PageIndex: 1,
    PageSize: 50,
  });
  const orders: DH_DonHang[] = useMemo(
    () => (rawOrders?.data ?? []) as DH_DonHang[],
    [rawOrders],
  );

  // Ghép nối từng chiếc xe với Sổ bảo hành và Lịch sử phiếu bảo hành tương ứng
  const enrichedVehicles: EnrichedCustomerVehicle[] = useMemo(() => {
    return vehicles.map((v) => {
      const matchedWarranty = warranties.find(
        (w) =>
          (w.phuongTienKhachHangID && w.phuongTienKhachHangID === v.id) ||
          (w.soSerialID && v.soSerialID && w.soSerialID === v.soSerialID) ||
          (w.soKhung && v.soKhung && w.soKhung === v.soKhung) ||
          (w.bienSoXe && v.bienSo && w.bienSoXe === v.bienSo),
      );

      const matchedClaims = warrantyClaims.filter(
        (c) =>
          (matchedWarranty && c.baoHanhID === matchedWarranty.baoHanhID) ||
          (v.soSerialID && c.soSerialID === v.soSerialID) ||
          (v.soKhung && c.soKhung === v.soKhung),
      );

      return {
        vehicle: v,
        warranty: matchedWarranty ?? null,
        claims: matchedClaims,
      };
    });
  }, [vehicles, warranties, warrantyClaims]);

  // Các sổ bảo hành độc lập (chưa gắn vào bản ghi PhuongTienKhachHang cụ thể)
  const standaloneWarranties: BH_BaoHanh[] = useMemo(() => {
    const matchedIds = new Set(
      enrichedVehicles
        .map((ev) => ev.warranty?.baoHanhID)
        .filter(Boolean) as string[],
    );
    return warranties.filter((w) => !matchedIds.has(w.baoHanhID));
  }, [warranties, enrichedVehicles]);

  const activeWarrantiesCount: number = useMemo(() => {
    return warranties.filter(
      (w) =>
        getWarrantyTimeStatus(w.ngayBatDau, w.ngayKetThuc).status !== "expired",
    ).length;
  }, [warranties]);

  const handleCopyPublicLink = useCallback(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const publicUrl = `${origin}/khach-hang/${khachHangId}`;
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    toast.success("Đã sao chép đường dẫn Public View cho khách hàng!");
    if (copyTimerRef.current) {
      clearTimeout(copyTimerRef.current);
    }
    copyTimerRef.current = setTimeout(() => {
      setCopiedLink(false);
    }, 2000);
  }, [khachHangId]);

  return {
    activeTab,
    setActiveTab,
    previewPublic,
    setPreviewPublic,
    copiedLink,
    handleCopyPublicLink,

    customer,
    isLoadingCustomer,
    stats,
    isLoadingStats,

    vehicles,
    isLoadingVehicles,
    warranties,
    isLoadingWarranties,
    warrantyClaims,
    isLoadingClaims,
    orders,
    isLoadingOrders,

    enrichedVehicles,
    standaloneWarranties,
    activeWarrantiesCount,
  };
}

