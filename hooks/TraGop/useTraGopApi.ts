import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDonViTraGopApi,
  getDonViTraGopByIdApi,
  createDonViTraGopApi,
  updateDonViTraGopApi,
  deleteDonViTraGopApi,
  getHopDongTraGopApi,
  getHopDongTraGopByIdApi,
  getHopDongTraGopByDonHangApi,
  createHopDongTraGopApi,
  updateHopDongTraGopApi,
  chuyenTrangThaiHopDongApi,
  xacNhanGiaiNganApi,
  tinhDuToanTraGopApi,
  deleteHopDongTraGopApi,
  getTraGopNavTabsApi,
} from "@/shared/api/TraGop";
import {
  DonViTraGopFilter,
  CreateDonViTraGopPayload,
  UpdateDonViTraGopPayload,
  HopDongTraGopFilter,
  CreateHopDongTraGopPayload,
  UpdateHopDongTraGopPayload,
  ChuyenTrangThaiHopDongPayload,
  XacNhanGiaiNganPayload,
  TinhDuToanTraGopPayload,
} from "@/types/traGop";

export const TRA_GOP_KEYS = {
  donViAll: ["don-vi-tra-gop"] as const,
  donViList: (f: DonViTraGopFilter) => [...TRA_GOP_KEYS.donViAll, "list", f] as const,
  donViDetail: (id: string) => [...TRA_GOP_KEYS.donViAll, "detail", id] as const,
  hopDongAll: ["hop-dong-tra-gop"] as const,
  hopDongList: (f: HopDongTraGopFilter) => [...TRA_GOP_KEYS.hopDongAll, "list", f] as const,
  hopDongDetail: (id: string) => [...TRA_GOP_KEYS.hopDongAll, "detail", id] as const,
  hopDongByDonHang: (donHangID: string) =>
    [...TRA_GOP_KEYS.hopDongAll, "by-don-hang", donHangID] as const,
  navTabs: () => ["traGopNavTabs"] as const,
};

export const useGetTraGopNavTabs = () => {
  return useQuery({
    queryKey: TRA_GOP_KEYS.navTabs(),
    queryFn: () => getTraGopNavTabsApi(),
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });
};

/* ===== 1. ĐƠN VỊ TRẢ GÓP ===== */

export const useGetDonViTraGop = (filter: DonViTraGopFilter = {}) => {
  return useQuery({
    queryKey: TRA_GOP_KEYS.donViList(filter),
    queryFn: () => getDonViTraGopApi(filter),
    staleTime: 1000 * 60,
  });
};

export const useGetDonViTraGopById = (id?: string) => {
  return useQuery({
    queryKey: TRA_GOP_KEYS.donViDetail(id || ""),
    queryFn: () => getDonViTraGopByIdApi(id!),
    enabled: Boolean(id),
  });
};

export const useCreateDonViTraGop = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDonViTraGopPayload) => createDonViTraGopApi(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TRA_GOP_KEYS.donViAll });
      qc.invalidateQueries({ queryKey: TRA_GOP_KEYS.navTabs() });
    },
  });
};

export const useUpdateDonViTraGop = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateDonViTraGopPayload) => updateDonViTraGopApi(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TRA_GOP_KEYS.donViAll });
      qc.invalidateQueries({ queryKey: TRA_GOP_KEYS.navTabs() });
    },
  });
};

export const useDeleteDonViTraGop = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDonViTraGopApi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TRA_GOP_KEYS.donViAll });
      qc.invalidateQueries({ queryKey: TRA_GOP_KEYS.navTabs() });
    },
  });
};


/* ===== 2. HỢP ĐỒNG TRẢ GÓP ===== */

export const useGetHopDongTraGop = (filter: HopDongTraGopFilter = {}) => {
  return useQuery({
    queryKey: TRA_GOP_KEYS.hopDongList(filter),
    queryFn: () => getHopDongTraGopApi(filter),
    staleTime: 1000 * 30,
  });
};

export const useGetHopDongTraGopById = (id?: string) => {
  return useQuery({
    queryKey: TRA_GOP_KEYS.hopDongDetail(id || ""),
    queryFn: () => getHopDongTraGopByIdApi(id!),
    enabled: Boolean(id),
  });
};

export const useGetHopDongTraGopByDonHang = (donHangID?: string) => {
  return useQuery({
    queryKey: TRA_GOP_KEYS.hopDongByDonHang(donHangID || ""),
    queryFn: () => getHopDongTraGopByDonHangApi(donHangID!),
    enabled: Boolean(donHangID),
  });
};

export const useCreateHopDongTraGop = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateHopDongTraGopPayload) => createHopDongTraGopApi(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TRA_GOP_KEYS.hopDongAll });
      qc.invalidateQueries({ queryKey: TRA_GOP_KEYS.navTabs() });
    },
  });
};

export const useUpdateHopDongTraGop = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateHopDongTraGopPayload) => updateHopDongTraGopApi(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TRA_GOP_KEYS.hopDongAll });
      qc.invalidateQueries({ queryKey: TRA_GOP_KEYS.navTabs() });
    },
  });
};

export const useChuyenTrangThaiHopDong = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ChuyenTrangThaiHopDongPayload) =>
      chuyenTrangThaiHopDongApi(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TRA_GOP_KEYS.hopDongAll });
      qc.invalidateQueries({ queryKey: TRA_GOP_KEYS.navTabs() });
    },
  });
};

export const useXacNhanGiaiNgan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: XacNhanGiaiNganPayload) => xacNhanGiaiNganApi(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TRA_GOP_KEYS.hopDongAll });
      qc.invalidateQueries({ queryKey: TRA_GOP_KEYS.navTabs() });
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useTinhDuToanTraGop = () => {
  return useMutation({
    mutationFn: (payload: TinhDuToanTraGopPayload) => tinhDuToanTraGopApi(payload),
  });
};

export const useDeleteHopDongTraGop = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteHopDongTraGopApi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TRA_GOP_KEYS.hopDongAll });
      qc.invalidateQueries({ queryKey: TRA_GOP_KEYS.navTabs() });
    },
  });
};

