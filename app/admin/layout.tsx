import SiderBarAdmin from "@/components/Common/SiderBarAdmin";
import { AdminRouteGuard } from "@/components/Common/RoleGuard";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="w-full min-h-screen flex">
      <SiderBarAdmin />
      <div className="flex-1 min-h-screen bg-background">
        <AdminRouteGuard mode="redirect">{children}</AdminRouteGuard>
      </div>
    </div>
  );
};

export default AdminLayout;

