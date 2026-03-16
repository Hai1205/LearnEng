"use client";

import { PaginationData } from "@/components/commons/layout/pagination/PaginationControls";
import { ReactNode } from "react";

export const getRowNumber = (
  index: number,
  paginationData?: PaginationData,
): number => {
  return paginationData
    ? (paginationData.currentPage - 1) * paginationData.pageSize + index + 1
    : index + 1;
};

interface DetailRowProps {
  label: string;
  children: ReactNode;
  className?: string;
  capitalize?: boolean;
}

export const DetailRow = ({
  label,
  children,
  className,
  capitalize = false,
}: DetailRowProps) => {
  return (
    <div
      className={`flex items-center justify-between gap-2 ${className || ""}`}
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span
        className={`max-w-[65%] truncate text-right text-sm ${capitalize ? "capitalize" : ""}`}
      >
        {children}
      </span>
    </div>
  );
};

// MobileDetailList: render a list of labeled rows defined by an items array
export type MobileDetailItem<T> = {
  label: string;
  render: (item: T, index?: number) => ReactNode;
  className?: string;
  capitalize?: boolean;
};

interface MobileDetailListProps<T> {
  items: MobileDetailItem<T>[];
  item: T;
  index?: number;
}

export const MobileDetailList = <T,>({
  items,
  item,
  index,
}: MobileDetailListProps<T>) => {
  return (
    <div className="space-y-2">
      {items.map((r, i) => (
        <div key={r.label + i}>
          <DetailRow
            label={r.label}
            className={r.className}
            capitalize={r.capitalize}
          >
            {r.render(item, index ?? 0)}
          </DetailRow>
        </div>
      ))}
    </div>
  );
};
