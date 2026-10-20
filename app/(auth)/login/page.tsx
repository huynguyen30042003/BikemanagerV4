"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/useAuthStore";
import { setAuthTokens } from "@/lib/auth";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import {
  Bike,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Sparkles,
  Zap,
  Activity,
  Cpu,
  CheckCircle2,
  Smartphone,
  RefreshCw,
  KeyRound,
} from "lucide-react";

const loginValidate = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên đăng nhập hoặc email")
    .regex(
      /^[a-zA-Z0-9_.@-]+$/,
      "Tên đăng nhập không được chứa ký tự đặc biệt không hợp lệ"
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

  // Trạng thái cho luồng 2FA (Bước 2)
  const [step, setStep] = useState<"credentials" | "2fa">("credentials");
  const [twoFactorToken, setTwoFactorToken] = useState<string>("");
  const [twoFactorPhone, setTwoFactorPhone] = useState<string>("");
  const [otpCode, setOtpCode] = useState<string>("");
  const [isSubmittingOtp, setIsSubmittingOtp] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState<number>(60);
  const [isResending, setIsResending] = useState<boolean>(false);

  // Đếm ngược thời gian cho phép gửi lại mã OTP SMS
  useEffect(() => {
    if (step !== "2fa" || resendCountdown <= 0) return;
    const interval = setInterval(() => {
      setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, resendCountdown]);

  // Đọc callbackUrl hoặc from hoặc redirect từ URL
  const rawCallbackUrl =
    searchParams.get("callbackUrl") ||
    searchParams.get("from") ||
    searchParams.get("redirect") ||
    "/admin";

  // Bảo vệ redirect: chỉ cho phép đường dẫn nội bộ hợp lệ
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
      remember: false,
    },
  });

  // Kiểm tra phím Caps Lock khi người dùng gõ mật khẩu
  const handleKeyModifier = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (typeof e.getModifierState === "function") {
      setIsCapsLockOn(e.getModifierState("CapsLock"));
    }
  };

  // 1. Xử lý Đăng nhập Bước 1 (Username + Password)
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

      // Trường hợp tài khoản yêu cầu xác thực 2 bước (2FA SMS)
      if (
        data.requiresTwoFactor ||
        data.requires2FA ||
        data.RequiresTwoFactor ||
        data.TwoFactorRequired ||
        (!data.access_token && !data.accessToken && (data.twoFactorToken || data.TwoFactorToken))
      ) {
        setTwoFactorToken(data.twoFactorToken || data.TwoFactorToken || "");
        setTwoFactorPhone(
          data.phoneNumber ||
            data.PhoneNumber ||
            data.phone ||
            data.Phone ||
            ""
        );
        setResendCountdown(60);
        setOtpCode("");
        setOtpError(null);
        setStep("2fa");
        toast.info(
          data.message ||
            "Tài khoản yêu cầu xác thực 2 bước. Mã OTP bảo mật đã được gửi qua tin nhắn SMS!"
        );
        return;
      }

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
          message:
            data.message ||
            "Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.",
        });
        return;
      }

      // Lưu Access Token vào Cookie (Refresh Token được server bảo mật bằng HttpOnly Cookie)
      setAuthTokens(data);

      // Cập nhật thông tin người dùng vào In-Memory Zustand store qua /api/auth/me
      try {
        await useAuthStore.getState().fetchUser();
      } catch (err) {
        console.error("[Login fetchUser error]", err);
      }

      toast.success("Đăng nhập thành công!");
      // Chuyển hướng về trang nội bộ đã định trước
      router.push(targetRedirectUrl);
    } catch (err) {
      console.error("[Login fetch error]", err);
      setError("root", {
        message:
          "Không thể kết nối đến máy chủ xác thực. Vui lòng kiểm tra lại kết nối mạng.",
      });
    }
  };

  // 2. Xử lý Đăng nhập Bước 2 (Xác thực mã OTP 2FA SMS)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = otpCode.trim();

    if (!cleanCode || cleanCode.length < 6) {
      setOtpError("Vui lòng nhập đủ 6 chữ số mã OTP.");
      return;
    }

    setIsSubmittingOtp(true);
    setOtpError(null);

    try {
      const response = await fetch("/api/auth/login-2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          twoFactorToken,
          code: cleanCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setOtpError(
          data.message || "Mã OTP không chính xác hoặc đã hết hạn. Vui lòng thử lại."
        );
        setIsSubmittingOtp(false);
        return;
      }

      // Lưu Token vào Cookie & Zustand store
      setAuthTokens(data);
      try {
        await useAuthStore.getState().fetchUser();
      } catch (err) {
        console.error("[Login2FA fetchUser error]", err);
      }

      toast.success("Xác thực 2 bước thành công! Đang chuyển hướng...");
      router.push(targetRedirectUrl);
    } catch (err) {
      console.error("[Login2FA error]", err);
      setOtpError("Lỗi kết nối máy chủ xác thực. Vui lòng thử lại.");
      setIsSubmittingOtp(false);
    }
  };

  // 3. Xử lý Gửi lại mã OTP SMS
  const handleResendOtp = async () => {
    if (resendCountdown > 0 || isResending) return;
    setIsResending(true);

    try {
      const response = await fetch("/api/auth/2fa/send-login-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          twoFactorToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.message || "Không thể gửi lại mã OTP. Vui lòng thử lại sau."
        );
        return;
      }

      setResendCountdown(60);
      toast.success(
        data.message || "Mã OTP mới đã được gửi qua tin nhắn SMS thành công!"
      );
    } catch (err) {
      console.error("[Resend OTP error]", err);
      toast.error("Lỗi kết nối khi gửi lại mã OTP SMS.");
    } finally {
      setIsResending(false);
    }
  };

  const isRedirected = targetRedirectUrl !== "/admin";

  // Định dạng số điện thoại ẩn bớt: 0901234567 -> 090***4567
  const formatMaskedPhone = (phone: string) => {
    if (!phone) return "số điện thoại đã đăng ký";
    if (phone.length <= 6) return phone;
    return `${phone.slice(0, 3)}****${phone.slice(-3)}`;
  };

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
              <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/25">
                <Bike className="w-6 h-6 stroke-[2.2]" />
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
                <span className="font-medium text-foreground">Bảo mật 2FA SMS</span>
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

            {/* BƯỚC 1: NHẬP TÀI KHOẢN VÀ MẬT KHẨU */}
            {step === "credentials" ? (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3 lg:hidden">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                      <Bike className="w-5 h-5 stroke-[2]" />
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
                      <span>Vui lòng đăng nhập để truy cập trang quản trị yêu cầu.</span>
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
                        <span>Tiếp tục đăng nhập</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* BƯỚC 2: XÁC THỰC HAI BƯỚC (2FA SMS OTP) */
              <div className="space-y-5 animate-in fade-in duration-300">
                {/* Header Xác thực 2 bước */}
                <div className="text-center space-y-2">
                  <div className="w-13 h-13 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/30 shadow-md shadow-blue-500/10">
                    <Smartphone className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-500/20">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Xác thực 2 bước (2FA)</span>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">
                    Nhập mã xác thực OTP
                  </h2>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Mã OTP bảo mật 6 số đã được gửi qua tin nhắn SMS tới{" "}
                    <span className="font-semibold text-foreground">
                      {formatMaskedPhone(twoFactorPhone)}
                    </span>
                    .
                  </p>
                </div>

                {/* Form nhập OTP */}
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {otpError && (
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs animate-shake">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{otpError}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label
                      htmlFor="otpCode"
                      className="block text-xs font-semibold text-foreground text-center uppercase tracking-wider"
                    >
                      Mã xác thực OTP (6 số)
                    </label>

                    <div className="relative max-w-xs mx-auto">
                      <input
                        id="otpCode"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        placeholder="123456"
                        autoFocus
                        value={otpCode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setOtpCode(val);
                          if (otpError) setOtpError(null);
                        }}
                        disabled={isSubmittingOtp}
                        className="w-full h-13 px-4 rounded-xl border border-border/80 bg-background text-center font-mono text-2xl font-bold tracking-[0.4em] text-foreground placeholder:text-muted-foreground/30 outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 disabled:opacity-50"
                      />
                    </div>
                    <p className="text-[11px] text-center text-muted-foreground">
                      Vui lòng nhập chính xác mã OTP nhận được trong SMS
                    </p>
                  </div>

                  {/* Countdown & Nút Gửi lại mã */}
                  <div className="text-center pt-1">
                    {resendCountdown > 0 ? (
                      <span className="text-xs text-muted-foreground">
                        Gửi lại mã OTP sau{" "}
                        <span className="font-semibold text-blue-600 font-mono">
                          {resendCountdown}s
                        </span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isResending}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 underline underline-offset-4 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw
                          className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`}
                        />
                        <span>
                          {isResending ? "Đang gửi SMS..." : "Gửi lại mã OTP qua SMS"}
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Nút Xác nhận OTP */}
                  <button
                    type="submit"
                    disabled={isSubmittingOtp || otpCode.length < 6}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isSubmittingOtp ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang xác thực OTP...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Xác nhận & Hoàn tất đăng nhập</span>
                      </>
                    )}
                  </button>

                  {/* Nút Quay lại bước 1 */}
                  <button
                    type="button"
                    onClick={() => {
                      setStep("credentials");
                      setOtpError(null);
                      setOtpCode("");
                    }}
                    disabled={isSubmittingOtp}
                    className="w-full flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground py-1 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Đăng nhập với tài khoản khác</span>
                  </button>
                </form>
              </div>
            )}

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