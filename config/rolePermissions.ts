/**
 * Cấu hình phân quyền truy cập cho từng đường dẫn (Route Permissions)
 * Khóa là tiền tố đường dẫn, giá trị là mảng các vai trò được phép truy cập.
 */
export const ROUTE_PERMISSIONS: Record<string, string[]> = {
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
  "/admin/orders": ["Administrator", "AdminAccess", "OrderAccess", "SaleAccess"],
  "/admin/sales": ["Administrator", "AdminAccess", "SaleAccess"],

  // 3. Vận hành & Kho
  "/admin/installment-providers": ["Administrator", "AdminAccess"],
  "/admin/installment-contracts": ["Administrator", "AdminAccess"],
  "/admin/suppliers": ["Administrator", "AdminAccess", "PurchaseAccess"],
  "/admin/purchase-orders": ["Administrator", "AdminAccess", "PurchaseAccess"],
  "/admin/warehouses": ["Administrator", "AdminAccess", "WarehouseAccess"],
  "/admin/inventory": ["Administrator", "AdminAccess", "WarehouseAccess"],
  "/admin/stock-transfers": ["Administrator", "AdminAccess", "WarehouseAccess"],
  "/admin/stock-audits": ["Administrator", "AdminAccess", "WarehouseAccess"],

  // 4. Kỹ thuật & Bảo hành
  "/admin/warranties": ["Administrator", "AdminAccess", "TechnicalAccess", "SaleAccess"],
  "/admin/warranty-claims": ["Administrator", "AdminAccess", "TechnicalAccess"],
  "/admin/repair-tickets": ["Administrator", "AdminAccess", "TechnicalAccess"],
  "/admin/repair-services": ["Administrator", "AdminAccess", "TechnicalAccess"],
};

/**
 * Tìm các quyền yêu cầu cho một pathname cụ thể
 */
export function getRequiredRolesForPath(pathname: string): string[] | null {
  // 1. Khớp chính xác
  if (ROUTE_PERMISSIONS[pathname]) {
    return ROUTE_PERMISSIONS[pathname];
  }

  // 2. Khớp tiền tố (prefix) dài nhất (ví dụ /admin/products/123 -> /admin/products)
  const matchedRoute = Object.keys(ROUTE_PERMISSIONS)
    .filter((route) => pathname.startsWith(route))
    .sort((a, b) => b.length - a.length)[0];

  return matchedRoute ? ROUTE_PERMISSIONS[matchedRoute] : null;
}

/**
 * Kiểm tra xem user với danh sách roles hiện tại có quyền truy cập hay không
 */
export function isUserAuthorized(
  requiredRoles: string[] | null | undefined,
  userRoles: string[] | undefined
): boolean {
  // Nếu route không yêu cầu quyền cụ thể nào -> cho phép
  if (!requiredRoles || requiredRoles.length === 0) return true;
  // Nếu route yêu cầu quyền nhưng user không có quyền nào -> từ chối
  if (!userRoles || userRoles.length === 0) return false;

  const normalizedUserRoles = userRoles.map((r) => r.toLowerCase().trim());
  return requiredRoles.some((role) =>
    normalizedUserRoles.includes(role.toLowerCase().trim())
  );
}
