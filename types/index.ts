export interface PagedResult<T> {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

export interface ItemResult<T> {
  success: string;
  message: string;
  errors: string | null;
  data: T;
}

export * from "./khachHang";
export * from "./thongKeKhachHang";
export * from "./phuongTienKhachHang";
export * from "./lichSuSoHuuPhuongTien";
export * from "./diaPhuongCapTinh";
export * from "./diaPhuongCapXa";
export * from "./diaDiem";
export * from "./quocGia";
export * from "./thuongHieu";
export * from "./sanPham";
export * from "./bienTheSanPham";
export * from "./hinhAnhSanPham";
export * from "./soSerial";
export * from "./kho";
export * from "./tonKho";
export * from "./phieuChuyenKho";
export * from "./phieuKiemKe";
export * from "./nhaCungCap";
export * from "./donNhapHang";
export * from "./donHang";
export * from "./traGop";
export * from "./baoHanh";
export * from "./suaChua";
export * from "./danhMucChung";
export * from "./danhMucChiTiet";

