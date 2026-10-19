"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardOverviewApi } from "@/shared/api/Dashboard";
import { DashboardOverviewFilter } from "@/types/dashboard";

export const DASHBOARD_QUERY_KEYS = {
  all: ["dashboard"] as const,
  overview: (filter: DashboardOverviewFilter) =>
    [...DASHBOARD_QUERY_KEYS.all, "overview", filter] as const,
};

export const useGetDashboardOverview = (filter: DashboardOverviewFilter) => {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.overview(filter),
    queryFn: () => getDashboardOverviewApi(filter),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60, // 1 phút
    refetchOnWindowFocus: false,
  });
};
