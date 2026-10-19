import SiderBarAdmin from "@/components/Common/SiderBarAdmin";
import MobileSidebarAdmin from "@/components/Common/MobileSidebarAdmin";
import { AdminRouteGuard } from "@/components/Common/RoleGuard";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Mobile Header & Sliding Drawer Navigation (Dành riêng cho màn hình nhỏ / mobi) */}
      <MobileSidebarAdmin />

      {/* Desktop Sidebar (Dành riêng cho màn hình lớn >= 1024px) */}
      <SiderBarAdmin />

      {/* Nội dung trang quản trị */}
      <div className="flex-1 min-h-screen bg-background w-full min-w-0">
        <AdminRouteGuard mode="redirect">{children}</AdminRouteGuard>
      </div>
    </div>
  );
};

export default AdminLayout;


