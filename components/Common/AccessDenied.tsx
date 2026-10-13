"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, Home, LogIn } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/hooks/Auth/useAuth";

interface AccessDeniedProps {
  pathname?: string;
  requiredRoles?: string[];
  userRoles?: string[];
}

export default function AccessDenied({
  pathname,
  requiredRoles,
  userRoles,
}: AccessDeniedProps) {
  const router = useRouter();
  const logout = useLogout();
  const { user } = useAuthStore();

  const currentRoles = userRoles ?? user?.roles ?? [];
  const targetPath = pathname || "/admin";

  const handleReLogin = () => {
    logout(`/login?callbackUrl=${encodeURIComponent(targetPath)}`);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl border border-border/80 bg-card p-8 shadow-lg text-center space-y-6">
        {/* Icon & Status */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20 shadow-xs animate-bounce">
            <ShieldAlert className="w-8 h-8" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-rose-600 dark:text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
            HTTP 403 Forbidden
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-foreground pt-1">
            Không có quyền truy cập
          </h2>
          <p className="text-sm text-muted-foreground">
            Tài khoản của bạn không có đủ thẩm quyền để xem hoặc chỉnh sửa nội dung tại đường dẫn này.
          </p>
        </div>

        {/* Detailed Info Card */}
        <div className="rounded-xl bg-muted/50 p-4 border border-border/60 text-left text-xs space-y-2.5">
          {pathname && (
            <div className="flex justify-between items-center gap-2">
              <span className="text-muted-foreground">Đường dẫn:</span>
              <span className="font-mono text-foreground font-medium truncate max-w-[200px]">
                {pathname}
              </span>
            </div>
          )}

          {requiredRoles && requiredRoles.length > 0 && (
            <div className="flex justify-between items-center gap-2">
              <span className="text-muted-foreground">Quyền yêu cầu:</span>
              <div className="flex flex-wrap gap-1 justify-end">
                {requiredRoles.map((r) => (
                  <span
                    key={r}
                    className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/20"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center gap-2 pt-1 border-t border-border/50">
            <span className="text-muted-foreground">Quyền hiện tại:</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {currentRoles.length > 0 ? (
                currentRoles.map((r) => (
                  <span
                    key={r}
                    className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium border border-amber-500/20"
                  >
                    {r}
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground italic">Chưa có quyền</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          {/* Nút Đăng nhập lại */}
          <button
            type="button"
            onClick={handleReLogin}
            className="w-full h-11 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng nhập lại với tài khoản khác</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full sm:flex-1 h-10 px-4 rounded-xl border border-border/80 text-foreground hover:bg-muted font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại</span>
            </button>

            <Link
              href="/admin"
              className="w-full sm:flex-1 h-10 px-4 rounded-xl border border-border/80 text-foreground hover:bg-muted font-medium text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Trang chủ</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
