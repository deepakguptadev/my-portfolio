import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type WorkflowDiagramProps = {
  steps: string[];
  label: string;
  className?: string;
};

/**
 * Linear user workflow as an ordered list. Wraps on large screens; below
 * that it scrolls horizontally (with snap) rather than shrinking the text.
 */
export function WorkflowDiagram({ steps, label, className }: WorkflowDiagramProps) {
  return (
    <div className={cn("relative", className)}>
      <ol
        aria-label={label}
        tabIndex={0}
        className="-mx-1 flex snap-x [scrollbar-width:thin] items-center gap-1 overflow-x-auto px-1 pb-2 focus-visible:outline-offset-4 lg:flex-wrap lg:gap-y-2 lg:overflow-visible"
      >
        {steps.map((step, index) => (
          <li key={step} className="flex shrink-0 snap-start items-center gap-1">
            <span className="flex h-9 items-center gap-2 rounded-sm border border-line bg-surface px-3 text-small whitespace-nowrap text-fg">
              <span aria-hidden className="font-mono text-caption text-fg-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              {step}
            </span>
            {index < steps.length - 1 && (
              <ChevronRight aria-hidden className="size-4 shrink-0 text-fg-muted" />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
