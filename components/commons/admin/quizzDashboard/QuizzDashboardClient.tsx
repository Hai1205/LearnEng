"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TableDashboardSkeleton } from "../adminTable/TableDashboardSkeleton";
import { DashboardHeader } from "../layout/dashboard/DashboardHeader";
import { CreateQuizzDialog } from "./CreateQuizzDialog";
import { UpdateQuizzDialog } from "./UpdateQuizzDialog";
import { TableSearch } from "../adminTable/TableSearch";
import { QuizzFilter } from "./QuizzFilter";
import { QuizzTable } from "./QuizzTable";
import { ConfirmationDialog } from "../../layout/ConfirmationDialog";
import { useQuizzStore } from "@/stores/quizzStore";
import { ImportExcelDialog } from "../layout/dialog/ImportExcelDialog";
import { DraggingOnPage } from "../../layout/Dragging/DraggingOnPage";
import {
  useAllQuizzesQuery,
  useCreateQuizzMutation,
  useUpdateQuizzMutation,
  useDeleteQuizzMutation,
  useImportQuizzesMutation,
} from "@/hooks/useQuizzApi";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

export type QuizzFilterType = "category" | "topic" | "level";
export interface IQuizzFilter {
  category: string[];
  topic: string[];
  level: string[];
  [key: string]: string[];
}
const cardInitialFilters: IQuizzFilter = {
  category: [],
  topic: [],
  level: [],
};

export default function QuizzDashboardClient() {
  const {
    adminQuizzes,
    setAdminQuizzes,
    removeFromAdminQuizzes,
    addToAdminQuizzes,
    updateInAdminQuizzes,
  } = useQuizzStore();

  const {
    data: cardsResponse,
    isLoading: isLoadingQuizzes,
    refetch: refetchQuizzes,
  } = useAllQuizzesQuery();

  const { mutateAsync: createQuizzAsync } = useCreateQuizzMutation();
  const { mutateAsync: updateQuizzAsync } = useUpdateQuizzMutation();
  const { mutateAsync: deleteQuizzAsync } = useDeleteQuizzMutation();
  const { mutateAsync: importQuizzesAsync, isPending: isImporting } =
    useImportQuizzesMutation();

  useEffect(() => {
    const cards = cardsResponse?.data?.cards;
    setAdminQuizzes(cards || []);
  }, [cardsResponse?.data?.cards, setAdminQuizzes]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateQuizzOpen, setIsCreateQuizzOpen] = useState(false);
  const [isUpdateQuizzOpen, setIsUpdateQuizzOpen] = useState(false);

  const [activeFilters, setActiveFilters] =
    useState<IQuizzFilter>(cardInitialFilters);
  const [filteredQuizzes, setFilteredQuizzes] = useState<IQuizz[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(filteredQuizzes.length / pageSize);

  const paginationState = { page: currentPage, pageSize: pageSize };
  const paginationData = {
    totalElements: filteredQuizzes.length,
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
    let results = [...adminQuizzes];

    if (searchQuery.trim()) {
      const searchTerms = searchQuery.toLowerCase().trim();
      results = results.filter(
        (card) =>
          card.question.toLowerCase().includes(searchTerms) ||
          card.category.toLowerCase().includes(searchTerms) ||
          card.topic.toLowerCase().includes(searchTerms),
      );
    }

    if (activeFilters.category.length > 0) {
      results = results.filter((card) =>
        activeFilters.category.includes(card.category || ""),
      );
    }

    if (activeFilters.topic.length > 0) {
      results = results.filter((card) =>
        activeFilters.topic.includes(card.topic || ""),
      );
    }

    setFilteredQuizzes(results);
    setCurrentPage(1);
  }, [adminQuizzes, searchQuery, activeFilters]);

  // Paginate filtered quizzes
  const paginatedQuizzes = filteredQuizzes.slice(
    (paginationState.page - 1) * paginationState.pageSize,
    paginationState.page * paginationState.pageSize,
  );

  const toggleFilter = (value: string, type: QuizzFilterType) => {
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
    setFilteredQuizzes(adminQuizzes);
    closeMenuFilters();
  };

  const applyFilters = () => {
    closeMenuFilters();
  };

  const handleRefresh = () => {
    setActiveFilters(cardInitialFilters);
    setSearchQuery("");
    refetchQuizzes();
  };

  const handleExport = () => {
    if (!adminQuizzes.length) {
      toast.info("Không có dữ liệu quiz để export");
      return;
    }

    const rows = adminQuizzes.map((quiz) => ({
      category: quiz.category,
      topic: quiz.topic,
      level: quiz.level,
      question: quiz.question,
      option1: quiz.options?.[0] || "",
      option2: quiz.options?.[1] || "",
      option3: quiz.options?.[2] || "",
      option4: quiz.options?.[3] || "",
      answer: quiz.answer,
      explaining: quiz.explaining || "",
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Quizzes");
    XLSX.writeFile(wb, `quizzes_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const [openMenuFilters, setOpenMenuFilters] = useState(false);
  const closeMenuFilters = () => setOpenMenuFilters(false);

  const [dialogKey, setDialogKey] = useState(0);

  const [data, setData] = useState<IQuizz | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cardToDelete, setQuizzToDelete] = useState<IQuizz | null>(null);

  // Import
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isDraggingOnPage, setIsDraggingOnPage] = useState(false);
  const [droppedFile, setDroppedFile] = useState<File | null>(null);

  const defaultQuizz: IQuizz = {
    id: "",
    category: "",
    topic: "",
    level: "",
    question: "",
    options: [],
    answer: 0,
    explaining: "",
  };

  const handleChange = (field: keyof IQuizz, value: IQuizz[keyof IQuizz]) => {
    setData((prev) => {
      if (!prev) {
        return { ...defaultQuizz, [field]: value } as IQuizz;
      }

      return { ...prev, [field]: value };
    });
  };

  const handleUpdate = async () => {
    if (!data) return;

    updateQuizzAsync(
      {
        cardId: data.id,
        data: data,
      },
      {
        onSuccess: (response) => {
          const card = response?.data?.card;
          if (card) {
            updateInAdminQuizzes(card);
          }

          setIsUpdateQuizzOpen(false);
        },
      },
    );
  };

  const handleCreate = async () => {
    if (!data) return;

    createQuizzAsync(data, {
      onSuccess: (response) => {
        const card = response?.data?.card;
        if (card) {
          addToAdminQuizzes(card);
        }

        setIsCreateQuizzOpen(false);
      },
    });
  };

  const onDelete = (card: IQuizz) => {
    setQuizzToDelete(card);
    setDeleteDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setDeleteDialogOpen(false);
      setQuizzToDelete(null);
    }
  };

  const handleDialogConfirm = async () => {
    if (!cardToDelete) return;

    deleteQuizzAsync(cardToDelete.id, {
      onSuccess: () => {
        removeFromAdminQuizzes(cardToDelete.id);
        setDeleteDialogOpen(false);
        setQuizzToDelete(null);
      },
    });
  };

  const onUpdate = async (card: IQuizz) => {
    setData(card);
    setIsUpdateQuizzOpen(true);
  };

  // Import handlers
  const handleImport = async (file: File) => {
    importQuizzesAsync(file, {
      onSuccess: (response) => {
        const { imported, errors, cards } = response.data;
        cards.forEach((c) => addToAdminQuizzes(c));
        toast.success(`Import thành công ${imported} quizzes!`);
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

  if (isLoadingQuizzes) {
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
          subtitle="để import quizzes"
        />
      )}

      <DashboardHeader
        title="Quiz Dashboard"
        onCreateClick={() => {
          setData(defaultQuizz);
          setIsCreateQuizzOpen(true);
        }}
        onImportClick={() => {
          setDroppedFile(null);
          setIsImportDialogOpen(true);
        }}
        onExportClick={handleExport}
      />

      {/* Use consistent key to avoid hydration issues */}
      <CreateQuizzDialog
        key={`create-${dialogKey}-${isCreateQuizzOpen ? "open" : "closed"}`}
        isOpen={isCreateQuizzOpen}
        onOpenChange={(open) => {
          setIsCreateQuizzOpen(open);
          if (!open) {
            setData(null);
            setDialogKey((prev) => prev + 1);
          }
        }}
        onChange={handleChange}
        onQuizzCreated={handleCreate}
        data={data}
      />

      <UpdateQuizzDialog
        key={`update-${dialogKey}-${isUpdateQuizzOpen ? "open" : "closed"}`}
        isOpen={isUpdateQuizzOpen}
        onOpenChange={(open) => {
          setIsUpdateQuizzOpen(open);
          if (!open) {
            setData(null);
            setDialogKey((prev) => prev + 1);
          }
        }}
        onChange={handleChange}
        data={data}
        onQuizzUpdated={handleUpdate}
      />

      <div className="space-y-4">
        <Card className="border-border/50 shadow-lg bg-linear-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-border/30">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle />

              <div className="flex w-full sm:w-auto flex-wrap items-center gap-2 sm:gap-3">
                <TableSearch
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  placeholder="Search Quizzes..."
                />

                <Button
                  variant="secondary"
                  size="sm"
                  className="h-9 gap-2 px-4 bg-linear-to-br from-secondary/80 to-secondary hover:from-secondary hover:to-secondary/90 shadow-md hover:shadow-lg hover:shadow-secondary/20 transition-all duration-200 hover:scale-105"
                  onClick={async () => {
                    handleRefresh();
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>

                <QuizzFilter
                  data={adminQuizzes}
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

          <QuizzTable
            cards={paginatedQuizzes}
            isLoading={false}
            onUpdate={onUpdate}
            onDelete={onDelete}
            showPagination={filteredQuizzes.length > 10}
            paginationData={paginationData}
            onPageChange={setPage}
          />
        </Card>
      </div>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={handleDialogClose}
        title="Delete Quizz"
        description="This action cannot be undone. This will permanently delete the quiz and remove it from our servers."
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
        title="Import Quizzes"
        isLoading={isImporting}
        externalFile={droppedFile}
      />
    </div>
  );
}
