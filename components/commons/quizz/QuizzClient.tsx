"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAllQuizzesQuery } from "@/hooks/useQuizzApi";
import { useSaveQuizzResultMutation } from "@/hooks/useQuizzResultApi";
import QuizzHome from "./QuizzHome";
import QuizzQuestion from "./QuizzQuestion";
import QuizzResult from "./QuizzResult";
import QuizzSkeleton from "./QuizzSkeleton";

interface AnswerRecord {
  qid: string;
  correct: boolean;
  chosen: number;
  answer: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizzClient() {
  const { data: quizzData, isLoading } = useAllQuizzesQuery();
  const saveResult = useSaveQuizzResultMutation();

  const allQuestions = useMemo(() => quizzData?.data?.cards ?? [], [quizzData]);

  const categories = useMemo(
    () => [...new Set(allQuestions.map((q) => q.category))].sort(),
    [allQuestions],
  );

  const [screen, setScreen] = useState<"home" | "quiz" | "result">("home");
  const [settings, setSettings] = useState({
    level: "all",
    category: "all",
    topic: "all",
    count: 20,
    shuffle: true,
  });
  const [pool, setPool] = useState<IQuizz[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [streak, setStreak] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const topics = useMemo(
    () =>
      settings.category === "all"
        ? []
        : [
            ...new Set(
              allQuestions
                .filter((q) => q.category === settings.category)
                .map((q) => q.topic),
            ),
          ].sort(),
    [allQuestions, settings.category],
  );

  useEffect(() => {
    if (screen !== "quiz") return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [screen]);

  const startQuiz = useCallback(() => {
    let filtered = allQuestions;
    if (settings.level !== "all")
      filtered = filtered.filter((q) => q.level === settings.level);
    if (settings.category !== "all")
      filtered = filtered.filter((q) => q.category === settings.category);
    if (settings.topic !== "all")
      filtered = filtered.filter((q) => q.topic === settings.topic);
    const count = Math.min(settings.count, filtered.length);
    const chosen = settings.shuffle
      ? shuffle(filtered).slice(0, count)
      : filtered.slice(0, count);
    setPool(chosen);
    setIdx(0);
    setSelected(null);
    setConfirmed(false);
    setAnswers([]);
    setStreak(0);
    setElapsed(0);
    setScreen("quiz");
  }, [settings, allQuestions]);

  const handleSelect = (i: number) => {
    if (!confirmed) setSelected(i);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    const q = pool[idx];
    const correct = selected === q.answer;
    setConfirmed(true);
    setAnswers((prev) => [
      ...prev,
      { qid: q.id, correct, chosen: selected, answer: q.answer },
    ]);
    setStreak((prev) => (correct ? prev + 1 : 0));

    // Save result to API
    saveResult.mutate({
      quizzId: q.id,
      selectedAnswer: selected,
      isCorrect: correct,
    });
  };

  const handleNext = () => {
    if (idx + 1 >= pool.length) setScreen("result");
    else {
      setIdx((i) => i + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  if (isLoading) {
    return <QuizzSkeleton />;
  }

  if (screen === "home") {
    return (
      <QuizzHome
        settings={settings}
        setSettings={setSettings}
        categories={categories}
        topics={topics}
        questions={allQuestions}
        onStart={startQuiz}
        isLoading={false}
      />
    );
  }

  if (screen === "quiz" && pool[idx]) {
    return (
      <QuizzQuestion
        question={pool[idx]}
        idx={idx}
        total={pool.length}
        selected={selected}
        confirmed={confirmed}
        streak={streak}
        elapsed={elapsed}
        onSelect={handleSelect}
        onConfirm={handleConfirm}
        onNext={handleNext}
        onExit={() => setScreen("home")}
      />
    );
  }

  return (
    <QuizzResult
      pool={pool}
      answers={answers}
      elapsed={elapsed}
      onRetry={startQuiz}
      onHome={() => setScreen("home")}
    />
  );
}
