import { Noto_Sans, Noto_Serif } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ReactNode } from "react";
import LayoutClient from "@/components/commons/layout/LayoutClient";

const notoSans = Noto_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSerif = Noto_Serif({
  subsets: ["latin", "vietnamese"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "LearnEng - Master English Vocabulary with Flashcards and Quizzes",
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
        className={`${notoSans.variable} ${notoSerif.variable} font-sans antialiased overflow-hidden h-screen`}
      >
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
