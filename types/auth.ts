export interface UserProfile {
  id: string;
  username: string;
  email: string;
  roles: string[];
  fullName: string | null;
  phoneNumber: string | null;
  avatarUrl: string | null;
  isTwoFactorEnabled?: boolean;
  twoFactorEnabled?: boolean;
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
  isTwoFactorEnabled?: boolean;
  twoFactorEnabled?: boolean;
}

// 2FA Types
export interface TwoFactorLoginPayload {
  twoFactorToken: string;
  code: string;
}

export interface SendLoginCodePayload {
  twoFactorToken: string;
}

export interface SendSetupCodePayload {
  phoneNumber: string;
}

export interface Enable2FAPayload {
  code?: string;
  phoneNumber?: string;
}

export interface Disable2FAPayload {
  password: string;
}

export interface TwoFactorStatusResponse {
  isTwoFactorEnabled: boolean;
  twoFactorEnabled?: boolean;
  phoneNumber?: string | null;
}

export interface AuthLoginResponse {
  success?: boolean;
  requiresTwoFactor?: boolean;
  requires2FA?: boolean;
  twoFactorToken?: string;
  phoneNumber?: string;
  message?: string;
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  token_type?: string;
  errors?: Record<string, string[] | string>;
}

