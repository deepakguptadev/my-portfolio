"use client";

import { Check, ChevronDown } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { useFieldControl } from "./form-field";
import { controlClasses } from "./input";

type Option = { value: string; label: string };

type SelectProps = Omit<ComponentProps<typeof SelectPrimitive.Root>, "children"> & {
  options: Option[];
  placeholder?: string;
  className?: string;
  name?: string;
};

export function Select({ options, placeholder = "Select…", className, ...props }: SelectProps) {
  const field = useFieldControl();

  return (
    <SelectPrimitive.Root {...props}>
      <SelectPrimitive.Trigger
        {...field}
        className={cn(
          controlClasses,
          "flex h-11 items-center justify-between gap-2 text-left data-placeholder:text-fg-muted",
          className,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <ChevronDown aria-hidden className="size-4 text-fg-muted" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          className="z-dropdown max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) overflow-hidden rounded-md border border-line bg-surface shadow-md"
        >
          <SelectPrimitive.Viewport className="p-1">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="relative flex h-10 cursor-default items-center rounded-sm pr-3 pl-8 text-small text-fg outline-none select-none data-highlighted:bg-surface-2 data-[state=checked]:font-medium"
              >
                <SelectPrimitive.ItemIndicator className="absolute left-2.5 inline-flex">
                  <Check aria-hidden className="size-4 text-accent" />
                </SelectPrimitive.ItemIndicator>
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
