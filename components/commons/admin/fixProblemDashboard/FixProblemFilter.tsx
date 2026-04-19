"use client";

import {
  buildOptionFilter,
  IOptionFilter,
  SharedFilter,
} from "../adminTable/SharedFilter";
import { IFixProblemFilter, FixProblemFilterType } from "./FixProblemDashboardClient";

interface FixProblemFilterProps {
  data: IFixProblem[];
  openMenuFilters: boolean;
  setOpenMenuFilters: (open: boolean) => void;
  activeFilters: IFixProblemFilter;
  toggleFilter: (value: string, type: FixProblemFilterType) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  closeMenuFilters: () => void;
}

interface FixProblemFilterSection {
  key: FixProblemFilterType;
  label: string;
  options: IOptionFilter[];
}

export const FixProblemFilter = ({
  data,
  openMenuFilters,
  setOpenMenuFilters,
  activeFilters,
  toggleFilter,
  clearFilters,
  applyFilters,
  closeMenuFilters,
}: FixProblemFilterProps) => {
  const categorySelection = buildOptionFilter(data, "category");
  const errorTypeSelection = buildOptionFilter(data, "errorType");

  const filterSections: FixProblemFilterSection[] = [
    {
      key: "category",
      label: "Category",
      options: categorySelection,
    },
    {
      key: "errorType",
      label: "Error type",
      options: errorTypeSelection,
    },
  ];

  return (
    <SharedFilter<FixProblemFilterType, FixProblemFilterSection>
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
