"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthStore, useRole, useLogout } from "@/hooks/Auth/useAuth";
import logo from "@/image/logo.png";
import {
  MENU_SECTIONS,
  MenuGroup,
  MenuSection,
  hasRequiredRole,
  formatRoleLabel,
  getUserInitials,
} from "./SiderBarAdmin";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

export function MobileSidebarAdmin() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { user: tokenUser, role: primaryTokenRole } = useRole();
  const logout = useLogout();

  const [isOpen, setIsOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Hợp nhất dữ liệu user
  const currentUser = user || tokenUser;
  const userRoles = useMemo(
    () => currentUser?.roles ?? [],
    [currentUser?.roles],
  );
  const activeRole =
    userRoles.length > 0 ? userRoles[0] : primaryTokenRole || "Quản trị viên";
  const displayName =
    currentUser?.fullName || currentUser?.username || "Quản trị viên";
  const userInitials = getUserInitials(displayName);

  // Lọc MENU_SECTIONS theo role của user
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
              hasRequiredRole(item.roles, userRoles),
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

  // Tự động mở accordion group nếu đang ở route con của group đó
  useEffect(() => {
    const newOpenGroups: Record<string, boolean> = { ...openGroups };
    let hasChanges = false;

    filteredSections.forEach((section) => {
      section.groups.forEach((group) => {
        if (
          group.items &&
          group.items.some((item) => pathname.startsWith(item.href))
        ) {
          if (!newOpenGroups[group.title]) {
            newOpenGroups[group.title] = true;
            hasChanges = true;
          }
        }
      });
    });

    if (hasChanges) {
      setOpenGroups(newOpenGroups);
    }
  }, [pathname, filteredSections]);

  // Tự động đóng drawer khi chuyển trang
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Khóa cuộn trang khi drawer mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Đóng bằng phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout("/login");
    } catch (err) {
      console.error("[Logout Error]", err);
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* 1. Sticky Mobile Top Header Bar (chỉ hiện trên màn hình nhỏ < 1024px) */}
      <header className="lg:hidden sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border/80 h-16 sm:h-18 flex items-center justify-between px-4 sm:px-5 shadow-2xs">
        <div className="flex items-center gap-3">
          {/* Nút mở Hamburger - Kích thước lớn 44px+ dễ chạm ngón tay */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Mở menu điều hướng"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-border/80 bg-background/90 hover:bg-muted text-foreground flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-2xs"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo Brand */}
          <Link
            href="/admin"
            className="flex items-center gap-2.5 group cursor-pointer"
            aria-label="Bảng điều khiển quản trị"
            title="Bike Manager Platform"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
              <Image
                src={logo}
                alt="Bike Manager Logo"
                width={40}
                height={40}
                priority
                className="h-full w-auto object-contain"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base sm:text-lg tracking-tight text-foreground">
                Bike Manager
              </span>
              <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25">
                V4
              </span>
            </div>
          </Link>
        </div>

        {/* User Avatar Chip ở góc phải Topbar - Cỡ lớn dễ nhấn */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 p-1.5 sm:p-2 rounded-xl bg-muted/60 hover:bg-muted border border-border/70 transition-colors cursor-pointer group"
          title={`Đang đăng nhập: ${displayName}`}
        >
          <span className="text-xs sm:text-sm font-semibold text-foreground max-w-[120px] truncate hidden xs:inline-block">
            {displayName.split(" ").slice(-1)[0]}
          </span>
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-2xs relative shrink-0">
            {userInitials}
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-background" />
          </div>
        </button>
      </header>

      {/* 2. Slide-over Mobile Drawer Navigation */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop mờ nền */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Khung nội dung Sidebar cuộn từ cạnh trái (Rộng rãi 88vw - max 380px, to rõ cho điện thoại) */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu quản trị di động"
            className="relative z-50 w-[88vw] max-w-[380px] sm:max-w-[420px] h-full bg-card border-r border-border/80 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 ease-out select-none"
          >
            {/* Header trong Drawer */}
            <div className="h-18 px-5 border-b border-border/80 flex items-center justify-between shrink-0 bg-muted/20">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <Image
                    src={logo}
                    alt="Bike Manager Logo"
                    width={40}
                    height={40}
                    priority
                    className="h-full w-auto object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-lg tracking-tight text-foreground">
                      Bike Manager
                    </span>
                    <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400">
                      V4
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Hệ thống Quản trị & Kinh doanh
                  </p>
                </div>
              </Link>

              {/* Nút đóng X - Kích thước lớn 44px dễ chạm */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-11 h-11 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition-colors cursor-pointer"
                title="Đóng menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Thông tin User & Vai trò - Thẻ hiển thị rộng rãi, avatar lớn */}
            <div className="p-4 border-b border-border/70 bg-muted/30">
              <div className="p-3.5 rounded-2xl bg-background border border-border/80 shadow-2xs flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-xs shrink-0">
                  {userInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm sm:text-base font-bold text-foreground truncate leading-snug">
                    {displayName}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="text-xs text-muted-foreground font-medium truncate">
                      {formatRoleLabel(activeRole)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Danh sách Menu điều hướng cuộn mượt mà (Kích thước nút to 48px, chữ to 15px, icon 20px) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar">
              {filteredSections.map((section, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="px-3 py-1.5 text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">
                    {section.label}
                  </div>

                  <div className="space-y-1">
                    {section.groups.map((group) => {
                      const Icon = group.icon;
                      const hasItems = group.items && group.items.length > 0;
                      const isGroupActive = hasItems
                        ? group.items!.some((item) =>
                            pathname.startsWith(item.href),
                          )
                        : pathname === group.href ||
                          (group.href === "/admin" && pathname === "/");
                      const isExpanded = Boolean(openGroups[group.title]);

                      if (!hasItems) {
                        return (
                          <Link
                            key={group.title}
                            href={group.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3.5 px-4 py-3 min-h-[48px] rounded-xl text-sm sm:text-base font-medium transition-all active:scale-[0.98] ${
                              isGroupActive
                                ? "bg-blue-600 text-white font-semibold shadow-sm"
                                : "text-foreground/80 hover:text-foreground hover:bg-muted/80"
                            }`}
                          >
                            <Icon className="w-5 h-5 shrink-0" />
                            <span className="truncate">{group.title}</span>
                          </Link>
                        );
                      }

                      return (
                        <div key={group.title} className="space-y-1">
                          {/* Accordion Header - Bấm mở menu con */}
                          <button
                            type="button"
                            onClick={() => toggleGroup(group.title)}
                            className={`w-full flex items-center justify-between px-4 py-3 min-h-[48px] rounded-xl text-sm sm:text-base font-medium transition-all active:scale-[0.98] cursor-pointer ${
                              isGroupActive
                                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/20"
                                : "text-foreground/80 hover:text-foreground hover:bg-muted/80"
                            }`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <Icon className="w-5 h-5 shrink-0" />
                              <span className="truncate">{group.title}</span>
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 shrink-0 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {/* Accordion Submenu Items - Nút 44px to rõ, dễ chạm chính xác bằng ngón tay */}
                          {isExpanded && (
                            <div className="pl-4 pr-1 py-1.5 space-y-1 border-l-2 border-border/80 ml-5 my-1.5">
                              {group.items!.map((subItem) => {
                                const SubIcon = subItem.icon;
                                const isSubActive = pathname === subItem.href;

                                return (
                                  <Link
                                    key={subItem.title}
                                    href={subItem.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 min-h-[44px] rounded-xl text-sm font-medium transition-all active:scale-[0.98] ${
                                      isSubActive
                                        ? "bg-blue-600 text-white font-semibold shadow-2xs"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                                    }`}
                                  >
                                    <SubIcon className="w-4 h-4 shrink-0" />
                                    <span className="truncate">
                                      {subItem.title}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer trong Drawer: Nút Đăng xuất to rõ (h-12) và hỗ trợ iOS safe-area */}
            <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-border/80 bg-muted/20 shrink-0 space-y-2.5">
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center gap-2.5 h-12 px-4 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/15 text-rose-600 dark:text-rose-400 text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer shadow-2xs"
              >
                {isLoggingOut ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                <span>
                  {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất tài khoản"}
                </span>
              </button>

              <div className="text-xs text-center text-muted-foreground/60 font-mono">
                Bike Manager • v4.2 Mobile
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MobileSidebarAdmin;
