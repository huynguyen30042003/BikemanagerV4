export const APP_URL = process.env.NEXT_PUBLIC_API_URL;
export const BE_URL = process.env.APP_URL;
export const CLIENT_ID = process.env.ORCHARD_CLIENT_ID;
export const CLIENT_SECRET = process.env.ORCHARD_CLIENT_SECRET;
export const EXPIRED_TOKEN = 100210;

export const TOKEN_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER_INFO: "userInfo",
} as const;
