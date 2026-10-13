import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  CreateDiaPhuongCapXaPayload,
  DiaPhuongCapXaFilter,
  UpdateDiaPhuongCapXaPayload,
} from "@/types/diaPhuongCapXa";

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Lấy danh sách xã/phường có phân trang và lọc theo TỉnhID
 * POST /api/DiaPhuongCapXaApi/Gets
 */
export const getDiaPhuongCapXaApi = async (
  filter: DiaPhuongCapXaFilter = { PageIndex: 1, PageSize: 50, TuKhoa: "", TrangThai: null, TinhID: null }
) => {
  const response = await api.post(
    `${APP_URL}/DiaPhuongCapXaApi/Gets`,
    {
      TinhID: filter.TinhID ?? null,
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
 * Lấy thông tin chi tiết một xã/phường theo ID
 * POST /api/DiaPhuongCapXaApi/Get
 */
export const getDiaPhuongCapXaByIdApi = async (id: number) => {
  const response = await api.post(
    `${APP_URL}/DiaPhuongCapXaApi/Get`,
    { Id: id },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Thêm mới xã/phường
 * POST /api/DiaPhuongCapXaApi/Add
 */
export const createDiaPhuongCapXaApi = async (payload: CreateDiaPhuongCapXaPayload) => {
  const response = await api.post(
    `${APP_URL}/DiaPhuongCapXaApi/Add`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Cập nhật thông tin xã/phường
 * PUT /api/DiaPhuongCapXaApi/Edit
 */
export const updateDiaPhuongCapXaApi = async (payload: UpdateDiaPhuongCapXaPayload) => {
  const response = await api.put(
    `${APP_URL}/DiaPhuongCapXaApi/Edit`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Xóa xã/phường theo ID
 * DELETE /api/DiaPhuongCapXaApi/Delete?XaID={id}
 */
export const deleteDiaPhuongCapXaApi = async (xaId: number) => {
  const response = await api.delete(
    `${APP_URL}/DiaPhuongCapXaApi/Delete`,
    {
      params: { XaID: xaId },
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Đồng bộ danh mục xã/phường từ dữ liệu chuẩn
 * POST /api/DiaPhuongCapXaApi/Sync
 */
export const syncDiaPhuongCapXaApi = async () => {
  const response = await api.post(
    `${APP_URL}/DiaPhuongCapXaApi/Sync`,
    {},
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};
