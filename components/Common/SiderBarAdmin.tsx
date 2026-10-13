"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthStore, useRole } from "@/hooks/Auth/useAuth";

import bike from "@/image/bike.svg";

import {
  Barcode,
  Bike,
  Boxes,
  FolderTree,
  History,
  ImageIcon,
  Package,
  ShoppingBag,
  Star,
  Tags,
  Users,
  LucideIcon,
  CreditCard,
  ShoppingCart,
  Truck,
  FileText,
  Warehouse,
  Folder,
  ListTree,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Store,
  Building2,
  Compass,
  Globe,
} from "lucide-react";

type MenuItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: string[];
};

type MenuGroup = {
  title: string;
  href: string;
  icon: LucideIcon;
  items?: MenuItem[];
  roles?: string[];
};

type MenuSection = {
  label: string;
  groups: MenuGroup[];
  roles?: string[];
};

const MENU_SECTIONS: MenuSection[] = [
  {
    label: "Hệ thống",
    roles: ["Administrator"],
    groups: [
      {
        title: "Danh mục",
        href: "/admin/danhMucChung",
        icon: FolderTree,
        roles: ["Administrator"],
        items: [
          {
            title: "Danh mục chung",
            href: "/admin/danhMucChung",
            icon: Folder,
            roles: ["Administrator"],
          },
          {
            title: "Danh mục chi tiết",
            href: "/admin/danhMucChiTiet",
            icon: ListTree,
            roles: ["Administrator"],
          },
        ],
      },
      {
        title: "Địa bàn & Cơ sở",
        href: "/admin/diaDiem",
        icon: Store,
        roles: ["Administrator"],
        items: [
          {
            title: "Chi nhánh & Showroom",
            href: "/admin/diaDiem",
            icon: Store,
            roles: ["Administrator"],
          },
          {
            title: "Cấp Tỉnh & Thành phố",
            href: "/admin/diaPhuongCapTinh",
            icon: Building2,
            roles: ["Administrator"],
          },
          {
            title: "Cấp Xã & Phường",
            href: "/admin/diaPhuongCapXa",
            icon: Compass,
            roles: ["Administrator"],
          },
          {
            title: "Danh mục Quốc gia",
            href: "/admin/quocGia",
            icon: Globe,
            roles: ["Administrator"],
          },
        ],
      },
    ],
  },
  {
    label: "Kinh doanh",
    roles: ["Administrator", "AdminAccess", "SaleAccess"],
    groups: [
      {
        title: "Khách hàng",
        href: "/admin/customer",
        icon: Users,
        roles: ["Administrator", "AdminAccess", "SaleAccess"],
        items: [
          {
            title: "Khách hàng",
            href: "/admin/customer",
            icon: Users,
            roles: ["Administrator", "AdminAccess", "SaleAccess"],
          },
          {
            title: "Đánh giá",
            href: "/admin/customer/statistics",
            icon: Star,
            roles: ["Administrator", "AdminAccess", "SaleAccess"],
          },
          {
            title: "Xe của khách",
            href: "/admin/customer/vehicles",
            icon: Bike,
            roles: ["Administrator", "AdminAccess", "SaleAccess"],
          },
          {
            title: "Lịch sử sở hữu",
            href: "/admin/customer/ownerships",
            icon: History,
            roles: ["Administrator", "AdminAccess", "SaleAccess"],
          },
        ],
      },
      {
        title: "Sản phẩm",
        href: "/admin/products",
        icon: Package,
        roles: ["Administrator", "AdminAccess", "ProductAccess"],
        items: [
          {
            title: "Danh sách sản phẩm",
            href: "/admin/products/manage",
            icon: ShoppingBag,
            roles: ["Administrator", "AdminAccess", "ProductAccess"],
          },
          {
            title: "Thương hiệu",
            href: "/admin/brands",
            icon: Tags,
            roles: ["Administrator", "AdminAccess", "ProductAccess"],
          },
          {
            title: "Quản lý sản phẩm",
            href: "/admin/products",
            icon: Package,
            roles: ["Administrator", "AdminAccess", "ProductAccess"],
          },
          {
            title: "Hình ảnh sản phẩm",
            href: "/admin/product-images",
            icon: ImageIcon,
            roles: ["Administrator", "AdminAccess", "ProductAccess"],
          },
          {
            title: "Biến thể sản phẩm",
            href: "/admin/product-variants",
            icon: Boxes,
            roles: ["Administrator", "AdminAccess", "ProductAccess"],
          },
          {
            title: "Seri sản phẩm",
            href: "/admin/product-serials",
            icon: Barcode,
            roles: ["Administrator", "AdminAccess", "ProductAccess"],
          },
        ],
      },
      {
        title: "Đơn hàng",
        href: "/admin/orders",
        icon: ShoppingCart,
        roles: ["Administrator", "AdminAccess", "OrderAccess", "SaleAccess"],
      },
      {
        title: "Đơn hàng bán",
        href: "/admin/sales",
        icon: ShoppingCart,
        roles: ["Administrator", "AdminAccess", "SaleAccess"],
      },
    ],
  },
  {
    label: "Vận hành & Kho",
    roles: ["Administrator", "AdminAccess", "WarehouseAccess"],
    groups: [
      {
        title: "Trả góp",
        href: "/admin/installment-providers",
        icon: CreditCard,
        roles: ["Administrator", "AdminAccess"],
        items: [
          {
            title: "Nhà cung cấp",
            href: "/admin/installment-providers",
            icon: CreditCard,
            roles: ["Administrator", "AdminAccess"],
          },
          {
            title: "Hợp đồng",
            href: "/admin/installment-contracts",
            icon: Package,
            roles: ["Administrator", "AdminAccess"],
          },
        ],
      },
      {
        title: "Mua hàng",
        href: "/admin/suppliers",
        icon: Truck,
        roles: ["Administrator", "AdminAccess", "PurchaseAccess"],
        items: [
          {
            href: "/admin/suppliers",
            title: "Nhà cung cấp",
            icon: Truck,
            roles: ["Administrator", "AdminAccess", "PurchaseAccess"],
          },
          {
            title: "Đơn mua hàng",
            href: "/admin/purchase-orders",
            icon: FileText,
            roles: ["Administrator", "AdminAccess", "PurchaseAccess"],
          },
        ],
      },
      {
        title: "Kho hàng",
        href: "/admin/warehouses",
        icon: Warehouse,
        roles: ["Administrator", "AdminAccess", "WarehouseAccess"],
      },
    ],
  },
];

const hasRequiredRole = (
  requiredRoles: string[] | undefined,
  userRoles: string[]
): boolean => {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  if (!userRoles || userRoles.length === 0) return false;

  const normalizedUserRoles = userRoles.map((r) => r.toLowerCase().trim());
  return requiredRoles.some((role) =>
    normalizedUserRoles.includes(role.toLowerCase().trim())
  );
};

export default function SiderBarAdmin() {
  const pathname = usePathname();
  const { user, fetchUser, clearUser, isAdmin } = useAuthStore();
  const [isClose, setIsClose] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(270);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  const userRoles = useMemo(() => user?.roles ?? [], [user?.roles]);

  // Lọc MENU_SECTIONS theo đúng role của user
  const filteredSections = useMemo(() => {
    return MENU_SECTIONS.map((section) => {
      if (!hasRequiredRole(section.roles, userRoles)) {
        return null;
      }

      const visibleGroups = section.groups
        .map((group) => {
          if (!hasRequiredRole(group.roles, userRoles)) {
            return null;
          }

          if (group.items && group.items.length > 0) {
            const visibleItems = group.items.filter((item) =>
              hasRequiredRole(item.roles, userRoles)
            );
            if (visibleItems.length === 0) return null;

            return {
              ...group,
              items: visibleItems,
            };
          }

          return group;
        })
        .filter((g): g is MenuGroup => g !== null);

      if (visibleGroups.length === 0) return null;

      return {
        ...section,
        groups: visibleGroups,
      };
    }).filter((s): s is MenuSection => s !== null);
  }, [userRoles]);


  // Danh sách phẳng tất cả groups để tính activeParentTitle
  const allGroups = useMemo(
    () => filteredSections.flatMap((s) => s.groups),
    [filteredSections]
  );

  // Nhận diện group đang active từ pathname
  const activeParentTitle =
    allGroups.find((group) =>
      group?.items?.some((item) => pathname.startsWith(item.href))
    )?.title ?? null;


  const [toggledMenu, setToggledMenu] = useState<string | null>(null);

  // Resize Handler
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = e.clientX;
      const minWidth = 72;
      const maxWidth = 380;
      const width = Math.min(Math.max(newWidth, minWidth), maxWidth);

      setSidebarWidth(width);

      if (width <= 110) {
        setIsClose(true);
      } else if (width > 160) {
        setIsClose(false);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // Responsive mobile/tablet auto collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsClose(true);
      } else {
        setIsClose(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside
      style={{
        width: isClose ? 72 : sidebarWidth,
      }}
      className={`
        relative sticky top-0 h-screen flex flex-col
        border-r border-border/80 bg-card select-none
        ${!isResizing ? "transition-[width] duration-300 ease-in-out" : ""}
      `}
    >
      {/* 1. Header & Brand Identity */}
      <div
        className={`h-16 px-4 border-b border-border/70 flex items-center shrink-0 transition-all duration-300 ${
          isClose ? "justify-center" : "justify-between"
        }`}
      >
        <Link
          href="/admin"
          className="flex items-center gap-3 overflow-hidden group"
          title="Bike Manager Platform"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
            <Image src={bike} alt="logo" width={22} height={22} priority />
          </div>

          <div
            className={`flex flex-col min-w-0 transition-all duration-300 ease-in-out overflow-hidden ${
              isClose
                ? "max-w-0 opacity-0 -translate-x-2 pointer-events-none"
                : "max-w-[200px] opacity-100 translate-x-0"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-foreground truncate">
                Bike Manager
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="truncate">
                {user?.roles?.join(',') || "Quản trị viên"}
              </span>
            </div>
          </div>
        </Link>

        {/* Toggle Button in Header when open */}
        {!isClose && (
          <button
            type="button"
            onClick={() => setIsClose(true)}
            className="w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            title="Thu gọn menu"
          >
            <ChevronLeft className="w-4 h-4 transition-transform hover:-translate-x-0.5" />
          </button>
        )}
      </div>

      {/* 2. Menu Navigation List (Categorized Sections) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2.5 space-y-4 scrollbar-thin">
        {filteredSections.map((section, sectionIdx) => (
          <div key={section.label} className="space-y-1">
            {/* Section Header Label */}
            {!isClose ? (
              <div className="px-3 pt-1 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 select-none">
                {section.label}
              </div>
            ) : sectionIdx > 0 ? (
              <div className="h-px bg-border/40 mx-2 my-1.5" />
            ) : null}

            {/* Groups in this Section */}
            <div className="space-y-0.5">
              {section.groups.map((group) => {
                const GroupIcon = group.icon;
                const hasChildren = Boolean(group.items && group.items.length > 0);

                // Menu mở nếu người dùng mở nó hoặc nó là parent của route hiện tại
                const isOpen =
                  toggledMenu !== null
                    ? toggledMenu === group.title
                    : activeParentTitle === group.title;

                const isGroupActive = hasChildren
                  ? group.items!.some((sub) => pathname.startsWith(sub.href))
                  : pathname === group.href;

                return (
                  <div key={group.title} className="space-y-0.5">
                    {hasChildren ? (
                      <>
                        {/* Parent Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (isClose) {
                              setIsClose(false);
                              setToggledMenu(group.title);
                            } else {
                              setToggledMenu(isOpen ? "" : group.title);
                            }
                          }}
                          title={isClose ? group.title : undefined}
                          className={`
                            group w-full rounded-xl px-3 py-2 text-sm font-medium
                            flex items-center transition-all duration-200 cursor-pointer active:scale-[0.98]
                            ${
                              isGroupActive
                                ? "bg-blue-50/80 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-semibold shadow-xs"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                            }
                            ${isClose ? "justify-center" : "justify-between"}
                          `}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <GroupIcon
                              className={`w-4.5 h-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                                isGroupActive
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-muted-foreground group-hover:text-foreground"
                              }`}
                            />

                            {!isClose && (
                              <span className="truncate">{group.title}</span>
                            )}
                          </div>

                          {!isClose && (
                            <ChevronDown
                              className={`w-3.5 h-3.5 shrink-0 transition-transform duration-300 ease-in-out ${
                                isOpen
                                  ? "rotate-180 text-blue-600 dark:text-blue-400"
                                  : "text-muted-foreground/70 group-hover:text-foreground rotate-0"
                              }`}
                            />
                          )}
                        </button>

                        {/* Submenu Children (Animated Accordion) */}
                        <div
                          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                            isOpen && !isClose
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0 pointer-events-none"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="mt-0.5 ml-4.5 pl-2.5 border-l-2 border-border/70 space-y-0.5 py-0.5">
                              {group.items!.map((subItem) => {
                                const SubIcon = subItem.icon;
                                const isSubActive = pathname === subItem.href;

                                return (
                                  <Link
                                    key={subItem.href}
                                    href={subItem.href}
                                    className={`
                                      group/sub rounded-lg px-2.5 py-1.5 text-xs font-medium
                                      flex items-center gap-2.5 transition-all duration-200 ease-out
                                      hover:translate-x-1 active:scale-[0.98]
                                      ${
                                        isSubActive
                                          ? "bg-blue-600 text-white shadow-xs font-semibold translate-x-1"
                                          : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                                      }
                                    `}
                                  >
                                    <SubIcon
                                      className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover/sub:scale-110 ${
                                        isSubActive
                                          ? "text-white"
                                          : "text-muted-foreground group-hover/sub:text-foreground"
                                      }`}
                                    />
                                    <span className="truncate">{subItem.title}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Single Menu Item (No Submenu) */
                      <Link
                        href={group.href}
                        title={isClose ? group.title : undefined}
                        className={`
                          group w-full rounded-xl px-3 py-2 text-sm font-medium
                          flex items-center gap-3 transition-all duration-200 active:scale-[0.98]
                          ${
                            isGroupActive
                              ? "bg-blue-600 text-white shadow-xs font-semibold"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                          }
                          ${isClose ? "justify-center" : ""}
                        `}
                      >
                        <GroupIcon
                          className={`w-4.5 h-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                            isGroupActive
                              ? "text-white"
                              : "text-muted-foreground group-hover:text-foreground"
                          }`}
                        />
                        {!isClose && (
                          <span className="truncate">{group.title}</span>
                        )}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Footer Toggle / Expand Button */}
      <div className="p-3 border-t border-border/70 shrink-0 bg-muted/20 flex items-center justify-between">
        {!isClose ? (
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <span className="text-[11px] font-mono text-muted-foreground/70">
              v4.0.0 · Core
            </span>
            <button
              type="button"
              onClick={() => setIsClose(true)}
              className="px-2 py-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center gap-1 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer text-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5 transition-transform hover:-translate-x-0.5" />
              <span>Thu gọn</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsClose(false)}
            className="w-full py-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-blue-600 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            title="Mở rộng menu"
          >
            <ChevronRight className="w-4 h-4 transition-transform hover:translate-x-0.5" />
          </button>
        )}
      </div>

      {/* 4. Draggable Resizing Edge Handle */}
      <div
        onMouseDown={() => setIsResizing(true)}
        className="
          absolute top-0 right-0 h-full w-1.5 cursor-col-resize
          hover:bg-blue-500/80 active:bg-blue-600 transition-colors z-20
        "
        title="Kéo để thay đổi kích thước sidebar"
      />
    </aside>
  );
}
