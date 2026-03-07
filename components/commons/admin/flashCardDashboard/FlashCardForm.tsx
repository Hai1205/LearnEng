"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FlashCardFormProps {
  data: IFlashCard | null;
  onChange: (
    field: keyof IFlashCard,
    value: IFlashCard[keyof IFlashCard],
  ) => void;
  showFooterButtons?: boolean;
}

export const FlashCardForm = ({ data, onChange }: FlashCardFormProps) => {
  return (
    <div className="space-y-6 pr-2">
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
          placeholder="example@vietau.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="form-word" className="text-sm font-medium">
          Word
        </Label>
        <Input
          id="form-word"
          type="text"
          value={data?.word || ""}
          onChange={(e) => onChange("word", e.target.value)}
          className="bg-background/50 border-border/50 focus:border-primary transition-colors"
          placeholder="Enter Word"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="form-meaning" className="text-sm font-medium">
          Meaning
        </Label>
        <Input
          id="form-meaning"
          type="text"
          value={data?.meaning || ""}
          onChange={(e) => onChange("meaning", e.target.value)}
          className="bg-background/50 border-border/50 focus:border-primary transition-colors"
          placeholder="Enter Meaning"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="form-ipa" className="text-sm font-medium">
          IPA
        </Label>
        <Input
          id="form-ipa"
          type="text"
          value={data?.ipa || ""}
          onChange={(e) => onChange("ipa", e.target.value)}
          className="bg-background/50 border-border/50 focus:border-primary transition-colors"
          placeholder="Enter ipa"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="form-example" className="text-sm font-medium">
          Example
        </Label>
        <Input
          id="form-example"
          type="text"
          value={data?.example || ""}
          onChange={(e) => onChange("example", e.target.value)}
          className="bg-background/50 border-border/50 focus:border-primary transition-colors"
          placeholder="Enter Example"
        />
      </div>
    </div>
  );
};
