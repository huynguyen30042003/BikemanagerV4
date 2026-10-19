/**
 * Model DM_DanhMucChiTiet theo db.md & api.md
 */
export interface DM_DanhMucChiTiet {
  danhMucChiTietID: number;
  danhMucID: number;
  tenDanhMuc?: string | null;
  tenDanhMucChung?: string | null;
  maSo?: string | null;
  ten: string;
  moTa?: string | null;
  thuTu?: number | null;
  trangThai?: boolean | null;
  nguoiTaoLap?: number | null;
  nguoiHieuChinh?: number | null;
  ngayTaoLap?: string | null;
  ngayHieuChinh?: string | null;
}

export interface DanhMucChiTietFilter {
  DanhMucID?: number | null;
  TuKhoa?: string;
  PageIndex: number;
  PageSize: number;
  TrangThai?: boolean | null;
}

export interface CreateDanhMucChiTietPayload {
  DanhMucID: number;
  Ten: string;
  MoTa?: string;
  ThuTu: number;
  TrangThai: boolean;
}

export interface UpdateDanhMucChiTietPayload {
  DanhMucChiTietID: number;
  DanhMucID: number;
  Ten: string;
  MoTa?: string;
  ThuTu: number;
  TrangThai: boolean;
}

export interface DanhMucChiTietListResponse {
  items: DM_DanhMucChiTiet[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages?: number;
}

export interface DanhMucChiTietKPI {
  total_DanhMucChiTiet: number;
  total_HoatDong: number;
  total_NgungHoatDong: number;
  total_DanhMucChung: number;
}
