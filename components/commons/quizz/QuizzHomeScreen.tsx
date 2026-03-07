import { cn } from "@/lib/utils";

const LEVEL_CONFIG: Record<
  string,
  { color: string; bg: string; emoji: string }
> = {
  Dễ: { color: "text-emerald-500", bg: "bg-emerald-100", emoji: "🟢" },
  "Trung bình": { color: "text-amber-500", bg: "bg-amber-100", emoji: "🟡" },
  Khó: { color: "text-red-500", bg: "bg-red-100", emoji: "🔴" },
};

interface QuizzSettings {
  level: string;
  cat: string;
  topic: string;
  count: number;
  shuffle: boolean;
}

interface QuizzHomeScreenProps {
  settings: QuizzSettings;
  setSettings: React.Dispatch<React.SetStateAction<QuizzSettings>>;
  categories: string[];
  topics: string[];
  onStart: () => void;
  isLoading: boolean;
  totalQuestions: number;
}

export default function QuizzHomeScreen({
  settings,
  setSettings,
  categories,
  topics,
  onStart,
  isLoading,
  totalQuestions,
}: QuizzHomeScreenProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#0d1117] via-[#161b22] to-[#0d1117] font-serif flex items-center justify-center p-5">
      <div className="bg-white/4 backdrop-blur-2xl border border-white/10 rounded-[28px] p-10 max-w-125 w-full text-white shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="text-center mb-9">
          <div className="text-[56px] mb-2.5">⚡</div>
          <h1 className="text-[26px] font-bold m-0 mb-1.5 bg-linear-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
            Quizz
          </h1>
          <p className="text-white/45 m-0 text-[13px] tracking-wider">
            {totalQuestions} CÂU • ĐỘNG TỪ KÉP TIẾNG ANH
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-white/40 text-sm animate-pulse">
            Đang tải câu hỏi...
          </div>
        ) : (
          <div className="flex flex-col gap-4.5">
            {/* Level */}
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-[1.5px] block mb-2.5">
                Độ khó
              </label>
              <div className="flex gap-2">
                {["all", "Dễ", "Trung bình", "Khó"].map((l) => (
                  <button
                    key={l}
                    onClick={() => setSettings((s) => ({ ...s, level: l }))}
                    className={cn(
                      "flex-1 py-2.5 px-1 rounded-[10px] border-[1.5px] text-xs font-bold transition-all",
                      settings.level === l
                        ? "border-sky-400 bg-sky-400/15 text-sky-400"
                        : "border-white/12 bg-transparent text-white/50 hover:border-white/25",
                    )}
                  >
                    {l === "all" ? "Tất cả" : l}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-[1.5px] block mb-2.5">
                Danh mục
              </label>
              <select
                value={settings.cat}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    cat: e.target.value,
                    topic: "all",
                  }))
                }
                className="w-full py-2.5 px-3.5 rounded-[10px] border-[1.5px] border-white/12 bg-white/6 text-white text-[13px] outline-none cursor-pointer font-inherit"
              >
                <option value="all" className="bg-[#161b22]">
                  📋 Tất cả danh mục
                </option>
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-[#161b22]">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic */}
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-[1.5px] block mb-2.5">
                Chủ đề
              </label>
              <select
                value={settings.topic}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, topic: e.target.value }))
                }
                disabled={settings.cat === "all"}
                className={cn(
                  "w-full py-2.5 px-3.5 rounded-[10px] border-[1.5px] border-white/12 bg-white/6 text-[13px] outline-none font-inherit transition-opacity",
                  settings.cat === "all"
                    ? "opacity-40 cursor-not-allowed text-white/40"
                    : "cursor-pointer text-white",
                )}
              >
                <option value="all" className="bg-[#161b22]">
                  {settings.cat === "all"
                    ? "— Chọn danh mục trước —"
                    : "📋 Tất cả chủ đề"}
                </option>
                {topics.map((t) => (
                  <option key={t} value={t} className="bg-[#161b22]">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Count */}
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-[1.5px] block mb-2.5">
                Số câu:{" "}
                <span className="text-sky-400 font-bold">{settings.count}</span>
              </label>
              <input
                type="range"
                min={5}
                max={Math.max(totalQuestions, 5)}
                step={5}
                value={settings.count}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    count: parseInt(e.target.value),
                  }))
                }
                className="w-full accent-sky-400"
              />
              <div className="flex justify-between text-[11px] text-white/25 mt-1">
                <span>5</span>
                <span>{Math.max(totalQuestions, 5)}</span>
              </div>
            </div>

            {/* Shuffle */}
            <div className="flex items-center justify-between py-3 px-3.5 bg-white/4 rounded-[10px] border border-white/8">
              <span className="text-[13px] text-white/60">
                🔀 Xáo trộn câu hỏi
              </span>
              <div
                onClick={() =>
                  setSettings((s) => ({ ...s, shuffle: !s.shuffle }))
                }
                className={cn(
                  "w-11 h-6 rounded-xl relative transition-colors cursor-pointer",
                  settings.shuffle ? "bg-sky-400" : "bg-white/15",
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.75 w-4.5 h-4.5 rounded-full bg-white transition-[left] shadow-md",
                    settings.shuffle ? "left-5.5" : "left-0.75",
                  )}
                />
              </div>
            </div>

            <button
              onClick={onStart}
              className="py-4 rounded-[14px] border-none bg-linear-to-br from-sky-400 to-indigo-400 text-white text-[15px] font-bold tracking-wider mt-1 shadow-[0_4px_24px_rgba(56,189,248,0.35)] transition-transform active:scale-[0.98]"
            >
              ⚡ BẮT ĐẦU LUYỆN TẬP
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
