
export const APP_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:5001/api";

export const BE_URL =
  process.env.APP_URL ||
  (APP_URL ? APP_URL.replace(/\/api\/?$/, "") : "https://localhost:5001");

export const takeImage = (
  path: string,
  type?: 480 | 768 | 1280 | null
): string => {
  if (!path?.trim()) return "";

  const baseUrl = BE_URL.replace(/\/+$/, "");
  const cleanPath = path.trim().startsWith("/")
    ? path.trim()
    : `/${path.trim()}`;

  // Không truyền type thì sử dụng ảnh mặc định
  if (type == null) {
    return `${baseUrl}${cleanPath}`;
  }

  // Chèn kích thước vào trước phần mở rộng:
  // abc.webp -> abc_480.webp
  const lastDotIndex = cleanPath.lastIndexOf(".");
  const lastSlashIndex = cleanPath.lastIndexOf("/");

  if (lastDotIndex <= lastSlashIndex) {
    return `${baseUrl}${cleanPath}`;
  }

  const sizedPath =
    `${cleanPath.slice(0, lastDotIndex)}_${type}` +
    cleanPath.slice(lastDotIndex);

  return `${baseUrl}${sizedPath}`;
};
