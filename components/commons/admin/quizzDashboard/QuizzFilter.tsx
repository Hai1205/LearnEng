"use client";

import {
  buildOptionFilter,
  IOptionFilter,
  SharedFilter,
} from "../adminTable/SharedFilter";
import { IQuizzFilter, QuizzFilterType } from "./QuizzDashboardClient";

interface QuizzFilterProps {
  data: IQuizz[];
  openMenuFilters: boolean;
  setOpenMenuFilters: (open: boolean) => void;
  activeFilters: IQuizzFilter;
  toggleFilter: (value: string, type: QuizzFilterType) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  closeMenuFilters: () => void;
}

interface QuizzFilterSection {
  key: QuizzFilterType;
  label: string;
  options: IOptionFilter[];
}

export const QuizzFilter = ({
  data,
  openMenuFilters,
  setOpenMenuFilters,
  activeFilters,
  toggleFilter,
  clearFilters,
  applyFilters,
  closeMenuFilters,
}: QuizzFilterProps) => {
  const categorySelection = buildOptionFilter(data, "category");
  const topicSelection = buildOptionFilter(data, "topic");
  const levelSelection = buildOptionFilter(data, "level");

  const filterSections: QuizzFilterSection[] = [
    {
      key: "level",
      label: "Level",
      options: levelSelection,
    },
    {
      key: "category",
      label: "Category",
      options: categorySelection,
    },
    {
      key: "topic",
      label: "Topic",
      options: topicSelection,
    },
  ];

  return (
    <SharedFilter<QuizzFilterType, QuizzFilterSection>
      openMenuFilters={openMenuFilters}
      setOpenMenuFilters={setOpenMenuFilters}
      activeFilters={activeFilters as Record<string, string[]>}
      toggleFilter={toggleFilter}
      clearFilters={clearFilters}
      applyFilters={applyFilters}
      closeMenuFilters={closeMenuFilters}
      filterSections={filterSections}
    />
  );
};
