"use client";

import { BookOpen, Brain, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

export const FeaturesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => setIsVisible(true), []);

  const features = [
    {
      icon: BookOpen,
      title: "Flash Card thông minh",
      description:
        "Học từ vựng bằng thẻ lật trực quan với phiên âm, ví dụ và phát âm tự động. Theo dõi tiến độ từng từ một.",
      color: "primary",
      delay: "100ms",
    },
    {
      icon: Brain,
      title: "Quizz luyện tập",
      description:
        "Kiểm tra kiến thức với câu hỏi trắc nghiệm đa dạng. Lọc theo chủ đề, độ khó và xáo trộn câu hỏi để luyện tập hiệu quả.",
      color: "secondary",
      delay: "200ms",
    },
    {
      icon: BarChart3,
      title: "Theo dõi tiến độ",
      description:
        "Xem thống kê số từ đã thuộc, điểm quizz và tiến trình học tập. Import dữ liệu từ Excel để mở rộng kho từ vựng.",
      color: "accent",
      delay: "300ms",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      <div className="grid gap-8 md:grid-cols-3">
        {features.map(({ icon: Icon, title, description, color, delay }, i) => (
          <div
            key={i}
            className={`group flex flex-col gap-4 rounded-lg border border-border bg-card p-6 transition-all duration-500 hover:shadow-xl hover:scale-105 hover:-translate-y-2 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: delay }}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg bg-${color}/10 transition-all duration-300 group-hover:bg-${color}/20 group-hover:rotate-6 group-hover:scale-110`}
            >
              <Icon className={`h-6 w-6 text-${color}`} />
            </div>
            <h3
              className={`text-xl font-semibold transition-colors duration-300 group-hover:text-${color}`}
            >
              {title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
