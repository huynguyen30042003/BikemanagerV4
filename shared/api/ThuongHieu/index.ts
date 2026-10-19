import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  CreateThuongHieuPayload,
  ThuongHieuFilter,
  UpdateThuongHieuPayload,
} from "@/types/thuongHieu";

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
 * Lấy danh sách thương hiệu / hãng sản xuất
 * POST /api/ThuongHieuApi/Gets
 */
export const getThuongHieuApi = async (
  filter: ThuongHieuFilter = { PageIndex: 1, PageSize: 50, TuKhoa: "", TrangThai: null }
) => {
  const response = await api.post(
    `${APP_URL}/ThuongHieuApi/Gets`,
    {
      TuKhoa: filter.TuKhoa ?? "",
      PageIndex: filter.PageIndex ?? 1,
      PageSize: filter.PageSize ?? 50,
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
 * Lấy chi tiết thương hiệu theo GuidId
 * POST /api/ThuongHieuApi/Get
 */
export const getThuongHieuByIdApi = async (id: string) => {
  const response = await api.post(
    `${APP_URL}/ThuongHieuApi/Get`,
    { GuidId: id },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Thêm mới thương hiệu (FormData)
 * POST /api/ThuongHieuApi/Add
 */
export const createThuongHieuApi = async (payload: CreateThuongHieuPayload) => {
  const formData = new FormData();
  formData.append("MaThuongHieu", payload.MaThuongHieu);
  formData.append("TenThuongHieu", payload.TenThuongHieu);
  formData.append("DuongDan", payload.DuongDan);
  if (payload.QuocGiaID != null) formData.append("QuocGiaID", String(payload.QuocGiaID));
  if (payload.QuocGia) formData.append("QuocGia", payload.QuocGia);
  if (payload.MoTa) formData.append("MoTa", payload.MoTa);
  formData.append("ThuTu", String(payload.ThuTu ?? 0));
  formData.append("TrangThai", String(payload.TrangThai));

  if (payload.file) {
    formData.append("file", payload.file);
  }

  const response = await api.post(
    `${APP_URL}/ThuongHieuApi/Add`,
    formData,
    {
      headers: getAuthFormDataHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Cập nhật thông tin thương hiệu (FormData)
 * POST /api/ThuongHieuApi/Edit
 */
export const updateThuongHieuApi = async (payload: UpdateThuongHieuPayload) => {
  const formData = new FormData();
  formData.append("ThuongHieuID", payload.ThuongHieuID);
  formData.append("MaThuongHieu", payload.MaThuongHieu);
  formData.append("TenThuongHieu", payload.TenThuongHieu);
  formData.append("DuongDan", payload.DuongDan);
  if (payload.QuocGiaID != null) formData.append("QuocGiaID", String(payload.QuocGiaID));
  if (payload.QuocGia) formData.append("QuocGia", payload.QuocGia);
  if (payload.MoTa) formData.append("MoTa", payload.MoTa);
  formData.append("ThuTu", String(payload.ThuTu ?? 0));
  formData.append("TrangThai", String(payload.TrangThai));
  if (payload.XoaFile != null) formData.append("XoaFile", String(payload.XoaFile));

  if (payload.file) {
    formData.append("file", payload.file);
  }

  const response = await api.post(
    `${APP_URL}/ThuongHieuApi/Edit`,
    formData,
    {
      headers: getAuthFormDataHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Xóa thương hiệu theo ID
 * POST /api/ThuongHieuApi/Delete
 */
export const deleteThuongHieuApi = async (id: string) => {
  const response = await api.post(
    `${APP_URL}/ThuongHieuApi/Delete`,
    { ThuongHieuID: id },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};
