import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  BienTheFilter,
  CreateBienThePayload,
  UpdateBienThePayload,
} from "@/types/bienTheSanPham";
import { CreateHinhAnhPayload, HinhAnhFilter } from "@/types/hinhAnhSanPham";

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
 * Lấy danh sách biến thể sản phẩm
 * POST /api/BienTheSanPhamApi/Gets
 */
export const getBienTheSanPhamApi = async (
  filter: BienTheFilter = { PageIndex: 1, PageSize: 50, TuKhoa: "" }
) => {
  const response = await api.post(
    `${APP_URL}/BienTheSanPhamApi/Gets`,  
    {
      QuanLyTheoSerial: filter.QuanLyTheoSerial ?? null,
      SanPhamID: filter.SanPhamID ?? null,
      KhoID: filter.KhoID ?? null,
      CoTonKho: filter.CoTonKho ?? null,
      DangHoatDong: filter.DangHoatDong ?? filter.TrangThai ?? null,
      TrangThai: filter.TrangThai ?? filter.DangHoatDong ?? null,
      DanhMucChiTietID: filter.DanhMucChiTietID ?? null,
      TuKhoa: filter.TuKhoa ?? "",
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
 * Lấy chi tiết thông tin một biến thể
 * POST /api/BienTheSanPhamApi/Get
 */
export const getBienTheByIdApi = async (id: string) => {
  const response = await api.post(
    `${APP_URL}/BienTheSanPhamApi/Get`,
    { GuidId: id },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Tra cứu theo Barcode hoặc SKU
 * POST /api/BienTheSanPhamApi/GetByBarcodeOrSKU
 */
export const getBienTheByBarcodeOrSKUApi = async (tuKhoa: string, khoId?: string | null) => {
  const response = await api.post(
    `${APP_URL}/BienTheSanPhamApi/GetByBarcodeOrSKU`,
    {
      TuKhoa: tuKhoa,
      KhoID: khoId ?? null,
    },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Thêm mới biến thể sản phẩm (FormData)
 * POST /api/BienTheSanPhamApi/Add
 */
export const createBienTheApi = async (payload: CreateBienThePayload) => {
  const formData = new FormData();
  formData.append("SanPhamID", payload.SanPhamID);
  formData.append("MaSKU", payload.MaSKU);
  if (payload.MaVach) formData.append("MaVach", payload.MaVach);
  formData.append("TenBienThe", payload.TenBienThe);
  if (payload.MauSac) formData.append("MauSac", payload.MauSac);
  if (payload.DungLuongPin) formData.append("DungLuongPin", payload.DungLuongPin);
  if (payload.CongSuatDongCo) formData.append("CongSuatDongCo", payload.CongSuatDongCo);
  formData.append("GiaNhap", String(payload.GiaNhap ?? 0));
  formData.append("GiaBan", String(payload.GiaBan ?? 0));
  formData.append("GiaBanSi", String(payload.GiaBanSi ?? 0));
  formData.append("SoThangBaoHanh", String(payload.SoThangBaoHanh ?? 12));
  formData.append("QuanLyTheoSerial", String(payload.QuanLyTheoSerial));
  formData.append("TrangThai", String(payload.TrangThai));

  if (payload.file) {
    formData.append("file", payload.file);
  }

  const response = await api.post(
    `${APP_URL}/BienTheSanPhamApi/Add`,
    formData,
    {
      headers: getAuthFormDataHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Cập nhật thông tin biến thể (FormData)
 * POST /api/BienTheSanPhamApi/Edit
 */
export const updateBienTheApi = async (payload: UpdateBienThePayload) => {
  const formData = new FormData();
  formData.append("BienTheSanPhamID", payload.BienTheSanPhamID);
  formData.append("SanPhamID", payload.SanPhamID);
  formData.append("MaSKU", payload.MaSKU);
  if (payload.MaVach) formData.append("MaVach", payload.MaVach);
  formData.append("TenBienThe", payload.TenBienThe);
  if (payload.MauSac) formData.append("MauSac", payload.MauSac);
  if (payload.DungLuongPin) formData.append("DungLuongPin", payload.DungLuongPin);
  if (payload.CongSuatDongCo) formData.append("CongSuatDongCo", payload.CongSuatDongCo);
  formData.append("GiaNhap", String(payload.GiaNhap ?? 0));
  formData.append("GiaBan", String(payload.GiaBan ?? 0));
  formData.append("GiaBanSi", String(payload.GiaBanSi ?? 0));
  formData.append("SoThangBaoHanh", String(payload.SoThangBaoHanh ?? 12));
  formData.append("QuanLyTheoSerial", String(payload.QuanLyTheoSerial));
  formData.append("TrangThai", String(payload.TrangThai));
  if (payload.XoaFile != null) formData.append("XoaFile", String(payload.XoaFile));

  if (payload.file) {
    formData.append("file", payload.file);
  }

  const response = await api.post(
    `${APP_URL}/BienTheSanPhamApi/Edit`,
    formData,
    {
      headers: getAuthFormDataHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Xóa biến thể sản phẩm theo ID
 * POST /api/BienTheSanPhamApi/Delete
 */
export const deleteBienTheApi = async (id: string) => {
  const response = await api.post(
    `${APP_URL}/BienTheSanPhamApi/Delete`,
    { BienTheSanPhamID: id },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

// ============================================
// HÌNH ẢNH SẢN PHẨM / GALLERY
// ============================================

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
  if (payload.BienTheSanPhamID) formData.append("BienTheSanPhamID", payload.BienTheSanPhamID);
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
 * Lấy số liệu KPI tổng quan biến thể sản phẩm
 * POST /api/BienTheSanPhamApi/GetKPI
 */
export const getBienTheSanPhamKPIApi = async () => {
  const response = await api.post(
    `${APP_URL}/BienTheSanPhamApi/GetKPI`,
    {},
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

