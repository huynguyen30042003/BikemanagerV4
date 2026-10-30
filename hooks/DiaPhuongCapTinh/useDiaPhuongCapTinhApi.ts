import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { revalidateTagAction } from "@/app/actions/revalidate";
import {
  getDiaPhuongCapTinhApi,
  getDiaPhuongCapTinhByIdApi,
  createDiaPhuongCapTinhApi,
  updateDiaPhuongCapTinhApi,
  deleteDiaPhuongCapTinhApi,
  syncDiaPhuongCapTinhApi,
  getDiaPhuongCapTinhKPIApi,
} from "@/shared/api/DiaPhuongCapTinh";
import {
  CreateDiaPhuongCapTinhPayload,
  DiaPhuongCapTinhFilter,
  UpdateDiaPhuongCapTinhPayload,
} from "@/types/diaPhuongCapTinh";

export const DIA_PHUONG_CAP_TINH_KEYS = {
  all: ["diaPhuongCapTinh"] as const,
  list: (params?: object) =>
    [...DIA_PHUONG_CAP_TINH_KEYS.all, "list", params] as const,
  detail: (id: number) =>
    [...DIA_PHUONG_CAP_TINH_KEYS.all, "detail", id] as const,
  kpi: () => ["diaPhuongCapTinhKPI"] as const,
};

/**
 * Hook lấy số liệu thống kê KPI tỉnh/thành phố
 */
export const useGetDiaPhuongCapTinhKPI = () =>
  useQuery({
    queryKey: DIA_PHUONG_CAP_TINH_KEYS.kpi(),
    queryFn: () => getDiaPhuongCapTinhKPIApi(),
    staleTime: 1000 * 60 * 60, // 1 giờ
    refetchOnWindowFocus: false,
  });

/**
 * Hook lấy danh sách tỉnh/thành phố (phân trang & tìm kiếm)
 * Cấu hình staleTime 24h: Tỉnh/thành phố rất ít thay đổi, mở dropdown lập tức 0ms từ RAM
 */
export const useGetDiaPhuongCapTinh = (params: DiaPhuongCapTinhFilter) =>
  useQuery({
    queryKey: DIA_PHUONG_CAP_TINH_KEYS.list(params),
    queryFn: () => getDiaPhuongCapTinhApi(params),
    staleTime: 1000 * 60 * 60 * 24, // 24 giờ
    gcTime: 1000 * 60 * 60 * 48, // 48 giờ lưu trong bộ nhớ
    refetchOnWindowFocus: false,
  });

/**
 * Hook lấy chi tiết thông tin một tỉnh/thành phố theo ID
 */
export const useGetDiaPhuongCapTinhById = (id?: number) =>
  useQuery({
    queryKey: DIA_PHUONG_CAP_TINH_KEYS.detail(id ?? 0),
    queryFn: () => (id ? getDiaPhuongCapTinhByIdApi(id) : null),
    enabled: typeof id === "number" && id > 0,
    staleTime: 1000 * 60 * 60 * 24, // 24 giờ
    gcTime: 1000 * 60 * 60 * 48,
    refetchOnWindowFocus: false,
  });

/**
 * Hook thêm mới tỉnh/thành phố
 */
export const useCreateDiaPhuongCapTinh = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDiaPhuongCapTinhPayload) =>
      createDiaPhuongCapTinhApi(body),
    onSuccess: async () => {
      // 1. Xóa cache phía Server (Next.js Data Cache tag)
      await revalidateTagAction("dia-phuong-cap-tinh");
      // 2. Xóa cache phía Client (TanStack React Query)
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_TINH_KEYS.all });
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_TINH_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: ["diaDiemNavTabs"] });
    },
  });
};

/**
 * Hook cập nhật tỉnh/thành phố
 */
export const useUpdateDiaPhuongCapTinh = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateDiaPhuongCapTinhPayload) =>
      updateDiaPhuongCapTinhApi(body),
    onSuccess: async (_data, vars) => {
      // 1. Xóa cache phía Server (Next.js Data Cache tag)
      await revalidateTagAction("dia-phuong-cap-tinh");
      // 2. Xóa cache phía Client (TanStack React Query)
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_TINH_KEYS.all });
      qc.invalidateQueries({
        queryKey: DIA_PHUONG_CAP_TINH_KEYS.detail(vars.TinhID),
      });
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_TINH_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: ["diaDiemNavTabs"] });
    },
  });
};

/**
 * Hook xóa tỉnh/thành phố
 */
export const useDeleteDiaPhuongCapTinh = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteDiaPhuongCapTinhApi(id),
    onSuccess: async () => {
      // 1. Xóa cache phía Server (Next.js Data Cache tag)
      await revalidateTagAction("dia-phuong-cap-tinh");
      // 2. Xóa cache phía Client (TanStack React Query)
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_TINH_KEYS.all });
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_TINH_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: ["diaDiemNavTabs"] });
    },
  });
};

/**
 * Hook đồng bộ danh mục tỉnh/thành phố từ dữ liệu chuẩn
 */
export const useSyncDiaPhuongCapTinh = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => syncDiaPhuongCapTinhApi(),
    onSuccess: async () => {
      // 1. Xóa cache phía Server (Next.js Data Cache tag)
      await revalidateTagAction("dia-phuong-cap-tinh");
      // 2. Xóa cache phía Client (TanStack React Query)
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_TINH_KEYS.all });
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_TINH_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: ["diaDiemNavTabs"] });
    },
  });
};
