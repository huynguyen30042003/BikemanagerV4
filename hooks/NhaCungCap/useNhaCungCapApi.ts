import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNhaCungCapApi,
  getNhaCungCapByIdApi,
  createNhaCungCapApi,
  updateNhaCungCapApi,
  deleteNhaCungCapApi,
} from "@/shared/api/NhaCungCap";
import {
  CreateNhaCungCapPayload,
  NhaCungCapFilter,
  UpdateNhaCungCapPayload,
} from "@/types/nhaCungCap";

export const NHA_CUNG_CAP_KEYS = {
  all: ["nhaCungCap"] as const,
  list: (params?: object) => [...NHA_CUNG_CAP_KEYS.all, "list", params] as const,
  detail: (id: string) => [...NHA_CUNG_CAP_KEYS.all, "detail", id] as const,
};

export const useGetNhaCungCap = (params: NhaCungCapFilter) =>
  useQuery({
    queryKey: NHA_CUNG_CAP_KEYS.list(params),
    queryFn: () => getNhaCungCapApi(params),
    staleTime: 1000 * 60 * 5,
  });

export const useGetNhaCungCapById = (id?: string) =>
  useQuery({
    queryKey: NHA_CUNG_CAP_KEYS.detail(id ?? ""),
    queryFn: () => (id ? getNhaCungCapByIdApi(id) : null),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

export const useCreateNhaCungCap = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateNhaCungCapPayload) => createNhaCungCapApi(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NHA_CUNG_CAP_KEYS.all });
    },
  });
};

export const useUpdateNhaCungCap = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateNhaCungCapPayload) => updateNhaCungCapApi(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NHA_CUNG_CAP_KEYS.all });
    },
  });
};

export const useDeleteNhaCungCap = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNhaCungCapApi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NHA_CUNG_CAP_KEYS.all });
    },
  });
};
