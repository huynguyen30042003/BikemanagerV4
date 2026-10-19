import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  list: (params?: object) => [...DIA_PHUONG_CAP_TINH_KEYS.all, "list", params] as const,
  detail: (id: number) => [...DIA_PHUONG_CAP_TINH_KEYS.all, "detail", id] as const,
  kpi: () => ["diaPhuongCapTinhKPI"] as const,
};

/**
 * Hook lấy số liệu thống kê KPI tỉnh/thành phố
 */
export const useGetDiaPhuongCapTinhKPI = () =>
  useQuery({
    queryKey: DIA_PHUONG_CAP_TINH_KEYS.kpi(),
    queryFn: () => getDiaPhuongCapTinhKPIApi(),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });

export const useGetDiaPhuongCapTinh = (params: DiaPhuongCapTinhFilter) =>
  useQuery({
    queryKey: DIA_PHUONG_CAP_TINH_KEYS.list(params),
    queryFn: () => getDiaPhuongCapTinhApi(params),
    staleTime: 1000 * 60 * 10,
  });

export const useGetDiaPhuongCapTinhById = (id?: number) =>
  useQuery({
    queryKey: DIA_PHUONG_CAP_TINH_KEYS.detail(id ?? 0),
    queryFn: () => (id ? getDiaPhuongCapTinhByIdApi(id) : null),
    enabled: typeof id === "number" && id > 0,
    staleTime: 1000 * 60 * 5,
  });

export const useCreateDiaPhuongCapTinh = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDiaPhuongCapTinhPayload) => createDiaPhuongCapTinhApi(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_TINH_KEYS.all });
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_TINH_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: ["diaDiemNavTabs"] });
    },
  });
};

export const useUpdateDiaPhuongCapTinh = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateDiaPhuongCapTinhPayload) => updateDiaPhuongCapTinhApi(body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_TINH_KEYS.all });
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_TINH_KEYS.detail(vars.TinhID) });
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_TINH_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: ["diaDiemNavTabs"] });
    },
  });
};

export const useDeleteDiaPhuongCapTinh = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteDiaPhuongCapTinhApi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_TINH_KEYS.all });
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_TINH_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: ["diaDiemNavTabs"] });
    },
  });
};

export const useSyncDiaPhuongCapTinh = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => syncDiaPhuongCapTinhApi(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_TINH_KEYS.all });
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_TINH_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: ["diaDiemNavTabs"] });
    },
  });
};
