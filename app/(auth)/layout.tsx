import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "Đăng nhập hệ thống",
    template: "%s | Quản trị Bike Manager",
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
