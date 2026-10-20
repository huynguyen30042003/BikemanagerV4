export interface KHO_ChiTietChuyenKho {
  id?: string;
  phieuChuyenKhoID?: string;
  bienTheSanPhamID: string;
  tenBienThe?: string;
  maSKU?: string;
  soSerialID?: string | null;
  maSerial?: string | null;
  soLuongChuyen: number;
  soLuongThucNhan?: number;
  donGiaVon?: number;
  thanhTien?: number;
  ghiChu?: string | null;
}

export interface KHO_PhieuChuyenKho {
  phieuChuyenKhoID: string;
  maPhieuChuyen: string;
  khoXuatID: string;
  tenKhoXuat?: string;
  khoNhapID: string;
  tenKhoNhap?: string;
  trangThaiID: number;
  tenTrangThai?: string;
  tongSoLuong: number;
  tongGiaTriVon: number;
  ngayXuat?: string | null;
  ngayNhan?: string | null;
  nguoiGiaoHang?: string | null;
  bienSoXeVanChuyen?: string | null;
  ghiChu?: string | null;
  chiTiets?: KHO_ChiTietChuyenKho[];
  ngayTao?: string;
}

export interface PhieuChuyenFilter {
  TuKhoa?: string;
  KhoID?: string | null;
  TrangThaiID?: number | null;
  PageIndex?: number;
  PageSize?: number;
}

export interface CreateChiTietChuyenItem {
  BienTheSanPhamID: string;
  SoSerialID?: string | null;
  SoLuongChuyen: number;
  DonGiaVon?: number;
  GhiChu?: string;
}

export interface CreatePhieuChuyenPayload {
  KhoXuatID: string;
  KhoNhapID: string;
  NguoiGiaoHang?: string;
  BienSoXeVanChuyen?: string;
  GhiChu?: string;
  ChiTiets: CreateChiTietChuyenItem[];
}

export interface XuatKhoPayload {
  PhieuChuyenKhoID: string;
  GhiChu?: string;
}

export interface ThucNhanItem {
  BienTheSanPhamID: string;
  SoSerialID?: string | null;
  SoLuongThucNhan: number;
}

export interface NhanHangPayload {
  PhieuChuyenKhoID: string;
  GhiChu?: string;
  ThucNhans: ThucNhanItem[];
}

export interface HuyPhieuChuyenPayload {
  PhieuChuyenKhoID: string;
  GhiChu?: string;
}

export interface KHO_PhieuChuyenKhoKPI {
  total_PhieuChuyenKho?: number;
  total_ChoXuatKho?: number;
  total_DangVanChuyen?: number;
  total_DaHoanTat?: number;
  totalPhieuChuyenKho?: number;
  totalChoXuatKho?: number;
  totalDangVanChuyen?: number;
  totalDaHoanTat?: number;
}
