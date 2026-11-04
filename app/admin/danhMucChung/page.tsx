import { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DanhMucChungClientView } from "@/components/DanhMucChung";

export const metadata: Metadata = {
  title: "Quản lý danh mục dùng chung",
};

export default function DanhMucChungPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      }
    >
      <DanhMucChungClientView />
    </Suspense>
  );
}
