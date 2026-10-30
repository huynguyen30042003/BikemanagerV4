import type { Metadata } from "next";
import { cookies } from "next/headers";
import SiderBarAdmin from "@/components/Common/SiderBarAdmin";
import MobileSidebarAdmin from "@/components/Common/MobileSidebarAdmin";
import { AdminRouteGuard } from "@/components/Common/RoleGuard";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "Hệ thống Quản trị",
    template: "%s | Quản trị Bike Manager",
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
