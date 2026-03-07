"use client";

import { cn } from "@/lib/utils";
import { AudioLines, Volume2 } from "lucide-react";
import { useState, useCallback } from "react";

interface SpeakButtonProps {
  word: string;
}

export const SpeakButton = ({ word }: SpeakButtonProps) => {
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = useCallback(() => {
    if (speaking) return;
    setSpeaking(true);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(word);
      u.lang = "en-US";
      u.rate = 0.85;
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    }
    setTimeout(() => setSpeaking(false), 3000);
  }, [word, speaking]);

  return (
    <button
      onClick={handleSpeak}
      className={cn(
        "p-1.5 rounded-md transition-colors",
        speaking
          ? "text-primary bg-primary/10"
          : "text-muted-foreground hover:text-foreground hover:bg-muted",
      )}
    >
      {speaking ? (
        <AudioLines className="h-4 w-4 animate-pulse" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </button>
  );
};
