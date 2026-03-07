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
  const [options, setOpts] = useState<string[]>([]);
  const [requirementInput, addOptsInput] = useState<string>("");

  useEffect(() => {
    setOpts(parseField(data?.options));
  }, [data?.options]);

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
    if (!v || options.length >= 4) return;
    const next = [...options, v];
    setOpts(next);
    onChange("options", next);
    addOptsInput("");
  };

  const removeOpts = (index: number) => {
    const next = options.filter((_, i) => i !== index);
    setOpts(next);
    onChange("options", next);
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
        <Label htmlFor="form-category" className="text-sm font-medium">
          Category <span className="text-destructive">*</span>
        </Label>
        <Input
          id="form-category"
          value={data?.category || ""}
          onChange={(e) => onChange("category", e.target.value)}
          className="bg-background/50 border-border/50 focus:border-primary transition-colors"
          placeholder="Enter category"
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
        <Label htmlFor="form-level" className="text-sm font-medium">
          Level
        </Label>
        <Input
          id="form-level"
          type="text"
          value={data?.level || ""}
          onChange={(e) => onChange("level", e.target.value)}
          className="bg-background/50 border-border/50 focus:border-primary transition-colors"
          placeholder="Enter Level"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="form-question" className="text-sm font-medium">
            Question
          </Label>
          <Input
            id="form-question"
            type="text"
            value={data?.question || ""}
            onChange={(e) => onChange("question", e.target.value)}
            className="bg-background/50 border-border/50 focus:border-primary transition-colors"
            placeholder="Enter Question"
          />
        </div>

        <div className="w-1/5 space-y-2">
          <Label htmlFor="form-answer" className="text-sm font-medium">
            Answer
          </Label>
          <Input
            id="form-answer"
            type="number"
            min={0}
            max={3}
            value={data?.answer ?? ""}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              if (e.target.value === "") onChange("answer", "");
              else if (!isNaN(v) && v >= 0 && v <= 3) onChange("answer", v);
            }}
            className="bg-background/50 border-border/50 focus:border-primary transition-colors"
            placeholder="0 - 3"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="form-options" className="text-sm font-medium">
          Options
        </Label>
        <div className="flex gap-2">
          <Input
            id="form-options"
            value={requirementInput}
            onChange={(e) => addOptsInput(e.target.value)}
            onKeyDown={handleReqKey}
            placeholder={
              options.length >= 4
                ? "Đã đạt tối đa 4 lựa chọn"
                : "Nhập tùy chọn và nhấn Enter hoặc nhấn Thêm"
            }
            disabled={options.length >= 4}
            className="h-10"
          />
          <Button
            onClick={addOpts}
            size="sm"
            disabled={options.length >= 4}
            className="bg-primary text-primary-foreground shadow-md hover:shadow-lg transform hover:-translate-y-px transition-all"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {options.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {options.map((req, index) => (
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
