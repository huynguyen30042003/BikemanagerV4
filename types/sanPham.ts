export interface SP_SanPham {
  sanPhamID: string;
  danhMucChiTietID: number;
  tenDanhMucChiTiet?: string;
  thuongHieuID: string;
  tenThuongHieu?: string;
  maSanPham: string;
  tenSanPham: string;
  duongDan: string;
  donViTinhID?: number | null;
  tenDonViTinh?: string | null;
  anhDaiDien?: string | null;
  moTaNgan?: string | null;
  moTa?: string | null;
  thongSoKyThuatJson?: string | null;
  soThangBaoHanhMacDinh: number;
  laPhuongTien: boolean;
  daXuatBan: boolean;
  trangThai: boolean;
  soBienThe?: number;
  ngayTao?: string;
  nguoiTao?: string;
}

export interface SanPhamFilter {
  TuKhoa?: string;
  DanhMucChiTietID?: number | null;
  ThuongHieuID?: string | null;
  PageIndex?: number;
  PageSize?: number;
  TrangThai?: boolean | null;
}

export interface CreateSanPhamPayload {
  MaSanPham: string;
  TenSanPham: string;
  DanhMucChiTietID: number;
  ThuongHieuID: string;
  DuongDan: string;
  DonViTinhID?: number | null;
  MoTaNgan?: string;
  MoTa?: string;
  ThongSoKyThuatJson?: string;
  SoThangBaoHanhMacDinh: number;
  LaPhuongTien: boolean;
  DaXuatBan: boolean;
  TrangThai: boolean;
  file?: File | null;
}

export interface UpdateSanPhamPayload extends CreateSanPhamPayload {
  SanPhamID: string;
  XoaFile?: boolean;
}

export interface SP_ProductNavTabs {
  total_ThuongHieu?: number;
  total_SanPham?: number;
  total_BienTheSanPham?: number;
  total_HinhAnhSanPham?: number;
  total_SoSerial?: number;
  totalThuongHieu?: number;
  totalSanPham?: number;
  totalBienTheSanPham?: number;
  totalHinhAnhSanPham?: number;
  totalSoSerial?: number;
}
