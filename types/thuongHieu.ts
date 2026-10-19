export interface SP_ThuongHieu {
  thuongHieuID: string;
  maThuongHieu: string;
  tenThuongHieu: string;
  duongDan: string;
  duongDanLogo?: string | null;
  quocGiaID?: number | null;
  quocGia?: string | null;
  moTa?: string | null;
  thuTu: number;
  trangThai: boolean;
  ngayTao?: string;
  nguoiTao?: string;
}

export interface ThuongHieuFilter {
  TuKhoa?: string;
  PageIndex?: number;
  PageSize?: number;
  TrangThai?: boolean | null;
}

export interface CreateThuongHieuPayload {
  MaThuongHieu: string;
  TenThuongHieu: string;
  DuongDan: string;
  QuocGiaID?: number | null;
  QuocGia?: string;
  MoTa?: string;
  ThuTu: number;
  TrangThai: boolean;
  file?: File | null;
}

export interface UpdateThuongHieuPayload extends CreateThuongHieuPayload {
  ThuongHieuID: string;
  XoaFile?: boolean;
}
