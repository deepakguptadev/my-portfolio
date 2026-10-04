"use client";

import { ChevronDown } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TimelineEntry = {
  id: string;
  period: string;
  title: string;
  company: ReactNode;
  current: boolean;
  content: ReactNode;
};

/** Expandable career timeline. Opens the entry named in the URL hash. */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const [open, setOpen] = useState<string[]>([]);

  useEffect(() => {
    function syncHash() {
      const id = window.location.hash.slice(1);
      if (entries.some((entry) => entry.id === id)) {
        setOpen((current) => (current.includes(id) ? current : [...current, id]));
      }
    }
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [entries]);

  const allOpen = open.length === entries.length;

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(allOpen ? [] : entries.map((entry) => entry.id))}
        >
          {allOpen ? "Collapse all" : "Expand all"}
        </Button>
      </div>
      <AccordionPrimitive.Root type="multiple" value={open} onValueChange={setOpen} asChild>
        <ol className="relative">
          {entries.map((entry, index) => (
            <AccordionPrimitive.Item key={entry.id} value={entry.id} asChild>
              <li id={entry.id} className="relative scroll-mt-24 pb-6 pl-8 last:pb-0 md:pl-12">
                {/* Rail */}
                {index < entries.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute top-3 bottom-0 left-[5px] w-px bg-line md:left-[9px]"
                  />
                )}
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-1.5 left-0 size-3 rounded-full md:left-1",
                    entry.current
                      ? "bg-accent ring-4 ring-accent-soft"
                      : "border-2 border-line-strong bg-canvas",
                  )}
                />
                <p className="font-mono text-caption text-fg-muted">{entry.period}</p>
                <div className="mt-2 rounded-lg border border-line bg-surface">
                  <AccordionPrimitive.Header asChild>
                    <h2>
                      <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-4 p-5 text-left md:p-6">
                        <span>
                          <span className="block text-h4 text-fg group-hover:text-accent">
                            {entry.title}
                          </span>
                          <span className="mt-1 block text-small text-fg-secondary">
                            {entry.company}
                          </span>
                        </span>
                        <ChevronDown
                          aria-hidden
                          className="size-5 shrink-0 text-fg-muted transition-transform duration-medium group-data-[state=open]:rotate-180"
                        />
                      </AccordionPrimitive.Trigger>
                    </h2>
                  </AccordionPrimitive.Header>
                  <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
                    <div className="border-t border-line p-5 md:p-6">{entry.content}</div>
                  </AccordionPrimitive.Content>
                </div>
              </li>
            </AccordionPrimitive.Item>
          ))}
        </ol>
      </AccordionPrimitive.Root>
    </div>
  );
}
