"use server";

import { revalidateTag, updateTag } from "next/cache";

/**
 * Server Action xóa cache theo Tag trong Next.js Data Cache (On-Demand Revalidation)
 * Cho phép gọi trực tiếp từ Client Component sau khi Thêm / Sửa / Xóa thành công
 */
export async function revalidateTagAction(tag: string = "danh-muc-chi-tiet") {
  try {
    updateTag(tag);
    revalidateTag(tag, "default");
    return { success: true, tag };
  } catch (error) {
    console.error("[Server Action] Lỗi khi revalidate tag:", tag, error);
    return { success: false, error: String(error) };
  }
}
