"use client";

import { FileSearch } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { StatePanel } from "@/components/ui/feedback";
import { cn } from "@/lib/utils";

type Item = { slug: string; techs: string[]; card: ReactNode };
type ProjectFilterProps = { techs: string[]; items: Item[] };

const toParam = (tech: string) => tech.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function FilterView({
  techs,
  items,
  active,
  onToggle,
  onClear,
}: ProjectFilterProps & {
  active: string[];
  onToggle?: (tech: string) => void;
  onClear?: () => void;
}) {
  const visible = items.filter((item) =>
    active.every((tech) => item.techs.some((t) => toParam(t) === tech)),
  );

  return (
    <div>
      <div role="group" aria-label="Filter by technology" className="flex flex-wrap gap-2">
        {techs.map((tech) => {
          const pressed = active.includes(toParam(tech));
          return (
            <button
              key={tech}
              type="button"
              aria-pressed={pressed}
              onClick={() => onToggle?.(toParam(tech))}
              className={cn(
                "h-8 rounded-full border px-3 text-small transition-colors duration-micro pointer-coarse:h-11",
                pressed
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line bg-surface text-fg-secondary hover:border-line-strong hover:text-fg",
              )}
            >
              {tech}
            </button>
          );
        })}
      </div>
      <p role="status" className="mt-4 font-mono text-caption text-fg-muted">
        {visible.length} {visible.length === 1 ? "project" : "projects"}
        {active.length > 0 && " match the selected technologies"}
      </p>
      <div className="mt-6 flex flex-col gap-6">
        {visible.map((item) => (
          <div key={item.slug}>{item.card}</div>
        ))}
        {visible.length === 0 && (
          <StatePanel
            icon={FileSearch}
            title="No projects match those technologies"
            description="Try removing a filter."
            action={
              <Button size="sm" variant="secondary" onClick={onClear}>
                Clear filters
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}

function SyncedFilter(props: ProjectFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const active = params.getAll("tech");

  function update(next: string[]) {
    const query = new URLSearchParams();
    next.forEach((tech) => query.append("tech", tech));
    const search = query.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  }

  return (
    <FilterView
      {...props}
      active={active}
      onToggle={(tech) =>
        update(active.includes(tech) ? active.filter((t) => t !== tech) : [...active, tech])
      }
      onClear={() => update([])}
    />
  );
}

/** Technology filter synced to ?tech=… (AND across selections). */
export function ProjectFilter(props: ProjectFilterProps) {
  return (
    <Suspense fallback={<FilterView {...props} active={[]} />}>
      <SyncedFilter {...props} />
    </Suspense>
  );
}
