import { getUserInfo } from "@/shared/api/auth.api";
import { UserProfile } from "@/types/auth";
import { getAccessToken, clearAuthTokens } from "@/lib/auth";
import { create } from "zustand";

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: UserProfile | null) => void;
  fetchUser: (force?: boolean) => Promise<UserProfile | null>;
  clearUser: () => void;

  // Role Helpers
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
}

// Biến lưu Promise đang thực thi (in-flight request) để deduplicate (chống gọi trùng lặp song song)
let inFlightFetchUserPromise: Promise<UserProfile | null> | null = null;

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, error: null }),

  clearUser: () => {
    inFlightFetchUserPromise = null;
    set({ user: null, error: null, isLoading: false });
    clearAuthTokens();
  },

  fetchUser: async (force = false) => {
    // 1. Nếu không có token đăng nhập trong Cookie thì bỏ qua, không gọi API /api/auth/me
    const token = getAccessToken();
    if (!token) {
      set({ user: null, isLoading: false });
      return null;
    }

    // 2. Nếu đã có dữ liệu user trong store và không yêu cầu ép buộc (force refresh), tái sử dụng ngay
    const currentUser = get().user;
    if (currentUser && !force) {
      return currentUser;
    }

    // 3. Nếu đang có một request fetchUser đang chạy song song (in-flight), chia sẻ chung Promise đó
    if (inFlightFetchUserPromise) {
      return inFlightFetchUserPromise;
    }

    // 4. Bắt đầu request duy nhất
    set({ isLoading: true, error: null });
    inFlightFetchUserPromise = (async () => {
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
      } finally {
        inFlightFetchUserPromise = null;
      }
    })();

    return inFlightFetchUserPromise;
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
}));
