import { useEffect, useState } from "react";
import {
  getUserInfo,
  loginApi,
  login2FAApi,
  sendLoginCodeApi,
  get2FAStatusApi,
  sendSetupCodeApi,
  enable2FAApi,
  disable2FAApi,
  registerApi,
} from "@/shared/api/auth.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import {
  getUserFromToken,
  getUserRoles,
  getUserRole,
  hasRole,
  UserTokenInfo,
  setAuthTokens,
  clearAuthTokens,
} from "@/lib/auth";
import { AuthLoginResponse } from "@/types/auth";

export * from "@/lib/auth";
export { useAuthStore } from "@/store/useAuthStore";

export const useLogin = (callbackUrl?: string) => {
  const router = useRouter();
  const { fetchUser } = useAuthStore();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: async (data: AuthLoginResponse) => {
      // Nếu yêu cầu xác thực 2 bước (2FA), không setAuthTokens và không redirect
      if (data.requiresTwoFactor || data.requires2FA || (!data.access_token && data.twoFactorToken)) {
        return;
      }

      setAuthTokens(data);
      await fetchUser();
      const target =
        callbackUrl &&
        callbackUrl.startsWith("/") &&
        !callbackUrl.startsWith("/login")
          ? callbackUrl
          : "/admin";
      router.push(target);
    },
  });
};

/**
 * Mutation hook đăng nhập bước 2 bằng mã OTP qua SMS
 */
export const useLogin2FA = (callbackUrl?: string) => {
  const router = useRouter();
  const { fetchUser } = useAuthStore();

  return useMutation({
    mutationFn: login2FAApi,
    onSuccess: async (data: AuthLoginResponse) => {
      setAuthTokens(data);
      await fetchUser();
      const target =
        callbackUrl &&
        callbackUrl.startsWith("/") &&
        !callbackUrl.startsWith("/login")
          ? callbackUrl
          : "/admin";
      router.push(target);
    },
  });
};

/**
 * Mutation hook gửi lại mã OTP trong phiên đăng nhập 2FA
 */
export const useSendLoginCode = () => {
  return useMutation({
    mutationFn: sendLoginCodeApi,
  });
};

/**
 * Query hook kiểm tra trạng thái 2FA của tài khoản hiện tại
 */
export const use2FAStatus = () => {
  return useQuery({
    queryKey: ["auth", "2fa", "status"],
    queryFn: get2FAStatusApi,
    retry: false,
    staleTime: 1000 * 60 * 3, // 3 phút
  });
};

/**
 * Mutation hook gửi mã OTP để thiết lập bật 2FA
 */
export const useSendSetupCode = () => {
  return useMutation({
    mutationFn: sendSetupCodeApi,
  });
};

/**
 * Mutation hook xác thực mã OTP và kích hoạt 2FA
 */
export const useEnable2FA = () => {
  const queryClient = useQueryClient();
  const { fetchUser } = useAuthStore();

  return useMutation({
    mutationFn: enable2FAApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "2fa", "status"] });
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      await fetchUser();
    },
  });
};

/**
 * Mutation hook tắt tính năng 2FA bằng mật khẩu
 */
export const useDisable2FA = () => {
  const queryClient = useQueryClient();
  const { fetchUser } = useAuthStore();

  return useMutation({
    mutationFn: disable2FAApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "2fa", "status"] });
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      await fetchUser();
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: registerApi,
  });
};

export const useLogout = () => {
  const { clearUser } = useAuthStore();

  return async (redirectUrl?: string) => {
    clearUser();
    clearAuthTokens();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("[LOGOUT ERROR]", e);
    }
    window.location.href = redirectUrl || "/login";
  };
};

export const useMe = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const data = await getUserInfo();
      setUser(data);
      return data;
    },
    retry: false,
  });
};

/**
 * Hook đọc Role và thông tin tài khoản kết hợp từ Zustand store (api/auth/me) và JWT Token
 */
export const useRole = () => {
  const { user, fetchUser, isLoading } = useAuthStore();
  const [tokenUser, setTokenUser] = useState<UserTokenInfo | null>(null);

  useEffect(() => {
    const tUser = getUserFromToken();
    setTokenUser(tUser);

    // Tự động gọi API /api/auth/me nếu chưa có dữ liệu user trong Zustand
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  // Ưu tiên thông tin chi tiết từ user trong Zustand, fallback tokenUser
  const currentUser = user || tokenUser;
  const roles = user?.roles ?? tokenUser?.roles ?? [];
  const role = roles.length > 0 ? roles[0] : null;
  const isAdmin = roles.some((r) =>
    ["admin", "adminaccess", "administrator", "quan tri vien"].includes(
      r.toLowerCase()
    )
  );

  return {
    user: currentUser,
    role,
    roles,
    isAdmin,
    isLoading: isLoading && !currentUser,
    hasRole: (targetRole: string) =>
      roles.some((r) => r.toLowerCase() === targetRole.toLowerCase()),
    refetchUser: fetchUser,
  };
};
