import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDanhMucChiTietApi,
  getDanhMucChiTietByIdApi,
  createDanhMucChiTietApi,
  updateDanhMucChiTietApi,
  deleteDanhMucChiTietApi,
  syncDanhMucChiTietApi,
} from "@/shared/api/DanhMucChiTiet";
import {
  CreateDanhMucChiTietPayload,
  DanhMucChiTietFilter,
  UpdateDanhMucChiTietPayload,
} from "@/types/danhMucChiTiet";

export const DANH_MUC_CHI_TIET_KEYS = {
  all: ["danhMucChiTiet"] as const,
  list: (params?: object) => [...DANH_MUC_CHI_TIET_KEYS.all, "list", params] as const,
  detail: (id: number) => [...DANH_MUC_CHI_TIET_KEYS.all, "detail", id] as const,
};

/**
 * Hook lấy danh sách danh mục chi tiết (phân trang, lọc theo danh mục cha & tìm kiếm)
 */
export const useGetDanhMucChiTiet = (params: DanhMucChiTietFilter) =>
  useQuery({
    queryKey: DANH_MUC_CHI_TIET_KEYS.list(params),
    queryFn: () => getDanhMucChiTietApi(params),
    staleTime: 1000 * 60 * 5,
  });

/**
 * Hook lấy thông tin chi tiết một danh mục con theo ID
 */
export const useGetDanhMucChiTietById = (id?: number) =>
  useQuery({
    queryKey: DANH_MUC_CHI_TIET_KEYS.detail(id ?? 0),
    queryFn: () => (id ? getDanhMucChiTietByIdApi(id) : null),
    enabled: typeof id === "number" && id > 0,
    staleTime: 1000 * 60 * 5,
  });

/**
 * Hook thêm mới danh mục chi tiết
 */
export const useCreateDanhMucChiTiet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDanhMucChiTietPayload) => createDanhMucChiTietApi(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DANH_MUC_CHI_TIET_KEYS.all });
    },
  });
};

/**
 * Hook cập nhật danh mục chi tiết
 */
export const useUpdateDanhMucChiTiet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateDanhMucChiTietPayload) => updateDanhMucChiTietApi(body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: DANH_MUC_CHI_TIET_KEYS.all });
      qc.invalidateQueries({ queryKey: DANH_MUC_CHI_TIET_KEYS.detail(vars.DanhMucChiTietID) });
    },
  });
};

/**
 * Hook xóa danh mục chi tiết
 */
export const useDeleteDanhMucChiTiet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteDanhMucChiTietApi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DANH_MUC_CHI_TIET_KEYS.all });
    },
  });
};

/**
 * Hook đồng bộ danh mục chi tiết từ dữ liệu chuẩn
 */
export const useSyncDanhMucChiTiet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => syncDanhMucChiTietApi(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DANH_MUC_CHI_TIET_KEYS.all });
    },
  });
};
