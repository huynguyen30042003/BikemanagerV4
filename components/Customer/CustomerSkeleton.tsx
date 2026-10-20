"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomerSkeletonProps {
  viewMode?: "grid" | "table";
}

export const CustomerSkeleton: React.FC<CustomerSkeletonProps> = ({
  viewMode = "grid",
}) => {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <Card
            key={idx}
            className="rounded-xl border border-border/70 p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <div className="space-y-1.5 pt-2 border-t border-border/40">
              <Skeleton className="h-3.5 w-full rounded" />
              <Skeleton className="h-3.5 w-2/3 rounded" />
            </div>
            <div className="pt-2 border-t border-border/40 flex justify-between gap-2">
              <Skeleton className="h-7 w-20 rounded-md" />
              <div className="flex gap-1">
                <Skeleton className="h-7 w-7 rounded-lg" />
                <Skeleton className="h-7 w-7 rounded-lg" />
              </div>
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
