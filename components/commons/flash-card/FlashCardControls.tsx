"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TopicDropdown } from "./TopicDropdown";

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
