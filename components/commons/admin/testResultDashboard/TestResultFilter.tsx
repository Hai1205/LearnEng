"use client";

import {
  buildOptionFilter,
  IOptionFilter,
  SharedFilter,
} from "../adminTable/SharedFilter";
import {
  TestResultFilterType,
  ITestResultFilter,
} from "./TestResultDashboardClient";

interface TestResultFilterProps {
  data: ITestResult[];
  openMenuFilters: boolean;
  setOpenMenuFilters: (open: boolean) => void;
  activeFilters: ITestResultFilter;
  toggleFilter: (value: string, type: TestResultFilterType) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  closeMenuFilters: () => void;
}

interface TestResultFilterSection {
  key: TestResultFilterType;
  label: string;
  options: IOptionFilter[];
}

export const TestResultFilter = ({
  data,
  openMenuFilters,
  setOpenMenuFilters,
  activeFilters,
  toggleFilter,
  clearFilters,
  applyFilters,
  closeMenuFilters,
}: TestResultFilterProps) => {
  const categorySelection = buildOptionFilter(data, "category");

  const filterSections: TestResultFilterSection[] = [
    {
      key: "category",
      label: "Category",
      options: categorySelection,
    },
  ];

  return (
    <SharedFilter<TestResultFilterType, TestResultFilterSection>
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
