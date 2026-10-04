import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ModuleHeaderProps = {
  /** Two-digit module index, e.g. "02". */
  index?: string;
  /** Module path label, e.g. "/experience". */
  path?: string;
  title: ReactNode;
  lede?: ReactNode;
  /** Heading level; page titles use 1, home modules use 2. */
  level?: 1 | 2;
  id?: string;
  actions?: ReactNode;
  className?: string;
};

/**
 * Signature module heading: a mono "02 — /experience" label above an
 * editorial title. The label is decorative context, so screen readers
 * hear only the heading.
 */
export function ModuleHeader({
  index,
  path,
  title,
  lede,
  level = 2,
  id,
  actions,
  className,
}: ModuleHeaderProps) {
  const Heading = level === 1 ? "h1" : "h2";
  const label = [index, path].filter(Boolean).join(" — ");

  return (
    <header
      className={cn(
        "mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="max-w-3xl">
        {label && (
          <p aria-hidden className="mb-4 eyebrow text-fg-muted">
            {label}
          </p>
        )}
        <Heading id={id} className={cn("text-fg", level === 1 ? "text-h1" : "text-h2")}>
          {title}
        </Heading>
        {lede && <p className="mt-4 max-w-[60ch] text-body-lg text-fg-secondary">{lede}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </header>
  );
}
