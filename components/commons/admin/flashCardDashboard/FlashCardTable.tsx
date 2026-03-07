import { DataTable } from "../adminTable/DataTable";
import { Pencil, Trash2 } from "lucide-react";
import { PaginationData } from "@/components/commons/layout/pagination/PaginationControls";
import { SpeakButton } from "./SpeakButton";

interface FlashCardTableProps {
  cards: IFlashCard[];
  isLoading: boolean;
  onUpdate?: (card: IFlashCard) => void;
  onDelete?: (card: IFlashCard) => void;
  paginationData?: PaginationData;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
}

export const FlashCardTable = ({
  cards,
  isLoading,
  onUpdate,
  onDelete,
  paginationData,
  onPageChange,
  showPagination = false,
}: FlashCardTableProps) => {
  const columns = [
    {
      header: "No",
      accessor: (_: IFlashCard, index: number) => {
        const baseIndex = paginationData
          ? (paginationData.currentPage - 1) * paginationData.pageSize
          : 0;
        return baseIndex + index + 1;
      },
    },
    {
      header: "Topic",
      accessor: (card: IFlashCard) => (
        <div className="inline-flex items-center justify-center gap-2">
          <span className="capitalize">{card.topic}</span>
        </div>
      ),
    },
    {
      header: "Word",
      accessor: (card: IFlashCard) => (
        <div className="inline-flex items-center justify-center gap-2">
          <span className="capitalize">{card.word}</span>
        </div>
      ),
    },
    {
      header: "Meaning",
      accessor: (card: IFlashCard) => (
        <div className="inline-flex items-center justify-center gap-2">
          <span className="capitalize">{card.meaning}</span>
        </div>
      ),
    },
    {
      header: "IPA",
      accessor: (card: IFlashCard) => (
        <div className="inline-flex items-center justify-center gap-2">
          <span className="capitalize">{card.ipa}</span>
        </div>
      ),
    },
    {
      header: "Voice",
      accessor: (card: IFlashCard) => (
        <div className="inline-flex items-center justify-center gap-2">
          <SpeakButton word={card.word} />
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
