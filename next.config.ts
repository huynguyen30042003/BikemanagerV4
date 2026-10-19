/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
        port: "5001",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "api.nhithoi.io.vn",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "**.nhithoi.io.vn",
        pathname: "/**",
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
  experimental: {
    authInterrupts: true,
  },
  reactStrictMode: true
};

export default nextConfig;
