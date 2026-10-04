import { CircleAlert, Info, Lightbulb } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  note: { icon: Info, color: "text-info", label: "Note" },
  tip: { icon: Lightbulb, color: "text-success", label: "Tip" },
  warning: { icon: CircleAlert, color: "text-warning", label: "Warning" },
} as const;

type CalloutProps = { tone?: keyof typeof tones; title?: string; children: ReactNode };

export function Callout({ tone = "note", title, children }: CalloutProps) {
  const { icon: Icon, color, label } = tones[tone];
  return (
    <aside
      aria-label={title ?? label}
      className="my-6 flex gap-3 rounded-md border border-line bg-surface p-4 text-small text-fg-secondary [&_p]:my-0"
    >
      <Icon aria-hidden className={cn("mt-0.5 size-4 shrink-0", color)} />
      <div>
        <p className="font-medium text-fg">{title ?? label}</p>
        <div className="mt-1">{children}</div>
      </div>
    </aside>
  );
}
