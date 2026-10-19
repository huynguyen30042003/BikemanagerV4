"use client";

import { useState, useMemo } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  DM_DiaDiem,
  CreateDiaDiemPayload,
  UpdateDiaDiemPayload,
} from "@/types/diaDiem";
import { DM_DiaPhuongCapTinh } from "@/types/diaPhuongCapTinh";
import { DM_DiaPhuongCapXa } from "@/types/diaPhuongCapXa";
import { useDebounceSearch } from "../useDebounceSearch";
import {
  useGetDiaDiem,
  useGetDiaDiemKPI,
  useCreateDiaDiem,
  useUpdateDiaDiem,
  useDeleteDiaDiem,
} from "./useDiaDiemApi";
import { useGetDiaPhuongCapTinh } from "../DiaPhuongCapTinh/useDiaPhuongCapTinhApi";
import { useGetDiaPhuongCapXa } from "../DiaPhuongCapXa/useDiaPhuongCapXaApi";
import { DANH_MUC_CHUNG } from "@/constants/danhMuc";
import { useDanhMucChiTietLookup } from "../DanhMucChiTiet/useDanhMucChiTietLookup";

export * from "./useDiaDiemApi";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const DEBOUNCE_DELAY = 400;

export const diaDiemSchema = z.object({
  tenDiaDiem: z.string().trim().min(1, "Vui lòng nhập tên địa điểm / showroom"),
  loaiDiaDiemID: z.number().min(1, "Vui lòng chọn loại cơ sở"),
  tinhID: z.number().min(1, "Vui lòng chọn Tỉnh / Thành phố"),
  xaID: z.number().min(1, "Vui lòng chọn Phường / Xã"),
  diaChiSo: z.string().trim().min(1, "Vui lòng nhập địa chỉ cụ thể"),
});

export function useDiaDiem(initialTinhId?: string | number) {
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tinhFilter, setTinhFilter] = useState<string | number>(initialTinhId ?? "");

  // Lấy danh mục loại cơ sở địa điểm động từ DM_DanhMucChiTiet (DanhMucID = 1)
  const {
    options: loaiDiaDiemOptions,
    getLabel: getLoaiDiaDiemLabel,
    getBadge: getLoaiDiaDiemBadge,
    isLoading: isLoadingLoaiDiaDiem,
  } = useDanhMucChiTietLookup(DANH_MUC_CHUNG.LOAI_DIA_DIEM);

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: "",
  });

  const [open, setOpen] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectDiaDiemId, setSelectDiaDiemId] = useState<string>("");
  const [selectItemName, setSelectItemName] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form states
  const [dataAdd, setDataAdd] = useState<CreateDiaDiemPayload>({
    DiaDiemCapChaID: null,
    LoaiDiaDiemID: 1,
    TenDiaDiem: "",
    MoTa: "",
    TinhID: 0,
    XaID: 0,
    KinhDo: null,
    ViDo: null,
    DiaChiSo: "",
    TrangThai: true,
    file: null,
  });

  const [dataUpdate, setDataUpdate] = useState<UpdateDiaDiemPayload>({
    DiaDiemID: "",
    DiaDiemCapChaID: null,
    LoaiDiaDiemID: 1,
    TenDiaDiem: "",
    MoTa: "",
    TinhID: 0,
    XaID: 0,
    KinhDo: null,
    ViDo: null,
    DiaChiSo: "",
    TrangThai: true,
    XoaFile: false,
    file: null,
  });

  // Query danh sách tỉnh thành cho filter & form
  const { data: dataTinh, isLoading: isLoadingTinh } = useGetDiaPhuongCapTinh({
    PageIndex: 1,
    PageSize: 100,
  });

  const provinces: DM_DiaPhuongCapTinh[] = useMemo(() => {
    return dataTinh?.data ?? [];
  }, [dataTinh]);

  const provinceOptions = useMemo(() => {
    return provinces.map((p) => ({
      value: p.tinhID,
      label: p.ten,
    }));
  }, [provinces]);

  const provinceMap = useMemo(() => {
    const map = new Map<number, string>();
    provinces.forEach((p) => map.set(p.tinhID, p.ten));
    return map;
  }, [provinces]);

  // Query danh sách xã phường theo TỉnhID đang chọn trong Add / Update form
  const activeFormTinhId = open ? dataAdd.TinhID : openUpdate ? dataUpdate.TinhID : 0;
  const { data: dataXa } = useGetDiaPhuongCapXa({
    TinhID: activeFormTinhId > 0 ? activeFormTinhId : null,
    PageIndex: 1,
    PageSize: 200,
  });

  const communeOptions = useMemo(() => {
    const communes: DM_DiaPhuongCapXa[] = dataXa?.data ?? [];
    return communes.map((c) => ({
      value: c.xaID,
      label: c.ten,
    }));
  }, [dataXa]);

  const filterParams = useMemo(() => {
    let trangThai: boolean | null = null;
    if (statusFilter === "active") trangThai = true;
    if (statusFilter === "inactive") trangThai = false;

    const tinhId =
      typeof tinhFilter === "number"
        ? tinhFilter
        : tinhFilter !== ""
        ? Number(tinhFilter)
        : null;

    return {
      TinhID: tinhId,
      TuKhoa: searchTerm.trim(),
      PageIndex: page,
      PageSize: pageSize,
      TrangThai: trangThai,
    };
  }, [searchTerm, page, pageSize, statusFilter, tinhFilter]);

  const {
    data: dataDiaDiem,
    isLoading,
    isFetching,
    refetch,
  } = useGetDiaDiem(filterParams);

  const {
    data: kpiData,
    isLoading: isLoadingKPI,
    refetch: refetchKPI,
  } = useGetDiaDiemKPI();

  const createMutation = useCreateDiaDiem();
  const updateMutation = useUpdateDiaDiem();
  const deleteMutation = useDeleteDiaDiem();

  const items: DM_DiaDiem[] = useMemo(() => {
    return dataDiaDiem?.data ?? [];
  }, [dataDiaDiem]);

  const totalCount: number =
    dataDiaDiem?.pagination?.totalItems ?? items.length;

  const totalPages: number =
    dataDiaDiem?.pagination?.totalPages ??
    Math.max(1, Math.ceil(totalCount / pageSize));

  // Parent locations options (loại bỏ chính nó khi sửa)
  const parentLocationOptions = useMemo(() => {
    return items
      .filter((loc) => !openUpdate || loc.diaDiemID !== dataUpdate.DiaDiemID)
      .map((loc) => ({
        value: loc.diaDiemID,
        label: loc.tenDiaDiem,
      }));
  }, [items, openUpdate, dataUpdate.DiaDiemID]);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setPage(DEFAULT_PAGE);
  };

  const handleModalAdd = () => {
    const defaultTinh =
      typeof tinhFilter === "number"
        ? tinhFilter
        : tinhFilter !== ""
        ? Number(tinhFilter)
        : provinceOptions[0]?.value ? Number(provinceOptions[0].value) : 0;

    setDataAdd({
      DiaDiemCapChaID: null,
      LoaiDiaDiemID: 1,
      TenDiaDiem: "",
      MoTa: "",
      TinhID: defaultTinh,
      XaID: 0,
      KinhDo: null,
      ViDo: null,
      DiaChiSo: "",
      TrangThai: true,
      file: null,
    });
    setErrors({});
    setOpen(true);
  };

  const handleOpenEdit = (item: DM_DiaDiem) => {
    setDataUpdate({
      DiaDiemID: item.diaDiemID,
      DiaDiemCapChaID: item.diaDiemCapChaID || null,
      LoaiDiaDiemID: item.loaiDiaDiemID || 1,
      TenDiaDiem: item.tenDiaDiem,
      MoTa: item.moTa || "",
      TinhID: item.tinhID || 0,
      XaID: item.xaID || 0,
      KinhDo: item.kinhDo != null ? Number(item.kinhDo) : null,
      ViDo: item.viDo != null ? Number(item.viDo) : null,
      DiaChiSo: item.diaChiSo || "",
      TrangThai: item.trangThai ?? true,
      XoaFile: false,
      file: null,
    });
    setErrors({});
    setOpenUpdate(true);
  };

  const handleOpenDelete = (item: DM_DiaDiem) => {
    setSelectDiaDiemId(item.diaDiemID);
    setSelectItemName(item.tenDiaDiem);
    setOpenDelete(true);
  };

  const handleSubmit = async () => {
    const validation = diaDiemSchema.safeParse({
      tenDiaDiem: dataAdd.TenDiaDiem,
      loaiDiaDiemID: dataAdd.LoaiDiaDiemID,
      tinhID: dataAdd.TinhID,
      xaID: dataAdd.XaID,
      diaChiSo: dataAdd.DiaChiSo,
    });

    if (!validation.success) {
      const errMap: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        errMap[String(issue.path[0])] = issue.message;
      });
      setErrors(errMap);
      toast.error("Vui lòng kiểm tra lại thông tin cơ sở");
      return;
    }

    setErrors({});
    try {
      await createMutation.mutateAsync(dataAdd);
      toast.success("Thêm mới địa điểm cơ sở thành công");
      setOpen(false);
      refetch();
      refetchKPI();
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Thêm mới địa điểm thất bại";
      toast.error(msg);
    }
  };

  const handleSubmitUpdate = async () => {
    const validation = diaDiemSchema.safeParse({
      tenDiaDiem: dataUpdate.TenDiaDiem,
      loaiDiaDiemID: dataUpdate.LoaiDiaDiemID,
      tinhID: dataUpdate.TinhID,
      xaID: dataUpdate.XaID,
      diaChiSo: dataUpdate.DiaChiSo,
    });

    if (!validation.success) {
      const errMap: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        errMap[String(issue.path[0])] = issue.message;
      });
      setErrors(errMap);
      toast.error("Vui lòng kiểm tra lại thông tin cơ sở");
      return;
    }

    setErrors({});
    try {
      await updateMutation.mutateAsync(dataUpdate);
      toast.success("Cập nhật địa điểm cơ sở thành công");
      setOpenUpdate(false);
      refetch();
      refetchKPI();
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Cập nhật địa điểm thất bại";
      toast.error(msg);
    }
  };

  const handleSubmitDelete = async () => {
    if (!selectDiaDiemId) return;
    try {
      await deleteMutation.mutateAsync(selectDiaDiemId);
      toast.success(`Đã xóa "${selectItemName}" thành công`);
      setOpenDelete(false);
      refetch();
      refetchKPI();
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Không thể xóa địa điểm (có thể đang có dữ liệu đơn hàng hoặc kho hàng liên kết)";
      toast.error(msg);
    }
  };

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    tinhFilter,
    setTinhFilter,
    searchInput,
    handleSearch,

    provinces,
    provinceOptions,
    provinceMap,
    communeOptions,
    parentLocationOptions,
    isLoadingTinh,

    loaiDiaDiemOptions,
    getLoaiDiaDiemLabel,
    getLoaiDiaDiemBadge,
    isLoadingLoaiDiaDiem,

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
