import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  CreateQuocGiaPayload,
  QuocGiaFilter,
  UpdateQuocGiaPayload,
} from "@/types/quocGia";

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Lấy danh sách quốc gia có phân trang và tìm kiếm
 * POST /api/QuocGiaApi/Gets
 */
export const getQuocGiaApi = async (
  filter: QuocGiaFilter = { PageIndex: 1, PageSize: 50, TuKhoa: "", TrangThai: null }
) => {
  const response = await api.post(
    `${APP_URL}/QuocGiaApi/Gets`,
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
 * Lấy chi tiết thông tin một quốc gia theo ID
 * POST /api/QuocGiaApi/Get
 */
export const getQuocGiaByIdApi = async (id: number) => {
  const response = await api.post(
    `${APP_URL}/QuocGiaApi/Get`,
    { Id: id },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Thêm mới quốc gia
 * POST /api/QuocGiaApi/Add
 */
export const createQuocGiaApi = async (payload: CreateQuocGiaPayload) => {
  const response = await api.post(
    `${APP_URL}/QuocGiaApi/Add`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Cập nhật thông tin quốc gia
 * PUT /api/QuocGiaApi/Edit
 */
export const updateQuocGiaApi = async (payload: UpdateQuocGiaPayload) => {
  const response = await api.put(
    `${APP_URL}/QuocGiaApi/Edit`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Xóa quốc gia theo ID
 * DELETE /api/QuocGiaApi/Delete?QuocGiaID={id}
 */
export const deleteQuocGiaApi = async (quocGiaId: number) => {
  const response = await api.delete(
    `${APP_URL}/QuocGiaApi/Delete`,
    {
      params: { QuocGiaID: quocGiaId },
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Đồng bộ danh mục quốc gia từ file dữ liệu chuẩn
 * POST /api/QuocGiaApi/Sync
 */
export const syncQuocGiaApi = async () => {
  const response = await api.post(
    `${APP_URL}/QuocGiaApi/Sync`,
    {},
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};
