"use client";

import { usePathname } from "next/navigation";
import { NavbarLogo } from "./NavbarLogo";
import { NavbarLinks } from "./NavbarLinks";
import { NavbarMobileMenu } from "./NavbarMobileMenu";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/flash-card", label: "Flash Card" },
    { href: "/quizz", label: "Quizz" },
    { href: "/history", label: "History" },
    { href: "/admin", label: "Admin Dashboard" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <NavbarLogo />
          <NavbarLinks pathname={pathname} links={navLinks} />
        </div>

        <NavbarMobileMenu
            pathname={pathname}
            links={navLinks}
            open={mobileMenuOpen}
            onOpenChange={setMobileMenuOpen}
          />
      </div>
    </nav>
  );
}
