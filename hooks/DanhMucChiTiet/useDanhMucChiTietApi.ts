import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { revalidateTagAction } from "@/app/actions/revalidate";
import {
  getDanhMucChiTietApi,
  getDanhMucChiTietByIdApi,
  createDanhMucChiTietApi,
  updateDanhMucChiTietApi,
  deleteDanhMucChiTietApi,
  syncDanhMucChiTietApi,
  getDanhMucChiTietKPIApi,
} from "@/shared/api/DanhMucChiTiet";
import {
  CreateDanhMucChiTietPayload,
  DanhMucChiTietFilter,
  UpdateDanhMucChiTietPayload,
} from "@/types/danhMucChiTiet";

export const DANH_MUC_CHI_TIET_KEYS = {
  all: ["danhMucChiTiet"] as const,
  list: (params?: object) =>
    [...DANH_MUC_CHI_TIET_KEYS.all, "list", params] as const,
  detail: (id: number) =>
    [...DANH_MUC_CHI_TIET_KEYS.all, "detail", id] as const,
  kpi: () => ["danhMucChiTietKPI"] as const,
};

/**
 * Hook lấy số liệu thống kê KPI danh mục chi tiết
 */
export const useGetDanhMucChiTietKPI = () =>
  useQuery({
    queryKey: DANH_MUC_CHI_TIET_KEYS.kpi(),
    queryFn: () => getDanhMucChiTietKPIApi(),
    staleTime: 1000 * 60 * 60, // 1 giờ
    refetchOnWindowFocus: false,
  });

/**
 * Hook lấy danh sách danh mục chi tiết (phân trang, lọc theo danh mục cha & tìm kiếm)
 * Cấu hình staleTime 24h: Danh mục ít thay đổi, mở dropdown lập tức 0ms từ RAM
 */
export const useGetDanhMucChiTiet = (params: DanhMucChiTietFilter) =>
  useQuery({
    queryKey: DANH_MUC_CHI_TIET_KEYS.list(params),
    queryFn: () => getDanhMucChiTietApi(params),
    staleTime: 1000 * 60 * 60 * 24, // 24 giờ
    gcTime: 1000 * 60 * 60 * 48, // 48 giờ lưu trong bộ nhớ
    refetchOnWindowFocus: false,
  });

/**
 * Hook lấy thông tin chi tiết một danh mục con theo ID
 */
export const useGetDanhMucChiTietById = (id?: number) =>
  useQuery({
    queryKey: DANH_MUC_CHI_TIET_KEYS.detail(id ?? 0),
    queryFn: () => (id ? getDanhMucChiTietByIdApi(id) : null),
    enabled: typeof id === "number" && id > 0,
    staleTime: 1000 * 60 * 60 * 24, // 24 giờ
    gcTime: 1000 * 60 * 60 * 48,
    refetchOnWindowFocus: false,
  });

/**
 * Hook thêm mới danh mục chi tiết
 */
export const useCreateDanhMucChiTiet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDanhMucChiTietPayload) =>
      createDanhMucChiTietApi(body),
    onSuccess: async () => {
      // 1. Xóa cache phía Server (Next.js Data Cache tag)
      await revalidateTagAction("danh-muc-chi-tiet");
      // 2. Xóa cache phía Client (TanStack React Query)
      qc.invalidateQueries({ queryKey: DANH_MUC_CHI_TIET_KEYS.all });
      qc.invalidateQueries({ queryKey: DANH_MUC_CHI_TIET_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: ["danhMucChungNavTabs"] });
    },
  });
};

/**
 * Hook cập nhật danh mục chi tiết
 */
export const useUpdateDanhMucChiTiet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateDanhMucChiTietPayload) =>
      updateDanhMucChiTietApi(body),
    onSuccess: async (_data, vars) => {
      // 1. Xóa cache phía Server (Next.js Data Cache tag)
      await revalidateTagAction("danh-muc-chi-tiet");
      // 2. Xóa cache phía Client (TanStack React Query)
      qc.invalidateQueries({ queryKey: DANH_MUC_CHI_TIET_KEYS.all });
      qc.invalidateQueries({
        queryKey: DANH_MUC_CHI_TIET_KEYS.detail(vars.DanhMucChiTietID),
      });
      qc.invalidateQueries({ queryKey: DANH_MUC_CHI_TIET_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: ["danhMucChungNavTabs"] });
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
    onSuccess: async () => {
      // 1. Xóa cache phía Server (Next.js Data Cache tag)
      await revalidateTagAction("danh-muc-chi-tiet");
      // 2. Xóa cache phía Client (TanStack React Query)
      qc.invalidateQueries({ queryKey: DANH_MUC_CHI_TIET_KEYS.all });
      qc.invalidateQueries({ queryKey: DANH_MUC_CHI_TIET_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: ["danhMucChungNavTabs"] });
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
    onSuccess: async () => {
      // 1. Xóa cache phía Server (Next.js Data Cache tag)
      await revalidateTagAction("danh-muc-chi-tiet");
      // 2. Xóa cache phía Client (TanStack React Query)
      qc.invalidateQueries({ queryKey: DANH_MUC_CHI_TIET_KEYS.all });
      qc.invalidateQueries({ queryKey: DANH_MUC_CHI_TIET_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: ["danhMucChungNavTabs"] });
    },
  });
};
