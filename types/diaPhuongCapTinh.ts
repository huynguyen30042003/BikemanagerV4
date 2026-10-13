/**
 * Model DM_DiaPhuongCapTinh theo db.md & api.md
 */
export interface DM_DiaPhuongCapTinh {
  tinhID: number;
  maTinh: string;
  ten: string;
  tenKhongDau?: string | null;
  thuTu?: number | null;
  trangThai: boolean;
  loai?: number | null; // 1 – Tỉnh; 2 – Thành phố trực thuộc TW
  soLuongXa?: number;
  soLuongDiaDiem?: number;
}

export interface DiaPhuongCapTinhFilter {
  TuKhoa?: string;
  PageIndex: number;
  PageSize: number;
  TrangThai?: boolean | null;
}

export interface CreateDiaPhuongCapTinhPayload {
  MaTinh: string;
  Ten: string;
  TenKhongDau?: string;
  ThuTu: number;
  Loai: number;
  TrangThai: boolean;
}

export interface UpdateDiaPhuongCapTinhPayload {
  TinhID: number;
  MaTinh: string;
  Ten: string;
  TenKhongDau?: string;
  ThuTu: number;
  Loai: number;
  TrangThai: boolean;
}
