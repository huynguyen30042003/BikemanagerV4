import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import Providers from "./providers";
import { Toaster } from "sonner";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "vietnamese"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://store.nhithoi.io.vn";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cửa hàng xe đạp Nhi Thời - Bike Manager V4",
    template: "%s | Cửa hàng xe đạp Nhi Thời",
  },
  description: "Trang quản lí cửa hàng xe đạp Nhi Thời",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
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
        url: "/logo.png",
        width: 1060,
        height: 937,
        alt: "Logo Cửa hàng xe đạp Nhi Thời",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cửa hàng xe đạp Nhi Thời - Bike Manager V4",
    description: "Trang quản lí cửa hàng xe đạp Nhi Thời",
    images: ["/logo.png"],
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
      </body>
    </html>
  );
}
