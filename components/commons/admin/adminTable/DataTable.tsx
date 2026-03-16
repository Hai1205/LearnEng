import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { TableSkeleton } from "./TableSkeleton";
import { cn } from "@/lib/utils";
import {
  PaginationControls,
  PaginationData,
} from "@/components/commons/layout/pagination/PaginationControls";
import { ComponentType, ReactNode, useRef } from "react";

interface DataTableProps<T> {
  data: T[];
  isLoading: boolean;
  columns: {
    header: string;
    accessor: (item: T, index: number) => ReactNode;
    className?: string;
  }[];
  actions?: {
    label: string;
    onClick: (item: T) => void;
    icon?: ComponentType<{ className?: string }>;
    className?: string;
  }[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  // Pagination props
  paginationData?: PaginationData;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
  mobileTableMinWidthPx?: number;
  getRowKey?: (item: T, index: number) => string | number;
  mobileCardRenderer?: (item: T, index: number) => ReactNode;
}

export function DataTable<T>({
  data,
  isLoading,
  columns,
  actions,
  onRowClick,
  emptyMessage = "No data found",
  paginationData,
  onPageChange,
  showPagination = false,
  mobileTableMinWidthPx = 820,
  getRowKey,
  mobileCardRenderer,
}: DataTableProps<T>) {
  const tableScrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="md:hidden space-y-2">
        {isLoading ? (
          <div className="rounded-lg border border-border/60 bg-card p-3">
            <TableSkeleton />
          </div>
        ) : data && data.length > 0 ? (
          data.map((item, index) => (
            <div
              key={getRowKey ? getRowKey(item, index) : index}
              className={cn(
                "rounded-lg border border-border/60 bg-card p-3 space-y-2",
                onRowClick && "cursor-pointer",
              )}
              onClick={() => onRowClick?.(item)}
            >
              {mobileCardRenderer
                ? mobileCardRenderer(item, index)
                : columns.map((column, colIndex) => (
                    <div
                      key={colIndex}
                      className="flex items-start justify-between gap-3 text-sm"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {column.header}
                      </span>
                      <div className="min-w-0 flex-1 text-right">
                        {column.accessor(item, index)}
                      </div>
                    </div>
                  ))}

              {actions && actions.length > 0 && (
                <div className="flex justify-end pt-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="ml-1">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="max-h-72 w-48 overflow-y-auto border-border/60"
                    >
                      <DropdownMenuLabel className="text-foreground font-medium">
                        Activities
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-border/50" />

                      {actions.map((action, actionIndex) => (
                        <DropdownMenuItem
                          key={actionIndex}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(item);
                          }}
                          className={cn(
                            "text-foreground cursor-pointer font-medium",
                            action.className,
                          )}
                        >
                          {action.icon && (
                            <action.icon className="mr-2 h-4 w-4" />
                          )}
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-border/60 bg-card p-3 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        )}
      </div>

      <div
        ref={tableScrollRef}
        className="hidden md:block overflow-x-auto overflow-y-hidden touch-pan-x rounded-lg border border-border/60 bg-card"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div style={{ minWidth: mobileTableMinWidthPx }}>
          <CardContent className="px-0 sm:px-2">
            <table className="w-full border-collapse text-sm [&_tr]:border-b [&_tr]:border-border/30">
              <thead>
                <tr className="sticky top-0 z-10 border-b border-border bg-muted/40 backdrop-blur">
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className={`h-9 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground ${
                        column.className || ""
                      }`}
                    >
                      {column.header}
                    </th>
                  ))}
                  {actions && actions.length > 0 && (
                    <th className="h-9 px-2 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Activities
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      className="p-2"
                      colSpan={columns.length + (actions ? 1 : 0)}
                    >
                      <TableSkeleton />
                    </td>
                  </tr>
                ) : data && data.length > 0 ? (
                  data.map((item, index) => (
                    <tr
                      key={getRowKey ? getRowKey(item, index) : index}
                      className={cn(
                        "transition-colors hover:bg-muted/30",
                        onRowClick && "cursor-pointer",
                      )}
                      onClick={() => onRowClick?.(item)}
                    >
                      {columns.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          className={`h-11 p-2 text-center text-sm whitespace-nowrap ${column.className || ""}`}
                        >
                          {column.accessor(item, index)}
                        </td>
                      ))}
                      {actions && actions.length > 0 && (
                        <td className="p-2 text-right whitespace-nowrap">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-md hover:bg-muted"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4 text-foreground/70" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="end"
                              className="border-border/60"
                            >
                              <DropdownMenuLabel className="text-foreground font-medium">
                                Activities
                              </DropdownMenuLabel>

                              <DropdownMenuSeparator className="bg-border/50" />

                              {actions.map((action, actionIndex) => (
                                <DropdownMenuItem
                                  key={actionIndex}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick(item);
                                  }}
                                  className={`text-foreground cursor-pointer font-medium ${
                                    action.className || ""
                                  }`}
                                >
                                  {action.icon && (
                                    <action.icon className="mr-2 h-4 w-4" />
                                  )}
                                  {action.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="p-2 text-center"
                      colSpan={columns.length + (actions ? 1 : 0)}
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </div>
      </div>

      {/* Pagination */}
      {showPagination && paginationData && onPageChange && (
        <PaginationControls
          paginationData={paginationData}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
