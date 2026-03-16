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

const getLevelColor = (level: string) => {
  switch (level) {
    case "Dễ":
      return "bg-green-500";
    case "Trung bình":
      return "bg-yellow-500";
    case "Khó":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export const QuizzTable = ({
  cards,
  isLoading,
  onUpdate,
  onDelete,
  paginationData,
  onPageChange,
  showPagination = false,
}: QuizzTableProps) => {
  const renderMobileCard = (card: IQuizz, index: number) => {
    const no = paginationData
      ? (paginationData.currentPage - 1) * paginationData.pageSize + index + 1
      : index + 1;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            No
          </span>
          <span className="text-sm font-medium">{no}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Category
          </span>
          <span className="max-w-[65%] truncate text-right text-sm capitalize">
            {card.category}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Topic
          </span>
          <span className="max-w-[65%] truncate text-right text-sm capitalize">
            {card.topic}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Level
          </span>
          <div className="inline-flex items-center gap-2 text-sm">
            <span
              className={`h-2 w-2 rounded-full ${getLevelColor(card.level)}`}
            />
            <span className="capitalize">{card.level}</span>
          </div>
        </div>
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Question
          </span>
          <span className="max-w-[65%] text-right text-sm line-clamp-2">
            {card.question}
          </span>
        </div>
      </div>
    );
  };

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
          <span className="capitalize">{card.category}</span>
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
          <span
            className={`h-2 w-2 rounded-full ${getLevelColor(card.level)}`}
          />
          <span className="capitalize">{card.level}</span>
        </div>
      ),
    },
    {
      header: "Question",
      accessor: (card: IQuizz) => (
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
      accessor: (card: IQuizz) => (
        <div className="inline-flex items-center justify-center gap-2">
          <span className="capitalize">{card.options[card.answer]}</span>
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
      mobileCardRenderer={renderMobileCard}
      emptyMessage="No cards found."
      showPagination={showPagination}
      paginationData={paginationData}
      onPageChange={onPageChange}
      mobileTableMinWidthPx={980}
    />
  );
};
