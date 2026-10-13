"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { useRegister } from "@/hooks/Auth/useAuth";

const registerValidate = z
  .object({
    fullname: z
      .string()
      .min(
        6,
        "Username phải hơn 6 ký tự"
      ),
    username: z
      .string()
      .min(
        6,
        "Username phải hơn 6 ký tự"
      )
      .regex(
        /^[a-zA-Z0-9]+$/,
        "Không được chứa ký tự đặc biệt"
      ),

    email: z
      .string()
      .email(
        "Email không hợp lệ"
      ),

    password: z
      .string()
      .min(
        8,
        "Password phải hơn 8 ký tự"
      )
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

    confirmPassword: z
      .string(),
  })
  .refine(
    data =>
      data.password ===
      data.confirmPassword,
    {
      message:
        "Passwords do not match",

      path: [
        "confirmPassword",
      ],
    }
  );

type RegisterForm =
  z.infer<
    typeof registerValidate
  >;

export default function RegisterPage() {
  const router = useRouter();

  const registerMutation =
    useRegister();

  const {
    register,

    handleSubmit,

    setError,

    formState: {
      errors,
      isSubmitting,
    },
  } =
    useForm<RegisterForm>({
      resolver:
        zodResolver(
          registerValidate
        ),
    });

  const handleRegister =
    async (
      req: RegisterForm
    ) => {
      try {
        await registerMutation.mutateAsync(
          {
            Fullname:
              req.fullname,
            Username:
              req.username,

            Email:
              req.email,

            Password:
              req.password,
          }
        );

        router.push(
          "/login"
        );
      } catch (err: any) {
        const data =
          err?.response?.data;

        if (data?.errors) {
          Object.entries(
            data.errors
          ).forEach(
            ([
              key,
              value,
            ]: any) => {
              setError(
                key.toLowerCase() as
                  | "username"
                  | "email"
                  | "password",
                {
                  message:
                    value[0],
                }
              );
            }
          );

          return;
        }

        setError("root", {
          message:
            data?.message ||
            "Register failed",
        });
      }
    };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Sign Up
          </h1>

          <p className="text-gray-600 text-sm mt-2">
            Create a new
            account to get
            started
          </p>
        </div>

        <form
          onSubmit={handleSubmit(
            handleRegister
          )}
          className="space-y-5"
        >

          {/* FullName */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fullname
            </label>

            <input
              type="text"
              placeholder="Choose a username"
              {...register(
                "fullname"
              )}
              disabled={
                isSubmitting
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
            />

            {errors.fullname && (
              <p className="text-red-600 text-xs mt-1">
                {
                  errors
                    .fullname
                    .message
                }
              </p>
            )}
          </div>
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>

            <input
              type="text"
              placeholder="Choose a username"
              {...register(
                "username"
              )}
              disabled={
                isSubmitting
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
            />

            {errors.username && (
              <p className="text-red-600 text-xs mt-1">
                {
                  errors
                    .username
                    .message
                }
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              {...register(
                "email"
              )}
              disabled={
                isSubmitting
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
            />

            {errors.email && (
              <p className="text-red-600 text-xs mt-1">
                {
                  errors.email
                    .message
                }
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              {...register(
                "password"
              )}
              disabled={
                isSubmitting
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
            />

            {errors.password && (
              <p className="text-red-600 text-xs mt-1">
                {
                  errors
                    .password
                    .message
                }
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm your password"
              {...register(
                "confirmPassword"
              )}
              disabled={
                isSubmitting
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
            />

            {errors.confirmPassword && (
              <p className="text-red-600 text-xs mt-1">
                {
                  errors
                    .confirmPassword
                    .message
                }
              </p>
            )}
          </div>

          {/* Server Error */}
          {errors.root && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
              {
                errors.root
                  .message
              }
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={
              isSubmitting
            }
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {isSubmitting
              ? "Creating Account..."
              : "Sign Up"}
          </button>
        </form>

        {/* Login */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an
          account?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}