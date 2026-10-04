import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  info: { icon: Info, color: "text-info" },
  success: { icon: CircleCheck, color: "text-success" },
  warning: { icon: TriangleAlert, color: "text-warning" },
  error: { icon: CircleAlert, color: "text-error" },
} as const;

type AlertProps = {
  tone?: keyof typeof tones;
  title: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
};

/**
 * Inline message. Errors use role="alert" (interrupting); other tones use
 * role="status" so screen readers announce them politely.
 */
export function Alert({ tone = "info", title, children, action, className }: AlertProps) {
  const { icon: Icon, color } = tones[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex gap-3 rounded-md border border-line bg-surface p-4",
        tone === "error" && "border-error/40",
        className,
      )}
    >
      <Icon aria-hidden className={cn("mt-0.5 size-5 shrink-0", color)} />
      <div className="flex-1">
        <p className="text-small font-medium text-fg">{title}</p>
        {children && <div className="mt-1 text-small text-fg-secondary">{children}</div>}
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}
