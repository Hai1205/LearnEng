"use client";

import { DataTable } from "@/components/commons/admin/adminTable/DataTable";
import { Badge } from "@/components/ui/badge";
import { useQuizzResultsHistoryQuery } from "@/hooks/useQuizzResultApi";
import { formatDateAgo } from "@/lib/utils";
import { BookOpen, RotateCcw, Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import { ExplainDialog } from "./ExplainDialog";

const LABELS = ["A", "B", "C", "D"];
const PAGE_SIZE = 10;

export const getLabel = (index: number): string => {
  const safeIndex = Number(index);
  if (
    !Number.isInteger(safeIndex) ||
    safeIndex < 0 ||
    safeIndex >= LABELS.length
  ) {
    return "-";
  }

  return LABELS[safeIndex];
};

export const HistoryClient = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<IQuizzHistoryItem | null>(
    null,
  );

  const { data, isLoading, isError, refetch } = useQuizzResultsHistoryQuery(
    currentPage,
    PAGE_SIZE,
  );

  const historyItems = data?.data?.results ?? [];
  const paginationData = data?.data?.pagination;
  const stats = data?.data?.stats;

  const totalDone = stats?.totalDone ?? 0;
  const totalCorrect = stats?.totalCorrect ?? 0;
  const overallAccuracy = stats?.overallAccuracy ?? 0;

  const columns = [
    {
      header: "No",
      accessor: (_item: IQuizzHistoryItem, index: number) => {
        const baseIndex = paginationData
          ? (paginationData.currentPage - 1) * paginationData.pageSize
          : 0;
        return baseIndex + index + 1;
      },
    },
    {
      header: "Chủ đề",
      accessor: (item: IQuizzHistoryItem) => (
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground capitalize">
            {item.category || "-"}
          </p>
          <p className="text-xs text-muted-foreground capitalize">
            {item.topic || "-"}
          </p>
        </div>
      ),
    },
    {
      header: "Độ khó",
      accessor: (item: IQuizzHistoryItem) => (
        <Badge
          variant="secondary"
          className={
            item.level === "Dễ"
              ? "bg-emerald-500/20 text-emerald-500"
              : item.level === "Trung bình"
                ? "bg-amber-500/20 text-amber-500"
                : "bg-rose-500/20 text-rose-500"
          }
        >
          {item.level || "-"}
        </Badge>
      ),
    },
    {
      header: "Câu hỏi",
      className: "max-w-[460px]",
      accessor: (item: IQuizzHistoryItem) => (
        <p className="line-clamp-2 text-left text-sm text-foreground/90">
          {item.question || "Câu hỏi không còn tồn tại"}
        </p>
      ),
    },
    {
      header: "Đã chọn",
      accessor: (item: IQuizzHistoryItem) => (
        <span className="text-sm text-foreground/80">
          {getLabel(item.selectedAnswer)}. {item.selectedAnswerText || "-"}
        </span>
      ),
    },
    {
      header: "Đáp án",
      accessor: (item: IQuizzHistoryItem) => (
        <span className="text-sm text-emerald-500">
          {getLabel(item.correctAnswer)}. {item.correctAnswerText || "-"}
        </span>
      ),
    },
    {
      header: "Kết quả",
      accessor: (item: IQuizzHistoryItem) => (
        <Badge
          className={
            item.isCorrect
              ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
              : "bg-rose-500/15 text-rose-500 border-rose-500/30"
          }
          variant="outline"
        >
          {item.isCorrect ? "Đúng" : "Sai"}
        </Badge>
      ),
    },
    {
      header: "Thời gian",
      accessor: (item: IQuizzHistoryItem) => (
        <span className="text-xs text-muted-foreground">
          {formatDateAgo(item.answeredAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0d1117] via-[#161b22] to-[#0d1117] p-5 md:p-8">
      <div className="mx-auto w-full max-w-350 space-y-5">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-white md:text-3xl">
                Lịch sử làm Quiz
              </h1>
              <p className="mt-1 text-sm text-white/60">
                Theo dõi toàn bộ câu bạn đã trả lời gần đây.
              </p>
            </div>

            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/10"
              type="button"
            >
              <RotateCcw className="h-4 w-4" />
              Làm mới
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4">
              <p className="mb-1 text-xs uppercase tracking-wide text-emerald-300/90">
                Tổng câu đã làm
              </p>
              <p className="inline-flex items-center gap-2 text-2xl font-bold text-white">
                <BookOpen className="h-5 w-5 text-emerald-300" />
                {totalDone}
              </p>
            </div>
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4">
              <p className="mb-1 text-xs uppercase tracking-wide text-emerald-300/90">
                Câu đúng
              </p>
              <p className="inline-flex items-center gap-2 text-2xl font-bold text-white">
                <Target className="h-5 w-5 text-emerald-300" />
                {totalCorrect}
              </p>
            </div>
            <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4">
              <p className="mb-1 text-xs uppercase tracking-wide text-amber-300/90">
                Độ chính xác
              </p>
              <p className="inline-flex items-center gap-2 text-2xl font-bold text-white">
                <TrendingUp className="h-5 w-5 text-amber-300" />
                {overallAccuracy}%
              </p>
            </div>
          </div>
        </div>

        {isError ? (
          <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            Không tải được lịch sử làm bài. Vui lòng thử lại.
          </div>
        ) : null}

        <DataTable
          data={historyItems}
          isLoading={isLoading}
          columns={columns}
          emptyMessage="Bạn chưa có lịch sử làm quiz."
          onRowClick={(item) => setSelectedItem(item)}
          showPagination={Boolean(paginationData)}
          paginationData={paginationData}
          onPageChange={setCurrentPage}
        />

        <ExplainDialog
          selectedItem={selectedItem}
          onOpenChange={(open) => {
            if (!open) setSelectedItem(null);
          }}
        />
      </div>
    </div>
  );
};
