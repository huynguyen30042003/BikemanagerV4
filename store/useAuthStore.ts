import { getUserInfo } from "@/shared/api/auth.api";
import { UserProfile } from "@/types/auth";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: UserProfile | null) => void;
  fetchUser: () => Promise<UserProfile | null>;
  clearUser: () => void;

  // Role Helpers
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, error: null }),

      clearUser: () => {
        set({ user: null, error: null, isLoading: false });
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("expires_at");
        }
      },

      fetchUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await getUserInfo();
          set({ user, isLoading: false, error: null });
          return user;
        } catch (error: any) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Lỗi khi lấy thông tin người dùng";
          set({ error: message, isLoading: false });
          return null;
        }
      },

      hasRole: (targetRole: string) => {
        const roles = get().user?.roles || [];
        return roles.some(
          (r) => r.toLowerCase() === targetRole.toLowerCase()
        );
      },

      isAdmin: () => {
        const roles = get().user?.roles || [];
        return roles.some((r) =>
          [
            "admin",
            "adminaccess",
            "administrator",
            "quan tri vien",
          ].includes(r.toLowerCase())
        );
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
