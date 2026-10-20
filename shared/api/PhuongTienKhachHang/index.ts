import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  CreatePhuongTienPayload,
  PhuongTienFilter,
  PhuongTienKhachHangKPI,
  UpdatePhuongTienPayload,
} from "@/types/phuongTienKhachHang";

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Lấy danh sách phương tiện xe cộ của khách hàng
 * POST /api/PhuongTienKhachHangApi/Gets
 */
export const getPhuongTienKhachHangApi = async (
  filter: PhuongTienFilter = { PageIndex: 1, PageSize: 20, TuKhoa: "" }
) => {
  const response = await api.post(
    `${APP_URL}/PhuongTienKhachHangApi/Gets`,
    {
      KhachHangID: filter.KhachHangID ?? null,
      TuKhoa: filter.TuKhoa ?? "",
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
 * Lấy chi tiết thông tin phương tiện xe của khách theo ID
 * POST /api/PhuongTienKhachHangApi/Get
 */
export const getPhuongTienByIdApi = async (id: string) => {
  const response = await api.post(
    `${APP_URL}/PhuongTienKhachHangApi/Get`,
    { GuidId: id },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Thêm mới phương tiện xe của khách
 * POST /api/PhuongTienKhachHangApi/Add
 */
export const createPhuongTienApi = async (payload: CreatePhuongTienPayload) => {
  const response = await api.post(
    `${APP_URL}/PhuongTienKhachHangApi/Add`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Cập nhật thông tin xe của khách hàng
 * PUT /api/PhuongTienKhachHangApi/Edit
 */
export const updatePhuongTienApi = async (payload: UpdatePhuongTienPayload) => {
  const response = await api.put(
    `${APP_URL}/PhuongTienKhachHangApi/Edit`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Xóa thông tin xe của khách hàng theo ID
 * DELETE /api/PhuongTienKhachHangApi/Delete?PhuongTienID=...
 */
export const deletePhuongTienApi = async (phuongTienId: string) => {
  const response = await api.delete(
    `${APP_URL}/PhuongTienKhachHangApi/Delete?PhuongTienID=${phuongTienId}`,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Lấy số liệu thống kê KPI Phương tiện khách hàng
 * POST /api/PhuongTienKhachHangApi/GetKPI hoặc GET /api/PhuongTienKhachHangApi/GetKPI
 */
export const getPhuongTienKhachHangKPIApi = async (): Promise<PhuongTienKhachHangKPI> => {
  try {
    const response = await api.post(
      `${APP_URL}/PhuongTienKhachHangApi/GetKPI`,
      {},
      {
        headers: getAuthHeaders(),
        withCredentials: true,
      }
    );
    return response.data?.data ?? response.data;
  } catch {
    try {
      const response = await api.get(`${APP_URL}/PhuongTienKhachHangApi/GetKPI`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      return response.data?.data ?? response.data;
    } catch {
      try {
        const response = await api.post(
          `${APP_URL}/PhuongTienKhachHangApi/KPI`,
          {},
          {
            headers: getAuthHeaders(),
            withCredentials: true,
          }
        );
        return response.data?.data ?? response.data;
      } catch {
        const response = await api.get(`${APP_URL}/PhuongTienKhachHangApi/KPI`, {
          headers: getAuthHeaders(),
          withCredentials: true,
        });
        return response.data?.data ?? response.data;
      }
    }
  }
};

