import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  CreateKhachHangPayload,
  KhachHangFilter,
  UpdateKhachHangPayload,
  KH_NavTabs,
  KhachHangKPI,
} from "@/types/khachHang";

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
 * Lấy danh sách khách hàng có phân trang và tìm kiếm
 * POST /api/KhachHangApi/Gets
 */
export const getKhachHangApi = async (
  filter: KhachHangFilter = {
    PageIndex: 1,
    PageSize: 20,
    TuKhoa: "",
    TrangThai: null,
    TinhID: null,
  },
) => {
  const response = await api.post(
    `${APP_URL}/KhachHangApi/Gets`,
    {
      TuKhoa: filter.TuKhoa ?? "",
      TinhID: filter.TinhID ?? null,
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
 * Lấy chi tiết thông tin một khách hàng theo KhachHangID
 * POST /api/KhachHangApi/Get
 */
export const getKhachHangByIdApi = async (khachHangId: string) => {
  const response = await api.post(
    `${APP_URL}/KhachHangApi/Get`,
    { KhachHangID: khachHangId },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    },
  );

  return response.data;
};

/**
 * Thêm mới khách hàng (FormData)
 * POST /api/KhachHangApi/Add
 */
export const createKhachHangApi = async (payload: CreateKhachHangPayload) => {
  const formData = new FormData();
  formData.append("LoaiKhachHang", String(payload.LoaiKhachHang));
  formData.append("TenKhachHang", payload.TenKhachHang);
  formData.append("DienThoai", payload.DienThoai);
  if (payload.HopThu) formData.append("HopThu", payload.HopThu);
  if (payload.DiaChi) formData.append("DiaChi", payload.DiaChi);
  if (payload.TinhID != null) formData.append("TinhID", String(payload.TinhID));
  if (payload.XaID != null) formData.append("XaID", String(payload.XaID));
  if (payload.GhiChu) formData.append("GhiChu", payload.GhiChu);
  formData.append("TrangThai", String(payload.TrangThai));

  // Cá nhân
  if (payload.LoaiKhachHang === 1) {
    if (payload.MaDinhDanh) formData.append("MaDinhDanh", payload.MaDinhDanh);
    if (payload.NgayCapMaDinhDanh)
      formData.append("NgayCapMaDinhDanh", payload.NgayCapMaDinhDanh);
    if (payload.NoiCapMaDinhDanh)
      formData.append("NoiCapMaDinhDanh", payload.NoiCapMaDinhDanh);
    if (payload.NgaySinh) formData.append("NgaySinh", payload.NgaySinh);
    if (payload.GioiTinhID != null)
      formData.append("GioiTinhID", String(payload.GioiTinhID));
    if (payload.QuocTichID != null)
      formData.append("QuocTichID", String(payload.QuocTichID));
    if (payload.DanTocID != null)
      formData.append("DanTocID", String(payload.DanTocID));
    if (payload.anhChanDung) {
      formData.append("anhChanDung", payload.anhChanDung);
    }
    if (payload.fileAnhChanDung) {
      formData.append("fileAnhChanDung", payload.fileAnhChanDung);
    }
  } else {
    // Doanh nghiệp
    if (payload.MaSoThue) formData.append("MaSoThue", payload.MaSoThue);
    if (payload.NguoiDaiDien)
      formData.append("NguoiDaiDien", payload.NguoiDaiDien);
    if (payload.DienThoaiNguoiDaiDien)
      formData.append("DienThoaiNguoiDaiDien", payload.DienThoaiNguoiDaiDien);
    if (payload.ToChucCapChaID)
      formData.append("ToChucCapChaID", payload.ToChucCapChaID);
    if (payload.LoaiToChucID != null)
      formData.append("LoaiToChucID", String(payload.LoaiToChucID));
    if (payload.TrangChu) formData.append("TrangChu", payload.TrangChu);
    if (payload.anhBieuTrung) {
      formData.append("anhBieuTrung", payload.anhBieuTrung);
    }
  }

  const response = await api.post(`${APP_URL}/KhachHangApi/Add`, formData, {
    headers: getAuthFormDataHeaders(),
    withCredentials: true,
  });

  return response.data;
};

/**
 * Cập nhật thông tin khách hàng (FormData)
 * POST /api/KhachHangApi/Edit
 */
export const updateKhachHangApi = async (payload: UpdateKhachHangPayload) => {
  const formData = new FormData();
  formData.append("KhachHangID", payload.KhachHangID);
  formData.append("LoaiKhachHang", String(payload.LoaiKhachHang));
  formData.append("TenKhachHang", payload.TenKhachHang);
  formData.append("DienThoai", payload.DienThoai);
  if (payload.HopThu) formData.append("HopThu", payload.HopThu);
  if (payload.DiaChi) formData.append("DiaChi", payload.DiaChi);
  if (payload.TinhID != null) formData.append("TinhID", String(payload.TinhID));
  if (payload.XaID != null) formData.append("XaID", String(payload.XaID));
  if (payload.GhiChu) formData.append("GhiChu", payload.GhiChu);
  formData.append("TrangThai", String(payload.TrangThai));

  if (payload.XoaAnhChanDung != null)
    formData.append("XoaAnhChanDung", String(payload.XoaAnhChanDung));
  if (payload.XoaAnhBieuTrung != null)
    formData.append("XoaAnhBieuTrung", String(payload.XoaAnhBieuTrung));

  if (payload.LoaiKhachHang === 1) {
    if (payload.MaDinhDanh) formData.append("MaDinhDanh", payload.MaDinhDanh);
    if (payload.NgayCapMaDinhDanh)
      formData.append("NgayCapMaDinhDanh", payload.NgayCapMaDinhDanh);
    if (payload.NoiCapMaDinhDanh)
      formData.append("NoiCapMaDinhDanh", payload.NoiCapMaDinhDanh);
    if (payload.NgaySinh) formData.append("NgaySinh", payload.NgaySinh);
    if (payload.GioiTinhID != null)
      formData.append("GioiTinhID", String(payload.GioiTinhID));
    if (payload.QuocTichID != null)
      formData.append("QuocTichID", String(payload.QuocTichID));
    if (payload.DanTocID != null)
      formData.append("DanTocID", String(payload.DanTocID));
    if (payload.anhChanDung) {
      formData.append("anhChanDung", payload.anhChanDung);
    }
    if (payload.fileAnhChanDung) {
      formData.append("fileAnhChanDung", payload.fileAnhChanDung);
    }
  } else {
    if (payload.MaSoThue) formData.append("MaSoThue", payload.MaSoThue);
    if (payload.NguoiDaiDien)
      formData.append("NguoiDaiDien", payload.NguoiDaiDien);
    if (payload.DienThoaiNguoiDaiDien)
      formData.append("DienThoaiNguoiDaiDien", payload.DienThoaiNguoiDaiDien);
    if (payload.ToChucCapChaID)
      formData.append("ToChucCapChaID", payload.ToChucCapChaID);
    if (payload.LoaiToChucID != null)
      formData.append("LoaiToChucID", String(payload.LoaiToChucID));
    if (payload.TrangChu) formData.append("TrangChu", payload.TrangChu);
    if (payload.anhBieuTrung) {
      formData.append("anhBieuTrung", payload.anhBieuTrung);
    }
  }

  const response = await api.post(`${APP_URL}/KhachHangApi/Edit`, formData, {
    headers: getAuthFormDataHeaders(),
    withCredentials: true,
  });

  return response.data;
};

/**
 * Xóa khách hàng theo KhachHangID
 * DELETE /api/KhachHangApi/Delete?KhachHangID=...
 */
export const deleteKhachHangApi = async (khachHangId: string) => {
  const response = await api.delete(
    `${APP_URL}/KhachHangApi/Delete?KhachHangID=${khachHangId}`,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    },
  );

  return response.data;
};

/**
 * Lấy số lượng thống kê cho các tabs khách hàng
 * GET /api/KhachHangApi/NavTabs
 */
export const getKhachHangNavTabsApi = async (): Promise<KH_NavTabs> => {
  const response = await api.get(`${APP_URL}/KhachHangApi/NavTabs`, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });

  return response.data?.data ?? response.data;
};

/**
 * Lấy số liệu thống kê KPI Khách hàng
 * POST/GET /api/KhachHangApi/GetKPI hoặc /api/KhachHangApi/KPI hoặc /api/KhachHang/GetKPI
 */
export const getKhachHangKPIApi = async (): Promise<KhachHangKPI> => {
  try {
    const response = await api.post(
      `${APP_URL}/KhachHangApi/GetKPI`,
      {},
      {
        headers: getAuthHeaders(),
        withCredentials: true,
      },
    );
    return response.data?.data ?? response.data;
  } catch (error: unknown) {
    try {
      const response = await api.get(`${APP_URL}/KhachHangApi/GetKPI`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      return response.data?.data ?? response.data;
    } catch {
      try {
        const response = await api.post(
          `${APP_URL}/KhachHangApi/KPI`,
          {},
          {
            headers: getAuthHeaders(),
            withCredentials: true,
          },
        );
        return response.data?.data ?? response.data;
      } catch {
        try {
          const response = await api.get(`${APP_URL}/KhachHangApi/KPI`, {
            headers: getAuthHeaders(),
            withCredentials: true,
          });
          return response.data?.data ?? response.data;
        } catch {
          const response = await api.post(
            `${APP_URL}/KhachHang/GetKPI`,
            {},
            {
              headers: getAuthHeaders(),
              withCredentials: true,
            },
          );
          return response.data?.data ?? response.data;
        }
      }
    }
  }
};
