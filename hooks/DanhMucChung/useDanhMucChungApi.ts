import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDanhMucChungApi,
  getDanhMucChungByIdApi,
  createDanhMucChungApi,
  updateDanhMucChungApi,
  deleteDanhMucChungApi,
  syncDanhMucChungApi,
} from "@/shared/api/DanhMucChung";
import {
  CreateDanhMucChungPayload,
  DanhMucChungFilter,
  UpdateDanhMucChungPayload,
} from "@/types/danhMucChung";

export const DANH_MUC_CHUNG_KEYS = {
  all: ["danhMucChung"] as const,
  list: (params?: object) => [...DANH_MUC_CHUNG_KEYS.all, "list", params] as const,
  detail: (id: number) => [...DANH_MUC_CHUNG_KEYS.all, "detail", id] as const,
};

/**
 * Hook lấy danh sách danh mục chung (phân trang & tìm kiếm)
 */
export const useGetDanhMucChung = (params: DanhMucChungFilter) =>
  useQuery({
    queryKey: DANH_MUC_CHUNG_KEYS.list(params),
    queryFn: () => getDanhMucChungApi(params),
    staleTime: 1000 * 60 * 10,
  });

/**
 * Hook lấy thông tin chi tiết một danh mục theo ID
 */
export const useGetDanhMucChungById = (id?: number) =>
  useQuery({
    queryKey: DANH_MUC_CHUNG_KEYS.detail(id ?? 0),
    queryFn: () => (id ? getDanhMucChungByIdApi(id) : null),
    enabled: typeof id === "number" && id > 0,
    staleTime: 1000 * 60 * 5,
  });

/**
 * Hook thêm mới danh mục chung
 */
export const useCreateDanhMucChung = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDanhMucChungPayload) => createDanhMucChungApi(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DANH_MUC_CHUNG_KEYS.all });
    },
  });
};

/**
 * Hook cập nhật danh mục chung
 */
export const useUpdateDanhMucChung = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateDanhMucChungPayload) => updateDanhMucChungApi(body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: DANH_MUC_CHUNG_KEYS.all });
      qc.invalidateQueries({ queryKey: DANH_MUC_CHUNG_KEYS.detail(vars.DanhMucID) });
    },
  });
};

/**
 * Hook xóa danh mục chung
 */
export const useDeleteDanhMucChung = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteDanhMucChungApi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DANH_MUC_CHUNG_KEYS.all });
    },
  });
};

/**
 * Hook đồng bộ danh mục chung từ dữ liệu chuẩn
 */
export const useSyncDanhMucChung = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => syncDanhMucChungApi(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DANH_MUC_CHUNG_KEYS.all });
    },
  });
};
