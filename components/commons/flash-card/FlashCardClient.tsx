"use client";

import { useEffect, useMemo, useState } from "react";
import { useAllFlashCardsQuery } from "@/hooks/useFlashCardApi";
import {
  useVocabularyProgressQuery,
  useUpdateVocabularyProgressMutation,
} from "@/hooks/useVocabularyProgressApi";
import FlashCardHeader from "./FlashCardHeader";
import FlashCardControls from "./FlashCardControls";
import FlashCardItem from "./FlashCardItem";
import FlashCardNavigation from "./FlashCardNavigation";
import FlashCardActions from "./FlashCardActions";

export default function FlashCardClient() {
  const { data: cardsData, isLoading: cardsLoading } = useAllFlashCardsQuery();
  const { data: progressData, isLoading: progressLoading } =
    useVocabularyProgressQuery();
  const updateProgress = useUpdateVocabularyProgressMutation();

  const [mode, setMode] = useState<"all" | "unlearned">("all");
  const [topic, setTopic] = useState("");
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [fade, setFade] = useState(false);

  const allCards = useMemo(() => cardsData?.data?.cards ?? [], [cardsData]);

  const progressMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    (progressData?.data?.progress ?? []).forEach((p) => {
      map[p.flashCardId] = p.isMemorized;
    });
    return map;
  }, [progressData]);

  const topics = useMemo(
    () => [...new Set(allCards.map((c) => c.topic))].sort(),
    [allCards],
  );

  const cards = useMemo(() => {
    if (mode === "all")
      return topic ? allCards.filter((c) => c.topic === topic) : allCards;
    return allCards.filter((c) => !progressMap[c.id]);
  }, [mode, allCards, topic, progressMap]);

  const card = cards[idx] ?? null;
  const isLearned = card ? !!progressMap[card.id] : false;

  const totalLearned = useMemo(
    () => Object.values(progressMap).filter(Boolean).length,
    [progressMap],
  );

  const topicCards = useMemo(
    () => (topic ? allCards.filter((c) => c.topic === topic) : allCards),
    [allCards, topic],
  );

  const topicLearned = useMemo(
    () => topicCards.filter((c) => progressMap[c.id]).length,
    [topicCards, progressMap],
  );

  const go = (dir: number) => {
    setFade(true);
    setTimeout(() => {
      setIdx((i) =>
        dir > 0 ? Math.min(i + 1, cards.length - 1) : Math.max(i - 1, 0),
      );
      setFlipped(false);
      setFade(false);
    }, 160);
  };

  const markProgress = (memorized: boolean) => {
    if (!card) return;
    updateProgress.mutate({ flashCardId: card.id, isMemorized: memorized });
    if (memorized && idx < cards.length - 1) {
      go(1);
    }
  };

  useEffect(() => {
    setIdx(0);
    setFlipped(false);
  }, [mode, topic]);

  if (cardsLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white/40 font-sans text-sm animate-pulse">
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 pb-12 font-serif">
      <div className="w-full max-w-115 pt-8">
        <FlashCardHeader totalWords={allCards.length} />
        <FlashCardControls
          mode={mode}
          setMode={setMode}
          topic={topic}
          setTopic={setTopic}
          topics={topics}
          allCards={allCards}
          topicLearned={topicLearned}
          topicTotal={topicCards.length}
          cardsCount={cards.length}
          currentIdx={idx}
        />
      </div>

      <div className="w-full max-w-115 mt-5">
        {cards.length === 0 ? (
          <div className="text-center py-16 font-sans text-white/40">
            <div className="text-5xl mb-3.5">🎉</div>
            <div className="text-lg text-white/65 font-serif mb-2">
              Xuất sắc!
            </div>
            <div className="text-sm">Bạn đã thuộc tất cả các từ rồi.</div>
          </div>
        ) : (
          <>
            <FlashCardItem
              card={card}
              isLearned={isLearned}
              flipped={flipped}
              fade={fade}
              onFlip={() => setFlipped((f) => !f)}
              mode={mode}
            />
            <FlashCardNavigation
              idx={idx}
              total={cards.length}
              onPrev={() => go(-1)}
              onNext={() => go(1)}
            />
            <FlashCardActions
              isLearned={isLearned}
              onMarkUnlearned={() => markProgress(false)}
              onMarkLearned={() => markProgress(true)}
            />
          </>
        )}
      </div>

      <div className="mt-8 font-mono text-[10px] text-white/16 tracking-wide">
        {totalLearned} / {allCards.length} từ đã thuộc toàn bộ
      </div>
    </div>
  );
}
