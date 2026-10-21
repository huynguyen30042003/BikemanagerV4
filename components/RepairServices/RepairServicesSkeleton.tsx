"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function RepairServicesSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-36 rounded-lg" />
          </div>
        </div>

        {/* NavTabs Skeleton */}
        <div className="flex gap-2 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-32 rounded-lg" />
          ))}
        </div>
      </div>

      {/* KPI Ribbon Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="p-3.5 rounded-xl border border-border/60 bg-card/40 space-y-2"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="w-6 h-6 rounded-md" />
            </div>
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Filter Bar Skeleton */}
      <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <Skeleton className="h-9 flex-1 max-w-md rounded-lg" />
          <div className="flex gap-2.5">
            <Skeleton className="h-9 w-44 rounded-lg" />
            <Skeleton className="h-9 w-52 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border border-border/80 bg-card overflow-hidden">
        <div className="p-4 border-b border-border/70 flex justify-between items-center">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-8 w-28" />
        </div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-6 gap-3 pb-2 border-b border-border/50">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-3 items-center py-2.5">
              <Skeleton className="h-6 w-20 rounded" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-28 rounded-full" />
              <Skeleton className="h-5 w-24 ml-auto" />
              <Skeleton className="h-5 w-16 mx-auto" />
              <Skeleton className="h-6 w-16 mx-auto rounded-full" />
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-border/70 flex justify-between items-center">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-64" />
        </div>
      </div>
    </div>
  );
}
