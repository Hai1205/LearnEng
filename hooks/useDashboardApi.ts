import { useQuery } from "@tanstack/react-query";

const DASHBOARD_STATS_KEY = ["dashboard-stats"];

async function fetchDashboardStats(): Promise<{
    data: { stats: IDashboardStats };
}> {
    const res = await fetch("/api/dashboard/stats");
    if (!res.ok) throw new Error("Failed to fetch dashboard stats");
    return res.json();
}

export function useDashboardStatsQuery() {
    return useQuery({
        queryKey: DASHBOARD_STATS_KEY,
        queryFn: fetchDashboardStats,
        staleTime: 60 * 1000,
        refetchInterval: 60 * 1000,
    });
}
