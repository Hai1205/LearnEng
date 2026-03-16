"use client";

import {
  buildOptionFilter,
  IOptionFilter,
  SharedFilter,
} from "../admin/adminTable/SharedFilter";
import { HistoryFilterType, IHistoryFilter } from "./HistoryClient";

interface IHistoryFilterProps {
  data: IQuizzHistoryItem[];
  openMenuFilters: boolean;
  setOpenMenuFilters: (open: boolean) => void;
  activeFilters: IHistoryFilter;
  toggleFilter: (value: string, type: HistoryFilterType) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  closeMenuFilters: () => void;
}

interface HistoryFilterSection {
  key: HistoryFilterType;
  label: string;
  options: IOptionFilter[];
}

export const HistoryFilter = ({
  data,
  openMenuFilters,
  setOpenMenuFilters,
  activeFilters,
  toggleFilter,
  clearFilters,
  applyFilters,
  closeMenuFilters,
}: IHistoryFilterProps) => {
  const resultSelection: IOptionFilter[] = [
    { label: "Đúng", value: "correct" },
    { label: "Sai", value: "wrong" },
  ];
  const categorySelection = buildOptionFilter(data, "category");
  const topicSelection = buildOptionFilter(data, "topic");
  const levelSelection = buildOptionFilter(data, "level");

  const filterSections: HistoryFilterSection[] = [
    {
      key: "result",
      label: "Kết quả",
      options: resultSelection,
    },
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
    <SharedFilter<HistoryFilterType, HistoryFilterSection>
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
