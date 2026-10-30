"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import logo from "@/image/logo.png";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/useAuthStore";
import { setAuthTokens, isSafeRedirectUrl } from "@/lib/auth";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
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
  Zap,
  Activity,
  Cpu,
  CheckCircle2,
} from "lucide-react";

const loginValidate = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên đăng nhập hoặc email")
    .regex(
      /^[a-zA-Z0-9_.@-]+$/,
      "Tên đăng nhập không được chứa ký tự đặc biệt không hợp lệ",
    ),

  password: z.string().min(1, "Vui lòng nhập mật khẩu"),

  remember: z.boolean(),
});

type LoginForm = z.infer<typeof loginValidate>;

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();
  const [showPassword, setShowPassword] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  // Đọc callbackUrl hoặc from hoặc redirect từ URL
  const rawCallbackUrl =
    searchParams.get("callbackUrl") ??
    searchParams.get("from") ??
    searchParams.get("redirect") ??
    "/admin";

  // Bảo vệ redirect: chỉ cho phép đường dẫn nội bộ hợp lệ (Chống Open Redirect)
  const targetRedirectUrl = isSafeRedirectUrl(rawCallbackUrl)
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
      remember: false,
    },
  });

  // Kiểm tra phím Caps Lock khi người dùng gõ mật khẩu
  const handleKeyModifier = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (typeof e.getModifierState === "function") {
      setIsCapsLockOn(e.getModifierState("CapsLock"));
    }
  };

  // Xử lý Đăng nhập (Username + Password)
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
          remember: req.remember,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data.errors && typeof data.errors === "object") {
          Object.entries(data.errors).forEach(([key, value]) => {
            const errorMsg = Array.isArray(value) ? value[0] : String(value);
            const normalizedKey = key.toLowerCase();
            if (normalizedKey === "username" || normalizedKey === "password") {
              setError(normalizedKey, {
                message: errorMsg,
              });
            }
          });
          return;
        }

        setError("root", {
          message:
            data.message ??
            "Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.",
        });
        return;
      }

      // Lưu Access Token vào Cookie (Refresh Token được server bảo mật bằng HttpOnly Cookie, tuyệt đối không lưu localStorage)
      setAuthTokens(data);

      // Ép buộc làm mới thông tin người dùng vào In-Memory Zustand store qua /api/auth/me
      try {
        await useAuthStore.getState().fetchUser(true);
      } catch (err) {
        console.error("[Login fetchUser error]", err);
      }

      toast.success("Đăng nhập thành công!");
      // Chuyển hướng về trang nội bộ đã định trước
      router.push(targetRedirectUrl);
      router.refresh();
    } catch (err) {
      console.error("[Login fetch error]", err);
      setError("root", {
        message:
          "Không thể kết nối đến máy chủ xác thực. Vui lòng kiểm tra lại kết nối mạng.",
      });
    }
  };

  const isRedirected = targetRedirectUrl !== "/admin";

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12 flex items-center justify-center">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Brand & Vehicle Showcase */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex lg:col-span-7 flex-col justify-between rounded-3xl border border-border/70 bg-card/60 backdrop-blur-md p-8 relative overflow-hidden shadow-2xl shadow-black/5"
        >
          {/* Subtle top ambient indicator */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-600/10 flex items-center justify-center p-1.5 border border-border/70 shadow-sm">
                <Image
                  src={logo}
                  alt="Bike Manager Logo"
                  width={36}
                  height={36}
                  priority
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5">
                  BikeManager <span className="text-blue-600 dark:text-blue-400">V4</span>
                </span>
                <p className="text-[11px] font-medium text-muted-foreground">
                  Enterprise E-Mobility Platform
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>Hệ thống trực tuyến</span>
            </div>
          </div>

          {/* Hero Visual: High-tech Electric Bike Showcase Asset */}
          <div className="relative my-6 rounded-2xl overflow-hidden border border-border/80 group">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src="/images/auth-bike.jpg"
                alt="Xe điện thông minh cao cấp BikeManager"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

            {/* Bottom floating telemetry metrics */}
            <div className="absolute bottom-4 left-4 right-4 z-10 grid grid-cols-2 gap-3 text-white">
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="flex items-center gap-2 text-blue-400 mb-1">
                  <Activity className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Hạm đội hoạt động</span>
                </div>
                <div className="text-xl font-bold tracking-tight">3,420+ xe</div>
                <p className="text-[10px] text-white/70 mt-0.5">Kết nối telemetry thời gian thực</p>
              </div>

              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <Cpu className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Độ khả dụng</span>
                </div>
                <div className="text-xl font-bold tracking-tight">99.8% SLA</div>
                <p className="text-[10px] text-white/70 mt-0.5">Phản hồi lệnh viễn thông dưới 1.2s</p>
              </div>
            </div>
          </div>

          {/* Operational Value Proposition & Highlights */}
          <div className="space-y-3 z-10">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Giải pháp toàn diện quản lý phân phối & kỹ thuật xe điện
            </h2>
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="flex items-center gap-2 p-2.5 rounded-xl border border-border/60 bg-background/50 text-xs">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="font-medium text-foreground">Quản lý kho xe</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl border border-border/60 bg-background/50 text-xs">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="font-medium text-foreground">Chuẩn đoán pin IoT</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl border border-border/60 bg-background/50 text-xs">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="font-medium text-foreground">Bảo mật mã hóa cao</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Authentication Terminal */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:col-span-5 flex flex-col justify-center"
        >
          <div className="w-full rounded-3xl border border-border/80 bg-card p-6 sm:p-9 shadow-xl relative overflow-hidden">
            {/* Top accent highlight bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />

            {/* FORM ĐĂNG NHẬP */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3 lg:hidden">
                <div className="w-9 h-9 rounded-xl bg-blue-600/10 flex items-center justify-center p-1 border border-border/70 shadow-xs">
                  <Image
                    src={logo}
                    alt="Bike Manager Logo"
                    width={28}
                    height={28}
                    priority
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-base font-bold tracking-tight text-foreground">
                  BikeManager <span className="text-blue-600">V4</span>
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Đăng nhập hệ thống
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Nhập tài khoản quản lý hoặc nhân viên để tiếp tục
              </p>

              {/* Redirect Notice Banner */}
              {isRedirected && (
                <div className="mt-3.5 flex items-center gap-2 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300">
                  <Sparkles className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span className="truncate">
                    Vui lòng đăng nhập để tiếp tục truy cập:{" "}
                    <strong className="font-mono font-semibold">{targetRedirectUrl}</strong>
                  </span>
                </div>
              )}
            </div>

            <form
              onSubmit={handleSubmit(handleLogin)}
              method="POST"
              action="#"
              className="space-y-4"
            >
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
                  Tài khoản đăng nhập
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Tên đăng nhập hoặc mã nhân viên..."
                    {...register("username")}
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-3.5 h-11 rounded-xl border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15 disabled:opacity-50 disabled:cursor-not-allowed ${
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
                  {isCapsLockOn && (
                    <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1 animate-pulse">
                      <AlertCircle className="w-3 h-3" />
                      Caps Lock đang bật
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...register("password")}
                    onKeyDown={handleKeyModifier}
                    onKeyUp={handleKeyModifier}
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-10 h-11 rounded-xl border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15 disabled:opacity-50 disabled:cursor-not-allowed ${
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

              {/* Remember Option */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-muted-foreground hover:text-foreground">
                  <input
                    type="checkbox"
                    {...register("remember")}
                    disabled={isSubmitting}
                    className="w-4 h-4 rounded border-border text-blue-600 focus:ring-blue-600 focus:ring-2 cursor-pointer"
                  />
                  <span>Ghi nhớ phiên làm việc trên thiết bị này</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 h-11 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang kiểm tra thông tin...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng nhập hệ thống</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Security Notice */}
            <div className="mt-6 pt-4 border-t border-border/70 flex flex-col items-center gap-1 text-[11px] text-muted-foreground text-center">
              <div className="flex items-center justify-center gap-1.5 font-medium text-foreground/80">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Cổng quản trị nội bộ dành cho nhân viên ủy quyền</span>
              </div>
              <span className="text-[10px] text-muted-foreground/70">
                Hệ thống xác thực mã hóa kép và giám sát truy cập bảo mật
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] w-full flex items-center justify-center p-4">
          <div className="w-9 h-9 rounded-full border-3 border-blue-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
