"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        <TopicDropdown
          topic={topic}
          setTopic={setTopic}
          topics={topics}
          allCards={allCards}
        />
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

function TopicDropdown({
  topic,
  setTopic,
  topics,
  allCards,
}: {
  topic: string;
  setTopic: (t: string) => void;
  topics: string[];
  allCards: IFlashCard[];
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

  const selected = topic
    ? `${topic} (${allCards.filter((c) => c.topic === topic).length} từ)`
    : `📋 Tất cả chủ đề (${allCards.length} từ)`;

  return (
    <div className="mb-3.5 relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between bg-white/6 border border-white/11 text-white/82 rounded-xl py-2.5 pl-3.5 pr-3 font-sans text-[13px] outline-none cursor-pointer transition-colors hover:border-white/22"
      >
        <span className="truncate">{selected}</span>
        <svg
          className={cn(
            "w-2.5 h-1.5 shrink-0 ml-2 transition-transform duration-200",
            open && "rotate-180",
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

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[#1c2333] border border-white/14 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-hidden">
          <ScrollArea className="h-52">
            <button
              type="button"
              onClick={() => {
                setTopic("");
                setOpen(false);
              }}
              className={cn(
                "w-full text-left px-3.5 py-2 font-sans text-[13px] transition-colors",
                topic === ""
                  ? "bg-indigo-500/20 text-indigo-300"
                  : "text-white/70 hover:bg-white/8",
              )}
            >
              📋 Tất cả chủ đề ({allCards.length} từ)
            </button>
            {topics.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTopic(t);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3.5 py-2 font-sans text-[13px] transition-colors",
                  topic === t
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "text-white/70 hover:bg-white/8",
                )}
              >
                {t} ({allCards.filter((c) => c.topic === t).length} từ)
              </button>
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
