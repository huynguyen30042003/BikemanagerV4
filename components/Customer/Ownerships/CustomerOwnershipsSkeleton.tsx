"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomerOwnershipsSkeletonProps {
  viewMode?: "grid" | "table";
}

export const CustomerOwnershipsSkeleton: React.FC<CustomerOwnershipsSkeletonProps> = ({
  viewMode = "table",
}) => {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="p-4 rounded-xl border border-border/70 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-24 rounded" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="pt-2 border-t border-border/50 flex justify-between items-center">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card className="p-6 rounded-xl border border-border/80 shadow-xs">
      <Skeleton className="h-10 w-full mb-3 rounded-lg" />
      <Skeleton className="h-12 w-full mb-2 rounded-lg" />
      <Skeleton className="h-12 w-full mb-2 rounded-lg" />
      <Skeleton className="h-12 w-full mb-2 rounded-lg" />
      <Skeleton className="h-12 w-full rounded-lg" />
    </Card>
  );
};
