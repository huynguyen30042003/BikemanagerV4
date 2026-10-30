import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import Providers from "./providers";
import { Toaster } from "sonner";
import PwaRegistrar from "@/components/Common/PwaRegistrar";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "vietnamese"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://store.nhithoi.io.vn";

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cửa hàng xe đạp Nhi Thời - Bike Manager V4",
    template: "%s | Cửa hàng xe đạp Nhi Thời",
  },
  description: "Trang quản lí cửa hàng xe đạp Nhi Thời",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Bike Manager",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/icons/icon-192x192.png",
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteUrl,
    siteName: "Cửa hàng xe đạp Nhi Thời",
    title: "Cửa hàng xe đạp Nhi Thời - Bike Manager V4",
    description: "Trang quản lí cửa hàng xe đạp Nhi Thời",
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
    title: "Cửa hàng xe đạp Nhi Thời - Bike Manager V4",
    description: "Trang quản lí cửa hàng xe đạp Nhi Thời",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${roboto.variable} h-full antialiased`}>
      <body className="font-roboto">
        {/* <Providers> */}
        <QueryProvider>{children}</QueryProvider>
        {/* </Providers> */}
        <Toaster />
        <PwaRegistrar />
      </body>
    </html>
  );
}
