import { cn } from "@/lib/utils";

interface FlashCardControlsProps {
  mode: "all" | "unlearned";
  setMode: (mode: "all" | "unlearned") => void;
  topic: string;
  setTopic: (topic: string) => void;
  topics: string[];
  allCards: IFlashCard[];
  topicLearned: number;
  topicTotal: number;
  cardsCount: number;
  currentIdx: number;
}

export default function FlashCardControls({
  mode,
  setMode,
  topic,
  setTopic,
  topics,
  allCards,
  topicLearned,
  topicTotal,
  cardsCount,
  currentIdx,
}: FlashCardControlsProps) {
  const pct = topicTotal > 0 ? (topicLearned / topicTotal) * 100 : 0;

  return (
    <>
      {/* Mode tabs */}
      <div className="flex gap-0.5 p-0.5 bg-white/4 rounded-full mb-4 border border-white/7">
        {(
          [
            ["all", "📚 Tất cả"],
            ["unlearned", "📌 Chưa thuộc"],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "flex-1 py-1.5 px-5 rounded-full text-[13px] font-medium font-sans transition-all",
              mode === m
                ? "bg-indigo-500/80 text-white shadow-[0_2px_8px_rgba(99,102,241,0.35)]"
                : "bg-transparent text-white/38 hover:text-white/55",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Topic dropdown */}
      {mode === "all" && (
        <div className="mb-3.5">
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full appearance-none bg-white/6 border border-white/11 text-white/82 rounded-xl py-2.5 pl-3.5 pr-9 font-sans text-[13px] outline-none cursor-pointer transition-colors hover:border-white/22 bg-no-repeat bg-position-[right_11px_center] bg-size-[10px_6px] bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%226%22%3E%3Cpath%20d%3D%22M1%201l4%204%204-4%22%20stroke%3D%22rgba(255%2C255%2C255%2C.4)%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E')]"
          >
            <option value="" className="bg-[#1c2333] text-white">
              📋 Tất cả chủ đề ({allCards.length} từ)
            </option>
            {topics.map((t) => (
              <option key={t} value={t} className="bg-[#1c2333] text-white">
                {t} ({allCards.filter((c) => c.topic === t).length} từ)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Stats */}
      <div className="flex justify-between font-sans text-[11px] text-white/30 mb-1.5">
        <span>
          {mode === "all"
            ? `${topicLearned}/${topicTotal} đã thuộc`
            : `${cardsCount} từ chưa thuộc`}
        </span>
        {cardsCount > 0 && (
          <span>
            {currentIdx + 1} / {cardsCount}
          </span>
        )}
      </div>

      {/* Progress bar */}
      {mode === "all" && (
        <div className="w-full h-0.5 bg-white/6 rounded-full mb-1 overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-indigo-500 to-indigo-400 rounded-full transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </>
  );
}
