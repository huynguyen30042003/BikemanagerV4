import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getQuocGiaApi,
  getQuocGiaByIdApi,
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

export const QUOC_GIA_KEYS = {
  all: ["quocGia"] as const,
  list: (params?: object) => [...QUOC_GIA_KEYS.all, "list", params] as const,
  detail: (id: number) => [...QUOC_GIA_KEYS.all, "detail", id] as const,
};

export const useGetQuocGia = (params: QuocGiaFilter) =>
  useQuery({
    queryKey: QUOC_GIA_KEYS.list(params),
    queryFn: () => getQuocGiaApi(params),
    staleTime: 1000 * 60 * 10,
  });

export const useGetQuocGiaById = (id?: number) =>
  useQuery({
    queryKey: QUOC_GIA_KEYS.detail(id ?? 0),
    queryFn: () => (id ? getQuocGiaByIdApi(id) : null),
    enabled: typeof id === "number" && id > 0,
    staleTime: 1000 * 60 * 5,
  });

export const useCreateQuocGia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateQuocGiaPayload) => createQuocGiaApi(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUOC_GIA_KEYS.all });
      qc.invalidateQueries({ queryKey: ["diaDiemNavTabs"] });
    },
  });
};

export const useUpdateQuocGia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateQuocGiaPayload) => updateQuocGiaApi(body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: QUOC_GIA_KEYS.all });
      qc.invalidateQueries({ queryKey: QUOC_GIA_KEYS.detail(vars.QuocGiaID) });
      qc.invalidateQueries({ queryKey: ["diaDiemNavTabs"] });
    },
  });
};

export const useDeleteQuocGia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteQuocGiaApi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUOC_GIA_KEYS.all });
      qc.invalidateQueries({ queryKey: ["diaDiemNavTabs"] });
    },
  });
};

export const useSyncQuocGia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => syncQuocGiaApi(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUOC_GIA_KEYS.all });
      qc.invalidateQueries({ queryKey: ["diaDiemNavTabs"] });
    },
  });

};
