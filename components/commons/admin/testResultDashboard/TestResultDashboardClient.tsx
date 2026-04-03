"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TableDashboardSkeleton } from "../adminTable/TableDashboardSkeleton";
import { DashboardHeader } from "../layout/dashboard/DashboardHeader";
import { CreateTestResultDialog } from "./CreateTestResultDialog";
import { TableSearch } from "../adminTable/TableSearch";
import { ConfirmationDialog } from "../../layout/ConfirmationDialog";
import { ImportExcelDialog } from "../layout/dialog/ImportExcelDialog";
import { DraggingOnPage } from "../../layout/Dragging/DraggingOnPage";
import { useTestResultStore } from "@/stores/testResultStore";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import {
  useAllTestResultsQuery,
  useCreateTestResultMutation,
  useDeleteTestResultMutation,
  useImportTestResultsMutation,
  useUpdateTestResultMutation,
} from "@/hooks/useTestResultApi";
import { UpdateTestResultDialog } from "./UpdateTestResultDialog";
import { TestResultFilter } from "./TestResultFilter";
import { TestResultTable } from "./TestResultTable";

export type TestResultFilterType = "category";
export interface ITestResultFilter {
  category: string[];
  [key: string]: string[];
}
const cardInitialFilters: ITestResultFilter = {
  category: [],
};

export default function TestResultDashboardClient() {
  const {
    adminTestResults,
    setAdminTestResults,
    removeFromAdminTestResults,
    addToAdminTestResults,
    updateInAdminTestResults,
  } = useTestResultStore();

  const {
    data: cardsResponse,
    isLoading: isLoadingTestResults,
    refetch: refetchTestResults,
  } = useAllTestResultsQuery();

  const { mutateAsync: createTestResultAsync } = useCreateTestResultMutation();
  const { mutateAsync: updateTestResultAsync } = useUpdateTestResultMutation();
  const { mutateAsync: deleteTestResultAsync } = useDeleteTestResultMutation();
  // const { mutateAsync: importTestResultsAsync, isPending: isImporting } =
  //   useImportTestResultsMutation();

  useEffect(() => {
    const cards = cardsResponse?.data?.results;
    setAdminTestResults(cards || []);
  }, [cardsResponse?.data?.results, setAdminTestResults]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateTestResultOpen, setIsCreateTestResultOpen] = useState(false);
  const [isUpdateTestResultOpen, setIsUpdateTestResultOpen] = useState(false);

  const [activeFilters, setActiveFilters] =
    useState<ITestResultFilter>(cardInitialFilters);
  const [filteredTestResults, setFilteredTestResults] = useState<ITestResult[]>(
    [],
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(filteredTestResults.length / pageSize);

  const paginationState = { page: currentPage, pageSize: pageSize };
  const paginationData = {
    totalElements: filteredTestResults.length,
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
    let results = [...adminTestResults];

    if (searchQuery.trim()) {
      const searchTerms = searchQuery.toLowerCase().trim();
      results = results.filter(
        (test) =>
          test.title.toLowerCase().includes(searchTerms) ||
          test.category.toLowerCase().includes(searchTerms),
      );
    }

    if (activeFilters.category.length > 0) {
      results = results.filter((test) =>
        activeFilters.category.includes(test.category || ""),
      );
    }

    setFilteredTestResults(results);
    setCurrentPage(1);
  }, [adminTestResults, searchQuery, activeFilters]);

  // Paginate filtered adminTestResults
  const paginatedItems = filteredTestResults.slice(
    (paginationState.page - 1) * paginationState.pageSize,
    paginationState.page * paginationState.pageSize,
  );

  const toggleFilter = (value: string, type: TestResultFilterType) => {
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
    refetchTestResults();
  };

  const handleExport = () => {
    if (!filteredTestResults.length) {
      toast.info("Không có dữ liệu test để export");
      return;
    }

    const rows = filteredTestResults.map((test) => ({
      category: test.category,
      title: test.title,
      part1: test.part1,
      part2: test.part2,
      part3: test.part3,
      part4: test.part4,
      part5: test.part5,
      part6: test.part6,
      part7: test.part7,
      score: test.score,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "TestResults");
    XLSX.writeFile(
      wb,
      `testresults_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  const [openMenuFilters, setOpenMenuFilters] = useState(false);
  const closeMenuFilters = () => setOpenMenuFilters(false);

  const [dialogKey, setDialogKey] = useState(0);

  const [data, setData] = useState<ITestResult | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cardToDelete, setTestResultToDelete] = useState<ITestResult | null>(
    null,
  );

  // Import
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isDraggingOnPage, setIsDraggingOnPage] = useState(false);
  const [droppedFile, setDroppedFile] = useState<File[] | null>(null);

  const defaultTestResult: ITestResult = {
    id: "",
    category: "",
    title: "",
    part1: 0,
    part2: 0,
    part3: 0,
    part4: 0,
    part5: 0,
    part6: 0,
    part7: 0,
    score: 0,
  };

  const handleChange = (
    field: keyof ITestResult,
    value: ITestResult[keyof ITestResult],
  ) => {
    setData((prev) => {
      if (!prev) {
        return { ...defaultTestResult, [field]: value } as ITestResult;
      }
      return { ...prev, [field]: value };
    });
  };

  const handleUpdate = async () => {
    if (!data) return;

    try {
      const response = await updateTestResultAsync({ testId: data.id, data });
      const test = response?.data?.result;
      if (test) {
        updateInAdminTestResults(test);
      }
      setIsUpdateTestResultOpen(false);
      toast.success("Cập nhật test result thành công");
    } catch (error: any) {
      toast.error(error?.message || "Cập nhật test result thất bại");
    }
  };

  const handleCreate = async () => {
    if (!data) return;

    try {
      const payload = {
        category: data.category,
        title: data.title,
        part1: data.part1,
        part2: data.part2,
        part3: data.part3,
        part4: data.part4,
        part5: data.part5,
        part6: data.part6,
        part7: data.part7,
        score: data.score,
      };

      const response = await createTestResultAsync(
        payload as Omit<ITestResult, "id">,
      );
      const test = response?.data?.result;
      if (test) {
        addToAdminTestResults(test);
      }
      setIsCreateTestResultOpen(false);
      toast.success("Tạo test result thành công");
    } catch (error: any) {
      toast.error(error?.message || "Tạo test result thất bại");
    }
  };

  const onDelete = (test: ITestResult) => {
    setTestResultToDelete(test);
    setDeleteDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setDeleteDialogOpen(false);
      setTestResultToDelete(null);
    }
  };

  const handleDialogConfirm = async () => {
    if (!cardToDelete) return;
    deleteTestResultAsync(cardToDelete.id, {
      onSuccess: () => {
        removeFromAdminTestResults(cardToDelete.id);
        setDeleteDialogOpen(false);
        setTestResultToDelete(null);
      },
    });
  };

  const onUpdate = async (test: ITestResult) => {
    setData(test);
    setIsUpdateTestResultOpen(true);
  };

  // Import handlers
  const handleImport = async (files: File[]) => {
    try {
      const form = new FormData();
      files.forEach((f) => form.append("file", f));

      const res = await fetch("/api/quizzes/import", {
        method: "POST",
        body: form,
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.error || "Import thất bại");
        return;
      }

      const { imported, errors, cards } = json.data;
      (cards || []).forEach((c: any) => addToAdminTestResults(c));
      if (imported && Number(imported) > 0) {
        toast.success(`Import thành công ${imported} tests!`);
      }

      if (errors && errors.length > 0) {
        toast.warning(`${errors.length} dòng/file bị bỏ qua do lỗi`);
        const content = errors.join("\n");
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `flashcards_import_errors_${new Date().toISOString().slice(0, 10)}.txt`;
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

  if (isLoadingTestResults) {
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
          subtitle="để import tests"
        />
      )}

      <DashboardHeader
        title="Test Result Dashboard"
        onCreateClick={() => {
          setData(defaultTestResult);
          setIsCreateTestResultOpen(true);
        }}
        onImportClick={() => {
          setDroppedFile(null);
          setIsImportDialogOpen(true);
        }}
        onExportClick={handleExport}
      />

      <CreateTestResultDialog
        key={`create-${dialogKey}-${isCreateTestResultOpen ? "open" : "closed"}`}
        isOpen={isCreateTestResultOpen}
        onOpenChange={(open) => {
          setIsCreateTestResultOpen(open);
          if (!open) {
            setData(null);
            setDialogKey((prev) => prev + 1);
          }
        }}
        onChange={handleChange}
        onTestResultCreated={handleCreate}
        data={data}
      />

      <UpdateTestResultDialog
        key={`update-${dialogKey}-${isUpdateTestResultOpen ? "open" : "closed"}`}
        isOpen={isUpdateTestResultOpen}
        onOpenChange={(open) => {
          setIsUpdateTestResultOpen(open);
          if (!open) {
            setData(null);
            setDialogKey((prev) => prev + 1);
          }
        }}
        onChange={handleChange}
        data={data}
        onTestResultUpdated={handleUpdate}
      />

      <div className="space-y-4">
        <Card className="border-border/50 shadow-lg bg-linear-to-br from-test to-test/80 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-border/30">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle />

              <div className="flex w-full sm:w-auto flex-wrap items-center gap-2 sm:gap-3">
                <TableSearch
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  placeholder="Search TestResults..."
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

                <TestResultFilter
                  data={adminTestResults}
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

          <TestResultTable
            cards={paginatedItems}
            isLoading={false}
            onUpdate={onUpdate}
            onDelete={onDelete}
            showPagination={filteredTestResults.length > 10}
            paginationData={paginationData}
            onPageChange={setPage}
          />
        </Card>
      </div>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={handleDialogClose}
        title="Delete Test Result"
        description="This action cannot be undone. This will permanently delete the test and remove it from our servers."
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
        title="Import Test Results"
        // isLoading={isImporting}
        externalFiles={droppedFile ?? null}
      />
    </div>
  );
}
