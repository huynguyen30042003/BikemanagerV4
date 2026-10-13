import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  CreateDiaDiemPayload,
  DiaDiemFilter,
  UpdateDiaDiemPayload,
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
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Lấy danh sách địa điểm / chi nhánh có phân trang và tìm kiếm
 * POST /api/DiaDiemApi/Gets
 */
export const getDiaDiemApi = async (
  filter: DiaDiemFilter = { PageIndex: 1, PageSize: 20, TuKhoa: "", TrangThai: null, TinhID: null }
) => {
  const response = await api.post(
    `${APP_URL}/DiaDiemApi/Gets`,
    {
      TuKhoa: filter.TuKhoa ?? "",
      TinhID: filter.TinhID ?? null,
      PageIndex: filter.PageIndex ?? 1,
      PageSize: filter.PageSize ?? 20,
      TrangThai: filter.TrangThai ?? null,
    },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Lấy chi tiết thông tin một địa điểm theo GuidId
 * POST /api/DiaDiemApi/Get
 */
export const getDiaDiemByIdApi = async (id: string) => {
  const response = await api.post(
    `${APP_URL}/DiaDiemApi/Get`,
    { GuidId: id },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Thêm mới địa điểm cửa hàng / showroom (FormData)
 * POST /api/DiaDiemApi/Add
 */
export const createDiaDiemApi = async (payload: CreateDiaDiemPayload) => {
  const formData = new FormData();
  if (payload.DiaDiemCapChaID) formData.append("DiaDiemCapChaID", payload.DiaDiemCapChaID);
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

  const response = await api.post(
    `${APP_URL}/DiaDiemApi/Add`,
    formData,
    {
      headers: getAuthFormDataHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Cập nhật thông tin địa điểm (FormData)
 * POST /api/DiaDiemApi/Edit
 */
export const updateDiaDiemApi = async (payload: UpdateDiaDiemPayload) => {
  const formData = new FormData();
  formData.append("DiaDiemID", payload.DiaDiemID);
  if (payload.DiaDiemCapChaID) formData.append("DiaDiemCapChaID", payload.DiaDiemCapChaID);
  formData.append("LoaiDiaDiemID", String(payload.LoaiDiaDiemID));
  formData.append("TenDiaDiem", payload.TenDiaDiem);
  if (payload.MoTa) formData.append("MoTa", payload.MoTa);
  formData.append("TinhID", String(payload.TinhID));
  formData.append("XaID", String(payload.XaID));
  if (payload.KinhDo != null) formData.append("KinhDo", String(payload.KinhDo));
  if (payload.ViDo != null) formData.append("ViDo", String(payload.ViDo));
  formData.append("DiaChiSo", payload.DiaChiSo);
  formData.append("TrangThai", String(payload.TrangThai));
  formData.append("XoaFile", String(Boolean(payload.XoaFile)));

  if (payload.file) {
    formData.append("file", payload.file);
  }

  const response = await api.post(
    `${APP_URL}/DiaDiemApi/Edit`,
    formData,
    {
      headers: getAuthFormDataHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Xóa địa điểm theo ID
 * DELETE /api/DiaDiemApi/Delete?DiaDiemID={id}
 */
export const deleteDiaDiemApi = async (diaDiemId: string) => {
  const response = await api.delete(
    `${APP_URL}/DiaDiemApi/Delete`,
    {
      params: { DiaDiemID: diaDiemId },
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};
