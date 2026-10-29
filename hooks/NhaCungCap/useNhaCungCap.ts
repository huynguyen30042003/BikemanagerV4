"use client";

import { useState, useMemo } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  NH_NhaCungCap,
  CreateNhaCungCapPayload,
  UpdateNhaCungCapPayload,
} from "@/types/nhaCungCap";
import { useDebounceSearch } from "../useDebounceSearch";
import {
  useGetNhaCungCap,
  useGetNhaCungCapKPI,
  useCreateNhaCungCap,
  useUpdateNhaCungCap,
  useDeleteNhaCungCap,
} from "./useNhaCungCapApi";
import { useGetQuocGia } from "../QuocGia/useQuocGiaApi";
import { useGetDiaPhuongCapTinh } from "../DiaPhuongCapTinh/useDiaPhuongCapTinhApi";
import { useConfirm } from "@/components/Common/ConfirmContext";

export * from "./useNhaCungCapApi";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const DEBOUNCE_DELAY = 400;

export const nhaCungCapSchema = z.object({
  maNhaCungCap: z.string().trim().min(1, "Vui lòng nhập mã nhà cung cấp"),
  tenNhaCungCap: z.string().trim().min(1, "Vui lòng nhập tên nhà cung cấp"),
  dienThoai: z.string().trim().min(1, "Vui lòng nhập số điện thoại liên hệ"),
});

export function useNhaCungCap() {
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [quocGiaFilter, setQuocGiaFilter] = useState<string>("");
  const [coCongNoFilter, setCoCongNoFilter] = useState<string>("all");

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: "",
  });

  const [open, setOpen] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectSupplierId, setSelectSupplierId] = useState<string>("");
  const [selectItemName, setSelectItemName] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Query Quốc gia cho dropdown
  const { data: dataCountries, isLoading: isLoadingCountries } = useGetQuocGia({
    PageIndex: 1,
    PageSize: 100,
    TrangThai: true,
  });

  const countryOptions = useMemo(() => {
    const list = dataCountries?.data ?? dataCountries?.items ?? [];
    return list.map((q: { quocGiaID: number; ten: string }) => ({
      value: q.quocGiaID,
      label: q.ten,
    }));
  }, [dataCountries]);

  // Query Tỉnh / Thành phố
  const { data: dataProvinces, isLoading: isLoadingProvinces } =
    useGetDiaPhuongCapTinh({
      PageIndex: 1,
      PageSize: 100,
      TrangThai: true,
    });

  const provinceOptions = useMemo(() => {
    const list = dataProvinces?.data ?? dataProvinces?.items ?? [];
    return list.map((p: { tinhID: number; ten: string }) => ({
      value: p.tinhID,
      label: p.ten,
    }));
  }, [dataProvinces]);

  // Form states
  const [dataAdd, setDataAdd] = useState<CreateNhaCungCapPayload>({
    MaNhaCungCap: "",
    TenNhaCungCap: "",
    DienThoai: "",
    HopThu: "",
    DiaChi: "",
    QuocGiaID: 1,
    TinhID: null,
    XaID: null,
    MaSoThue: "",
    NguoiLienHe: "",
    SoTaiKhoanNganHang: "",
    TenNganHang: "",
    GhiChu: "",
    TrangThai: true,
  });

  const [dataUpdate, setDataUpdate] = useState<UpdateNhaCungCapPayload>({
    MaNhaCungCap: "",
    NhaCungCapID: "",
    TenNhaCungCap: "",
    DienThoai: "",
    HopThu: "",
    DiaChi: "",
    QuocGiaID: 1,
    TinhID: null,
    XaID: null,
    MaSoThue: "",
    NguoiLienHe: "",
    SoTaiKhoanNganHang: "",
    TenNganHang: "",
    GhiChu: "",
    TrangThai: true,
  });

  const queryParams = useMemo(() => {
    return {
      TuKhoa: searchTerm,
      QuocGiaID: quocGiaFilter ? Number(quocGiaFilter) : null,
      CoCongNo:
        coCongNoFilter === "hasDebt"
          ? true
          : coCongNoFilter === "noDebt"
            ? false
            : null,
      PageIndex: page,
      PageSize: pageSize,
      TrangThai:
        statusFilter === "active"
          ? true
          : statusFilter === "inactive"
            ? false
            : null,
    };
  }, [searchTerm, quocGiaFilter, coCongNoFilter, page, pageSize, statusFilter]);

  const { data, isLoading, isFetching, refetch } =
    useGetNhaCungCap(queryParams);

  const {
    data: kpiData,
    isLoading: isLoadingKPI,
    refetch: refetchKPI,
  } = useGetNhaCungCapKPI();

  const items: NH_NhaCungCap[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  const totalCount =
    data?.pagination?.totalItems ?? data?.recordsTotal ?? items.length;
  const totalPages = data?.pagination?.totalPages ?? 1;

  const createMutation = useCreateNhaCungCap();
  const updateMutation = useUpdateNhaCungCap();
  const deleteMutation = useDeleteNhaCungCap();

  const handleModalAdd = () => {
    setDataAdd({
      MaNhaCungCap: "",
      TenNhaCungCap: "",
      DienThoai: "",
      HopThu: "",
      DiaChi: "",
      QuocGiaID: 1,
      TinhID: null,
      XaID: null,
      MaSoThue: "",
      NguoiLienHe: "",
      SoTaiKhoanNganHang: "",
      TenNganHang: "",
      GhiChu: "",
      TrangThai: true,
    });
    setErrors({});
    setOpen(true);
  };

  const handleOpenEdit = (item: NH_NhaCungCap) => {
    setSelectSupplierId(item.nhaCungCapID);
    setDataUpdate({
      MaNhaCungCap: item.maNhaCungCap,
      NhaCungCapID: item.nhaCungCapID,
      TenNhaCungCap: item.tenNhaCungCap || "",
      DienThoai: item.dienThoai || "",
      HopThu: item.hopThu || "",
      DiaChi: item.diaChi || "",
      QuocGiaID: item.quocGiaID ?? 1,
      TinhID: item.tinhID ?? null,
      XaID: item.xaID ?? null,
      MaSoThue: item.maSoThue || "",
      NguoiLienHe: item.nguoiLienHe || "",
      SoTaiKhoanNganHang: item.soTaiKhoanNganHang || "",
      TenNganHang: item.tenNganHang || "",
      GhiChu: item.ghiChu || "",
      TrangThai: item.trangThai ?? true,
    });
    setErrors({});
    setOpenUpdate(true);
  };

  const handleOpenDelete = (item: NH_NhaCungCap) => {
    setSelectSupplierId(item.nhaCungCapID);
    setSelectItemName(item.tenNhaCungCap);
    setOpenDelete(true);
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const validation = nhaCungCapSchema.safeParse({
      maNhaCungCap: dataAdd.MaNhaCungCap,
      tenNhaCungCap: dataAdd.TenNhaCungCap,
      dienThoai: dataAdd.DienThoai,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await createMutation.mutateAsync(dataAdd);
      toast.success("Thêm nhà cung cấp mới thành công!");
      setOpen(false);
    } catch {
      toast.error("Không thể thêm nhà cung cấp. Vui lòng thử lại!");
    }
  };

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const validation = nhaCungCapSchema.safeParse({
      maNhaCungCap: dataUpdate.MaNhaCungCap,
      tenNhaCungCap: dataUpdate.TenNhaCungCap,
      dienThoai: dataUpdate.DienThoai,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await updateMutation.mutateAsync(dataUpdate);
      toast.success("Cập nhật thông tin nhà cung cấp thành công!");
      setOpenUpdate(false);
    } catch {
      toast.error("Không thể cập nhật nhà cung cấp. Vui lòng kiểm tra lại!");
    }
  };

  const { confirm } = useConfirm();

  const handleDelete = async (
    item: NH_NhaCungCap | { nhaCungCapID: string; tenNhaCungCap?: string },
  ) => {
    const isConfirmed = await confirm({
      title: "Xóa Nhà Cung Cấp",
      description: `Bạn có chắc chắn muốn xóa đối tác "${
        item.tenNhaCungCap || ""
      }"? Hành động này sẽ không thể khôi phục.`,
      confirmText: "Xác nhận xóa",
      variant: "danger",
    });
    if (!isConfirmed) return;
    try {
      await deleteMutation.mutateAsync(item.nhaCungCapID);
      toast.success("Xóa nhà cung cấp thành công!");
      refetchKPI();
    } catch {
      toast.error(
        "Không thể xóa nhà cung cấp. Có thể đối tác này đã phát sinh đơn nhập hàng hoặc công nợ!",
      );
    }
  };

  const handleSubmitDelete = async () => {
    if (!selectSupplierId) return;
    try {
      await deleteMutation.mutateAsync(selectSupplierId);
      toast.success("Xóa nhà cung cấp thành công!");
      setOpenDelete(false);
    } catch {
      toast.error(
        "Không thể xóa nhà cung cấp. Có thể đã phát sinh đơn nhập hàng!",
      );
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
    quocGiaFilter,
    setQuocGiaFilter,
    coCongNoFilter,
    setCoCongNoFilter,
    searchInput,
    handleSearch,

    countryOptions,
    isLoadingCountries,
    provinceOptions,
    isLoadingProvinces,

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
    handleSubmitAdd,
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
    handleDelete,
    isDeleting: deleteMutation.isPending,

    errors,
  };
}
