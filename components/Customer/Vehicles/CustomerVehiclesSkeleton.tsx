"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomerVehiclesSkeletonProps {
  viewMode?: "grid" | "table";
}

export const CustomerVehiclesSkeleton: React.FC<CustomerVehiclesSkeletonProps> = ({
  viewMode = "table",
}) => {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="p-4 rounded-xl border border-border/70 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-3.5 w-20 rounded" />
                </div>
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="p-3 bg-muted/40 rounded-lg space-y-2 border border-border/40">
              <Skeleton className="h-3.5 w-full rounded" />
              <Skeleton className="h-3.5 w-full rounded" />
              <Skeleton className="h-3.5 w-3/4 rounded" />
            </div>
            <div className="pt-2 border-t border-border/50 flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
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
