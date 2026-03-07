"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

interface QuizzFormProps {
  data: IQuizz | null;
  onChange: (field: keyof IQuizz, value: IQuizz[keyof IQuizz]) => void;
  showFooterButtons?: boolean;
}

export const QuizzForm = ({ data, onChange }: QuizzFormProps) => {
  const [opts, setOpts] = useState<string[]>([]);
  const [requirementInput, addOptsInput] = useState<string>("");

  useEffect(() => {
    setOpts(parseField(data?.opts));
  }, [data?.opts]);

  const parseField = (field: string | string[] | undefined): string[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed))
        return parsed.map((s) => String(s).trim()).filter(Boolean);
    } catch {
      /* fallback */
    }
    return field
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const addOpts = () => {
    const v = requirementInput.trim();
    if (!v || opts.length >= 4) return;
    const next = [...opts, v];
    setOpts(next);
    onChange("opts", next);
    addOptsInput("");
  };

  const removeOpts = (index: number) => {
    const next = opts.filter((_, i) => i !== index);
    setOpts(next);
    onChange("opts", next);
  };

  const handleReqKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addOpts();
    }
  };

  return (
    <div className="space-y-6 pr-2">
      <div className="space-y-2">
        <Label htmlFor="form-cat" className="text-sm font-medium">
          Category <span className="text-destructive">*</span>
        </Label>
        <Input
          id="form-cat"
          value={data?.cat || ""}
          onChange={(e) => onChange("cat", e.target.value)}
          className="bg-background/50 border-border/50 focus:border-primary transition-colors"
          placeholder="Enter cat"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="form-topic" className="text-sm font-medium">
          Topic <span className="text-destructive">*</span>
        </Label>
        <Input
          id="form-topic"
          type="topic"
          value={data?.topic || ""}
          onChange={(e) => onChange("topic", e.target.value)}
          className="bg-background/50 border-border/50 focus:border-primary transition-colors"
          placeholder="Enter topic"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="form-lvl" className="text-sm font-medium">
          Level
        </Label>
        <Input
          id="form-lvl"
          type="text"
          value={data?.lvl || ""}
          onChange={(e) => onChange("lvl", e.target.value)}
          className="bg-background/50 border-border/50 focus:border-primary transition-colors"
          placeholder="Enter Level"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="form-q" className="text-sm font-medium">
            Question
          </Label>
          <Input
            id="form-q"
            type="text"
            value={data?.q || ""}
            onChange={(e) => onChange("q", e.target.value)}
            className="bg-background/50 border-border/50 focus:border-primary transition-colors"
            placeholder="Enter Question"
          />
        </div>

        <div className="w-1/5 space-y-2">
          <Label htmlFor="form-ans" className="text-sm font-medium">
            Answer
          </Label>
          <Input
            id="form-ans"
            type="number"
            min={0}
            max={3}
            value={data?.ans ?? ""}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              if (e.target.value === "") onChange("ans", "");
              else if (!isNaN(v) && v >= 0 && v <= 3) onChange("ans", v);
            }}
            className="bg-background/50 border-border/50 focus:border-primary transition-colors"
            placeholder="0 - 3"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="form-opts" className="text-sm font-medium">
          Options
        </Label>
        <div className="flex gap-2">
          <Input
            id="form-opts"
            value={requirementInput}
            onChange={(e) => addOptsInput(e.target.value)}
            onKeyDown={handleReqKey}
            placeholder={
              opts.length >= 4
                ? "Đã đạt tối đa 4 lựa chọn"
                : "Nhập tùy chọn và nhấn Enter hoặc nhấn Thêm"
            }
            disabled={opts.length >= 4}
            className="h-10"
          />
          <Button
            onClick={addOpts}
            size="sm"
            disabled={opts.length >= 4}
            className="bg-primary text-primary-foreground shadow-md hover:shadow-lg transform hover:-translate-y-px transition-all"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {opts.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {opts.map((req, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="gap-2 px-3 py-1.5 text-sm"
              >
                {req}
                <button
                  onClick={() => removeOpts(index)}
                  className="ml-2 hover:text-destructive"
                  aria-label={`Remove requirement ${req}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm mt-2">
            Not addition yet.
          </div>
        )}
      </div>
    </div>
  );
};
