import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex h-7 items-center gap-1.5 rounded-sm border px-2.5 text-small font-medium whitespace-nowrap [&_svg]:size-3.5",
  {
    variants: {
      tone: {
        neutral: "border-line bg-surface text-fg-secondary",
        accent: "border-transparent bg-accent-soft text-accent",
        success: "border-line bg-surface text-fg-secondary",
        warning: "border-line bg-surface text-fg-secondary",
        outline: "border-dashed border-line-strong bg-transparent text-fg-muted",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

/** Static label. Status tones add a colored dot rather than tinting text. */
export function Badge({ className, tone, children, ...props }: BadgeProps) {
  const dot = tone === "success" ? "bg-success" : tone === "warning" ? "bg-warning" : null;
  return (
    <span className={cn(badgeVariants({ tone }), className)} {...props}>
      {dot && <span aria-hidden className={cn("size-1.5 rounded-full", dot)} />}
      {children}
    </span>
  );
}

/** Compact mono tag for technologies and topics. */
export function Tag({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-xs bg-surface-2 px-2 font-mono text-caption text-fg-secondary",
        className,
      )}
      {...props}
    />
  );
}
