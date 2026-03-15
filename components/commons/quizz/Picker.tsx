"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";

interface PickerProps {
  label: string;
  placeholder: string;
  emptyMessage: string;
  isOpen: boolean;
  onToggleOpen: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  allSelected: boolean;
  onToggleAll: () => void;
  items: string[];
  selectedItems: string[];
  onToggleItem: (value: string) => void;
  disableAll?: boolean;
}

export const Picker = ({
  label,
  placeholder,
  emptyMessage,
  isOpen,
  onToggleOpen,
  searchValue,
  onSearchChange,
  allSelected,
  onToggleAll,
  items,
  selectedItems,
  onToggleItem,
  disableAll,
}: PickerProps) => {
  const idPrefix = label.toLowerCase().replace(/\s/g, "-");

  return (
    <div>
      <button
        type="button"
        onClick={onToggleOpen}
        className="mb-2.5 flex w-full items-center justify-between text-left"
      >
        <span className="text-[11px] text-white/40 uppercase tracking-[1.5px]">
          {label}
        </span>

        <ChevronDown
          className={cn(
            "h-4 w-4 text-white/45 transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0",
          )}
        />
      </button>

      {isOpen && (
        <div className="rounded-[12px] border border-white/10 bg-white/4 p-3">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="mb-2.5 h-9 w-full rounded-[10px] border border-white/12 bg-white/6 px-3 text-sm text-white/80 outline-none transition-colors placeholder:text-white/35 focus:border-sky-400"
          />

          <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
            <Checkbox
              id={`${idPrefix}-all`}
              checked={allSelected}
              onCheckedChange={onToggleAll}
              className="border-sky-400/60"
              disabled={disableAll}
            />

            <label
              htmlFor={`${idPrefix}-all`}
              className="cursor-pointer text-sm font-semibold text-sky-300"
            >
              Tất cả {label.toLowerCase()}
            </label>
          </div>

          <ScrollArea className="mt-2 h-28">
            {items.length === 0 ? (
              <p className="px-1 text-sm text-white/40">{emptyMessage}</p>
            ) : (
              <div className="space-y-1 pr-2">
                {items.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-white/6"
                  >
                    <Checkbox
                      id={`${idPrefix}-${item}`}
                      checked={selectedItems.includes(item)}
                      onCheckedChange={() => onToggleItem(item)}
                      className="border-white/40"
                    />

                    <label
                      htmlFor={`${idPrefix}-${item}`}
                      className="flex-1 cursor-pointer text-sm text-white/80"
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
