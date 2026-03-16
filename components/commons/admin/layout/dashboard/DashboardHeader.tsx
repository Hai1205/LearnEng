import { Button } from "@/components/ui/button";
import { Download, Plus, Upload } from "lucide-react";
import { ReactNode } from "react";

interface DashboardHeaderProps {
  title: string;
  onCreateClick?: () => void;
  createButtonText?: string;
  onImportClick?: () => void;
  importButtonText?: string;
  onExportClick?: () => void;
  exportButtonText?: string;
  children?: ReactNode;
}

export const DashboardHeader = ({
  title,
  onCreateClick,
  createButtonText = "Create New",
  onImportClick,
  importButtonText = "Import Excel",
  onExportClick,
  exportButtonText = "Export Excel",
  children,
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-border/50 mb-6">
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-linear-to-br from-primary to-secondary bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage and monitor your data
        </p>
      </div>

      <div className="flex w-full sm:w-auto flex-wrap items-center gap-2 sm:gap-3">
        {children}
        {onImportClick && (
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 px-4 border-primary/50 text-primary hover:bg-primary/10 shadow-md transition-all duration-200 hover:scale-105"
            onClick={onImportClick}
          >
            <Upload className="h-4 w-4" />
            {importButtonText}
          </Button>
        )}
        {onExportClick && (
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 px-4 border-secondary/60 text-secondary hover:bg-secondary/10 shadow-md transition-all duration-200 hover:scale-105"
            onClick={onExportClick}
          >
            <Download className="h-4 w-4" />
            {exportButtonText}
          </Button>
        )}
        {onCreateClick && (
          <Button
            size="sm"
            className="h-9 gap-2 px-4 bg-linear-to-br from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-primary/30 transition-all duration-200 hover:shadow-xl hover:shadow-primary/40 hover:scale-105"
            onClick={onCreateClick}
          >
            <Plus className="h-4 w-4" />
            {createButtonText}
          </Button>
        )}
      </div>
    </div>
  );
};
