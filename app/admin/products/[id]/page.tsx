import { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductDetailAdminView } from "@/components/Products/Detail/ProductDetailAdminView";

export const metadata: Metadata = {
  title: "Chi tiết sản phẩm & Phương tiện",
};

interface AdminProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProductDetailPage({
  params,
}: AdminProductDetailPageProps) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="p-6 max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      }
    >
      <ProductDetailAdminView sanPhamId={id} />
    </Suspense>
  );
}

