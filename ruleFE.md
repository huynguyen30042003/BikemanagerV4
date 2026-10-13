# BIKE MANAGER V4 - QUY CHUẨN KIẾN TRÚC & QUY TẮC PHÁT TRIỂN FRONTEND (ruleFE.md)

Tài liệu này tổng hợp toàn bộ cấu trúc thư mục, quy tắc viết code, kiến trúc phân quyền (RBAC), quản lý xác thực và luồng điều hướng đã được xây dựng và áp dụng trong hệ thống Frontend.

---

## 1. Công nghệ cốt lõi (Tech Stack)

- **Framework**: Next.js 16 (App Router)
- **Ngôn ngữ**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS + Lucide React (Icons)
- **State Management**: Zustand (kết hợp `persist` middleware)
- **Form & Validation**: React Hook Form + Zod
- **Data Fetching & Cache**: TanStack React Query + Axios / Fetch API

---

## 2. Cấu trúc thư mục dự án (Project Structure)

```text
FE/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Route group xác thực (login, register)
│   │   ├── layout.tsx
│   │   └── login/page.tsx            # Trang đăng nhập (hỗ trợ callbackUrl, Suspense)
│   ├── admin/                        # Trang quản trị
│   │   ├── layout.tsx                # Bọc AdminRouteGuard bảo vệ toàn bộ route con
│   │   ├── danhMucChung/page.tsx
│   │   └── danhMucChiTiet/page.tsx
│   ├── api/                          # Next.js Route Handlers (BFF Proxy)
│   │   └── auth/
│   │       ├── login/route.ts        # Proxy login, set HttpOnly Cookie
│   │       ├── logout/route.ts       # Xóa HttpOnly Cookie (Max-Age=0)
│   │       └── me/route.ts           # Proxy lấy thông tin user & roles
│   ├── forbidden.tsx                 # Trang 403 Forbidden chuẩn Next.js
│   ├── forbidden/page.tsx            # Route /forbidden
│   ├── not-found.tsx                 # Trang 404 Not Found chuẩn Next.js
│   └── layout.tsx                    # Root Layout
├── components/                       # UI Components
│   └── Common/
│       ├── AccessDenied.tsx          # Component hiển thị 403 nội bộ (inline)
│       ├── RoleGuard.tsx             # RoleGuard (component) & AdminRouteGuard (layout)
│       ├── SiderBarAdmin.tsx         # Sidebar động lọc menu theo role của user
│       └── ...
├── config/                           # Cấu hình tĩnh & phân quyền
│   └── rolePermissions.ts            # Bảng ROUTE_PERMISSIONS & hàm kiểm tra quyền
├── hooks/                            # Custom React Hooks
│   └── Auth/
│       └── useAuth.ts                # useLogin, useLogout, useRole, useMe
├── lib/                              # Tiện ích bổ trợ (Utilities)
│   ├── auth.ts                       # Giải mã JWT client-side (getUserFromToken)
│   └── api.ts                        # Helper fetch API có xử lý 401 redirect
├── shared/                           # Dùng chung (Constants, API Services)
│   └── api/
│       ├── auth.api.ts
│       └── index.ts                  # Axios Client instance + Interceptors
├── store/                            # Global State Management
│   └── useAuthStore.ts               # Zustand store quản lý user & roles
├── proxy.ts                          # Middleware Next.js 16 (Bảo vệ route tầng mạng)
└── ruleFE.md                         # Tài liệu quy chuẩn này
```

---

## 3. Kiến trúc xác thực & Quản lý Token (Authentication Architecture)

### 3.1. Cơ chế lưu trữ Token đa tầng (Dual-layer Token Storage)
1. **Cookie HttpOnly (`access_token`, `refresh_token`)**:
   - Được backend hoặc Route Handler (`app/api/auth/login`) thiết lập với cờ `httpOnly: true`, `path: "/"`.
   - Dùng để bảo vệ tầng mạng qua `proxy.ts`.
2. **Client Storage (`localStorage`)**:
   - Lưu `access_token` và `expires_at`.
   - Dùng cho client-side giải mã JWT tức thì (`getUserFromToken`) nhằm **chống flash giao diện (chống giật F5)**.
3. **Zustand Store (`useAuthStore`)**:
   - Lưu trữ `UserProfile` đầy đủ (`id`, `username`, `email`, `roles`, `fullName`, `phoneNumber`, `avatarUrl`).
   - Được cập nhật tự động khi gọi API `/api/auth/me`.

### 3.2. Chống giật frame / Flash of Forbidden khi Reload (F5)
- Khi trang reload, Zustand store bắt đầu từ giá trị khởi tạo rỗng trước khi kịp fetch từ API.
- **Quy tắc giải quyết**:
  1. `AdminRouteGuard` đọc ngay lập tức `getUserFromToken()` từ `localStorage`.
  2. Bật cờ `hasChecked` chỉ sau khi API `/api/auth/me` đã hoàn thành hoặc token đã được đọc xong.
  3. Tuyệt đối không hiển thị Forbidden trong khi `!hasChecked` hoặc `isLoading && !user`.

---

## 4. Kiến trúc phân quyền (Role-Based Access Control - RBAC)

### 4.1. Cấu hình quyền tập trung (`config/rolePermissions.ts`)
Tất cả phân quyền theo đường dẫn phải được khai báo tại `ROUTE_PERMISSIONS`:
```ts
export const ROUTE_PERMISSIONS: Record<string, string[]> = {
  // Chỉ Administrator
  "/admin/danhMucChung": ["Administrator"],
  "/admin/danhMucChiTiet": ["Administrator"],

  // Kinh doanh
  "/admin/customer": ["Administrator", "AdminAccess", "SaleAccess"],
  "/admin/products": ["Administrator", "AdminAccess", "ProductAccess"],
  "/admin/orders": ["Administrator", "AdminAccess", "OrderAccess", "SaleAccess"],
  "/admin/sales": ["Administrator", "AdminAccess", "SaleAccess"],

  // Vận hành & Kho
  "/admin/installment-providers": ["Administrator", "AdminAccess"],
  "/admin/installment-contracts": ["Administrator", "AdminAccess"],
  "/admin/suppliers": ["Administrator", "AdminAccess", "PurchaseAccess"],
  "/admin/purchase-orders": ["Administrator", "AdminAccess", "PurchaseAccess"],
  "/admin/warehouses": ["Administrator", "AdminAccess", "WarehouseAccess"],
};
```

**Nguyên tắc đối soát quyền (`isUserAuthorized`)**:
- So sánh không phân biệt hoa thường (`toLowerCase()`).
- Bắt khớp tiền tố dài nhất (ví dụ: `/admin/products/create` tự động kế thừa quyền của `/admin/products`).
- Tuyệt đối không cho phép tài khoản không đủ role vượt qua kiểm tra.

### 4.2. Bảo vệ Route bằng `AdminRouteGuard` (`components/Common/RoleGuard.tsx`)
Bọc `AdminRouteGuard` ở cấp layout (ví dụ: `app/admin/layout.tsx`):
```tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarAdmin />
      <main className="flex-1 overflow-y-auto">
        <AdminRouteGuard mode="redirect">
          {children}
        </AdminRouteGuard>
      </main>
    </div>
  );
}
```
- `mode="redirect"`: Chuyển hướng sang `/forbidden?from=${pathname}` khi không đủ quyền.
- `mode="render"`: Hiển thị `<AccessDenied />` ngay trong vùng nội dung (vẫn giữ nguyên Sidebar).

### 4.3. Ẩn/Hiện phần tử theo Role (`RoleGuard`)
Dùng để ẩn hiện các nút thao tác đặc thù (Xóa, Xuất báo cáo, v.v.):
```tsx
<RoleGuard allowedRoles={["Administrator"]}>
  <button onClick={handleDelete}>Xóa dữ liệu</button>
</RoleGuard>
```

### 4.4. Menu Sidebar động theo Role (`components/Common/SiderBarAdmin.tsx`)
- Thêm thuộc tính `roles?: string[]` cho từng Section, Group, hoặc Item trong `MENU_SECTIONS`.
- Bộ lọc `filterMenuByRoles(MENU_SECTIONS, userRoles)` tự động loại bỏ các mục menu mà user không có quyền xem.

---

## 5. Quy tắc điều hướng & Giữ lại URL cũ (`callbackUrl` & `from`)

### 5.1. Khi người dùng CHƯA đăng nhập
- Truy cập vào route bảo vệ (ví dụ: `/admin/danhMucChung`):
  - `proxy.ts` và `RoleGuard` chặn lại và chuyển hướng:
    ```text
    /login?callbackUrl=%2Fadmin%2FdanhMucChung
    ```
- Tại trang đăng nhập (`app/(auth)/login/page.tsx`):
  - Đọc `callbackUrl` từ URL.
  - Hiển thị banner thông báo: *"Vui lòng đăng nhập để tiếp tục truy cập: /admin/danhMucChung"*.
  - Sau khi đăng nhập thành công: `router.push(targetRedirectUrl)`.

### 5.2. Khi người dùng ĐÃ đăng nhập nhưng KHÔNG ĐỦ quyền (403 Forbidden)
- Hệ thống chuyển hướng sang:
  ```text
  /forbidden?from=%2Fadmin%2FdanhMucChung
  ```
- Trên trang `/forbidden` và component `AccessDenied`:
  - Hiển thị đường dẫn đang cố truy cập và các vai trò hiện có.
  - Cung cấp nút bấm nổi bật: **"Đăng nhập lại với tài khoản khác"**.
  - Khi bấm:
    1. Gọi `/api/auth/logout` để server xóa sạch cookie HttpOnly (`Max-Age=0`).
    2. Xóa `access_token`, `expires_at` trong `localStorage`.
    3. Reset Zustand Store (`clearUser()`).
    4. Chuyển hướng đến `/login?callbackUrl=%2Fadmin%2FdanhMucChung`.

---

## 6. Quy chuẩn kỹ thuật Next.js App Router (Coding Best Practices)

### 6.1. Luôn bọc `<Suspense>` khi dùng `useSearchParams()`
Trong Next.js App Router, bất kỳ Client Component nào sử dụng `useSearchParams()` đều **phải** được bọc bởi `<Suspense>`. Nếu không bọc, Next.js sẽ báo warning hoặc fail build SSR:
```tsx
function PageContent() {
  const searchParams = useSearchParams();
  // logic...
  return <div>...</div>;
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PageContent />
    </Suspense>
  );
}
```

### 6.2. Kiểm tra tính an toàn của Redirect (Chống Open Redirect Vulnerability)
Khi redirect theo URL query param (`callbackUrl` / `from`), luôn kiểm tra đường dẫn an toàn:
```ts
const isSafeUrl = (url: string | null) => {
  if (!url) return false;
  // Bắt đầu bằng 1 dấu gạch chéo "/", không bắt đầu bằng "//" (tránh protocol-relative URL)
  // và không được lặp lại chính trang "/login"
  return url.startsWith("/") && !url.startsWith("//") && !url.startsWith("/login");
};
```

### 6.3. API BFF Proxy (`app/api/auth/*`)
- Đối với môi trường phát triển nội bộ có chứng chỉ SSL tự ký:
  ```ts
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  ```
- Khi Logout, luôn xóa triệt để cookies trên `NextResponse`:
  ```ts
  nextResponse.cookies.set("access_token", "", { path: "/", maxAge: 0 });
  nextResponse.cookies.set("refresh_token", "", { path: "/", maxAge: 0 });
  nextResponse.cookies.set("expires_at", "", { path: "/", maxAge: 0 });
  ```

---

## 7. Quy chuẩn Form & UI Controls: Bắt buộc dùng Custom Select Search

### 7.1. Nguyên tắc cốt lõi (Core Rule)
- ❌ **TUYỆT ĐỐI KHÔNG SỬ DỤNG**: Thẻ HTML `<select>` mặc định của trình duyệt (`<select><option>...</option></select>`).
- ✅ **BẮT BUỘC SỬ DỤNG**: Component Custom Search Select đã được xây dựng sẵn trong dự án:
  - **`SearchSelect`**: Dành cho chọn đơn (Single select) có thanh tìm kiếm và tự động đóng khi click outside.
  - **`MultiSearchSelect`**: Dành cho chọn nhiều (Multiple select) có checkbox, đếm số lượng và xóa nhanh.
  - Vị trí component: [`@/components/ui/selectSearch`](file:///d:/Workshop/NextJS/BikeManagerV4/FE/components/ui/selectSearch.tsx)

### 7.2. Lý do quy định (Rationale)
1. **Trải nghiệm tìm kiếm tức thì**: Dữ liệu trong quản trị (Danh mục, Sản phẩm, Khách hàng, Nhà cung cấp...) thường rất lớn. Select mặc định không thể gõ tìm kiếm nhanh.
2. **Giao diện đồng nhất**: Thẻ `<select>` mặc định bị phụ thuộc vào hệ điều hành (Windows, macOS, iOS, Android), giao diện thô cứng và không ăn theo bảng màu/theme của hệ thống.
3. **Tính năng mở rộng**: Hỗ trợ clear nhanh, hiển thị badge số lượng đã chọn, tùy biến loading/empty state dễ dàng.

### 7.3. Hướng dẫn sử dụng mẫu

#### A. Sử dụng độc lập với `useState`
```tsx
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";

const CATEGORY_OPTIONS: SelectOption[] = [
  { value: "cat-1", label: "Xe đạp địa hình" },
  { value: "cat-2", label: "Xe đạp đua" },
  { value: "cat-3", label: "Phụ kiện xe đạp" },
];

export function FilterBar() {
  const [selectedCategory, setSelectedCategory] = useState<string | number>("");

  return (
    <SearchSelect
      options={CATEGORY_OPTIONS}
      value={selectedCategory}
      onChange={(val) => setSelectedCategory(val)}
      placeholder="-- Chọn danh mục xe --"
      className="w-64"
    />
  );
}
```

#### B. Tích hợp với `react-hook-form` qua `<Controller>`
Khi làm việc với biểu mẫu Zod / React Hook Form, luôn bọc qua `Controller`:
```tsx
import { Controller, useForm } from "react-hook-form";
import { SearchSelect, MultiSearchSelect } from "@/components/ui/selectSearch";

export function ProductForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      categoryId: "",
      tagIds: [] as (string | number)[],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 1. Chọn đơn */}
      <div>
        <label className="text-sm font-medium">Danh mục chính</label>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <SearchSelect
              options={categoryOptions}
              value={field.value}
              onChange={field.onChange}
              placeholder="Chọn danh mục..."
            />
          )}
        />
      </div>

      {/* 2. Chọn nhiều */}
      <div>
        <label className="text-sm font-medium">Nhãn / Tags</label>
        <Controller
          name="tagIds"
          control={control}
          render={({ field }) => (
            <MultiSearchSelect
              options={tagOptions}
              value={field.value}
              onChange={field.onChange}
              placeholder="Chọn các nhãn liên quan..."
            />
          )}
        />
      </div>
    </form>
  );
}
```

---

## 8. Checklist khi thêm một Tính năng / Trang mới

Mỗi khi thêm một trang Admin mới (ví dụ: `/admin/reports`):

1. **Backend**: Định nghĩa quyền trong `ApiRoles.cs` (ví dụ: `ReportAccess = "Administrator,AdminAccess,ReportAccess"`).
2. **Cấu hình Route Permissions**: Thêm đường dẫn vào `ROUTE_PERMISSIONS` trong [`config/rolePermissions.ts`](file:///d:/Workshop/NextJS/BikeManagerV4/FE/config/rolePermissions.ts).
3. **Sidebar Menu**: Thêm mục menu mới vào `MENU_SECTIONS` trong [`components/Common/SiderBarAdmin.tsx`](file:///d:/Workshop/NextJS/BikeManagerV4/FE/components/Common/SiderBarAdmin.tsx) kèm trường `roles: ["Administrator", "ReportAccess"]`.
4. **Trang Page**: Tạo file `app/admin/reports/page.tsx`. `AdminRouteGuard` trong `app/admin/layout.tsx` sẽ tự động bảo vệ trang này mà không cần viết lại guard ở từng trang.
5. **Form & Controls**: Sử dụng `SearchSelect` / `MultiSearchSelect` thay cho thẻ `<select>` mặc định nếu có trường chọn dữ liệu.
6. **Kiểm tra**:
   - Đăng nhập với tài khoản không có quyền $\rightarrow$ Trang không xuất hiện trên Sidebar, nếu gõ link trực tiếp sẽ bị chuyển sang `/forbidden?from=/admin/reports`.
   - Bấm "Đăng nhập lại" $\rightarrow$ Nhập tài khoản có quyền $\rightarrow$ Tự động chuyển về `/admin/reports`.
