import { APP_URL } from "@/shared/constants/apiConstants";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          `${APP_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;