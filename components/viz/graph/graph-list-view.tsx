import { ArrowDown, ArrowRight, ChevronDown } from "lucide-react";
import { connectionsOf, edgeKindLabel } from "@/lib/graph/emphasis";
import type { SystemGraphData } from "@/lib/schemas/graph";
import { cn } from "@/lib/utils";
import { nodeKindMeta } from "./kinds";

/**
 * The graph as nested lists by layer. Used as the mobile representation
 * and as the "View as list" alternative for screen readers and keyboards.
 */
export function GraphListView({
  graph,
  className,
}: {
  graph: SystemGraphData;
  className?: string;
}) {
  const layers = graph.layers
    .map((name, index) => ({
      name,
      nodes: graph.nodes.filter((n) => n.layer === index).sort((a, b) => a.layout.x - b.layout.x),
    }))
    .filter((layer) => layer.nodes.length > 0);

  return (
    <ol aria-label={`${graph.title} — layers`} className={cn("flex flex-col", className)}>
      {layers.map((layer, index) => (
        <li key={layer.name} className="flex flex-col">
          <div className="rounded-md border border-line bg-surface p-3">
            <p className="mb-2 eyebrow text-fg-muted">{layer.name}</p>
            <ul className="flex flex-col gap-1.5">
              {layer.nodes.map((node) => {
                const { label: kindLabel, icon: Icon } = nodeKindMeta[node.kind];
                const connections = connectionsOf(graph, node.id);
                return (
                  <li key={node.id}>
                    <details className="group rounded-sm border border-line bg-canvas-alt">
                      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2.5 px-3 text-small font-medium text-fg [&::-webkit-details-marker]:hidden">
                        <Icon aria-hidden className="size-4 shrink-0 text-fg-muted" />
                        <span className="flex-1">{node.label}</span>
                        <span className="sr-only">, {kindLabel}</span>
                        <ChevronDown
                          aria-hidden
                          className="size-4 text-fg-muted transition-transform duration-small group-open:rotate-180"
                        />
                      </summary>
                      <div className="px-3 pb-3 text-small text-fg-secondary">
                        <p>{node.summary}</p>
                        {connections.length > 0 && (
                          <ul className="mt-2 flex flex-col gap-1" aria-label="Connections">
                            {connections.map(({ edge, direction, other }) => (
                              <li
                                key={edge.id}
                                className="flex items-center gap-1.5 font-mono text-caption text-fg-muted"
                              >
                                <ArrowRight
                                  aria-hidden
                                  className={cn("size-3", direction === "in" && "rotate-180")}
                                />
                                {direction === "out" ? "to" : "from"} {other} ·{" "}
                                {edge.label ?? edgeKindLabel[edge.kind]}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </details>
                  </li>
                );
              })}
            </ul>
          </div>
          {index < layers.length - 1 && (
            <ArrowDown aria-hidden className="mx-auto my-1.5 size-4 text-fg-muted" />
          )}
        </li>
      ))}
    </ol>
  );
}
