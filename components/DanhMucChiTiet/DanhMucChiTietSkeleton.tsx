"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DanhMucChiTietSkeletonProps {
  viewMode?: "grid" | "table";
  count?: number;
}

export const DanhMucChiTietSkeleton: React.FC<DanhMucChiTietSkeletonProps> = ({
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
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-28 hidden sm:block" />
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card
          key={i}
          className="rounded-xl border border-border/80 bg-card p-3.5 sm:p-4 shadow-2xs space-y-3 flex flex-col justify-between"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-12 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-5 w-3/4" />
            <div className="space-y-1.5 pt-1">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-4/5" />
            </div>
          </div>
          <div className="pt-2.5 border-t border-border/60 flex items-center justify-between gap-2">
            <Skeleton className="h-6 w-28 rounded-md" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
