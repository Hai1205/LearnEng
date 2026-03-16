"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookOpen, Brain, LayoutDashboard } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutClientProps {
  children: ReactNode;
}

export default function AdminLayoutClient({
  children,
}: AdminLayoutClientProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [mounted, setMounted] = useState(false);
  const isResizing = useRef(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    {
      icon: Brain,
      label: "Flash Card Dashboard",
      href: "/admin/flash-card-dashboard",
    },
    {
      icon: BookOpen,
      label: "Quizz Dashboard",
      href: "/admin/quizz-dashboard",
    },
  ];

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedCollapsed = localStorage.getItem("adminSidebarCollapsed");
    const savedWidth = localStorage.getItem("adminSidebarWidth");

    if (savedCollapsed !== null) {
      setSidebarCollapsed(JSON.parse(savedCollapsed));
    }

    if (savedWidth !== null) {
      setSidebarWidth(Math.max(80, Math.min(400, parseInt(savedWidth))));
    }
  }, []);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(
      "adminSidebarCollapsed",
      JSON.stringify(sidebarCollapsed),
    );
  }, [sidebarCollapsed]);

  useEffect(() => {
    if (sidebarWidth) {
      localStorage.setItem("adminSidebarWidth", sidebarWidth.toString());
    }
  }, [sidebarWidth]);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
  };

  const stopResizing = () => {
    isResizing.current = false;
  };

  const resize = (e: MouseEvent) => {
    if (isResizing.current) {
      const newWidth = Math.max(80, Math.min(320, e.clientX));
      setSidebarWidth(newWidth);
      setSidebarCollapsed(newWidth < 120);
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, []);

  return (
    <div className="bg-card min-h-screen">
      <div className="hidden md:flex relative">
        {mounted && (
          <div className="sticky top-0 h-screen">
            <AdminSidebar
              collapsed={sidebarCollapsed}
              width={sidebarWidth}
              onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              onStartResizing={startResizing}
            />
          </div>
        )}
        <div
          className="flex-1 transition-all duration-300"
          style={{
            marginLeft: mounted ? "8px" : "0px",
          }}
        >
          <main className="p-4 md:p-6 bg-card">{children}</main>
        </div>
      </div>

      <main className="md:hidden p-3 pb-24 bg-card">{children}</main>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border/50 bg-card/95 backdrop-blur">
        <ul className="grid grid-cols-3 gap-1 p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg px-2 py-2 text-[11px] font-medium transition-all",
                    isActive
                      ? "bg-linear-to-br from-primary to-secondary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
                  )}
                >
                  <Icon className="mb-1 h-4 w-4" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
