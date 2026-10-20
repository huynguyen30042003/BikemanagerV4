export interface UserProfile {
  id: string;
  username: string;
  email: string;
  roles: string[];
  fullName: string | null;
  phoneNumber: string | null;
  avatarUrl: string | null;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  phone: string;
  fullName: string;
  address: string;
  avatarUrl: string | null;
  dateOfBirth: string | null;
  gender: "nam" | "nữ" | "khác" | null;
  provinceId: string | null;
  districtId: string | null;
  wardId: string | null;
  roleName: string;
  permissions: string[];
}

export interface AuthLoginResponse {
  success?: boolean;
  message?: string;
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  token_type?: string;
  errors?: Record<string, string[] | string>;
}
