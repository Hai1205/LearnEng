"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/commons/layout/ThemeProvider";
import { QueryProvider } from "@/components/commons/layout/QueryProvider";
import { Slide, ToastContainer } from "react-toastify";
import { Navbar } from "@/components/commons/layout/navbar/Navbar";
import { Footer } from "@/components/commons/layout/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import "react-toastify/dist/ReactToastify.css";

interface ClientLayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutClient({ children }: ClientLayoutWrapperProps) {
  const pathname = usePathname();

  const hideSidebar =
    pathname.startsWith("/admin");

  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
          <Navbar />
          <ScrollArea className="h-[calc(100vh-64px)]">
            <main className="min-h-[calc(100vh-64px)] container mx-auto px-4">
              {children}
            </main>
            <Footer />
          </ScrollArea>

        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Slide}
        />
      </ThemeProvider>
    </QueryProvider>
  );
}
