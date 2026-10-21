export interface SP_BienTheSanPham {
  bienTheSanPhamID: string;
  sanPhamID: string;
  tenSanPham?: string;
  maSKU: string;
  maVach?: string | null;
  tenBienThe: string;
  mauSac?: string | null;
  dungLuongPin?: string | null;
  congSuatDongCo?: string | null;
  hinhAnh?: string | null;
  thuocTinhJson?: string | null;
  giaNhap: number;
  giaBan: number;
  giaBanSi: number;
  soThangBaoHanh: number;
  quanLyTheoSerial: boolean;
  trangThai: boolean;
  soLuongTon?: number;
  ngayTao?: string;
}

export interface BienTheFilter {
  SanPhamID?: string | null;
  KhoID?: string | null;
  CoTonKho?: boolean | null;
  QuanLyTheoSerial?: boolean | null;
  DangHoatDong?: boolean | null;
  TrangThai?: boolean | null;
  DanhMucChiTietID?: number | null;
  TuKhoa?: string;
  PageIndex?: number;
  PageSize?: number;
}

export interface CreateBienThePayload {
  SanPhamID: string;
  MaSKU: string;
  MaVach?: string;
  TenBienThe: string;
  MauSac?: string;
  DungLuongPin?: string;
  CongSuatDongCo?: string;
  GiaNhap: number;
  GiaBan: number;
  GiaBanSi: number;
  SoThangBaoHanh: number;
  QuanLyTheoSerial: boolean;
  TrangThai: boolean;
  file?: File | null;
}

export interface UpdateBienThePayload extends CreateBienThePayload {
  BienTheSanPhamID: string;
  XoaFile?: boolean;
}

export interface BienTheSanPhamKPI {
  total_BienTheSanPham: number;
  total_QuanLyTheoSerial: number;
  total_GiaBanCaoNhat: number;
  total_HoatDong: number;
}
