import type { Metadata } from "next";
import { cookies } from "next/headers";
import SiderBarAdmin from "@/components/Common/SiderBarAdmin";
import MobileSidebarAdmin from "@/components/Common/MobileSidebarAdmin";
import { AdminRouteGuard } from "@/components/Common/RoleGuard";
import { ReactNode } from "react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://store.nhithoi.io.vn";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hệ thống Quản trị",
    template: "%s | Quản trị Bike Manager",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: `${siteUrl}/admin`,
    siteName: "Cửa hàng xe đạp Nhi Thời",
    title: "Hệ thống Quản trị | Cửa hàng xe đạp Nhi Thời",
    description: "Trang quản trị & vận hành hệ thống Cửa hàng xe đạp Nhi Thời",
    images: [
      {
        url: "/logo.png",
        width: 1060,
        height: 937,
        alt: "Logo Cửa hàng xe đạp Nhi Thời",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hệ thống Quản trị | Cửa hàng xe đạp Nhi Thời",
    description: "Trang quản trị & vận hành hệ thống Cửa hàng xe đạp Nhi Thời",
    images: ["/logo.png"],
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value ?? null;

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Mobile Header & Sliding Drawer Navigation (Dành riêng cho màn hình nhỏ / mobile) */}
      <MobileSidebarAdmin />

      {/* Desktop Sidebar (Dành riêng cho màn hình lớn >= 1024px) */}
      <SiderBarAdmin />

      {/* Nội dung trang quản trị */}
      <main className="flex-1 min-h-screen bg-background w-full min-w-0">
        <AdminRouteGuard initialToken={accessToken} mode="redirect">
          {children}
        </AdminRouteGuard>
      </main>
    </div>
  );
};

export default AdminLayout;
