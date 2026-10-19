"use client";

import { useState, useMemo } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  SP_SanPham,
  CreateSanPhamPayload,
  UpdateSanPhamPayload,
} from "@/types/sanPham";
import { useDebounceSearch } from "../useDebounceSearch";
import {
  useGetSanPham,
  useCreateSanPham,
  useUpdateSanPham,
  useDeleteSanPham,
} from "./useSanPhamApi";
import { useGetThuongHieu } from "../ThuongHieu/useThuongHieuApi";
import { useGetDanhMucChiTiet } from "../DanhMucChiTiet/useDanhMucChiTietApi";

export * from "./useSanPhamApi";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const DEBOUNCE_DELAY = 400;

export const sanPhamSchema = z.object({
  maSanPham: z.string().trim().min(1, "Vui lòng nhập mã sản phẩm"),
  tenSanPham: z.string().trim().min(1, "Vui lòng nhập tên sản phẩm"),
  thuongHieuID: z.string().min(1, "Vui lòng chọn thương hiệu / hãng sản xuất"),
  danhMucChiTietID: z.number().min(1, "Vui lòng chọn ngành hàng / danh mục chi tiết"),
});

export function useSanPham(initialThuongHieuId?: string, initialDanhMucId?: number) {
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [brandFilter, setBrandFilter] = useState<string>(initialThuongHieuId ?? "");
  const [categoryFilter, setCategoryFilter] = useState<string | number>(initialDanhMucId ?? "");

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: "",
  });

  const [open, setOpen] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectSanPhamId, setSelectSanPhamId] = useState<string>("");
  const [selectItemName, setSelectItemName] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Query Thương hiệu cho dropdown
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

  // Query Danh mục chi tiết (Ngành hàng)
  const { data: dataCategories, isLoading: isLoadingCategories } = useGetDanhMucChiTiet({
    DanhMucID: 10,
    PageIndex: 1,
    PageSize: 100,
    TrangThai: true,
  });

  const categoryOptions = useMemo(() => {
    const list = dataCategories?.data ?? dataCategories?.items ?? [];
    return list.map((c: { danhMucChiTietID: number; ten: string }) => ({
      value: c.danhMucChiTietID,
      label: c.ten,
    }));
  }, [dataCategories]);

  // Form states
  const [dataAdd, setDataAdd] = useState<CreateSanPhamPayload>({
    MaSanPham: "",
    TenSanPham: "",
    DanhMucChiTietID: initialDanhMucId ?? 0,
    ThuongHieuID: initialThuongHieuId ?? "",
    DuongDan: "",
    DonViTinhID: null,
    MoTaNgan: "",
    MoTa: "",
    ThongSoKyThuatJson: "",
    SoThangBaoHanhMacDinh: 12,
    LaPhuongTien: false,
    DaXuatBan: true,
    TrangThai: true,
    file: null,
  });

  const [dataUpdate, setDataUpdate] = useState<UpdateSanPhamPayload>({
    SanPhamID: "",
    MaSanPham: "",
    TenSanPham: "",
    DanhMucChiTietID: 0,
    ThuongHieuID: "",
    DuongDan: "",
    DonViTinhID: null,
    MoTaNgan: "",
    MoTa: "",
    ThongSoKyThuatJson: "",
    SoThangBaoHanhMacDinh: 12,
    LaPhuongTien: false,
    DaXuatBan: true,
    TrangThai: true,
    XoaFile: false,
    file: null,
  });

  const queryParams = useMemo(() => {
    let trangThai: boolean | null = null;
    if (statusFilter === "active") trangThai = true;
    if (statusFilter === "inactive") trangThai = false;

    return {
      TuKhoa: searchTerm,
      DanhMucChiTietID: categoryFilter ? Number(categoryFilter) : null,
      ThuongHieuID: brandFilter || null,
      PageIndex: page,
      PageSize: pageSize,
      TrangThai: trangThai,
    };
  }, [searchTerm, categoryFilter, brandFilter, page, pageSize, statusFilter]);

  const { data, isLoading, isFetching, refetch } = useGetSanPham(queryParams);

  const items: SP_SanPham[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  const totalCount = useMemo(() => {
    return data?.totalItems ?? data?.totalCount ?? items.length;
  }, [data, items.length]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  const createMutation = useCreateSanPham();
  const updateMutation = useUpdateSanPham();
  const deleteMutation = useDeleteSanPham();

  const handleModalAdd = () => {
    setErrors({});
    setDataAdd({
      MaSanPham: "",
      TenSanPham: "",
      DanhMucChiTietID: categoryFilter ? Number(categoryFilter) : 0,
      ThuongHieuID: brandFilter || "",
      DuongDan: "",
      DonViTinhID: null,
      MoTaNgan: "",
      MoTa: "",
      ThongSoKyThuatJson: "",
      SoThangBaoHanhMacDinh: 12,
      LaPhuongTien: false,
      DaXuatBan: true,
      TrangThai: true,
      file: null,
    });
    setOpen(true);
  };

  const handleOpenEdit = (item: SP_SanPham) => {
    setErrors({});
    setDataUpdate({
      SanPhamID: item.sanPhamID,
      MaSanPham: item.maSanPham,
      TenSanPham: item.tenSanPham,
      DanhMucChiTietID: item.danhMucChiTietID,
      ThuongHieuID: item.thuongHieuID,
      DuongDan: item.duongDan,
      DonViTinhID: item.donViTinhID || null,
      MoTaNgan: item.moTaNgan || "",
      MoTa: item.moTa || "",
      ThongSoKyThuatJson: item.thongSoKyThuatJson || "",
      SoThangBaoHanhMacDinh: item.soThangBaoHanhMacDinh ?? 12,
      LaPhuongTien: item.laPhuongTien ?? false,
      DaXuatBan: item.daXuatBan ?? true,
      TrangThai: item.trangThai,
      XoaFile: false,
      file: null,
    });
    setOpenUpdate(true);
  };

  const handleOpenDelete = (item: SP_SanPham) => {
    setSelectSanPhamId(item.sanPhamID);
    setSelectItemName(item.tenSanPham);
    setOpenDelete(true);
  };

  const handleSubmit = async () => {
    try {
      sanPhamSchema.parse({
        maSanPham: dataAdd.MaSanPham,
        tenSanPham: dataAdd.TenSanPham,
        thuongHieuID: dataAdd.ThuongHieuID,
        danhMucChiTietID: Number(dataAdd.DanhMucChiTietID),
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
      sanPhamSchema.parse({
        maSanPham: dataUpdate.MaSanPham,
        tenSanPham: dataUpdate.TenSanPham,
        thuongHieuID: dataUpdate.ThuongHieuID,
        danhMucChiTietID: Number(dataUpdate.DanhMucChiTietID),
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
        toast.error("Vui lòng kiểm tra lại thông tin sản phẩm!");
      }
    }
  };

  const handleSubmitDelete = async () => {
    if (!selectSanPhamId) return;
    try {
      await deleteMutation.mutateAsync(selectSanPhamId);
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
    statusFilter,
    setStatusFilter,
    brandFilter,
    setBrandFilter,
    categoryFilter,
    setCategoryFilter,
    searchInput,
    handleSearch,

    brandOptions,
    isLoadingBrands,
    categoryOptions,
    isLoadingCategories,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

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
