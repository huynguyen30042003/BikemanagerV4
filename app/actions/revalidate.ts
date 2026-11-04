"use server";

import { revalidateTag } from "next/cache";

/**
 * Server Action xóa cache theo Tag (dự phòng cho các trang Public ISR hoặc HMR chunk)
 */
export async function revalidateTagAction(tag: string = "default") {
  try {
    revalidateTag(tag, "default");
    return { success: true, tag };
  } catch {
    return { success: false };
  }
}

