import type { Metadata } from "next";
import { ReactNode } from "react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://store.nhithoi.io.vn";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cửa hàng xe đạp Nhi Thời - Đăng nhập",
    template: "%s | Cửa hàng xe đạp Nhi Thời",
  },
  description: "Trang quản trị & đăng nhập hệ thống Cửa hàng xe đạp Nhi Thời",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: `${siteUrl}/login`,
    siteName: "Cửa hàng xe đạp Nhi Thời",
    title: "Cửa hàng xe đạp Nhi Thời - Hệ thống Quản trị & Bán hàng",
    description: "Trang quản trị & vận hành hệ thống Cửa hàng xe đạp Nhi Thời",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Logo Cửa hàng xe đạp Nhi Thời",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cửa hàng xe đạp Nhi Thời - Hệ thống Quản trị & Bán hàng",
    description: "Trang quản trị & vận hành hệ thống Cửa hàng xe đạp Nhi Thời",
    images: ["/og-image.png"],
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-[100dvh] w-full relative flex items-center justify-center bg-background text-foreground antialiased selection:bg-blue-600 selection:text-white">
      {/* Subtle engineering grid background */}
      <div className="fixed inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] opacity-45 pointer-events-none" />

      <main className="relative z-10 w-full flex items-center justify-center">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
