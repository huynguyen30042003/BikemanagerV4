"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { SP_HinhAnhSanPham } from "@/types/hinhAnhSanPham";
import {
  useGetHinhAnhs,
  useGetHinhAnhSanPhamKPI,
  useAddHinhAnh,
  useDeleteHinhAnh,
} from "./useHinhAnhSanPhamApi";
import { useGetSanPham } from "../SanPham/useSanPhamApi";
import { useGetBienTheSanPham } from "../BienTheSanPham/useBienTheSanPhamApi";

export * from "./useHinhAnhSanPhamApi";

export function useHinhAnhSanPham(initialSanPhamId?: string) {
  const [selectedSanPhamId, setSelectedSanPhamId] = useState<string>(
    initialSanPhamId ?? ""
  );
  const [selectedBienTheId, setSelectedBienTheId] = useState<string>("");

  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectHinhAnhId, setSelectHinhAnhId] = useState<string>("");

  // Query sản phẩm cho dropdown
  const { data: dataProducts, isLoading: isLoadingProducts } = useGetSanPham({
    PageIndex: 1,
    PageSize: 100,
    TrangThai: true,
  });

  const productOptions = useMemo(() => {
    const list = dataProducts?.data ?? dataProducts?.items ?? [];
    return list.map(
      (p: { sanPhamID: string; tenSanPham: string; maSanPham: string }) => ({
        value: p.sanPhamID,
        label: `${p.tenSanPham} [${p.maSanPham}]`,
      })
    );
  }, [dataProducts]);

  // Tự động chọn sản phẩm đầu tiên nếu chưa chọn
  const activeSanPhamId = useMemo(() => {
    if (selectedSanPhamId) return selectedSanPhamId;
    if (productOptions.length > 0) return String(productOptions[0].value);
    return "";
  }, [selectedSanPhamId, productOptions]);

  // Query biến thể theo sản phẩm đang chọn
  const { data: dataVariants, isLoading: isLoadingVariants } =
    useGetBienTheSanPham({
      SanPhamID: activeSanPhamId || undefined,
      PageIndex: 1,
      PageSize: 100,
    });

  const variantOptions = useMemo(() => {
    const list = dataVariants?.data ?? dataVariants?.items ?? [];
    return [
      { value: "", label: "Ảnh dùng chung cho sản phẩm" },
      ...list.map(
        (v: {
          bienTheSanPhamID: string;
          tenBienThe: string;
          maSKU: string;
        }) => ({
          value: v.bienTheSanPhamID,
          label: `${v.tenBienThe} (${v.maSKU})`,
        })
      ),
    ];
  }, [dataVariants]);

  // Query album ảnh của sản phẩm đang chọn
  const { data, isLoading, isFetching, refetch } = useGetHinhAnhs({
    SanPhamID: activeSanPhamId,
    BienTheSanPhamID: selectedBienTheId || null,
  });

  // Query KPI tổng quan bộ sưu tập ảnh
  const {
    data: kpiData,
    isLoading: isLoadingKPI,
    refetch: refetchKPI,
  } = useGetHinhAnhSanPhamKPI();

  const items: SP_HinhAnhSanPham[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  // Form Add State
  const [dataAdd, setDataAdd] = useState<{
    BienTheSanPhamID: string;
    TieuDe: string;
    ThuTuSapXep: number;
    LaAnhDaiDien: boolean;
    file: File | null;
  }>({
    BienTheSanPhamID: "",
    TieuDe: "",
    ThuTuSapXep: 1,
    LaAnhDaiDien: false,
    file: null,
  });

  const addMutation = useAddHinhAnh();
  const deleteMutation = useDeleteHinhAnh();

  const handleOpenAdd = () => {
    setDataAdd({
      BienTheSanPhamID: selectedBienTheId || "",
      TieuDe: "",
      ThuTuSapXep: items.length + 1,
      LaAnhDaiDien: items.length === 0,
      file: null,
    });
    setOpenAdd(true);
  };

  const handleSubmitAdd = async () => {
    if (!dataAdd.file) {
      toast.error("Vui lòng chọn tệp ảnh để tải lên!");
      return;
    }
    try {
      await addMutation.mutateAsync({
        SanPhamID: activeSanPhamId,
        BienTheSanPhamID: dataAdd.BienTheSanPhamID || null,
        TieuDe: dataAdd.TieuDe || "",
        ThuTuSapXep: dataAdd.ThuTuSapXep,
        LaAnhDaiDien: dataAdd.LaAnhDaiDien,
        file: dataAdd.file,
      });
      setOpenAdd(false);
    } catch {
      // Toast handled
    }
  };

  const handleOpenDelete = (hinhAnhId: string) => {
    setSelectHinhAnhId(hinhAnhId);
    setOpenDelete(true);
  };

  const handleSubmitDelete = async () => {
    if (!selectHinhAnhId) return;
    try {
      await deleteMutation.mutateAsync(selectHinhAnhId);
      setOpenDelete(false);
    } catch {
      // Toast handled
    }
  };

  return {
    selectedSanPhamId: activeSanPhamId,
    setSelectedSanPhamId,
    selectedBienTheId,
    setSelectedBienTheId,

    productOptions,
    isLoadingProducts,
    variantOptions,
    isLoadingVariants,

    items,
    isLoading,
    isFetching,
    refetch,

    kpiData,
    isLoadingKPI,
    refetchKPI,

    openAdd,
    setOpenAdd,
    dataAdd,
    setDataAdd,
    handleOpenAdd,
    handleSubmitAdd,
    isAdding: addMutation.isPending,

    openDelete,
    setOpenDelete,
    handleOpenDelete,
    handleSubmitDelete,
    isDeleting: deleteMutation.isPending,
  };
}
