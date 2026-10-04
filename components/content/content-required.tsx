import { cn } from "@/lib/utils";

type ContentRequiredProps = {
  /** What is missing, e.g. "Role and scope on this project". */
  hint?: string;
  /** "Placeholder" for sample content, "Content required" for gaps. */
  kind?: "required" | "placeholder";
  inline?: boolean;
  className?: string;
};

/**
 * Marks missing facts honestly instead of inventing them.
 * Pages decide whether gated placeholders render in production.
 */
export function ContentRequired({
  hint,
  kind = "required",
  inline = false,
  className,
}: ContentRequiredProps) {
  const label = kind === "required" ? "Content required" : "Placeholder";

  if (inline) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-xs border border-dashed border-line-strong px-1.5 font-mono text-caption text-fg-muted",
          className,
        )}
      >
        {label}
        {hint && <span className="normal-case">· {hint}</span>}
      </span>
    );
  }

  return (
    <div
      className={cn(
        "rounded-md border border-dashed border-line-strong bg-surface-2/50 px-5 py-4",
        className,
      )}
    >
      <p className="eyebrow text-fg-muted">{label}</p>
      {hint && <p className="mt-1 text-small text-fg-secondary">{hint}</p>}
    </div>
  );
}
