import { cn } from "@/lib/utils";

const LABELS = ["A", "B", "C", "D"];

const LEVEL_COLORS: Record<
  string,
  { color: string; bg: string; emoji: string }
> = {
  Dễ: { color: "#10b981", bg: "#d1fae5", emoji: "🟢" },
  "Trung bình": { color: "#f59e0b", bg: "#fef3c7", emoji: "🟡" },
  Khó: { color: "#ef4444", bg: "#fee2e2", emoji: "🔴" },
};

interface QuizzQuestionScreenProps {
  question: IQuizz;
  idx: number;
  total: number;
  selected: number | null;
  confirmed: boolean;
  streak: number;
  elapsed: number;
  onSelect: (i: number) => void;
  onConfirm: () => void;
  onNext: () => void;
  onExit: () => void;
}

function fmtTime(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export default function QuizzQuestionScreen({
  question,
  idx,
  total,
  selected,
  confirmed,
  streak,
  elapsed,
  onSelect,
  onConfirm,
  onNext,
  onExit,
}: QuizzQuestionScreenProps) {
  const lv = LEVEL_COLORS[question.level];
  const progress = ((idx + 1) / total) * 100;

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0d1117] via-[#161b22] to-[#0d1117] font-serif p-5 flex flex-col items-center">
      {/* Top bar */}
      <div className="w-full max-w-150 flex items-center justify-between mb-3.5">
        <button
          onClick={onExit}
          className="bg-white/7 border border-white/10 text-white/60 py-1.5 px-3.5 rounded-lg text-xs font-inherit hover:bg-white/12 transition-colors"
        >
          ← Thoát
        </button>
        <div className="flex gap-2.5 items-center">
          {streak >= 3 && (
            <span className="bg-amber-400/15 border border-amber-400/40 text-amber-400 py-1 px-2.5 rounded-full text-xs">
              🔥 {streak} liên tiếp
            </span>
          )}
          <span className="text-white/40 text-xs">⏱ {fmtTime(elapsed)}</span>
        </div>
        <span className="text-white/60 text-[13px] font-bold">
          {idx + 1}
          <span className="opacity-40">/{total}</span>
        </span>
      </div>

      {/* Progress */}
      <div className="w-full max-w-150 h-1 bg-white/8 rounded-sm mb-5.5 overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-sky-400 to-indigo-400 rounded-sm transition-[width] duration-400 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Card */}
      <div className="w-full max-w-150 bg-white/4 backdrop-blur-xl border border-white/9 rounded-[22px] p-7 mb-4">
        {/* Badges */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {lv && (
            <span
              className="py-0.5 px-2.5 rounded-full text-xs font-bold"
              style={{ background: lv.bg, color: lv.color }}
            >
              {lv.emoji} {question.level}
            </span>
          )}
          <span className="bg-sky-400/10 text-sky-400 py-0.5 px-2.5 rounded-full text-xs font-bold">
            {question.category}
          </span>
        </div>

        {/* Question */}
        <p className="text-white/92 text-[17px] leading-relaxed m-0 mb-6 font-medium">
          {question.question}
        </p>

        {/* Options */}
        <div className="flex flex-col gap-2.5">
          {question.options.map((opt, i) => {
            let borderColor = "border-white/10";
            let bgColor = "bg-white/4";
            let textColor = "text-white/75";
            let labelBg = "bg-white/8";

            if (selected === i && !confirmed) {
              borderColor = "border-sky-400";
              bgColor = "bg-sky-400/12";
              textColor = "text-sky-400";
              labelBg = "bg-sky-400/20";
            }

            if (confirmed) {
              if (i === question.answer) {
                borderColor = "border-emerald-500";
                bgColor = "bg-emerald-500/15";
                textColor = "text-emerald-500";
                labelBg = "bg-emerald-500/25";
              } else if (i === selected && selected !== question.answer) {
                borderColor = "border-red-500";
                bgColor = "bg-red-500/12";
                textColor = "text-red-500";
                labelBg = "bg-red-500/20";
              }
            }

            return (
              <button
                key={i}
                onClick={() => onSelect(i)}
                className={cn(
                  "py-3.5 px-4 rounded-xl border-[1.5px] text-left text-sm transition-all flex items-center gap-3 font-inherit",
                  borderColor,
                  bgColor,
                  textColor,
                  confirmed
                    ? "cursor-default"
                    : "cursor-pointer hover:border-white/20",
                )}
              >
                <span
                  className={cn(
                    "font-bold min-w-6 h-6 rounded-md flex items-center justify-center text-[11px] shrink-0",
                    labelBg,
                  )}
                >
                  {LABELS[i]}
                </span>
                <span className="flex-1">{opt}</span>
                {confirmed && i === question.answer && (
                  <span className="text-base">✓</span>
                )}
                {confirmed &&
                  i === selected &&
                  selected !== question.answer && (
                    <span className="text-base">✗</span>
                  )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action button */}
      {!confirmed ? (
        <button
          onClick={onConfirm}
          disabled={selected === null}
          className={cn(
            "py-3.5 px-10 rounded-xl border-none text-sm font-bold font-inherit tracking-wider transition-all",
            selected !== null
              ? "bg-linear-to-br from-sky-400 to-indigo-400 text-white cursor-pointer shadow-[0_4px_20px_rgba(56,189,248,0.3)]"
              : "bg-white/8 text-white/25 cursor-default",
          )}
        >
          Xác nhận
        </button>
      ) : (
        <button
          onClick={onNext}
          className="py-3.5 px-10 rounded-xl border-none bg-linear-to-br from-sky-400 to-indigo-400 text-white text-sm font-bold font-inherit tracking-wider cursor-pointer shadow-[0_4px_20px_rgba(56,189,248,0.3)]"
        >
          {idx + 1 >= total ? "Xem kết quả 🏆" : "Tiếp theo →"}
        </button>
      )}
    </div>
  );
}
