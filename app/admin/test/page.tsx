import { SearchBar } from "@/components/Common/SearchBar";
import { Metadata } from "next"; // Thêm import này

// 1. THÊM HÀM NÀY ĐỂ TỐI ƯU SEO (Tự động chạy trên Server)
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const query = params.search || "";

  // 1. Cấu hình cơ bản (Basic SEO)
  const baseTitle = query
    ? `Kết quả tìm kiếm cho "${query}" | Quản trị viên`
    : "Danh sách Địa phương | Quản trị viên";

  const baseDescription = query
    ? `Danh sách các địa phương liên quan đến từ khóa ${query}. Cập nhật mới nhất 2026.`
    : "Tra cứu thông tin danh sách địa phương cấp tỉnh nhanh chóng, chính xác và đầy đủ nhất.";

  // 2. Trả về toàn bộ Metadata
  return {
    // === SEO CƠ BẢN (Google Search) ===
    title: baseTitle,
    description: baseDescription,
    keywords: ["địa phương", "cấp tỉnh", "tra cứu", "quản trị", query], // Từ khóa (Hiện tại Google ít dùng, nhưng các máy tìm kiếm khác vẫn ưu tiên)
    authors: [{ name: "Tên Công Ty/Admin của bạn" }],

    // === ĐƯỜNG DẪN CHUẨN (Tránh lỗi trùng lặp nội dung) ===
    alternates: {
      canonical: `https://tenmiencuaban.com/admin/test${query ? `?search=${query}` : ""}`,
    },

    // === CẤU HÌNH BOT (Hướng dẫn Google Bot) ===
    robots: {
      index: true, // Cho phép Google lập chỉ mục trang này (Nếu trang admin bảo mật thì set là false)
      follow: true, // Cho phép bot đi theo các đường link trong trang
      nocache: true, // Không lưu bản cache cũ của trang
    },

    // === OPEN GRAPH (Dành cho Facebook, Zalo, LinkedIn, iMessage...) ===
    openGraph: {
      title: baseTitle,
      description: baseDescription,
      url: `https://tenmiencuaban.com/admin/test`,
      siteName: "Hệ thống Quản trị",
      type: "website",
      locale: "vi_VN",
      // ĐÂY LÀ PHẦN IMAGE BẠN NHỚ:
      images: [
        {
          url: "https://tenmiencuaban.com/images/seo-banner.jpg", // Link ảnh thumbnail
          width: 1200,
          height: 630, // Tỉ lệ chuẩn 1200x630 cho mạng xã hội
          alt: baseTitle, // Text thay thế khi ảnh bị lỗi
        },
      ],
    },

    // === TWITTER CARDS (Dành riêng cho Twitter / X) ===
    twitter: {
      card: "summary_large_image", // Hiển thị ảnh to
      title: baseTitle,
      description: baseDescription,
      creator: "@TenTaiKhoanTwitter",
      images: ["https://tenmiencuaban.com/images/seo-banner.jpg"],
    },
  };
}

// 2. CODE COMPONENT CỦA BẠN GIỮ NGUYÊN
export default async function TestPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const query = params.search || "";

  try {
    const res = await fetch(
      `https://localhost:5001/api/DiaPhuongCapTinhApi/Gets`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          TuKhoa: query,
          PageIndex: 1,
          PageSize: 20,
          TrangThai: null,
        }),
      },
    );

    if (!res.ok) throw new Error("Fetch failed");

    const result = await res.json();
    const listData = Array.isArray(result) ? result : result?.data || [];

    return (
      <main>
        {" "}
        {/* Dùng thẻ semantic <main> thay vì <div> để tốt cho SEO hơn */}
        <h1>Tra cứu địa phương</h1> {/* Có thêm thẻ H1 */}
        <SearchBar defaultSearch={query} />
        <ul>
          {listData.map((item: any) => (
            <li key={item.tinhID}>{item.ten}</li>
          ))}
        </ul>
      </main>
    );
  } catch (error) {
    return <div>Đã có lỗi xảy ra khi tải dữ liệu.</div>;
  }
}
