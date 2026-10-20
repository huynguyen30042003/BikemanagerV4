import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  CreateHinhAnhPayload,
  HinhAnhFilter,
} from "@/types/hinhAnhSanPham";

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
 * Lấy danh sách hình ảnh gallery theo SanPhamID / BienTheSanPhamID
 * POST /api/BienTheSanPhamApi/GetHinhAnhs
 */
export const getHinhAnhsApi = async (filter: HinhAnhFilter) => {
  const response = await api.post(
    `${APP_URL}/BienTheSanPhamApi/GetHinhAnhs`,
    {
      SanPhamID: filter.SanPhamID,
      BienTheSanPhamID: filter.BienTheSanPhamID ?? null,
    },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Thêm hình ảnh mới vào gallery (FormData)
 * POST /api/BienTheSanPhamApi/AddHinhAnh
 */
export const addHinhAnhApi = async (payload: CreateHinhAnhPayload) => {
  const formData = new FormData();
  formData.append("SanPhamID", payload.SanPhamID);
  if (payload.BienTheSanPhamID)
    formData.append("BienTheSanPhamID", payload.BienTheSanPhamID);
  if (payload.TieuDe) formData.append("TieuDe", payload.TieuDe);
  formData.append("ThuTuSapXep", String(payload.ThuTuSapXep ?? 1));
  formData.append("LaAnhDaiDien", String(payload.LaAnhDaiDien));
  formData.append("file", payload.file);

  const response = await api.post(
    `${APP_URL}/BienTheSanPhamApi/AddHinhAnh`,
    formData,
    {
      headers: getAuthFormDataHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Xóa hình ảnh khỏi gallery
 * POST /api/BienTheSanPhamApi/DeleteHinhAnh
 */
export const deleteHinhAnhApi = async (hinhAnhId: string) => {
  const response = await api.post(
    `${APP_URL}/BienTheSanPhamApi/DeleteHinhAnh`,
    { HinhAnhID: hinhAnhId },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Lấy số liệu KPI tổng quan bộ sưu tập hình ảnh sản phẩm
 * POST /api/HinhAnhSanPhamApi/GetKPI
 */
export const getHinhAnhSanPhamKPIApi = async () => {
  const response = await api.post(
    `${APP_URL}/HinhAnhSanPhamApi/GetKPI`,
    {},
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};
