"use client";

import { useState, useMemo } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  SP_BienTheSanPham,
  CreateBienThePayload,
  UpdateBienThePayload,
} from "@/types/bienTheSanPham";
import { useDebounceSearch } from "../useDebounceSearch";
import {
  useGetBienTheSanPham,
  useGetBienTheSanPhamKPI,
  useCreateBienThe,
  useUpdateBienThe,
  useDeleteBienThe,
} from "./useBienTheSanPhamApi";
import { useGetSanPham } from "../SanPham/useSanPhamApi";

export * from "./useBienTheSanPhamApi";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 50;
export const DEBOUNCE_DELAY = 400;

export const bienTheSchema = z.object({
  sanPhamID: z.string().min(1, "Vui lòng chọn sản phẩm cha"),
  maSKU: z.string().trim().min(1, "Vui lòng nhập mã SKU"),
  tenBienThe: z.string().trim().min(1, "Vui lòng nhập tên biến thể"),
  giaBan: z.number().min(0, "Giá bán không được âm"),
});

export function useBienTheSanPham(initialSanPhamId?: string) {
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [sanPhamFilter, setSanPhamFilter] = useState<string>(initialSanPhamId ?? "");

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: "",
  });

  const [open, setOpen] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectBienTheId, setSelectBienTheId] = useState<string>("");
  const [selectItemName, setSelectItemName] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Query sản phẩm cha cho dropdown
  const { data: dataProducts, isLoading: isLoadingProducts } = useGetSanPham({
    PageIndex: 1,
    PageSize: 100,
    TrangThai: true,
  });

  const productOptions = useMemo(() => {
    const list = dataProducts?.data ?? dataProducts?.items ?? [];
    return list.map((p: { sanPhamID: string; tenSanPham: string; maSanPham: string }) => ({
      value: p.sanPhamID,
      label: `${p.tenSanPham} [${p.maSanPham}]`,
    }));
  }, [dataProducts]);

  // Form states
  const [dataAdd, setDataAdd] = useState<CreateBienThePayload>({
    SanPhamID: initialSanPhamId ?? "",
    MaSKU: "",
    MaVach: "",
    TenBienThe: "",
    MauSac: "",
    DungLuongPin: "",
    CongSuatDongCo: "",
    GiaNhap: 0,
    GiaBan: 0,
    GiaBanSi: 0,
    SoThangBaoHanh: 12,
    QuanLyTheoSerial: true,
    TrangThai: true,
    file: null,
  });

  const [dataUpdate, setDataUpdate] = useState<UpdateBienThePayload>({
    BienTheSanPhamID: "",
    SanPhamID: "",
    MaSKU: "",
    MaVach: "",
    TenBienThe: "",
    MauSac: "",
    DungLuongPin: "",
    CongSuatDongCo: "",
    GiaNhap: 0,
    GiaBan: 0,
    GiaBanSi: 0,
    SoThangBaoHanh: 12,
    QuanLyTheoSerial: true,
    TrangThai: true,
    XoaFile: false,
    file: null,
  });

  const queryParams = useMemo(() => {
    return {
      SanPhamID: sanPhamFilter || null,
      TuKhoa: searchTerm,
      PageIndex: page,
      PageSize: pageSize,
    };
  }, [sanPhamFilter, searchTerm, page, pageSize]);

  const { data, isLoading, isFetching, refetch } = useGetBienTheSanPham(queryParams);

  const {
    data: kpiData,
    isLoading: isLoadingKPI,
    refetch: refetchKPI,
  } = useGetBienTheSanPhamKPI();

  const items: SP_BienTheSanPham[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  const totalCount = useMemo(() => {
    return data?.totalItems ?? data?.totalCount ?? items.length;
  }, [data, items.length]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  const createMutation = useCreateBienThe();
  const updateMutation = useUpdateBienThe();
  const deleteMutation = useDeleteBienThe();

  const handleModalAdd = () => {
    setErrors({});
    setDataAdd({
      SanPhamID: sanPhamFilter || "",
      MaSKU: "",
      MaVach: "",
      TenBienThe: "",
      MauSac: "",
      DungLuongPin: "",
      CongSuatDongCo: "",
      GiaNhap: 0,
      GiaBan: 0,
      GiaBanSi: 0,
      SoThangBaoHanh: 12,
      QuanLyTheoSerial: true,
      TrangThai: true,
      file: null,
    });
    setOpen(true);
  };

  const handleOpenEdit = (item: SP_BienTheSanPham) => {
    setErrors({});
    setDataUpdate({
      BienTheSanPhamID: item.bienTheSanPhamID,
      SanPhamID: item.sanPhamID,
      MaSKU: item.maSKU,
      MaVach: item.maVach || "",
      TenBienThe: item.tenBienThe,
      MauSac: item.mauSac || "",
      DungLuongPin: item.dungLuongPin || "",
      CongSuatDongCo: item.congSuatDongCo || "",
      GiaNhap: item.giaNhap || 0,
      GiaBan: item.giaBan || 0,
      GiaBanSi: item.giaBanSi || 0,
      SoThangBaoHanh: item.soThangBaoHanh ?? 12,
      QuanLyTheoSerial: item.quanLyTheoSerial ?? false,
      TrangThai: item.trangThai,
      XoaFile: false,
      file: null,
    });
    setOpenUpdate(true);
  };

  const handleOpenDelete = (item: SP_BienTheSanPham) => {
    setSelectBienTheId(item.bienTheSanPhamID);
    setSelectItemName(item.tenBienThe);
    setOpenDelete(true);
  };

  const handleSubmit = async () => {
    try {
      bienTheSchema.parse({
        sanPhamID: dataAdd.SanPhamID,
        maSKU: dataAdd.MaSKU,
        tenBienThe: dataAdd.TenBienThe,
        giaBan: dataAdd.GiaBan,
      });

      setErrors({});
      await createMutation.mutateAsync(dataAdd);
      setOpen(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Vui lòng nhập đầy đủ các trường bắt buộc!");
      }
    }
  };

  const handleSubmitUpdate = async () => {
    try {
      bienTheSchema.parse({
        sanPhamID: dataUpdate.SanPhamID,
        maSKU: dataUpdate.MaSKU,
        tenBienThe: dataUpdate.TenBienThe,
        giaBan: dataUpdate.GiaBan,
      });

      setErrors({});
      await updateMutation.mutateAsync(dataUpdate);
      setOpenUpdate(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Vui lòng kiểm tra lại thông tin biến thể!");
      }
    }
  };

  const handleSubmitDelete = async () => {
    if (!selectBienTheId) return;
    try {
      await deleteMutation.mutateAsync(selectBienTheId);
      setOpenDelete(false);
    } catch {
      // Toast handled
    }
  };

  const handleSearch = (val: string) => {
    setSearchInput(val);
    setPage(1);
  };

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    sanPhamFilter,
    setSanPhamFilter,
    searchInput,
    handleSearch,

    productOptions,
    isLoadingProducts,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    kpiData,
    isLoadingKPI,
    refetchKPI,

    open,
    setOpen,
    dataAdd,
    setDataAdd,
    handleModalAdd,
    handleSubmit,
    isCreating: createMutation.isPending,

    openUpdate,
    setOpenUpdate,
    dataUpdate,
    setDataUpdate,
    handleOpenEdit,
    handleSubmitUpdate,
    isUpdating: updateMutation.isPending,

    openDelete,
    setOpenDelete,
    selectItemName,
    handleOpenDelete,
    handleSubmitDelete,
    isDeleting: deleteMutation.isPending,

    errors,
  };
}
