import axios from "axios";
import { APP_URL } from "../constants/apiConstants";
import api from "./index";
import { getAccessToken } from "@/lib/auth";
import {
  UserProfile,
  AuthLoginResponse,
  TwoFactorLoginPayload,
  SendLoginCodePayload,
  SendSetupCodePayload,
  Enable2FAPayload,
  Disable2FAPayload,
  TwoFactorStatusResponse,
} from "@/types/auth";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface RegisterPayload {
  Fullname: string;
  Username: string;
  Email: string;
  Password: string;
}
export interface RegisterResponse {
  message: string;
}

/**
 * Đăng nhập hệ thống (BFF proxy -> Next.js Route Handler để thiết lập Cookie an toàn)
 * Nếu chưa bật 2FA -> trả về access_token
 * Nếu đã bật 2FA -> trả về requiresTwoFactor: true & twoFactorToken
 */
export const loginApi = async (data: LoginPayload): Promise<AuthLoginResponse> => {
  const response = await axios.post<AuthLoginResponse>("/api/auth/login", data);
  return response.data;
};

/**
 * Đăng nhập bước 2 bằng mã OTP gửi qua SMS
 */
export const login2FAApi = async (
  payload: TwoFactorLoginPayload
): Promise<AuthLoginResponse> => {
  const response = await axios.post<AuthLoginResponse>("/api/auth/login-2fa", payload);
  return response.data;
};

/**
 * Gửi lại mã OTP SMS trong phiên đăng nhập 2FA
 */
export const sendLoginCodeApi = async (
  payload: SendLoginCodePayload
): Promise<{ message?: string; success?: boolean }> => {
  const response = await axios.post<{ message?: string; success?: boolean }>(
    "/api/auth/2fa/send-login-code",
    payload
  );
  return response.data;
};

/**
 * Lấy trạng thái xác thực 2 bước (2FA) của tài khoản hiện tại
 */
export const get2FAStatusApi = async (): Promise<TwoFactorStatusResponse> => {
  const token = getAccessToken();
  const response = await axios.get<TwoFactorStatusResponse>("/api/auth/2fa/status", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    withCredentials: true,
  });
  return response.data;
};

/**
 * Gửi mã OTP SMS để kích hoạt tính năng 2FA (yêu cầu Token đăng nhập)
 */
export const sendSetupCodeApi = async (
  payload: SendSetupCodePayload
): Promise<{ message?: string; success?: boolean }> => {
  const token = getAccessToken();
  const response = await axios.post<{ message?: string; success?: boolean }>(
    "/api/auth/2fa/send-setup-code",
    payload,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true,
    }
  );
  return response.data;
};

/**
 * Xác thực mã OTP và chính thức Bật xác thực 2 bước qua SMS (yêu cầu Token đăng nhập)
 */
export const enable2FAApi = async (
  payload: Enable2FAPayload
): Promise<{ message?: string; success?: boolean }> => {
  const token = getAccessToken();
  const response = await axios.post<{ message?: string; success?: boolean }>(
    "/api/auth/2fa/enable",
    payload,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true,
    }
  );
  return response.data;
};

/**
 * Tắt tính năng xác thực 2 bước (yêu cầu mật khẩu xác nhận)
 */
export const disable2FAApi = async (
  payload: Disable2FAPayload
): Promise<{ message?: string; success?: boolean }> => {
  const token = getAccessToken();
  const response = await axios.post<{ message?: string; success?: boolean }>(
    "/api/auth/2fa/disable",
    payload,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true,
    }
  );
  return response.data;
};

export const registerApi = async (payload: RegisterPayload) => {
  const body = {
    fullname: payload.Fullname,
    username: payload.Username,
    email: payload.Email,
    password: payload.Password,
  };
  const response = await api.post<LoginResponse>(`${APP_URL}/auth/register`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const getUserInfo = async (): Promise<UserProfile> => {
  const token = getAccessToken();
  const response = await axios.get<UserProfile>("/api/auth/me", {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
    withCredentials: true,
  });
  return response.data;
};

export const getMeApi = getUserInfo;
