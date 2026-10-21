"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const ProductVariantsSkeleton: React.FC = () => {
  return (
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-3 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header Skeleton */}
      <div className="space-y-4 pb-4 border-b border-border/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-44" />
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-7 w-64" />
                <Skeleton className="h-3.5 w-80 max-w-full" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-36 rounded-lg" />
          </div>
        </div>

        {/* 2. Product NavTabs Skeleton */}
        <div className="flex gap-2 pt-1 overflow-hidden">
          <Skeleton className="h-9 w-32 rounded-xl" />
          <Skeleton className="h-9 w-36 rounded-xl" />
          <Skeleton className="h-9 w-36 rounded-xl" />
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
      </div>

      {/* 3. Filter Toolbar Skeleton */}
      <div className="p-3.5 rounded-xl border border-border/80 bg-card space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <Skeleton className="h-9.5 flex-1 rounded-lg" />
          <Skeleton className="h-9.5 w-full sm:w-64 rounded-lg" />
          <Skeleton className="h-9.5 w-20 rounded-lg" />
        </div>
      </div>

      {/* 4. KPI Ribbon Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card key={idx} className="p-4 space-y-2 border-border/70">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="w-7 h-7 rounded-lg" />
            </div>
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-3 w-32" />
          </Card>
        ))}
      </div>

      {/* 5. Main Content Grid Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <Card
            key={idx}
            className="p-4 rounded-xl border border-border/70 space-y-3"
          >
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default ProductVariantsSkeleton;
