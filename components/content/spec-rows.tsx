import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SpecRow = { label: string; value: ReactNode };

type SpecRowsProps = {
  rows: SpecRow[];
  /** Columns at ≥1024px; collapses to 2 (tablet) and 1 (mobile). */
  columns?: 1 | 2 | 3;
  className?: string;
};

const columnClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
} as const;

/**
 * Datasheet-style key/value grid. Cells are separated by hairlines drawn
 * with a 1px gap over a border-colored background.
 */
export function SpecRows({ rows, columns = 3, className }: SpecRowsProps) {
  return (
    <dl
      className={cn(
        "grid gap-px overflow-hidden rounded-md border border-line bg-line",
        columnClasses[columns],
        className,
      )}
    >
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-1.5 bg-surface px-6 py-5">
          <dt className="eyebrow text-fg-muted">{row.label}</dt>
          <dd className="text-body font-medium text-fg">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
