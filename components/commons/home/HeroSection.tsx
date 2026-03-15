"use client";

import Link from "next/link";
import { BookOpen, Brain } from "lucide-react";
import Typewriter from "typewriter-effect";

export const HeroSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-8 py-24 md:py-32">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-balance">
          Học Tiếng Anh Với
          <Typewriter
            options={{
              strings: [
                "Flash Card",
                "Quizz",
                "Từ Vựng TOEIC",
                "Phương Pháp Thông Minh",
              ],
              autoStart: true,
              loop: true,
              deleteSpeed: 50,
              wrapperClassName:
                "bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent",
            }}
          />
        </h1>
        <p className="max-w-175 text-lg text-muted-foreground text-balance md:text-xl leading-relaxed">
          Nền tảng học từ vựng tiếng Anh hiệu quả với thẻ lật và câu hỏi trắc
          nghiệm. Theo dõi tiến độ và chinh phục từng từ mỗi ngày.
        </p>
      </div>

      <div className="flex flex-col gap-5 sm:flex-row">
        <Link href="/flash-card">
          <div className="group relative w-64 h-36 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary/60 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(56,189,248,0.15)] cursor-pointer flex flex-col items-center justify-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/15 group-hover:bg-primary/25 transition-colors duration-300">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
              Flash Card
            </span>
            <span className="text-xs text-muted-foreground">
              Học từ vựng qua thẻ lật
            </span>
          </div>
        </Link>

        <Link href="/quizz">
          <div className="group relative w-64 h-36 rounded-2xl bg-linear-to-br from-secondary/20 to-secondary/5 border border-secondary/30 hover:border-secondary/60 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(129,140,248,0.15)] cursor-pointer flex flex-col items-center justify-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/15 group-hover:bg-secondary/25 transition-colors duration-300">
              <BookOpen className="w-6 h-6 text-secondary" />
            </div>
            <span className="text-lg font-semibold text-foreground group-hover:text-secondary transition-colors duration-300">
              Quizz
            </span>
            <span className="text-xs text-muted-foreground">
              Luyện tập trắc nghiệm
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
};
