import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDiaDiemApi,
  getDiaDiemByIdApi,
  createDiaDiemApi,
  updateDiaDiemApi,
  deleteDiaDiemApi,
  getDiaDiemNavTabsApi,
  getDiaDiemKPIApi,
} from "@/shared/api/DiaDiem";
import {
  CreateDiaDiemPayload,
  DiaDiemFilter,
  UpdateDiaDiemPayload,
} from "@/types/diaDiem";

export const DIA_DIEM_KEYS = {
  all: ["diaDiem"] as const,
  lists: () => [...DIA_DIEM_KEYS.all, "list"] as const,
  list: (params?: object) => [...DIA_DIEM_KEYS.lists(), params] as const,
  details: () => [...DIA_DIEM_KEYS.all, "detail"] as const,
  detail: (id: string) => [...DIA_DIEM_KEYS.details(), id] as const,
  navTabs: () => ["diaDiemNavTabs"] as const,
  kpi: () => [...DIA_DIEM_KEYS.all, "kpi"] as const,
};

/**
 * Hook lấy số liệu thống kê KPI địa điểm
 */
export const useGetDiaDiemKPI = () =>
  useQuery({
    queryKey: DIA_DIEM_KEYS.kpi(),
    queryFn: () => getDiaDiemKPIApi(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

export const useGetDiaDiemNavTabs = () =>
  useQuery({
    queryKey: DIA_DIEM_KEYS.navTabs(),
    queryFn: () => getDiaDiemNavTabsApi(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

export const useGetDiaDiem = (params: DiaDiemFilter) =>
  useQuery({
    queryKey: DIA_DIEM_KEYS.list(params),
    queryFn: () => getDiaDiemApi(params),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

export const useGetDiaDiemById = (id?: string) =>
  useQuery({
    queryKey: DIA_DIEM_KEYS.detail(id ?? ""),
    queryFn: () => (id ? getDiaDiemByIdApi(id) : null),
    enabled: typeof id === "string" && id.length > 0,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

export const useCreateDiaDiem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDiaDiemPayload) => createDiaDiemApi(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DIA_DIEM_KEYS.all });
      qc.invalidateQueries({ queryKey: DIA_DIEM_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: DIA_DIEM_KEYS.navTabs() });
    },
  });
};

export const useUpdateDiaDiem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateDiaDiemPayload) => updateDiaDiemApi(body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: DIA_DIEM_KEYS.all });
      qc.invalidateQueries({ queryKey: DIA_DIEM_KEYS.detail(vars.DiaDiemID) });
      qc.invalidateQueries({ queryKey: DIA_DIEM_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: DIA_DIEM_KEYS.navTabs() });
    },
  });
};

export const useDeleteDiaDiem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDiaDiemApi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DIA_DIEM_KEYS.all });
      qc.invalidateQueries({ queryKey: DIA_DIEM_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: DIA_DIEM_KEYS.navTabs() });
    },
  });
};
