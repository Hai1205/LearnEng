import { cn } from "@/lib/utils";

interface FlashCardActionsProps {
  isLearned: boolean;
  onMarkUnlearned: () => void;
  onMarkLearned: () => void;
}

export default function FlashCardActions({
  isLearned,
  onMarkUnlearned,
  onMarkLearned,
}: FlashCardActionsProps) {
  return (
    <div className="flex gap-2.5 mt-4">
      <button
        onClick={onMarkUnlearned}
        className="flex-1 py-3 rounded-full font-sans font-medium text-sm bg-red-500/10 text-red-300 border border-red-500/22 transition-all hover:brightness-110 hover:-translate-y-px active:scale-[0.97]"
      >
        ✗ Chưa thuộc
      </button>
      <button
        onClick={onMarkLearned}
        className={cn(
          "flex-1 py-3 rounded-full font-sans font-medium text-sm text-green-300 border transition-all hover:brightness-110 hover:-translate-y-px active:scale-[0.97]",
          isLearned
            ? "bg-green-400/18 border-green-400/40 shadow-[0_0_14px_rgba(74,222,128,0.1)]"
            : "bg-green-400/7 border-green-400/16",
        )}
      >
        ✓ Đã thuộc
      </button>
    </div>
  );
}
