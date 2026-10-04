"use client";

import { Check } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root> & { label: ReactNode };

export function Checkbox({ label, className, id, ...props }: CheckboxProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <CheckboxPrimitive.Root
        id={controlId}
        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-xs border border-line-strong bg-surface transition-colors duration-micro ease-standard hover:border-fg-muted disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-error data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-on-accent"
        {...props}
      >
        <CheckboxPrimitive.Indicator>
          <Check aria-hidden className="size-3.5" strokeWidth={2.5} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <label htmlFor={controlId} className="text-small text-fg-secondary">
        {label}
      </label>
    </div>
  );
}
