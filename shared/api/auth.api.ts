import { APP_URL } from "../constants/apiConstants";
import api from "./index";
import { getAccessToken, logoutFromBackend } from "@/lib/auth";
import {
  UserProfile,
  AuthLoginResponse,
} from "@/types/auth";

export interface LoginPayload {
  username: string;
  password: string;
  remember?: boolean;
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
 * Đăng nhập trực tiếp vào Backend API (${APP_URL}/auth/login)
 */
export const loginApi = async (data: LoginPayload): Promise<AuthLoginResponse> => {
  const response = await api.post<AuthLoginResponse>(
    `${APP_URL}/auth/login`,
    {
      username: data.username,
      password: data.password,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
};

export const logoutApi = async (): Promise<void> => {
  await logoutFromBackend();
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

/**
 * Lấy thông tin user trực tiếp từ Backend API (${APP_URL}/auth/me)
 */
export const getUserInfo = async (): Promise<UserProfile> => {
  const token = getAccessToken();
  const response = await api.get<UserProfile>(`${APP_URL}/auth/me`, {
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
