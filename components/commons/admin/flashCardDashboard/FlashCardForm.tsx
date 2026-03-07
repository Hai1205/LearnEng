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
        <Label htmlFor="form-vol" className="text-sm font-medium">
          Volcabulary
        </Label>
        <Input
          id="form-vol"
          type="text"
          value={data?.vol || ""}
          onChange={(e) => onChange("vol", e.target.value)}
          className="bg-background/50 border-border/50 focus:border-primary transition-colors"
          placeholder="Enter Volcabulary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="form-transcription" className="text-sm font-medium">
          Transcription
        </Label>
        <Input
          id="form-transcription"
          type="text"
          value={data?.transcription || ""}
          onChange={(e) => onChange("transcription", e.target.value)}
          className="bg-background/50 border-border/50 focus:border-primary transition-colors"
          placeholder="Enter Transcription"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="form-ex" className="text-sm font-medium">
          Example
        </Label>
        <Input
          id="form-ex"
          type="text"
          value={data?.ex || ""}
          onChange={(e) => onChange("ex", e.target.value)}
          className="bg-background/50 border-border/50 focus:border-primary transition-colors"
          placeholder="Enter Example"
        />
      </div>
    </div>
  );
};
