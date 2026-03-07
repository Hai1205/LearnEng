import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ReactNode } from "react";
import LayoutClient from "@/components/commons/layout/LayoutClient";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  variable: "--font-mono",
});

export const metadata = {
  title: "LearnVolEng - Master English Vocabulary with Flashcards and Quizzes",
  description: "Học từ vựng tiếng Anh hiệu quả với Flash Card và Quizz",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning className="overflow-hidden">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased overflow-hidden h-screen`}
      >
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
