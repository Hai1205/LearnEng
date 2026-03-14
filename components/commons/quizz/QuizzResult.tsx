import { useState } from "react";

const LABELS = ["A", "B", "C", "D"];

const LEVEL_CONFIG: Record<string, { color: string; emoji: string }> = {
  Dễ: { color: "#10b981", emoji: "🟢" },
  "Trung bình": { color: "#f59e0b", emoji: "🟡" },
  Khó: { color: "#ef4444", emoji: "🔴" },
};

interface AnswerRecord {
  qid: string;
  correct: boolean;
  chosen: number;
  answer: number;
}

interface QuizzResultProps {
  pool: IQuizz[];
  answers: AnswerRecord[];
  elapsed: number;
  onRetry: () => void;
  onHome: () => void;
}

function fmtTime(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export default function QuizzResult({
  pool,
  answers,
  elapsed,
  onRetry,
  onHome,
}: QuizzResultProps) {
  const [showReview, setShowReview] = useState(false);

  const score = answers.filter((a) => a.correct).length;
  const pct = pool.length ? Math.round((score / pool.length) * 100) : 0;
  const grade =
    pct >= 90
      ? "S"
      : pct >= 80
        ? "A"
        : pct >= 70
          ? "B"
          : pct >= 60
            ? "C"
            : pct >= 40
              ? "D"
              : "F";
  const gradeColor = pct >= 80 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444";

  // Stats by level
  const byLevel: Record<string, { c: number; t: number }> = {
    Dễ: { c: 0, t: 0 },
    "Trung bình": { c: 0, t: 0 },
    Khó: { c: 0, t: 0 },
  };
  answers.forEach((a, i) => {
    const q = pool[i];
    if (byLevel[q.level]) {
      byLevel[q.level].t++;
      if (a.correct) byLevel[q.level].c++;
    }
  });

  // Stats by category
  const byCat: Record<string, { c: number; t: number }> = {};
  answers.forEach((a, i) => {
    const q = pool[i];
    if (!byCat[q.category]) byCat[q.category] = { c: 0, t: 0 };
    byCat[q.category].t++;
    if (a.correct) byCat[q.category].c++;
  });

  const wrongAnswers = answers.filter((a) => !a.correct);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0d1117] via-[#161b22] to-[#0d1117] font-serif p-5 flex flex-col items-center">
      <div className="w-full max-w-150">
        {/* Score card */}
        <div className="bg-white/4 backdrop-blur-xl border border-white/9 rounded-[22px] p-8 text-center mb-3.5">
          <div className="text-[52px] mb-2">
            {pct >= 80 ? "🏆" : pct >= 60 ? "🎯" : "📖"}
          </div>
          <div
            className="text-[68px] font-bold leading-none italic"
            style={{ color: gradeColor }}
          >
            {grade}
          </div>
          <div className="text-white/35 text-xs mb-3.5 tracking-widest uppercase">
            Xếp loại
          </div>
          <div className="text-[38px] font-bold text-white mb-1">
            {score}/{pool.length}
          </div>
          <div className="text-white/40 mb-4 text-sm">câu đúng • {pct}%</div>
          <div className="flex justify-center gap-6 text-white/40 text-xs tracking-wider">
            <span>⏱ {fmtTime(elapsed)}</span>
            <span>📝 {pool.length} câu</span>
          </div>
          <div className="mt-4 h-1.5 bg-white/8 rounded-sm overflow-hidden">
            <div
              className="h-full rounded-sm transition-[width] duration-1000 ease-out"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, #38bdf8, ${gradeColor})`,
              }}
            />
          </div>
        </div>

        {/* By Level */}
        <div className="bg-white/3 border border-white/7 rounded-2xl p-5 mb-3">
          <h3 className="text-white/35 m-0 mb-3.5 text-[11px] uppercase tracking-[2px]">
            Theo độ khó
          </h3>
          {(["Dễ", "Trung bình", "Khó"] as const).map((label) => {
            const d = byLevel[label];
            if (!d || d.t === 0) return null;
            const p = Math.round((d.c / d.t) * 100);
            const lv = LEVEL_CONFIG[label];
            return (
              <div key={label} className="mb-3">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[13px]" style={{ color: lv.color }}>
                    {lv.emoji} {label}
                  </span>
                  <span className="text-white/50 text-xs">
                    {d.c}/{d.t} ({p}%)
                  </span>
                </div>
                <div className="h-1.25 bg-white/7 rounded-sm overflow-hidden">
                  <div
                    className="h-full rounded-sm opacity-80"
                    style={{ width: `${p}%`, background: lv.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* By Category */}
        <div className="bg-white/3 border border-white/7 rounded-2xl p-5 mb-3.5">
          <h3 className="text-white/35 m-0 mb-3.5 text-[11px] uppercase tracking-[2px]">
            Theo động từ
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(byCat).map(([category, d]) => {
              const p = Math.round((d.c / d.t) * 100);
              const col = p >= 80 ? "#10b981" : p >= 60 ? "#f59e0b" : "#ef4444";
              return (
                <div
                  key={category}
                  className="bg-white/3 rounded-lg py-2 px-2.5"
                >
                  <div className="flex justify-between mb-1">
                    <span className="text-white/60 text-xs font-bold">
                      {category}
                    </span>
                    <span className="text-xs font-bold" style={{ color: col }}>
                      {p}%
                    </span>
                  </div>
                  <div className="h-0.75 bg-white/6 rounded-sm overflow-hidden">
                    <div
                      className="h-full rounded-sm"
                      style={{ width: `${p}%`, background: col }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review wrong answers toggle */}
        <button
          onClick={() => setShowReview((v) => !v)}
          className="w-full py-3 bg-white/4 border border-white/9 rounded-xl text-white/50 text-[13px] font-inherit mb-3 hover:bg-white/7 transition-colors"
        >
          {showReview ? "▲ Ẩn đáp án sai" : "▼ Xem lại các câu sai"}
        </button>

        {showReview && (
          <div className="mb-3.5">
            {wrongAnswers.length === 0 ? (
              <p className="text-center text-emerald-500 text-sm py-4">
                🎉 Tuyệt vời! Không có câu nào sai.
              </p>
            ) : (
              wrongAnswers.map((a, i) => {
                const q = pool.find((q) => q.id === a.qid);
                if (!q) return null;
                return (
                  <div
                    key={i}
                    className="bg-red-500/6 border border-red-500/20 rounded-xl p-3.5 mb-2"
                  >
                    <p className="text-white/75 m-0 mb-2 text-[13px] leading-relaxed">
                      <span className="text-red-500/80 font-bold">
                        #{q.id.slice(-6)} [{q.category}]
                      </span>{" "}
                      {q.question}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="bg-red-500/15 text-red-500 py-0.5 px-2 rounded-md text-[11px]">
                        Bạn: {LABELS[a.chosen]} – {q.options[a.chosen]}
                      </span>
                      <span className="bg-emerald-500/15 text-emerald-500 py-0.5 px-2 rounded-md text-[11px]">
                        Đúng: {LABELS[a.answer]} – {q.options[a.answer]}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 py-3.5 rounded-xl border-none bg-linear-to-br from-sky-400 to-indigo-400 text-white text-sm font-bold"
          >
            🔄 Làm lại
          </button>
          <button
            onClick={onHome}
            className="flex-1 py-3.5 rounded-xl border border-white/10 bg-transparent text-white/50 text-sm font-inherit hover:bg-white/5 transition-colors"
          >
            🏠 Làm chủ đề khác
          </button>
        </div>
      </div>
    </div>
  );
}
