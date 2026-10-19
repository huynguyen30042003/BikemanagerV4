"use client";

import { useState, useMemo } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  KH_KhachHang,
  CreateKhachHangPayload,
  UpdateKhachHangPayload,
} from "@/types/khachHang";
import { DM_DiaPhuongCapTinh } from "@/types/diaPhuongCapTinh";
import { DM_DiaPhuongCapXa } from "@/types/diaPhuongCapXa";
import { useDebounceSearch } from "../useDebounceSearch";
import {
  useGetKhachHang,
  useGetKhachHangKPI,
  useCreateKhachHang,
  useUpdateKhachHang,
  useDeleteKhachHang,
} from "./useKhachHangApi";
import { useGetDiaPhuongCapTinh } from "../DiaPhuongCapTinh/useDiaPhuongCapTinhApi";

import { useGetDiaPhuongCapXa } from "../DiaPhuongCapXa/useDiaPhuongCapXaApi";
import { useGetQuocGia } from "../QuocGia/useQuocGiaApi";

export * from "./useKhachHangApi";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const DEBOUNCE_DELAY = 400;

export const khachHangSchema = z.object({
  tenKhachHang: z.string().trim().min(1, "Vui lòng nhập tên khách hàng"),
  dienThoai: z
    .string()
    .trim()
    .min(9, "Số điện thoại tối thiểu 9 số")
    .max(15, "Số điện thoại tối đa 15 số"),
  loaiKhachHang: z.number().min(1).max(2),
});

export function useKhachHang(initialTinhId?: string | number) {
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loaiFilter, setLoaiFilter] = useState<string>("all"); // "all", "1", "2"
  const [tinhFilter, setTinhFilter] = useState<string | number>(initialTinhId ?? "");

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: "",
  });

  const [open, setOpen] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectKhachHangId, setSelectKhachHangId] = useState<string>("");
  const [selectItemName, setSelectItemName] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form states
  const [dataAdd, setDataAdd] = useState<CreateKhachHangPayload>({
    LoaiKhachHang: 1, // 1: Cá nhân, 2: Doanh nghiệp
    TenKhachHang: "",
    DienThoai: "",
    HopThu: "",
    DiaChi: "",
    TinhID: null,
    XaID: null,
    GhiChu: "",
    TrangThai: true,

    // Cá nhân
    MaDinhDanh: "",
    NgayCapMaDinhDanh: "",
    NoiCapMaDinhDanh: "",
    NgaySinh: "",
    GioiTinhID: null,
    QuocTichID: null,
    DanTocID: null,
    anhChanDung: null,

    // Doanh nghiệp
    MaSoThue: "",
    NguoiDaiDien: "",
    DienThoaiNguoiDaiDien: "",
    ToChucCapChaID: null,
    LoaiToChucID: null,
    TrangChu: "",
    anhBieuTrung: null,
  });

  const [dataUpdate, setDataUpdate] = useState<UpdateKhachHangPayload>({
    KhachHangID: "",
    LoaiKhachHang: 1,
    TenKhachHang: "",
    DienThoai: "",
    HopThu: "",
    DiaChi: "",
    TinhID: null,
    XaID: null,
    GhiChu: "",
    TrangThai: true,

    XoaAnhChanDung: false,
    XoaAnhBieuTrung: false,

    // Cá nhân
    MaDinhDanh: "",
    NgayCapMaDinhDanh: "",
    NoiCapMaDinhDanh: "",
    NgaySinh: "",
    GioiTinhID: null,
    QuocTichID: null,
    DanTocID: null,
    anhChanDung: null,

    // Doanh nghiệp
    MaSoThue: "",
    NguoiDaiDien: "",
    DienThoaiNguoiDaiDien: "",
    ToChucCapChaID: null,
    LoaiToChucID: null,
    TrangChu: "",
    anhBieuTrung: null,
  });

  // Query danh sách tỉnh thành
  const { data: dataTinh, isLoading: isLoadingTinh } = useGetDiaPhuongCapTinh({
    PageIndex: 1,
    PageSize: 100,
  });

  const provinces: DM_DiaPhuongCapTinh[] = useMemo(() => {
    return dataTinh?.data ?? dataTinh?.items ?? [];
  }, [dataTinh]);

  const provinceOptions = useMemo(() => {
    return provinces.map((p) => ({
      value: p.tinhID,
      label: p.ten,
    }));
  }, [provinces]);

  // Query xã cho form Add
  const addTinhId = dataAdd.TinhID;
  const { data: dataXaAdd, isLoading: isLoadingXaAdd } = useGetDiaPhuongCapXa({
    TinhID: addTinhId ? Number(addTinhId) : undefined,
    PageIndex: 1,
    PageSize: 200,
  });

  const communesAdd: DM_DiaPhuongCapXa[] = useMemo(() => {
    return dataXaAdd?.data ?? dataXaAdd?.items ?? [];
  }, [dataXaAdd]);

  const communeOptionsAdd = useMemo(() => {
    return communesAdd.map((x) => ({
      value: x.xaID,
      label: x.ten,
    }));
  }, [communesAdd]);

  // Query xã cho form Edit
  const updateTinhId = dataUpdate.TinhID;
  const { data: dataXaUpdate, isLoading: isLoadingXaUpdate } = useGetDiaPhuongCapXa({
    TinhID: updateTinhId ? Number(updateTinhId) : undefined,
    PageIndex: 1,
    PageSize: 200,
  });

  const communesUpdate: DM_DiaPhuongCapXa[] = useMemo(() => {
    return dataXaUpdate?.data ?? dataXaUpdate?.items ?? [];
  }, [dataXaUpdate]);

  const communeOptionsUpdate = useMemo(() => {
    return communesUpdate.map((x) => ({
      value: x.xaID,
      label: x.ten,
    }));
  }, [communesUpdate]);

  // Query Quốc gia
  const { data: dataQuocGia } = useGetQuocGia({ PageIndex: 1, PageSize: 100 });
  const countryOptions = useMemo(() => {
    const list = dataQuocGia?.data ?? dataQuocGia?.items ?? [];
    return list.map((q: { quocGiaID: number; ten: string }) => ({
      value: q.quocGiaID,
      label: q.ten,
    }));
  }, [dataQuocGia]);

  // Params query khách hàng
  const queryParams = useMemo(() => {
    let trangThai: boolean | null = null;
    if (statusFilter === "active") trangThai = true;
    if (statusFilter === "inactive") trangThai = false;

    let loaiKH: number | null = null;
    if (loaiFilter === "1") loaiKH = 1;
    if (loaiFilter === "2") loaiKH = 2;

    return {
      TuKhoa: searchTerm,
      TinhID: tinhFilter ? Number(tinhFilter) : null,
      LoaiKhachHang: loaiKH,
      PageIndex: page,
      PageSize: pageSize,
      TrangThai: trangThai,
    };
  }, [searchTerm, tinhFilter, loaiFilter, page, pageSize, statusFilter]);

  const { data, isLoading, isFetching, refetch } = useGetKhachHang(queryParams);

  const {
    data: kpiData,
    isLoading: isLoadingKPI,
    refetch: refetchKPI,
  } = useGetKhachHangKPI();

  const items: KH_KhachHang[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  const totalCount = useMemo(() => {
    return data?.totalItems ?? data?.totalCount ?? items.length;
  }, [data, items.length]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  // Mutations
  const createMutation = useCreateKhachHang();
  const updateMutation = useUpdateKhachHang();
  const deleteMutation = useDeleteKhachHang();

  // Handlers
  const handleModalAdd = () => {
    setErrors({});
    setDataAdd({
      LoaiKhachHang: 1,
      TenKhachHang: "",
      DienThoai: "",
      HopThu: "",
      DiaChi: "",
      TinhID: null,
      XaID: null,
      GhiChu: "",
      TrangThai: true,

      MaDinhDanh: "",
      NgayCapMaDinhDanh: "",
      NoiCapMaDinhDanh: "",
      NgaySinh: "",
      GioiTinhID: null,
      QuocTichID: null,
      DanTocID: null,
      anhChanDung: null,

      MaSoThue: "",
      NguoiDaiDien: "",
      DienThoaiNguoiDaiDien: "",
      ToChucCapChaID: null,
      LoaiToChucID: null,
      TrangChu: "",
      anhBieuTrung: null,
    });
    setOpen(true);
  };

  const handleOpenEdit = (item: KH_KhachHang) => {
    setErrors({});
    setDataUpdate({
      KhachHangID: item.khachHangID,
      LoaiKhachHang: item.loaiKhachHang,
      TenKhachHang: item.tenKhachHang,
      DienThoai: item.dienThoai,
      HopThu: item.hopThu || "",
      DiaChi: item.diaChi || "",
      TinhID: item.tinhID || null,
      XaID: item.xaID || null,
      GhiChu: item.ghiChu || "",
      TrangThai: item.trangThai,

      XoaAnhChanDung: false,
      XoaAnhBieuTrung: false,

      MaDinhDanh: item.maDinhDanh || "",
      NgayCapMaDinhDanh: item.ngayCapMaDinhDanh ? item.ngayCapMaDinhDanh.substring(0, 10) : "",
      NoiCapMaDinhDanh: item.noiCapMaDinhDanh || "",
      NgaySinh: item.ngaySinh ? item.ngaySinh.substring(0, 10) : "",
      GioiTinhID: item.gioiTinhID || null,
      QuocTichID: item.quocTichID || null,
      DanTocID: item.danTocID || null,
      anhChanDung: null,

      MaSoThue: item.maSoThue || "",
      NguoiDaiDien: item.nguoiDaiDien || "",
      DienThoaiNguoiDaiDien: item.dienThoaiNguoiDaiDien || "",
      ToChucCapChaID: item.toChucCapChaID || null,
      LoaiToChucID: item.loaiToChucID || null,
      TrangChu: item.trangChu || "",
      anhBieuTrung: null,
    });
    setOpenUpdate(true);
  };

  const handleOpenDelete = (item: KH_KhachHang) => {
    setSelectKhachHangId(item.khachHangID);
    setSelectItemName(item.tenKhachHang);
    setOpenDelete(true);
  };

  const handleSubmit = async () => {
    try {
      khachHangSchema.parse({
        tenKhachHang: dataAdd.TenKhachHang,
        dienThoai: dataAdd.DienThoai,
        loaiKhachHang: dataAdd.LoaiKhachHang,
      });

      setErrors({});
      await createMutation.mutateAsync(dataAdd);
      setOpen(false);
      refetchKPI();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Vui lòng kiểm tra lại các trường bắt buộc!");
      }
    }
  };

  const handleSubmitUpdate = async () => {
    try {
      khachHangSchema.parse({
        tenKhachHang: dataUpdate.TenKhachHang,
        dienThoai: dataUpdate.DienThoai,
        loaiKhachHang: dataUpdate.LoaiKhachHang,
      });

      setErrors({});
      await updateMutation.mutateAsync(dataUpdate);
      setOpenUpdate(false);
      refetchKPI();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Vui lòng kiểm tra lại thông tin cập nhật!");
      }
    }
  };

  const handleSubmitDelete = async () => {
    if (!selectKhachHangId) return;
    try {
      await deleteMutation.mutateAsync(selectKhachHangId);
      setOpenDelete(false);
      refetchKPI();
    } catch {
      // Toast handled by mutation
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
    loaiFilter,
    setLoaiFilter,
    tinhFilter,
    setTinhFilter,
    searchInput,
    handleSearch,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    // KPI data
    kpiData,
    isLoadingKPI,
    refetchKPI,

    provinceOptions,
    isLoadingTinh,
    communeOptionsAdd,
    isLoadingXaAdd,
    communeOptionsUpdate,
    isLoadingXaUpdate,
    countryOptions,

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
