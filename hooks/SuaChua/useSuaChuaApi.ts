import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDichVuApi,
  getDichVuByIdApi,
  createDichVuApi,
  updateDichVuApi,
  deleteDichVuApi,
  getPhieuSuaChuaApi,
  getPhieuSuaChuaByIdApi,
  createPhieuSuaChuaApi,
  updatePhieuSuaChuaApi,
  chuyenTrangThaiSuaChuaApi,
  hoanThanhVaGiaoXeSuaChuaApi,
  getLichSuThanhToanSuaChuaApi,
  addLichSuThanhToanSuaChuaApi,
  thanhToanSuaChuaApi,
  deletePhieuSuaChuaApi,
} from "@/shared/api/SuaChua";
import {
  DichVuFilter,
  CreateDichVuPayload,
  UpdateDichVuPayload,
  PhieuSuaChuaFilter,
  CreatePhieuSuaChuaPayload,
  AddLichSuThanhToanSuaChuaPayload,
  ThanhToanSuaChuaPayload,
} from "@/types/suaChua";

export const SUA_CHUA_KEYS = {
  dichVuAll: ["sc-dich-vu"] as const,
  dichVuList: (f: DichVuFilter) => [...SUA_CHUA_KEYS.dichVuAll, "list", f] as const,
  dichVuDetail: (id: string) => [...SUA_CHUA_KEYS.dichVuAll, "detail", id] as const,
  phieuAll: ["sc-phieu"] as const,
  phieuList: (f: PhieuSuaChuaFilter) => [...SUA_CHUA_KEYS.phieuAll, "list", f] as const,
  phieuDetail: (id: string) => [...SUA_CHUA_KEYS.phieuAll, "detail", id] as const,
  phieuPayments: (id: string) => [...SUA_CHUA_KEYS.phieuAll, "payments", id] as const,
};

/* ===== Danh mục Dịch vụ ===== */
export const useGetDichVu = (filter: DichVuFilter = {}) => {
  return useQuery({
    queryKey: SUA_CHUA_KEYS.dichVuList(filter),
    queryFn: () => getDichVuApi(filter),
    staleTime: 1000 * 60,
  });
};

export const useGetDichVuById = (id: string) => {
  return useQuery({
    queryKey: SUA_CHUA_KEYS.dichVuDetail(id),
    queryFn: () => getDichVuByIdApi(id),
    enabled: Boolean(id),
  });
};

export const useCreateDichVu = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDichVuPayload) => createDichVuApi(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUA_CHUA_KEYS.dichVuAll }),
  });
};

export const useUpdateDichVu = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateDichVuPayload) => updateDichVuApi(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUA_CHUA_KEYS.dichVuAll }),
  });
};

export const useDeleteDichVu = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDichVuApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUA_CHUA_KEYS.dichVuAll }),
  });
};

/* ===== Phiếu sửa chữa ===== */
export const useGetPhieuSuaChua = (filter: PhieuSuaChuaFilter = {}) => {
  return useQuery({
    queryKey: SUA_CHUA_KEYS.phieuList(filter),
    queryFn: () => getPhieuSuaChuaApi(filter),
    staleTime: 1000 * 30,
  });
};

export const useGetPhieuSuaChuaById = (id: string) => {
  return useQuery({
    queryKey: SUA_CHUA_KEYS.phieuDetail(id),
    queryFn: () => getPhieuSuaChuaByIdApi(id),
    enabled: Boolean(id),
  });
};

export const useGetLichSuThanhToanSuaChua = (phieuSuaChuaId: string) => {
  return useQuery({
    queryKey: SUA_CHUA_KEYS.phieuPayments(phieuSuaChuaId),
    queryFn: () => getLichSuThanhToanSuaChuaApi(phieuSuaChuaId),
    enabled: Boolean(phieuSuaChuaId),
  });
};

export const useCreatePhieuSuaChua = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePhieuSuaChuaPayload) => createPhieuSuaChuaApi(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUA_CHUA_KEYS.phieuAll }),
  });
};

export const useUpdatePhieuSuaChua = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<CreatePhieuSuaChuaPayload> & { PhieuSuaChuaID: string }) =>
      updatePhieuSuaChuaApi(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUA_CHUA_KEYS.phieuAll }),
  });
};

export const useChuyenTrangThaiSuaChua = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { PhieuSuaChuaID: string; TrangThaiID: number; GhiChu?: string }) =>
      chuyenTrangThaiSuaChuaApi(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUA_CHUA_KEYS.phieuAll }),
  });
};

export const useHoanThanhVaGiaoXeSuaChua = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => hoanThanhVaGiaoXeSuaChuaApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUA_CHUA_KEYS.phieuAll }),
  });
};

export const useAddLichSuThanhToanSuaChua = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddLichSuThanhToanSuaChuaPayload) => addLichSuThanhToanSuaChuaApi(payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: SUA_CHUA_KEYS.phieuAll });
      qc.invalidateQueries({ queryKey: SUA_CHUA_KEYS.phieuPayments(vars.PhieuSuaChuaID) });
    },
  });
};

export const useThanhToanSuaChua = useAddLichSuThanhToanSuaChua;

export const useDeletePhieuSuaChua = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePhieuSuaChuaApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUA_CHUA_KEYS.phieuAll }),
  });
};
