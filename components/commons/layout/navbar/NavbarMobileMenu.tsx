import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavbarMobileMenuProps {
  pathname: string;
  links: { href: string; label: string; onClick?: () => void }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NavbarMobileMenu = ({
  pathname,
  links,
  open,
  onOpenChange,
}: NavbarMobileMenuProps) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetTrigger asChild className="md:hidden">
      <Button variant="ghost" size="icon" className="hover:bg-primary/10">
        <Menu className="h-5 w-5" />
      </Button>
    </SheetTrigger>

    <SheetContent className="w-75 sm:w-100 bg-linear-to-br from-card to-card/80 backdrop-blur-xl border-border/50">
      <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

      <div className="flex items-center gap-2 mb-8 pb-6 border-b border-border/50">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary shadow-lg">
          <FileText className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold bg-linear-to-br from-primary to-secondary bg-clip-text text-transparent">
          LearnEng
        </span>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        {links.map((link) => (
          <Link
            key={`${link.href}-${link.label}`}
            href={link.href}
            onClick={(e) => {
              if (link.onClick) {
                e.preventDefault();
                link.onClick();
              }
              onOpenChange(false);
            }}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
              pathname === link.href
                ? "bg-linear-to-br from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
            )}
          >
            {pathname === link.href && (
              <div className="h-2 w-2 rounded-full bg-primary-foreground animate-pulse" />
            )}
            {link.label}
          </Link>
        ))}
      </div>
    </SheetContent>
  </Sheet>
);
