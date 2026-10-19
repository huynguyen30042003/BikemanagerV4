import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import { CreateKhoPayload, KhoFilter, UpdateKhoPayload } from "@/types/kho";

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Lấy danh sách kho hàng có phân trang và tìm kiếm
 * POST /api/KhoApi/Gets
 */
export const getKhoApi = async (
  filter: KhoFilter = { PageIndex: 1, PageSize: 50, TuKhoa: "", TrangThai: null }
) => {
  const response = await api.post(
    `${APP_URL}/KhoApi/Gets`,
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
 * Lấy chi tiết thông tin kho hàng theo ID
 * POST /api/KhoApi/Get
 */
export const getKhoByIdApi = async (id: string) => {
  const response = await api.post(
    `${APP_URL}/KhoApi/Get`,
    { GuidId: id },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Thêm mới kho hàng hoặc bãi lưu trữ xe
 * POST /api/KhoApi/Add
 */
export const createKhoApi = async (payload: CreateKhoPayload) => {
  const response = await api.post(
    `${APP_URL}/KhoApi/Add`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Cập nhật thông tin kho hàng
 * POST /api/KhoApi/Edit
 */
export const updateKhoApi = async (payload: UpdateKhoPayload) => {
  const response = await api.post(
    `${APP_URL}/KhoApi/Edit`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Xóa kho hàng theo ID
 * POST /api/KhoApi/Delete
 */
export const deleteKhoApi = async (id: string) => {
  const response = await api.post(
    `${APP_URL}/KhoApi/Delete`,
    { KhoID: id },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};
