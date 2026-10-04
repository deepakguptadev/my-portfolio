"use client";

import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { useFieldControl } from "./form-field";
import { controlClasses } from "./input";

type Option = { value: string; label: string };

type SelectProps = Omit<ComponentProps<"select">, "children"> & {
  options: readonly Option[];
  placeholder?: string;
};

/**
 * Styled native <select>: native keyboard and screen-reader behavior, the
 * platform picker on phones, and it works with form libraries' register().
 */
export function Select({ options, placeholder = "Select…", className, ...props }: SelectProps) {
  const field = useFieldControl();
  const uncontrolled = props.value === undefined && props.defaultValue === undefined;

  return (
    <div className="relative">
      <select
        {...field}
        {...props}
        defaultValue={uncontrolled ? "" : props.defaultValue}
        className={cn(
          controlClasses,
          "h-11 cursor-pointer appearance-none pr-10",
          // Placeholder styling while nothing is chosen.
          "has-[option[value='']:checked]:text-fg-muted",
          className,
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-fg-muted"
      />
    </div>
  );
}
