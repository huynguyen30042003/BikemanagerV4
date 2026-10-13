"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full rounded-2xl border border-border/80 bg-card p-8 shadow-xl text-center space-y-6">
        {/* Icon 404 */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-xs animate-pulse">
            <Compass className="w-8 h-8" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            HTTP 404 Not Found
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground pt-1">
            Trang không tồn tại
          </h1>
          <p className="text-sm text-muted-foreground">
            Đường dẫn bạn yêu cầu không tồn tại, đã bị xóa hoặc đã được chuyển sang địa chỉ khác.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:flex-1 h-10 px-4 rounded-xl border border-border/80 text-foreground hover:bg-muted font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại</span>
          </button>

          <Link
            href="/admin"
            className="w-full sm:flex-1 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Trang quản trị</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
