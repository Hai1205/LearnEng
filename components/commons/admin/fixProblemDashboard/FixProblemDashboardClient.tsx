"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TableDashboardSkeleton } from "../adminTable/TableDashboardSkeleton";
import { DashboardHeader } from "../layout/dashboard/DashboardHeader";
import { CreateFixProblemDialog } from "./CreateFixProblemDialog";
import { UpdateFixProblemDialog } from "./UpdateFixProblemDialog";
import { TableSearch } from "../adminTable/TableSearch";
import { FixProblemFilter } from "./FixProblemFilter";
import { FixProblemTable } from "./FixProblemTable";
import { ConfirmationDialog } from "../../layout/ConfirmationDialog";
import { ImportExcelDialog } from "../layout/dialog/ImportExcelDialog";
import { DraggingOnPage } from "../../layout/Dragging/DraggingOnPage";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { useFixProblemStore } from "@/stores/fixProblemStore";
import {
  useAllFixProblemsQuery,
  useCreateFixProblemMutation,
  useDeleteFixProblemMutation,
  useUpdateFixProblemMutation,
} from "@/hooks/useFixProblemApi";
import { EFixProblemAnswer, EFixProblemErrorType } from "@/types/enum";
import { ViewFixProblemDialog } from "./ViewFixProblemDialog";

export type FixProblemFilterType = "category" | "errorType";
export interface IFixProblemFilter {
  category: string[];
  errorType: string[];
  [key: string]: string[];
}
const cardInitialFilters: IFixProblemFilter = {
  category: [],
  errorType: [],
};

export default function FixProblemDashboardClient() {
  const {
    adminFixFixProblems,
    setAdminFixFixProblems,
    removeFromAdminFixFixProblems,
    addToAdminFixFixProblems,
    updateInAdminFixFixProblems,
  } = useFixProblemStore();

  const {
    data: cardsResponse,
    isLoading: isLoadingFixProblems,
    refetch: refetchFixProblems,
  } = useAllFixProblemsQuery();

  const { mutateAsync: createFixProblemAsync } = useCreateFixProblemMutation();
  const { mutateAsync: updateFixProblemAsync } = useUpdateFixProblemMutation();
  const { mutateAsync: deleteFixProblemAsync } = useDeleteFixProblemMutation();

  useEffect(() => {
    const cards = cardsResponse?.data?.cards;
    setAdminFixFixProblems(cards || []);
  }, [cardsResponse?.data?.cards, setAdminFixFixProblems]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateFixProblemOpen, setIsCreateFixProblemOpen] = useState(false);
  const [isUpdateFixProblemOpen, setIsUpdateFixProblemOpen] = useState(false);
  const [isViewFixProblemOpen, setIsViewFixProblemOpen] = useState(false);

  const [activeFilters, setActiveFilters] =
    useState<IFixProblemFilter>(cardInitialFilters);
  const [filteredFixProblems, setFilteredFixProblems] = useState<IFixProblem[]>(
    [],
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(filteredFixProblems.length / pageSize);

  const paginationState = { page: currentPage, pageSize: pageSize };
  const paginationData = {
    totalElements: filteredFixProblems.length,
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
    let results = [...adminFixFixProblems];

    if (searchQuery.trim()) {
      const searchTerms = searchQuery.toLowerCase().trim();
      results = results.filter((card) =>
        card.question.toLowerCase().includes(searchTerms),
      );
    }

    if (activeFilters.category.length > 0) {
      results = results.filter((card) =>
        activeFilters.category.includes(card.category || ""),
      );
    }

    if (activeFilters.errorType.length > 0) {
      results = results.filter((card) =>
        activeFilters.errorType.includes(card.errorType || ""),
      );
    }

    setFilteredFixProblems(results);
    setCurrentPage(1);
  }, [adminFixFixProblems, searchQuery, activeFilters]);

  // Paginate filtered FixProblems
  const paginatedItems = filteredFixProblems.slice(
    (paginationState.page - 1) * paginationState.pageSize,
    paginationState.page * paginationState.pageSize,
  );

  const toggleFilter = (value: string, type: FixProblemFilterType) => {
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
    setFilteredFixProblems(adminFixFixProblems);
    closeMenuFilters();
  };

  const applyFilters = () => {
    closeMenuFilters();
  };

  const handleRefresh = () => {
    setActiveFilters(cardInitialFilters);
    setSearchQuery("");
    refetchFixProblems();
  };

  const handleExport = () => {
    if (!filteredFixProblems.length) {
      toast.info("No data to export");
      return;
    }

    const rows = filteredFixProblems.map((quiz) => ({
      category: quiz.category,
      question: quiz.question,
      errorType: quiz.errorType,
      reason: quiz.reason,
      answer: quiz.answer,
      note: quiz.note,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "FixProblems");
    XLSX.writeFile(
      wb,
      `FixProblems_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  const [openMenuFilters, setOpenMenuFilters] = useState(false);
  const closeMenuFilters = () => setOpenMenuFilters(false);

  const [dialogKey, setDialogKey] = useState(0);

  const [data, setData] = useState<IFixProblem | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cardToDelete, setFixProblemToDelete] = useState<IFixProblem | null>(
    null,
  );

  // Import
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isDraggingOnPage, setIsDraggingOnPage] = useState(false);
  const [droppedFile, setDroppedFile] = useState<File[] | null>(null);

  const defaultFixProblem: IFixProblem = {
    id: "",
    category: "",
    question: "",
    errorType: EFixProblemErrorType.Vocabulary,
    reason: "",
    answer: EFixProblemAnswer.A,
    note: "",
  };

  const handleChange = (
    field: keyof IFixProblem,
    value: IFixProblem[keyof IFixProblem],
  ) => {
    setData((prev) => {
      if (!prev) {
        return { ...defaultFixProblem, [field]: value } as IFixProblem;
      }

      return { ...prev, [field]: value };
    });
  };

  const handleUpdate = async () => {
    if (!data) return;

    updateFixProblemAsync(
      {
        cardId: data.id,
        data: data,
      },
      {
        onSuccess: (response) => {
          const card = response?.data?.card;
          if (card) {
            updateInAdminFixFixProblems(card);
          }

          setIsUpdateFixProblemOpen(false);
        },
      },
    );
  };

  const handleCreate = async () => {
    if (!data) return;

    createFixProblemAsync(data, {
      onSuccess: (response) => {
        const card = response?.data?.card;
        if (card) {
          addToAdminFixFixProblems(card);
        }

        setIsCreateFixProblemOpen(false);
      },
    });
  };

  const onDelete = (card: IFixProblem) => {
    setFixProblemToDelete(card);
    setDeleteDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setDeleteDialogOpen(false);
      setFixProblemToDelete(null);
    }
  };

  const handleDialogConfirm = async () => {
    if (!cardToDelete) return;

    deleteFixProblemAsync(cardToDelete.id, {
      onSuccess: () => {
        removeFromAdminFixFixProblems(cardToDelete.id);
        setDeleteDialogOpen(false);
        setFixProblemToDelete(null);
      },
    });
  };

  const onView = async (card: IFixProblem) => {
    setData(card);
    setIsViewFixProblemOpen(true);
  };

  const onUpdate = async (card: IFixProblem) => {
    setData(card);
    setIsUpdateFixProblemOpen(true);
  };

  // Import handlers
  const handleImport = async (files: File[]) => {
    try {
      const form = new FormData();
      files.forEach((f) => form.append("file", f));

      const res = await fetch("/api/FixProblems/import", {
        method: "POST",
        body: form,
      });

      const json = await res.json();
      if (!res.ok) {
        const msg = json?.error || "Import thất bại";
        toast.error(msg);
        return;
      }

      const { imported, errors, cards } = json.data;
      (cards || []).forEach((c: any) => addToAdminFixFixProblems(c));
      if (imported && Number(imported) > 0) {
        toast.success(`Import thành công ${imported} FixProblems!`);
      }

      if (errors && errors.length > 0) {
        toast.warning(`${errors.length} dòng/file bị bỏ qua do lỗi`);

        // create error txt and trigger download
        const content = errors.join("\n");
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `FixProblemes_import_errors_${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }

      setIsImportDialogOpen(false);
      setDroppedFile(null);
    } catch (err: any) {
      toast.error(err?.message || "Import thất bại");
    }
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
    const fileList = Array.from(e.dataTransfer.files || []);
    const excelFiles = fileList.filter(
      (f) => f.name.endsWith(".xlsx") || f.name.endsWith(".xls"),
    );
    if (excelFiles.length > 0) {
      setDroppedFile(excelFiles);
      setIsImportDialogOpen(true);
    } else if (fileList.length > 0) {
      toast.error("Chỉ chấp nhận file Excel (.xlsx, .xls)!");
    }
  };

  if (isLoadingFixProblems) {
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
          subtitle="để import FixProblems"
        />
      )}

      <DashboardHeader
        title="Quiz Dashboard"
        onCreateClick={() => {
          setData(defaultFixProblem);
          setIsCreateFixProblemOpen(true);
        }}
        onImportClick={() => {
          setDroppedFile(null);
          setIsImportDialogOpen(true);
        }}
        onExportClick={handleExport}
      />

      {/* Use consistent key to avoid hydration issues */}
      <CreateFixProblemDialog
        key={`create-${dialogKey}-${isCreateFixProblemOpen ? "open" : "closed"}`}
        isOpen={isCreateFixProblemOpen}
        onOpenChange={(open) => {
          setIsCreateFixProblemOpen(open);
          if (!open) {
            setData(null);
            setDialogKey((prev) => prev + 1);
          }
        }}
        onChange={handleChange}
        onFixProblemCreated={handleCreate}
        data={data}
      />

      <UpdateFixProblemDialog
        key={`update-${dialogKey}-${isUpdateFixProblemOpen ? "open" : "closed"}`}
        isOpen={isUpdateFixProblemOpen}
        onOpenChange={(open) => {
          setIsUpdateFixProblemOpen(open);
          if (!open) {
            setData(null);
            setDialogKey((prev) => prev + 1);
          }
        }}
        onChange={handleChange}
        data={data}
        onFixProblemUpdated={handleUpdate}
      />

      <ViewFixProblemDialog
        key={`view-${dialogKey}-${isViewFixProblemOpen ? "open" : "closed"}`}
        isOpen={isViewFixProblemOpen}
        onClose={() => {
          setIsViewFixProblemOpen(false);
          setData(null);
          setDialogKey((prev) => prev + 1);
        }}
        data={data}
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
                  placeholder="Search FixProblems..."
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

                <FixProblemFilter
                  data={adminFixFixProblems}
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

          <FixProblemTable
            cards={paginatedItems}
            isLoading={false}
            onView={onView}
            onUpdate={onUpdate}
            onDelete={onDelete}
            showPagination={filteredFixProblems.length > 10}
            paginationData={paginationData}
            onPageChange={setPage}
          />
        </Card>
      </div>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={handleDialogClose}
        title="Delete FixProblem"
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
        title="Import FixProblems"
        // isLoading={isImporting}
        externalFiles={droppedFile ?? null}
      />
    </div>
  );
}
