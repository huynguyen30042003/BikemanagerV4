import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-background overflow-hidden p-4">
      {/* Ambient background glow decoration */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-3xl pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative z-10 w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;