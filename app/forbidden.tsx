"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldAlert, ArrowLeft, Home, LogIn } from "lucide-react";
import {
  useRole,
  useLogout,
  isSafeRedirectUrl,
} from "@/hooks/Auth/useAuth";

function ForbiddenContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const logout = useLogout();
  const { user, roles: currentRoles } = useRole();

  const rawFromUrl =
    searchParams.get("from") ??
    searchParams.get("callbackUrl") ??
    "/admin";

  const fromUrl = isSafeRedirectUrl(rawFromUrl) ? rawFromUrl : "/admin";

  const handleReLogin = () => {
    logout(`/login?callbackUrl=${encodeURIComponent(fromUrl)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-background">
      <div className="max-w-md w-full rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl text-center space-y-6">
        {/* Icon 403 */}
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
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground pt-1">
            Không có quyền truy cập
          </h1>
          <p className="text-sm text-muted-foreground">
            Tài khoản của bạn không được cấp thẩm quyền cần thiết để truy cập tài nguyên này.
          </p>
        </div>

        {/* Info card */}
        <div className="rounded-xl bg-muted/50 p-4 border border-border/60 text-left text-xs space-y-2">
          {fromUrl && fromUrl !== "/admin" && (
            <div className="flex justify-between items-center gap-2 pb-1.5 border-b border-border/50">
              <span className="text-muted-foreground">Đường dẫn yêu cầu:</span>
              <span className="font-mono font-medium text-foreground truncate max-w-[200px]">
                {fromUrl}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center gap-2">
            <span className="text-muted-foreground">Tài khoản hiện tại:</span>
            <span className="font-semibold text-foreground">
              {user?.username || user?.email || "Người dùng"}
            </span>
          </div>

          <div className="flex justify-between items-center gap-2 pt-1 border-t border-border/50">
            <span className="text-muted-foreground">Vai trò hiện có:</span>
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
                <span className="text-muted-foreground italic">Chưa có vai trò</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          {/* Nút Đăng nhập lại / Đổi tài khoản */}
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
              <span>Về trang chủ Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Forbidden() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <ForbiddenContent />
    </Suspense>
  );
}
