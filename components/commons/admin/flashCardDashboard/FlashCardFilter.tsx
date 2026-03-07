"use client";

import {
  buildOptionFilter,
  IOptionFilter,
  SharedFilter,
} from "../adminTable/SharedFilter";
import {
  FlashCardFilterType,
  IFlashCardFilter,
} from "./FlashCardDashboardClient";

interface FlashCardFilterProps {
  data: IFlashCard[];
  openMenuFilters: boolean;
  setOpenMenuFilters: (open: boolean) => void;
  activeFilters: IFlashCardFilter;
  toggleFilter: (value: string, type: FlashCardFilterType) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  closeMenuFilters: () => void;
}

interface FlashCardFilterSection {
  key: FlashCardFilterType;
  label: string;
  options: IOptionFilter[];
}

export const FlashCardFilter = ({
  data,
  openMenuFilters,
  setOpenMenuFilters,
  activeFilters,
  toggleFilter,
  clearFilters,
  applyFilters,
  closeMenuFilters,
}: FlashCardFilterProps) => {
  const topicSelection = buildOptionFilter(data, "topic");

  const filterSections: FlashCardFilterSection[] = [
    {
      key: "topic",
      label: "Topic",
      options: topicSelection,
    },
  ];

  return (
    <SharedFilter<FlashCardFilterType, FlashCardFilterSection>
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
