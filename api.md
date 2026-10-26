# ==============================================================================

# HỆ THỐNG DANH SÁCH API - DỰ ÁN BIKEMANAGER V4

# ==============================================================================

# Base URL: {{base_url}} (Ví dụ: https://localhost:5001)

# Header Xác thực: Authorization: Bearer {{token}}

# ==============================================================================

# 1. AUTHENTICATION & HỆ THỐNG (Auth) ✅

# ==============================================================================

# Đăng nhập hệ thống lấy Bearer Token

POST {{base_url}}/api/auth/login
{
"username": "admin",
"password": "Password@123"
}

# Đăng ký tài khoản người dùng mới

POST {{base_url}}/api/auth/register
{
"username": "testuser",
"email": "test@gmail.com",
"password": "Password@123"
}

# Cập nhật thông tin tài khoản đang đăng nhập

POST {{base_url}}/api/auth/update
{
"fullname": "Quản Trị Viên",
"email": "admin@bikemanager.com",
"phoneNumber": "0901234567"
}

# ==============================================================================

# 2. DANH MỤC DÙNG CHUNG (DanhMucChungApi) ✅

# ==============================================================================

# Lấy danh sách danh mục chung có phân trang và tìm kiếm

POST {{base_url}}/api/DanhMucChungApi/Gets
{
"TuKhoa": "",
"PageIndex": 1,
"PageSize": 20,
"TrangThai": null
}

# Lấy thông tin chi tiết một danh mục chung theo ID

POST {{base_url}}/api/DanhMucChungApi/Get
{
"Id": 1
}

# Thêm mới danh mục chung

POST {{base_url}}/api/DanhMucChungApi/Add
{
"Ten": "Thương hiệu linh kiện",
"MoTa": "Các thương hiệu phụ tùng xe",
"ThuTu": 1,
"TrangThai": true
}

# Cập nhật thông tin danh mục chung

PUT {{base_url}}/api/DanhMucChungApi/Edit
{
"DanhMucID": 1,
"Ten": "Thương hiệu linh kiện & phụ tùng",
"MoTa": "Mô tả cập nhật",
"ThuTu": 1,
"TrangThai": true
}

# Xóa danh mục chung theo ID (nếu chưa có danh mục con)

DELETE {{base_url}}/api/DanhMucChungApi/Delete?DanhMucID=1

# Đồng bộ danh sách danh mục chung mặc định từ file Data/DanhMucChung.json

POST {{base_url}}/api/DanhMucChungApi/Sync

# Kiểm tra phân quyền token người dùng

POST {{base_url}}/api/DanhMucChungApi/Test

# ==============================================================================

# 3. DANH MỤC CHI TIẾT (DanhMucChiTietApi)✅

# ==============================================================================

# Lấy danh sách danh mục chi tiết theo danh mục cha hoặc tìm kiếm

POST {{base_url}}/api/DanhMucChiTietApi/Gets
{
"DanhMucID": 1,
"TuKhoa": "",
"PageIndex": 1,
"PageSize": 50,
"TrangThai": true
}

# Lấy thông tin chi tiết một danh mục con theo ID

POST {{base_url}}/api/DanhMucChiTietApi/Get
{
"Id": 1
}

# Thêm mới mục chi tiết con vào danh mục chung

POST {{base_url}}/api/DanhMucChiTietApi/Add
{
"DanhMucID": 1,
"Ten": "Pin Lithium 48V",
"MoTa": "Pin xe máy điện 48V",
"ThuTu": 1,
"TrangThai": true
}

# Cập nhật thông tin danh mục chi tiết

PUT {{base_url}}/api/DanhMucChiTietApi/Edit
{
"DanhMucChiTietID": 1,
"DanhMucID": 1,
"Ten": "Pin Lithium 48V - 20Ah",
"MoTa": "Pin xe điện dung lượng cao",
"ThuTu": 1,
"TrangThai": true
}

# Xóa danh mục chi tiết theo ID

DELETE {{base_url}}/api/DanhMucChiTietApi/Delete?DanhMucChiTietID=1

# Đồng bộ danh sách danh mục chi tiết mặc định từ file Data/DanhMucChiTiet.json

POST {{base_url}}/api/DanhMucChiTietApi/Sync

# ==============================================================================

# 4. ĐỊA PHƯƠNG - CẤP TỈNH / THÀNH PHỐ (DiaPhuongCapTinhApi)✅

# ==============================================================================

# Lấy danh sách tỉnh/thành phố có tìm kiếm và phân trang

POST {{base_url}}/api/DiaPhuongCapTinhApi/Gets
{
"TuKhoa": "Hà Nội",
"PageIndex": 1,
"PageSize": 100,
"TrangThai": true
}

# Lấy chi tiết thông tin một tỉnh/thành phố theo ID

POST {{base_url}}/api/DiaPhuongCapTinhApi/Get
{
"Id": 1
}

# Thêm mới tỉnh/thành phố

POST {{base_url}}/api/DiaPhuongCapTinhApi/Add
{
"MaTinh": "01",
"Ten": "Thành phố Hà Nội",
"TenKhongDau": "Thanh pho Ha Noi",
"ThuTu": 1,
"Loai": 2,
"TrangThai": true
}

# Cập nhật thông tin tỉnh/thành phố

PUT {{base_url}}/api/DiaPhuongCapTinhApi/Edit
{
"TinhID": 1,
"MaTinh": "01",
"Ten": "Thành phố Hà Nội",
"TenKhongDau": "Thanh pho Ha Noi",
"ThuTu": 1,
"Loai": 2,
"TrangThai": true
}

# Xóa tỉnh/thành phố theo ID

DELETE {{base_url}}/api/DiaPhuongCapTinhApi/Delete?TinhID=1

# Đồng bộ danh sách tỉnh/thành phố từ dữ liệu chuẩn

POST {{base_url}}/api/DiaPhuongCapTinhApi/Sync

# ==============================================================================

# 5. DANH MỤC QUỐC GIA (QuocGiaApi)✅

# ==============================================================================

# Lấy danh sách quốc gia có phân trang và tìm kiếm

POST {{base_url}}/api/QuocGiaApi/Gets
{
"TuKhoa": "",
"PageIndex": 1,
"PageSize": 50,
"TrangThai": true
}

# Lấy chi tiết thông tin một quốc gia theo ID

POST {{base_url}}/api/QuocGiaApi/Get
{
"Id": 1
}

# Thêm mới quốc gia

POST {{base_url}}/api/QuocGiaApi/Add
{
"MaQuocGia": "VN",
"Ten": "Việt Nam",
"TenKhongDau": "Viet Nam",
"ThuTu": 1,
"TrangThai": true
}

# Cập nhật thông tin quốc gia

PUT {{base_url}}/api/QuocGiaApi/Edit
{
"QuocGiaID": 1,
"MaQuocGia": "VN",
"Ten": "Việt Nam",
"TenKhongDau": "Viet Nam",
"ThuTu": 1,
"TrangThai": true
}

# Xóa quốc gia theo ID

DELETE {{base_url}}/api/QuocGiaApi/Delete?QuocGiaID=1

# Đồng bộ danh mục quốc gia từ file Data/QuocGia.json

POST {{base_url}}/api/QuocGiaApi/Sync

# ==============================================================================

# 6. ĐỊA PHƯƠNG - CẤP XÃ / PHƯỜNG / THỊ TRẤN (DiaPhuongCapXaApi)✅

# ==============================================================================

# Lấy danh sách xã/phường trực thuộc theo TỉnhID

POST {{base_url}}/api/DiaPhuongCapXaApi/Gets
{
"TinhID": 1,
"TuKhoa": "",
"PageIndex": 1,
"PageSize": 100,
"TrangThai": true
}

# Lấy chi tiết thông tin một xã/phường theo ID

POST {{base_url}}/api/DiaPhuongCapXaApi/Get
{
"Id": 1
}

# Thêm mới xã/phường trực thuộc một tỉnh

POST {{base_url}}/api/DiaPhuongCapXaApi/Add
{
"TinhID": 1,
"MaXa": "00001",
"Ten": "Phường Phúc Xá",
"TenKhongDau": "Phuong Phuc Xa",
"Loai": 2,
"ThuTu": 1,
"TrangThai": true
}

# Cập nhật thông tin xã/phường

PUT {{base_url}}/api/DiaPhuongCapXaApi/Edit
{
"XaID": 1,
"TinhID": 1,
"MaXa": "00001",
"Ten": "Phường Phúc Xá",
"TenKhongDau": "Phuong Phuc Xa",
"Loai": 2,
"ThuTu": 1,
"TrangThai": true
}

# Xóa xã/phường theo ID

DELETE {{base_url}}/api/DiaPhuongCapXaApi/Delete?XaID=1

# Đồng bộ danh sách xã/phường từ nguồn dữ liệu chuẩn

POST {{base_url}}/api/DiaPhuongCapXaApi/Sync

# ==============================================================================

# 6. ĐỊA ĐIỂM - CHI NHÁNH / CỬA HÀNG / SHOWROOM (DiaDiemApi)✅

# ==============================================================================

# Lấy danh sách địa điểm / chi nhánh có phân trang và lọc theo tỉnh thành

POST {{base_url}}/api/DiaDiemApi/Gets
{
"TuKhoa": "",
"TinhID": null,
"PageIndex": 1,
"PageSize": 20,
"TrangThai": true
}

# Lấy thông tin chi tiết địa điểm theo ID

POST {{base_url}}/api/DiaDiemApi/Get
{
"GuidId": "00000000-0000-0000-0000-000000000000"
}

# Thêm mới địa điểm cửa hàng / showroom (Hỗ trợ upload ảnh đại diện qua formData)

POST {{base_url}}/api/DiaDiemApi/Add [formData]
DiaDiemCapChaID:
LoaiDiaDiemID: 1
TenDiaDiem: Showroom BikeManager Cầu Giấy
MoTa: Showroom phân phối xe điện và trạm bảo hành
TinhID: 1
XaID: 1
KinhDo: 105.7832
ViDo: 21.0333
DiaChiSo: 123 Đường Cầu Giấy, Phường Quan Hoa
TrangThai: true
file: (binary/image file)

# Cập nhật thông tin địa điểm (Hỗ trợ upload đổi ảnh hoặc xóa ảnh qua formData)

POST {{base_url}}/api/DiaDiemApi/Edit [formData]
DiaDiemID: 00000000-0000-0000-0000-000000000000
DiaDiemCapChaID:
LoaiDiaDiemID: 1
TenDiaDiem: Showroom BikeManager Cầu Giấy (Updated)
MoTa: Cập nhật thông tin showroom
TinhID: 1
XaID: 1
KinhDo: 105.7832
ViDo: 21.0333
DiaChiSo: 123 Đường Cầu Giấy, Phường Quan Hoa
TrangThai: true
XoaFile: false
file: (binary/image file)

# Xóa địa điểm theo ID

DELETE {{base_url}}/api/DiaDiemApi/Delete?DiaDiemID=00000000-0000-0000-0000-000000000000

# ==============================================================================

# 7. KHÁCH HÀNG (KhachHangApi)

# ==============================================================================

# Lấy danh sách khách hàng có phân trang, lọc từ khóa, tỉnh thành, loại cá nhân/doanh nghiệp

POST {{base_url}}/api/KhachHangApi/Gets
{
"TuKhoa": "0901234567",
"TinhID": null,
"PageIndex": 1,
"PageSize": 20,
"TrangThai": true
}

# Lấy chi tiết thông tin hồ sơ khách hàng theo ID

POST {{base_url}}/api/KhachHangApi/Get
{
"KhachHangID": "00000000-0000-0000-0000-000000000000"
}

# Thêm mới khách hàng cá nhân hoặc doanh nghiệp (Hỗ trợ upload ảnh qua formData)

POST {{base_url}}/api/KhachHangApi/Add [formData]
LoaiKhachHang: 1
TenKhachHang: Nguyễn Văn A
DienThoai: 0901234567
HopThu: nguyenvana@gmail.com
DiaChi: 456 Hoàng Hoa Thám
TinhID: 1
XaID: 1
MaDinhDanh: 001200001234
NgayCapMaDinhDanh: 2021-05-15
NoiCapMaDinhDanh: Cục CS QLHC về TTXH
NgaySinh: 1995-10-20
GioiTinhID: 1
QuocTichID: 1
DanTocID: 1
GhiChu: Khách hàng mua xe trả góp
TrangThai: true
anhChanDung: (binary/image file - dành cho KH cá nhân)
anhBieuTrung: (binary/image file - logo dành cho KH doanh nghiệp)

# Cập nhật thông tin khách hàng (Hỗ trợ upload ảnh chân dung / logo hoặc xóa ảnh qua formData)

POST {{base_url}}/api/KhachHangApi/Edit [formData]
KhachHangID: 00000000-0000-0000-0000-000000000000
LoaiKhachHang: 1
TenKhachHang: Nguyễn Văn A
DienThoai: 0901234567
HopThu: nguyenvana_new@gmail.com
DiaChi: 456 Hoàng Hoa Thám
TinhID: 1
XaID: 1
MaDinhDanh: 001200001234
TrangThai: true
XoaAnhChanDung: false
XoaAnhBieuTrung: false
anhChanDung: (binary/image file)

# Xóa khách hàng theo ID

DELETE {{base_url}}/api/KhachHangApi/Delete?KhachHangID=00000000-0000-0000-0000-000000000000

# ==============================================================================

# 8. PHƯƠNG TIỆN THUỘC SỞ HỮU CỦA KHÁCH HÀNG (PhuongTienKhachHangApi)

# ==============================================================================

# Lấy danh sách phương tiện xe cộ của khách hàng

POST {{base_url}}/api/PhuongTienKhachHangApi/Gets
{
"KhachHangID": "00000000-0000-0000-0000-000000000000",
"TuKhoa": "",
"PageIndex": 1,
"PageSize": 20
}

# Lấy chi tiết thông tin phương tiện xe của khách theo ID

POST {{base_url}}/api/PhuongTienKhachHangApi/Get
{
"GuidId": "00000000-0000-0000-0000-000000000000"
}

# Thêm mới phương tiện xe của khách (Xe mua tại cửa hàng hoặc xe ngoài mang vào bảo dưỡng)

POST {{base_url}}/api/PhuongTienKhachHangApi/Add
{
"KhachHangID": "00000000-0000-0000-0000-000000000000",
"ThuongHieuID": "00000000-0000-0000-0000-000000000000",
"TenModel": "VinFast Feliz S",
"BienSo": "29A1-123.45",
"SoKhung": "VF1234567890",
"SoMay": "ENG12345678",
"MauSac": "Đen nhám",
"SoKmHienTai": 1500,
"NgayMua": "2024-01-10T00:00:00Z",
"GhiChu": "Xe mua mới tại showroom",
"TrangThai": true
}

# Cập nhật thông tin xe của khách hàng

PUT {{base_url}}/api/PhuongTienKhachHangApi/Edit
{
"ID": "00000000-0000-0000-0000-000000000000",
"KhachHangID": "00000000-0000-0000-0000-000000000000",
"ThuongHieuID": "00000000-0000-0000-0000-000000000000",
"TenModel": "VinFast Feliz S",
"BienSo": "29A1-123.45",
"SoKmHienTai": 3200,
"MauSac": "Đen nhám",
"TrangThai": true
}

# Xóa thông tin xe của khách hàng theo ID

DELETE {{base_url}}/api/PhuongTienKhachHangApi/Delete?PhuongTienID=00000000-0000-0000-0000-000000000000

# ==============================================================================

# 9. LỊCH SỬ SỞ HỮU & CHUYỂN NHƯỢNG XE (LichSuSoHuuPhuongTienApi)

# ==============================================================================

# Lấy danh sách lịch sử sở hữu phương tiện theo xe hoặc khách hàng

POST {{base_url}}/api/LichSuSoHuuPhuongTienApi/Gets
{
"PhuongTienKhachHangID": "00000000-0000-0000-0000-000000000000",
"PageIndex": 1,
"PageSize": 20
}

# Lấy chi tiết một lượt ghi nhận sở hữu phương tiện

POST {{base_url}}/api/LichSuSoHuuPhuongTienApi/Get
{
"GuidId": "00000000-0000-0000-0000-000000000000"
}

# Ghi nhận lượt sở hữu phương tiện thủ công

POST {{base_url}}/api/LichSuSoHuuPhuongTienApi/Add
{
"PhuongTienKhachHangID": "00000000-0000-0000-0000-000000000000",
"KhachHangID": "00000000-0000-0000-0000-000000000000",
"NgayBatDauSoHuu": "2024-01-10T00:00:00Z",
"LaChuSoHuuHienTai": true,
"LyDo": "MuaMoi"
}

# Nghiệp vụ chuyển quyền sở hữu xe (Sang tên xe, thu cũ đổi mới, bán lại xe cũ cho chủ mới)

POST {{base_url}}/api/LichSuSoHuuPhuongTienApi/ChuyenQuyenSoHuu
{
"PhuongTienKhachHangID": "00000000-0000-0000-0000-000000000000",
"KhachHangMoiID": "11111111-1111-1111-1111-111111111111",
"DonHangID": null,
"LyDo": "SangTen",
"GhiChu": "Chuyển nhượng xe máy điện cho chủ sở hữu mới"
}

# ==============================================================================

# 10. THỐNG KÊ, CÔNG NỢ & ĐIỂM THƯỞNG KHÁCH HÀNG (ThongKeKhachHangApi)

# ==============================================================================

# Lấy danh sách thống kê xếp hạng thành viên, công nợ, điểm thưởng khách hàng

POST {{base_url}}/api/ThongKeKhachHangApi/Gets
{
"TuKhoa": "",
"PageIndex": 1,
"PageSize": 20
}

# Lấy chi tiết thông số thống kê, điểm tích lũy của một khách hàng

POST {{base_url}}/api/ThongKeKhachHangApi/Get
{
"KhachHangID": "00000000-0000-0000-0000-000000000000"
}

# Điều chỉnh hạng thẻ thành viên, tỷ lệ chiết khấu, điểm tích lũy hoặc công nợ khách hàng

PUT {{base_url}}/api/ThongKeKhachHangApi/Edit
{
"KhachHangID": "00000000-0000-0000-0000-000000000000",
"HangKhachHang": "Vang",
"TyLeGiamGia": 5.0,
"DiemTichLuy": 250,
"CongNoHienTai": 0
}

# ==============================================================================

# 11. KHO HÀNG & BÃI XE (KhoApi)

# ==============================================================================

# Lấy danh sách kho hàng / kho xe có phân trang và tìm kiếm

POST {{base_url}}/api/KhoApi/Gets
{
"TuKhoa": "",
"PageIndex": 1,
"PageSize": 20,
"TrangThai": true
}

# Lấy chi tiết thông tin kho hàng theo ID

POST {{base_url}}/api/KhoApi/Get
{
"GuidId": "00000000-0000-0000-0000-000000000000"
}

# Thêm mới kho hàng hoặc bãi lưu trữ xe

POST {{base_url}}/api/KhoApi/Add
{
"MaKho": "KHO-HN01",
"TenKho": "Kho Tổng Hà Nội",
"DiaDiemID": "00000000-0000-0000-0000-000000000000",
"LoaiKhoID": 1,
"DiaChi": "Số 1 Đại lộ Thăng Long, Nam Từ Liêm, Hà Nội",
"DienThoai": "02431234567",
"LaKhoMacDinh": true,
"ChoPhepTonAm": false,
"TrangThai": true,
"GhiChu": "Kho trung tâm lưu trữ toàn bộ xe điện và phụ tùng"
}

# Cập nhật thông tin kho hàng

POST {{base_url}}/api/KhoApi/Edit
{
"KhoID": "00000000-0000-0000-0000-000000000000",
"MaKho": "KHO-HN01",
"TenKho": "Kho Tổng Hà Nội (Cập nhật)",
"DiaDiemID": "00000000-0000-0000-0000-000000000000",
"LoaiKhoID": 1,
"DiaChi": "Số 1 Đại lộ Thăng Long, Nam Từ Liêm, Hà Nội",
"DienThoai": "02431234567",
"LaKhoMacDinh": true,
"ChoPhepTonAm": false,
"TrangThai": true,
"GhiChu": "Ghi chú cập nhật"
}

# Xóa kho hàng theo ID (chỉ cho phép xóa khi kho chưa có số liệu tồn kho)

POST {{base_url}}/api/KhoApi/Delete
{
"KhoID": "00000000-0000-0000-0000-000000000000"
}

# ==============================================================================

# 12. QUẢN LÝ TỒN KHO & THẺ KHO (TonKhoApi)

# ==============================================================================

# Lấy danh sách tồn kho thực tế, tồn khả dụng và cảnh báo hết hàng theo từng kho

POST {{base_url}}/api/TonKhoApi/Gets
{
"KhoID": "00000000-0000-0000-0000-000000000000",
"TuKhoa": "",
"PageIndex": 1,
"PageSize": 50
}

# Lấy thông tin chi tiết tồn kho của một mặt hàng biến thể tại một kho cụ thể

POST {{base_url}}/api/TonKhoApi/Get
{
"KhoID": "00000000-0000-0000-0000-000000000000",
"BienTheSanPhamID": "00000000-0000-0000-0000-000000000000"
}

# Cập nhật ngưỡng tồn kho an toàn tối thiểu và vị trí lưu trữ giá/kệ

POST {{base_url}}/api/TonKhoApi/UpdateDinhMuc
{
"KhoID": "00000000-0000-0000-0000-000000000000",
"BienTheSanPhamID": "00000000-0000-0000-0000-000000000000",
"SoLuongToiThieu": 5,
"ViTriLuuTru": "Kệ A1-02"
}

# Lấy sổ theo dõi biến động thẻ kho / lịch sử nhập - xuất - chuyển kho của mặt hàng

POST {{base_url}}/api/TonKhoApi/GetGiaoDichs
{
"KhoID": "00000000-0000-0000-0000-000000000000",
"BienTheSanPhamID": "00000000-0000-0000-0000-000000000000",
"TuNgay": "2024-01-01T00:00:00Z",
"DenNgay": "2024-12-31T23:59:59Z",
"PageIndex": 1,
"PageSize": 50
}

# ==============================================================================

# 13. PHIẾU ĐIỀU CHUYỂN KHO NỘI BỘ (PhieuChuyenKhoApi)

# ==============================================================================

# Lấy danh sách phiếu chuyển kho giữa các chi nhánh có lọc theo trạng thái

POST {{base_url}}/api/PhieuChuyenKhoApi/Gets
{
"TuKhoa": "",
"KhoID": null,
"TrangThaiID": null,
"PageIndex": 1,
"PageSize": 20
}

# Lấy chi tiết phiếu chuyển kho kèm danh sách mặt hàng và số serial chuyển

POST {{base_url}}/api/PhieuChuyenKhoApi/Get
{
"GuidId": "00000000-0000-0000-0000-000000000000"
}

# Tạo phiếu điều chuyển kho mới giữa 2 kho

POST {{base_url}}/api/PhieuChuyenKhoApi/Add
{
"KhoXuatID": "00000000-0000-0000-0000-000000000000",
"KhoNhapID": "11111111-1111-1111-1111-111111111111",
"NguoiGiaoHang": "Trần Văn Vận Chuyển",
"BienSoXeVanChuyen": "29C-999.88",
"GhiChu": "Điều chuyển 2 xe điện sang showroom Cầu Giấy",
"ChiTiets": [
{
"BienTheSanPhamID": "22222222-2222-2222-2222-222222222222",
"SoSerialID": "33333333-3333-3333-3333-333333333333",
"SoLuongChuyen": 1,
"DonGiaVon": 18500000,
"GhiChu": "Xe mới nguyên đai"
}
]
}

# Nghiệp vụ duyệt xuất kho điều chuyển (Trừ tồn kho xuất, chuyển trạng thái hàng đang đi đường)

POST {{base_url}}/api/PhieuChuyenKhoApi/XuatKho
{
"PhieuChuyenKhoID": "00000000-0000-0000-0000-000000000000",
"GhiChu": "Đã xuất hàng lên xe vận chuyển"
}

# Nghiệp vụ xác nhận nhận hàng tại kho đích (Cộng tồn kho nhập, cập nhật vị trí kho mới cho Serial)

POST {{base_url}}/api/PhieuChuyenKhoApi/NhanHang
{
"PhieuChuyenKhoID": "00000000-0000-0000-0000-000000000000",
"GhiChu": "Kho đích đã nhận đủ hàng nguyên vẹn",
"ThucNhans": [
{
"BienTheSanPhamID": "22222222-2222-2222-2222-222222222222",
"SoSerialID": "33333333-3333-3333-3333-333333333333",
"SoLuongThucNhan": 1
}
]
}

# Hủy phiếu điều chuyển kho (khi chưa hoàn tất nhận hàng)

POST {{base_url}}/api/PhieuChuyenKhoApi/Huy
{
"PhieuChuyenKhoID": "00000000-0000-0000-0000-000000000000",
"GhiChu": "Hủy phiếu điều chuyển theo yêu cầu điều phối"
}

# ==============================================================================

# 14. PHIẾU KIỂM KÊ KHO HÀNG (PhieuKiemKeApi)

# ==============================================================================

# Lấy danh sách phiếu kiểm kê kho có phân trang và lọc theo trạng thái

POST {{base_url}}/api/PhieuKiemKeApi/Gets
{
"KhoID": "00000000-0000-0000-0000-000000000000",
"PageIndex": 1,
"PageSize": 20
}

# Lấy chi tiết phiếu kiểm kê kèm kết quả đối soát số lượng tồn sổ sách và thực tế

POST {{base_url}}/api/PhieuKiemKeApi/Get
{
"GuidId": "00000000-0000-0000-0000-000000000000"
}

# Tạo mới phiếu kiểm kê kho (Khởi tạo số lượng tồn hệ thống chốt tại thời điểm kiểm)

POST {{base_url}}/api/PhieuKiemKeApi/Add
{
"KhoID": "00000000-0000-0000-0000-000000000000",
"GhiChu": "Kiểm kê định kỳ cuối tháng",
"BienTheSanPhamIDs": []
}

# Cập nhật số đếm thực tế kiểm kê tại kho

POST {{base_url}}/api/PhieuKiemKeApi/CapNhatSoDem
{
"PhieuKiemKeID": "00000000-0000-0000-0000-000000000000",
"ChiTiets": [
{
"BienTheSanPhamID": "22222222-2222-2222-2222-222222222222",
"SoSerialID": null,
"SoLuongThucTe": 8,
"LyDoLechID": 1,
"GhiChuLyDo": "Thực tế thiếu 1 chiếc do xuất hàng chưa lập phiếu"
}
]
}

# Nghiệp vụ duyệt và cân bằng kho tự động (Sinh giao dịch bù trừ để tồn thực tế khớp hệ thống)

POST {{base_url}}/api/PhieuKiemKeApi/CanBang
{
"PhieuKiemKeID": "00000000-0000-0000-0000-000000000000",
"GhiChu": "Duyệt cân bằng kho theo biên bản kiểm kê"
}

# Hủy bỏ phiếu kiểm kê kho

POST {{base_url}}/api/PhieuKiemKeApi/Huy
{
"PhieuKiemKeID": "00000000-0000-0000-0000-000000000000",
"GhiChu": "Hủy phiếu kiểm kê"
}

# ==============================================================================

# 15. THƯƠNG HIỆU SẢN PHẨM (ThuongHieuApi)

# ==============================================================================

# Lấy danh sách thương hiệu / hãng sản xuất xe và linh kiện

POST {{base_url}}/api/ThuongHieuApi/Gets
{
"TuKhoa": "",
"PageIndex": 1,
"PageSize": 50,
"TrangThai": true
}

# Lấy chi tiết thông tin thương hiệu theo ID

POST {{base_url}}/api/ThuongHieuApi/Get
{
"GuidId": "00000000-0000-0000-0000-000000000000"
}

# Thêm mới thương hiệu hãng sản xuất (Hỗ trợ upload logo qua formData)

POST {{base_url}}/api/ThuongHieuApi/Add [formData]
MaThuongHieu: VINFAST
TenThuongHieu: VinFast
DuongDan: vinfast
QuocGiaID: 1
QuocGia: Việt Nam
MoTa: Hãng xe máy điện và ô tô điện Việt Nam
ThuTu: 1
TrangThai: true
file: (binary/image file - logo hãng)

# Cập nhật thông tin thương hiệu (Hỗ trợ upload đổi logo hoặc xóa logo qua formData)

POST {{base_url}}/api/ThuongHieuApi/Edit [formData]
ThuongHieuID: 00000000-0000-0000-0000-000000000000
MaThuongHieu: VINFAST
TenThuongHieu: VinFast Auto
DuongDan: vinfast
QuocGiaID: 1
QuocGia: Việt Nam
MoTa: Cập nhật thông tin hãng
ThuTu: 1
TrangThai: true
XoaFile: false
file: (binary/image file)

# Xóa thương hiệu theo ID

POST {{base_url}}/api/ThuongHieuApi/Delete
{
"ThuongHieuID": "00000000-0000-0000-0000-000000000000"
}

# ==============================================================================

# 16. SẢN PHẨM / DÒNG XE / PHỤ TÙNG (SanPhamApi)

# ==============================================================================

# Lấy danh sách sản phẩm có phân trang, lọc theo danh mục chi tiết, thương hiệu

POST {{base_url}}/api/SanPhamApi/Gets
{
"TuKhoa": "Feliz",
"DanhMucChiTietID": null,
"ThuongHieuID": null,
"PageIndex": 1,
"PageSize": 20,
"TrangThai": true
}

# Lấy chi tiết sản phẩm kèm toàn bộ danh sách biến thể màu sắc/pin và ảnh đại diện

POST {{base_url}}/api/SanPhamApi/Get
{
"GuidId": "00000000-0000-0000-0000-000000000000"
}

# Thêm mới sản phẩm cha (Hỗ trợ upload ảnh đại diện qua formData)

POST {{base_url}}/api/SanPhamApi/Add [formData]
MaSanPham: SP-FELIZ-S
TenSanPham: Xe máy điện VinFast Feliz S
DanhMucChiTietID: 5
ThuongHieuID: 00000000-0000-0000-0000-000000000000
DuongDan: vinfast-feliz-s
DonViTinhID: 1
MoTaNgan: Dòng xe máy điện đô thị thanh lịch, pin LFP bền bỉ
MoTa: Chi tiết thông số động cơ và pin
SoThangBaoHanhMacDinh: 36
LaPhuongTien: true
DaXuatBan: true
TrangThai: true
file: (binary/image file - ảnh đại diện sản phẩm)

# Cập nhật thông tin sản phẩm (Hỗ trợ upload đổi ảnh đại diện hoặc xóa ảnh qua formData)

POST {{base_url}}/api/SanPhamApi/Edit [formData]
SanPhamID: 00000000-0000-0000-0000-000000000000
MaSanPham: SP-FELIZ-S
TenSanPham: Xe máy điện VinFast Feliz S 2024
DanhMucChiTietID: 5
ThuongHieuID: 00000000-0000-0000-0000-000000000000
DuongDan: vinfast-feliz-s
DonViTinhID: 1
SoThangBaoHanhMacDinh: 36
LaPhuongTien: true
DaXuatBan: true
TrangThai: true
XoaFile: false
file: (binary/image file)

# Xóa sản phẩm theo ID (xóa mềm hoặc xóa cứng nếu chưa có biến thể/giao dịch)

POST {{base_url}}/api/SanPhamApi/Delete
{
"SanPhamID": "00000000-0000-0000-0000-000000000000"
}

# ==============================================================================

# 17. BIẾN THỂ SẢN PHẨM & ALBUM ẢNH (BienTheSanPhamApi)

# ==============================================================================

# Lấy danh sách các biến thể theo sản phẩm hoặc tra cứu SKU toàn hệ thống

POST {{base_url}}/api/BienTheSanPhamApi/Gets
{
"SanPhamID": "00000000-0000-0000-0000-000000000000",
"TuKhoa": "",
"PageIndex": 1,
"PageSize": 50
}

# Lấy thông tin chi tiết một biến thể theo ID

POST {{base_url}}/api/BienTheSanPhamApi/Get
{
"GuidId": "00000000-0000-0000-0000-000000000000"
}

# Tra cứu siêu tốc cho quầy bán hàng POS bằng Barcode / Mã SKU để lấy giá và tồn từng kho

POST {{base_url}}/api/BienTheSanPhamApi/GetByBarcodeOrSKU
{
"TuKhoa": "SKU-FELIZS-DEN",
"KhoID": "00000000-0000-0000-0000-000000000000"
}

# Thêm mới biến thể sản phẩm (Màu sắc, Dung lượng pin, Giá bán) - Hỗ trợ upload ảnh qua formData

POST {{base_url}}/api/BienTheSanPhamApi/Add [formData]
SanPhamID: 00000000-0000-0000-0000-000000000000
MaSKU: SKU-FELIZS-DEN
MaVach: 8931234567890
TenBienThe: VinFast Feliz S - Màu Đen Nhám (Pin LFP 3.5kWh)
MauSac: Đen nhám
DungLuongPin: 3.5 kWh
CongSuatDongCo: 3000W
GiaNhap: 22000000
GiaBan: 27000000
GiaBanSi: 25000000
SoThangBaoHanh: 36
QuanLyTheoSerial: true
TrangThai: true
file: (binary/image file - hình ảnh màu xe)

# Cập nhật thông tin biến thể sản phẩm (Hỗ trợ upload đổi ảnh hoặc xóa ảnh qua formData)

POST {{base_url}}/api/BienTheSanPhamApi/Edit [formData]
BienTheSanPhamID: 00000000-0000-0000-0000-000000000000
SanPhamID: 00000000-0000-0000-0000-000000000000
MaSKU: SKU-FELIZS-DEN
TenBienThe: VinFast Feliz S - Màu Đen Nhám
GiaNhap: 22000000
GiaBan: 26900000
GiaBanSi: 25000000
SoThangBaoHanh: 36
QuanLyTheoSerial: true
TrangThai: true
XoaFile: false
file: (binary/image file)

# Xóa biến thể sản phẩm theo ID

POST {{base_url}}/api/BienTheSanPhamApi/Delete
{
"BienTheSanPhamID": "00000000-0000-0000-0000-000000000000"
}

# Lấy bộ sưu tập gallery hình ảnh của sản phẩm / biến thể

POST {{base_url}}/api/BienTheSanPhamApi/GetHinhAnhs
{
"SanPhamID": "00000000-0000-0000-0000-000000000000",
"BienTheSanPhamID": null
}

# Thêm hình ảnh mới vào bộ sưu tập gallery sản phẩm (Hỗ trợ upload file qua formData)

POST {{base_url}}/api/BienTheSanPhamApi/AddHinhAnh [formData]
SanPhamID: 00000000-0000-0000-0000-000000000000
BienTheSanPhamID:
TieuDe: Ảnh chụp góc nghiêng xe
ThuTuSapXep: 1
LaAnhDaiDien: false
file: (binary/image file)

# Xóa hình ảnh khỏi bộ sưu tập gallery

POST {{base_url}}/api/BienTheSanPhamApi/DeleteHinhAnh
{
"HinhAnhID": "00000000-0000-0000-0000-000000000000"
}

# ==============================================================================

# 18. QUẢN LÝ SỐ SERIAL, SỐ KHUNG XE & BẢO HÀNH ĐIỆN TỬ (SoSerialApi)

# ==============================================================================

# Lấy danh sách số serial / số khung xe có lọc theo kho, trạng thái bán/tồn/bảo hành

POST {{base_url}}/api/SoSerialApi/Gets
{
"TuKhoa": "",
"KhoID": null,
"TrangThaiID": null,
"PageIndex": 1,
"PageSize": 50
}

# Lấy chi tiết định danh một xe / thiết bị theo Serial ID

POST {{base_url}}/api/SoSerialApi/Get
{
"GuidId": "00000000-0000-0000-0000-000000000000"
}

# Đăng ký mới số khung / số máy / serial khi nhập kho hàng xe

POST {{base_url}}/api/SoSerialApi/Add
{
"BienTheSanPhamID": "00000000-0000-0000-0000-000000000000",
"MaSerial": "SER-VF2024001",
"SoKhung": "VNK1234567890ABCD",
"SoMay": "ENG9876543210",
"SoPin": "BATLFP3500001",
"TrangThaiID": 1,
"KhoID": "00000000-0000-0000-0000-000000000000",
"ViTriLuuTru": "Khu trưng bày A",
"NgaySanXuat": "2024-01-01T00:00:00Z",
"GhiChu": "Xe mới nhập xưởng nguyên kiện"
}

# Kích hoạt bảo hành điện tử khi bán xe cho khách hàng (Tự tính hạn bảo hành và gán chủ sở hữu)

POST {{base_url}}/api/SoSerialApi/KichHoatBaoHanh
{
"SoSerialID": "00000000-0000-0000-0000-000000000000",
"KhachHangID": "11111111-1111-1111-1111-111111111111",
"DonHangID": null,
"TrangThaiDaBanID": 61,
"BienSoXe": "29B1-888.99"
}

# Tra cứu công khai thông tin bảo hành điện tử qua Số Khung, Số Serial hoặc SĐT khách hàng

POST {{base_url}}/api/SoSerialApi/TraCuuBaoHanh
{
"TuKhoa": "VNK1234567890ABCD"
}

# Chuyển trạng thái serial thiết bị (Tiếp nhận bảo hành, Đang sửa chữa tại xưởng, Bàn giao xe cho khách)

POST {{base_url}}/api/SoSerialApi/ChuyenTrangThai
{
"SoSerialID": "00000000-0000-0000-0000-000000000000",
"TrangThaiID": 3,
"GhiChu": "Tiếp nhận bảo hành thay cảm biến ga"
}

# ==============================================================================

# 20. NHÀ CUNG CẤP (NhaCungCapApi)

# ==============================================================================

# Lấy danh sách nhà cung cấp có phân trang, lọc từ khóa, quốc gia, công nợ

POST {{base_url}}/api/NhaCungCapApi/Gets
{
"TuKhoa": "",
"QuocGiaID": 1,
"CoCongNo": null,
"PageIndex": 1,
"PageSize": 20,
"TrangThai": true
}

# Lấy chi tiết thông tin nhà cung cấp theo ID hoặc Mã

POST {{base_url}}/api/NhaCungCapApi/Get
{
"GuidId": "00000000-0000-0000-0000-000000000000"
}

# Thêm mới nhà cung cấp

POST {{base_url}}/api/NhaCungCapApi/Add
{
"MaNhaCungCap": "NCC-VINFAST",
"TenNhaCungCap": "Công ty TNHH Sản Xuất & Kinh Doanh VinFast",
"DienThoai": "1900232389",
"HopThu": "cskh@vinfast.vn",
"DiaChi": "Khu công nghiệp Đình Vũ, Hải Phòng",
"QuocGiaID": 1,
"TinhID": 1,
"XaID": 1,
"MaSoThue": "0108928374",
"NguoiLienHe": "Nguyễn Văn Đại Diện",
"SoTaiKhoanNganHang": "19034567890123",
"TenNganHang": "Techcombank",
"GhiChu": "Nhà cung cấp xe máy điện và pin LFP chính hãng",
"TrangThai": true
}

# Cập nhật thông tin nhà cung cấp

PUT {{base_url}}/api/NhaCungCapApi/Edit
{
"NhaCungCapID": "00000000-0000-0000-0000-000000000000",
"TenNhaCungCap": "VinFast Auto Trading (Updated)",
"DienThoai": "1900232389",
"HopThu": "cskh@vinfast.vn",
"DiaChi": "Khu công nghiệp Đình Vũ, Hải Phòng",
"QuocGiaID": 1,
"TinhID": 1,
"XaID": 1,
"MaSoThue": "0108928374",
"NguoiLienHe": "Nguyễn Văn B",
"GhiChu": "Cập nhật thông tin hợp đồng mới",
"TrangThai": true
}

# Xóa nhà cung cấp theo ID (chỉ cho phép khi chưa phát sinh đơn nhập hàng)

DELETE {{base_url}}/api/NhaCungCapApi/Delete?NhaCungCapID=00000000-0000-0000-0000-000000000000

# ==============================================================================

# 21. ĐƠN NHẬP HÀNG & NHẬP KHO (DonNhapHangApi)

# ==============================================================================

# Lấy danh sách đơn nhập hàng phân trang, lọc theo nhà cung cấp, kho tiếp nhận, trạng thái

POST {{base_url}}/api/DonNhapHangApi/Gets
{
"TuKhoa": "",
"NhaCungCapID": null,
"KhoID": null,
"TrangThaiID": null,
"PageIndex": 1,
"PageSize": 20
}

# Lấy thông tin chi tiết đơn nhập hàng (kèm danh sách mặt hàng và số khung/serial)

POST {{base_url}}/api/DonNhapHangApi/Get
{
"GuidId": "00000000-0000-0000-0000-000000000000"
}

# Tạo mới đơn nhập hàng kèm chi tiết mặt hàng và danh sách serial

POST {{base_url}}/api/DonNhapHangApi/Add
{
"MaDonNhap": null,
"NhaCungCapID": "00000000-0000-0000-0000-000000000000",
"KhoID": "00000000-0000-0000-0000-000000000000",
"TrangThaiID": 66,
"SoHoaDonChungTu": "HD-VAT-2024001",
"NgayHoaDon": "2024-02-15T00:00:00Z",
"ChiPhiVanChuyen": 500000,
"HanThanhToan": "2024-03-15T00:00:00Z",
"GhiChu": "Nhập lô xe điện Feliz S và Pin LFP đầu năm",
"ChiTiets": [
{
"ChiTietID": "11111111-1111-1111-1111-111111111111",
"BienTheSanPhamID": "22222222-2222-2222-2222-222222222222",
"MaSKU": "SKU-FELIZS-DEN",
"TenSanPham": "VinFast Feliz S - Đen Nhám",
"SoLuong": 2,
"DonGiaNhap": 25000000,
"PhanTramGiamGia": 2.0,
"TienGiamGia": 1000000,
"ThueVAT": 10.0,
"TienThueVAT": 4900000,
"ThanhTien": 53900000,
"QuanLyTheoSerial": true,
"GhiChu": "Xe nguyên kiện kèm sạc"
}
],
"Serials": [
{
"ChiTietDonNhapHangID": "11111111-1111-1111-1111-111111111111",
"BienTheSanPhamID": "22222222-2222-2222-2222-222222222222",
"MaSerial": "SER-FLZ202401",
"SoKhung": "VFRLZ2024000101",
"SoMay": "ENM2024000101",
"SoPin": "PINLFP20240101",
"ViTriLuuTru": "Khu bãi A1"
},
{
"ChiTietDonNhapHangID": "11111111-1111-1111-1111-111111111111",
"BienTheSanPhamID": "22222222-2222-2222-2222-222222222222",
"MaSerial": "SER-FLZ202402",
"SoKhung": "VFRLZ2024000102",
"SoMay": "ENM2024000102",
"SoPin": "PINLFP20240102",
"ViTriLuuTru": "Khu bãi A1"
}
]
}

# Chỉnh sửa đơn nhập hàng (chỉ cho phép khi ở trạng thái Lưu tạm = 66 hoặc Chờ duyệt = 67)

POST {{base_url}}/api/DonNhapHangApi/Edit
{
"DonNhapHangID": "00000000-0000-0000-0000-000000000000",
"NhaCungCapID": "00000000-0000-0000-0000-000000000000",
"KhoID": "00000000-0000-0000-0000-000000000000",
"SoHoaDonChungTu": "HD-VAT-2024001",
"NgayHoaDon": "2024-02-15T00:00:00Z",
"ChiPhiVanChuyen": 600000,
"HanThanhToan": "2024-03-15T00:00:00Z",
"GhiChu": "Điều chỉnh chi phí vận chuyển",
"ChiTiets": [
{
"ChiTietID": "11111111-1111-1111-1111-111111111111",
"BienTheSanPhamID": "22222222-2222-2222-2222-222222222222",
"MaSKU": "SKU-FELIZS-DEN",
"TenSanPham": "VinFast Feliz S - Đen Nhám",
"SoLuong": 2,
"DonGiaNhap": 25000000,
"PhanTramGiamGia": 2.0,
"TienGiamGia": 1000000,
"ThueVAT": 10.0,
"TienThueVAT": 4900000,
"ThanhTien": 53900000,
"QuanLyTheoSerial": true,
"GhiChu": "Xe nguyên kiện kèm sạc"
}
]
}

# Chuyển trạng thái đơn nhập (Gửi duyệt = 67, Đã duyệt = 68, Đã hủy = 71)

POST {{base_url}}/api/DonNhapHangApi/ChuyenTrangThai
{
"DonNhapHangID": "00000000-0000-0000-0000-000000000000",
"TrangThaiID": 68,
"GhiChu": "Phê duyệt ngân sách đặt hàng từ VinFast"
}

# Xác nhận nhập kho thực tế (Trigger tăng tồn kho, sinh thẻ kho, lô chi phí FIFO và nạp Serial vào SP_SoSerial)

POST {{base_url}}/api/DonNhapHangApi/XacNhanNhapKho?DonNhapHangID=00000000-0000-0000-0000-000000000000

# Xóa đơn nhập hàng (chỉ cho phép khi ở trạng thái Lưu tạm = 66 hoặc Đã hủy = 71)

DELETE {{base_url}}/api/DonNhapHangApi/Delete?DonNhapHangID=00000000-0000-0000-0000-000000000000

# Lấy lịch sử các đợt thanh toán cho nhà cung cấp của đơn nhập hàng

POST {{base_url}}/api/DonNhapHangApi/GetsLichSuThanhToan?DonNhapHangID=00000000-0000-0000-0000-000000000000

# Ghi nhận thanh toán tiền hàng cho nhà cung cấp (tự động giảm công nợ NCC và giảm còn nợ đơn nhập)

POST {{base_url}}/api/DonNhapHangApi/AddLichSuThanhToan
{
"DonNhapHangID": "00000000-0000-0000-0000-000000000000",
"MaGiaoDich": "PAY-NCC-2024001",
"PhuongTucThanhToanID": 79,
"SoTien": 30000000,
"GhiChu": "Chuyển khoản thanh toán đợt 1 tiền nhập xe"
}

# ==============================================================================

# 22. ĐƠN HÀNG & BÁN HÀNG (DonHangApi)

# ==============================================================================

# Lấy danh sách sản phẩm / biến thể sẵn sàng bán tại kho (kèm danh sách serial khả dụng)

POST {{base_url}}/api/DonHangApi/GetSanPhamBanHang
{
  "KhoID": "90343865-b67b-400e-a4ab-23cecbc9953b",
  "TuKhoa": "",
  "DanhMucChiTietID": null,
  "ChiLayConTon": true,
  "QuanLyTheoSerial": null,
  "PageIndex": 1,
  "PageSize": 50
}

# Lấy danh sách đơn hàng phân trang & lọc đa tiêu chí

POST {{base_url}}/api/DonHangApi/Gets

{
"TuKhoa": "",
"KhachHangID": null,
"DiaDiemID": null,
"KhoXuatID": null,
"LoaiDonHangID": null,
"TrangThaiDonHangID": null,
"TrangThaiThanhToanID": null,
"PageIndex": 1,
"PageSize": 20
}

# Lấy thông tin chi tiết đơn hàng (kèm danh sách mặt hàng, số khung/serial và lịch sử thanh toán)

POST {{base_url}}/api/DonHangApi/Get
{
"GuidId": "00000000-0000-0000-0000-000000000000"
}

# Tạo mới đơn hàng bán lẻ / showroom

POST {{base_url}}/api/DonHangApi/Add
{
"MaDonHang": null,
"KhachHangID": "00000000-0000-0000-0000-000000000000",
"DiaDiemID": "00000000-0000-0000-0000-000000000000",
"KhoXuatID": "00000000-0000-0000-0000-000000000000",
"LoaiDonHangID": 87,
"TrangThaiDonHangID": 72,
"TrangThaiThanhToanID": 83,
"TienGiamGia": 500000,
"PhiVanChuyen": 0,
"PhiDichVuBienSo": 1200000,
"TenNguoiNhan": "Nguyễn Văn A",
"DienThoaiNguoiNhan": "0912345678",
"DiaChiGiaoHang": "123 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
"GhiChu": "Khách mua xe VinFast Feliz S lấy biển Hà Nội",
"ChiTiets": [
{
"ID": "33333333-3333-3333-3333-333333333333",
"BienTheSanPhamID": "22222222-2222-2222-2222-222222222222",
"MaSKU": "SKU-FELIZS-DEN",
"TenSanPham": "VinFast Feliz S - Đen Nhám",
"SoLuong": 1,
"DonGiaBan": 29900000,
"TienGiamGia": 500000,
"ThueVAT": 10.0,
"TienThueVAT": 2940000,
"ThanhTien": 32340000,
"QuanLyTheoSerial": true,
"LaPhuongTien": true,
"SoThangBaoHanh": 36,
"GhiChu": "Bảo hành 3 năm theo chính sách VinFast"
}
],
"Serials": [
{
"ChiTietDonHangID": "33333333-3333-3333-3333-333333333333",
"BienTheSanPhamID": "22222222-2222-2222-2222-222222222222",
"SoSerialID": "44444444-4444-4444-4444-444444444444",
"MaSerial": "SER-FLZ202401",
"SoKhung": "VFRLZ2024000101",
"SoMay": "ENM2024000101",
"SoPin": "PINLFP20240101",
"BienSoXe": "29B1-999.88"
}
]
}

# Chỉnh sửa đơn hàng (chỉ cho phép khi ở trạng thái Lưu tạm = 72 hoặc Chờ xử lý = 73)

POST {{base_url}}/api/DonHangApi/Edit
{
"DonHangID": "00000000-0000-0000-0000-000000000000",
"KhachHangID": "00000000-0000-0000-0000-000000000000",
"DiaDiemID": "00000000-0000-0000-0000-000000000000",
"KhoXuatID": "00000000-0000-0000-0000-000000000000",
"LoaiDonHangID": 87,
"TienGiamGia": 1000000,
"PhiVanChuyen": 0,
"PhiDichVuBienSo": 1200000,
"GhiChu": "Điều chỉnh voucher giảm giá 1 triệu",
"ChiTiets": [
{
"ID": "33333333-3333-3333-3333-333333333333",
"BienTheSanPhamID": "22222222-2222-2222-2222-222222222222",
"MaSKU": "SKU-FELIZS-DEN",
"TenSanPham": "VinFast Feliz S - Đen Nhám",
"SoLuong": 1,
"DonGiaBan": 29900000,
"TienGiamGia": 1000000,
"ThueVAT": 10.0,
"TienThueVAT": 2890000,
"ThanhTien": 31790000,
"QuanLyTheoSerial": true,
"LaPhuongTien": true,
"SoThangBaoHanh": 36
}
]
}

# Chuyển trạng thái đơn hàng (Chờ xử lý/Đặt cọc = 73, Chuẩn bị xe = 74, Đang giao = 75, Đã hủy = 77)

POST {{base_url}}/api/DonHangApi/ChuyenTrangThai
{
"DonHangID": "00000000-0000-0000-0000-000000000000",
"TrangThaiID": 74,
"GhiChu": "Kỹ thuật đang lắp gương, biển số và sạc pin sẵn sàng bàn giao"
}

# Xác nhận hoàn thành đơn & Bàn giao xe (Trigger trừ tồn kho, tính giá vốn FIFO, kích hoạt BH, sinh xe cho khách và tính điểm thưởng)

POST {{base_url}}/api/DonHangApi/HoanThanhVaGiaoXe?DonHangID=00000000-0000-0000-0000-000000000000

# Xóa đơn hàng (chỉ cho phép khi ở trạng thái Lưu tạm = 72 hoặc Đã hủy = 77)

DELETE {{base_url}}/api/DonHangApi/Delete?DonHangID=00000000-0000-0000-0000-000000000000

# Lấy lịch sử các đợt thanh toán của đơn hàng

POST {{base_url}}/api/DonHangApi/GetsLichSuThanhToan?DonHangID=00000000-0000-0000-0000-000000000000

# Ghi nhận thanh toán cho đơn hàng (Cọc/Thanh toán đủ - tự động cập nhật công nợ và trạng thái thanh toán)

POST {{base_url}}/api/DonHangApi/AddLichSuThanhToan
{
"DonHangID": "00000000-0000-0000-0000-000000000000",
"MaGiaoDich": "PAY20261012-001",
"PhuongTucThanhToanID": 79,
"SoTien": 10000000,
"GhiChu": "Khách chuyển khoản VietQR đặt cọc mua xe"
}

# ==============================================================================

# 23. DỊCH VỤ SỬA CHỮA & BẢO DƯỠNG (DichVuApi) ✅

# ==============================================================================

# Lấy danh sách dịch vụ sửa chữa có lọc và phân trang

POST {{base_url}}/api/DichVuApi/Gets
{
"TuKhoa": "",
"DanhMucChiTietID": null,
"TrangThai": true,
"PageIndex": 1,
"PageSize": 20
}

# Lấy thông tin chi tiết dịch vụ theo ID hoặc Mã

POST {{base_url}}/api/DichVuApi/Get
{
"DichVuID": "00000000-0000-0000-0000-000000000000",
"MaDichVu": "DV-BD-TOANDIEN"
}

# Thêm mới dịch vụ sửa chữa / bảo dưỡng

POST {{base_url}}/api/DichVuApi/Add
{
"MaDichVu": "DV-BD-TOANDIEN",
"TenDichVu": "Bảo dưỡng toàn diện xe điện (32 hạng mục)",
"DanhMucChiTietID": 110,
"MoTa": "Kiểm tra hệ thống phanh, điện, ắc quy/pin, xiết ốc toàn xe, cân vành",
"GiaCoBan": 250000,
"GiaKhuyenMai": 200000,
"ThoiGianDuKienPhut": 60,
"ThuTu": 1,
"TrangThai": true
}

# Cập nhật thông tin dịch vụ sửa chữa

POST {{base_url}}/api/DichVuApi/Edit
{
"DichVuID": "00000000-0000-0000-0000-000000000000",
"MaDichVu": "DV-BD-TOANDIEN",
"TenDichVu": "Bảo dưỡng toàn diện xe điện cao cấp",
"DanhMucChiTietID": 110,
"MoTa": "Kiểm tra hệ thống phanh, điện, pin, test phần mềm ECU",
"GiaCoBan": 300000,
"GiaKhuyenMai": 250000,
"ThoiGianDuKienPhut": 90,
"ThuTu": 1,
"TrangThai": true
}

# Xóa dịch vụ sửa chữa (chỉ xóa được khi chưa phát sinh trong phiếu sửa chữa)

DELETE {{base_url}}/api/DichVuApi/Delete?DichVuID=00000000-0000-0000-0000-000000000000

# ==============================================================================

# 24. PHIẾU SỬA CHỮA & DỊCH VỤ XE (PhieuSuaChuaApi) ✅

# ==============================================================================

# Lấy danh sách phiếu sửa chữa có phân trang & tìm kiếm đa điều kiện

POST {{base_url}}/api/PhieuSuaChuaApi/Gets
{
"TuKhoa": "",
"KhachHangID": null,
"PhuongTienKhachHangID": null,
"DiaDiemID": null,
"KhoID": null,
"LoaiDichVuID": null,
"TrangThaiID": null,
"TrangThaiThanhToanID": null,
"NhanVienTiepNhanID": null,
"KyThuatVienChinhID": null,
"TuNgay": null,
"DenNgay": null,
"PageIndex": 1,
"PageSize": 20
}

# Lấy thông tin chi tiết một phiếu sửa chữa (gồm danh sách dịch vụ, phụ tùng và lịch sử thanh toán)

POST {{base_url}}/api/PhieuSuaChuaApi/Get
{
"PhieuSuaChuaID": "00000000-0000-0000-0000-000000000000",
"MaPhieuSuaChua": "PSC20261013-001"
}

# Lập phiếu tiếp nhận sửa chữa / dịch vụ mới

POST {{base_url}}/api/PhieuSuaChuaApi/Add
{
"MaPhieuSuaChua": "PSC20261013-001",
"KhachHangID": "00000000-0000-0000-0000-000000000000",
"PhuongTienKhachHangID": "00000000-0000-0000-0000-000000000000",
"DiaDiemID": "00000000-0000-0000-0000-000000000000",
"KhoID": "00000000-0000-0000-0000-000000000000",
"NhanVienTiepNhanID": 1,
"KyThuatVienChinhID": 2,
"LoaiDichVuID": 114,
"SoKmHienTai": 5200,
"MoTaVanDe": "Xe đi qua gờ giảm tốc bị kêu ở cổ phốt, tay ga phản hồi chậm",
"KetQuaChanDoan": "Vòng bi chén cổ mòn rơ, cảm biến tay ga bị bẩn",
"GiaiPhapXuLy": "Thay bát phốt mới, vệ sinh zắc cắm tay ga và cân chỉnh phanh",
"ThoiGianHenTra": "2026-10-13T17:30:00",
"TienGiamGia": 50000,
"TienThueVAT": 0,
"SoThangBaoHanhSuaChua": 3,
"GhiChu": "Khách yêu cầu giữ lại phụ tùng cũ đã thay",
"ChiTiets": [
{
"LoaiHangMuc": 1,
"DichVuID": "00000000-0000-0000-0000-000000000000",
"MaHangMuc": "DV-BD-COPHOT",
"TenHangMuc": "Công bảo dưỡng và ép bát phốt",
"SoLuong": 1,
"DonGia": 150000,
"TienGiamGia": 0,
"ThanhTien": 150000
},
{
"LoaiHangMuc": 2,
"BienTheSanPhamID": "00000000-0000-0000-0000-000000000000",
"MaHangMuc": "PT-BATPHOT-VFE",
"TenHangMuc": "Bộ chén cổ / bát phốt Feliz S chính hãng",
"DonViTinhID": 1,
"SoLuong": 1,
"DonGia": 220000,
"TienGiamGia": 50000,
"ThanhTien": 170000
}
]
}

# Cập nhật phiếu sửa chữa (chỉ cho phép khi ở trạng thái Tiếp nhận = 107 hoặc Đang sửa chữa = 108)

POST {{base_url}}/api/PhieuSuaChuaApi/Edit
{
"PhieuSuaChuaID": "00000000-0000-0000-0000-000000000000",
"KhachHangID": "00000000-0000-0000-0000-000000000000",
"PhuongTienKhachHangID": "00000000-0000-0000-0000-000000000000",
"DiaDiemID": "00000000-0000-0000-0000-000000000000",
"KhoID": "00000000-0000-0000-0000-000000000000",
"LoaiDichVuID": 114,
"SoKmHienTai": 5200,
"MoTaVanDe": "Xe kêu chén cổ và hỏng thêm má phanh sau",
"KetQuaChanDoan": "Bát phốt rơ, má phanh sau mòn hết",
"GiaiPhapXuLy": "Thay bát phốt và thay má phanh sau",
"TienGiamGia": 50000,
"ChiTiets": [
{
"LoaiHangMuc": 1,
"DichVuID": "00000000-0000-0000-0000-000000000000",
"MaHangMuc": "DV-BD-COPHOT",
"TenHangMuc": "Công bảo dưỡng và ép bát phốt",
"SoLuong": 1,
"DonGia": 150000,
"ThanhTien": 150000
},
{
"LoaiHangMuc": 2,
"BienTheSanPhamID": "00000000-0000-0000-0000-000000000000",
"MaHangMuc": "PT-BATPHOT-VFE",
"TenHangMuc": "Bộ chén cổ / bát phốt Feliz S chính hãng",
"SoLuong": 1,
"DonGia": 220000,
"ThanhTien": 220000
},
{
"LoaiHangMuc": 2,
"BienTheSanPhamID": "11111111-1111-1111-1111-111111111111",
"MaHangMuc": "PT-MAPHANH-SAU",
"TenHangMuc": "Bố thắng / má phanh sau đĩa",
"SoLuong": 1,
"DonGia": 120000,
"ThanhTien": 120000
}
]
}

# Chuyển trạng thái phiếu sửa chữa (Tiếp nhận = 107, Đang sửa = 108, Chờ phụ tùng = 109, Đã sửa xong = 110, Hủy = 112)

POST {{base_url}}/api/PhieuSuaChuaApi/ChuyenTrangThai
{
"PhieuSuaChuaID": "00000000-0000-0000-0000-000000000000",
"TrangThaiID": 110,
"GhiChu": "Kỹ thuật đã sửa chữa xong, test chạy thử đạt chuẩn và rửa xe sạch sẽ"
}

# Hoàn thành & Bàn giao xe cho khách (Trigger xuất kho trừ phụ tùng thực tế, cập nhật ngày hoàn thành)

POST {{base_url}}/api/PhieuSuaChuaApi/HoanThanhVaGiaoXe?PhieuSuaChuaID=00000000-0000-0000-0000-000000000000

# Xóa phiếu sửa chữa (chỉ xóa được khi ở trạng thái Tiếp nhận = 107 hoặc Đã hủy = 112)

DELETE {{base_url}}/api/PhieuSuaChuaApi/Delete?PhieuSuaChuaID=00000000-0000-0000-0000-000000000000

# Lấy lịch sử các đợt thanh toán của phiếu sửa chữa

POST {{base_url}}/api/PhieuSuaChuaApi/GetsLichSuThanhToan?PhieuSuaChuaID=00000000-0000-0000-0000-000000000000

# Thu tiền / Ghi nhận thanh toán phiếu sửa chữa (Cập nhật DaThanhToan, ConNo và TrangThaiThanhToanID)

POST {{base_url}}/api/PhieuSuaChuaApi/AddLichSuThanhToan
{
"PhieuSuaChuaID": "00000000-0000-0000-0000-000000000000",
"MaGiaoDich": "PAY-SC-20261013-001",
"PhuongTucThanhToanID": 78,
"SoTien": 490000,
"GhiChu": "Khách thanh toán tiền mặt tại quầy lễ tân"
}

# ==============================================================================

# 25. BẢO HÀNH ĐIỆN TỬ & PHIẾU BẢO HÀNH (BaoHanhApi) ✅

# ==============================================================================

# Lấy danh sách sổ bảo hành điện tử có lọc và phân trang

POST {{base_url}}/api/BaoHanhApi/Gets
{
"TuKhoa": "",
"KhachHangID": null,
"PhuongTienKhachHangID": null,
"BienTheSanPhamID": null,
"TrangThaiID": null,
"TuNgay": null,
"DenNgay": null,
"PageIndex": 1,
"PageSize": 20
}

# Lấy thông tin chi tiết sổ bảo hành theo ID hoặc Mã

POST {{base_url}}/api/BaoHanhApi/Get
{
"BaoHanhID": "00000000-0000-0000-0000-000000000000",
"MaBaoHanh": "BH20261012-0001"
}

# Tra cứu bảo hành điện tử nhanh (theo Số khung, Số máy, Số pin, Biển số xe, SĐT hoặc Mã BH)

GET {{base_url}}/api/BaoHanhApi/TraCuu?tuKhoa=VFRLZ2024000101

# Đăng ký / Kích hoạt thủ công sổ bảo hành điện tử

POST {{base_url}}/api/BaoHanhApi/Add
{
"MaBaoHanh": "BH20261013-0001",
"SoSerialID": "00000000-0000-0000-0000-000000000000",
"KhachHangID": "00000000-0000-0000-0000-000000000000",
"PhuongTienKhachHangID": "00000000-0000-0000-0000-000000000000",
"NgayBatDau": "2026-10-13T08:00:00",
"NgayKetThuc": "2029-10-13T08:00:00",
"SoThangBaoHanh": 36,
"GioiHanKm": 30000,
"TrangThaiID": 92,
"DieuKienBaoHanh": "Bảo hành chính hãng động cơ và khung sườn 36 tháng hoặc 30.000 km",
"GhiChu": "Kích hoạt bảo hành điện tử tại showroom"
}

# Cập nhật thông tin sổ bảo hành

POST {{base_url}}/api/BaoHanhApi/Edit
{
"BaoHanhID": "00000000-0000-0000-0000-000000000000",
"SoThangBaoHanh": 48,
"NgayKetThuc": "2030-10-13T08:00:00",
"GioiHanKm": 40000,
"TrangThaiID": 92,
"GhiChu": "Khách gia hạn gói bảo hành thêm 1 năm chính hãng"
}

# Lấy danh sách phiếu yêu cầu bảo hành có phân trang và lọc

POST {{base_url}}/api/BaoHanhApi/GetsPhieuBaoHanh
{
"TuKhoa": "",
"BaoHanhID": null,
"KhachHangID": null,
"DiaDiemID": null,
"HuongXuLyID": null,
"TrangThaiID": null,
"TuNgay": null,
"DenNgay": null,
"PageIndex": 1,
"PageSize": 20
}

# Lấy thông tin chi tiết một phiếu bảo hành (kèm chi tiết linh kiện xử lý/đổi mới)

POST {{base_url}}/api/BaoHanhApi/GetPhieuBaoHanh
{
"PhieuBaoHanhID": "00000000-0000-0000-0000-000000000000",
"MaPhieuBaoHanh": "PBH20261013-001"
}

# Tạo phiếu tiếp nhận bảo hành xe / linh kiện

POST {{base_url}}/api/BaoHanhApi/AddPhieuBaoHanh
{
"MaPhieuBaoHanh": "PBH20261013-001",
"BaoHanhID": "00000000-0000-0000-0000-000000000000",
"DiaDiemID": "00000000-0000-0000-0000-000000000000",
"NhanVienTiepNhanID": 1,
"KyThuatVienID": 2,
"NgayHenTra": "2026-10-15T16:00:00",
"SoKmHienTai": 4800,
"MoTaLoi": "Pin sạc không nhận dòng, đèn báo lỗi đỏ nhấp nháy",
"KetQuaKiemTra": "Hỏng mạch BMS của cell pin số 4",
"HuongXuLyID": 103,
"ChiPhiHangHoTro": 8500000,
"ChiPhiKhachTra": 0,
"GhiChu": "Pin đủ điều kiện bảo hành đổi mới 1-1 theo chính sách hãng",
"ChiTiets": [
{
"LoaiXuLy": 2,
"BienTheSanPhamID": "00000000-0000-0000-0000-000000000000",
"SoSerialCuID": "00000000-0000-0000-0000-000000000000",
"SoSerialMoiID": "11111111-1111-1111-1111-111111111111",
"SoLuong": 1,
"DonGia": 8500000,
"ChiPhiHangHoTro": 8500000,
"ChiPhiKhachTra": 0,
"GhiChu": "Đổi mới cụm Pin LFP 3.5kWh nguyên seal"
}
]
}

# Cập nhật phiếu tiếp nhận bảo hành

POST {{base_url}}/api/BaoHanhApi/EditPhieuBaoHanh
{
"PhieuBaoHanhID": "00000000-0000-0000-0000-000000000000",
"BaoHanhID": "00000000-0000-0000-0000-000000000000",
"DiaDiemID": "00000000-0000-0000-0000-000000000000",
"KetQuaKiemTra": "Đã nhận linh kiện pin thay thế từ tổng kho và hoàn tất lắp đặt kiểm tra sạc xả",
"HuongXuLyID": 103,
"ChiPhiHangHoTro": 8500000,
"ChiPhiKhachTra": 0,
"GhiChu": "Hoàn tất kiểm tra xe vận hành bình thường"
}

# Chuyển trạng thái phiếu bảo hành (Tiếp nhận = 96, Đang kiểm tra = 97, Gửi hãng = 98, Đã xử lý xong = 99, Đã trả khách = 100, Từ chối BH = 101)

POST {{base_url}}/api/BaoHanhApi/ChuyenTrangThaiPhieuBaoHanh
{
"PhieuBaoHanhID": "00000000-0000-0000-0000-000000000000",
"TrangThaiID": 100,
"GhiChu": "Đã bàn giao xe và cụm pin mới cho khách hàng ký nhận"
}

# Xóa phiếu bảo hành (chỉ xóa được khi ở trạng thái Tiếp nhận = 96)

DELETE {{base_url}}/api/BaoHanhApi/DeletePhieuBaoHanh?PhieuBaoHanhID=00000000-0000-0000-0000-000000000000

# ==============================================================================

# 26. TRẢ GÓP & ĐỐI TÁC TÀI CHÍNH (TraGopApi) ✅

# ==============================================================================

# --- ĐƠN VỊ TRẢ GÓP ---

# Lấy danh sách đối tác trả góp (HD Saison, FE Credit, Home Credit...)

POST {{base_url}}/api/DonViTraGopApi/Gets
{
"TuKhoa": "",
"DangHoatDong": true,
"PageIndex": 1,
"PageSize": 20
}

# Lấy chi tiết đơn vị trả góp theo ID

POST {{base_url}}/api/DonViTraGopApi/Get
{
"GuidId": "00000000-0000-0000-0000-000000000000"
}

# Thêm mới đơn vị trả góp

POST {{base_url}}/api/DonViTraGopApi/Add
{
"MaDonVi": "HDSAISON",
"TenDonVi": "Công ty Tài chính TNHH HD SAISON",
"DienThoai": "1900558854",
"Email": "hotro@hdsaison.com.vn",
"DiaChi": "Tầng 8, Tòa nhà Gilimex, 24C Phan Đăng Lưu, P.6, Q.Bình Thạnh, TP.HCM",
"TenNguoiLienHe": "Nguyễn Văn Tuấn (Sale phụ trách Showroom)",
"SdtNguoiLienHe": "0988123456",
"DiaChiAPI": "https://api-partner.hdsaison.com.vn/v1/loan",
"ApiKey": "hds_live_key_998877",
"CauHinhGoiVayJson": "{\"GoiUuDai\": [\"LaiSuat0%\", \"Kỳ hạn 6-12 tháng\"]}",
"ThuTu": 1,
"DangHoatDong": true,
"GhiChu": "Đối tác trả góp lãi suất 0% cho dòng xe điện VinFast Feliz & Klara"
}

# Cập nhật thông tin đơn vị trả góp

PUT {{base_url}}/api/DonViTraGopApi/Edit
{
"DonViTraGopID": "00000000-0000-0000-0000-000000000000",
"MaDonVi": "HDSAISON",
"TenDonVi": "Công ty Tài chính TNHH HD SAISON (Cập nhật)",
"DienThoai": "1900558854",
"Email": "hotro@hdsaison.com.vn",
"DiaChi": "24C Phan Đăng Lưu, P.6, Q.Bình Thạnh, TP.HCM",
"TenNguoiLienHe": "Trần Thị Bích",
"SdtNguoiLienHe": "0977654321",
"DiaChiAPI": "https://api-partner.hdsaison.com.vn/v1/loan",
"ApiKey": "hds_live_key_998877",
"CauHinhGoiVayJson": "{\"GoiUuDai\": [\"LaiSuat0%\", \"Kỳ hạn 6-12-24 tháng\"]}",
"ThuTu": 1,
"DangHoatDong": true,
"GhiChu": "Đổi nhân viên quản lý showroom"
}

# Xóa đơn vị trả góp (chỉ cho phép khi chưa phát sinh hợp đồng)

DELETE {{base_url}}/api/DonViTraGopApi/Delete?DonViTraGopID=00000000-0000-0000-0000-000000000000

# --- HỢP ĐỒNG TRẢ GÓP ---

# Lấy danh sách hồ sơ / hợp đồng trả góp (lọc theo đơn hàng, khách hàng, đơn vị trả góp, trạng thái)

POST {{base_url}}/api/TraGopApi/Gets
{
"TuKhoa": "",
"DonHangID": null,
"KhachHangID": null,
"DonViTraGopID": null,
"TrangThaiHopDongID": null,
"TrangThaiGiaiNganID": null,
"TuNgay": null,
"DenNgay": null,
"PageIndex": 1,
"PageSize": 20
}

# Lấy chi tiết hồ sơ hợp đồng trả góp theo ID

POST {{base_url}}/api/TraGopApi/Get
{
"GuidId": "00000000-0000-0000-0000-000000000000"
}

# Lấy thông tin hợp đồng trả góp theo Đơn hàng

POST {{base_url}}/api/TraGopApi/GetByDonHang?DonHangID=00000000-0000-0000-0000-000000000000

# Tạo mới hồ sơ đề nghị vay trả góp cho đơn hàng

POST {{base_url}}/api/TraGopApi/Add
{
"DonHangID": "00000000-0000-0000-0000-000000000000",
"KhachHangID": "11111111-1111-1111-1111-111111111111",
"DonViTraGopID": "22222222-2222-2222-2222-222222222222",
"SoHopDong": "HDS-202610-0089",
"MaHoSoOnline": "APP-HD-99120",
"TongGiaTriDonHang": 32340000,
"TienTraTruoc": 9700000,
"SoTienVay": 22640000,
"PhiBaoHiemKhoanVay": 500000,
"LaiSuat": 0.0,
"SoThangTraGop": 12,
"SoTienTraHangThang": 1886667,
"NgayTraHangThang": 5,
"TrangThaiHopDongID": 110,
"NgayNopHoSo": "2026-10-14T08:00:00",
"TrangThaiGiaiNganID": 120,
"DuongDanHopDongPdf": "/uploads/hopdong/HD_202610_0089.pdf",
"DanhSachTaiLieuJson": "[\"/uploads/cccd/khach_mat_truoc.jpg\", \"/uploads/cccd/khach_mat_sau.jpg\"]",
"NhanVienLamHoSoID": 1,
"NguoiThamChieu": "Nguyễn Thị Mai (Vợ - 0912999888)",
"GhiChu": "Khách chọn gói 0% lãi suất của HD Saison, kỳ hạn 12 tháng"
}

# Chỉnh sửa / bổ sung thông tin hồ sơ trả góp

POST {{base_url}}/api/TraGopApi/Edit
{
"HopDongTraGopID": "00000000-0000-0000-0000-000000000000",
"DonViTraGopID": "22222222-2222-2222-2222-222222222222",
"SoHopDong": "HDS-202610-0089",
"MaHoSoOnline": "APP-HD-99120",
"TienTraTruoc": 10000000,
"SoTienVay": 22340000,
"PhiBaoHiemKhoanVay": 500000,
"LaiSuat": 0.0,
"SoThangTraGop": 12,
"SoTienTraHangThang": 1861667,
"NgayTraHangThang": 5,
"DuongDanHopDongPdf": "/uploads/hopdong/HD_202610_0089_ky.pdf",
"DanhSachTaiLieuJson": "[\"/uploads/cccd/khach_mat_truoc.jpg\", \"/uploads/cccd/khach_mat_sau.jpg\", \"/uploads/cccd/anh_chan_dung.jpg\"]",
"NguoiThamChieu": "Nguyễn Thị Mai (Vợ - 0912999888)",
"GhiChu": "Bổ sung ảnh chân dung khách hàng theo yêu cầu bên tài chính"
}

# Chuyển trạng thái thẩm định hồ sơ (Chờ duyệt = 110, Đã duyệt = 111, Từ chối = 112, Đã ký HĐ = 113, Đang trả góp = 114, Đã tất toán = 115, Đã hủy = 116)

POST {{base_url}}/api/TraGopApi/ChuyenTrangThai
{
"HopDongTraGopID": "00000000-0000-0000-0000-000000000000",
"TrangThaiHopDongID": 111,
"NgayPheDuyet": "2026-10-14T09:30:00",
"GhiChu": "HD Saison đã duyệt khoản vay 22.340.000đ, cho phép bàn giao xe"
}

# Xác nhận tiền giải ngân từ công ty tài chính về tài khoản Showroom (Tự động sinh DH_LichSuThanhToan và giảm công nợ đơn hàng)

POST {{base_url}}/api/TraGopApi/XacNhanGiaiNgan
{
"HopDongTraGopID": "00000000-0000-0000-0000-000000000000",
"SoTienGiaiNganThucTe": 21893200,
"PhiHoaHongDoiTac": 446800,
"NgayGiaiNgan": "2026-10-15T14:20:00",
"MaChuanChiGiaiNgan": "FT2628890288219",
"GhiChu": "HD Saison giải ngân khoản vay xe Feliz S qua Vietcombank, trừ phí dịch vụ 2%"
}

# Công cụ tính toán nhanh dự toán trả góp (Dùng cho nhân viên Sale tư vấn tại quầy)

POST {{base_url}}/api/TraGopApi/TinhDuToan
{
"TongGiaTriXe": 32340000,
"PhanTramTraTruoc": 30,
"SoThangVay": 12,
"LaiSuatThang": 0.0,
"PhiBaoHiemKhoanVay": 500000
}

# Xóa / Hủy hồ sơ trả góp (chỉ áp dụng khi hồ sơ bị từ chối hoặc chưa duyệt giải ngân)

ư
DELETE {{base_url}}/api/TraGopApi/Delete?HopDongTraGopID=00000000-0000-0000-0000-000000000000
