import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNhaCungCapApi,
  getNhaCungCapByIdApi,
  getNhaCungCapKPIApi,
  getPurchaseNavTabsApi,
  createNhaCungCapApi,
  updateNhaCungCapApi,
  deleteNhaCungCapApi,
} from "@/shared/api/NhaCungCap";
import {
  CreateNhaCungCapPayload,
  NhaCungCapFilter,
  UpdateNhaCungCapPayload,
  NhaCungCapKPI,
} from "@/types/nhaCungCap";
import { revalidateTagAction } from "@/app/actions/revalidate";

export const NHA_CUNG_CAP_KEYS = {
  all: ["nhaCungCap"] as const,
  list: (params?: object) => [...NHA_CUNG_CAP_KEYS.all, "list", params] as const,
  detail: (id: string) => [...NHA_CUNG_CAP_KEYS.all, "detail", id] as const,
  kpi: () => [...NHA_CUNG_CAP_KEYS.all, "kpi"] as const,
  navTabs: () => ["purchaseNavTabs"] as const,
};

export const useGetPurchaseNavTabs = () =>
  useQuery({
    queryKey: NHA_CUNG_CAP_KEYS.navTabs(),
    queryFn: () => getPurchaseNavTabsApi(),
    staleTime: 1000 * 60 * 60 * 24, // 24 giờ
    gcTime: 1000 * 60 * 60 * 48,
    refetchOnWindowFocus: false,
  });

export const useGetNhaCungCap = (params: NhaCungCapFilter) =>
  useQuery({
    queryKey: NHA_CUNG_CAP_KEYS.list(params),
    queryFn: () => getNhaCungCapApi(params),
    staleTime: 1000 * 60 * 60 * 24, // 24 giờ
    gcTime: 1000 * 60 * 60 * 48,
    refetchOnWindowFocus: false,
  });

export const useGetNhaCungCapKPI = () =>
  useQuery({
    queryKey: NHA_CUNG_CAP_KEYS.kpi(),
    queryFn: async () => {
      const res = await getNhaCungCapKPIApi();
      return (res?.data ?? res) as NhaCungCapKPI;
    },
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 60, // 1 giờ
    refetchOnWindowFocus: false,
  });

export const useGetNhaCungCapById = (id?: string) =>
  useQuery({
    queryKey: NHA_CUNG_CAP_KEYS.detail(id ?? ""),
    queryFn: () => (id ? getNhaCungCapByIdApi(id) : null),
    enabled: !!id,
    staleTime: 1000 * 60 * 60 * 24, // 24 giờ
    gcTime: 1000 * 60 * 60 * 48,
    refetchOnWindowFocus: false,
  });

export const useCreateNhaCungCap = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateNhaCungCapPayload) => createNhaCungCapApi(body),
    onSuccess: async () => {
      await revalidateTagAction("nha-cung-cap");
      await revalidateTagAction("nha-cung-cap-nav-tabs");
      qc.invalidateQueries({ queryKey: NHA_CUNG_CAP_KEYS.all });
      qc.invalidateQueries({ queryKey: ["purchaseNavTabs"] });
      qc.invalidateQueries({ queryKey: NHA_CUNG_CAP_KEYS.kpi() });
    },
  });
};

export const useUpdateNhaCungCap = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateNhaCungCapPayload) => updateNhaCungCapApi(body),
    onSuccess: async () => {
      await revalidateTagAction("nha-cung-cap");
      await revalidateTagAction("nha-cung-cap-nav-tabs");
      qc.invalidateQueries({ queryKey: NHA_CUNG_CAP_KEYS.all });
      qc.invalidateQueries({ queryKey: ["purchaseNavTabs"] });
      qc.invalidateQueries({ queryKey: NHA_CUNG_CAP_KEYS.kpi() });
    },
  });
};

export const useDeleteNhaCungCap = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNhaCungCapApi(id),
    onSuccess: async () => {
      await revalidateTagAction("nha-cung-cap");
      await revalidateTagAction("nha-cung-cap-nav-tabs");
      qc.invalidateQueries({ queryKey: NHA_CUNG_CAP_KEYS.all });
      qc.invalidateQueries({ queryKey: ["purchaseNavTabs"] });
      qc.invalidateQueries({ queryKey: NHA_CUNG_CAP_KEYS.kpi() });
    },
  });
};
