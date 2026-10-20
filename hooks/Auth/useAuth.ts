import { useEffect, useState } from "react";
import {
  getUserInfo,
  loginApi,
  registerApi,
} from "@/shared/api/auth.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import {
  getUserFromToken,
  UserTokenInfo,
  setAuthTokens,
  clearAuthTokens,
  isSafeRedirectUrl,
  hasAuthSession,
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
      setAuthTokens(data);
      await fetchUser(true);
      const target = isSafeRedirectUrl(callbackUrl) ? callbackUrl : "/admin";
      router.push(target);
      router.refresh();
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
  const queryClient = useQueryClient();

  return async (redirectUrl?: string) => {
    clearUser();
    queryClient.clear();

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("[LOGOUT ERROR]", e);
    }

    const targetUrl =
      redirectUrl &&
      redirectUrl.startsWith("/") &&
      !redirectUrl.startsWith("//")
        ? redirectUrl
        : "/login";

    if (typeof window !== "undefined") {
      window.location.href = targetUrl;
    }
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
 * Hook đọc Role và thông tin tài khoản kết hợp từ Zustand store (api/auth/me) và JWT/Cache Token
 */
export const useRole = () => {
  const { user, fetchUser, isLoading } = useAuthStore();
  const [tokenUser, setTokenUser] = useState<UserTokenInfo | null>(null);

  useEffect(() => {
    const tUser = getUserFromToken();
    setTokenUser(tUser);

    // Tự động gọi API /api/auth/me nếu chưa có dữ liệu user trong Zustand nhưng còn phiên đăng nhập
    if (!user && hasAuthSession()) {
      fetchUser();
    }
  }, [user, fetchUser]);

  // Ưu tiên thông tin chi tiết từ user trong Zustand, fallback tokenUser
  const currentUser = user ?? tokenUser;
  const roles = user?.roles ?? tokenUser?.roles ?? [];
  const role = roles.length > 0 ? roles[0] : null;
  const isAdmin = roles.some((r) =>
    ["admin", "adminaccess", "administrator", "quan tri vien"].includes(
      r.toLowerCase(),
    ),
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
