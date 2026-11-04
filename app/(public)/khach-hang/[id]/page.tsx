import { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerDetailPublicView } from "@/components/Customer/Detail/CustomerDetailPublicView";

export const metadata: Metadata = {
  title: "Tra cứu Hồ sơ Khách hàng & Sổ Bảo Hành Điện Tử",
  description:
    "Xem thông tin phương tiện sở hữu, các sản phẩm đã mua và thời hạn sổ bảo hành điện tử chính hãng.",
};

interface PublicCustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicCustomerDetailPage({
  params,
}: PublicCustomerDetailPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-muted/20">
      <Suspense
        fallback={
          <div className="p-6 max-w-6xl mx-auto space-y-6">
            <Skeleton className="h-44 w-full rounded-2xl" />
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        }
      >
        <CustomerDetailPublicView khachHangId={id} isAdminMode={false} />
      </Suspense>
    </main>
  );
}

