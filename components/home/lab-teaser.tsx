import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ModuleHeader } from "@/components/layout/module-header";
import { Section } from "@/components/layout/section";
import { architecture } from "@/content/architecture";
import { getGraph } from "@/content/graphs";

export function LabTeaser() {
  return (
    <Section width="wide" aria-labelledby="lab-title">
      <ModuleHeader
        index="05"
        path="/architecture"
        title="Architecture lab"
        id="lab-title"
        lede="Interactive explorations of how I structure React applications, rendering, micro frontends and APIs."
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {architecture.modules.map((module, index) => {
          const graph = getGraph(module.graphId);
          return (
            <li key={module.id}>
              <Link
                href={`/architecture?module=${module.id}`}
                className="group flex h-full flex-col rounded-lg border border-line bg-surface p-5 transition-colors duration-small hover:border-line-strong"
              >
                <span className="font-mono text-caption text-fg-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-3 text-h4 text-fg group-hover:text-accent">{module.label}</span>
                {graph && (
                  <ol aria-label="Layers" className="mt-5 flex flex-col gap-1">
                    {graph.layers.slice(0, 4).map((layer) => (
                      <li
                        key={layer}
                        className="truncate rounded-xs border border-line bg-canvas-alt px-2 py-1 font-mono text-caption text-fg-secondary"
                      >
                        {layer}
                      </li>
                    ))}
                    {graph.layers.length > 4 && (
                      <li className="px-2 font-mono text-caption text-fg-muted">
                        +{graph.layers.length - 4} more
                      </li>
                    )}
                  </ol>
                )}
                <span className="mt-auto flex items-center gap-1.5 pt-5 text-small font-medium text-accent">
                  Explore <ArrowRight aria-hidden className="size-4" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
