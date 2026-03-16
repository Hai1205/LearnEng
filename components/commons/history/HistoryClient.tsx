"use client";

import { TableSearch } from "@/components/commons/admin/adminTable/TableSearch";
import { useQuizzResultsHistoryQuery } from "@/hooks/useQuizzResultApi";
import { BookOpen, RotateCcw, Target, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ExplainDialog } from "./ExplainDialog";
import HistoryTable from "./HistoryTable";
import { HistoryFilter } from "./HistoryFilter";
// import {
//   HistoryFilter,
//   HistoryFilterType,
//   IHistoryFilter,
// } from "./HistoryFilter";

export type HistoryFilterType = "result" | "category" | "topic" | "level";
export interface IHistoryFilter {
  result: string[];
  category: string[];
  topic: string[];
  level: string[];
  [key: string]: string[];
}
const cardInitialFilters: IHistoryFilter = {
  result: [],
  category: [],
  topic: [],
  level: [],
};

const LABELS = ["A", "B", "C", "D"];
const INITIAL_FILTERS: IHistoryFilter = {
  category: [],
  topic: [],
  level: [],
  result: [],
};

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

export default function HistoryClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuFilters, setOpenMenuFilters] = useState(false);
  const [activeFilters, setActiveFilters] =
    useState<IHistoryFilter>(INITIAL_FILTERS);
  const [selectedItem, setSelectedItem] = useState<IQuizzHistoryItem | null>(
    null,
  );

  // fetch full history once (large size) and perform client-side pagination
  const { data, isLoading, isError, refetch } = useQuizzResultsHistoryQuery(
    1,
    10000,
  );

  const allHistoryItems = data?.data?.results ?? [];
  const stats = data?.data?.stats;

  const closeMenuFilters = () => setOpenMenuFilters(false);

  const toggleFilter = (value: string, type: HistoryFilterType) => {
    setActiveFilters((prev) => {
      const updated = { ...prev };

      if (updated[type]?.includes(value)) {
        updated[type] = updated[type].filter((item) => item !== value);
      } else {
        updated[type] = [...(updated[type] || []), value];
      }

      return updated;
    });
  };

  const clearFilters = () => {
    setActiveFilters(INITIAL_FILTERS);
    setSearchQuery("");
    closeMenuFilters();
  };

  const applyFilters = () => {
    closeMenuFilters();
  };

  const filteredHistoryItems = useMemo(() => {
    let results = [...allHistoryItems];

    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase().trim();
      results = results.filter((item) =>
        [
          item.question,
          item.category,
          item.topic,
          item.selectedAnswerText,
          item.correctAnswerText,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(searchTerm)),
      );
    }

    if (activeFilters.category.length > 0) {
      results = results.filter((item) =>
        activeFilters.category.includes(item.category || ""),
      );
    }

    if (activeFilters.topic.length > 0) {
      results = results.filter((item) =>
        activeFilters.topic.includes(item.topic || ""),
      );
    }

    if (activeFilters.level.length > 0) {
      results = results.filter((item) =>
        activeFilters.level.includes(item.level || ""),
      );
    }

    if (activeFilters.result.length > 0) {
      results = results.filter((item) => {
        const normalizedValue = item.isCorrect ? "correct" : "wrong";
        return activeFilters.result.includes(normalizedValue);
      });
    }

    return results;
  }, [allHistoryItems, searchQuery, activeFilters]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    activeFilters.category.length > 0 ||
    activeFilters.topic.length > 0 ||
    activeFilters.level.length > 0 ||
    activeFilters.result.length > 0;

  useEffect(() => {
    if (hasActiveFilters && currentPage !== 1) {
      setCurrentPage(1);
    }
    // only run when hasActiveFilters changes — do not include currentPage
  }, [hasActiveFilters]);

  // Client-side pagination
  const totalElements = filteredHistoryItems.length;
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
  const paginatedItems = filteredHistoryItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const paginationData = {
    totalElements,
    totalPages,
    currentPage,
    pageSize,
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
  };

  // If current page is out of range after filtering, clamp it to available pages
  useEffect(() => {
    if (currentPage > 1 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const totalDone = stats?.totalDone ?? 0;
  const totalCorrect = stats?.totalCorrect ?? 0;
  const overallAccuracy = stats?.overallAccuracy ?? 0;

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

            <div className="flex w-full sm:w-auto flex-wrap items-center gap-2 sm:gap-3">
              <TableSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                placeholder="Search history..."
              />

              <HistoryFilter
                data={allHistoryItems}
                openMenuFilters={openMenuFilters}
                setOpenMenuFilters={setOpenMenuFilters}
                activeFilters={activeFilters}
                toggleFilter={toggleFilter}
                clearFilters={clearFilters}
                applyFilters={applyFilters}
                closeMenuFilters={closeMenuFilters}
              />

              <button
                onClick={() => {
                  setActiveFilters(INITIAL_FILTERS);
                  setSearchQuery("");
                  refetch();
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/10"
                type="button"
              >
                <RotateCcw className="h-4 w-4" />
                Làm mới
              </button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-blue-400/20 bg-blue-400/10 p-4">
              <p className="mb-1 text-xs uppercase tracking-wide text-blue-300/90">
                Tổng câu đã làm
              </p>
              <p className="inline-flex items-center gap-2 text-2xl font-bold text-white">
                <BookOpen className="h-5 w-5 text-blue-300" />
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

        <HistoryTable
          items={paginatedItems}
          isLoading={isLoading}
          currentPage={currentPage}
          hasActiveFilters={hasActiveFilters}
          onRowClick={(item) => setSelectedItem(item)}
          showPagination={paginationData.totalPages > 1}
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
}
