import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-sm bg-surface-2", className)}
      {...props}
    />
  );
}

type StateProps = {
  icon: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

/** Centered state block used for empty, error and success outcomes. */
export function StatePanel({ icon: Icon, title, description, action, className }: StateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-lg border border-line bg-surface px-6 py-12 text-center",
        className,
      )}
    >
      <span className="mb-4 flex size-10 items-center justify-center rounded-md border border-line bg-surface-2 text-fg-muted">
        <Icon aria-hidden className="size-5" />
      </span>
      <p className="text-body font-medium text-fg">{title}</p>
      {description && <p className="mt-1 max-w-sm text-small text-fg-secondary">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
