import React from "react";
import { Users } from "lucide-react";
import { CustomerNavTabs } from "@/components/Common/CustomerNavTabs";
import { CustomerCreateButton } from "./CustomerCreateButton";

export function CustomerHeader() {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-border/70">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            <span>Hệ thống</span>
            <span className="text-muted-foreground/60">/</span>
            <span>Kinh doanh</span>
            <span className="text-muted-foreground/60">/</span>
            <span className="text-foreground">Khách hàng</span>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
              <Users className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                Hồ sơ Khách hàng
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                Quản lý khách hàng cá nhân & tổ chức doanh nghiệp, tích hợp thông tin liên hệ và định danh
              </p>
            </div>
          </div>
        </div>

        {/* Action Button: Thêm khách hàng mới */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <CustomerCreateButton />
        </div>
      </div>

      {/* Quick Tab Switcher with Horizontal Scroll */}
      <div className="pt-1 max-w-full">
        <CustomerNavTabs activeTab="customer" />
      </div>
    </div>
  );
}

