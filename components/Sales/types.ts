import {
  Bike,
  Battery,
  Zap,
  Wrench,
  Disc,
  Gauge,
  Shield,
  Droplets,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { SerialKhaDungBanHang } from "@/types/donHang";

export interface CartItem {
  id: string; // ChiTietDonHangID
  bienTheSanPhamID: string;
  sku: string;
  tenBienThe: string;
  tenSanPham?: string;
  donGia: number;
  soLuong: number;
  tienGiamGia?: number;
  thueVAT?: number;
  tienThueVAT?: number;
  thanhTien: number;
  quanLyTheoSerial: boolean;
  laPhuongTien: boolean;
  soThangBaoHanh: number;
  ghiChu?: string;
  danhSachSerialKhaDung?: SerialKhaDungBanHang[];
  selectedSerials?: SerialKhaDungBanHang[];
}

export interface VariantItem {
  value: string;
  sku?: string;
  name?: string;
  tenBienThe?: string;
  tenSanPham?: string;
  defaultPrice?: number;
  giaBan?: number;
  giaBanKhuyenMai?: number | null;
  thueVAT?: number;
  soThangBaoHanh?: number;
  quanLySerial?: boolean;
  quanLyTheoSerial?: boolean;
  laPhuongTien?: boolean;
  soLuongTon?: number;
  soLuongKhaDung?: number;
  danhMucChiTietID?: number;
  tenDanhMuc?: string;
  tenThuongHieu?: string;
  tenKho?: string;
  anhDaiDien?: string | null;
  danhSachSerialKhaDung?: SerialKhaDungBanHang[];
}


export interface CategoryTabItem {
  key: string;
  label: string;
  danhMucChiTietID?: number;
  icon?: LucideIcon;
}

export function getCategoryIcon(name: string): LucideIcon {
  const lower = (name || "").toLowerCase();
  if (lower === "all" || lower.includes("tất cả")) return Layers;
  if (lower.includes("xe")) return Bike;
  if (lower.includes("pin") || lower.includes("ắc quy") || lower.includes("ac quy")) return Battery;
  if (lower.includes("sạc") || lower.includes("điện tử")) return Zap;
  if (lower.includes("phụ tùng") || lower.includes("cơ khí")) return Wrench;
  if (lower.includes("vỏ") || lower.includes("lốp") || lower.includes("phanh")) return Disc;
  if (lower.includes("động cơ") || lower.includes("đồng hồ")) return Gauge;
  if (lower.includes("phụ kiện") || lower.includes("bảo hiểm") || lower.includes("khóa")) return Shield;
  if (lower.includes("dầu") || lower.includes("nhớt") || lower.includes("hóa chất")) return Droplets;
  return Layers;
}

export function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

