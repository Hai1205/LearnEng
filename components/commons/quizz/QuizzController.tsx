"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { NumberOfQuestion } from "./NumberOfQuestion";
import { Picker } from "./Picker";

interface QuizzSettings {
  level: string;
  category: string[];
  topic: string[];
  count: number;
  shuffle: boolean;
}

interface QuizzControllerProps {
  settings: QuizzSettings;
  setSettings: React.Dispatch<React.SetStateAction<QuizzSettings>>;
  categories: string[];
  questions: IQuizz[];
  onStart: () => void;
  isLoading: boolean;
}

export default function QuizzController({
  settings,
  setSettings,
  categories,
  questions,
  onStart,
  isLoading,
}: QuizzControllerProps) {
  const didInitCategorySelection = useRef(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isTopicOpen, setIsTopicOpen] = useState(true);
  const [categorySearch, setCategorySearch] = useState("");
  const [topicSearch, setTopicSearch] = useState("");
  const minCount = 0;

  const selectedCategories = settings.category;
  const selectedTopics = settings.topic;

  const topicsBySelectedCategories = useMemo(
    () =>
      [
        ...new Set(
          questions
            .filter((q) => selectedCategories.includes(q.category))
            .map((q) => q.topic),
        ),
      ].sort(),
    [questions, selectedCategories],
  );

  const allCategoriesSelected =
    categories.length > 0 && selectedCategories.length === categories.length;
  const allTopicsSelected =
    topicsBySelectedCategories.length > 0 &&
    selectedTopics.length === topicsBySelectedCategories.length;

  const visibleCategories = useMemo(
    () =>
      categories.filter((category) =>
        category.toLowerCase().includes(categorySearch.trim().toLowerCase()),
      ),
    [categories, categorySearch],
  );

  const visibleTopics = useMemo(
    () =>
      topicsBySelectedCategories.filter((topic) =>
        topic.toLowerCase().includes(topicSearch.trim().toLowerCase()),
      ),
    [topicsBySelectedCategories, topicSearch],
  );

  const filteredBySettings = questions.filter((q) => {
    if (settings.level !== "all" && q.level !== settings.level) return false;
    if (!selectedCategories.includes(q.category)) return false;
    if (selectedTopics.length > 0 && !selectedTopics.includes(q.topic))
      return false;
    return true;
  });
  const maxCount = Math.max(filteredBySettings.length, minCount);

  const setCount = (next: number) => {
    const clamped = Math.min(maxCount, Math.max(minCount, next));
    setSettings((s) => ({ ...s, count: clamped }));
  };

  useEffect(() => {
    if (settings.count > maxCount) {
      setSettings((s) => ({ ...s, count: maxCount }));
    }
  }, [maxCount, settings.count, setSettings]);

  useEffect(() => {
    if (didInitCategorySelection.current || categories.length === 0) return;

    // Run default selection bootstrap exactly once.
    didInitCategorySelection.current = true;

    if (selectedCategories.length === 0) {
      const defaultTopics = [
        ...new Set(
          questions
            .filter((q) => categories.includes(q.category))
            .map((q) => q.topic),
        ),
      ];

      setSettings((s) => ({
        ...s,
        category: categories,
        topic: defaultTopics,
      }));
    }
  }, [categories, selectedCategories.length, setSettings, questions]);

  useEffect(() => {
    if (selectedCategories.length === 0) return;

    const validTopics = selectedTopics.filter((topic) =>
      topicsBySelectedCategories.includes(topic),
    );
    if (validTopics.length !== selectedTopics.length) {
      setSettings((s) => ({ ...s, topic: validTopics }));
    }
  }, [
    selectedCategories.length,
    selectedTopics,
    setSettings,
    topicsBySelectedCategories,
  ]);

  const toggleCategory = (value: string) => {
    setSettings((s) => {
      const hasValue = s.category.includes(value);
      const nextCategories = hasValue
        ? s.category.filter((c) => c !== value)
        : [...s.category, value];

      const topicsFromSelectedCategories = [
        ...new Set(
          questions
            .filter((q) => nextCategories.includes(q.category))
            .map((q) => q.topic),
        ),
      ];
      const allowedTopics = new Set(topicsFromSelectedCategories);
      const nextTopics = hasValue
        ? s.topic.filter((t) => allowedTopics.has(t))
        : [...new Set([...s.topic, ...topicsFromSelectedCategories])];

      return {
        ...s,
        category: nextCategories,
        topic: nextTopics,
      };
    });
  };

  const toggleTopic = (value: string) => {
    setSettings((s) => {
      const hasValue = s.topic.includes(value);
      return {
        ...s,
        topic: hasValue
          ? s.topic.filter((t) => t !== value)
          : [...s.topic, value],
      };
    });
  };

  const handleStart = () => {
    if (settings.count === 0) {
      toast.error("Vui lòng chọn ít nhất 1 câu hỏi");
      return;
    }

    onStart();
  };

  const handleToggleAllCategories = () => {
    setSettings((s) => {
      if (allCategoriesSelected) {
        return {
          ...s,
          category: [],
          topic: [],
        };
      }

      const allTopics = [
        ...new Set(
          questions
            .filter((q) => categories.includes(q.category))
            .map((q) => q.topic),
        ),
      ];

      return {
        ...s,
        category: categories,
        topic: allTopics,
      };
    });
  };

  const handleToggleAllTopics = () => {
    setSettings((s) => ({
      ...s,
      topic: allTopicsSelected ? [] : topicsBySelectedCategories,
    }));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0d1117] via-[#161b22] to-[#0d1117] font-serif flex items-center justify-center p-5">
      <div className="bg-white/4 backdrop-blur-2xl border border-white/10 rounded-[28px] p-10 max-w-125 w-full text-white shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="text-center mb-9">
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
            <Picker
              label="Danh mục"
              placeholder="Tìm danh mục..."
              emptyMessage="Không tìm thấy danh mục phù hợp."
              isOpen={isCategoryOpen}
              onToggleOpen={() => setIsCategoryOpen((prev) => !prev)}
              searchValue={categorySearch}
              onSearchChange={setCategorySearch}
              allSelected={allCategoriesSelected}
              onToggleAll={handleToggleAllCategories}
              items={visibleCategories}
              selectedItems={selectedCategories}
              onToggleItem={toggleCategory}
            />

            {/* Topic */}
            <Picker
              label="Chủ đề"
              placeholder="Tìm chủ đề..."
              emptyMessage="Không tìm thấy chủ đề phù hợp."
              isOpen={isTopicOpen}
              onToggleOpen={() => setIsTopicOpen((prev) => !prev)}
              searchValue={topicSearch}
              onSearchChange={setTopicSearch}
              allSelected={allTopicsSelected}
              onToggleAll={handleToggleAllTopics}
              items={visibleTopics}
              selectedItems={selectedTopics}
              onToggleItem={toggleTopic}
              disableAll={topicsBySelectedCategories.length === 0}
            />

            {/* Number of Questions */}
            <NumberOfQuestion
              count={settings.count}
              minCount={minCount}
              maxCount={maxCount}
              onSetCount={setCount}
            />

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
              onClick={handleStart}
              className="py-4 rounded-[14px] border-none bg-linear-to-br from-sky-400 to-indigo-400 text-white text-[15px] font-bold tracking-wider mt-1 shadow-[0_4px_24px_rgba(56,189,248,0.35)] transition-transform active:scale-[0.98]"
            >
              BẮT ĐẦU
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
