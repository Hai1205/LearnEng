"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { NavbarLogo } from "./NavbarLogo";
import { NavbarLinks } from "./NavbarLinks";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => setIsHydrated(true), []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/flash-card", label: "Flash Card" },
    { href: "/quizz", label: "Quizz" },
    { href: "/admin", label: "Admin Dashboard" },
  ];

  if (!isHydrated)
    return (
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <NavbarLogo />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </nav>
    );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <NavbarLogo />
          <NavbarLinks pathname={pathname} links={navLinks} />
        </div>
      </div>
    </nav>
  );
}
