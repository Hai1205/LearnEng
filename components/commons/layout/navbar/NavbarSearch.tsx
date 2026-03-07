"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface NavbarSearchProps {
  placeholder?: string;
}

export const NavbarSearch = ({
  placeholder = "Searching ...",
}: NavbarSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery) {
        router.push(`/search?query=${encodeURIComponent(trimmedQuery)}`);
      }
    },
    [searchQuery, router],
  );

  return (
    <form onSubmit={handleSubmit} className="relative group hidden md:block">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary w-4 h-4 transition-colors z-10 pointer-events-none" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 h-9 w-60 border-border/50 bg-background/50 backdrop-blur-sm focus:border-primary/50 focus:ring-primary/20 transition-all"
      />
    </form>
  );
};
