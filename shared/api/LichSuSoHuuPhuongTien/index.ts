import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  ChuyenQuyenSoHuuPayload,
  CreateLichSuSoHuuPayload,
  LichSuSoHuuFilter,
  LichSuSoHuuPhuongTienKPI,
} from "@/types/lichSuSoHuuPhuongTien";

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Lấy danh sách lịch sử sở hữu phương tiện theo xe hoặc khách hàng
 * POST /api/LichSuSoHuuPhuongTienApi/Gets
 */
export const getLichSuSoHuuApi = async (
  filter: LichSuSoHuuFilter = { PageIndex: 1, PageSize: 20 }
) => {
  const response = await api.post(
    `${APP_URL}/LichSuSoHuuPhuongTienApi/Gets`,
    {
      PhuongTienKhachHangID: filter.PhuongTienKhachHangID ?? null,
      KhachHangID: filter.KhachHangID ?? null,
      TuKhoa: filter.TuKhoa ?? "",
      PageIndex: filter.PageIndex ?? 1,
      PageSize: filter.PageSize ?? 20,
    },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Lấy chi tiết một lượt ghi nhận sở hữu phương tiện
 * POST /api/LichSuSoHuuPhuongTienApi/Get
 */
export const getLichSuSoHuuByIdApi = async (id: string) => {
  const response = await api.post(
    `${APP_URL}/LichSuSoHuuPhuongTienApi/Get`,
    { GuidId: id },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Ghi nhận lượt sở hữu phương tiện thủ công
 * POST /api/LichSuSoHuuPhuongTienApi/Add
 */
export const createLichSuSoHuuApi = async (payload: CreateLichSuSoHuuPayload) => {
  const response = await api.post(
    `${APP_URL}/LichSuSoHuuPhuongTienApi/Add`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Nghiệp vụ chuyển quyền sở hữu xe (Sang tên xe, thu cũ đổi mới, bán lại xe cũ cho chủ mới)
 * POST /api/LichSuSoHuuPhuongTienApi/ChuyenQuyenSoHuu
 */
export const chuyenQuyenSoHuuApi = async (payload: ChuyenQuyenSoHuuPayload) => {
  const response = await api.post(
    `${APP_URL}/LichSuSoHuuPhuongTienApi/ChuyenQuyenSoHuu`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Lấy số liệu thống kê KPI Lịch sử sở hữu phương tiện
 * POST /api/LichSuSoHuuPhuongTienApi/GetKPI hoặc GET /api/LichSuSoHuuPhuongTienApi/GetKPI
 */
export const getLichSuSoHuuKPIApi = async (): Promise<LichSuSoHuuPhuongTienKPI> => {
  try {
    const response = await api.post(
      `${APP_URL}/LichSuSoHuuPhuongTienApi/GetKPI`,
      {},
      {
        headers: getAuthHeaders(),
        withCredentials: true,
      }
    );
    return response.data?.data ?? response.data;
  } catch {
    try {
      const response = await api.get(`${APP_URL}/LichSuSoHuuPhuongTienApi/GetKPI`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      return response.data?.data ?? response.data;
    } catch {
      try {
        const response = await api.post(
          `${APP_URL}/LichSuSoHuuPhuongTienApi/KPI`,
          {},
          {
            headers: getAuthHeaders(),
            withCredentials: true,
          }
        );
        return response.data?.data ?? response.data;
      } catch {
        const response = await api.get(`${APP_URL}/LichSuSoHuuPhuongTienApi/KPI`, {
          headers: getAuthHeaders(),
          withCredentials: true,
        });
        return response.data?.data ?? response.data;
      }
    }
  }
};

