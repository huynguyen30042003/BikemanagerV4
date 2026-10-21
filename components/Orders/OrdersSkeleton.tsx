"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const OrdersSkeleton: React.FC = () => {
  return (
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-3 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header Skeleton */}
      <div className="space-y-2 pb-4 border-b border-border/70">
        <Skeleton className="h-4 w-48" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-3.5 w-80" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-36 rounded-lg" />
          </div>
        </div>
      </div>

      {/* 2. NavTabs Skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-9 w-36 rounded-xl" />
        <Skeleton className="h-9 w-36 rounded-xl" />
      </div>

      {/* 3. KPI Ribbon Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      {/* 4. Filter Toolbar Skeleton */}
      <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1">
            <Skeleton className="h-9 rounded-lg" />
            <Skeleton className="h-9 rounded-lg" />
            <Skeleton className="h-9 rounded-lg" />
            <Skeleton className="h-9 rounded-lg" />
          </div>
        </div>
      </div>

      {/* 5. Table Skeleton */}
      <div className="rounded-xl border border-border/80 bg-card overflow-hidden">
        <div className="p-4 border-b border-border/60">
          <div className="flex gap-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24 ml-auto" />
          </div>
        </div>
        <div className="divide-y divide-border/40">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default OrdersSkeleton;
