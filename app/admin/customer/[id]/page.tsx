import { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerDetailPublicView } from "@/components/Customer/Detail/CustomerDetailPublicView";

export const metadata: Metadata = {
  title: "Chi tiết hồ sơ khách hàng & Sổ bảo hành",
};

interface AdminCustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCustomerDetailPage({
  params,
}: AdminCustomerDetailPageProps) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="p-6 max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      }
    >
      <CustomerDetailPublicView khachHangId={id} isAdminMode={true} />
    </Suspense>
  );
}
