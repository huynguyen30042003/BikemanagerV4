import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  CreateDiaDiemPayload,
  DiaDiemFilter,
  UpdateDiaDiemPayload,
  DD_NavTabs,
  DiaDiemKPI,
} from "@/types/diaDiem";

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const getAuthFormDataHeaders = () => {
  const token = getAccessToken();
  return {
    "Content-Type": "multipart/form-data",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Lấy danh sách địa điểm / chi nhánh có phân trang và tìm kiếm (qua Next.js BFF Route Cache)
 * GET /api/dia-diem
 */
export const getDiaDiemApi = async (
  filter: DiaDiemFilter = {
    PageIndex: 1,
    PageSize: 20,
    TuKhoa: "",
    TrangThai: null,
    TinhID: null,
  }
) => {
  const params = new URLSearchParams();
  if (filter.TuKhoa) {
    params.set("TuKhoa", filter.TuKhoa);
  }
  if (filter.TinhID !== undefined && filter.TinhID !== null) {
    params.set("TinhID", String(filter.TinhID));
  }
  if (filter.PageIndex) {
    params.set("PageIndex", String(filter.PageIndex));
  }
  if (filter.PageSize) {
    params.set("PageSize", String(filter.PageSize));
  }
  if (filter.TrangThai !== undefined && filter.TrangThai !== null) {
    params.set("TrangThai", String(filter.TrangThai));
  }

  const response = await fetch(`/api/dia-diem?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Lỗi tải danh mục địa điểm: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Lấy chi tiết thông tin một địa điểm theo GuidId (qua Next.js BFF Route Cache)
 * GET /api/dia-diem/[id]
 */
export const getDiaDiemByIdApi = async (id: string) => {
  const response = await fetch(`/api/dia-diem/${id}`);
  if (!response.ok) {
    throw new Error(`Lỗi tải chi tiết địa điểm ID ${id}: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Thêm mới địa điểm cửa hàng / showroom (FormData)
 * POST /api/DiaDiemApi/Add
 */
export const createDiaDiemApi = async (payload: CreateDiaDiemPayload) => {
  const formData = new FormData();
  if (payload.DiaDiemCapChaID)
    formData.append("DiaDiemCapChaID", payload.DiaDiemCapChaID);
  formData.append("LoaiDiaDiemID", String(payload.LoaiDiaDiemID));
  formData.append("TenDiaDiem", payload.TenDiaDiem);
  if (payload.MoTa) formData.append("MoTa", payload.MoTa);
  formData.append("TinhID", String(payload.TinhID));
  formData.append("XaID", String(payload.XaID));
  if (payload.KinhDo != null) formData.append("KinhDo", String(payload.KinhDo));
  if (payload.ViDo != null) formData.append("ViDo", String(payload.ViDo));
  formData.append("DiaChiSo", payload.DiaChiSo);
  formData.append("TrangThai", String(payload.TrangThai));

  if (payload.file) {
    formData.append("file", payload.file);
  }

  const response = await api.post(`${APP_URL}/DiaDiemApi/Add`, formData, {
    headers: getAuthFormDataHeaders(),
    withCredentials: true,
  });

  return response.data;
};

/**
 * Cập nhật thông tin địa điểm (FormData)
 * POST /api/DiaDiemApi/Edit
 */
export const updateDiaDiemApi = async (payload: UpdateDiaDiemPayload) => {
  const formData = new FormData();
  formData.append("DiaDiemID", payload.DiaDiemID);
  if (payload.DiaDiemCapChaID)
    formData.append("DiaDiemCapChaID", payload.DiaDiemCapChaID);
  formData.append("LoaiDiaDiemID", String(payload.LoaiDiaDiemID));
  formData.append("TenDiaDiem", payload.TenDiaDiem);
  if (payload.MoTa) formData.append("MoTa", payload.MoTa);
  formData.append("TinhID", String(payload.TinhID));
  formData.append("XaID", String(payload.XaID));
  if (payload.KinhDo != null) formData.append("KinhDo", String(payload.KinhDo));
  if (payload.ViDo != null) formData.append("ViDo", String(payload.ViDo));
  formData.append("DiaChiSo", payload.DiaChiSo);
  formData.append("TrangThai", String(payload.TrangThai));
  formData.append("AnhDaiDien", String(payload.AnhDaiDien));
  formData.append("XoaFile", String(Boolean(payload.XoaFile)));

  if (payload.file) {
    formData.append("file", payload.file);
  }

  const response = await api.post(`${APP_URL}/DiaDiemApi/Edit`, formData, {
    headers: getAuthFormDataHeaders(),
    withCredentials: true,
  });

  return response.data;
};

/**
 * Xóa địa điểm theo ID
 * DELETE /api/DiaDiemApi/Delete?DiaDiemID={id}
 */
export const deleteDiaDiemApi = async (diaDiemId: string) => {
  const response = await api.delete(`${APP_URL}/DiaDiemApi/Delete`, {
    params: { DiaDiemID: diaDiemId },
    headers: getAuthHeaders(),
    withCredentials: true,
  });

  return response.data;
};

/**
 * Lấy số lượng thống kê cho các tabs địa bàn & cơ sở (qua Next.js BFF Route Cache)
 * GET /api/dia-diem/nav-tabs
 */
export const getDiaDiemNavTabsApi = async (): Promise<DD_NavTabs> => {
  const response = await fetch(`/api/dia-diem/nav-tabs`);
  if (!response.ok) {
    throw new Error(`Lỗi tải NavTabs địa điểm: ${response.statusText}`);
  }
  const json = await response.json();
  return json?.data ?? json;
};

/**
 * Lấy dữ liệu thống kê KPI địa điểm cơ sở / showroom (qua Next.js BFF Route Cache)
 * GET /api/dia-diem/kpi
 */
export const getDiaDiemKPIApi = async (): Promise<DiaDiemKPI> => {
  const response = await fetch(`/api/dia-diem/kpi`);
  if (!response.ok) {
    throw new Error(`Lỗi tải dữ liệu KPI địa điểm: ${response.statusText}`);
  }
  const json = await response.json();
  return json?.data ?? json;
};
