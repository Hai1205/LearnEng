"use client";

import { DashboardHeader } from "@/components/commons/admin/layout/dashboard/DashboardHeader";
import { StatsCard } from "@/components/commons/admin/adminDashboard/StatsCard";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  BookOpen,
  BookCheck,
  BookX,
} from "lucide-react";
import { AdminDashboardError } from "./AdminDashboardError";
import { AdminDashboardSkeleton } from "./AdminDashboardSkeleton";
import { useDashboardStatsQuery } from "@/hooks/useDashboardApi";

export default function AdminDashboardClient() {
  const {
    data: dashboardStatsResponse,
    isLoading,
    error,
  } = useDashboardStatsQuery();
  const stats = dashboardStatsResponse?.data?.stats;

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  if (error || !stats) {
    return <AdminDashboardError />;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader title="Dashboard" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Questions"
          value={stats.totalQuestions}
          subtitle="Tổng số câu hỏi trong hệ thống"
          icon={<HelpCircle className="h-4 w-4" />}
          gradient="bg-linear-to-br from-primary to-primary/80 shadow-primary/30 hover:shadow-primary/40"
        />

        <StatsCard
          title="Correct Answers"
          value={stats.correctAnswers}
          subtitle="Số câu trả lời đúng"
          icon={<CheckCircle2 className="h-4 w-4" />}
          gradient="bg-linear-to-br from-green-500 to-green-600 shadow-green-500/30 hover:shadow-green-500/40"
        />

        <StatsCard
          title="Wrong Answers"
          value={stats.wrongAnswers}
          subtitle="Số câu trả lời sai"
          icon={<XCircle className="h-4 w-4" />}
          gradient="bg-linear-to-br from-red-500 to-red-600 shadow-red-500/30 hover:shadow-red-500/40"
        />

        <StatsCard
          title="Total Word"
          value={stats.totalWord}
          subtitle="Tổng số từ vựng"
          icon={<BookOpen className="h-4 w-4" />}
          gradient="bg-linear-to-br from-blue-500 to-blue-600 shadow-blue-500/30 hover:shadow-blue-500/40"
        />

        <StatsCard
          title="Memorized"
          value={stats.memorizedWord}
          subtitle="Từ vựng đã thuộc"
          icon={<BookCheck className="h-4 w-4" />}
          gradient="bg-linear-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/30 hover:shadow-emerald-500/40"
        />

        <StatsCard
          title="Not Memorized"
          value={stats.unmemorizedWord}
          subtitle="Từ vựng chưa thuộc"
          icon={<BookX className="h-4 w-4" />}
          gradient="bg-linear-to-br from-purple-500 to-purple-600 shadow-purple-500/30 hover:shadow-purple-500/40"
        />
      </div>
    </div>
  );
}
