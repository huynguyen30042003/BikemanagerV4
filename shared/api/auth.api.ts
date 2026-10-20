import axios from "axios";
import { APP_URL } from "../constants/apiConstants";
import api from "./index";
import { getAccessToken, setAuthTokens } from "@/lib/auth";
import {
  UserProfile,
  AuthLoginResponse,
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
 */
export const loginApi = async (data: LoginPayload): Promise<AuthLoginResponse> => {
  const response = await axios.post<AuthLoginResponse>("/api/auth/login", data);
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

  // Đồng bộ lại Cookie nếu Route Handler /api/auth/me vừa tự động refresh token
  const refreshedAccessToken = response.headers["x-access-token"];
  if (typeof refreshedAccessToken === "string" && refreshedAccessToken) {
    const refreshedExpiresIn = Number(response.headers["x-expires-in"] || 3600);
    setAuthTokens({
      access_token: refreshedAccessToken,
      expires_in: refreshedExpiresIn,
    });
  }

  return response.data;
};

export const getMeApi = getUserInfo;
