import axios from "axios";
import { APP_URL } from "../constants/apiConstants";
import api from "./index";
import { getAccessToken } from "@/lib/auth";
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
  Fullname: string
  Username: string;
  Email: string;
  Password: string;
}
export interface RegisterResponse {
  message: string;
}

export const loginApi = async (data: {
  username: string;
  password: string;
}) => {
  const response = await axios.post("/api/auth/login", data);
  return response.data;
};

export const registerApi = async (payload: RegisterPayload) => {
  const body = {
    fullname: payload.Fullname,
    username: payload.Username,
    email: payload.Email,
    password: payload.Password,
  };
  const response = await api.post<LoginResponse>(
    `${APP_URL}/auth/register`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

import { UserProfile } from "@/types/auth";

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

