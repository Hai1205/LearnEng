"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EFixProblemAnswer, EFixProblemErrorType } from "@/types/enum";
import { ScrollArea } from "@/components/ui/scroll-area";

export const fixProblemAnswer = Object.values(EFixProblemAnswer).map(
  (value) => ({
    value,
    label: value,
  }),
);
export const fixProblemErrorType = Object.values(EFixProblemErrorType).map(
  (value) => ({
    value,
    label: value,
  }),
);

interface FixProblemFormProps {
  data: IFixProblem | null;
  onChange?: (
    field: keyof IFixProblem,
    value: IFixProblem[keyof IFixProblem],
  ) => void;
  showFooterButtons?: boolean;
}

export const FixProblemForm = ({ data, onChange }: FixProblemFormProps) => {
  return (
    <div className="space-y-6 pr-2">
      <div className="flex gap-4">
        <div className="flex-3 space-y-2">
          <Label htmlFor="form-category" className="text-sm font-medium">
            Category <span className="text-destructive">*</span>
          </Label>
          <Input
            id="form-category"
            value={data?.category || ""}
            onChange={(e) => onChange?.("category", e.target.value)}
            readOnly={!onChange}
            className="bg-background/50 border-border/50 focus:border-primary transition-colors"
            placeholder="Enter category"
            required
          />
        </div>

        <div className="flex-1 space-y-2">
          <Label htmlFor="form-error-type" className="text-sm font-medium">
            Error type
          </Label>
          <Select
            value={data?.errorType || fixProblemErrorType[0].value}
            onValueChange={(value) =>
              onChange?.("errorType", value as EFixProblemErrorType)
            }
            disabled={!onChange}
          >
            <SelectTrigger
              id="form-error-type"
              className="bg-background/50 border-border/50"
            >
              <SelectValue placeholder="Select error-type" />
            </SelectTrigger>
            <SelectContent>
              {fixProblemErrorType.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-3 space-y-2">
          <Label htmlFor="form-question" className="text-sm font-medium">
            Question
          </Label>
          <Input
            id="form-question"
            type="text"
            value={data?.question || ""}
            onChange={(e) => onChange?.("question", e.target.value)}
            readOnly={!onChange}
            className="bg-background/50 border-border/50 focus:border-primary transition-colors"
            placeholder="Enter Question"
          />
        </div>

        <div className="flex-1 space-y-2">
          <Label htmlFor="form-answer" className="text-sm font-medium">
            Answer
          </Label>
          <Select
            value={data?.answer || fixProblemAnswer[0].value}
            onValueChange={(value) =>
              onChange?.("answer", value as EFixProblemAnswer)
            }
            disabled={!onChange}
          >
            <SelectTrigger
              id="form-answer"
              className="bg-background/50 border-border/50"
            >
              <SelectValue placeholder="Select answer" />
            </SelectTrigger>
            <SelectContent>
              {fixProblemAnswer.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="form-reason" className="text-sm font-medium">
          Reason
        </Label>
        <Input
          id="form-reason"
          type="reason"
          value={data?.reason || ""}
          onChange={(e) => onChange?.("reason", e.target.value)}
          readOnly={!onChange}
          className="bg-background/50 border-border/50 focus:border-primary transition-colors"
          placeholder="Enter reason"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="form-note" className="text-sm font-medium">
            Note
          </Label>
          <span className="text-xs text-muted-foreground">
            {data?.note?.length || 0}/2000
          </span>
        </div>
        <ScrollArea className="h-30 w-full rounded-md border border-border/50 bg-background/50">
          <textarea
            id="form-note"
            value={data?.note || ""}
            onChange={(e) => {
              const value = e.target.value;
              const truncatedValue =
                value.length > 2000 ? value.slice(0, 2000) : value;
              onChange?.("note", truncatedValue);
            }}
            readOnly={!onChange}
            className="w-full min-h-30 px-3 py-2 text-sm bg-transparent focus:outline-none transition-colors resize-none border-0 overflow-hidden"
            placeholder="Enter note (max 2000 char)"
            style={{ height: "auto" }}
            onInput={(e) => {
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height =
                e.currentTarget.scrollHeight + "px";
            }}
          />
        </ScrollArea>
      </div>
    </div>
  );
};
