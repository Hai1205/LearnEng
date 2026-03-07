"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TableDashboardSkeleton } from "../adminTable/TableDashboardSkeleton";
import { DashboardHeader } from "../layout/dashboard/DashboardHeader";
import { CreateFlashCardDialog } from "./CreateFlashCardDialog";
import { UpdateFlashCardDialog } from "./UpdateFlashCardDialog";
import { TableSearch } from "../adminTable/TableSearch";
import { ConfirmationDialog } from "../../layout/ConfirmationDialog";
import { FlashCardTablee } from "./FlashCardTable";
import { FlashCardFilter } from "./FlashCardFilter";
import { ImportExcelDialog } from "../layout/dialog/ImportExcelDialog";
import { DraggingOnPage } from "../../layout/Dragging/DraggingOnPage";
import { useFlashCardStore } from "@/stores/flashCardStore";
import {
  useAllFlashCardsQuery,
  useCreateFlashCardMutation,
  useUpdateFlashCardMutation,
  useDeleteFlashCardMutation,
  useImportFlashCardsMutation,
} from "@/hooks/useFlashCardApi";
import { toast } from "react-toastify";

export type FlashCardFilterType = "topic";
export interface IFlashCardFilter {
  topic: string[];
  [key: string]: string[];
}
const cardInitialFilters: IFlashCardFilter = {
  topic: [],
};

export default function FlashCardDashboardClient() {
  const {
    adminFlashCards,
    setAdminFlashCards,
    removeFromAdminFlashCards,
    addToAdminFlashCards,
    updateInAdminFlashCards,
  } = useFlashCardStore();

  const {
    data: cardsResponse,
    isLoading: isLoadingFlashCards,
    refetch: refetchFlashCards,
  } = useAllFlashCardsQuery();

  const { mutateAsync: createFlashCardAsync } = useCreateFlashCardMutation();
  const { mutateAsync: updateFlashCardAsync } = useUpdateFlashCardMutation();
  const { mutateAsync: deleteFlashCardAsync } = useDeleteFlashCardMutation();
  const { mutateAsync: importFlashCardsAsync, isPending: isImporting } =
    useImportFlashCardsMutation();

  useEffect(() => {
    const cards = cardsResponse?.data?.cards;
    setAdminFlashCards(cards || []);
  }, [cardsResponse?.data?.cards, setAdminFlashCards]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateFlashCardOpen, setIsCreateFlashCardOpen] = useState(false);
  const [isUpdateFlashCardOpen, setIsUpdateFlashCardOpen] = useState(false);

  const [activeFilters, setActiveFilters] =
    useState<IFlashCardFilter>(cardInitialFilters);
  const [filteredFlashCards, setFilteredFlashCards] = useState<IFlashCard[]>(
    [],
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(filteredFlashCards.length / pageSize);

  const paginationState = { page: currentPage, pageSize: pageSize };
  const paginationData = {
    totalElements: filteredFlashCards.length,
    totalPages: totalPages,
    currentPage: currentPage,
    pageSize: pageSize,
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
  };

  const setPage = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    let results = [...adminFlashCards];

    if (searchQuery.trim()) {
      const searchTerms = searchQuery.toLowerCase().trim();
      results = results.filter(
        (card) =>
          card.vol.toLowerCase().includes(searchTerms) ||
          card.topic.toLowerCase().includes(searchTerms),
      );
    }

    if (activeFilters.topic.length > 0) {
      results = results.filter((card) =>
        activeFilters.topic.includes(card.topic || ""),
      );
    }

    setFilteredFlashCards(results);
    setCurrentPage(1);
  }, [adminFlashCards, searchQuery, activeFilters]);

  // Paginate filtered adminFlashCards
  const paginatedFlashCards = filteredFlashCards.slice(
    (paginationState.page - 1) * paginationState.pageSize,
    paginationState.page * paginationState.pageSize,
  );

  const toggleFilter = (value: string, type: FlashCardFilterType) => {
    setActiveFilters((prev) => {
      const updated = { ...prev };
      if (updated[type]?.includes(value)) {
        updated[type] = updated[type].filter((item) => item !== value);
      } else {
        updated[type] = [...(updated[type] || []), value];
      }
      return updated;
    });
  };

  const clearFilters = () => {
    setActiveFilters(cardInitialFilters);
    setSearchQuery("");
    closeMenuFilters();
  };

  const applyFilters = () => {
    closeMenuFilters();
  };

  const handleRefresh = () => {
    setActiveFilters(cardInitialFilters);
    setSearchQuery("");
    refetchFlashCards();
  };

  const [openMenuFilters, setOpenMenuFilters] = useState(false);
  const closeMenuFilters = () => setOpenMenuFilters(false);

  const [dialogKey, setDialogKey] = useState(0);

  const [data, setData] = useState<IFlashCard | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cardToDelete, setFlashCardToDelete] = useState<IFlashCard | null>(
    null,
  );

  // Import
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isDraggingOnPage, setIsDraggingOnPage] = useState(false);
  const [droppedFile, setDroppedFile] = useState<File | null>(null);

  const defaultFlashCard: IFlashCard = {
    id: "",
    topic: "",
    vol: "",
    transcription: "",
    audioUrl: "",
    ex: "",
  };

  const handleChange = (
    field: keyof IFlashCard,
    value: IFlashCard[keyof IFlashCard],
  ) => {
    setData((prev) => {
      if (!prev) {
        return { ...defaultFlashCard, [field]: value } as IFlashCard;
      }
      return { ...prev, [field]: value };
    });
  };

  const handleUpdate = async () => {
    if (!data) return;

    updateFlashCardAsync(
      { cardId: data.id, data },
      {
        onSuccess: (response) => {
          const card = response?.data?.card;
          if (card) {
            updateInAdminFlashCards(card);
          }
          setIsUpdateFlashCardOpen(false);
        },
      },
    );
  };

  const handleCreate = async () => {
    if (!data) return;

    createFlashCardAsync(data, {
      onSuccess: (response) => {
        const card = response?.data?.card;
        if (card) {
          addToAdminFlashCards(card);
        }
        setIsCreateFlashCardOpen(false);
      },
    });
  };

  const onDelete = (card: IFlashCard) => {
    setFlashCardToDelete(card);
    setDeleteDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setDeleteDialogOpen(false);
      setFlashCardToDelete(null);
    }
  };

  const handleDialogConfirm = async () => {
    if (!cardToDelete) return;
    deleteFlashCardAsync(cardToDelete.id, {
      onSuccess: () => {
        removeFromAdminFlashCards(cardToDelete.id);
        setDeleteDialogOpen(false);
        setFlashCardToDelete(null);
      },
    });
  };

  const onUpdate = async (card: IFlashCard) => {
    setData(card);
    setIsUpdateFlashCardOpen(true);
  };

  // Import handlers
  const handleImport = async (file: File) => {
    importFlashCardsAsync(file, {
      onSuccess: (response) => {
        const { imported, errors, cards } = response.data;
        cards.forEach((c) => addToAdminFlashCards(c));
        toast.success(`Import thành công ${imported} flash cards!`);
        if (errors && errors.length > 0) {
          toast.warning(`${errors.length} dòng bị bỏ qua do lỗi`);
        }
        setIsImportDialogOpen(false);
        setDroppedFile(null);
      },
      onError: (error) => {
        toast.error(error.message || "Import thất bại");
      },
    });
  };

  const handlePageDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes("Files")) {
      setIsDraggingOnPage(true);
    }
  };

  const handlePageDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDraggingOnPage(false);
    }
  };

  const handlePageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handlePageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOnPage(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      setDroppedFile(file);
      setIsImportDialogOpen(true);
    } else if (file) {
      toast.error("Chỉ chấp nhận file Excel (.xlsx, .xls)!");
    }
  };

  if (isLoadingFlashCards) {
    return <TableDashboardSkeleton />;
  }

  return (
    <div
      className="space-y-4 relative"
      onDragEnter={handlePageDragEnter}
      onDragLeave={handlePageDragLeave}
      onDragOver={handlePageDragOver}
      onDrop={handlePageDrop}
    >
      {isDraggingOnPage && (
        <DraggingOnPage
          title="Thả file Excel vào đây"
          subtitle="để import flash cards"
        />
      )}

      <DashboardHeader
        title="Flash Card Dashboard"
        onCreateClick={() => {
          setData(defaultFlashCard);
          setIsCreateFlashCardOpen(true);
        }}
        createButtonText="Create FlashCard"
        onImportClick={() => {
          setDroppedFile(null);
          setIsImportDialogOpen(true);
        }}
        importButtonText="Import Excel"
      />

      <CreateFlashCardDialog
        key={`create-${dialogKey}-${isCreateFlashCardOpen ? "open" : "closed"}`}
        isOpen={isCreateFlashCardOpen}
        onOpenChange={(open) => {
          setIsCreateFlashCardOpen(open);
          if (!open) {
            setData(null);
            setDialogKey((prev) => prev + 1);
          }
        }}
        onChange={handleChange}
        onFlashCardCreated={handleCreate}
        data={data}
      />

      <UpdateFlashCardDialog
        key={`update-${dialogKey}-${isUpdateFlashCardOpen ? "open" : "closed"}`}
        isOpen={isUpdateFlashCardOpen}
        onOpenChange={(open) => {
          setIsUpdateFlashCardOpen(open);
          if (!open) {
            setData(null);
            setDialogKey((prev) => prev + 1);
          }
        }}
        onChange={handleChange}
        data={data}
        onFlashCardUpdated={handleUpdate}
      />

      <div className="space-y-4">
        <Card className="border-border/50 shadow-lg bg-linear-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-border/30">
            <div className="flex items-center justify-between">
              <CardTitle />

              <div className="flex items-center gap-3">
                <TableSearch
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  placeholder="Search FlashCards..."
                />

                <Button
                  variant="secondary"
                  size="sm"
                  className="h-9 gap-2 px-4 bg-linear-to-br from-secondary/80 to-secondary hover:from-secondary hover:to-secondary/90 shadow-md hover:shadow-lg hover:shadow-secondary/20 transition-all duration-200 hover:scale-105"
                  onClick={() => handleRefresh()}
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>

                <FlashCardFilter
                  data={adminFlashCards}
                  openMenuFilters={openMenuFilters}
                  setOpenMenuFilters={setOpenMenuFilters}
                  activeFilters={activeFilters}
                  toggleFilter={toggleFilter}
                  clearFilters={clearFilters}
                  applyFilters={applyFilters}
                  closeMenuFilters={closeMenuFilters}
                />
              </div>
            </div>
          </CardHeader>

          <FlashCardTablee
            cards={paginatedFlashCards}
            isLoading={false}
            onUpdate={onUpdate}
            onDelete={onDelete}
            showPagination={filteredFlashCards.length > 10}
            paginationData={paginationData}
            onPageChange={setPage}
          />
        </Card>
      </div>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={handleDialogClose}
        title="Delete Flash Card"
        description="This action cannot be undone. This will permanently delete the card and remove it from our servers."
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleDialogConfirm}
      />

      <ImportExcelDialog
        isOpen={isImportDialogOpen}
        onOpenChange={(open) => {
          setIsImportDialogOpen(open);
          if (!open) setDroppedFile(null);
        }}
        onImport={handleImport}
        title="Import Flash Cards"
        description="Upload file Excel với các cột: cat, topic, vol (bắt buộc), transcription, audioUrl, ex (tùy chọn)."
        isLoading={isImporting}
        externalFile={droppedFile}
      />
    </div>
  );
}
