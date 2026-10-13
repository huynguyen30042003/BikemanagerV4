import { useEffect, useState } from "react";
import { getUserInfo, loginApi, registerApi } from "@/shared/api/auth.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import {
  getUserFromToken,
  getUserRoles,
  getUserRole,
  hasRole,
  UserTokenInfo,
} from "@/lib/auth";

export * from "@/lib/auth";
export { useAuthStore } from "@/store/useAuthStore";

export const useLogin = (callbackUrl?: string) => {
  const router = useRouter();
  const { fetchUser } = useAuthStore();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: async (data: any) => {
      if (data?.access_token) {
        localStorage.setItem("access_token", data.access_token);
      }
      if (data?.expires_in) {
        localStorage.setItem(
          "expires_at",
          (Math.floor(Date.now() / 1000) + data.expires_in).toString()
        );
      }
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

export const useRegister = () => {
  return useMutation({
    mutationFn: registerApi,
  });
};

export const useLogout = () => {
  const { clearUser } = useAuthStore();

  return async (redirectUrl?: string) => {
    clearUser();
    localStorage.removeItem("access_token");
    localStorage.removeItem("expires_at");
    document.cookie = "access_token=; Max-Age=0; path=/";
    document.cookie = "refresh_token=; Max-Age=0; path=/";
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
