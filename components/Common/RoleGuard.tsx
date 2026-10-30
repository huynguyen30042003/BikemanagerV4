"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import {
  getUserFromToken,
  UserTokenInfo,
  isAccessTokenExpired,
} from "@/lib/auth";
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
    setTokenUser(getUserFromToken());
  }, [user]);

  const effectiveRoles = user?.roles ?? tokenUser?.roles ?? [];
  const hasAccess = isUserAuthorized(allowedRoles, effectiveRoles);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export interface AdminRouteGuardProps {
  children: ReactNode;
  mode?: "redirect" | "render";
  initialToken?: string | null;
}

/**
 * Guard kiểm soát quyền truy cập toàn bộ các trang con trong layout Admin
 * - mode = "render" (mặc định): Hiển thị thông báo 403 Access Denied ngay trong layout (vẫn giữ Sidebar).
 * - mode = "redirect": Chuyển hướng trực tiếp sang trang /forbidden toàn màn hình.
 */
export function AdminRouteGuard({
  children,
  mode = "render",
  initialToken,
}: AdminRouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, fetchUser, isLoading } = useAuthStore();

  // Khởi tạo tokenUser ngay lập tức từ initialToken (phía Server/SSR) hoặc từ getAccessToken() (phía Client)
  const [tokenUser, setTokenUser] = useState<UserTokenInfo | null>(() => {
    return getUserFromToken(initialToken);
  });
  const [hasChecked, setHasChecked] = useState<boolean>(() => {
    const initialUser = getUserFromToken(initialToken);
    return Boolean(initialUser && initialUser.roles.length > 0);
  });

  // 1. Xác thực phiên làm việc từ Token cục bộ và đồng bộ với API /api/auth/me
  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      // Đọc tức thì từ Token nếu còn hạn để chống giật frame (Flash of Forbidden khi F5)
      if (!isAccessTokenExpired()) {
        const tUser = getUserFromToken(initialToken);
        if (isMounted && tUser) {
          setTokenUser(tUser);
          if (tUser.roles.length > 0) {
            setHasChecked(true);
          }
        }
      }

      // Gọi fetchUser (tự động kiểm tra và refresh token nếu access_token hết hạn)
      try {
        const u = await fetchUser();
        if (isMounted) {
          if (u) {
            setTokenUser(getUserFromToken(initialToken));
          } else {
            setTokenUser(null);
          }
        }
      } catch (err) {
        console.error("[AdminRouteGuard] Lỗi xác thực phiên làm việc:", err);
        if (isMounted) {
          setTokenUser(null);
        }
      } finally {
        if (isMounted) {
          setHasChecked(true);
        }
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [fetchUser, initialToken]);

  const requiredRoles = getRequiredRolesForPath(pathname);
  const isAuthenticated = Boolean(user || tokenUser);
  const effectiveRoles = user?.roles ?? tokenUser?.roles ?? [];
  const hasRoleAccess = isUserAuthorized(requiredRoles, effectiveRoles);
  const hasAccess = isAuthenticated && hasRoleAccess;

  // 2. Thực hiện chuyển hướng an toàn trong useEffect (Gọi vô điều kiện để tuân thủ Rules of Hooks)
  useEffect(() => {
    if (!hasChecked || isLoading) return;

    if (!isAuthenticated) {
      const callbackPath = encodeURIComponent(pathname || "/admin");
      router.replace(`/login?callbackUrl=${callbackPath}`);
      return;
    }

    if (!hasRoleAccess && mode === "redirect") {
      const fromPath = encodeURIComponent(pathname || "/admin");
      router.replace(`/forbidden?from=${fromPath}`);
    }
  }, [
    hasChecked,
    isLoading,
    isAuthenticated,
    hasRoleAccess,
    mode,
    pathname,
    router,
  ]);

  // NẾU ĐÃ ĐĂNG NHẬP VÀ ĐỦ QUYỀN -> Render nội dung trang ngay tức thì
  if (hasAccess) {
    return <>{children}</>;
  }

  // NẾU CHƯA KIỂM TRA XONG HOẶC ĐANG LOADING -> Hiển thị Loading xác thực
  if (!hasChecked || isLoading) {
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

  // ĐÃ KIỂM TRA XONG MÀ CHƯA ĐĂNG NHẬP HOẶC KHÔNG ĐỦ QUYỀN Ở CHẾ ĐỘ REDIRECT -> Đang chuyển hướng
  if (!isAuthenticated || mode === "redirect") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          <p className="text-xs text-muted-foreground animate-pulse font-medium">
            Đang chuyển hướng...
          </p>
        </div>
      </div>
    );
  }

  // NẾU ĐÃ ĐĂNG NHẬP NHƯNG KHÔNG ĐỦ ROLE (chế độ render inline)
  return (
    <AccessDenied
      pathname={pathname}
      requiredRoles={requiredRoles ?? []}
      userRoles={effectiveRoles}
    />
  );
}
