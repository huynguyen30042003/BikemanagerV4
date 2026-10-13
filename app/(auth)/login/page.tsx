"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Bike,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

const loginValidate = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên đăng nhập")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Tên đăng nhập không được chứa ký tự đặc biệt không hợp lệ"),

  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu"),
});

type LoginForm = z.infer<typeof loginValidate>;

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  // Đọc callbackUrl hoặc from hoặc redirect từ URL
  const rawCallbackUrl =
    searchParams.get("callbackUrl") ||
    searchParams.get("from") ||
    searchParams.get("redirect") ||
    "/admin";

  // Bảo vệ redirect: chỉ cho phép đường dẫn nội bộ (bắt đầu bằng "/" và không phải "//" hoặc "/login")
  const targetRedirectUrl =
    rawCallbackUrl.startsWith("/") &&
    !rawCallbackUrl.startsWith("//") &&
    !rawCallbackUrl.startsWith("/login")
      ? rawCallbackUrl
      : "/admin";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginValidate),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = async (req: LoginForm) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: req.username,
          password: req.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          Object.entries(data.errors).forEach(([key, value]) => {
            const errorMsg = Array.isArray(value) ? value[0] : String(value);
            setError(key.toLowerCase() as "username" | "password", {
              message: errorMsg,
            });
          });
          return;
        }

        setError("root", {
          message: data.message || "Tên đăng nhập hoặc mật khẩu không chính xác",
        });
        return;
      }

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem(
        "expires_at",
        (Math.floor(Date.now() / 1000) + data.expires_in).toString()
      );

      // Cập nhật thông tin người dùng vào Zustand store qua api/auth/me
      try {
        await useAuthStore.getState().fetchUser();
      } catch (err) {
        console.error("[Login fetchUser error]", err);
      }

      // Chuyển hướng về lại đường dẫn được bảo vệ hoặc trang tổng quan
      router.push(targetRedirectUrl);
    } catch (err) {
      console.error("[Login fetch error]", err);
      setError("root", {
        message: "Không thể kết nối đến máy chủ xác thực. Vui lòng thử lại sau.",
      });
    }
  };

  const isRedirected = targetRedirectUrl !== "/admin";

  return (
    <div className="w-full max-w-md">
      {/* Login Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl backdrop-blur-xs relative overflow-hidden">
        {/* Subtle top accent highlight line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 ring-4 ring-blue-500/10 mb-3.5">
            <Bike className="w-7 h-7 stroke-[2]" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            BikeManager <span className="text-blue-600 dark:text-blue-400">V4</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Hệ thống quản trị chuỗi xe điện, phân phối & dịch vụ kỹ thuật
          </p>

          {/* Callback / Redirect banner */}
          {isRedirected && (
            <div className="mt-3.5 w-full flex items-center gap-2 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300 text-left">
              <Sparkles className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
              <span>Vui lòng đăng nhập để tiếp tục truy cập trang quản trị.</span>
            </div>
          )}
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          {/* Root error banner */}
          {errors.root && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errors.root.message}</span>
            </div>
          )}

          {/* Username Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="block text-xs font-semibold text-foreground uppercase tracking-wider"
            >
              Tên đăng nhập
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Nhập username hoặc mã nhân viên..."
                {...register("username")}
                disabled={isSubmitting}
                className={`w-full pl-10 pr-3.5 h-10.5 rounded-xl border bg-background/80 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.username
                    ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                    : "border-border/80"
                }`}
              />
            </div>
            {errors.username && (
              <p className="text-destructive text-xs flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-foreground uppercase tracking-wider"
              >
                Mật khẩu
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                {...register("password")}
                disabled={isSubmitting}
                className={`w-full pl-10 pr-10 h-10.5 rounded-xl border bg-background/80 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.password
                    ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                    : "border-border/80"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors cursor-pointer"
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-destructive text-xs flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button (Only Login, No Register) */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 h-11 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xác thực tài khoản...</span>
              </>
            ) : (
              <>
                <span>Đăng nhập hệ thống</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Footer Notice */}
        <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/80">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Hệ thống quản trị nội bộ · Phân quyền bảo mật RBAC 2.0</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center p-4">
          <div className="w-9 h-9 rounded-full border-3 border-blue-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}