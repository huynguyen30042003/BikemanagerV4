import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  CreateSanPhamPayload,
  SanPhamFilter,
  SP_ProductNavTabs,
  UpdateSanPhamPayload,
} from "@/types/sanPham";

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
 * Lấy danh sách sản phẩm
 * POST /api/SanPhamApi/Gets
 */
export const getSanPhamApi = async (
  filter: SanPhamFilter = {
    PageIndex: 1,
    PageSize: 20,
    TuKhoa: "",
    TrangThai: null,
  },
) => {
  const response = await api.post(
    `${APP_URL}/SanPhamApi/Gets`,
    {
      TuKhoa: filter.TuKhoa ?? "",
      DanhMucChiTietID: filter.DanhMucChiTietID ?? null,
      ThuongHieuID: filter.ThuongHieuID ?? null,
      PageIndex: filter.PageIndex ?? 1,
      PageSize: filter.PageSize ?? 20,
      TrangThai: filter.TrangThai ?? null,
    },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    },
  );

  return response.data;
};

/**
 * Lấy chi tiết thông tin sản phẩm theo GuidId
 * POST /api/SanPhamApi/Get
 */
export const getSanPhamByIdApi = async (id: string) => {
  const response = await api.post(
    `${APP_URL}/SanPhamApi/Get`,
    { GuidId: id },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    },
  );

  return response.data;
};

/**
 * Thêm mới sản phẩm (FormData)
 * POST /api/SanPhamApi/Add
 */
export const createSanPhamApi = async (payload: CreateSanPhamPayload) => {
  const formData = new FormData();
  formData.append("MaSanPham", payload.MaSanPham);
  formData.append("TenSanPham", payload.TenSanPham);
  formData.append("DanhMucChiTietID", String(payload.DanhMucChiTietID));
  formData.append("ThuongHieuID", payload.ThuongHieuID);
  formData.append("DuongDan", payload.DuongDan);
  if (payload.DonViTinhID != null)
    formData.append("DonViTinhID", String(payload.DonViTinhID));
  if (payload.MoTaNgan) formData.append("MoTaNgan", payload.MoTaNgan);
  if (payload.MoTa) formData.append("MoTa", payload.MoTa);
  if (payload.ThongSoKyThuatJson)
    formData.append("ThongSoKyThuatJson", payload.ThongSoKyThuatJson);
  formData.append(
    "SoThangBaoHanhMacDinh",
    String(payload.SoThangBaoHanhMacDinh ?? 12),
  );
  formData.append("LaPhuongTien", String(payload.LaPhuongTien));
  formData.append("DaXuatBan", String(payload.DaXuatBan));
  formData.append("TrangThai", String(payload.TrangThai));

  if (payload.file) {
    formData.append("file", payload.file);
  }

  const response = await api.post(`${APP_URL}/SanPhamApi/Add`, formData, {
    headers: getAuthFormDataHeaders(),
    withCredentials: true,
  });

  return response.data;
};

/**
 * Cập nhật thông tin sản phẩm (FormData)
 * POST /api/SanPhamApi/Edit
 */
export const updateSanPhamApi = async (payload: UpdateSanPhamPayload) => {
  const formData = new FormData();
  formData.append("SanPhamID", payload.SanPhamID);
  formData.append("MaSanPham", payload.MaSanPham);
  formData.append("TenSanPham", payload.TenSanPham);
  formData.append("DanhMucChiTietID", String(payload.DanhMucChiTietID));
  formData.append("ThuongHieuID", payload.ThuongHieuID);
  formData.append("DuongDan", payload.DuongDan);
  if (payload.DonViTinhID != null)
    formData.append("DonViTinhID", String(payload.DonViTinhID));
  if (payload.MoTaNgan) formData.append("MoTaNgan", payload.MoTaNgan);
  if (payload.MoTa) formData.append("MoTa", payload.MoTa);
  if (payload.ThongSoKyThuatJson)
    formData.append("ThongSoKyThuatJson", payload.ThongSoKyThuatJson);
  formData.append(
    "SoThangBaoHanhMacDinh",
    String(payload.SoThangBaoHanhMacDinh ?? 12),
  );
  formData.append("LaPhuongTien", String(payload.LaPhuongTien));
  formData.append("DaXuatBan", String(payload.DaXuatBan));
  formData.append("TrangThai", String(payload.TrangThai));
  formData.append("AnhDaiDien", String(payload.AnhDaiDien));
  if (payload.XoaFile != null)
    formData.append("XoaFile", String(payload.XoaFile));

  if (payload.file) {
    formData.append("file", payload.file);
  }

  const response = await api.post(`${APP_URL}/SanPhamApi/Edit`, formData, {
    headers: getAuthFormDataHeaders(),
    withCredentials: true,
  });

  return response.data;
};

/**
 * Xóa sản phẩm theo ID
 * POST /api/SanPhamApi/Delete
 */
export const deleteSanPhamApi = async (id: string) => {
  const response = await api.post(
    `${APP_URL}/SanPhamApi/Delete`,
    { SanPhamID: id },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    },
  );

  return response.data;
};

/**
 * Lấy số lượng thống kê cho các tabs quản lý sản phẩm
 * GET /api/SanPhamApi/NavTabs
 */
export const getProductNavTabsApi = async (): Promise<SP_ProductNavTabs> => {
  const response = await api.get(`${APP_URL}/SanPhamApi/NavTabs`, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });

  return response.data?.data ?? response.data;
};

/**
 * Lấy số liệu KPI tổng quan sản phẩm
 * POST /api/SanPhamApi/GetKPI
 */
export const getSanPhamKPIApi = async () => {
  const response = await api.post(
    `${APP_URL}/SanPhamApi/GetKPI`,
    {},
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    },
  );

  return response.data;
};
