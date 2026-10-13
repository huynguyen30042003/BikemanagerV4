"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/useAuthStore";
import { LogIn } from "lucide-react";

const loginValidate = z.object({
  username: z
    .string()
    .min(1, "Username phải hơn 6 ký tự")
    .regex(
      /^[a-zA-Z0-9]+$/,
      "Không được chứa ký tự đặc biệt"
    ),

  password: z
    .string()
    .min(8, "Password phải hơn 8 ký tự")
    .regex(
      /[A-Z]/,
      "Phải có chữ hoa"
    )
    .regex(
      /[0-9]/,
      "Phải có số"
    )
    .regex(
      /[\W_]/,
      "Phải có ký tự đặc biệt"
    ),
});

type LoginForm = z.infer<typeof loginValidate>;

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Đọc callbackUrl hoặc from hoặc redirect từ URL
  const rawCallbackUrl =
    searchParams.get("callbackUrl") ||
    searchParams.get("from") ||
    searchParams.get("redirect") ||
    "/admin";

  // Bảo vệ redirect: chỉ cho phép đường dẫn nội bộ (bắt đầu bằng "/" và không phải "//" hoặc "/login")
  const targetRedirectUrl =
    rawCallbackUrl.startsWith("/") &&
    !rawCallbackUrl.startsWith("//") &&
    !rawCallbackUrl.startsWith("/login")
      ? rawCallbackUrl
      : "/admin";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginValidate),
  });

  const handleLogin = async (req: LoginForm) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username: req.username,
        password: req.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.errors) {
        Object.entries(data.errors).forEach(([key, value]: any) => {
          setError(
            key.toLowerCase() as "username" | "password",
            {
              message: value[0],
            }
          );
        });
        return;
      }

      setError("root", {
        message: data.message || "Login failed",
      });
      return;
    }

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem(
      "expires_at",
      (Math.floor(Date.now() / 1000) + data.expires_in).toString()
    );

    // Lưu thông tin người dùng vào Zustand store qua api/auth/me
    try {
      await useAuthStore.getState().fetchUser();
    } catch (err) {
      console.error("[Login fetchUser error]", err);
    }

    // Chuyển hướng về lại đường dẫn cũ trước đó
    router.push(targetRedirectUrl);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Login</h1>
          <p className="text-gray-600 text-sm mt-2">Login to continue</p>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              {...register("username")}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
            />
            {errors.username && (
              <p className="text-red-600 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              {...register("password")}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
            />
            {errors.password && (
              <p className="text-red-600 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Error */}
          {errors.root && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
              {errors.root.message}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center p-4">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}