"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { getUserFromToken, UserTokenInfo } from "@/lib/auth";
import {
  getRequiredRolesForPath,
  isUserAuthorized,
} from "@/config/rolePermissions";
import AccessDenied from "./AccessDenied";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
  fallback?: ReactNode;
}

/**
 * Component bọc bất kỳ nội dung/nút bấm nào cần phân quyền cụ thể
 * Ví dụ: <RoleGuard allowedRoles={["Administrator"]}><button>Xóa dữ liệu</button></RoleGuard>
 */
export function RoleGuard({
  children,
  allowedRoles,
  fallback = null,
}: RoleGuardProps) {
  const { user } = useAuthStore();
  const [tokenUser, setTokenUser] = useState<UserTokenInfo | null>(null);

  useEffect(() => {
    if (!user) {
      setTokenUser(getUserFromToken());
    }
  }, [user]);

  const effectiveRoles = user?.roles ?? tokenUser?.roles ?? [];
  const hasAccess = isUserAuthorized(allowedRoles, effectiveRoles);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface AdminRouteGuardProps {
  children: ReactNode;
  mode?: "redirect" | "render";
}

/**
 * Guard kiểm soát quyền truy cập toàn bộ các trang con trong layout Admin
 * - mode = "render" (mặc định): Hiển thị thông báo 403 Access Denied ngay trong layout (vẫn giữ Sidebar).
 * - mode = "redirect": Chuyển hướng trực tiếp sang trang /forbidden toàn màn hình.
 */
export function AdminRouteGuard({
  children,
  mode = "render",
}: AdminRouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, fetchUser, isLoading } = useAuthStore();

  const [tokenUser, setTokenUser] = useState<UserTokenInfo | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // 1. Đọc tức thì từ Token trong Cookie để tránh giật lag frame đầu
    const tUser = getUserFromToken();
    setTokenUser(tUser);

    // 2. Xác thực lại với API
    if (!user) {
      fetchUser().finally(() => {
        setHasChecked(true);
      });
    } else {
      setHasChecked(true);
    }
  }, [user, fetchUser]);

  const requiredRoles = getRequiredRolesForPath(pathname);

  // Nếu route không yêu cầu quyền gì, cho phép truy cập luôn
  if (!requiredRoles || requiredRoles.length === 0) {
    return <>{children}</>;
  }

  // Kết hợp roles từ user (API/Zustand) và tokenUser (Cookie)
  const effectiveRoles = user?.roles ?? tokenUser?.roles ?? [];
  const hasAccess = isUserAuthorized(requiredRoles, effectiveRoles);

  // NẾU CÓ QUYỀN -> Render page ngay tức thì, tuyệt đối không hiện Forbidden
  if (hasAccess) {
    return <>{children}</>;
  }

  // NẾU CHƯA CÓ QUYỀN VÀ ĐANG TRONG QUÁ TRÌNH KIỂM TRA TỪ API -> Hiển thị Loading xác thực
  if (!hasChecked || (isLoading && !user)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          <p className="text-xs text-muted-foreground animate-pulse font-medium">
            Đang xác thực quyền truy cập...
          </p>
        </div>
      </div>
    );
  }

  // ĐÃ KIỂM TRA XONG từ cả Token và API mà VẪN KHÔNG CÓ QUYỀN:
  // 1. Nếu hoàn toàn chưa đăng nhập -> chuyển đến login kèm callbackUrl
  if (!user && !tokenUser) {
    const callbackPath = encodeURIComponent(pathname);
    router.replace(`/login?callbackUrl=${callbackPath}`);
    return null;
  }

  // 2. Nếu đã đăng nhập nhưng không đủ role:
  if (mode === "redirect") {
    const fromPath = encodeURIComponent(pathname);
    router.replace(`/forbidden?from=${fromPath}`);
    return null;
  }

  return (
    <AccessDenied
      pathname={pathname}
      requiredRoles={requiredRoles}
      userRoles={effectiveRoles}
    />
  );
}
