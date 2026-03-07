import { DataTable } from "../adminTable/DataTable";
import { Pencil, Trash2 } from "lucide-react";
import { PaginationData } from "@/components/commons/layout/pagination/PaginationControls";

interface QuizzTableProps {
  cards: IQuizz[];
  isLoading: boolean;
  onUpdate?: (card: IQuizz) => void;
  onDelete?: (card: IQuizz) => void;
  paginationData?: PaginationData;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
}

export const QuizzTable = ({
  cards,
  isLoading,
  onUpdate,
  onDelete,
  paginationData,
  onPageChange,
  showPagination = false,
}: QuizzTableProps) => {
  const columns = [
    {
      header: "No",
      accessor: (_: IQuizz, index: number) => {
        const baseIndex = paginationData
          ? (paginationData.currentPage - 1) * paginationData.pageSize
          : 0;
        return baseIndex + index + 1;
      },
    },
    {
      header: "Category",
      accessor: (card: IQuizz) => (
        <div className="inline-flex items-center justify-center gap-2">
          <span className="capitalize">{card.cat}</span>
        </div>
      ),
    },
    {
      header: "Topic",
      accessor: (card: IQuizz) => (
        <div className="inline-flex items-center justify-center gap-2">
          <span className="capitalize">{card.topic}</span>
        </div>
      ),
    },
    {
      header: "Level",
      accessor: (card: IQuizz) => (
        <div className="inline-flex items-center justify-center gap-2">
          <span className="capitalize">{card.lvl}</span>
        </div>
      ),
    },
    {
      header: "Question",
      accessor: (card: IQuizz) => (
        <div className="inline-flex items-center justify-center gap-2">
          <span className="capitalize">{card.q}</span>
        </div>
      ),
    },
    {
      header: "Answer",
      accessor: (card: IQuizz) => (
        <div className="inline-flex items-center justify-center gap-2">
          <span className="capitalize">{card.opts[card.ans]}</span>
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
      emptyMessage="No cards found."
      showPagination={showPagination}
      paginationData={paginationData}
      onPageChange={onPageChange}
    />
  );
};
