export const APP_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:5001/api";

export const BE_URL =
  process.env.APP_URL ||
  (APP_URL ? APP_URL.replace(/\/api\/?$/, "") : "https://localhost:5001");

export const takeImage = (
  path: string,
  type?: 480 | 768 | 1280 | null,
  maxSize?: number | null,
): string => {
  if (!path?.trim()) return "";

  const baseUrl = BE_URL.replace(/\/+$/, "");
  const cleanPath = path.trim().startsWith("/")
    ? path.trim()
    : `/${path.trim()}`;

  // Nếu có maxSize và maxSize <= 0 hoặc type yêu cầu vượt quá maxSize khả dụng
  let resolvedType: number | null = type ?? null;
  if (maxSize !== undefined && maxSize !== null) {
    if (maxSize <= 0) {
      resolvedType = null;
    } else if (resolvedType != null && resolvedType > maxSize) {
      resolvedType = maxSize >= 480 ? 480 : null;
    }
  }

  // Không truyền type hoặc type null / <= 0 thì sử dụng ảnh gốc mặc định
  if (resolvedType == null || resolvedType <= 0) {
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
    `${cleanPath.slice(0, lastDotIndex)}_${resolvedType}` +
    cleanPath.slice(lastDotIndex);

  return `${baseUrl}${sizedPath}`;
};
