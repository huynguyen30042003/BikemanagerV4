"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function QuocGiaSkeleton() {
  return (
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-4 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 pb-2 sm:pb-4 border-b border-border/70 mb-2 sm:mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-7 w-56" />
                <Skeleton className="h-4 w-80" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>

        {/* Location Nav Tabs Skeleton */}
        <div className="flex items-center gap-2 pt-1">
          <Skeleton className="h-9 w-72 rounded-xl" />
        </div>
      </div>

      {/* 2. KPI Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card
            key={idx}
            className="p-4 rounded-xl border border-border/70 space-y-2"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="w-7 h-7 rounded-lg" />
            </div>
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-3 w-32" />
          </Card>
        ))}
      </div>

      {/* 3. Toolbar Skeleton */}
      <div className="rounded-xl border border-border/80 bg-card p-3 space-y-2.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <Skeleton className="h-9.5 flex-1 rounded-lg" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-52 rounded-lg" />
            <Skeleton className="h-9 w-18 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-lg" />
          </div>
        </div>
      </div>

      {/* 4. Showcase Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <Card
            key={idx}
            className="rounded-xl border border-border/70 p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-20 rounded-md" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-3.5 w-1/2 rounded-md" />
            <div className="pt-2 border-t border-border/40 flex justify-between gap-2">
              <Skeleton className="h-8 flex-1 rounded-lg" />
              <Skeleton className="h-8 flex-1 rounded-lg" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
