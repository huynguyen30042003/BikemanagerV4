import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  ThongKeKhachHangFilter,
  ThongKeKhachHangKPI,
  UpdateThongKeKhachHangPayload,
} from "@/types/thongKeKhachHang";

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Lấy danh sách thống kê xếp hạng thành viên, công nợ, điểm thưởng khách hàng
 * POST /api/ThongKeKhachHangApi/Gets
 */
export const getThongKeKhachHangApi = async (
  filter: ThongKeKhachHangFilter = { PageIndex: 1, PageSize: 20, TuKhoa: "" }
) => {
  const response = await api.post(
    `${APP_URL}/ThongKeKhachHangApi/Gets`,
    {
      TuKhoa: filter.TuKhoa ?? "",
      HangKhachHang: filter.HangKhachHang ?? null,
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
 * Lấy chi tiết thông số thống kê, điểm tích lũy của một khách hàng
 * POST /api/ThongKeKhachHangApi/Get
 */
export const getThongKeKhachHangByIdApi = async (khachHangId: string) => {
  const response = await api.post(
    `${APP_URL}/ThongKeKhachHangApi/Get`,
    { KhachHangID: khachHangId },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Điều chỉnh hạng thẻ thành viên, tỷ lệ chiết khấu, điểm tích lũy hoặc công nợ khách hàng
 * PUT /api/ThongKeKhachHangApi/Edit
 */
export const updateThongKeKhachHangApi = async (payload: UpdateThongKeKhachHangPayload) => {
  const response = await api.put(
    `${APP_URL}/ThongKeKhachHangApi/Edit`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Lấy số liệu thống kê KPI Khách hàng
 * POST /api/ThongKeKhachHangApi/GetKPI hoặc GET /api/ThongKeKhachHangApi/GetKPI
 */
export const getThongKeKhachHangKPIApi = async (): Promise<ThongKeKhachHangKPI> => {
  const response = await api.post(
    `${APP_URL}/ThongKeKhachHangApi/GetKPI`,
    {},
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
};

