import { DataTable } from "../adminTable/DataTable";
import { Pencil, Trash2 } from "lucide-react";
import { PaginationData } from "@/components/commons/layout/pagination/PaginationControls";
import { Badge } from "@/components/ui/badge";
import { MobileQuizzTable } from "./MobileQuizzTable";

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
      header: "Topic",
      accessor: (item: IQuizz) => (
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground capitalize">
            {item.category || "-"}
          </p>
          <p className="text-xs text-muted-foreground capitalize">
            {item.topic || "-"}
          </p>
        </div>
      ),
    },
    {
      header: "Level",
      accessor: (item: IQuizz) => (
        <Badge
          variant="secondary"
          className={
            item.level === "Dễ"
              ? "bg-emerald-500/20 text-emerald-500"
              : item.level === "Trung bình"
                ? "bg-amber-500/20 text-amber-500"
                : "bg-rose-500/20 text-rose-500"
          }
        >
          {item.level || "-"}
        </Badge>
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
      mobileCardRenderer={(item: IQuizz, index: number) => (
        <MobileQuizzTable
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
