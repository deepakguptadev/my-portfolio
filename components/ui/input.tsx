"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { useFieldControl } from "./form-field";

/** Shared control chrome for inputs, textareas and select triggers. */
export const controlClasses = cn(
  "w-full rounded-sm border border-line bg-surface px-3 text-body text-fg",
  "placeholder:text-fg-muted",
  "transition-[border-color,box-shadow] duration-micro ease-standard",
  "hover:border-line-strong",
  "focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent",
  "aria-invalid:border-error aria-invalid:focus-visible:outline-error",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

export function Input({ className, ...props }: ComponentProps<"input">) {
  const field = useFieldControl();
  return <input className={cn(controlClasses, "h-11", className)} {...field} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  const field = useFieldControl();
  return (
    <textarea
      className={cn(controlClasses, "min-h-36 resize-y py-2.5", className)}
      {...field}
      {...props}
    />
  );
}
