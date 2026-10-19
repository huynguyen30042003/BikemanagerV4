/**
 * Model DM_DanhMucChung theo db.md & api.md
 */
export interface DM_DanhMucChung {
  danhMucID: number;
  ten: string;
  moTa?: string | null;
  thuTu?: number | null;
  trangThai?: boolean | null;
  nguoiTaoLap?: number | null;
  nguoiHieuChinh?: number | null;
  ngayTaoLap?: string | null;
  ngayHieuChinh?: string | null;
  soLuongChiTiet?: number;
}

export interface DanhMucChungFilter {
  TuKhoa?: string;
  PageIndex: number;
  PageSize: number;
  TrangThai?: boolean | null;
  DanhMucID?: number | null;
}

export interface CreateDanhMucChungPayload {
  Ten: string;
  MoTa?: string;
  ThuTu: number;
  TrangThai: boolean;
}

export interface UpdateDanhMucChungPayload {
  DanhMucID: number;
  Ten: string;
  MoTa?: string;
  ThuTu: number;
  TrangThai: boolean;
}

export interface DMC_NavTabs {
  total_DanhMucChung?: number;
  total_DanhMucChiTiet?: number;
}

export interface DanhMucChungKPI {
  total_DanhMucChung: number;
  total_HoatDong: number;
  total_NgungHoatDong: number;
  total_DanhMucChiTiet: number;
}



