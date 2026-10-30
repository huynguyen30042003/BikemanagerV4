"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomerModalStore } from "@/store/useCustomerModalStore";

export function CustomerCreateButton() {
  const openCreate = useCustomerModalStore((state) => state.openCreate);

  return (
    <Button
      size="sm"
      onClick={openCreate}
      className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer font-medium"
    >
      <Plus className="w-4 h-4" />
      <span className="text-xs font-medium">Thêm khách hàng</span>
    </Button>
  );
}

