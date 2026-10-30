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
import { revalidateTagAction } from "@/app/actions/revalidate";

export const DIA_PHUONG_CAP_XA_KEYS = {
  all: ["diaPhuongCapXa"] as const,
  list: (params?: object) =>
    [...DIA_PHUONG_CAP_XA_KEYS.all, "list", params] as const,
  detail: (id: number) =>
    [...DIA_PHUONG_CAP_XA_KEYS.all, "detail", id] as const,
  kpi: () => ["diaPhuongCapXaKPI"] as const,
};

/**
 * Hook lấy số liệu thống kê KPI xã/phường
 */
export const useGetDiaPhuongCapXaKPI = () =>
  useQuery({
    queryKey: DIA_PHUONG_CAP_XA_KEYS.kpi(),
    queryFn: () => getDiaPhuongCapXaKPIApi(),
    staleTime: 1000 * 60 * 60, // 1 giờ
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
    staleTime: 1000 * 60 * 60 * 24, // 24 giờ
    gcTime: 1000 * 60 * 60 * 48,
    refetchOnWindowFocus: false,
  });

export const useGetDiaPhuongCapXaById = (id?: number) =>
  useQuery({
    queryKey: DIA_PHUONG_CAP_XA_KEYS.detail(id ?? 0),
    queryFn: () => (id ? getDiaPhuongCapXaByIdApi(id) : null),
    enabled: typeof id === "number" && id > 0,
    staleTime: 1000 * 60 * 60 * 24, // 24 giờ
    gcTime: 1000 * 60 * 60 * 48,
    refetchOnWindowFocus: false,
  });

export const useCreateDiaPhuongCapXa = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDiaPhuongCapXaPayload) =>
      createDiaPhuongCapXaApi(body),
    onSuccess: async () => {
      await revalidateTagAction("dia-phuong-cap-xa");
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
    onSuccess: async (_data, vars) => {
      await revalidateTagAction("dia-phuong-cap-xa");
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
    onSuccess: async () => {
      await revalidateTagAction("dia-phuong-cap-xa");
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
    onSuccess: async () => {
      await revalidateTagAction("dia-phuong-cap-xa");
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_XA_KEYS.all });
      qc.invalidateQueries({ queryKey: DIA_PHUONG_CAP_XA_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: ["diaDiemNavTabs"] });
    },
  });
};
