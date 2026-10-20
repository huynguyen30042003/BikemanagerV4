"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DiaPhuongCapXaSkeletonProps {
  viewMode?: "grid" | "table";
  count?: number;
}

export const DiaPhuongCapXaSkeleton: React.FC<DiaPhuongCapXaSkeletonProps> = ({
  viewMode = "grid",
  count = 8,
}) => {
  if (viewMode === "table") {
    return (
      <Card className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs space-y-3 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-muted/20 border border-border/40 gap-4"
            >
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="h-5 w-16 rounded" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-32 rounded hidden sm:block" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card
          key={i}
          className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs space-y-3 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3.5 w-1/2" />
            <Skeleton className="h-8 w-full rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded" />
              <Skeleton className="h-5 w-10 rounded" />
            </div>
          </div>
          <div className="pt-2 border-t border-border/60 flex items-center justify-end gap-1">
            <Skeleton className="h-8 w-14 rounded-md" />
            <Skeleton className="h-8 w-14 rounded-md" />
          </div>
        </Card>
      ))}
    </div>
  );
};
