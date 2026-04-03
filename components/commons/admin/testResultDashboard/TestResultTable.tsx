import { DataTable } from "../adminTable/DataTable";
import { Pencil, Trash2 } from "lucide-react";
import { PaginationData } from "@/components/commons/layout/pagination/PaginationControls";
import { MobileTestResultTable } from "./MobileTestResultTable";

interface TestResultTableProps {
  cards: ITestResult[];
  isLoading: boolean;
  onUpdate?: (card: ITestResult) => void;
  onDelete?: (card: ITestResult) => void;
  paginationData?: PaginationData;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
}

export const TestResultTable = ({
  cards,
  isLoading,
  onUpdate,
  onDelete,
  paginationData,
  onPageChange,
  showPagination = false,
}: TestResultTableProps) => {
  const columns = [
    {
      header: "No",
      accessor: (_: ITestResult, index: number) => {
        const baseIndex = paginationData
          ? (paginationData.currentPage - 1) * paginationData.pageSize
          : 0;
        return baseIndex + index + 1;
      },
    },
    {
      header: "Category",
      accessor: (card: ITestResult) => (
        <div className="inline-flex items-center justify-center gap-2">
          <span className="capitalize">{card.category}</span>
        </div>
      ),
    },
    {
      header: "Title",
      accessor: (card: ITestResult) => (
        <div className="inline-flex items-center justify-center gap-2">
          <span className="capitalize">{card.title}</span>
        </div>
      ),
    },
    ...[1, 2, 3, 4, 5, 6, 7].map((n) => ({
      header: `Part ${n}`,
      accessor: (card: ITestResult) => (
        <div className="inline-flex items-center justify-center gap-2">
          <span className="capitalize">{(card as any)[`part${n}`]}</span>
        </div>
      ),
    })),
    {
      header: "Score",
      accessor: (card: ITestResult) => (
        <div className="inline-flex items-center justify-center gap-2">
          <span className="capitalize">
            {card.score ??
              (card.part1 || 0) +
                (card.part2 || 0) +
                (card.part3 || 0) +
                (card.part4 || 0) +
                (card.part5 || 0) +
                (card.part6 || 0) +
                (card.part7 || 0)}
          </span>
        </div>
      ),
    },
  ];

  const actions = [];

  if (onUpdate) {
    actions.push({
      label: "Update",
      onClick: onUpdate,
      icon: Pencil,
    });
  }

  if (onDelete) {
    actions.push({
      label: "Delete",
      onClick: onDelete,
      icon: Trash2,
      className: "hover:bg-destructive/10 hover:text-destructive",
    });
  }

  return (
    <DataTable
      data={cards}
      isLoading={isLoading}
      columns={columns}
      actions={actions}
      getRowKey={(card) => card.id}
      mobileCardRenderer={(item: ITestResult, index: number) => (
        <MobileTestResultTable
          item={item}
          index={index}
          paginationData={paginationData}
        />
      )}
      emptyMessage="No cards found."
      showPagination={showPagination}
      paginationData={paginationData}
      onPageChange={onPageChange}
      mobileTableMinWidthPx={820}
    />
  );
};
