import { Metadata } from "next";
import { Suspense } from "react";
import { CustomerHeader } from "@/components/Customer/CustomerHeader";
import { CustomerClientView } from "@/components/Customer/CustomerClientView";
import { CustomerPageSkeleton } from "@/components/Customer/CustomerSkeleton";

export const metadata: Metadata = {
  title: "Quản lý khách hàng",
};

interface CustomerPageProps {
  searchParams: Promise<{ tinhId?: string }>;
}

export default async function CustomerPage({ searchParams }: CustomerPageProps) {
  const params = await searchParams;
  const initialTinhId = params.tinhId;

  return (
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-3 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. SSR Header Shell: Rendered ngay lập tức phía server -> LCP = FCP (~1.0s) */}
      <CustomerHeader />

      {/* 2. Client View tương tác (Toolbar, KPI Ribbon, Grid/Table, Lazy Drawers) */}
      <Suspense fallback={<CustomerPageSkeleton />}>
        <CustomerClientView initialTinhId={initialTinhId} />
      </Suspense>
    </div>
  );
}
