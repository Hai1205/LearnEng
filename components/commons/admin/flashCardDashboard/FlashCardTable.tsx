import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable } from "../adminTable/DataTable";
import { Pencil, Key, Trash2, Eye } from "lucide-react";
import { PaginationData } from "@/components/commons/layout/pagination/PaginationControls";

interface FlashCardTableeProps {
  cards: IFlashCard[];
  isLoading: boolean;
  onUpdate?: (card: IFlashCard) => void;
  onDelete?: (card: IFlashCard) => void;
  paginationData?: PaginationData;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
}

export const FlashCardTablee = ({
  cards,
  isLoading,
  onUpdate,
  onDelete,
  paginationData,
  onPageChange,
  showPagination = false,
}: FlashCardTableeProps) => {
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
      header: "Volcabulary",
      accessor: (card: IFlashCard) => (
        <div className="inline-flex items-center justify-center gap-2">
          <span className="capitalize">{card.vol}</span>
        </div>
      ),
    },
    {
      header: "Transcription",
      accessor: (card: IFlashCard) => (
        <div className="inline-flex items-center justify-center gap-2">
          <span className="capitalize">{card.transcription}</span>
        </div>
      ),
    },
    // {
    //   header: "Example",
    //   accessor: (card: IFlashCard) => (
    //     <div className="inline-flex items-center justify-center gap-2">
    //       <span className="capitalize">{card.ex}</span>
    //     </div>
    //   ),
    // },
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
