"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumericInput } from "@/components/commons/layout/NumericInput";

interface TestResultFormProps {
  data: ITestResult | null;
  onChange: (
    field: keyof ITestResult,
    value: ITestResult[keyof ITestResult],
  ) => void;
  showFooterButtons?: boolean;
}

export const TestResultForm = ({ data, onChange }: TestResultFormProps) => {
  const PART_MAX: Record<string, number> = {
    part1: 6,
    part2: 25,
    part3: 39,
    part4: 30,
    part5: 30,
    part6: 16,
    part7: 54,
  };

  type PartKey =
    | "part1"
    | "part2"
    | "part3"
    | "part4"
    | "part5"
    | "part6"
    | "part7";

  const partConfigs: { key: PartKey; label: string; max: number }[] = [
    { key: "part1", label: "Part 1", max: PART_MAX.part1 },
    { key: "part2", label: "Part 2", max: PART_MAX.part2 },
    { key: "part3", label: "Part 3", max: PART_MAX.part3 },
    { key: "part4", label: "Part 4", max: PART_MAX.part4 },
    { key: "part5", label: "Part 5", max: PART_MAX.part5 },
    { key: "part6", label: "Part 6", max: PART_MAX.part6 },
    { key: "part7", label: "Part 7", max: PART_MAX.part7 },
  ];

  return (
    <div className="space-y-6 pr-2">
      <div className="space-y-2">
        <Label htmlFor="form-category" className="text-sm font-medium">
          Category <span className="text-destructive">*</span>
        </Label>
        <Input
          id="form-category"
          type="text"
          value={data?.category || ""}
          onChange={(e) => onChange("category", e.target.value)}
          className="bg-background/50 border-border/50 focus:border-primary transition-colors"
          placeholder="Enter Category"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="form-title" className="text-sm font-medium">
          Title
        </Label>
        <Input
          id="form-title"
          type="text"
          value={data?.title || ""}
          onChange={(e) => onChange("title", e.target.value)}
          className="bg-background/50 border-border/50 focus:border-primary transition-colors"
          placeholder="Enter Title"
        />
      </div>

      <Label htmlFor="form-title" className="text-sm font-medium">
        Listening
      </Label>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {partConfigs.slice(0, 4).map((p) => (
          <div key={p.key} className="space-y-2">
            <Label htmlFor={`form-${p.key}`} className="text-sm font-medium">
              {p.label}
            </Label>
            <NumericInput
              id={`form-${p.key}`}
              min={0}
              max={p.max}
              value={data?.[p.key] ?? 0}
              onValueChange={(nextValue) => onChange(p.key, nextValue)}
              emptyValue={0}
              hideZero={true}
              className="w-full bg-background/50 border-border/50 focus:border-primary transition-colors"
              placeholder={`0 - ${p.max}`}
            />
          </div>
        ))}
      </div>

      <Label htmlFor="form-title" className="text-sm font-medium mt-4">
        Reading
      </Label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {partConfigs.slice(4).map((p) => (
          <div key={p.key} className="space-y-2">
            <Label htmlFor={`form-${p.key}`} className="text-sm font-medium">
              {p.label}
            </Label>
            <NumericInput
              id={`form-${p.key}`}
              min={0}
              max={p.max}
              value={data?.[p.key] ?? 0}
              onValueChange={(nextValue) => onChange(p.key, nextValue)}
              emptyValue={0}
              hideZero={true}
              className="w-full bg-background/50 border-border/50 focus:border-primary transition-colors"
              placeholder={`0 - ${p.max}`}
            />
          </div>
        ))}
      </div>

      <div className="space-y-2 md:col-span-4">
        <Label className="text-sm font-medium">Score</Label>
        <NumericInput
          id="form-score"
          min={0}
          max={990}
          value={data?.score ?? 0}
          onValueChange={(nextValue) => onChange("score", nextValue)}
          emptyValue={0}
          hideZero={true}
          className="bg-background/50 border-border/50 focus:border-primary transition-colors"
          placeholder="0 - 990"
        />
      </div>
    </div>
  );
};
