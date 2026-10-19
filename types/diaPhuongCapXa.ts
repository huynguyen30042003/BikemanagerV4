/**
 * Model DM_DiaPhuongCapXa theo db.md & api.md
 */
export interface DM_DiaPhuongCapXa {
  xaID: number;
  tinhID: number;
  maXa: string;
  ten: string;
  tenKhongDau?: string | null;
  loai?: number | null; // 1 – Xã; 2 – Phường; 3 – Thị trấn / Đặc khu
  thuTu?: number | null;
  trangThai: boolean;
  tenTinh?: string | null;
}

export interface DiaPhuongCapXaFilter {
  TinhID?: number | null;
  TuKhoa?: string;
  PageIndex: number;
  PageSize: number;
  TrangThai?: boolean | null;
}

export interface CreateDiaPhuongCapXaPayload {
  TinhID: number;
  MaXa: string;
  Ten: string;
  TenKhongDau?: string;
  Loai: number;
  ThuTu: number;
  TrangThai: boolean;
}

export interface UpdateDiaPhuongCapXaPayload {
  XaID: number;
  TinhID: number;
  MaXa: string;
  Ten: string;
  TenKhongDau?: string;
  Loai: number;
  ThuTu: number;
  TrangThai: boolean;
}

export interface DiaPhuongCapXaKPI {
  total_DiaPhuongCapXa: number;
  total_HoatDong: number;
  total_NgungHoatDong: number;
  total_DiaPhuongCapTinh: number;
}
