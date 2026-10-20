import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBaoHanhApi,
  getBaoHanhByIdApi,
  createBaoHanhApi,
  updateBaoHanhApi,
  deleteBaoHanhApi,
  getPhieuBaoHanhApi,
  getPhieuBaoHanhByIdApi,
  createPhieuBaoHanhApi,
  updatePhieuBaoHanhApi,
  chuyenTrangThaiPhieuBaoHanhApi,
  deletePhieuBaoHanhApi,
  getBaoHanhKPIApi,
  getPhieuBaoHanhKPIApi,
} from "@/shared/api/BaoHanh";
import {
  BaoHanhFilter,
  CreateBaoHanhPayload,
  PhieuBaoHanhFilter,
  CreatePhieuBaoHanhPayload,
} from "@/types/baoHanh";

export const BAO_HANH_KEYS = {
  soBaoHanhAll: ["so-bao-hanh"] as const,
  soBaoHanhList: (f: BaoHanhFilter) => [...BAO_HANH_KEYS.soBaoHanhAll, "list", f] as const,
  soBaoHanhDetail: (id: string) => [...BAO_HANH_KEYS.soBaoHanhAll, "detail", id] as const,
  phieuBaoHanhAll: ["phieu-bao-hanh"] as const,
  phieuBaoHanhList: (f: PhieuBaoHanhFilter) => [...BAO_HANH_KEYS.phieuBaoHanhAll, "list", f] as const,
  phieuBaoHanhDetail: (id: string) => [...BAO_HANH_KEYS.phieuBaoHanhAll, "detail", id] as const,
  // KPI nằm dưới prefix *All → mọi mutation invalidate *All sẽ tự làm mới KPI
  soBaoHanhKpi: () => [...BAO_HANH_KEYS.soBaoHanhAll, "kpi"] as const,
  phieuBaoHanhKpi: () => [...BAO_HANH_KEYS.phieuBaoHanhAll, "kpi"] as const,
};

/* ===== KPI ===== */
export const useGetBaoHanhKPI = () => {
  return useQuery({
    queryKey: BAO_HANH_KEYS.soBaoHanhKpi(),
    queryFn: () => getBaoHanhKPIApi(),
    placeholderData: (prev) => prev,
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });
};

export const useGetPhieuBaoHanhKPI = () => {
  return useQuery({
    queryKey: BAO_HANH_KEYS.phieuBaoHanhKpi(),
    queryFn: () => getPhieuBaoHanhKPIApi(),
    placeholderData: (prev) => prev,
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });
};

/* ===== Sổ bảo hành ===== */
export const useGetBaoHanh = (filter: BaoHanhFilter = {}) => {
  return useQuery({
    queryKey: BAO_HANH_KEYS.soBaoHanhList(filter),
    queryFn: () => getBaoHanhApi(filter),
    staleTime: 1000 * 30,
  });
};

export const useGetBaoHanhById = (id: string) => {
  return useQuery({
    queryKey: BAO_HANH_KEYS.soBaoHanhDetail(id),
    queryFn: () => getBaoHanhByIdApi(id),
    enabled: Boolean(id),
  });
};

export const useCreateBaoHanh = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBaoHanhPayload) => createBaoHanhApi(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BAO_HANH_KEYS.soBaoHanhAll });
      qc.invalidateQueries({ queryKey: ["serviceNavTabs"] });
    },
  });
};

export const useUpdateBaoHanh = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<CreateBaoHanhPayload> & { BaoHanhID: string }) =>
      updateBaoHanhApi(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: BAO_HANH_KEYS.soBaoHanhAll }),
  });
};

export const useDeleteBaoHanh = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBaoHanhApi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BAO_HANH_KEYS.soBaoHanhAll });
      qc.invalidateQueries({ queryKey: ["serviceNavTabs"] });
    },
  });
};

/* ===== Phiếu tiếp nhận bảo hành ===== */
export const useGetPhieuBaoHanh = (filter: PhieuBaoHanhFilter = {}) => {
  return useQuery({
    queryKey: BAO_HANH_KEYS.phieuBaoHanhList(filter),
    queryFn: () => getPhieuBaoHanhApi(filter),
    staleTime: 1000 * 30,
  });
};

export const useGetPhieuBaoHanhById = (id: string) => {
  return useQuery({
    queryKey: BAO_HANH_KEYS.phieuBaoHanhDetail(id),
    queryFn: () => getPhieuBaoHanhByIdApi(id),
    enabled: Boolean(id),
  });
};

export const useCreatePhieuBaoHanh = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePhieuBaoHanhPayload) => createPhieuBaoHanhApi(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BAO_HANH_KEYS.phieuBaoHanhAll });
      qc.invalidateQueries({ queryKey: ["serviceNavTabs"] });
    },
  });
};

export const useUpdatePhieuBaoHanh = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<CreatePhieuBaoHanhPayload> & { PhieuBaoHanhID: string }) =>
      updatePhieuBaoHanhApi(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: BAO_HANH_KEYS.phieuBaoHanhAll }),
  });
};

export const useChuyenTrangThaiPhieuBaoHanh = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { PhieuBaoHanhID: string; TrangThaiID: number; GhiChu?: string }) =>
      chuyenTrangThaiPhieuBaoHanhApi(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: BAO_HANH_KEYS.phieuBaoHanhAll }),
  });
};

export const useDeletePhieuBaoHanh = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePhieuBaoHanhApi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BAO_HANH_KEYS.phieuBaoHanhAll });
      qc.invalidateQueries({ queryKey: ["serviceNavTabs"] });
    },
  });
};

export { useGetServiceNavTabs } from "../SuaChua/useSuaChuaApi";

