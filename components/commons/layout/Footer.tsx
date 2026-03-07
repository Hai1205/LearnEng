import { FileText } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm py-8 mt-auto">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              © 2026 LearnVolEng. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
