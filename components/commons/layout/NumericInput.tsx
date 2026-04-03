"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface NumericInputProps extends Omit<
  React.ComponentProps<typeof Input>,
  "type" | "value" | "onChange" | "min" | "max"
> {
  value?: number;
  min: number;
  max: number;
  onValueChange: (next: number) => void;
  emptyValue?: number;
  hideZero?: boolean;
  emitOnEmpty?: boolean;
  clampValue?: boolean;
  integerOnly?: boolean;
}

const toDisplayValue = (value: number | undefined, hideZero: boolean) => {
  if (value === undefined) return "";
  if (hideZero && value === 0) return "";
  return String(value);
};

export const NumericInput = ({
  value,
  min,
  max,
  onValueChange,
  emptyValue,
  hideZero = false,
  emitOnEmpty = true,
  clampValue = true,
  integerOnly = true,
  ...props
}: NumericInputProps) => {
  const [displayValue, setDisplayValue] = useState<string>(
    toDisplayValue(value, hideZero),
  );

  useEffect(() => {
    setDisplayValue(toDisplayValue(value, hideZero));
  }, [value, hideZero]);

  return (
    <Input
      type="number"
      min={min}
      max={max}
      value={displayValue}
      onChange={(e) => {
        const rawValue = e.target.value;

        if (rawValue === "") {
          setDisplayValue("");
          if (emitOnEmpty && emptyValue !== undefined) {
            onValueChange(emptyValue);
          }
          return;
        }

        const parsedValue = Number(rawValue);
        if (Number.isNaN(parsedValue)) {
          return;
        }

        let nextValue = integerOnly ? Math.trunc(parsedValue) : parsedValue;
        if (clampValue) {
          nextValue = Math.max(min, Math.min(max, nextValue));
        }

        setDisplayValue(String(nextValue));
        onValueChange(nextValue);
      }}
      onBlur={() => {
        if (displayValue === "" && emptyValue !== undefined) {
          onValueChange(emptyValue);
          setDisplayValue(toDisplayValue(emptyValue, hideZero));
        }
      }}
      {...props}
    />
  );
}