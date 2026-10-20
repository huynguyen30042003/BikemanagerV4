export type HangKhachHangType = "BinhThuong" | "Bac" | "Vang" | "KimCuong";

export interface KH_ThongKeKhachHang {
  khachHangID: string;
  maKhachHang?: string;
  tenKhachHang?: string;
  dienThoai?: string;
  tongSoDonHang: number;
  tongTienDaChi: number;
  congNoHienTai: number;
  tongSoLanSuaChua: number;
  lanMuaHangGanNhat?: string | null;
  lanSuaChuaGanNhat?: string | null;
  hangKhachHang: HangKhachHangType | string;
  diemTichLuy: number;
  tyLeGiamGia: number;
  ngayCapNhat?: string | null;
}

export interface ThongKeKhachHangFilter {
  TuKhoa?: string;
  HangKhachHang?: string;
  PageIndex?: number;
  PageSize?: number;
}

export interface UpdateThongKeKhachHangPayload {
  KhachHangID: string;
  HangKhachHang: string;
  TyLeGiamGia: number;
  DiemTichLuy: number;
  CongNoHienTai: number;
}

export interface ThongKeKhachHangKPI {
  total_ThongKeKhachHang: number;
  total_HoiVienVip: number;
  total_TongTienDaChi: number;
  total_CongNoHienTai: number;
  total_KhachCoCongNo: number;
}

