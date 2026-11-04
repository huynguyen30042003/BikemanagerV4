import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDiaPhuongCapXaApi,
  getDiaPhuongCapXaByIdApi,
  createDiaPhuongCapXaApi,
  updateDiaPhuongCapXaApi,
  deleteDiaPhuongCapXaApi,
  syncDiaPhuongCapXaApi,
  getDiaPhuongCapXaKPIApi,
} from "@/shared/api/DiaPhuongCapXa";
import {
  CreateDiaPhuongCapXaPayload,
  DiaPhuongCapXaFilter,
  UpdateDiaPhuongCapXaPayload,
} from "@/types/diaPhuongCapXa";

export const DIA_PHUONG_CAP_XA_KEYS = {
  all: ["diaPhuongCapXa"] as const,
  lists: () => [...DIA_PHUONG_CAP_XA_KEYS.all, "list"] as const,
  list: (params?: object) =>
    [...DIA_PHUONG_CAP_XA_KEYS.lists(), params] as const,
  details: () => [...DIA_PHUONG_CAP_XA_KEYS.all, "detail"] as const,
  detail: (id: number) =>
    [...DIA_PHUONG_CAP_XA_KEYS.details(), id] as const,
  kpi: () => [...DIA_PHUONG_CAP_XA_KEYS.all, "kpi"] as const,
};

/**
 * Hook lấy số liệu thống kê KPI xã/phường
 */
export const useGetDiaPhuongCapXaKPI = () =>
  useQuery({
    queryKey: DIA_PHUONG_CAP_XA_KEYS.kpi(),
    queryFn: () => getDiaPhuongCapXaKPIApi(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

export const useGetDiaPhuongCapXa = (
  params: DiaPhuongCapXaFilter,
  enabled: boolean = true,
) =>
  useQuery({
    queryKey: DIA_PHUONG_CAP_XA_KEYS.list(params),
    queryFn: () => getDiaPhuongCapXaApi(params),
    enabled,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

export const useGetDiaPhuongCapXaById = (id?: number) =>
  useQuery({
    queryKey: DIA_PHUONG_CAP_XA_KEYS.detail(id ?? 0),
    queryFn: () => (id ? getDiaPhuongCapXaByIdApi(id) : null),
    enabled: typeof id === "number" && id > 0,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

export const useCreateDiaPhuongCapXa = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDiaPhuongCapXaPayload) =>
      createDiaPhuongCapXaApi(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_XA_KEYS.all });
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_XA_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: ["diaDiemNavTabs"] });
    },
  });
};

export const useUpdateDiaPhuongCapXa = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateDiaPhuongCapXaPayload) =>
      updateDiaPhuongCapXaApi(body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_XA_KEYS.all });
      qc.invalidateQueries({
        queryKey: DIA_PHUONG_CAP_XA_KEYS.detail(vars.XaID),
      });
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_XA_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: ["diaDiemNavTabs"] });
    },
  });
};

export const useDeleteDiaPhuongCapXa = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteDiaPhuongCapXaApi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_XA_KEYS.all });
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_XA_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: ["diaDiemNavTabs"] });
    },
  });
};

export const useSyncDiaPhuongCapXa = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => syncDiaPhuongCapXaApi(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_XA_KEYS.all });
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_XA_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: ["diaDiemNavTabs"] });
    },
  });
};
