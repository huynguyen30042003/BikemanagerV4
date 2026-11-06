/**
 * Danh sách toàn bộ các vai trò nhân viên / quản trị viên hợp lệ của hệ thống
 */
export const ALL_STAFF_ROLES = [
  "Administrator",
  "AdminAccess",
  "SaleAccess",
  "ProductAccess",
  "OrderAccess",
  "PurchaseAccess",
  "WarehouseAccess",
  "TechnicalAccess",
];

/**
 * Cấu hình phân quyền truy cập cho từng đường dẫn (Route Permissions)
 * Khóa là tiền tố đường dẫn, giá trị là mảng các vai trò được phép truy cập.
 */
export const ROUTE_PERMISSIONS: Record<string, string[]> = {
  // Trang chủ quản trị (Dashboard tổng quan) - Yêu cầu bất kỳ vai trò nhân viên hợp lệ nào
  "/admin": ALL_STAFF_ROLES,

  // 1. Hệ thống (Chỉ Administrator / AdminAccess)
  "/admin/danhMucChung": ["Administrator"],
  "/admin/danhMucChiTiet": ["Administrator"],
  "/admin/quocGia": ["Administrator", "AdminAccess"],
  "/admin/diaPhuongCapTinh": ["Administrator", "AdminAccess"],
  "/admin/diaPhuongCapXa": ["Administrator", "AdminAccess"],
  "/admin/diaDiem": ["Administrator", "AdminAccess"],

  // 2. Kinh doanh
  "/admin/customer": ["Administrator", "AdminAccess", "SaleAccess"],
  "/admin/brands": ["Administrator", "AdminAccess", "ProductAccess"],
  "/admin/products": ["Administrator", "AdminAccess", "ProductAccess"],
  "/admin/product-variants": ["Administrator", "AdminAccess", "ProductAccess"],
  "/admin/product-images": ["Administrator", "AdminAccess", "ProductAccess"],
  "/admin/product-serials": ["Administrator", "AdminAccess", "ProductAccess"],
  "/admin/orders": [
    "Administrator",
    "AdminAccess",
    "OrderAccess",
    "SaleAccess",
  ],
  "/admin/sales": ["Administrator", "AdminAccess", "SaleAccess"],

  // 3. Vận hành & Kho
  "/admin/installment-providers": ["Administrator", "AdminAccess"],
  "/admin/installment-contracts": ["Administrator", "AdminAccess"],
  "/admin/suppliers": ["Administrator", "AdminAccess", "PurchaseAccess"],
  "/admin/purchase-orders": ["Administrator", "AdminAccess", "PurchaseAccess"],
  "/admin/warehouses": ["Administrator", "AdminAccess", "WarehouseAccess"],
  "/admin/inventory": ["Administrator", "AdminAccess", "WarehouseAccess"],
  "/admin/opening-stock": ["Administrator", "AdminAccess", "WarehouseAccess"],
  "/admin/stock-transfers": ["Administrator", "AdminAccess", "WarehouseAccess"],
  "/admin/stock-audits": ["Administrator", "AdminAccess", "WarehouseAccess"],

  // 4. Kỹ thuật & Bảo hành
  "/admin/warranties": [
    "Administrator",
    "AdminAccess",
    "TechnicalAccess",
    "SaleAccess",
  ],
  "/admin/warranty-claims": ["Administrator", "AdminAccess", "TechnicalAccess"],
  "/admin/repair-tickets": ["Administrator", "AdminAccess", "TechnicalAccess"],
  "/admin/repair-services": ["Administrator", "AdminAccess", "TechnicalAccess"],
};

/**
 * Tìm các quyền yêu cầu cho một pathname cụ thể.
 * Áp dụng chuẩn hóa URL và nguyên tắc Phòng thủ chiều sâu (Default Deny).
 */
export function getRequiredRolesForPath(pathname: string): string[] | null {
  if (!pathname) return null;

  // 1. Chuẩn hóa path: bỏ duplicate slashes và trailing slash (chống bypass qua /admin//products hoặc /admin/products/)
  const cleanPath = pathname.replace(/\/+/g, "/").replace(/\/+$/, "") || "/";
  const lowerPath = cleanPath.toLowerCase();

  // 2. Khớp chính xác (không phân biệt hoa thường)
  const exactKey = Object.keys(ROUTE_PERMISSIONS).find(
    (route) => route.toLowerCase() === lowerPath,
  );
  if (exactKey) {
    return ROUTE_PERMISSIONS[exactKey];
  }

  // 3. Khớp tiền tố (prefix) dài nhất theo segment (ví dụ /admin/products/123 -> /admin/products)
  const matchedRoute = Object.keys(ROUTE_PERMISSIONS)
    .filter((route) => {
      const lowerRoute = route.toLowerCase();
      return lowerPath === lowerRoute || lowerPath.startsWith(`${lowerRoute}/`);
    })
    .sort((a, b) => b.length - a.length)[0];

  if (matchedRoute) {
    return ROUTE_PERMISSIONS[matchedRoute];
  }

  // 4. Nguyên tắc phòng thủ chiều sâu (Default Deny):
  // Bất kỳ route nào thuộc /admin/* mà chưa khai báo quyền cụ thể -> mặc định yêu cầu Administrator
  if (lowerPath === "/admin" || lowerPath.startsWith("/admin/")) {
    return ["Administrator", "AdminAccess"];
  }

  return null;
}

/**
 * Kiểm tra xem user với danh sách roles hiện tại có quyền truy cập hay không
 */
export function isUserAuthorized(
  requiredRoles: string[] | null | undefined,
  userRoles: string[] | undefined,
): boolean {
  // Nếu route không yêu cầu quyền cụ thể nào -> cho phép
  if (!requiredRoles || requiredRoles.length === 0) return true;
  // Nếu route yêu cầu quyền nhưng user không có quyền nào -> từ chối
  if (!userRoles || userRoles.length === 0) return false;

  const normalizedUserRoles = userRoles.map((r) => r.toLowerCase().trim());
  return requiredRoles.some((role) =>
    normalizedUserRoles.includes(role.toLowerCase().trim()),
  );
}
