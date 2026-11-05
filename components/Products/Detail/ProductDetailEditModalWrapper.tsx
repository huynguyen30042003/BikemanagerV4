"use client";

import React, { useMemo } from "react";
import { SP_SanPham } from "@/types/sanPham";
import { useGetThuongHieu } from "@/hooks/ThuongHieu/useThuongHieuApi";
import { useGetDanhMucChiTiet } from "@/hooks/DanhMucChiTiet/useDanhMucChiTietApi";
import { UpdateProductSlideOver } from "@/components/Products/UpdateProductSlideOver";

export interface ProductDetailEditModalWrapperProps {
  open: boolean;
  onClose: () => void;
  product: SP_SanPham;
  onSuccess: () => void;
}

export const ProductDetailEditModalWrapper: React.FC<
  ProductDetailEditModalWrapperProps
> = ({ open, onClose, product, onSuccess }) => {
  const { data: dataBrands, isLoading: isLoadingBrands } = useGetThuongHieu({
    PageIndex: 1,
    PageSize: 100,
    TrangThai: true,
  });

  const brandOptions = useMemo(() => {
    const list = dataBrands?.data ?? dataBrands?.items ?? [];
    return list.map((b: { thuongHieuID: string; tenThuongHieu: string }) => ({
      value: b.thuongHieuID,
      label: b.tenThuongHieu,
    }));
  }, [dataBrands]);

  const { data: dataCategories, isLoading: isLoadingCategories } =
    useGetDanhMucChiTiet({
      DanhMucID: 10,
      PageIndex: 1,
      PageSize: 100,
      TrangThai: true,
    });

  const categoryOptions = useMemo(() => {
    const list = dataCategories?.data ?? dataCategories?.items ?? [];
    return list.map(
      (c: { danhMucChiTietID: number; tenDanhMucChiTiet: string }) => ({
        value: c.danhMucChiTietID,
        label: c.tenDanhMucChiTiet,
      }),
    );
  }, [dataCategories]);

  const { data: dataDonViTinh, isLoading: isLoadingDonViTinh } =
    useGetDanhMucChiTiet({
      DanhMucID: 11,
      PageIndex: 1,
      PageSize: 100,
      TrangThai: true,
    });

  const donViTinhOptions = useMemo(() => {
    const list = dataDonViTinh?.data ?? dataDonViTinh?.items ?? [];
    return list.map(
      (d: { danhMucChiTietID: number; tenDanhMucChiTiet: string }) => ({
        value: d.danhMucChiTietID,
        label: d.tenDanhMucChiTiet,
      }),
    );
  }, [dataDonViTinh]);

  return (
    <UpdateProductSlideOver
      open={open}
      onClose={onClose}
      product={product}
      brandOptions={brandOptions}
      isLoadingBrands={isLoadingBrands}
      categoryOptions={categoryOptions}
      isLoadingCategories={isLoadingCategories}
      donViTinhOptions={donViTinhOptions}
      isLoadingDonViTinh={isLoadingDonViTinh}
      onSuccess={onSuccess}
    />
  );
};

