import { DataTable } from "../adminTable/DataTable";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { PaginationData } from "@/components/commons/layout/pagination/PaginationControls";
import { MobileFixProblemTable } from "./MobileFixProblemTable";

interface FixProblemTableProps {
  cards: IFixProblem[];
  isLoading: boolean;
  onView?: (card: IFixProblem) => void;
  onUpdate?: (card: IFixProblem) => void;
  onDelete?: (card: IFixProblem) => void;
  paginationData?: PaginationData;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
}

export const FixProblemTable = ({
  cards,
  isLoading,
  onView,
  onUpdate,
  onDelete,
  paginationData,
  onPageChange,
  showPagination = false,
}: FixProblemTableProps) => {
  const columns = [
    {
      header: "No",
      accessor: (_: IFixProblem, index: number) => {
        const baseIndex = paginationData
        ? (paginationData.currentPage - 1) * paginationData.pageSize
        : 0;
        return baseIndex + index + 1;
      },
    },
    {
      header: "Category",
      accessor: (card: IFixProblem) => (
        <div className="inline-flex items-center justify-center gap-2">
          <span title={card.category}>
            {card.category.length > 50
              ? card.category.substring(0, 50) + "..."
              : card.category}
          </span>
        </div>
      ),
    },
    {
      header: "Question",
      accessor: (card: IFixProblem) => (
        <div className="inline-flex items-center justify-center gap-2">
          <span title={card.question}>
            {card.question.length > 50
              ? card.question.substring(0, 50) + "..."
              : card.question}
          </span>
        </div>
      ),
    },
    {
      header: "Answer",
      accessor: (card: IFixProblem) => (
        <div className="inline-flex items-center justify-center gap-2">
          <span className="capitalize">{card.answer}</span>
        </div>
      ),
    },
  ];

  const actions = [];

  if (onView) {
    actions.push({
      label: "View",
      onClick: onView,
      icon: Eye,
    });
  }
  
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
      mobileCardRenderer={(item: IFixProblem, index: number) => (
        <MobileFixProblemTable
          item={item}
          index={index}
          paginationData={paginationData}
        />
      )}
      emptyMessage="No cards found."
      showPagination={showPagination}
      paginationData={paginationData}
      onPageChange={onPageChange}
      mobileTableMinWidthPx={980}
    />
  );
};
