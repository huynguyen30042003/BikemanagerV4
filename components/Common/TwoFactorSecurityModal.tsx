"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  Smartphone,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Info,
  Shield,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  KeyRound,
} from "lucide-react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  use2FAStatus,
  useEnable2FA,
  useDisable2FA,
  useSendSetupCode,
  useAuthStore,
} from "@/hooks/Auth/useAuth";

export interface TwoFactorSecurityModalProps {
  isOpen?: boolean;
  open?: boolean;
  onClose: () => void;
}

export function TwoFactorSecurityModal({
  isOpen,
  open,
  onClose,
}: TwoFactorSecurityModalProps) {
  // Tương thích cả prop isOpen và open cho SlideOver
  const isDrawerOpen = open ?? isOpen ?? false;

  const { user } = useAuthStore();
  const {
    data: statusData,
    isLoading: isLoadingStatus,
    refetch: refetchStatus,
  } = use2FAStatus();

  const sendSetupCodeMutation = useSendSetupCode();
  const enable2FAMutation = useEnable2FA();
  const disable2FAMutation = useDisable2FA();

  // Xác định trạng thái 2FA từ API hoặc Zustand store
  const is2FAEnabled = Boolean(
    statusData?.twoFactorEnabled ??
      statusData?.isTwoFactorEnabled ??
      user?.isTwoFactorEnabled ??
      user?.twoFactorEnabled
  );

  const registeredPhone =
    statusData?.phoneNumber || user?.phoneNumber || "";

  // Refs để auto-focus input
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Switch state đồng bộ với is2FAEnabled
  const [switchChecked, setSwitchChecked] = useState<boolean>(is2FAEnabled);

  // Các state cho luồng BẬT 2FA (Bước 1: SĐT -> Bước 2: OTP 6 số)
  const [setupStep, setSetupStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [setupOtpCode, setSetupOtpCode] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(0);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Các state cho luồng TẮT 2FA (yêu cầu mật khẩu xác nhận)
  const [isConfirmingDisable, setIsConfirmingDisable] = useState<boolean>(false);
  const [disablePassword, setDisablePassword] = useState<string>("");
  const [disableError, setDisableError] = useState<string | null>(null);

  // Đếm lùi 60 giây cho phép gửi lại mã OTP kích hoạt
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Đồng bộ trạng thái Switch mỗi khi dữ liệu 2FA thực tế thay đổi
  useEffect(() => {
    setSwitchChecked(is2FAEnabled);
  }, [is2FAEnabled]);

  // Reset form mỗi khi mở Drawer
  useEffect(() => {
    if (isDrawerOpen) {
      setPhoneNumber(registeredPhone || "");
      setSetupStep("phone");
      setSetupOtpCode("");
      setPhoneError(null);
      setOtpError(null);
      setIsConfirmingDisable(false);
      setDisablePassword("");
      setDisableError(null);
      setSwitchChecked(is2FAEnabled);
      refetchStatus();
    }
  }, [isDrawerOpen, registeredPhone, is2FAEnabled, refetchStatus]);

  // BƯỚC 1: Gửi mã OTP xác nhận đến số điện thoại (POST /api/auth/2fa/send-setup-code)
  const handleSendSetupCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPhone = phoneNumber.trim();

    if (!cleanPhone) {
      setPhoneError("Vui lòng nhập số điện thoại nhận mã SMS OTP.");
      phoneInputRef.current?.focus();
      return;
    }

    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setPhoneError(
        "Số điện thoại không hợp lệ (ví dụ: 0901234567 hoặc +84901234567)."
      );
      phoneInputRef.current?.focus();
      return;
    }

    setPhoneError(null);

    try {
      const res = await sendSetupCodeMutation.mutateAsync({
        phoneNumber: cleanPhone,
      });

      toast.success(
        res?.message || "Mã xác thực đã được gửi tới số điện thoại của bạn."
      );
      setSetupStep("otp");
      setCountdown(60);
      setOtpError(null);
      setTimeout(() => otpInputRef.current?.focus(), 150);
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        "Không thể gửi mã xác thực. Vui lòng kiểm tra lại số điện thoại.";
      setPhoneError(errorMsg);
      toast.error(errorMsg);
    }
  };

  // BƯỚC 2: Xác thực mã OTP và chính thức BẬT 2FA (POST /api/auth/2fa/enable)
  const handleVerifySetupCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanOtp = setupOtpCode.trim();

    if (!cleanOtp || cleanOtp.length < 6) {
      setOtpError("Vui lòng nhập đủ 6 chữ số mã OTP.");
      otpInputRef.current?.focus();
      return;
    }

    setOtpError(null);

    try {
      const res = await enable2FAMutation.mutateAsync({
        code: cleanOtp,
      });

      toast.success(
        res?.message ||
          "Kích hoạt xác thực 2 bước (Two-Factor SMS) thành công!"
      );
      setSetupStep("phone");
      setSetupOtpCode("");
      setSwitchChecked(true);
      await refetchStatus();
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        "Mã OTP không chính xác hoặc đã hết hạn. Vui lòng thử lại.";
      setOtpError(errorMsg);
      toast.error(errorMsg);
    }
  };

  // TẮT TÍNH NĂNG 2FA bằng mật khẩu tài khoản (POST /api/auth/2fa/disable)
  const handleDisable2FA = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPassword = disablePassword.trim();

    if (!cleanPassword) {
      setDisableError("Vui lòng nhập mật khẩu tài khoản để xác nhận tắt 2FA.");
      passwordInputRef.current?.focus();
      return;
    }

    setDisableError(null);

    try {
      const res = await disable2FAMutation.mutateAsync({
        password: cleanPassword,
      });

      toast.success(
        res?.message || "Đã tắt tính năng xác thực 2 bước thành công."
      );
      setIsConfirmingDisable(false);
      setDisablePassword("");
      setSwitchChecked(false);
      await refetchStatus();
    } catch (err: unknown) {
      setSwitchChecked(true);
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Mật khẩu xác nhận không chính xác.";
      setDisableError(errorMsg);
      toast.error(errorMsg);
    }
  };

  // Xử lý khi người dùng gạt Switch
  const handleSwitchToggle = async (checked: boolean) => {
    if (checked) {
      // Người dùng muốn BẬT 2FA
      if (setupStep === "otp" && setupOtpCode.trim().length === 6) {
        await handleVerifySetupCode();
      } else {
        await handleSendSetupCode();
      }
    } else {
      // Người dùng muốn TẮT 2FA
      setSwitchChecked(false);
      setIsConfirmingDisable(true);
      setDisablePassword("");
      setDisableError(null);
      setTimeout(() => passwordInputRef.current?.focus(), 150);
    }
  };

  // Hủy tắt 2FA
  const handleCancelDisable = () => {
    setIsConfirmingDisable(false);
    setDisablePassword("");
    setDisableError(null);
    setSwitchChecked(is2FAEnabled);
  };

  const isPending =
    sendSetupCodeMutation.isPending ||
    enable2FAMutation.isPending ||
    disable2FAMutation.isPending;

  return (
    <SlideOver
      open={isDrawerOpen}
      onClose={onClose}
      title="Cài đặt xác thực 2 bước (2FA)"
      description="Bảo vệ tài khoản quản trị bằng mã OTP qua tin nhắn SMS khi đăng nhập"
      icon={is2FAEnabled ? ShieldCheck : Shield}
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isPending}
            className="cursor-pointer"
          >
            Đóng
          </Button>

          {is2FAEnabled ? (
            /* Khi 2FA ĐANG BẬT */
            isConfirmingDisable ? (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelDisable}
                  disabled={isPending}
                  className="cursor-pointer"
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDisable2FA()}
                  disabled={isPending || !disablePassword.trim()}
                  className="gap-1.5 cursor-pointer active:scale-[0.98]"
                >
                  {disable2FAMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ShieldOff className="w-3.5 h-3.5" />
                  )}
                  <span>Xác nhận tắt 2FA</span>
                </Button>
              </div>
            ) : null
          ) : (
            /* Khi 2FA ĐANG TẮT */
            setupStep === "phone" ? (
              <Button
                type="button"
                size="sm"
                onClick={() => handleSendSetupCode()}
                disabled={isPending || !phoneNumber.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 cursor-pointer shadow-sm active:scale-[0.98]"
              >
                {sendSetupCodeMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
                <span>Gửi mã xác thực SMS</span>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSetupStep("phone");
                    setOtpError(null);
                  }}
                  disabled={isPending}
                  className="cursor-pointer gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Đổi số</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleVerifySetupCode()}
                  disabled={isPending || setupOtpCode.trim().length < 6}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  {enable2FAMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5" />
                  )}
                  <span>Kích hoạt 2FA ngay</span>
                </Button>
              </div>
            )
          )}
        </div>
      }
    >
      <div className="space-y-5">
        {isLoadingStatus ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2.5">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            <span className="text-xs text-muted-foreground">
              Đang kiểm tra trạng thái bảo mật tài khoản...
            </span>
          </div>
        ) : (
          <>
            {/* 1. THANH TRẠNG THÁI TOGGLE CHÍNH */}
            <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-foreground">
                    Xác thực qua SMS (2FA)
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                      is2FAEnabled
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {is2FAEnabled ? "ĐANG BẬT" : "ĐANG TẮT"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {is2FAEnabled
                    ? "Tài khoản yêu cầu mã OTP SMS mỗi khi đăng nhập vào hệ thống."
                    : "Bật tính năng này để nâng cao bảo mật bằng mã OTP gửi về điện thoại."}
                </p>
              </div>

              <Switch
                id="switch-2fa"
                checked={switchChecked}
                disabled={isPending}
                onCheckedChange={handleSwitchToggle}
                className="cursor-pointer"
              />
            </div>

            {/* 2. CHI TIẾT THEO TRẠNG THÁI */}
            {is2FAEnabled ? (
              /* KHI ĐANG BẬT */
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Lớp bảo vệ 2FA đang hoạt động</span>
                  </div>

                  <p className="text-xs text-emerald-950/80 dark:text-emerald-200/80 leading-relaxed">
                    Số điện thoại nhận mã xác thực OTP khi bạn đăng nhập:
                  </p>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/95 border border-emerald-500/30 text-xs font-mono font-bold text-foreground">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{registeredPhone || "Số điện thoại đã liên kết"}</span>
                  </div>
                </div>

                {/* Ghi chú */}
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border/80 flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-foreground">
                      Cơ chế hoạt động:
                    </span>{" "}
                    Mỗi lần đăng nhập tại trang Login, sau khi nhập mật khẩu, hệ thống sẽ tự động gửi mã OTP 6 số đến số điện thoại trên để xác thực.
                  </div>
                </div>

                {/* Form xác nhận Tắt 2FA */}
                {isConfirmingDisable ? (
                  <form
                    onSubmit={handleDisable2FA}
                    className="p-4 rounded-xl border border-destructive/30 bg-destructive/5 space-y-3 animate-in fade-in duration-200"
                  >
                    <div className="flex items-center gap-2 text-destructive font-semibold text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Xác nhận mật khẩu để TẮT tính năng 2FA</span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Vui lòng nhập mật khẩu tài khoản quản trị để xác nhận tắt lớp bảo vệ 2FA.
                    </p>

                    {disableError && (
                      <p className="text-xs text-destructive flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{disableError}</span>
                      </p>
                    )}

                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-foreground">
                        Mật khẩu tài khoản
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <Input
                          ref={passwordInputRef}
                          type="password"
                          placeholder="Nhập mật khẩu của bạn..."
                          autoFocus
                          value={disablePassword}
                          onChange={(e) => {
                            setDisablePassword(e.target.value);
                            if (disableError) setDisableError(null);
                          }}
                          className="pl-9 text-xs"
                        />
                      </div>
                    </div>
                  </form>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsConfirmingDisable(true);
                      setSwitchChecked(false);
                      setTimeout(() => passwordInputRef.current?.focus(), 150);
                    }}
                    className="w-full h-9 rounded-xl border-destructive/25 text-destructive hover:bg-destructive/10 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-[0.98]"
                  >
                    <ShieldOff className="w-3.5 h-3.5" />
                    <span>Tắt tính năng xác thực 2 bước</span>
                  </Button>
                )}
              </div>
            ) : (
              /* KHI ĐANG TẮT -> LUỒNG 2 BƯỚC ĐỂ BẬT 2FA */
              <div className="space-y-4">
                {setupStep === "phone" ? (
                  /* BƯỚC 1: NHẬP SỐ ĐIỆN THOẠI & GỬI MÃ OTP */
                  <form onSubmit={handleSendSetupCode} className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-2.5 text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                      <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Bước 1 / 2:</span> Nhập số điện thoại để nhận mã OTP SMS kích hoạt tính năng bảo vệ 2 lớp.
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-foreground">
                        Số điện thoại nhận tin nhắn SMS OTP
                      </label>
                      <div className="relative">
                        <Smartphone className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <Input
                          ref={phoneInputRef}
                          type="tel"
                          inputMode="tel"
                          placeholder="Ví dụ: 0901234567 hoặc +84901234567"
                          autoFocus
                          value={phoneNumber}
                          onChange={(e) => {
                            setPhoneNumber(e.target.value);
                            if (phoneError) setPhoneError(null);
                          }}
                          className={`pl-9 text-xs ${
                            phoneError
                              ? "border-destructive focus-visible:ring-destructive/30"
                              : ""
                          }`}
                        />
                      </div>
                      {phoneError ? (
                        <p className="text-destructive text-xs flex items-center gap-1.5 mt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{phoneError}</span>
                        </p>
                      ) : (
                        <p className="text-[11px] text-muted-foreground mt-1">
                          Hệ thống sẽ gửi mã xác thực 6 số qua SMS để kiểm tra số chính chủ.
                        </p>
                      )}
                    </div>
                  </form>
                ) : (
                  /* BƯỚC 2: NHẬP MÃ OTP 6 SỐ ĐỂ CHÍNH THỨC BẬT 2FA */
                  <form
                    onSubmit={handleVerifySetupCode}
                    className="space-y-4 animate-in fade-in duration-200"
                  >
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Bước 2 / 2:</span> Mã xác thực đã được gửi tới số điện thoại{" "}
                        <span className="font-bold underline">{phoneNumber}</span>. Vui lòng nhập mã để hoàn tất kích hoạt.
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-foreground text-center">
                        Nhập mã xác thực OTP (6 chữ số)
                      </label>
                      <div className="max-w-xs mx-auto">
                        <Input
                          ref={otpInputRef}
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="839210"
                          autoFocus
                          value={setupOtpCode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setSetupOtpCode(val);
                            if (otpError) setOtpError(null);
                          }}
                          className="h-11 text-center font-mono text-xl font-bold tracking-[0.35em] text-foreground"
                        />
                      </div>
                      {otpError && (
                        <p className="text-destructive text-xs text-center flex items-center justify-center gap-1.5 mt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{otpError}</span>
                        </p>
                      )}
                    </div>

                    {/* Bộ đếm lùi gửi lại mã */}
                    <div className="text-center">
                      {countdown > 0 ? (
                        <span className="text-xs text-muted-foreground">
                          Gửi lại mã sau{" "}
                          <span className="font-mono font-semibold text-blue-600">
                            {countdown}s
                          </span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendSetupCode()}
                          disabled={sendSetupCodeMutation.isPending}
                          className="text-xs text-blue-600 hover:text-blue-700 underline cursor-pointer inline-flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Gửi lại mã OTP SMS</span>
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </SlideOver>
  );
}

export const TwoFactorSecuritySlideOver = TwoFactorSecurityModal;
export default TwoFactorSecurityModal;
