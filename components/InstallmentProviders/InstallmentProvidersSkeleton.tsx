"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const InstallmentProvidersSkeleton: React.FC = () => {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-3.5 w-80" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      {/* 2. NavTabs Skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-9 w-40 rounded-xl" />
        <Skeleton className="h-9 w-40 rounded-xl" />
      </div>

      {/* 3. KPI Ribbon Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card key={idx} className="p-4 space-y-2 border-border/70">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="w-7 h-7 rounded-lg" />
            </div>
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-3 w-28" />
          </Card>
        ))}
      </div>

      {/* 4. Filter Toolbar Skeleton */}
      <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <Skeleton className="h-9 w-full sm:w-96 rounded-lg" />
          <Skeleton className="h-9 w-full sm:w-64 rounded-lg" />
        </div>
      </div>

      {/* 5. Table Skeleton */}
      <Card className="p-4 border-border/80 space-y-3">
        <Skeleton className="h-10 w-full rounded-lg" />
        {Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton key={idx} className="h-12 w-full rounded-lg" />
        ))}
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-48 rounded-lg" />
        </div>
      </Card>
    </div>
  );
};
