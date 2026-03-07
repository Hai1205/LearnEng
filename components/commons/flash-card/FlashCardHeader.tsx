interface FlashCardHeaderProps {
  totalWords: number;
}

export default function FlashCardHeader({ totalWords }: FlashCardHeaderProps) {
  return (
    <div className="text-center mb-6">
      <h1 className="font-serif text-[28px] font-semibold text-slate-200 tracking-tight mb-1">
        Vocabulary Cards
      </h1>
      <p className="font-mono text-[10px] text-white/28 tracking-widest uppercase">
        TOEIC BUSINESS ENGLISH · {totalWords} TỪ
      </p>
    </div>
  );
}
