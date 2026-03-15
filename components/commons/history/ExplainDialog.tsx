"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const LABELS = ["A", "B", "C", "D"];

function getLabel(index: number): string {
  const safeIndex = Number(index);
  if (
    !Number.isInteger(safeIndex) ||
    safeIndex < 0 ||
    safeIndex >= LABELS.length
  ) {
    return "-";
  }

  return LABELS[safeIndex];
}

interface ExplainDialogProps {
  selectedItem: IQuizzHistoryItem | null;
  onOpenChange: (open: boolean) => void;
}

export const ExplainDialog = ({
  selectedItem,
  onOpenChange,
}: ExplainDialogProps) => {
  return (
    <Dialog open={Boolean(selectedItem)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chi tiết câu hỏi</DialogTitle>
          <DialogDescription>
            Xem đáp án và phần giải thích của câu đã làm.
          </DialogDescription>
        </DialogHeader>

        {selectedItem && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border/50 bg-card/60 p-3">
              <p className="text-sm text-muted-foreground">Câu hỏi</p>
              <p className="mt-1 text-sm leading-relaxed text-foreground">
                {selectedItem.question || "Câu hỏi không còn tồn tại"}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border/50 bg-card/60 p-3">
                <p className="text-sm text-muted-foreground">Bạn đã chọn</p>
                <p className="mt-1 text-sm text-foreground">
                  {getLabel(selectedItem.selectedAnswer)}.{" "}
                  {selectedItem.selectedAnswerText || "-"}
                </p>
              </div>

              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                <p className="text-sm text-emerald-400">Đáp án đúng</p>
                <p className="mt-1 text-sm text-emerald-500">
                  {getLabel(selectedItem.correctAnswer)}.{" "}
                  {selectedItem.correctAnswerText || "-"}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-sky-500/30 bg-sky-500/10 p-3">
              <p className="text-sm font-medium text-sky-400">Giải thích</p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/90">
                {selectedItem.explaining?.trim() ||
                  "Chưa có phần giải thích cho câu hỏi này."}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
