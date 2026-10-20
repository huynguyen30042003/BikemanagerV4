import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import { GiaoDichFilter, TonKhoFilter, UpdateDinhMucPayload, KHO_TonKhoKPI } from "@/types/tonKho";

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Lấy danh sách tồn kho theo từng kho hoặc tra cứu toàn bộ
 * POST /api/TonKhoApi/Gets
 */
export const getTonKhoApi = async (
  filter: TonKhoFilter = { PageIndex: 1, PageSize: 50, TuKhoa: "", KhoID: null }
) => {
  const response = await api.post(
    `${APP_URL}/TonKhoApi/Gets`,
    {
      KhoID: filter.KhoID || null,
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
 * Lấy thông tin chi tiết tồn kho của 1 mặt hàng tại 1 kho
 * POST /api/TonKhoApi/Get
 */
export const getTonKhoDetailApi = async (khoId: string, bienTheSanPhamId: string) => {
  const response = await api.post(
    `${APP_URL}/TonKhoApi/Get`,
    {
      KhoID: khoId,
      BienTheSanPhamID: bienTheSanPhamId,
    },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Cập nhật định mức tồn kho tối thiểu & vị trí lưu trữ
 * POST /api/TonKhoApi/UpdateDinhMuc
 */
export const updateDinhMucTonKhoApi = async (payload: UpdateDinhMucPayload) => {
  const response = await api.post(
    `${APP_URL}/TonKhoApi/UpdateDinhMuc`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Lấy sổ theo dõi biến động thẻ kho / lịch sử xuất - nhập - chuyển kho
 * POST /api/TonKhoApi/GetGiaoDichs
 */
export const getGiaoDichTonKhoApi = async (
  filter: GiaoDichFilter = { PageIndex: 1, PageSize: 50 }
) => {
  const response = await api.post(
    `${APP_URL}/TonKhoApi/GetGiaoDichs`,
    {
      KhoID: filter.KhoID || null,
      BienTheSanPhamID: filter.BienTheSanPhamID || null,
      TuNgay: filter.TuNgay || null,
      DenNgay: filter.DenNgay || null,
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
 * Lấy danh sách lô chi phí & giá vốn tồn kho từng serial / mặt hàng
 * POST /api/TonKhoApi/Gets
 */
export const getLoChiPhiTonKhoApi = async (
  filter: { KhoID?: string | null; BienTheSanPhamID?: string | null; TuKhoa?: string; PageIndex?: number; PageSize?: number } = { PageIndex: 1, PageSize: 50 }
) => {
  const response = await api.post(
    `${APP_URL}/TonKhoApi/Gets`,
    {
      KhoID: filter.KhoID || null,
      BienTheSanPhamID: filter.BienTheSanPhamID || null,
      TuKhoa: filter.TuKhoa || "",
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
 * Lấy số liệu thống kê KPI Tồn kho
 * POST /api/TonKhoApi/GetKPI
 */
export const getTonKhoKPIApi = async (): Promise<KHO_TonKhoKPI> => {
  try {
    const res = await api.post(
      `${APP_URL}/TonKhoApi/GetKPI`,
      {},
      {
        headers: getAuthHeaders(),
        withCredentials: true,
      }
    );
    return res.data?.data ?? res.data;
  } catch {
    const res = await api.get(`${APP_URL}/TonKhoApi/GetKPI`, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return res.data?.data ?? res.data;
  }
};

