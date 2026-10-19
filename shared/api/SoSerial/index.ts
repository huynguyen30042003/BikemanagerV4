import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  ChuyenTrangThaiSerialPayload,
  CreateSoSerialPayload,
  KichHoatBaoHanhPayload,
  SoSerialFilter,
} from "@/types/soSerial";

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Lấy danh sách số serial / số khung xe
 * POST /api/SoSerialApi/Gets
 */
export const getSoSerialApi = async (
  filter: SoSerialFilter = { PageIndex: 1, PageSize: 50, TuKhoa: "" }
) => {
  const response = await api.post(
    `${APP_URL}/SoSerialApi/Gets`,
    {
      TuKhoa: filter.TuKhoa ?? "",
      KhoID: filter.KhoID ?? null,
      TrangThaiID: filter.TrangThaiID ?? null,
      BienTheSanPhamID: filter.BienTheSanPhamID ?? null,
      PageIndex: filter.PageIndex ?? 1,
      PageSize: filter.PageSize ?? 50,
    },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Lấy chi tiết thông tin định danh một xe / thiết bị theo Serial ID
 * POST /api/SoSerialApi/Get
 */
export const getSoSerialByIdApi = async (id: string) => {
  const response = await api.post(
    `${APP_URL}/SoSerialApi/Get`,
    { GuidId: id },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Đăng ký mới số khung / số máy / serial khi nhập kho
 * POST /api/SoSerialApi/Add
 */
export const createSoSerialApi = async (payload: CreateSoSerialPayload) => {
  const response = await api.post(
    `${APP_URL}/SoSerialApi/Add`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Kích hoạt bảo hành điện tử khi bán xe cho khách hàng
 * POST /api/SoSerialApi/KichHoatBaoHanh
 */
export const kichHoatBaoHanhApi = async (payload: KichHoatBaoHanhPayload) => {
  const response = await api.post(
    `${APP_URL}/SoSerialApi/KichHoatBaoHanh`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Tra cứu công khai thông tin bảo hành điện tử qua Số Khung / Serial / SĐT
 * POST /api/SoSerialApi/TraCuuBaoHanh
 */
export const traCuuBaoHanhApi = async (tuKhoa: string) => {
  const response = await api.post(
    `${APP_URL}/SoSerialApi/TraCuuBaoHanh`,
    { TuKhoa: tuKhoa },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Chuyển trạng thái serial thiết bị (Bảo hành, Sửa chữa, Bàn giao)
 * POST /api/SoSerialApi/ChuyenTrangThai
 */
export const chuyenTrangThaiSerialApi = async (payload: ChuyenTrangThaiSerialPayload) => {
  const response = await api.post(
    `${APP_URL}/SoSerialApi/ChuyenTrangThai`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};
