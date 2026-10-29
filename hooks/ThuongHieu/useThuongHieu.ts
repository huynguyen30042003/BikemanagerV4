"use client";

import { useState, useMemo } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useConfirm } from "@/components/Common/ConfirmContext";
import {
  SP_ThuongHieu,
  CreateThuongHieuPayload,
  UpdateThuongHieuPayload,
} from "@/types/thuongHieu";
import { useDebounceSearch } from "../useDebounceSearch";
import {
  useGetThuongHieu,
  useGetThuongHieuKPI,
  useCreateThuongHieu,
  useUpdateThuongHieu,
  useDeleteThuongHieu,
} from "./useThuongHieuApi";
import { useGetQuocGia } from "../QuocGia/useQuocGiaApi";

export * from "./useThuongHieuApi";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 50;
export const DEBOUNCE_DELAY = 400;

export const thuongHieuSchema = z.object({
  maThuongHieu: z.string().trim().min(1, "Vui lòng nhập mã thương hiệu"),
  tenThuongHieu: z.string().trim().min(1, "Vui lòng nhập tên thương hiệu"),
  duongDan: z.string().trim().min(1, "Vui lòng nhập đường dẫn slug"),
});

export function useThuongHieu() {
  const { confirm } = useConfirm();
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: "",
  });

  const [open, setOpen] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Query Quốc gia cho dropdown
  const { data: dataQuocGia } = useGetQuocGia({ PageIndex: 1, PageSize: 100 });
  const countryOptions = useMemo(() => {
    const list = dataQuocGia?.data ?? dataQuocGia?.items ?? [];
    return list.map((q: { quocGiaID: number; ten: string }) => ({
      value: q.quocGiaID,
      label: q.ten,
    }));
  }, [dataQuocGia]);

  // Form states
  const [dataAdd, setDataAdd] = useState<CreateThuongHieuPayload>({
    MaThuongHieu: "",
    TenThuongHieu: "",
    DuongDan: "",
    QuocGiaID: null,
    QuocGia: "",
    MoTa: "",
    ThuTu: 0,
    TrangThai: true,
    file: null,
  });

  const [dataUpdate, setDataUpdate] = useState<UpdateThuongHieuPayload>({
    ThuongHieuID: "",
    MaThuongHieu: "",
    TenThuongHieu: "",
    DuongDan: "",
    QuocGiaID: null,
    QuocGia: "",
    MoTa: "",
    ThuTu: 0,
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
      PageIndex: page,
      PageSize: pageSize,
      TrangThai: trangThai,
    };
  }, [searchTerm, page, pageSize, statusFilter]);

  const { data, isLoading, isFetching, refetch } =
    useGetThuongHieu(queryParams);

  const {
    data: kpiData,
    isLoading: isLoadingKPI,
    refetch: refetchKPI,
  } = useGetThuongHieuKPI();

  const items: SP_ThuongHieu[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  const totalCount =
    data?.pagination?.totalItems ?? data?.recordsTotal ?? items.length;
  const totalPages = data?.pagination?.totalPages ?? 1;

  const createMutation = useCreateThuongHieu();
  const updateMutation = useUpdateThuongHieu();
  const deleteMutation = useDeleteThuongHieu();

  const handleModalAdd = () => {
    setErrors({});
    setDataAdd({
      MaThuongHieu: "",
      TenThuongHieu: "",
      DuongDan: "",
      QuocGiaID: null,
      QuocGia: "",
      MoTa: "",
      ThuTu: 0,
      TrangThai: true,
      file: null,
    });
    setOpen(true);
  };

  const handleOpenEdit = (item: SP_ThuongHieu) => {
    setErrors({});
    setDataUpdate({
      ThuongHieuID: item.thuongHieuID,
      MaThuongHieu: item.maThuongHieu,
      TenThuongHieu: item.tenThuongHieu,
      DuongDan: item.duongDan,
      QuocGiaID: item.quocGiaID || null,
      QuocGia: item.quocGia || "",
      MoTa: item.moTa || "",
      ThuTu: item.thuTu || 0,
      TrangThai: item.trangThai,
      XoaFile: false,
      file: null,
    });
    setOpenUpdate(true);
  };

  const handleSubmit = async () => {
    try {
      thuongHieuSchema.parse({
        maThuongHieu: dataAdd.MaThuongHieu,
        tenThuongHieu: dataAdd.TenThuongHieu,
        duongDan: dataAdd.DuongDan,
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
        toast.error("Vui lòng nhập đầy đủ thông tin thương hiệu!");
      }
    }
  };

  const handleSubmitUpdate = async () => {
    try {
      thuongHieuSchema.parse({
        maThuongHieu: dataUpdate.MaThuongHieu,
        tenThuongHieu: dataUpdate.TenThuongHieu,
        duongDan: dataUpdate.DuongDan,
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
        toast.error("Vui lòng kiểm tra lại thông tin thương hiệu!");
      }
    }
  };

  const handleDelete = async (brand: SP_ThuongHieu) => {
    const isConfirmed = await confirm({
      title: "Xác nhận xóa thương hiệu",
      variant: "danger",
      confirmText: "Xác nhận xóa",
      description: `Bạn có chắc chắn muốn xóa thương hiệu "${brand.tenThuongHieu}" không? Hành động này không thể hoàn tác nếu thương hiệu đang liên kết với các dòng sản phẩm xe đạp.`,
    });
    if (!isConfirmed) return;
    try {
      await deleteMutation.mutateAsync(brand.thuongHieuID);
      refetchKPI();
    } catch {
      // Toast notification is handled inside useDeleteThuongHieu mutation
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
    searchInput,
    handleSearch,

    countryOptions,

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

    handleDelete,
    isDeleting: deleteMutation.isPending,

    errors,
  };
}
