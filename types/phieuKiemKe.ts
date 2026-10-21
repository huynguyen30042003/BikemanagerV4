export interface KHO_ChiTietKiemKe {
  id?: string;
  phieuKiemKeID?: string;
  bienTheSanPhamID: string;
  tenBienThe?: string;
  maSKU?: string;
  soSerialID?: string | null;
  maSerial?: string | null;
  soLuongHeThong: number;
  soLuongThucTe: number;
  soLuongLech: number;
  donGiaVon?: number;
  giaTriLech?: number;
  lyDoLechID?: number | null;
  tenLyDoLech?: string | null;
  ghiChuLyDo?: string | null;
}

export interface KHO_PhieuKiemKe {
  phieuKiemKeID: string;
  maPhieuKiemKe: string;
  khoID: string;
  tenKho?: string;
  ngayKiemKe: string;
  trangThaiID: number;
  tenTrangThai?: string;
  tongSoLuongHeThong: number;
  tongSoLuongThucTe: number;
  tongSoLuongLech: number;
  tongGiaTriLech: number;
  nguoiKiemKeID?: number | null;
  tenNguoiKiemKe?: string | null;
  nguoiDuyetID?: number | null;
  tenNguoiDuyet?: string | null;
  ngayCanBang?: string | null;
  ghiChu?: string | null;
  chiTiets?: KHO_ChiTietKiemKe[];
  ngayTao?: string;
}

export interface PhieuKiemKeFilter {
  KhoID?: string | null;
  TrangThaiID?: number | null;
  TuKhoa?: string;
  TuNgay?: string | null;
  DenNgay?: string | null;
  PageIndex?: number;
  PageSize?: number;
}

export interface CreatePhieuKiemKePayload {
  KhoID: string;
  GhiChu?: string;
  BienTheSanPhamIDs?: string[];
}

export interface ChiTietSoDemItem {
  BienTheSanPhamID: string;
  SoSerialID?: string | null;
  SoLuongThucTe: number;
  LyDoLechID?: number | null;
  GhiChuLyDo?: string;
}

export interface CapNhatSoDemPayload {
  PhieuKiemKeID: string;
  ChiTiets: ChiTietSoDemItem[];
}

export interface CanBangPayload {
  PhieuKiemKeID: string;
  GhiChu?: string;
}

export interface HuyKiemKePayload {
  PhieuKiemKeID: string;
  GhiChu?: string;
}

export interface KHO_PhieuKiemKeKPI {
  total_PhieuKiemKe?: number;
  total_DangKiemKe?: number;
  total_DaCanBang?: number;
  total_TongSoLuongLech?: number;
  totalPhieuKiemKe?: number;
  totalDangKiemKe?: number;
  totalDaCanBang?: number;
  totalTongSoLuongLech?: number;
}
