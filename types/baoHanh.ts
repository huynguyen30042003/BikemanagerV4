export interface BH_ChiTietBaoHanh {
  id?: string;
  phieuBaoHanhID?: string;
  loaiXuLy: number; // 1: Sửa chữa/Cân chỉnh, 2: Đổi mới linh kiện/pin
  bienTheSanPhamID?: string | null;
  tenBienThe?: string | null;
  soSerialCuID?: string | null;
  soSerialCuMa?: string | null;
  soSerialMoiID?: string | null;
  soSerialMoiMa?: string | null;
  soLuong: number;
  donGia: number;
  chiPhiHangHoTro: number;
  chiPhiKhachTra: number;
  ghiChu?: string | null;
}

export interface BH_BaoHanh {
  baoHanhID: string;
  maBaoHanh: string;
  soSerialID: string;
  maSerial?: string | null;
  soKhung?: string | null;
  soMay?: string | null;
  soPin?: string | null;
  bienTheSanPhamID: string;
  tenBienThe?: string | null;
  khachHangID: string;
  tenKhachHang?: string | null;
  dienThoaiKhachHang?: string | null;
  phuongTienKhachHangID?: string | null;
  bienSoXe?: string | null;
  donHangID?: string | null;
  maDonHang?: string | null;

  ngayKichHoat: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  soThangBaoHanh: number;
  gioiHanKm?: number | null;

  trangThaiID: number; // FK DM_DanhMucChiTiet (TRANG_THAI_SO_BAO_HANH)
  tenTrangThai?: string | null;
  dieuKienBaoHanh?: string | null;
  ghiChu?: string | null;
  ngayTaoLap?: string | null;
}

export interface BaoHanhFilter {
  PageIndex?: number;
  PageSize?: number;
  TuKhoa?: string;
  KhachHangID?: string | null;
  TrangThaiID?: number | null;
  SoSerialID?: string | null;
}

export interface CreateBaoHanhPayload {
  SoSerialID: string;
  BienTheSanPhamID: string;
  KhachHangID: string;
  PhuongTienKhachHangID?: string | null;
  DonHangID?: string | null;
  NgayKichHoat: string;
  NgayBatDau: string;
  NgayKetThuc: string;
  SoThangBaoHanh: number;
  GioiHanKm?: number | null;
  TrangThaiID: number;
  DieuKienBaoHanh?: string | null;
  GhiChu?: string | null;
}

export interface BH_PhieuBaoHanh {
  phieuBaoHanhID: string;
  maPhieuBaoHanh: string;
  baoHanhID: string;
  maBaoHanh?: string | null;
  khachHangID: string;
  tenKhachHang?: string | null;
  dienThoaiKhachHang?: string | null;
  soSerialID: string;
  maSerial?: string | null;
  soKhung?: string | null;
  diaDiemID: string;
  tenDiaDiem?: string | null;
  nhanVienTiepNhanID?: number | null;
  kyThuatVienID?: number | null;

  ngayTiepNhan: string;
  ngayHenTra?: string | null;
  ngayTraThucTe?: string | null;
  soKmHienTai?: number | null;

  moTaLoi: string;
  ketQuaKiemTra?: string | null;
  huongXuLyID: number; // FK HUONG_XU_LY_BAO_HANH
  tenHuongXuLy?: string | null;
  trangThaiID: number; // FK TRANG_THAI_PHIEU_BAO_HANH
  tenTrangThai?: string | null;

  chiPhiHangHoTro: number;
  chiPhiKhachTra: number;
  ghiChu?: string | null;
  chiTiets?: BH_ChiTietBaoHanh[];
}

export interface PhieuBaoHanhFilter {
  PageIndex?: number;
  PageSize?: number;
  TuKhoa?: string;
  KhachHangID?: string | null;
  TrangThaiID?: number | null;
  HuongXuLyID?: number | null;
  DiaDiemID?: string | null;
}

export interface CreatePhieuBaoHanhPayload {
  BaoHanhID: string;
  KhachHangID: string;
  SoSerialID: string;
  DiaDiemID: string;
  NgayTiepNhan?: string;
  NgayHenTra?: string | null;
  SoKmHienTai?: number | null;
  MoTaLoi: string;
  KetQuaKiemTra?: string | null;
  HuongXuLyID: number;
  TrangThaiID: number;
  ChiPhiHangHoTro?: number;
  ChiPhiKhachTra?: number;
  GhiChu?: string | null;
  ChiTiets?: Array<{
    LoaiXuLy: number;
    BienTheSanPhamID?: string | null;
    SoSerialCuID?: string | null;
    SoSerialMoiID?: string | null;
    SoLuong: number;
    DonGia: number;
    ChiPhiHangHoTro: number;
    ChiPhiKhachTra: number;
    GhiChu?: string | null;
  }>;
}

export type { DV_ServiceNavTabs, ServiceNavTabsData } from "./suaChua";

/** POST/GET /api/BaoHanhApi/GetKPI */
export interface BH_BaoHanhKPI {
  total_BaoHanh?: number;
  total_DangHieuLuc?: number;
  total_SapHetHan?: number;
  total_HetHan?: number;
}

/** POST/GET /api/BaoHanhApi/GetPhieuBaoHanhKPI */
export interface BH_PhieuBaoHanhKPI {
  total_PhieuBaoHanh?: number;
  total_DangXuLy?: number;
  total_HoanThanh?: number;
  total_ChiPhiHangHoTro?: number;
  total_ChiPhiKhachTra?: number;
}
