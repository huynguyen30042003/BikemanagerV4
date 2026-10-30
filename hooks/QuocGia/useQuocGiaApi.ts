import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getQuocGiaApi,
  getQuocGiaByIdApi,
  getQuocGiaKPIApi,
  createQuocGiaApi,
  updateQuocGiaApi,
  deleteQuocGiaApi,
  syncQuocGiaApi,
} from "@/shared/api/QuocGia";
import {
  CreateQuocGiaPayload,
  QuocGiaFilter,
  UpdateQuocGiaPayload,
} from "@/types/quocGia";
import { revalidateTagAction } from "@/app/actions/revalidate";

export const QUOC_GIA_KEYS = {
  all: ["quocGia"] as const,
  list: (params?: object) => [...QUOC_GIA_KEYS.all, "list", params] as const,
  detail: (id: number) => [...QUOC_GIA_KEYS.all, "detail", id] as const,
  kpi: () => [...QUOC_GIA_KEYS.all, "kpi"] as const,
};

export const useGetQuocGia = (params: QuocGiaFilter) =>
  useQuery({
    queryKey: QUOC_GIA_KEYS.list(params),
    queryFn: () => getQuocGiaApi(params),
    staleTime: 1000 * 60 * 60 * 24, // 24 giờ
    gcTime: 1000 * 60 * 60 * 48,
    refetchOnWindowFocus: false,
  });

export const useGetQuocGiaById = (id?: number) =>
  useQuery({
    queryKey: QUOC_GIA_KEYS.detail(id ?? 0),
    queryFn: () => (id ? getQuocGiaByIdApi(id) : null),
    enabled: typeof id === "number" && id > 0,
    staleTime: 1000 * 60 * 60 * 24, // 24 giờ
    gcTime: 1000 * 60 * 60 * 48,
    refetchOnWindowFocus: false,
  });

export const useGetQuocGiaKPI = () =>
  useQuery({
    queryKey: QUOC_GIA_KEYS.kpi(),
    queryFn: () => getQuocGiaKPIApi(),
    staleTime: 1000 * 60 * 60, // 1 giờ
    refetchOnWindowFocus: false,
  });

export const useCreateQuocGia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateQuocGiaPayload) => createQuocGiaApi(body),
    onSuccess: async () => {
      await revalidateTagAction("quoc-gia");
      qc.invalidateQueries({ queryKey: QUOC_GIA_KEYS.all });
      qc.invalidateQueries({ queryKey: QUOC_GIA_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: ["diaDiemNavTabs"] });
    },
  });
};

export const useUpdateQuocGia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateQuocGiaPayload) => updateQuocGiaApi(body),
    onSuccess: async (_data, vars) => {
      await revalidateTagAction("quoc-gia");
      qc.invalidateQueries({ queryKey: QUOC_GIA_KEYS.all });
      qc.invalidateQueries({ queryKey: QUOC_GIA_KEYS.detail(vars.QuocGiaID) });
      qc.invalidateQueries({ queryKey: QUOC_GIA_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: ["diaDiemNavTabs"] });
    },
  });
};

export const useDeleteQuocGia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteQuocGiaApi(id),
    onSuccess: async () => {
      await revalidateTagAction("quoc-gia");
      qc.invalidateQueries({ queryKey: QUOC_GIA_KEYS.all });
      qc.invalidateQueries({ queryKey: QUOC_GIA_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: ["diaDiemNavTabs"] });
    },
  });
};

export const useSyncQuocGia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => syncQuocGiaApi(),
    onSuccess: async () => {
      await revalidateTagAction("quoc-gia");
      qc.invalidateQueries({ queryKey: QUOC_GIA_KEYS.all });
      qc.invalidateQueries({ queryKey: QUOC_GIA_KEYS.kpi() });
      qc.invalidateQueries({ queryKey: ["diaDiemNavTabs"] });
    },
  });
};
