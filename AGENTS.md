# BIKE MANAGER V4 - QUY CHUẨN KIẾN TRÚC & QUY TẮC PHÁT TRIỂN FRONTEND (ruleFE.md)

Tài liệu này tổng hợp toàn bộ cấu trúc thư mục, quy tắc viết code, kiến trúc phân quyền (RBAC), quản lý xác thực, chiến lược Rendering (RSC/CSR), chuẩn hóa SEO, quy chuẩn thiết kế UI/UX và kỹ thuật tối ưu hiệu năng (chống Re-rendering) được áp dụng bắt buộc trong toàn bộ hệ thống Frontend.

---

## 1. Công nghệ cốt lõi (Tech Stack)

- **Framework**: Next.js 16 (App Router - React 19)
- **Ngôn ngữ**: TypeScript (Strict mode - Tuyệt đối cấm dùng `any`)
- **Styling**: Tailwind CSS + Lucide React (Icons) + Motion/React (Animations)
- **State Management**: Zustand (kết hợp `persist` middleware)
- **Form & Validation**: React Hook Form + Zod
- **Data Fetching & Cache**: TanStack React Query v5 + Axios / Fetch API
- **Feedback & Notifications**: Sonner (Toast notifications)

---

## 2. Cấu trúc thư mục dự án (Project Structure)

```text
FE/
├── app/                              # Next.js App Router
│   ├── (public)/                     # Route group cho trang Public/Client (Chuẩn SEO, SSR/ISR)
│   ├── (auth)/                       # Route group xác thực (login, register)
│   │   ├── layout.tsx
│   │   └── login/page.tsx            # Trang đăng nhập (hỗ trợ callbackUrl, Suspense)
│   ├── admin/                        # Trang quản trị (No-Index SEO, CSR + Prefetch)
│   │   ├── layout.tsx                # Bọc AdminRouteGuard bảo vệ toàn bộ route con
│   │   ├── loading.tsx               # Skeleton Loading cấp độ Layout Admin
│   │   ├── error.tsx                 # Error Boundary bắt lỗi runtime toàn khu vực Admin
│   │   ├── danhMucChung/page.tsx     # Quản lý danh mục dùng chung (Chế độ xem kép Grid & Table)
│   │   ├── danhMucChiTiet/page.tsx   # Quản lý danh mục chi tiết (Liên kết danh mục cha)
│   │   ├── products/page.tsx         # Quản lý sản phẩm xe đạp
│   │   ├── product-variants/page.tsx # Quản lý biến thể sản phẩm
│   │   ├── product-images/page.tsx   # Quản lý thư viện hình ảnh xe
│   │   └── product-serials/page.tsx  # Quản lý số khung / số serial
│   ├── api/                          # Next.js Route Handlers (BFF Proxy)
│   │   └── auth/
│   │       ├── login/route.ts        # Proxy login, set HttpOnly Cookie
│   │       ├── logout/route.ts       # Xóa HttpOnly Cookie (Max-Age=0)
│   │       └── me/route.ts           # Proxy lấy thông tin user & roles
│   ├── forbidden.tsx                 # Trang 403 Forbidden chuẩn Next.js
│   ├── forbidden/page.tsx            # Route /forbidden
│   ├── not-found.tsx                 # Trang 404 Not Found chuẩn Next.js
│   ├── robots.ts                     # Cấu hình Robots.txt động (Chặn bot quét /admin, /api)
│   ├── sitemap.ts                    # Sitemap XML tự động cho các trang Public
│   └── layout.tsx                    # Root Layout (Cấu hình Font, Metadata gốc, Providers)
├── components/                       # UI Components dùng chung & Feature Components
│   ├── Common/                       # Component dùng chung toàn hệ thống
│   │   ├── AccessDenied.tsx          # Component hiển thị 403 nội bộ (inline)
│   │   ├── RoleGuard.tsx             # RoleGuard (component) & AdminRouteGuard (layout)
│   │   ├── SiderBarAdmin.tsx         # Sidebar động lọc menu theo role của user
│   │   ├── CategoryNavTabs.tsx       # Navigation tabs giữa DanhMucChung & DanhMucChiTiet
│   │   └── ProductNavTabs.tsx        # Navigation tabs giữa 5 màn hình sản phẩm & kho
│   ├── ui/                           # Base UI Primitives (Design System)
│   │   ├── selectSearch.tsx          # Custom SearchSelect & MultiSearchSelect bắt buộc
│   │   ├── SlideOver.tsx             # Drawer trượt từ cạnh màn hình (Form thêm/sửa)
│   │   ├── ConfirmModal.tsx          # Modal xác nhận xóa / thao tác nguy hiểm
│   │   ├── Table.tsx                 # Bảng dữ liệu chuẩn hóa
│   │   ├── button.tsx                # Nút bấm chuẩn WCAG AA
│   │   ├── input.tsx                 # Input field
│   │   └── switch.tsx                # Switch Radix UI
│   └── DanhMucChung/                 # Feature Components cho Danh Mục Dùng Chung
│       ├── CreateDanhMucChungSlideOver.tsx # Modal Thêm mới (Cô lập State chống Re-render)
│       └── UpdateDanhMucChungSlideOver.tsx # Modal Cập nhật (Cô lập State chống Re-render)
├── config/                           # Cấu hình tĩnh & phân quyền
│   └── rolePermissions.ts            # Bảng ROUTE_PERMISSIONS & hàm kiểm tra quyền
├── hooks/                            # Custom React Hooks
│   ├── Auth/
│   │   └── useAuth.ts                # useLogin, useLogout, useRole, useMe
│   ├── DanhMucChung/                 # Hooks Danh mục dùng chung
│   │   ├── useDanhMucChung.ts        # Quản lý State phân trang, filter, search
│   │   └── useDanhMucChungApi.ts     # TanStack React Query mutations & queries
│   └── DanhMucChiTiet/               # Hooks Danh mục chi tiết
├── lib/                              # Tiện ích bổ trợ (Utilities)
│   ├── auth.ts                       # Giải mã JWT client-side (getUserFromToken)
│   ├── api.ts                        # Helper fetch API có xử lý 401 redirect
│   └── queryKeys.ts                  # Quản lý tập trung Query Keys cho React Query
├── shared/                           # Dùng chung (Constants, API Services, Types)
│   └── api/
│       ├── auth.api.ts
│       └── index.ts                  # Axios Client instance + Interceptors
├── store/                            # Global State Management
│   └── useAuthStore.ts               # Zustand store quản lý user & roles
├── types/                            # TypeScript interfaces & types định nghĩa dữ liệu
├── proxy.ts                          # Middleware Next.js 16 (Bảo vệ route tầng mạng)
└── ruleFE.md                         # Bản ghi tài liệu này
```

---

## 3. Chiến lược Rendering & Kiến trúc Component (Rendering Standards)

Next.js 16 mặc định mọi component trong `app/` là **React Server Components (RSC)**. Phải tuân thủ nghiêm ngặt ranh giới giữa Server và Client để tối ưu bundle size và tốc độ TTI (Time to Interactive).

### 3.1. Nguyên tắc "Lá Client" (Client-Leaf Pattern)

- ❌ **KHÔNG** đặt `"use client"` ở đầu các file `page.tsx` hoặc `layout.tsx` trừ khi thực sự bắt buộc (ví dụ trang tương tác đặc thù).
- ✅ **BẮT BUỘC** giữ `page.tsx` là Server Component bất cứ khi nào có thể để khai báo `Metadata` (SEO), kiểm tra params/searchParams phía server, và chỉ nhúng các phần tương tác (Form, Table có filter, Modal) dưới dạng Client Component con.

```tsx
// ✅ ĐÚNG: app/admin/products/page.tsx (Server Component)
import { Metadata } from "next";
import ProductTableClient from "./_components/ProductTableClient";

export const metadata: Metadata = {
  title: "Quản lý sản phẩm",
};

export default function ProductsPage() {
  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h1>
      {/* Đẩy phần tương tác xuống Client Component */}
      <ProductTableClient />
    </section>
  );
}
```

### 3.2. Ma trận lựa chọn phương thức Rendering

| Khu vực / Loại trang                 | Chiến lược Render               | Cấu hình & Cách thực hiện                                                              |
| :----------------------------------- | :------------------------------ | :------------------------------------------------------------------------------------- |
| **Trang chủ, Tin tức, Giới thiệu**   | **SSG / ISR** (Tĩnh có làm mới) | Server Component, dùng `fetch` với `{ next: { revalidate: 3600 } }`.                   |
| **Danh sách & Chi tiết xe (Public)** | **SSR / Dynamic Rendering**     | Server Component, render dữ liệu mới nhất phục vụ SEO & chia sẻ MXH.                   |
| **Khu vực Quản trị (`/admin/*`)**    | **CSR kết hợp Shell RSC**       | `page.tsx` quản lý title/view, ruột là Client Component dùng **TanStack React Query**. |
| **Biểu mẫu, Modal, Bộ lọc, Drawer**  | **CSR (`"use client"`)**        | **Tách thành component riêng biệt** (xem Mục 11) để cô lập re-render.                  |

### 3.3. Quy tắc Async Request APIs trong Next.js 16

Trong Next.js 16, `params`, `searchParams`, `cookies()`, và `headers()` trong Server Component / Route Handler đều là **Promise bất đồng bộ**.

```tsx
// ✅ BẮT BUỘC dùng async/await khi đọc params hoặc searchParams ở Server Component
export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  return (
    <div>
      Chi tiết xe ID: {id} - Tab: {tab}
    </div>
  );
}
```

---

## 4. Quy chuẩn SEO, Metadata & Tối ưu tài nguyên (Core Web Vitals)

### 4.1. Cấu hình Metadata chuẩn tại Root & Các trang con

- **Root Layout (`app/layout.tsx`)**: Khai báo `metadataBase` và `title.template` để đồng bộ thương hiệu.

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://bikemanager.vn",
  ),
  title: {
    default: "Bike Manager V4 - Hệ thống Quản trị & Kinh doanh Xe đạp",
    template: "%s | Bike Manager V4",
  },
  description:
    "Giải pháp quản lý kho, bán hàng, trả góp và vận hành cửa hàng xe đạp toàn diện.",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Bike Manager V4",
  },
};
```

### 4.2. Bảo mật SEO cho khu vực Quản trị (`/admin/*` và `/login`)

Các trang quản trị và xác thực **tuyệt đối không được lập chỉ mục (index)** trên Google để tránh lộ cấu trúc hệ thống.

- Tại `app/admin/layout.tsx` và `app/(auth)/layout.tsx`, bắt buộc khai báo:

```tsx
export const metadata: Metadata = {
  title: {
    default: "Hệ thống Quản trị",
    template: "%s | Quản trị Bike Manager",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};
```

- Tạo file `app/robots.ts` để chặn Bot ở tầng crawler:

```ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/forbidden", "/login"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://bikemanager.vn"}/sitemap.xml`,
  };
}
```

### 4.3. Semantic HTML & Tối ưu Hình ảnh / Fonts

1. **Cấu trúc thẻ HTML ngữ nghĩa**:
   - Mỗi trang (`page.tsx`) chỉ có **duy nhất 1 thẻ `<h1>`** (thường là tiêu đề chính của trang).
   - Các vùng chức năng phải dùng đúng thẻ: `<aside>` cho Sidebar, `<header>` cho Topbar, `<main>` cho nội dung chính, `<nav>` cho thanh điều hướng.
2. **Hình ảnh (`next/image`)**:
   - ❌ Cấm dùng thẻ `<img>` thuần cho ảnh sản phẩm, banner, avatar.
   - ✅ Dùng `<Image/>` của `next/image`, khai báo rõ `width`, `height` hoặc `fill` (kèm `sizes`) để chống hiện tượng **CLS (Cumulative Layout Shift)**.
   - Ảnh đầu trang (Logo, Banner chính) phải gắn thuộc tính `priority`.
3. **Font chữ (`next/font`)**:
   - Load font qua `next/font/google` (ví dụ: Inter hoặc Be_Vietnam_Pro với `subsets: ["vietnamese"]`, `display: "swap"`) tại `app/layout.tsx`.

---

## 5. Kiến trúc xác thực & Quản lý Token (Authentication Architecture)

### 5.1. Cơ chế lưu trữ Token đa tầng (Dual-layer Token Storage)

1. **Cookie HttpOnly (`access_token`, `refresh_token`)**:
   - Được backend hoặc Route Handler (`app/api/auth/login`) thiết lập với cờ `httpOnly: true`, `path: "/"`, `sameSite: "lax"`.
   - Dùng để bảo vệ tầng mạng qua `proxy.ts`.
2. **Client Storage (`localStorage`)**:
   - Lưu `access_token` và `expires_at`.
   - Dùng cho client-side giải mã JWT tức thì (`getUserFromToken`) nhằm chống flash giao diện (chống giật F5).
3. **Zustand Store (`useAuthStore`)**:
   - Lưu trữ `UserProfile` đầy đủ (`id`, `username`, `email`, `roles`, `fullName`, `phoneNumber`, `avatarUrl`).
   - Được cập nhật tự động khi gọi API `/api/auth/me`.

### 5.2. Chống giật frame / Flash of Forbidden khi Reload (F5)

Khi trang reload, Zustand store bắt đầu từ giá trị khởi tạo rỗng trước khi kịp fetch từ API.

- **Quy tắc giải quyết**:
  - `AdminRouteGuard` đọc ngay lập tức `getUserFromToken()` từ `localStorage`.
  - Bật cờ `hasChecked` chỉ sau khi API `/api/auth/me` đã hoàn thành hoặc token đã được đọc xong.
  - Tuyệt đối không hiển thị `Forbidden` trong khi `!hasChecked` hoặc `isLoading && !user`.

---

## 6. Kiến trúc phân quyền (Role-Based Access Control - RBAC)

### 6.1. Cấu hình quyền tập trung (`config/rolePermissions.ts`)

Tất cả phân quyền theo đường dẫn phải được khai báo tại `ROUTE_PERMISSIONS`:

```typescript
export const ROUTE_PERMISSIONS: Record<string, string[]> = {
  // Chỉ Administrator
  "/admin/danhMucChung": ["Administrator"],
  "/admin/danhMucChiTiet": ["Administrator"],

  // Kinh doanh
  "/admin/customer": ["Administrator", "AdminAccess", "SaleAccess"],
  "/admin/products": ["Administrator", "AdminAccess", "ProductAccess"],
  "/admin/orders": [
    "Administrator",
    "AdminAccess",
    "OrderAccess",
    "SaleAccess",
  ],
  "/admin/sales": ["Administrator", "AdminAccess", "SaleAccess"],

  // Vận hành & Kho
  "/admin/installment-providers": ["Administrator", "AdminAccess"],
  "/admin/installment-contracts": ["Administrator", "AdminAccess"],
  "/admin/suppliers": ["Administrator", "AdminAccess", "PurchaseAccess"],
  "/admin/purchase-orders": ["Administrator", "AdminAccess", "PurchaseAccess"],
  "/admin/warehouses": ["Administrator", "AdminAccess", "WarehouseAccess"],
};
```

- **Nguyên tắc đối soát quyền (`isUserAuthorized`)**:
  - So sánh không phân biệt hoa thường (`toLowerCase()`).
  - Bắt khớp tiền tố dài nhất (ví dụ: `/admin/products/create` tự động kế thừa quyền của `/admin/products`).
  - Tuyệt đối không cho phép tài khoản không đủ role vượt qua kiểm tra.

### 6.2. Bảo vệ Route bằng `AdminRouteGuard` (`components/Common/RoleGuard.tsx`)

Bọc `AdminRouteGuard` ở cấp layout (ví dụ: `app/admin/layout.tsx`):

```tsx
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarAdmin />
      <main className="flex-1 overflow-y-auto">
        <AdminRouteGuard mode="redirect">{children}</AdminRouteGuard>
      </main>
    </div>
  );
}
```

- `mode="redirect"`: Chuyển hướng sang `/forbidden?from=${pathname}` khi không đủ quyền.
- `mode="render"`: Hiển thị `<AccessDenied />` ngay trong vùng nội dung (vẫn giữ nguyên Sidebar).

### 6.3. Ẩn/Hiện phần tử theo Role (`RoleGuard`)

Dùng để ẩn hiện các nút thao tác đặc thù (Xóa, Xuất báo cáo, Duyệt đơn...):

```tsx
<RoleGuard allowedRoles={["Administrator"]}>
  <button onClick={handleDelete}>Xóa dữ liệu</button>
</RoleGuard>
```

### 6.4. Menu Sidebar động theo Role (`components/Common/SiderBarAdmin.tsx`)

- Thêm thuộc tính `roles?: string[]` cho từng Section, Group, hoặc Item trong `MENU_SECTIONS`.
- Bộ lọc `filterMenuByRoles(MENU_SECTIONS, userRoles)` tự động loại bỏ các mục menu mà user không có quyền xem.

---

## 7. Quy tắc điều hướng & Giữ lại URL cũ (`callbackUrl` & `from`)

### 7.1. Khi người dùng CHƯA đăng nhập

- Truy cập vào route bảo vệ (ví dụ: `/admin/danhMucChung`): `proxy.ts` và `RoleGuard` chặn lại và chuyển hướng:
  `/login?callbackUrl=%2Fadmin%2FdanhMucChung`
- Tại trang đăng nhập (`app/(auth)/login/page.tsx`):
  - Đọc `callbackUrl` từ URL.
  - Hiển thị banner thông báo: _"Vui lòng đăng nhập để tiếp tục truy cập: /admin/danhMucChung"_.
  - Sau khi đăng nhập thành công: `router.push(targetRedirectUrl)`.

### 7.2. Khi người dùng ĐÃ đăng nhập nhưng KHÔNG ĐỦ quyền (403 Forbidden)

- Hệ thống chuyển hướng sang: `/forbidden?from=%2Fadmin%2FdanhMucChung`
- Trên trang `/forbidden` và component `AccessDenied`:
  - Hiển thị đường dẫn đang cố truy cập và các vai trò hiện có.
  - Cung cấp nút bấm nổi bật: _"Đăng nhập lại với tài khoản khác"_.
  - Khi bấm:
    1. Gọi `/api/auth/logout` để server xóa sạch cookie HttpOnly (Max-Age=0).
    2. Xóa `access_token`, `expires_at` trong `localStorage`.
    3. Reset Zustand Store (`clearUser()`).
    4. Xóa toàn bộ cache của React Query (`queryClient.clear()`).
    5. Chuyển hướng đến `/login?callbackUrl=%2Fadmin%2FdanhMucChung`.

---

## 8. Quy chuẩn Data Fetching, Caching & Error Handling

### 8.1. Quản lý Server State bằng TanStack React Query

- **Không dùng `useEffect` để gọi API lấy dữ liệu**: Mọi thao tác GET dữ liệu trên Client Component đều phải thông qua `useQuery`, và POST/PUT/DELETE phải thông qua `useMutation`.
- **Quản lý Query Key tập trung (`lib/queryKeys.ts`)**:

```typescript
export const QUERY_KEYS = {
  PRODUCTS: {
    ALL: ["products"] as const,
    LIST: (filters: Record<string, unknown>) =>
      ["products", "list", filters] as const,
    DETAIL: (id: string | number) => ["products", "detail", id] as const,
  },
  CATEGORIES: {
    ALL: ["categories"] as const,
  },
};
```

- **Tự động làm mới dữ liệu**: Sau khi thêm/sửa/xóa thành công trong `useMutation`, bắt buộc gọi `queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL })` để UI tự động cập nhật mà không cần F5.

### 8.2. Streaming UI (`loading.tsx`) & Error Boundary (`error.tsx`)

- **Skeleton Loading**: Sử dụng `app/admin/loading.tsx` hoặc `<Suspense fallback={<TableSkeleton />}>` để hiển thị khung xương giữ chỗ, tránh làm nhảy khung hình.
- **Error Boundary**: Đặt `app/admin/error.tsx` (`"use client"`) để bắt mọi lỗi crash giao diện và cung cấp nút _"Thử tải lại (Reset)"_ mà không làm sập toàn bộ ứng dụng.

---

## 9. Quy chuẩn kỹ thuật Next.js App Router (Coding Best Practices)

### 9.1. Luôn bọc `<Suspense>` khi dùng `useSearchParams()`

Trong Next.js App Router, bất kỳ Client Component nào sử dụng `useSearchParams()` đều phải được bọc bởi `<Suspense>`. Nếu không bọc, toàn bộ trang sẽ bị giáng cấp về Client-side rendering hoàn toàn hoặc lỗi khi chạy `next build`:

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

### 9.2. Kiểm tra tính an toàn của Redirect (Chống Open Redirect Vulnerability)

Khi redirect theo URL query param (`callbackUrl` / `from`), luôn kiểm tra đường dẫn an toàn:

```typescript
const isSafeUrl = (url: string | null) => {
  if (!url) return false;
  return (
    url.startsWith("/") && !url.startsWith("//") && !url.startsWith("/login")
  );
};
```

---

## 10. Quy chuẩn Form & UI Controls: Bắt buộc dùng Custom Select Search

### 10.1. Nguyên tắc cốt lõi (Core Rule)

- ❌ **TUYỆT ĐỐI KHÔNG SỬ DỤNG**: Thẻ HTML `<select>` mặc định của trình duyệt (`<select><option>...</option></select>`).
- ✅ **BẮT BUỘC SỬ DỤNG**: Component Custom Search Select đã được xây dựng sẵn trong dự án:
  - `SearchSelect`: Dành cho chọn đơn (Single select) có thanh tìm kiếm và tự động đóng khi click outside.
  - `MultiSearchSelect`: Dành cho chọn nhiều (Multiple select) có checkbox, đếm số lượng và xóa nhanh.
  - Vị trí component: `@/components/ui/selectSearch`

### 10.2. Rationale & Ứng dụng

- **Trải nghiệm tìm kiếm tức thì**: Dữ liệu trong quản trị thường lớn. Select mặc định không thể tìm kiếm nhanh.
- **Giao diện đồng nhất**: Thẻ `<select>` mặc định phụ thuộc vào hệ điều hành, giao diện thô cứng và không ăn theo design system.
- **Áp dụng cho cả Phân trang (Page Size Selector)**:

```jsx
<Pagination
  page={page}
  totalPages={totalPages}
  totalCount={totalCount}
  pageSize={pageSize}
  setPage={setPage}
  setPageSize={setPageSize}
  itemName="mục chi tiết"
/>
```

- **Áp dụng cho cả Phân trang (Page Size Selector)**:

## 11. Quy chuẩn Tách Component Modal / Drawer (Form State Isolation Pattern)

> [!IMPORTANT]
> **Vấn đề "Re-render Trap"**: Khi đặt form state (`dataAdd`, `dataUpdate`, `errors`, `onChange`) trực tiếp trong `page.tsx`, mỗi khi người dùng gõ 1 ký tự vào input, toàn bộ trang cha (Ribbon KPI, thanh tìm kiếm, bộ lọc trạng thái, toàn bộ danh sách Showcase Grid Cards với motion animations và Data Table) đều bị re-render theo từng ký tự. Điều này gây ra độ trễ phím (typing latency) và làm file `page.tsx` phình to quá tải (> 1.100 dòng).

### 11.1. Nguyên tắc cô lập State cục bộ (State Isolation)

Mọi Slide-over Drawer / Modal phục vụ chức năng **Thêm mới (Create)** hoặc **Cập nhật (Update)** bắt buộc phải được tách thành component độc lập và lưu trữ tại thư mục:
`components/<FeatureName>/` (ví dụ: `components/DanhMucChung/CreateDanhMucChungSlideOver.tsx`).

### 11.2. Phân chia trách nhiệm rõ ràng

1. **Trang cha (`page.tsx`)**:
   - Chỉ chịu trách nhiệm quản lý danh sách, phân trang, bộ lọc và trạng thái mở/đóng modal:
     ```tsx
     const [openCreate, setOpenCreate] = useState<boolean>(false);
     const [editingItem, setEditingItem] = useState<DM_DanhMucChung | null>(
       null,
     );
     ```
   - Trang cha **HOÀN TOÀN KHÔNG** lưu trữ giá trị text của form (`Ten`, `MoTa`, `ThuTu`...).
2. **Component Modal con (`Create...SlideOver.tsx` / `Update...SlideOver.tsx`)**:
   - Tự quản lý state form nội bộ (`formData`), validation errors (`errors`), và mutation hook (`useCreateDanhMucChung`, `useUpdateDanhMucChung`).
   - Tự động reset dữ liệu khi mở (`useEffect(() => { if (open) resetForm(); }, [open])`).
   - Khi người dùng gõ phím, **chỉ duy nhất Modal con re-render**, toàn bộ bảng/grid của trang cha đứng yên 100%.

### 11.3. Cấu trúc Props chuẩn của Modal tách riêng

```tsx
// ✅ Chuẩn Props cho Modal Thêm mới
interface CreateSlideOverProps {
  open: boolean;
  onClose: () => void;
  defaultThuTu?: number;
  onSuccess?: () => void;
}

// ✅ Chuẩn Props cho Modal Cập nhật
interface UpdateSlideOverProps {
  open: boolean;
  onClose: () => void;
  data: DM_DanhMucChung | null;
  onSuccess?: () => void;
}
```

---

## 12. Quy chuẩn Thiết kế UI Quản trị Hiện đại (Admin UX & Design Standards)

Được chuẩn hóa theo triết lý **Anti-slop & Premium Dark/Light UI** từ skill `design-taste-frontend`:

1. **Chế độ xem kép linh hoạt (Dual View Mode)**:
   - Các trang quản lý danh mục / sản phẩm hỗ trợ chuyển đổi linh hoạt qua nút toggle giữa:
     - **Showcase Grid (`viewMode: "grid"`)**: Hiển thị thẻ card trực quan, xem nhanh mã số, số lượng liên kết, badge trạng thái và mô tả.
     - **Data Table (`viewMode: "table"`)**: Bảng dữ liệu chuẩn cho người dùng cần đối soát nhiều bản ghi cùng lúc.
2. **Motivated Animation**:
   - Sử dụng `motion/react` tạo hiệu ứng xuất hiện mượt mà cho lưới thẻ.
   - **Bắt buộc** bọc qua hook `useReducedMotion()` để tự động tắt chuyển động nếu người dùng bật chế độ giảm tải chuyển động trên trình duyệt.
3. **KPI Overview Ribbon**:
   - Đầu trang luôn có hàng thẻ thống kê tổng quan (Tổng số lượng, Đang hoạt động, Đã khóa, Số mục liên kết).
   - Cho phép click trực tiếp vào thẻ KPI để lọc nhanh dữ liệu tương ứng.
4. **Loại bỏ triệt để ký tự gạch ngang dài (`—` em-dash)**:
   - Tuyệt đối không dùng ký tự `—` (em-dash) trong văn bản, nhãn, bảng hoặc placeholder.
   - Chỉ dùng dấu gạch ngang tiêu chuẩn (`-`) hoặc định dạng chữ rõ ràng để tránh lỗi mã hóa font hoặc typo thị giác.

---

## 13. Checklist khi thêm hoặc nâng cấp một Tính năng mới

Mỗi khi thêm một trang hoặc module mới (ví dụ: `/admin/reports` hoặc refactor trang hiện có), bắt buộc kiểm tra đủ các bước sau:

1. **Backend & Phân quyền**: Định nghĩa quyền trong `ApiRoles.cs` và khai báo đường dẫn vào `ROUTE_PERMISSIONS` (`config/rolePermissions.ts`).
2. **Sidebar Menu**: Thêm mục menu mới vào `MENU_SECTIONS` trong `components/Common/SiderBarAdmin.tsx` kèm roles tương ứng.
3. **Kiến trúc Modal & Performance**:
   - Tách Slide-over/Modal Thêm & Sửa thành component con đặt tại `components/<Feature>/`.
   - Đảm bảo việc gõ phím trong form không gây re-render cho trang cha.
4. **Controls & Form**:
   - Sử dụng `<SearchSelect>` / `<MultiSearchSelect>` thay cho thẻ `<select>` mặc định ở tất cả dropdown (kể cả bộ chọn số bản ghi phân trang).
   - Validation bằng Zod schema, thông báo lỗi bằng Sonner `toast`.
   - defaultThuTu khi mà add thì cho mặt định là 1 và ko cần tính max ở đó
   - khi view ra danh sách để xem thì không hiển thị số thứ tự (thứ tự hiển thị nếu cần thì view ra khi add hoặc update)
5. **UI & UX Standard**:
   - Hỗ trợ chế độ xem kép Grid & Table nếu là module phân loại/danh mục.
   - Kiểm tra tương phản màu đạt chuẩn WCAG AA. Không dùng ký tự `-` (em-dash).
6. **Quy chuẩn Responsive Mobile (BẮT BUỘC 100% - MANDATORY REQUIREMENT)**:
   - Mọi trang và component khi tạo mới hoặc cập nhật **BẮT BUỘC PHẢI RESPONSIVE HOÀN HẢO** trên tất cả độ phân giải:
     - Desktop lớn (1440px - 1920px)
     - Laptop & Tablet (768px - 1024px)
     - Mobile (375px - 428px, đặc biệt chuẩn kích thước iPhone Xs Max: 414px và iPhone 12/13/14 Pro Max: 428px).
   - Tuyệt đối cấm để giao diện bị vỡ bố cục, tràn viền ngang (horizontal page blowout), đè chữ hoặc nút bấm bị cắt xén.
   - Kiểm tra đầy đủ: Nút 3 gạch (`Menu`) thu gọn bộ lọc, dải Tab cuộn ngang mượt mà, bảng dữ liệu bọc `overflow-x-auto min-w-[...]`, thẻ KPI chia 2 cột cân đối.
7. **Kiểm tra Build**:
   - Chạy `npx tsc --noEmit` đạt 0 lỗi.
   - Kiểm tra không thiếu `<Suspense>` bọc ngoài `useSearchParams()`.

## Quy tắc sử dụng biến và thuộc tính (Chống đoán mò tên biến)

1. **TUYỆT ĐỐI KHÔNG ĐOÁN MÒ TÊN BIẾN (No Variable Guessing):**
   - Nghiêm cấm việc dùng các toán tử `??` hoặc `||` để nối nhiều biến/thuộc tính có tên gần giống nhau chỉ vì không chắc chắn tên nào đúng.
   - **SAI (Bị cấm):**
     - `const diaDiem = item.diaDiem ?? item.DiaDiem;`
     - `const total = total_DanhMuc ?? total_DanhMucChung;`
   - **ĐÚNG:** Chỉ sử dụng **ĐÚNG MỘT** tên biến/thuộc tính chính xác đã được định nghĩa:
     - `const diaDiem = item.diaDiem;`
     - `const total = total_DanhMuc;`

2. **Bắt buộc kiểm tra codebase trước khi viết code:**
   - Trước khi truy cập một biến, state, hoặc thuộc tính của API/Object, **BẮT BUỘC** phải đọc các file định nghĩa liên quan (Interface, Type, Model, Schema, hoặc file gọi API) để lấy chính xác 100% tên biến (kể cả viết hoa/viết thường như `camelCase`, `PascalCase`, hay `snake_case`).
   - Nếu không tìm thấy định nghĩa rõ ràng trong ngữ cảnh hiện tại, hãy **hỏi lại người dùng** hoặc giữ nguyên tên biến đang có sẵn trong file, tuyệt đối không tự bịa ra tên biến dự phòng (fallback).

3. **Chỉ dùng `??` và `||` cho Giá trị mặc định (Default Value):**
   - Chỉ được phép dùng `??` khi gán một giá trị mặc định cụ thể (literal value như chuỗi, số, mảng rỗng) cho một biến đã xác định rõ tên.
   - **Hợp lệ:** `const total = total_DanhMuc ?? 0;` hoặc `const name = diaDiem ?? "Chưa cập nhật";`.
   - Không được dùng `return response.data?.data ?? response.data` chỉ dùng `return response.data;`
4. **BẮT BUỘC 100% GIAO DIỆN PHẢI RESPONSIVE (Desktop & Mobile-First: iPhone Xs Max, 12 Pro Max):**
   - Không một trang nào được phép chỉ hỗ trợ Desktop mà bỏ quên Mobile.
   - Các nút chức năng, bộ lọc trên mobile **bắt buộc thu gọn vào nút hình 3 gạch (`Menu`)**.
   - Khi click vào nút 3 gạch thì mở rộng danh sách các nút con/bộ lọc, khi click lần nữa thì thu gọn lại (tiết kiệm không gian dọc).
   - Dải Tab điều hướng con bắt buộc cuộn ngang (`overflow-x-auto whitespace-nowrap`), tuyệt đối không để rớt dòng làm xấu layout.
   - Mọi bảng dữ liệu `Table` bắt buộc phải có container chống tràn bề ngang trang web.

---

## 14. Quy chuẩn Kiến trúc Tách Component, Render bằng .map() & Responsive Toàn Hệ Thống (Universal Page Architecture & Responsive Pattern)

> [!CAUTION]
> **YÊU CẦU BẮT BUỘC KHÔNG THỂ THAY THẾ (NON-NEGOTIABLE MANDATE):**
> Bất kỳ component hay page nào được viết ra mà **KHÔNG ĐẠT CHUẨN RESPONSIVE** trên mobile (bị vỡ khung hình, bị tràn ngang trang web, nút bấm chồng chéo, chữ bị cắt cụt hoặc thiếu nút 3 gạch thu gọn) đều bị coi là **KHÔNG ĐẠT CHUẨN KỸ THUẬT** và bắt buộc phải viết lại.

> [!IMPORTANT]
> **Quy chuẩn bắt buộc cho TOÀN BỘ các trang trong hệ thống** (bao gồm Quản trị Sản phẩm, Đơn hàng, Bán hàng, Kho bãi, Khách hàng, Danh mục, Tổng quan Dashboard, v.v.). Mọi trang mới hoặc trang được nâng cấp/refactor đều phải tuân thủ nghiêm ngặt 3 nguyên tắc dưới đây.

### 14.1. Nguyên tắc "Trang Nhạc Trưởng" (Universal Orchestrator Page Pattern)

- ❌ **CẤM**: Viết dồn toàn bộ mã giao diện, logic form, bảng dữ liệu, thanh tìm kiếm, dải lọc và modal vào một file `page.tsx` duy nhất (> 200 - 300 dòng). Không viết code "monolith" (nguyên khối).
- ✅ **BẮT BUỘC**: `page.tsx` chỉ đóng vai trò **nhạc trưởng (Orchestrator)** điều phối luồng dữ liệu:
  - Quản lý state URL query / searchParams, phân trang (`page`, `pageSize`), bộ lọc (`filter`).
  - Gọi các TanStack React Query hooks (`useQuery`, `useMutation`).
  - Quản lý trạng thái mở/đóng modal (`openCreate`, `editingItem`, `openConfirm`).
  - Phân bổ dữ liệu xuống các feature component con chuyên biệt đặt tại `components/<FeatureName>/`:
    - `...FilterBar.tsx`: Thanh tiêu đề, thông tin chào mừng/hướng dẫn, tìm kiếm, chọn chi nhánh/kho và lọc trạng thái.
    - `...KpiGrid.tsx` / `...Ribbon.tsx`: Dải thẻ KPI thống kê tóm tắt đầu trang (render bằng `.map()`).
    - `...Table.tsx`: Bảng dữ liệu chính kèm phân trang, bọc trong container chống tràn ngang.
    - `...Grid.tsx` / `...CardList.tsx`: Chế độ xem dạng thẻ card (nếu hỗ trợ Dual View).
    - `Create...SlideOver.tsx` & `Update...SlideOver.tsx`: Form thêm/sửa độc lập theo Mục 11 (cô lập form state chống re-render).
    - `...Utils.ts` (nếu cần): Các hàm format tiền tệ, ngày tháng, mapping enum dùng riêng cho feature.

### 14.2. Quy tắc Render Danh sách / Thẻ Card bằng `.map()` (Universal Data-Driven UI Pattern)

- ❌ **CẤM**: Copy-paste lặp đi lặp lại khối JSX của các thẻ Card tĩnh, nút bấm bộ lọc, hàng thống kê, hoặc các khối giao diện lặp lại (Hardcoded UI Duplication).
- ✅ **BẮT BUỘC**:
  1. Định nghĩa mảng cấu hình có kiểu dữ liệu TypeScript rõ ràng (`interface ConfigItem`).
  2. Sử dụng `useMemo` bọc mảng cấu hình khi phụ thuộc vào props/state dữ liệu từ API.
  3. Render toàn bộ qua hàm `.map()` với `key` ổn định (`item.id`, không dùng index nếu danh sách có thêm/xóa/sắp xếp).
  4. Mỗi item cấu hình bao gồm: `id`, `title`/`label`, `icon`, `colorClass`/`gradientClass`, `value`, `subText`, `footer`/`actions`.

```tsx
// ✅ Mẫu chuẩn render mảng cấu hình qua .map()
interface KpiCardConfig {
  id: string;
  title: string;
  icon: LucideIcon;
  iconBgClass: string;
  iconColorClass: string;
  gradientClass: string;
  value: React.ReactNode;
  subText: React.ReactNode;
  footer: React.ReactNode;
}

// Render qua .map()
<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-3 lg:gap-4">
  {kpiCards.map((card) => {
    const Icon = card.icon;
    return (
      <Card key={card.id} className={card.gradientClass}>
        <div className="flex items-center justify-between">
          <span>{card.title}</span>
          <div className={card.iconBgClass}>
            <Icon className={card.iconColorClass} />
          </div>
        </div>
        <div>{card.value}</div>
        <div>{card.subText}</div>
        <div>{card.footer}</div>
      </Card>
    );
  })}
</div>;
```

### 14.3. Quy chuẩn Responsive Toàn Diện Trên Màn Hình Nhỏ (Universal Mobile-First: iPhone Xs Max & 12 Pro Max)

Tất cả các trang trong hệ thống phải đảm bảo trải nghiệm hoàn hảo trên Desktop lẫn Mobile (đặc biệt chuẩn màn hình iPhone Xs Max: 414px, iPhone 12/13/14 Pro Max: 428px, và các thiết bị từ 375px trở lên):

1. **Quy tắc Nút 3 gạch (`Menu`) Thu gọn Bộ lọc & Hành động Phụ trên Mobile**:
   - Trên màn hình nhỏ (`lg:hidden` hoặc `sm:hidden`), **CẤM** để hàng loạt dropdown, ô chọn ngày, nút bấm trải dài làm tràn ngập màn hình trước khi xem được dữ liệu chính.
   - **BẮT BUỘC**:
     - Thu gọn toàn bộ bộ lọc chi tiết và nút thao tác phụ vào nút "Bộ lọc" với biểu tượng 3 gạch (`Menu` / `X`).
     - Khi người dùng click nút 3 gạch: mở rộng khối bộ lọc con (`isMobileMenuOpen = true`). Click lần nữa thì đóng gọn lại.
     - Luôn giữ nút Tìm kiếm chính hoặc nút Làm mới / Nút Thêm mới ở vị trí trực quan, dễ thao tác bằng 1 tay.
2. **Dải Tabs & Bộ chọn ngang (Horizontal Scrolling Navigation)**:
   - Tất cả các thanh điều hướng tab con (ví dụ `CategoryNavTabs`, `ProductNavTabs`, `OrderNavTabs`, Preset thời gian...) **bắt buộc** bọc container có `overflow-x-auto whitespace-nowrap`.
   - Tuyệt đối không để các tab bị gãy dòng (line-wrap) làm đội giao diện lên 3-4 dòng trên mobile.
3. **Lưới Thẻ Card & Ribbon Thống Kê (Responsive Grids)**:
   - Dải KPI Ribbon / Thẻ thống kê: dùng `grid-cols-2 md:grid-cols-3 xl:grid-cols-6` hoặc `grid-cols-2 lg:grid-cols-4`.
   - Trên mobile luôn hiển thị đúng **2 cột cân đối**, chữ số co giãn (`text-sm sm:text-base lg:text-xl`), không để 1 cột quá to hoặc 3 cột bị chèn vỡ chữ.
4. **BẮT BUỘC 100% GIAO DIỆN PHẢI RESPONSIVE (Desktop & Mobile-First: iPhone Xs Max, 12 Pro Max):**
   - Không một trang nào được phép chỉ hỗ trợ Desktop mà bỏ quên Mobile.
   - Các nút chức năng, bộ lọc trên mobile **bắt buộc thu gọn vào nút hình 3 gạch (`Menu`)**.
   - Khi click vào nút 3 gạch thì mở rộng danh sách các nút con/bộ lọc, khi click lần nữa thì thu gọn lại (tiết kiệm không gian dọc).
   - Dải Tab điều hướng con bắt buộc cuộn ngang (`overflow-x-auto whitespace-nowrap`), tuyệt đối không để rớt dòng làm xấu layout.
   - Mọi bảng dữ liệu `Table` bắt buộc phải có container chống tràn bề ngang trang web.

5. **Biểu đồ & Khối Trực quan**:
   - Container biểu đồ luôn có `min-w-[340px]` kết hợp cuộn ngang để các cột đồ thị không bị nén về 0px trên màn hình nhỏ.
6. **Quy chuẩn Responsive Mobile (BẮT BUỘC 100% - MANDATORY REQUIREMENT)**:
   - Mọi trang và component khi tạo mới hoặc cập nhật **BẮT BUỘC PHẢI RESPONSIVE HOÀN HẢO** trên tất cả độ phân giải:
     - Desktop lớn (1440px - 1920px)
     - Laptop & Tablet (768px - 1024px)
     - Mobile (375px - 428px, đặc biệt chuẩn kích thước iPhone Xs Max: 414px và iPhone 12/13/14 Pro Max: 428px).
   - Tuyệt đối cấm để giao diện bị vỡ bố cục, tràn viền ngang (horizontal page blowout), đè chữ hoặc nút bấm bị cắt xén.
   - Kiểm tra đầy đủ: Nút 3 gạch (`Menu`) thu gọn bộ lọc, dải Tab cuộn ngang mượt mà, bảng dữ liệu bọc `overflow-x-auto min-w-[...]`, thẻ KPI chia 2 cột cân đối.
