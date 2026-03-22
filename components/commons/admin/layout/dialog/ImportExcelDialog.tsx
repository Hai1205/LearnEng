"use client";

import { useRef, useState, useEffect } from "react";
import { Upload, FileSpreadsheet, X, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ImportExcelDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (files: File[]) => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
  externalFiles?: File[] | null;
}

export const ImportExcelDialog = ({
  isOpen,
  onOpenChange,
  onImport,
  title = "Import from Excel",
  description = "Upload an Excel file (.xlsx, .xls) to import data in bulk.",
  isLoading = false,
  externalFiles,
}: ImportExcelDialogProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>(
    externalFiles ?? [],
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedFiles(externalFiles ?? []);
    }
  }, [isOpen, externalFiles]);

  const isExcelFile = (f: File) => {
    return (
      f.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      f.type === "application/vnd.ms-excel" ||
      f.name.endsWith(".xlsx") ||
      f.name.endsWith(".xls")
    );
  };

  const handleFilesSelect = (incoming: FileList | File[]) => {
    const arr = Array.from(incoming).filter(isExcelFile);
    if (arr.length > 0) {
      setSelectedFiles((prev) => [...prev, ...arr]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fList = e.target.files;
    if (fList && fList.length > 0) handleFilesSelect(fList);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const fList = e.dataTransfer.files;
    if (fList && fList.length > 0) handleFilesSelect(fList);
  };

  const handleImport = () => {
    if (selectedFiles && selectedFiles.length > 0) {
      onImport(selectedFiles);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      // reset local selection when closing; restore externalFiles if provided
      if (externalFiles) setSelectedFiles(externalFiles ?? []);
      else setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    onOpenChange(open);
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFileAt = (idx: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 pr-1 overflow-hidden pb-4">
          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/30"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleInputChange}
              className="hidden"
              multiple
            />
            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">
              Kéo thả file Excel vào đây hoặc click để chọn
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Hỗ trợ .xlsx, .xls
            </p>
          </div>

          {/* Selected files display */}
          {selectedFiles && selectedFiles.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">
                  Selected files ({selectedFiles.length})
                </p>
                <Button variant="ghost" size="sm" onClick={clearFiles}>
                  Clear
                </Button>
              </div>

              <ScrollArea className="h-56 max-h-56 rounded-md border border-border/50 mb-4 overflow-hidden">
                <div className="space-y-2 p-2 pb-8">
                  {selectedFiles.map((f, idx) => (
                    <div
                      key={`${f.name}-${idx}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <FileSpreadsheet className="h-8 w-8 text-green-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{f.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(f.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFileAt(idx);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Format hint */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <AlertCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-600 dark:text-blue-400">
              File Excel cần có các cột header ở dòng đầu tiên. Các dòng dữ liệu
              không hợp lệ sẽ được bỏ qua.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sticky bottom-0 z-10 bg-background/60 backdrop-blur-sm py-2">
          <Button
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleImport}
            disabled={!(selectedFiles && selectedFiles.length > 0) || isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Đang import...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Import
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
