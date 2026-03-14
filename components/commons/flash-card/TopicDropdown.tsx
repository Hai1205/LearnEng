"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TopicDropdownProps {
  topic: string;
  setTopic: (t: string) => void;
  topics: string[];
  allCards: IFlashCard[];
}

export const TopicDropdown = ({
  topic,
  setTopic,
  topics,
  allCards,
}: TopicDropdownProps) => {
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