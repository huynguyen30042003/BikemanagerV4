"use client";

import { useState, useMemo } from "react";
import { useGetSanPhamById } from "@/hooks/SanPham/useSanPhamApi";
import { useDanhMucChiTietLookup } from "@/hooks/DanhMucChiTiet/useDanhMucChiTietLookup";
import { DANH_MUC_CHUNG } from "@/constants/danhMuc";
import { SP_BienTheSanPham } from "@/types/bienTheSanPham";
import { SP_HinhAnhSanPham } from "@/types/hinhAnhSanPham";
import { SP_SoSerial } from "@/types/soSerial";
import { SP_ThuongHieu } from "@/types/thuongHieu";
import {
  parseJsonSpecs,
  ParsedSpecItem,
  ProductDetailTabKey,
} from "@/components/Products/Detail/ProductDetailUtils";

export interface ProductHeroMediaItem {
  id: string;
  path: string;
  maxSize?: number | null;
  caption: string;
  isPrimary: boolean;
}

export const useProductDetail = (sanPhamId: string) => {
  const [activeTab, setActiveTab] = useState<ProductDetailTabKey>("variants");
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [selectedSerialStatusId, setSelectedSerialStatusId] =
    useState<string>("");
  const [selectedHeroMediaId, setSelectedHeroMediaId] = useState<string>("");
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);

  const {
    data: product,
    isLoading,
    isFetching,
    refetch,
  } = useGetSanPhamById(sanPhamId);

  // Lấy danh mục trạng thái Serial động từ DM_DanhMucChiTiet (DanhMucID = 12)
  const {
    options: serialStatusOptions,
    getBadge: getSerialStatusBadge,
    isLoading: isLoadingSerialStatuses,
  } = useDanhMucChiTietLookup(DANH_MUC_CHUNG.TRANG_THAI_SERIAL);

  // 1. Thông tin Thương hiệu (hỗ trợ cả object lồng nhau `thuongHieu` hoặc trường phẳng từ SanPhamApi/Get)
  const brand = useMemo<SP_ThuongHieu | null>(() => {
    if (!product) return null;
    if (product.thuongHieu) return product.thuongHieu;
    if (!product.thuongHieuID && !product.tenThuongHieu) return null;

    return {
      thuongHieuID: product.thuongHieuID,
      maThuongHieu: product.maThuongHieu || "-",
      tenThuongHieu: product.tenThuongHieu || "Chưa gắn thương hiệu",
      duongDan: product.duongDanThuongHieu || "-",
      duongDanLogo: product.logoThuongHieu ?? null,
      maxSize: product.maxSizeLogo ?? null,
      quocGia: product.quocGiaThuongHieu ?? null,
      moTa: product.moTaThuongHieu ?? null,
      thuTu: 1,
      trangThai: true,
    };
  }, [product]);

  // 2. Danh sách biến thể sản phẩm (`bienThes` từ SanPhamApi/Get)
  const variants = useMemo<SP_BienTheSanPham[]>(() => {
    return Array.isArray(product?.bienThes) ? product.bienThes : [];
  }, [product]);

  // 3. Danh sách hình ảnh album (`hinhAnhs` từ SanPhamApi/Get)
  const galleryImages = useMemo<SP_HinhAnhSanPham[]>(() => {
    if (!Array.isArray(product?.hinhAnhs)) return [];
    return [...product.hinhAnhs].sort(
      (a, b) => (a.thuTu ?? 99) - (b.thuTu ?? 99),
    );
  }, [product]);

  // 4. Danh sách số khung / số serial hiện có (`soSerials` từ SanPhamApi/Get)
  const serials = useMemo<SP_SoSerial[]>(() => {
    return Array.isArray(product?.soSerials) ? product.soSerials : [];
  }, [product]);

  // 5. Thông số kỹ thuật giải mã từ `thongSoKyThuatJson`
  const parsedSpecs = useMemo<ParsedSpecItem[]>(() => {
    return parseJsonSpecs(product?.thongSoKyThuatJson);
  }, [product?.thongSoKyThuatJson]);

  // 6. Tổng hợp danh sách ảnh hiển thị ở Hero Showcase (Ảnh đại diện + Album + Ảnh biến thể)
  const heroMediaList = useMemo<ProductHeroMediaItem[]>(() => {
    if (!product) return [];
    const list: ProductHeroMediaItem[] = [];
    const seenPaths = new Set<string>();

    if (product.anhDaiDien) {
      seenPaths.add(product.anhDaiDien);
      list.push({
        id: "hero-primary",
        path: product.anhDaiDien,
        maxSize: product.maxSize,
        caption: `${product.tenSanPham} (Ảnh đại diện)`,
        isPrimary: true,
      });
    }

    galleryImages.forEach((img) => {
      if (img.duongDanAnh && !seenPaths.has(img.duongDanAnh)) {
        seenPaths.add(img.duongDanAnh);
        list.push({
          id: `gallery-${img.hinhAnhID}`,
          path: img.duongDanAnh,
          maxSize: img.maxSize,
          caption:
            img.tieuDe ||
            img.tenBienThe ||
            `Hình ảnh #${img.thuTu ?? list.length + 1}`,
          isPrimary: Boolean(img.laAnhDaiDien),
        });
      }
    });

    variants.forEach((v) => {
      const vPath = v.hinhAnh || v.anhDaiDien;
      if (vPath && !seenPaths.has(vPath)) {
        seenPaths.add(vPath);
        list.push({
          id: `variant-${v.bienTheSanPhamID}`,
          path: vPath,
          maxSize: v.maxSize,
          caption: `${v.tenBienThe} (${v.maSKU})`,
          isPrimary: false,
        });
      }
    });

    return list;
  }, [product, galleryImages, variants]);

  const activeHeroMedia = useMemo<ProductHeroMediaItem | null>(() => {
    if (heroMediaList.length === 0) return null;
    if (selectedHeroMediaId) {
      const found = heroMediaList.find((m) => m.id === selectedHeroMediaId);
      if (found) return found;
    }
    return heroMediaList[0];
  }, [heroMediaList, selectedHeroMediaId]);

  // 7. Tính toán các chỉ số thống kê KPI cho sản phẩm / xe
  const metrics = useMemo(() => {
    const totalVariants = variants.length || product?.soBienThe || 0;
    const activeVariants = variants.filter((v) => v.trangThai).length;

    const totalStockFromVariants = variants.reduce(
      (sum, v) => sum + (v.soLuongTon ?? 0),
      0,
    );
    const inStockSerialsCount = serials.filter(
      (s) => getSerialStatusBadge(s.trangThaiID).color === "emerald",
    ).length;

    const totalStock =
      totalStockFromVariants > 0 ? totalStockFromVariants : inStockSerialsCount;

    const prices = variants
      .map((v) => Number(v.giaBan || 0))
      .filter((p) => p > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    return {
      totalVariants,
      activeVariants,
      totalStock,
      minPrice,
      maxPrice,
      totalGalleryImages: galleryImages.length,
      totalSerials: serials.length,
      inStockSerialsCount,
    };
  }, [
    variants,
    galleryImages,
    serials,
    product?.soBienThe,
    getSerialStatusBadge,
  ]);

  // 8. Lọc danh sách ảnh và số serial theo biến thể & trạng thái được chọn
  const filteredGalleryImages = useMemo(() => {
    if (!selectedVariantId) return galleryImages;
    return galleryImages.filter(
      (img) => img.bienTheSanPhamID === selectedVariantId,
    );
  }, [galleryImages, selectedVariantId]);

  const filteredSerials = useMemo(() => {
    return serials.filter((s) => {
      if (selectedVariantId && s.bienTheSanPhamID !== selectedVariantId) {
        return false;
      }
      if (
        selectedSerialStatusId &&
        String(s.trangThaiID) !== String(selectedSerialStatusId)
      ) {
        return false;
      }
      return true;
    });
  }, [serials, selectedVariantId, selectedSerialStatusId]);

  return {
    product,
    brand,
    variants,
    galleryImages,
    filteredGalleryImages,
    serials,
    filteredSerials,
    serialStatusOptions,
    getSerialStatusBadge,
    isLoadingSerialStatuses,
    parsedSpecs,
    heroMediaList,
    activeHeroMedia,
    selectedHeroMediaId,
    setSelectedHeroMediaId,
    metrics,
    activeTab,
    setActiveTab,
    selectedVariantId,
    setSelectedVariantId,
    selectedSerialStatusId,
    setSelectedSerialStatusId,
    openEditModal,
    setOpenEditModal,
    isLoading,
    isFetching,
    refetch,
  };
};
