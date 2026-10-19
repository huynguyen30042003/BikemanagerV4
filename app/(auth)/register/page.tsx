import { redirect } from "next/navigation";

/**
 * Chức năng đăng ký tài khoản tự do đã được tắt theo yêu cầu bảo mật hệ thống.
 * Chuyển hướng người dùng về trang đăng nhập.
 */
export default function RegisterPage() {
  redirect("/login");
}