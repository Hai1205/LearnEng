"use client";

import { Minus, Plus } from "lucide-react";
import { NumericInput } from "@/components/commons/layout/NumericInput";

interface NumberOfQuestionProps {
  count: number;
  minCount: number;
  maxCount: number;
  onSetCount: (next: number) => void;
}

export const NumberOfQuestion = ({
  count,
  minCount,
  maxCount,
  onSetCount,
}: NumberOfQuestionProps) => {
  return (
    <div>
      <label className="text-[11px] text-white/40 uppercase tracking-[1.5px] block mb-2.5">
        Số câu
      </label>
      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onSetCount(count - 5)}
          className="h-10 w-10 rounded-[10px] border-[1.5px] border-white/12 bg-white/6 text-white/75 transition-colors hover:border-white/25 hover:text-white"
          aria-label="Giảm số câu"
        >
          <Minus className="mx-auto h-4 w-4" />
        </button>
        <NumericInput
          inputMode="numeric"
          min={minCount}
          max={maxCount}
          value={count}
          onValueChange={onSetCount}
          emptyValue={minCount}
          emitOnEmpty={false}
          className="h-10 flex-1 rounded-[10px] border-[1.5px] border-white/12 bg-white/6 px-3 text-center text-[14px] font-semibold text-sky-300 outline-none transition-colors focus:border-sky-400"
        />
        <button
          type="button"
          onClick={() => onSetCount(count + 5)}
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
        step={1}
        value={count}
        onChange={(e) => onSetCount(parseInt(e.target.value, 10))}
        className="w-full accent-sky-400"
      />
      <div className="flex justify-between text-[11px] text-white/25 mt-1">
        <span>{minCount}</span>
        <span>{maxCount}</span>
      </div>
    </div>
  );
};
