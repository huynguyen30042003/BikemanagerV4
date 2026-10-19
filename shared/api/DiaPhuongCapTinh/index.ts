import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  CreateDiaPhuongCapTinhPayload,
  DiaPhuongCapTinhFilter,
  UpdateDiaPhuongCapTinhPayload,
  DiaPhuongCapTinhKPI,
} from "@/types/diaPhuongCapTinh";

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Lấy danh sách tỉnh/thành phố có tìm kiếm và phân trang
 * POST /api/DiaPhuongCapTinhApi/Gets
 */
export const getDiaPhuongCapTinhApi = async (
  filter: DiaPhuongCapTinhFilter = { PageIndex: 1, PageSize: 50, TuKhoa: "", TrangThai: null }
) => {
  const response = await api.post(
    `${APP_URL}/DiaPhuongCapTinhApi/Gets`,
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
 * Lấy chi tiết thông tin một tỉnh/thành phố theo ID
 * POST /api/DiaPhuongCapTinhApi/Get
 */
export const getDiaPhuongCapTinhByIdApi = async (id: number) => {
  const response = await api.post(
    `${APP_URL}/DiaPhuongCapTinhApi/Get`,
    { Id: id },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Thêm mới tỉnh/thành phố
 * POST /api/DiaPhuongCapTinhApi/Add
 */
export const createDiaPhuongCapTinhApi = async (payload: CreateDiaPhuongCapTinhPayload) => {
  const response = await api.post(
    `${APP_URL}/DiaPhuongCapTinhApi/Add`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Cập nhật thông tin tỉnh/thành phố
 * PUT /api/DiaPhuongCapTinhApi/Edit
 */
export const updateDiaPhuongCapTinhApi = async (payload: UpdateDiaPhuongCapTinhPayload) => {
  const response = await api.put(
    `${APP_URL}/DiaPhuongCapTinhApi/Edit`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Xóa tỉnh/thành phố theo ID
 * DELETE /api/DiaPhuongCapTinhApi/Delete?TinhID={id}
 */
export const deleteDiaPhuongCapTinhApi = async (tinhId: number) => {
  const response = await api.delete(
    `${APP_URL}/DiaPhuongCapTinhApi/Delete`,
    {
      params: { TinhID: tinhId },
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Đồng bộ danh mục tỉnh/thành phố từ dữ liệu chuẩn
 * POST /api/DiaPhuongCapTinhApi/Sync
 */
export const syncDiaPhuongCapTinhApi = async () => {
  const response = await api.post(
    `${APP_URL}/DiaPhuongCapTinhApi/Sync`,
    {},
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Lấy dữ liệu thống kê KPI tỉnh/thành phố
 * GET /api/DiaPhuongCapTinhApi/GetKPI
 */
export const getDiaPhuongCapTinhKPIApi = async (): Promise<DiaPhuongCapTinhKPI> => {
  const endpoints = [
    `${APP_URL}/DiaPhuongCapTinhApi/GetKPI`,
    `${APP_URL}/DiaPhuongCapTinh/GetKPI`,
    `/api/DiaPhuongCapTinhApi/GetKPI`,
  ];

  for (const url of endpoints) {
    try {
      const response = await api.get(url, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      if (response?.data?.data) {
        return response.data.data;
      }
      if (response?.data?.total_DiaPhuongCapTinh !== undefined) {
        return response.data;
      }
    } catch {
      try {
        const response = await api.post(
          url,
          {},
          {
            headers: getAuthHeaders(),
            withCredentials: true,
          }
        );
        if (response?.data?.data) {
          return response.data.data;
        }
        if (response?.data?.total_DiaPhuongCapTinh !== undefined) {
          return response.data;
        }
      } catch {
        // Tiếp tục thử URL tiếp theo
      }
    }
  }

  throw new Error("Không thể tải dữ liệu KPI tỉnh/thành phố");
};
