import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { revalidateTagAction } from "@/app/actions/revalidate";
import {
  getDanhMucChungApi,
  getDanhMucChungByIdApi,
  createDanhMucChungApi,
  updateDanhMucChungApi,
  deleteDanhMucChungApi,
  syncDanhMucChungApi,
  getDanhMucChungNavTabsApi,
  getDanhMucChungKPIApi,
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
  navTabs: () => ["danhMucChungNavTabs"] as const,
  kpi: () => ["danhMucChungKPI"] as const,
};

/**
 * Hook lấy số liệu thống kê KPI danh mục dùng chung
 */
export const useGetDanhMucChungKPI = () =>
  useQuery({
    queryKey: DANH_MUC_CHUNG_KEYS.kpi(),
    queryFn: () => getDanhMucChungKPIApi(),
    staleTime: 1000 * 60 * 60, // 1 giờ
    refetchOnWindowFocus: false,
  });

/**
 * Hook lấy số lượng thống kê cho các tabs danh mục
 */
export const useGetDanhMucChungNavTabs = () =>
  useQuery({
    queryKey: DANH_MUC_CHUNG_KEYS.navTabs(),
    queryFn: () => getDanhMucChungNavTabsApi(),
    staleTime: 1000 * 60 * 60 * 24, // 24 giờ
    gcTime: 1000 * 60 * 60 * 48,
    refetchOnWindowFocus: false,
  });

/**
 * Hook lấy danh sách danh mục chung (phân trang & tìm kiếm)
 */
export const useGetDanhMucChung = (params: DanhMucChungFilter) =>
  useQuery({
    queryKey: DANH_MUC_CHUNG_KEYS.list(params),
    queryFn: () => getDanhMucChungApi(params),
    staleTime: 1000 * 60 * 60 * 24, // 24 giờ
    gcTime: 1000 * 60 * 60 * 48,
    refetchOnWindowFocus: false,
  });

/**
 * Hook lấy thông tin chi tiết một danh mục theo ID
 */
export const useGetDanhMucChungById = (id?: number) =>
  useQuery({
    queryKey: DANH_MUC_CHUNG_KEYS.detail(id ?? 0),
    queryFn: () => (id ? getDanhMucChungByIdApi(id) : null),
    enabled: typeof id === "number" && id > 0,
    staleTime: 1000 * 60 * 60 * 24, // 24 giờ
    gcTime: 1000 * 60 * 60 * 48,
    refetchOnWindowFocus: false,
  });

/**
 * Hook thêm mới danh mục chung
 */
export const useCreateDanhMucChung = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDanhMucChungPayload) => createDanhMucChungApi(body),
    onSuccess: async () => {
      // 1. Xóa cache phía Server (Next.js Data Cache tag)
      await revalidateTagAction("danh-muc-chung");
      // 2. Xóa cache phía Client (TanStack React Query)
      qc.invalidateQueries({ queryKey: DANH_MUC_CHUNG_KEYS.all });
      qc.invalidateQueries({ queryKey: DANH_MUC_CHUNG_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: DANH_MUC_CHUNG_KEYS.navTabs() });
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
    onSuccess: async (_data, vars) => {
      // 1. Xóa cache phía Server (Next.js Data Cache tag)
      await revalidateTagAction("danh-muc-chung");
      // 2. Xóa cache phía Client (TanStack React Query)
      qc.invalidateQueries({ queryKey: DANH_MUC_CHUNG_KEYS.all });
      qc.invalidateQueries({ queryKey: DANH_MUC_CHUNG_KEYS.detail(vars.DanhMucID) });
      qc.invalidateQueries({ queryKey: DANH_MUC_CHUNG_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: DANH_MUC_CHUNG_KEYS.navTabs() });
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
    onSuccess: async () => {
      // 1. Xóa cache phía Server (Next.js Data Cache tag)
      await revalidateTagAction("danh-muc-chung");
      // 2. Xóa cache phía Client (TanStack React Query)
      qc.invalidateQueries({ queryKey: DANH_MUC_CHUNG_KEYS.all });
      qc.invalidateQueries({ queryKey: DANH_MUC_CHUNG_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: DANH_MUC_CHUNG_KEYS.navTabs() });
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
    onSuccess: async () => {
      // 1. Xóa cache phía Server (Next.js Data Cache tag)
      await revalidateTagAction("danh-muc-chung");
      // 2. Xóa cache phía Client (TanStack React Query)
      qc.invalidateQueries({ queryKey: DANH_MUC_CHUNG_KEYS.all });
      qc.invalidateQueries({ queryKey: DANH_MUC_CHUNG_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: DANH_MUC_CHUNG_KEYS.navTabs() });
    },
  });
};
