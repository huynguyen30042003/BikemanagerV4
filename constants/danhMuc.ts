/**
 * Mã DanhMucID chuẩn hóa tương ứng bảng DM_DanhMucChung trong CSDL BikeManager
 * Dữ liệu các trạng thái, phân loại, ngành hàng... đều được lưu tại DM_DanhMucChiTiet
 */
export const DANH_MUC_CHUNG = {
  /** 1 - Phân loại cơ sở địa điểm (Trụ sở chính, Showroom, Xưởng dịch vụ, Kho bãi) */
  LOAI_DIA_DIEM: 1,

  /** 2 - Phân nhóm khách hàng (Cá nhân, Doanh nghiệp, Khách VIP, Đại lý...) */
  NHOM_KHACH_HANG: 2,

  /** 3 - Kênh nguồn khách hàng (Facebook, Website, Trực tiếp showroom, Giới thiệu...) */
  NGUON_KHACH_HANG: 3,

  /** 4 - Loại hình tổ chức / pháp nhân */
  LOAI_HINH_TO_CHUC: 4,

  /** 5 - Loại kho hàng (Kho tổng, Showroom, Phụ tùng, Xe cũ, Bảo hành) */
  LOAI_KHO_HANG: 5,

  /** 6 - Trạng thái phiếu chuyển kho (Chờ xuất kho, Đang vận chuyển, Đã nhận hàng, Đã hủy) */
  TRANG_THAI_CHUYEN_KHO: 6,

  /** 7 - Trạng thái phiếu kiểm kê (Đang kiểm kê, Đã cân bằng kho, Đã hủy) */
  TRANG_THAI_KIEM_KE: 7,

  /** 8 - Lý do lệch kiểm kê (Đếm nhầm, Hư hỏng, Thất thoát, Xuất bán chưa lập phiếu...) */
  LY_DO_LECH_KIEM_KE: 8,

  /** 9 - Loại giao dịch biến động thẻ kho (Nhập mua, Nhập chuyển, Xuất bán, Xuất sửa...) */
  LOAI_GIAO_DICH_KHO: 9,

  /** 10 - Ngành hàng / Phân loại sản phẩm (Xe máy điện, Xe đạp điện, Pin/Ắc quy, Phụ tùng...) */
  NGANH_HANG: 10,

  /** 11 - Đơn vị tính (Chiếc, Cái, Bình, Bộ, Lít, Hộp, Cặp...) */
  DON_VI_TINH: 11,

  /** 12 - Trạng thái số Serial / Xe (Trong kho, Đang vận chuyển, Đã bán, Đang bảo hành, Đang sửa...) */
  TRANG_THAI_SERIAL: 12,

  /** 13 - Trạng thái đơn nhập hàng từ NCC (Lưu tạm, Chờ duyệt, Đã duyệt, Đang quét Serial, Đã nhập kho...) */
  TRANG_THAI_DON_NHAP_HANG: 13,

  /** 14 - Trạng thái đơn hàng bán lẻ (Lưu tạm, Chờ xử lý, Đang chuẩn bị xe, Đang giao, Hoàn thành, Đã hủy) */
  TRANG_THAI_DON_HANG: 14,

  /** 15 - Phương thức thanh toán (Tiền mặt, VietQR, POS quẹt thẻ, Trả góp, Ví điện tử) */
  PHUONG_THUC_THANH_TOAN: 15,

  /** 16 - Trạng thái thanh toán (Chưa thanh toán, Đặt cọc / 1 phần, Đã thanh toán đủ, Hoàn tiền) */
  TRANG_THAI_THANH_TOAN: 16,

  /** 17 - Phân loại đơn hàng (Bán lẻ showroom POS, Bán online, Bán buôn, Bán trả góp) */
  LOAI_DON_HANG: 17,

  /** 18 - Trạng thái sổ bảo hành điện tử (Chưa kích hoạt, Đang hiệu lực, Hết hạn, Tạm ngưng, Đã hủy) */
  TRANG_THAI_SO_BAO_HANH: 18,

  /** 19 - Trạng thái phiếu tiếp nhận bảo hành (Tiếp nhận, Đang kiểm tra, Đang gửi hãng, Chờ khách nhận, Hoàn thành...) */
  TRANG_THAI_PHIEU_BAO_HANH: 19,

  /** 20 - Hướng xử lý bảo hành (Sửa chữa tại trạm, Đổi mới linh kiện 1-1, Gửi hãng, Đổi xe mới, Từ chối) */
  HUONG_XU_LY_BAO_HANH: 20,

  /** 21 - Trạng thái phiếu dịch vụ / sửa chữa (Tiếp nhận xe, Đã báo giá, Đang sửa, Chờ KCS, Sẵn sàng giao, Hoàn thành...) */
  TRANG_THAI_PHIEU_SUA_CHUA: 21,

  /** 22 - Loại dịch vụ kỹ thuật (Bảo dưỡng định kỳ, Cơ điện động cơ, Pin-Ắc quy, Đồng sơn, Cứu hộ...) */
  LOAI_DICH_VU_SUA_CHUA: 22,

  /** 23 - Loại hạng mục trong phiếu sửa chữa (Tiền công thợ, Phụ tùng linh kiện thay thế) */
  LOAI_HANG_MUC_SUA_CHUA: 23,
} as const;

export type DanhMucChungKey = keyof typeof DANH_MUC_CHUNG;
