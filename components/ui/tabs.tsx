"use client";

import { Tabs as TabsPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "flex max-w-full [scrollbar-width:none] gap-1 overflow-x-auto border-b border-line",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "relative -mb-px h-11 shrink-0 border-b-2 border-transparent px-3 text-small font-medium whitespace-nowrap text-fg-muted",
        "transition-colors duration-small ease-standard hover:text-fg",
        "focus-visible:-outline-offset-2",
        "data-[state=active]:border-accent data-[state=active]:text-fg",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn("pt-6 data-[state=active]:animate-fade-up", className)}
      {...props}
    />
  );
}
