export interface KHO_Kho {
  khoID: string;
  diaDiemID?: string | null;
  tenDiaDiem?: string | null;
  maKho: string;
  tenKho: string;
  loaiKhoID?: number | null;
  tenLoaiKho?: string | null;
  diaChi?: string | null;
  dienThoai?: string | null;
  nguoiQuanLyID?: number | null;
  tenNguoiQuanLy?: string | null;
  laKhoMacDinh: boolean;
  choPhepTonAm: boolean;
  trangThai: boolean;
  ghiChu?: string | null;
  ngayTao?: string;
}

export interface KhoFilter {
  TuKhoa?: string;
  PageIndex?: number;
  PageSize?: number;
  TrangThai?: boolean | null;
}

export interface CreateKhoPayload {
  MaKho: string;
  TenKho: string;
  DiaDiemID?: string | null;
  LoaiKhoID?: number | null;
  DiaChi?: string | null;
  DienThoai?: string | null;
  LaKhoMacDinh?: boolean;
  ChoPhepTonAm?: boolean;
  TrangThai?: boolean;
  GhiChu?: string | null;
}

export interface UpdateKhoPayload extends CreateKhoPayload {
  KhoID: string;
}
