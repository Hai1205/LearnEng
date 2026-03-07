import { cn } from "@/lib/utils";

interface FlashCardNavigationProps {
  idx: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function FlashCardNavigation({
  idx,
  total,
  onPrev,
  onNext,
}: FlashCardNavigationProps) {
  const pips = Array.from(
    { length: Math.min(total, 7) },
    (_, i) => Math.max(0, idx - 3) + i,
  ).filter((r) => r < total);

  return (
    <div className="flex items-center justify-center gap-3.5 mt-4">
      <button
        onClick={onPrev}
        disabled={idx === 0}
        className="w-10 h-10 rounded-full border border-white/10 bg-white/4 text-white/55 text-[17px] flex items-center justify-center transition-all hover:bg-white/9 hover:border-white/22 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-white/4 disabled:hover:border-white/10 disabled:hover:text-white/55"
      >
        ←
      </button>

      <div className="flex gap-1 items-center">
        {pips.map((r) => (
          <div
            key={r}
            className={cn(
              "h-1.5 rounded-full transition-all duration-200",
              r === idx
                ? "bg-indigo-400 w-4.5 rounded-sm"
                : "bg-white/14 w-1.5",
            )}
          />
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={idx === total - 1}
        className="w-10 h-10 rounded-full border border-white/10 bg-white/4 text-white/55 text-[17px] flex items-center justify-center transition-all hover:bg-white/9 hover:border-white/22 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-white/4 disabled:hover:border-white/10 disabled:hover:text-white/55"
      >
        →
      </button>
    </div>
  );
}
