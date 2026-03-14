"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus } from "lucide-react";

interface QuizzSettings {
  level: string;
  category: string;
  topic: string;
  count: number;
  shuffle: boolean;
}

interface QuizzHomeScreenProps {
  settings: QuizzSettings;
  setSettings: React.Dispatch<React.SetStateAction<QuizzSettings>>;
  categories: string[];
  topics: string[];
  questions: IQuizz[];
  onStart: () => void;
  isLoading: boolean;
}

export default function QuizzHomeScreen({
  settings,
  setSettings,
  categories,
  topics,
  questions,
  onStart,
  isLoading,
}: QuizzHomeScreenProps) {
  const minCount = 5;
  const filteredByCategoryTopic = questions.filter((q) => {
    if (settings.category !== "all" && q.category !== settings.category)
      return false;
    if (settings.topic !== "all" && q.topic !== settings.topic) return false;
    return true;
  });
  const maxCount = Math.max(filteredByCategoryTopic.length, minCount);

  const setCount = (next: number) => {
    const clamped = Math.min(maxCount, Math.max(minCount, next));
    setSettings((s) => ({ ...s, count: clamped }));
  };

  useEffect(() => {
    if (settings.count > maxCount) {
      setSettings((s) => ({ ...s, count: maxCount }));
    }
  }, [maxCount, settings.count, setSettings]);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0d1117] via-[#161b22] to-[#0d1117] font-serif flex items-center justify-center p-5">
      <div className="bg-white/4 backdrop-blur-2xl border border-white/10 rounded-[28px] p-10 max-w-125 w-full text-white shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="text-center mb-9">
          <div className="text-[56px] mb-2.5">⚡</div>
          <h1 className="text-[26px] font-bold m-0 mb-1.5 bg-linear-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
            Quizz
          </h1>
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
              <CustomSelect
                value={settings.category}
                onChange={(v) =>
                  setSettings((s) => ({ ...s, category: v, topic: "all" }))
                }
                options={categories.map((c) => ({ value: c, label: c }))}
                placeholder="📋 Tất cả danh mục"
                allValue="all"
              />
            </div>

            {/* Topic */}
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-[1.5px] block mb-2.5">
                Chủ đề
              </label>
              <CustomSelect
                value={settings.topic}
                onChange={(v) => setSettings((s) => ({ ...s, topic: v }))}
                options={topics.map((t) => ({ value: t, label: t }))}
                placeholder={
                  settings.category === "all"
                    ? "— Chọn danh mục trước —"
                    : "📋 Tất cả chủ đề"
                }
                allValue="all"
                disabled={settings.category === "all"}
              />
            </div>

            {/* Count */}
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-[1.5px] block mb-2.5">
                Số câu
              </label>
              <div className="mb-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCount(settings.count - 5)}
                  className="h-10 w-10 rounded-[10px] border-[1.5px] border-white/12 bg-white/6 text-white/75 transition-colors hover:border-white/25 hover:text-white"
                  aria-label="Giảm số câu"
                >
                  <Minus className="mx-auto h-4 w-4" />
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  min={minCount}
                  max={maxCount}
                  value={settings.count}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (Number.isNaN(v)) return;
                    setCount(v);
                  }}
                  className="h-10 flex-1 rounded-[10px] border-[1.5px] border-white/12 bg-white/6 px-3 text-center text-[14px] font-semibold text-sky-300 outline-none transition-colors focus:border-sky-400"
                />
                <button
                  type="button"
                  onClick={() => setCount(settings.count + 5)}
                  className="h-10 w-10 rounded-[10px] border-[1.5px] border-white/12 bg-white/6 text-white/75 transition-colors hover:border-white/25 hover:text-white"
                  aria-label="Tăng số câu"
                >
                  <Plus className="mx-auto h-4 w-4" />
                </button>
              </div>
              <input
                type="range"
                min={minCount}
                max={maxCount}
                step={5}
                value={settings.count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full accent-sky-400"
              />
              <div className="flex justify-between text-[11px] text-white/25 mt-1">
                <span>{minCount}</span>
                <span>{maxCount}</span>
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

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  allValue,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  allValue: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel =
    value === allValue
      ? placeholder
      : (options.find((o) => o.value === value)?.label ?? placeholder);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        className={cn(
          "w-full flex items-center justify-between py-2.5 px-3.5 rounded-[10px] border-[1.5px] border-white/12 bg-white/6 text-[13px] outline-none transition-all",
          disabled
            ? "opacity-40 cursor-not-allowed text-white/40"
            : "cursor-pointer text-white hover:border-white/25",
        )}
      >
        <span className="truncate">{selectedLabel}</span>
        <svg
          className={cn(
            "w-2.5 h-1.5 shrink-0 ml-2 transition-transform duration-200",
            open && !disabled && "rotate-180",
          )}
          viewBox="0 0 10 6"
          fill="none"
        >
          <path
            d="M1 1l4 4 4-4"
            stroke="rgba(255,255,255,.4)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-[#161b22] border border-white/14 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-hidden">
          <ScrollArea className="h-44">
            <button
              type="button"
              onClick={() => {
                onChange(allValue);
                setOpen(false);
              }}
              className={cn(
                "w-full text-left px-3.5 py-2 text-[13px] transition-colors",
                value === allValue
                  ? "bg-sky-400/20 text-sky-300"
                  : "text-white/70 hover:bg-white/8",
              )}
            >
              {placeholder}
            </button>
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3.5 py-2 text-[13px] transition-colors",
                  value === o.value
                    ? "bg-sky-400/20 text-sky-300"
                    : "text-white/70 hover:bg-white/8",
                )}
              >
                {o.label}
              </button>
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
