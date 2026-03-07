"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FlashCardItemProps {
  card: IFlashCard | null;
  isLearned: boolean;
  flipped: boolean;
  fade: boolean;
  onFlip: () => void;
  mode: "all" | "unlearned";
}

function speak(text: string, audioUrl?: string) {
  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play().catch(() => {
      fallbackSpeak(text);
    });
    return;
  }
  fallbackSpeak(text);
}

function fallbackSpeak(text: string) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  }
}

export default function FlashCardItem({
  card,
  isLearned,
  flipped,
  fade,
  onFlip,
  mode,
}: FlashCardItemProps) {
  const [speaking, setSpeaking] = useState(false);

  if (!card) return null;

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSpeaking(true);
    speak(card.vol, card.audioUrl || undefined);
    setTimeout(() => setSpeaking(false), 1400);
  };

  return (
    <div className="perspective-distant w-full h-65">
      <div
        onClick={onFlip}
        className={cn(
          "w-full h-65 transform-3d transition-transform duration-500 ease-[cubic-bezier(.23,1,.32,1)] cursor-pointer",
          flipped && "transform-[rotateY(180deg)]",
          fade && "animate-[fadeOut_0.16s_ease_forwards]",
        )}
      >
        {/* FRONT */}
        <div className="absolute inset-0 backface-hidden rounded-2xl flex flex-col items-center justify-center px-6 py-7 bg-linear-to-br from-[#1c2333] to-[#161b27] border border-indigo-400/18 shadow-[0_24px_48px_rgba(0,0,0,0.55)]">
          {mode === "unlearned" && (
            <div className="absolute top-3.5 left-4 font-mono text-[9px] text-white/22 tracking-wider uppercase">
              {card.topic}
            </div>
          )}

          <div
            className={cn(
              "absolute top-3.5 right-4 w-1.75 h-1.75 rounded-full transition-all duration-300",
              isLearned
                ? "bg-green-400 shadow-[0_0_7px_rgba(74,222,128,0.45)]"
                : "bg-white/9",
            )}
          />

          <div
            className={cn(
              "font-serif font-semibold text-slate-100 text-center mb-1.5 leading-tight",
              card.vol.length > 16 ? "text-2xl" : "text-[32px]",
            )}
          >
            {card.vol}
          </div>

          <div className="font-mono text-xs text-indigo-400 mb-2.5 tracking-wide">
            {card.transcription}
          </div>

          <div className="font-sans text-[15px] font-light text-white/58">
            {card.topic}
          </div>

          <button
            onClick={handleSpeak}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-sans text-xs mt-3.5 transition-all border",
              speaking
                ? "bg-indigo-400/18 border-indigo-400/35 text-indigo-300"
                : "bg-white/5 border-white/9 text-white/55 hover:bg-white/10 hover:text-white",
            )}
          >
            <span>{speaking ? "🔊" : "🔉"}</span>
            {speaking ? "Đang phát..." : "Phát âm"}
          </button>

          <div className="absolute bottom-3 font-sans text-[10px] text-white/16 tracking-wide">
            Nhấn để xem ví dụ ↓
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 backface-hidden transform-[rotateY(180deg)] rounded-2xl flex flex-col items-center justify-center px-6 py-7 bg-linear-to-br from-[#1a1f35] to-[#131824] border border-purple-500/22 shadow-[0_24px_48px_rgba(0,0,0,0.55)]">
          <div className="font-mono text-[9px] text-purple-400/55 tracking-widest uppercase mb-4">
            Ví dụ
          </div>

          <div className="font-serif italic text-lg font-normal text-slate-200 text-center leading-relaxed max-w-82.5">
            &ldquo;{card.ex}&rdquo;
          </div>

          <div className="mt-4 font-sans text-[13px] text-white/32">
            <span className="text-purple-400 font-medium">{card.vol}</span> ·{" "}
            {card.topic}
          </div>

          <div className="absolute bottom-3 font-sans text-[10px] text-white/16 tracking-wide">
            Nhấn để quay lại ↑
          </div>
        </div>
      </div>
    </div>
  );
}
