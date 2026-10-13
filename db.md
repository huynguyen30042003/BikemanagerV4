#  region dùng chung
## public class BaseAudit
{
    public long? NguoiTaoLap { get; set; }
    public long? NguoiHieuChinh { get; set; }
    public DateTime? NgayTaoLap { get; set; }
    public DateTime? NgayHieuChinh { get; set; }
}
#  region Danh mục
## ✅public class DM_QuocGia
{
    public byte QuocGiaID { get; set; }
    public string MaQuocGia { get; set; }
    public string Ten { get; set; }
    public string TenKhongDau { get; set; }
    public byte ThuTu { get; set; }
    public bool? TrangThai { get; set; }
}

## ✅ 📷 public class DM_DiaDiem: BaseAudit 
{
    public Guid DiaDiemID { get; set; }
    public Guid? DiaDiemCapChaID { get; set; }
    public short? LoaiDiaDiemID { get; set; }
    public string TenDiaDiem { get; set; }
    public string MoTa { get; set; }
    public int? XaID { get; set; }
    public int? TinhID { get; set; }
    public decimal? KinhDo { get; set; }
    public decimal? ViDo { get; set; }
    public string DiaChiSo { get; set; } = string.Empty;
    public string AnhDaiDien { get; set; } = string.Empty;
    public bool? TrangThai { get; set; }
}

## ✅public class DM_DanhMucChung : BaseAudit
{
    public short DanhMucID { get; set; }
    public short? ThuTu { get; set; }
    public bool? TrangThai { get; set; }
    public string Ten { get; set; }
    public string MoTa { get; set; }
}

## ✅public class DM_DanhMucChiTiet : BaseAudit
{
    public short DanhMucChiTietID { get; set; } 
    public short? DanhMucID { get; set; }
    public string MaSo { get; set; }
    public int? ThuTu { get; set; }
    public bool? TrangThai { get; set; }
    public string Ten { get; set; }
    public string MoTa { get; set; }
    <!-- public bool? ChoPhepXoa { get; set; } -->
    <!-- public bool? DaXoa { get; set; } -->
}

## ✅public class DM_DiaPhuongCapTinh
{
    public int TinhID { get; set; }
    public string MaTinh { get; set; }
    public string Ten { get; set; }
    public string TenKhongDau { get; set; }
    public byte? ThuTu { get; set; }
    public bool TrangThai { get; set; }
    public byte? Loai { get; set; } <!-- 1 –Tỉnh; 2 – Thành phố -->
}

## ✅public class DM_DiaPhuongCapXa
{
    public int XaID { get; set; }
    public int TinhID { get; set; }
    public string MaXa { get; set; }
    public byte? Loai { get; set; } <!-- 1 – Xã; 2 – Phường; 3 – Đặc khu -->
    public string Ten { get; set; }
    public string TenKhongDau { get; set; }
    public byte ThuTu { get; set; }
    public bool TrangThai { get; set; }
}

# endregion


# region Khách hàng

## ✅📷public class KH_KhachHang : BaseAudit
{
    // --- 1. Khóa chính & Phân loại ---
    public Guid KhachHangID { get; set; }
    public string MaKhachHang { get; set; } = string.Empty; // Tự sinh: KH00001
    public byte LoaiKhachHang { get; set; } = 1; // 1: Cá nhân, 2: Doanh nghiệp / Tổ chức
    public string TenKhachHang { get; set; } = string.Empty; // Họ tên hoặc Tên tổ chức

    // --- 2. Thông tin liên hệ dùng chung ---
    public string DienThoai { get; set; } = string.Empty; sử dụng luôn cho zalo không cần phụ
    public string? HopThu { get; set; } // Email
    public string? DiaChi { get; set; }
    public int? TinhID { get; set; }
    public int? XaID { get; set; }
    public string? GhiChu { get; set; }
    public bool TrangThai { get; set; } = true;

    // --- 3. Dành riêng cho KH Cá nhân (LoaiKhachHang = 1) ---
    public string? MaDinhDanh { get; set; } // Số CCCD / CMND
    public DateTime? NgayCapMaDinhDanh { get; set; } // Phục vụ hợp đồng trả góp
    public string? NoiCapMaDinhDanh { get; set; } // Phục vụ hợp đồng trả góp
    public DateTime? NgaySinh { get; set; }
    public short? GioiTinhID { get; set; } // FK DM_DanhMucChiTiet
    public byte? QuocTichID { get; set; }  // FK DM_QuocGia
    public short? DanTocID { get; set; }   // FK DM_DanhMucChiTiet
    public string? AnhChanDung { get; set; }

    // --- 4. Dành riêng cho KH Doanh nghiệp / Tổ chức (LoaiKhachHang = 2) ---
    public string? MaSoThue { get; set; }
    public string? NguoiDaiDien { get; set; } // Người liên hệ / đại diện công ty
    public string? DienThoaiNguoiDaiDien { get; set; }
    public Guid? ToChucCapChaID { get; set; } // Chi nhánh / Công ty mẹ
    public short? LoaiToChucID { get; set; } // FK DM_DanhMucChiTiet (TNHH, CP...)
    public string? TrangChu { get; set; } // Website
    public string? AnhBieuTrung { get; set; } // Logo
}


## ✅public class KH_ThongKeKhachHang 
{
    public Guid KhachHangID { get; set; }
    public int TongSoDonHang { get; set; } = 0;
    public decimal TongTienDaChi { get; set; } = 0;
    public decimal CongNoHienTai { get; set; } = 0; // Công nợ mua sỉ/mua chịu
    public int TongSoLanSuaChua { get; set; } = 0;
    public DateTime? LanMuaHangGanNhat { get; set; }
    public DateTime? LanSuaChuaGanNhat { get; set; } // Để lọc nhắc bảo dưỡng định kỳ
    public string HangKhachHang { get; set; } = "BinhThuong"; // BinhThuong, Bac, Vang, KimCuong
    public int DiemTichLuy { get; set; } = 0; // Điểm tích lũy thành viên
    public decimal TyLeGiamGia { get; set; } = 0;
    public DateTime? NgayCapNhat { get; set; }
}


## ✅public class KH_PhuongTienKhachHang : BaseAudit
{
    public Guid ID { get; set; }
    public Guid KhachHangID { get; set; }
    public Guid? SoSerialID { get; set; } // Null nếu là xe ngoài mang vào sửa
    public Guid? BienTheSanPhamID { get; set; } // Dòng sản phẩm tương ứng trong shop (nếu có)
    public Guid ThuongHieuID { get; set; } // FK Hãng xe (Honda, VinFast, Yadea...)
    public string TenModel { get; set; } = string.Empty; // Tên xe: Klara S, Feliz, Wave Alpha...
    public string BienSo { get; set; } = string.Empty;
    public string? SoKhung { get; set; }
    public string? SoMay { get; set; }
    public string? SoPin { get; set; }
    public string? MauSac { get; set; }
    public int? SoKmHienTai { get; set; } // ODO hiện tại của xe
    public DateTime? NgayMua { get; set; }
    public string? GhiChu { get; set; }
    public bool TrangThai { get; set; } = true; // true: Đang sử dụng, false: Đã bán/Hỏng
}


## ✅public class KH_LichSuSoHuuPhuongTien : BaseAudit
{
    public Guid ID { get; set; }
    public Guid PhuongTienKhachHangID { get; set; } // FK chính tới xe
    public Guid? SoSerialID { get; set; } // Null nếu là xe ngoài
    public Guid KhachHangID { get; set; }
    public Guid? DonHangID { get; set; } // Null nếu là chuyển nhượng ngoài shop
    public DateTime NgayBatDauSoHuu { get; set; }
    public DateTime? NgayKetThucSoHuu { get; set; }
    public bool LaChuSoHuuHienTai { get; set; } = true;
    public string? LyDo { get; set; } // MuaMoi, SangTen, ThuCuDoiMoi...
}

#endregion


#  region Kho

## public class KHO_LoChiPhiTonKho
{
    public Guid LoID { get; set; }
    public Guid KhoID { get; set; }              // ➕ BẮT BUỘC
    public Guid BienTheSanPhamID { get; set; }
    public Guid? SoSerialID { get; set; }        // ➕ xe: 1 lô = 1 serial → giá vốn đúng từng xe
    public string? LoaiThamChieu { get; set; }   // ➕ DonNhapHang / ChuyenKho / KhachTra / KiemKe
    public Guid? IDThamChieu { get; set; }       // ➕ ChiTietDonNhapHangID...
    public decimal GiaNhap { get; set; }
    public decimal ChiPhiPhanBo { get; set; }    // ➕ phí vận chuyển phân bổ trên mỗi đơn vị
    public int SoLuongNhap { get; set; }         // ➕ số lượng ban đầu (để đối soát)
    public int SoLuongConLai { get; set; }
    public DateTime NgayNhap { get; set; }
}


## public class KHO_TonKho
{
    public Guid KhoID { get; set; }
    public Guid BienTheSanPhamID { get; set; }
    public int SoLuong { get; set; }            // tồn thực tế
    public int SoLuongDaDat { get; set; }       // đang giữ cho đơn chưa xuất
    public int SoLuongDangChuyen { get; set; }  // ➕ hàng đang chuyển đến kho này
    // SoLuongKhaDung = SoLuong - SoLuongDaDat  (computed column trong SQL)
    public int? SoLuongToiThieu { get; set; }   // ➕ cảnh báo sắp hết hàng
    public string? ViTriLuuTru { get; set; }    // ➕ Kệ A1-03
    public DateTime? NgayCapNhat { get; set; }
    public byte[]? RowVersion { get; set; }     // ➕ chống 2 người cùng trừ kho một lúc
}


## public class KHO_GiaoDichTonKho
{
    public Guid GiaoDichID { get; set; }
    public Guid KhoID { get; set; }
    public Guid BienTheSanPhamID { get; set; }
    public Guid? SoSerialID { get; set; }        // ➕ truy vết từng xe
    public short LoaiGiaoDichID { get; set; }    // FK DM_DanhMucChiTiet: Nhập mua, Nhập chuyển kho, Nhập kiểm kê, Xuất bán, Xuất sửa chữa, Xuất chuyển kho, Xuất kiểm kê, Xuất hủy...
    public int SoLuong { get; set; }             // có dấu: + nhập, − xuất
    public int SoLuongTruoc { get; set; }
    public int SoLuongSau { get; set; }          // CHECK: = SoLuongTruoc + SoLuong
    public decimal DonGiaVon { get; set; }       // ➕ để báo cáo theo giá trị
    public decimal GiaTri { get; set; }          // ➕ = SoLuong * DonGiaVon
    public string? LoaiThamChieu { get; set; }
    public Guid? IDThamChieu { get; set; }
    public string? GhiChu { get; set; }
    public long? NguoiTaoLap { get; set; }       // đổi từ string NguoiTao
    public DateTime NgayTaoLap { get; set; }
}


## public class KHO_Kho : BaseAudit
{
    public Guid KhoID { get; set; }
    public Guid? DiaDiemID { get; set; }     // Dùng DM_DiaDiem làm Chi nhánh / Cửa hàng / Showroom (FK DM_DiaDiem)
    public string MaKho { get; set; } = string.Empty;   // UNIQUE: KHO-HN01, KHO-SG01
    public string TenKho { get; set; } = string.Empty;
    public short? LoaiKhoID { get; set; }    // FK DM_DanhMucChiTiet: Kho tổng, Kho cửa hàng, Kho xe cũ, Kho bảo hành, Kho hàng lỗi
    public string? DiaChi { get; set; }
    public string? DienThoai { get; set; }
    public long? NguoiQuanLyID { get; set; }
    public bool LaKhoMacDinh { get; set; }   // Kho tự chọn ưu tiên khi bán hàng
    public bool ChoPhepTonAm { get; set; }   // true: Cho phép xuất âm (tùy chính sách cửa hàng)
    public bool TrangThai { get; set; } = true;
    public string? GhiChu { get; set; }
}


## public class KHO_PhieuChuyenKho : BaseAudit
{
    public Guid PhieuChuyenKhoID { get; set; }
    public string MaPhieuChuyen { get; set; } = string.Empty; // Mã phiếu: CK00001, CK00002...
    public Guid KhoXuatID { get; set; }           // Kho nguồn (FK KHO_Kho)
    public Guid KhoNhapID { get; set; }           // Kho đích (FK KHO_Kho)
    public short TrangThaiID { get; set; }        // FK DM_DanhMucChiTiet: Chờ xuất, Đang chuyển (hàng trên đường), Đã nhận (hoàn thành), Đã hủy
    public int TongSoLuong { get; set; } = 0;     // Tổng số lượng các sản phẩm chuyển
    public decimal TongGiaTriVon { get; set; } = 0; // Tổng giá trị vốn của lô hàng chuyển
    public DateTime? NgayXuat { get; set; }       // Thời điểm xuất kho nguồn
    public DateTime? NgayNhan { get; set; }       // Thời điểm kho đích nhận và nhập kho
    public string? NguoiGiaoHang { get; set; }    // Tên tài xế / đơn vị vận chuyển
    public string? BienSoXeVanChuyen { get; set; }
    public string? GhiChu { get; set; }
}


## public class KHO_ChiTietChuyenKho
{
    public Guid ID { get; set; }
    public Guid PhieuChuyenKhoID { get; set; }    // FK KHO_PhieuChuyenKho
    public Guid BienTheSanPhamID { get; set; }    // Phụ tùng hoặc xe (FK BienTheSanPham)
    public Guid? SoSerialID { get; set; }         // Null nếu là phụ tùng đếm số lượng; có giá trị nếu là xe/pin quản lý serial
    public int SoLuongChuyen { get; set; }        // Số lượng xuất từ kho nguồn
    public int SoLuongThucNhan { get; set; }      // Số lượng kho đích thực nhận (đối soát hao hụt / thất thoát)
    public decimal DonGiaVon { get; set; }        // Đơn giá vốn tại thời điểm xuất
    public decimal ThanhTien { get; set; }        // = SoLuongChuyen * DonGiaVon
    public string? GhiChu { get; set; }
}


## public class KHO_PhieuKiemKe : BaseAudit
{
    public Guid PhieuKiemKeID { get; set; }
    public string MaPhieuKiemKe { get; set; } = string.Empty; // Mã phiếu: KK00001...
    public Guid KhoID { get; set; }               // Kho thực hiện kiểm kê (FK KHO_Kho)
    public DateTime NgayKiemKe { get; set; } = DateTime.Now; // Ngày tiến hành kiểm kê
    public short TrangThaiID { get; set; }        // FK DM_DanhMucChiTiet: Đang kiểm kê, Đã cân bằng (đã sinh giao dịch tồn kho), Đã hủy
    public int TongSoLuongHeThong { get; set; } = 0;
    public int TongSoLuongThucTe { get; set; } = 0;
    public int TongSoLuongLech { get; set; } = 0; // = ThucTe - HeThong
    public decimal TongGiaTriLech { get; set; } = 0; // Tổng chênh lệch thành tiền theo giá vốn
    public long? NguoiKiemKeID { get; set; }      // Nhân viên thực hiện đếm
    public long? NguoiDuyetID { get; set; }        // Quản lý kho duyệt cân bằng
    public DateTime? NgayCanBang { get; set; }     // Thời điểm duyệt cân bằng số liệu
    public string? GhiChu { get; set; }
}


## public class KHO_ChiTietKiemKe
{
    public Guid ID { get; set; }
    public Guid PhieuKiemKeID { get; set; }       // FK KHO_PhieuKiemKe
    public Guid BienTheSanPhamID { get; set; }    // FK BienTheSanPham
    public Guid? SoSerialID { get; set; }         // Quản lý theo từng xe/pin nếu có
    public int SoLuongHeThong { get; set; }       // Tồn sổ sách lúc tạo phiếu
    public int SoLuongThucTe { get; set; }        // Số đếm được thực tế
    public int SoLuongLech { get; set; }          // = SoLuongThucTe - SoLuongHeThong (+ thừa, - thiếu)
    public decimal DonGiaVon { get; set; }        // Giá vốn để tính giá trị chênh lệch
    public decimal GiaTriLech { get; set; }       // = SoLuongLech * DonGiaVon
    public short? LyDoLechID { get; set; }        // FK DM_DanhMucChiTiet: Hỏng hóc, Mất cắp, Đếm nhầm, Chưa cập nhật...
    public string? GhiChuLyDo { get; set; }
}

# endregion

# region Sản phẩm

## 📷 public class SP_ThuongHieu : BaseAudit
{
    public Guid ThuongHieuID { get; set; }
    public string MaThuongHieu { get; set; } = string.Empty; // UNIQUE: HONDA, VINFAST, YADEA, DIBAO...
    public string TenThuongHieu { get; set; } = string.Empty;
    public string DuongDan { get; set; } = string.Empty;    // Slug URL
    public string? DuongDanLogo { get; set; }
    public byte? QuocGiaID { get; set; }                    // FK DM_QuocGia (Việt Nam, Nhật Bản, Trung Quốc...)
    public string? QuocGia { get; set; }                    // Tên quốc gia hiển thị
    public string? MoTa { get; set; }
    public int ThuTu { get; set; } = 0;
    public bool TrangThai { get; set; } = true;
}


// 💡 ĐÃ BỎ BẢNG DanhMuc RIÊNG: Sử dụng trực tiếp DM_DanhMucChiTiet làm Ngành hàng / Danh mục sản phẩm (Xe máy điện, Xe đạp điện, Pin-Ắc quy, Phụ tùng, Phụ kiện, Dầu nhớt...) để tập trung danh mục, đồng bộ toàn hệ thống.


## 📷 public class SP_SanPham : BaseAudit
{
    public Guid SanPhamID { get; set; }
    public short DanhMucChiTietID { get; set; }             // FK DM_DanhMucChiTiet (Ngành hàng / Loại sản phẩm)
    public Guid ThuongHieuID { get; set; }                  // FK SP_ThuongHieu (Hãng sản xuất)
    public string MaSanPham { get; set; } = string.Empty;   // UNIQUE: SP-FELIZ-S, SP-KLARA-S...
    public string TenSanPham { get; set; } = string.Empty;
    public string DuongDan { get; set; } = string.Empty;    // Slug URL
    public short? DonViTinhID { get; set; }                 // FK DM_DanhMucChiTiet: Chiếc, Cái, Bình, Bộ, Lít, Hộp...
    public string? AnhDaiDien { get; set; }
    public string? MoTaNgan { get; set; }
    public string? MoTa { get; set; }
    public string? ThongSoKyThuatJson { get; set; }         // JSON thông số kỹ thuật (Kích thước, Trọng lượng, Động cơ, Chống nước...)
    public int SoThangBaoHanhMacDinh { get; set; } = 12;    // Thời hạn bảo hành tiêu chuẩn (tháng)
    public bool LaPhuongTien { get; set; } = false;         // true: Là xe nguyên chiếc (khi bán tự động sinh hồ sơ phương tiện khách hàng)
    public bool DaXuatBan { get; set; } = true;             // Cho phép hiển thị niêm yết bán
    public bool TrangThai { get; set; } = true;             // Đang kinh doanh / Ngừng kinh doanh
}


## 📷 public class SP_BienTheSanPham : BaseAudit
{
    public Guid BienTheSanPhamID { get; set; }              // Khóa chính
    public Guid SanPhamID { get; set; }                     // FK SP_SanPham
    public string MaSKU { get; set; } = string.Empty;       // UNIQUE: SKU-FELIZ-S-RED (Dùng trong kho, hóa đơn bán lẻ)
    public string? MaVach { get; set; }                     // Barcode / EAN-13 quét đầu đọc POS
    public string TenBienThe { get; set; } = string.Empty;  // "Màu Đỏ nhám - Pin LFP 3.5kWh"
    public string? MauSac { get; set; }                     // Đỏ, Đen, Trắng, Xanh cửu long...
    public string? DungLuongPin { get; set; }               // 3.5 kWh, 72V-20Ah...
    public string? CongSuatDongCo { get; set; }             // 1200W, 3000W...
    public string? HinhAnh { get; set; }                    // Ảnh đại diện riêng của biến thể/màu này
    public string? ThuocTinhJson { get; set; }              // Các thuộc tính mở rộng khác (Loại phanh, loại vành, kích thước lốp...)
    public decimal GiaNhap { get; set; } = 0;               // Giá nhập tham chiếu / Giá niêm yết từ hãng
    public decimal GiaBan { get; set; } = 0;                // Giá bán lẻ
    public decimal GiaBanSi { get; set; } = 0;              // Giá bán đại lý / thợ
    public int SoThangBaoHanh { get; set; } = 12;           // Số tháng bảo hành riêng cho biến thể
    public bool QuanLyTheoSerial { get; set; } = false;     // true: Bắt buộc quản lý Số Khung/Số Máy/Số Pin (Xe, Pin); false: Phụ tùng đếm số lượng
    public bool TrangThai { get; set; } = true;             // Cho phép kinh doanh biến thể này
    // 💡 Ghi chú: Số lượng tồn kho KHÔNG lưu cứng ở đây mà tính động SUM(SoLuong) từ KHO_TonKho để tránh sai lệch dữ liệu đa kho
}


##  📷 public class SP_HinhAnhSanPham
{
    public Guid HinhAnhID { get; set; }
    public Guid SanPhamID { get; set; }                     // FK SP_SanPham
    public Guid? BienTheSanPhamID { get; set; }             // FK SP_BienTheSanPham (Null: ảnh chung của sản phẩm; Có giá trị: ảnh riêng của biến thể/màu)
    public string DuongDanAnh { get; set; } = string.Empty;
    public string? TieuDe { get; set; }
    public int ThuTu { get; set; } = 0;
    public bool LaAnhDaiDien { get; set; } = false;
}


## 📷 public class SP_SoSerial : BaseAudit
{
    public Guid SoSerialID { get; set; }                    // Khóa chính
    public Guid BienTheSanPhamID { get; set; }              // FK SP_BienTheSanPham
    public string MaSerial { get; set; } = string.Empty;    // UNIQUE: Mã serial tem dán chung
    public string? SoKhung { get; set; }                    // UNIQUE nếu có: Số VIN khung xe (bắt buộc cho xe nguyên chiếc)
    public string? SoMay { get; set; }                      // Số máy / Số động cơ
    public string? SoPin { get; set; }                      // Số serial pin / ắc quy
    public string? MaQR { get; set; }                       // Dữ liệu mã QR in trên xe/tem
    public short TrangThaiID { get; set; }                  // FK DM_DanhMucChiTiet: TrongKho, DangChuyenKho, DaBan, DangBaoHanh, DangSuaChua, LoiHong...
    public Guid? KhoID { get; set; }                        // FK KHO_Kho: Vị trí kho hiện tại (khi hàng còn trong kho)
    public string? ViTriLuuTru { get; set; }                // Kệ A1, Khu trưng bày 02...
    public Guid? DonHangID { get; set; }                    // Đơn hàng xuất bán xe/pin này (FK DonHang nếu đã bán)
    public Guid? KhachHangID { get; set; }                  // FK KH_KhachHang: Khách hàng hiện đang sở hữu xe
    public DateTime? NgaySanXuat { get; set; }
    public DateTime? NgayNhap { get; set; }                 // Ngày nhập kho đầu tiên
    public DateTime? NgayXuatBan { get; set; }              // Ngày bán ra cho khách
    public DateTime? NgayBatDauBaoHanh { get; set; }        // Ngày kích hoạt bảo hành điện tử
    public DateTime? NgayKetThucBaoHanh { get; set; }
    public string? GhiChu { get; set; }
}

# endregion


# region Trả góp

## public class HopDongTraGop
{
    public Guid ID { get; set; }

    public Guid DonHangID { get; set; }

    public Guid DonViTraGopID { get; set; }

    public string SoHopDong { get; set; } = string.Empty;

    public decimal SoTienVay { get; set; }

    public decimal TienTraTruoc { get; set; }

    public int SoThangTraGop { get; set; }

    public decimal SoTienTraHangThang { get; set; }

    public decimal LaiSuat { get; set; }

    public string TrangThaiHopDong { get; set; } = string.Empty;

    public DateTime NgayTao { get; set; }
}


## public class DonViTraGop
{
    public Guid ID { get; set; }

    public string Ten { get; set; } = string.Empty;

    public string DienThoai { get; set; } = string.Empty;

    public string DiaChiAPI { get; set; } = string.Empty;

    public bool DangHoatDong { get; set; }
}

# endregion


# region Đơn hàng

## public class DH_DonHang : BaseAudit
{
    public Guid DonHangID { get; set; }
    public string MaDonHang { get; set; } = string.Empty;       // UNIQUE: DH202610-0001
    public Guid KhachHangID { get; set; }                      // FK KH_KhachHang
    public Guid DiaDiemID { get; set; }                         // FK DM_DiaDiem (Showroom/Cửa hàng bán)
    public Guid KhoXuatID { get; set; }                         // FK KHO_Kho (Kho thực tế xuất hàng)
    public long? NhanVienBanHangID { get; set; }                // Nhân viên phụ trách / hưởng doanh số

    // Phân loại & Trạng thái (FK DM_DanhMucChiTiet)
    public short LoaiDonHangID { get; set; }                    // Bán lẻ tại quầy, Bán online, Bán buôn/đại lý, Trả góp
    public short TrangThaiDonHangID { get; set; }               // Lưu tạm, Chờ xử lý, Đang giao hàng, Hoàn thành, Đã hủy...
    public short TrangThaiThanhToanID { get; set; }             // Chưa thanh toán, Thanh toán 1 phần, Đã thanh toán đủ...

    // Tài chính
    public decimal TamTinh { get; set; } = 0;                  // Tổng tiền hàng trước chiết khấu
    public decimal TienGiamGia { get; set; } = 0;              // Giảm giá voucher / khuyến mãi
    public decimal TienThueVAT { get; set; } = 0;              // Thuế VAT
    public decimal PhiVanChuyen { get; set; } = 0;             // Phí giao xe tận nhà
    public decimal PhiDichVuBienSo { get; set; } = 0;          // Phí dịch vụ làm biển số / trước bạ (nếu có)
    public decimal TongTien { get; set; } = 0;                  // = TamTinh - TienGiamGia + TienThueVAT + PhiVanChuyen + PhiDichVuBienSo
    public decimal DaThanhToan { get; set; } = 0;               // Số tiền khách đã thanh toán
    public decimal ConNo { get; set; } = 0;                     // Còn nợ = TongTien - DaThanhToan

    // Điểm thưởng tích lũy
    public int DiemSuDung { get; set; } = 0;                   // Điểm tích lũy quy đổi giảm tiền
    public int DiemTichLuyDuoc { get; set; } = 0;              // Điểm được cộng sau khi hoàn thành đơn

    // Thông tin nhận hàng (nếu giao tận nơi)
    public string? TenNguoiNhan { get; set; }
    public string? DienThoaiNguoiNhan { get; set; }
    public string? DiaChiGiaoHang { get; set; }
    public int? TinhID { get; set; }                            // FK DM_DiaPhuongCapTinh
    public int? XaID { get; set; }                              // FK DM_DiaPhuongCapXa

    public DateTime? NgayHoanThanh { get; set; }                // Thời điểm khách nhận xe & ký biên bản bàn giao
    public string? GhiChu { get; set; }
}

## public class DH_ChiTietDonHang
{
    public Guid ID { get; set; }
    public Guid DonHangID { get; set; }                         // FK DH_DonHang
    public Guid BienTheSanPhamID { get; set; }                  // FK SP_BienTheSanPham
    public string MaSKU { get; set; } = string.Empty;           // Lưu vết thời điểm bán
    public string TenSanPham { get; set; } = string.Empty;      // Tên phiên bản/màu sắc
    public short? DonViTinhID { get; set; }                     // Chiếc, Cái, Bình, Bộ...

    public int SoLuong { get; set; }                            // Số lượng bán
    public decimal DonGiaBan { get; set; }                      // Giá niêm yết bán lẻ
    public decimal DonGiaVon { get; set; } = 0;                 // Giá vốn bình quân/FIFO tính từ kho (phục vụ tính lãi gộp)
    public decimal TienGiamGia { get; set; } = 0;              // Giảm giá riêng cho dòng này
    public decimal ThueVAT { get; set; } = 0;                   // % VAT
    public decimal TienThueVAT { get; set; } = 0;
    public decimal ThanhTien { get; set; }                      // Thành tiền thực thu của dòng
    
    public bool QuanLyTheoSerial { get; set; } = false;         // true: Sản phẩm cần chọn Số Serial xuất kho
    public bool LaPhuongTien { get; set; } = false;             // true: Là xe nguyên chiếc (khi hoàn thành đơn tự sinh xe cho khách)
    public int SoThangBaoHanh { get; set; } = 12;               // Thời hạn bảo hành
    public string? GhiChu { get; set; }
}

## public class DH_SerialXuatBan
{
    public Guid ID { get; set; }
    public Guid ChiTietDonHangID { get; set; }                  // FK DH_ChiTietDonHang
    public Guid BienTheSanPhamID { get; set; }                  // FK SP_BienTheSanPham
    public Guid SoSerialID { get; set; }                        // FK SP_SoSerial (Đích danh xe trong kho)
    public string MaSerial { get; set; } = string.Empty;
    public string? SoKhung { get; set; }                        // Lưu vết Số Khung
    public string? SoMay { get; set; }                          // Lưu vết Số Máy
    public string? SoPin { get; set; }                          // Lưu vết Số Pin
    public string? BienSoXe { get; set; }                       // Biển số xe (nếu làm dịch vụ đăng ký trọn gói)
    public DateTime? NgayBatDauBaoHanh { get; set; }
    public DateTime? NgayKetThucBaoHanh { get; set; }
}

## public class DH_LichSuThanhToan : BaseAudit
{
    public Guid ID { get; set; }
    public Guid DonHangID { get; set; }                         // FK DH_DonHang
    public string MaGiaoDich { get; set; } = string.Empty;      // Mã biên lai / Mã chuẩn chi ngân hàng
    public short PhuongTucThanhToanID { get; set; }             // FK DM_DanhMucChiTiet (Tiền mặt, Chuyển khoản, POS, Trả góp...)
    public decimal SoTien { get; set; }                         // Số tiền thanh toán đợt này
    public DateTime NgayThanhToan { get; set; } = DateTime.Now;
    public string? DonViTraGop { get; set; }                    // FE Credit, Home Credit, HD Saison... (nếu là trả góp)
    public string? MaHopDongTraGop { get; set; }
    public string? GhiChu { get; set; }
}
# endregion


# region Nhập hàng
## public class NH_NhaCungCap : BaseAudit
{
    public Guid NhaCungCapID { get; set; }
    public string MaNhaCungCap { get; set; } = string.Empty; // UNIQUE: NCC-VINFAST, NCC-TIANNENG...
    public string TenNhaCungCap { get; set; } = string.Empty;
    public string DienThoai { get; set; } = string.Empty;
    public string? HopThu { get; set; }
    public string? DiaChi { get; set; }
    public byte? QuocGiaID { get; set; }                    // FK DM_QuocGia (Việt Nam, Trung Quốc, Đài Loan...)
    public int? TinhID { get; set; }                        // FK DM_DiaPhuongCapTinh
    public int? XaID { get; set; }                          // FK DM_DiaPhuongCapXa
    public string? MaSoThue { get; set; }
    public string? NguoiLienHe { get; set; }
    public string? SoTaiKhoanNganHang { get; set; }
    public string? TenNganHang { get; set; }
    public decimal CongNoHienTai { get; set; } = 0;         // Tổng nợ phải trả NCC
    public string? GhiChu { get; set; }
    public bool TrangThai { get; set; } = true;
}

## public class NH_DonNhapHang : BaseAudit
{
    public Guid DonNhapHangID { get; set; }
    public string MaDonNhap { get; set; } = string.Empty;   // UNIQUE: NH202610-0001
    public Guid NhaCungCapID { get; set; }                  // FK NH_NhaCungCap
    public Guid KhoID { get; set; }                         // FK KHO_Kho (Kho đích tiếp nhận)
    
    // --- Trạng thái lấy từ DM_DanhMucChiTiet ---
    public short? TrangThaiID { get; set; }                 // FK DM_DanhMucChiTiet (Lưu tạm, Chờ duyệt, Đã nhập kho...)
    
    // Chứng từ hãng
    public string? SoHoaDonChungTu { get; set; }            // Số hóa đơn VAT / Phiếu xuất xưởng của hãng
    public DateTime? NgayHoaDon { get; set; }

    // Tài chính
    public decimal TamTinh { get; set; } = 0;              // Tổng tiền hàng trước chiết khấu
    public decimal TienGiamGia { get; set; } = 0;          // Chiết khấu/giảm giá từ hãng
    public decimal TienThueVAT { get; set; } = 0;          // Tiền thuế VAT
    public decimal ChiPhiVanChuyen { get; set; } = 0;      // Chi phí vận chuyển/bốc xếp phân bổ
    public decimal TongTien { get; set; } = 0;              // = TamTinh - TienGiamGia + TienThueVAT + ChiPhiVanChuyen
    public decimal DaThanhToan { get; set; } = 0;           // Đã thanh toán cho NCC
    public decimal ConNo { get; set; } = 0;                 // Còn nợ = TongTien - DaThanhToan
    public DateTime? HanThanhToan { get; set; }

    // Phê duyệt & Nhập kho thực tế
    public long? NguoiDuyetID { get; set; }
    public DateTime? NgayDuyet { get; set; }
    public long? NguoiNhapKhoID { get; set; }
    public DateTime? NgayNhapKho { get; set; }
    public string? GhiChu { get; set; }
}

## public class NH_ChiTietDonNhapHang
{
    public Guid ID { get; set; }
    public Guid DonNhapHangID { get; set; }                 // FK NH_DonNhapHang
    public Guid BienTheSanPhamID { get; set; }              // FK SP_BienTheSanPham
    public string MaSKU { get; set; } = string.Empty;       // Lưu vết tại thời điểm nhập
    public string TenSanPham { get; set; } = string.Empty;  // Lưu vết tên phiên bản/màu sắc
    public int SoLuong { get; set; }                        // Số lượng nhập
    public decimal DonGiaNhap { get; set; }                 // Đơn giá nhập từ hãng (chưa thuế)
    public decimal PhanTramGiamGia { get; set; } = 0;
    public decimal TienGiamGia { get; set; } = 0;
    public decimal ThueVAT { get; set; } = 0;               // % VAT (0, 8, 10...)
    public decimal TienThueVAT { get; set; } = 0;
    public decimal ThanhTien { get; set; }                  // Thành tiền của dòng
    public bool QuanLyTheoSerial { get; set; } = false;     // true: Bắt buộc phải khai báo danh sách Serial ở bảng dưới
    public string? GhiChu { get; set; }
}

## public class NH_SerialNhapHang
{
    public Guid ID { get; set; }
    public Guid ChiTietDonNhapHangID { get; set; }           // FK NH_ChiTietDonNhapHang
    public Guid BienTheSanPhamID { get; set; }              // FK SP_BienTheSanPham
    public string MaSerial { get; set; } = string.Empty;     // Mã Serial / Barcode định danh
    public string? SoKhung { get; set; }                    // Bắt buộc đối với xe nguyên chiếc
    public string? SoMay { get; set; }                      // Số động cơ
    public string? SoPin { get; set; }                      // Serial pin/ắc quy kèm theo xe
    public DateTime? NgaySanXuat { get; set; }
    public string? ViTriLuuTru { get; set; }                // Vị trí xếp bãi/kệ (A1-01...)
    public Guid? SoSerialID { get; set; }                   // Trỏ sang SP_SoSerial sau khi nhập kho thành công
}

## public class NH_LichSuThanhToan : BaseAudit
{
    public Guid ID { get; set; }
    public Guid DonNhapHangID { get; set; }                 // FK NH_DonNhapHang
    public Guid NhaCungCapID { get; set; }                  // FK NH_NhaCungCap
    public string MaGiaoDich { get; set; } = string.Empty;  // Mã phiếu chi / UNC ngân hàng
    public short PhuongTucThanhToanID { get; set; }         // FK DM_DanhMucChiTiet (Tiền mặt, Chuyển khoản...)
    public decimal SoTien { get; set; }                     // Số tiền thanh toán
    public DateTime NgayThanhToan { get; set; } = DateTime.Now;
    public string? GhiChu { get; set; }
}
# endregion


# region Bảo hành

// 1. Sổ / Hợp đồng bảo hành điện tử của xe / pin / thiết bị
## public class BH_BaoHanh : BaseAudit
{
    public Guid BaoHanhID { get; set; }                     // Khóa chính
    public string MaBaoHanh { get; set; } = string.Empty;   // UNIQUE: BH202610-0001
    public Guid SoSerialID { get; set; }                    // FK SP_SoSerial (Đích danh xe / pin / động cơ)
    public Guid BienTheSanPhamID { get; set; }              // FK SP_BienTheSanPham
    public Guid KhachHangID { get; set; }                   // FK KH_KhachHang
    public Guid? PhuongTienKhachHangID { get; set; }        // FK KH_PhuongTienKhachHang (nếu là xe điện)
    public Guid? DonHangID { get; set; }                    // FK DH_DonHang (Đơn hàng mua gốc)
    
    public DateTime NgayKichHoat { get; set; }              // Ngày kích hoạt bảo hành
    public DateTime NgayBatDau { get; set; }                // Ngày bắt đầu tính hạn BH
    public DateTime NgayKetThuc { get; set; }               // Ngày hết hạn BH
    public int SoThangBaoHanh { get; set; } = 12;           // Thời hạn (tháng)
    public int? GioiHanKm { get; set; }                     // Giới hạn km bảo hành (ví dụ: 30.000 km hoặc 3 năm)
    
    public short TrangThaiID { get; set; }                  // FK DM_DanhMucChiTiet: Đang hiệu lực, Hết hạn, Đã hủy, Tạm ngưng
    public string? DieuKienBaoHanh { get; set; }            // Ghi chú điều khoản cam kết bảo hành
    public string? GhiChu { get; set; }
}

// 2. Phiếu tiếp nhận yêu cầu bảo hành (khi xe/pin gặp sự cố cần bảo hành)
## public class BH_PhieuBaoHanh : BaseAudit
{
    public Guid PhieuBaoHanhID { get; set; }                // Khóa chính
    public string MaPhieuBaoHanh { get; set; } = string.Empty; // UNIQUE: PBH202610-0001
    public Guid BaoHanhID { get; set; }                     // FK BH_BaoHanh
    public Guid KhachHangID { get; set; }                   // FK KH_KhachHang
    public Guid SoSerialID { get; set; }                    // FK SP_SoSerial
    public Guid DiaDiemID { get; set; }                     // FK DM_DiaDiem (Showroom / Trạm dịch vụ tiếp nhận)
    public long? NhanVienTiepNhanID { get; set; }           // Nhân viên lễ tân/cố vấn tiếp nhận
    public long? KyThuatVienID { get; set; }                // Kỹ thuật viên kiểm tra xử lý
    
    public DateTime NgayTiepNhan { get; set; } = DateTime.Now;
    public DateTime? NgayHenTra { get; set; }
    public DateTime? NgayTraThucTe { get; set; }
    public int? SoKmHienTai { get; set; }                   // Số ODO km lúc mang tới bảo hành
    
    public string MoTaLoi { get; set; } = string.Empty;     // Khách hàng phản ánh hiện tượng lỗi
    public string? KetQuaKiemTra { get; set; }              // Kỹ thuật chẩn đoán nguyên nhân
    public short HuongXuLyID { get; set; }                  // FK DM_DanhMucChiTiet: Sửa chữa tại trạm, Đổi mới linh kiện, Gửi bảo hành hãng, Từ chối BH (chuyển sửa chữa tính phí)
    public short TrangThaiID { get; set; }                  // FK DM_DanhMucChiTiet: Tiếp nhận, Đang xử lý, Chờ linh kiện, Hoàn thành, Đã bàn giao
    
    public decimal ChiPhiHangHoTro { get; set; } = 0;       // Hãng bảo hành thanh toán lại cho trạm
    public decimal ChiPhiKhachTra { get; set; } = 0;        // Chi phí ngoài phạm vi bảo hành (khách trả)
    public string? GhiChu { get; set; }
}

// 3. Chi tiết linh kiện thay thế / xử lý trong phiếu bảo hành
## public class BH_ChiTietBaoHanh
{
    public Guid ID { get; set; }
    public Guid PhieuBaoHanhID { get; set; }                // FK BH_PhieuBaoHanh
    public byte LoaiXuLy { get; set; } = 1;                 // 1: Sửa chữa/Cân chỉnh, 2: Đổi mới linh kiện/pin
    public Guid? BienTheSanPhamID { get; set; }             // FK SP_BienTheSanPham (Linh kiện được thay)
    public Guid? SoSerialCuID { get; set; }                 // FK SP_SoSerial (Serial linh kiện hỏng thu hồi)
    public Guid? SoSerialMoiID { get; set; }                // FK SP_SoSerial (Serial linh kiện mới đổi cho khách)
    public int SoLuong { get; set; } = 1;
    public decimal DonGia { get; set; } = 0;                // Đơn giá tham chiếu của linh kiện
    public decimal ChiPhiHangHoTro { get; set; } = 0;
    public decimal ChiPhiKhachTra { get; set; } = 0;
    public string? GhiChu { get; set; }
}

# endregion


# region Sửa chữa & Dịch vụ

// 1. Danh mục Dịch vụ bảo dưỡng & Sửa chữa
## public class SC_DichVu : BaseAudit
{
    public Guid DichVuID { get; set; }                      // Khóa chính
    public string MaDichVu { get; set; } = string.Empty;    // UNIQUE: DV-BD-01, DV-VAXE, DV-THAYPIN...
    public string TenDichVu { get; set; } = string.Empty;   // Bảo dưỡng toàn bộ, Vá lốp không săm, Cân vành...
    public short DanhMucChiTietID { get; set; }             // FK DM_DanhMucChiTiet (Nhóm: Bảo dưỡng định kỳ, Cơ điện, Cứu hộ...)
    public string? MoTa { get; set; }
    public decimal GiaCoBan { get; set; } = 0;              // Giá tiền công dịch vụ cơ bản
    public decimal? GiaKhuyenMai { get; set; }              // Giá ưu đãi nếu có
    public int ThoiGianDuKienPhut { get; set; } = 30;       // Thời gian thợ thực hiện ước tính (phút)
    public int ThuTu { get; set; } = 0;
    public bool TrangThai { get; set; } = true;             // Đang kinh doanh / Ngừng kinh doanh
}

// 2. Phiếu tiếp nhận sửa chữa / Phiếu dịch vụ
## public class SC_PhieuSuaChua : BaseAudit
{
    public Guid PhieuSuaChuaID { get; set; }                // Khóa chính
    public string MaPhieuSuaChua { get; set; } = string.Empty; // UNIQUE: PSC202610-0001
    public Guid KhachHangID { get; set; }                   // FK KH_KhachHang
    public Guid PhuongTienKhachHangID { get; set; }         // FK KH_PhuongTienKhachHang (Xe vào làm dịch vụ)
    public Guid DiaDiemID { get; set; }                     // FK DM_DiaDiem (Xưởng dịch vụ / Showroom)
    public Guid KhoID { get; set; }                         // FK KHO_Kho (Kho phụ tùng xuất linh kiện thay thế)
    public long? NhanVienTiepNhanID { get; set; }           // Cố vấn dịch vụ / Lễ tân lập phiếu
    public long? KyThuatVienChinhID { get; set; }           // Thợ máy chính phụ trách chính
    public Guid? PhieuBaoHanhID { get; set; }               // FK BH_PhieuBaoHanh (nếu làm dịch vụ theo bảo hành)
    
    // Phân loại & Hiện trạng
    public short LoaiDichVuID { get; set; }                 // FK DM_DanhMucChiTiet: Bảo dưỡng định kỳ, Sửa chữa phát sinh, Cứu hộ...
    public int? SoKmHienTai { get; set; }                   // Số ODO km trên đồng hồ lúc tiếp nhận
    public string? MoTaVanDe { get; set; }                  // Yêu cầu của khách / Triệu chứng xe
    public string? KetQuaChanDoan { get; set; }             // Thợ khám chẩn đoán bệnh
    public string? GiaiPhapXuLy { get; set; }               // Phương án kỹ thuật xử lý
    
    // Tiến trình & Trạng thái (FK DM_DanhMucChiTiet)
    public short TrangThaiID { get; set; }                  // Tiếp nhận, Báo giá chờ duyệt, Đang sửa, Chờ giao, Đã hoàn thành, Đã hủy
    public short TrangThaiThanhToanID { get; set; }         // Chưa thanh toán, Đặt cọc, Đã thanh toán đủ
    
    // Tài chính
    public decimal TienCongDichVu { get; set; } = 0;        // Tổng tiền công thợ
    public decimal TienPhuTung { get; set; } = 0;           // Tổng tiền phụ tùng linh kiện thay thế
    public decimal TienGiamGia { get; set; } = 0;           // Giảm giá voucher / ưu đãi
    public decimal TienThueVAT { get; set; } = 0;           // Thuế VAT
    public decimal TongTien { get; set; } = 0;              // = TienCongDichVu + TienPhuTung - TienGiamGia + TienThueVAT
    public decimal DaThanhToan { get; set; } = 0;           // Khách đã trả
    public decimal ConNo { get; set; } = 0;                 // Còn nợ = TongTien - DaThanhToan
    
    // Thời gian
    public DateTime ThoiGianTiepNhan { get; set; } = DateTime.Now;
    public DateTime? ThoiGianHenTra { get; set; }
    public DateTime? ThoiGianHoanThanh { get; set; }
    
    public int? SoThangBaoHanhSuaChua { get; set; }         // Thời hạn bảo hành cho lần sửa này (tháng)
    public string? GhiChu { get; set; }
}

// 3. Chi tiết các hạng mục công việc & Phụ tùng thay thế trong phiếu sửa chữa
## public class SC_ChiTietSuaChua
{
    public Guid ID { get; set; }                            // Khóa chính
    public Guid PhieuSuaChuaID { get; set; }                // FK SC_PhieuSuaChua
    public byte LoaiHangMuc { get; set; } = 1;              // 1: Tiền công dịch vụ, 2: Phụ tùng / Linh kiện thay thế
    public Guid? DichVuID { get; set; }                     // FK SC_DichVu (nếu LoaiHangMuc = 1)
    public Guid? BienTheSanPhamID { get; set; }             // FK SP_BienTheSanPham (nếu LoaiHangMuc = 2)
    public string MaHangMuc { get; set; } = string.Empty;   // Mã DV hoặc Mã SKU phụ tùng
    public string TenHangMuc { get; set; } = string.Empty;  // Tên công việc hoặc tên linh kiện
    public short? DonViTinhID { get; set; }                 // Lần, Giờ, Cái, Chiếc, Bộ, Bình, Lít...
    
    public int SoLuong { get; set; } = 1;
    public decimal DonGia { get; set; }                     // Đơn giá tiền công hoặc giá phụ tùng
    public decimal DonGiaVon { get; set; } = 0;             // Giá vốn phụ tùng (lấy từ kho để tính lãi/lỗ)
    public decimal TienGiamGia { get; set; } = 0;
    public decimal ThanhTien { get; set; }                  // = SoLuong * DonGia - TienGiamGia
    
    public long? KyThuatVienID { get; set; }                // Thợ phụ trách trực tiếp hạng mục này (phục vụ tính lương/KPI thợ)
    public bool XuatKhoThanhCong { get; set; } = false;     // Đã tạo phiếu xuất kho / trừ tồn kho phụ tùng chưa
    public string? GhiChu { get; set; }
}

// 4. Lịch sử thanh toán tiền sửa chữa / dịch vụ
## public class SC_LichSuThanhToan : BaseAudit
{
    public Guid ID { get; set; }
    public Guid PhieuSuaChuaID { get; set; }                // FK SC_PhieuSuaChua
    public string MaGiaoDich { get; set; } = string.Empty;  // Mã biên nhận thu tiền / Mã chuẩn chi ngân hàng
    public short PhuongTucThanhToanID { get; set; }         // FK DM_DanhMucChiTiet (Tiền mặt, Chuyển khoản, Quẹt thẻ...)
    public decimal SoTien { get; set; }                     // Số tiền khách nộp đợt này
    public DateTime NgayThanhToan { get; set; } = DateTime.Now;
    public string? GhiChu { get; set; }
}

# endregion



