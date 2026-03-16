"use client";

import { DataTable } from "@/components/commons/admin/adminTable/DataTable";
import { PaginationData } from "@/components/commons/layout/pagination/PaginationControls";
import { Badge } from "@/components/ui/badge";
import { formatDateAgo } from "@/lib/utils";
import { getLabel } from "./HistoryClient";

interface HistoryTableProps {
  items: IQuizzHistoryItem[];
  isLoading: boolean;
  currentPage: number;
  hasActiveFilters: boolean;
  paginationData: PaginationData;
  onPageChange: (page: number) => void;
  onRowClick: (item: IQuizzHistoryItem) => void;
  showPagination: boolean;
}

export const HistoryTable = ({
  items,
  isLoading,
  currentPage,
  hasActiveFilters,
  paginationData,
  onPageChange,
  onRowClick,
  showPagination = false,
}: HistoryTableProps) => {
  const columns = [
    {
      header: "No",
      accessor: (_: IQuizzHistoryItem, index: number) => {
        const baseIndex = paginationData
          ? (paginationData.currentPage - 1) * paginationData.pageSize
          : 0;
        return baseIndex + index + 1;
      },
    },
    {
      header: "Topic",
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
      header: "Level",
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
      header: "Question",
      className: "max-w-[460px]",
      accessor: (item: IQuizzHistoryItem) => (
        <p className="line-clamp-2 text-left text-sm text-foreground/90">
          {item.question || "Câu hỏi không còn tồn tại"}
        </p>
      ),
    },
    {
      header: "Chosen Answer",
      accessor: (item: IQuizzHistoryItem) => (
        <span className="text-sm text-foreground/80">
          {getLabel(item.selectedAnswer)}. {item.selectedAnswerText || "-"}
        </span>
      ),
    },
    {
      header: "Correct Answer",
      accessor: (item: IQuizzHistoryItem) => (
        <span className="text-sm text-emerald-500">
          {getLabel(item.correctAnswer)}. {item.correctAnswerText || "-"}
        </span>
      ),
    },
    {
      header: "Result",
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
      header: "Answered At",
      accessor: (item: IQuizzHistoryItem) => (
        <span className="text-xs text-muted-foreground">
          {formatDateAgo(item.answeredAt)}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      data={items}
      isLoading={isLoading}
      columns={columns}
      emptyMessage={
        hasActiveFilters
          ? "Không tìm thấy kết quả phù hợp với bộ lọc."
          : "Bạn chưa có lịch sử làm quiz."
      }
      onRowClick={onRowClick}
      showPagination={showPagination}
      paginationData={paginationData}
      onPageChange={onPageChange}
    />
  );
};

export default HistoryTable;
