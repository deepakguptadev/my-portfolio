import { ChevronDown } from "lucide-react";
import type { SystemGraphData } from "@/lib/schemas/graph";
import { edgeKindMeta, nodeKindMeta } from "./kinds";

/** Collapsible key for the node and edge kinds used in this graph. */
export function GraphLegend({ graph }: { graph: SystemGraphData }) {
  const nodeKinds = [...new Set(graph.nodes.map((n) => n.kind))];
  const edgeKinds = [...new Set(graph.edges.map((e) => e.kind))];

  return (
    <details className="group text-small">
      <summary className="inline-flex min-h-8 cursor-pointer list-none items-center gap-1.5 rounded-sm text-fg-secondary hover:text-fg [&::-webkit-details-marker]:hidden">
        Legend
        <ChevronDown
          aria-hidden
          className="size-3.5 transition-transform duration-small group-open:rotate-180"
        />
      </summary>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
        <ul className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Node types">
          {nodeKinds.map((kind) => {
            const { label, icon: Icon } = nodeKindMeta[kind];
            return (
              <li key={kind} className="flex items-center gap-1.5 text-fg-secondary">
                <Icon aria-hidden className="size-3.5 text-fg-muted" />
                {label}
              </li>
            );
          })}
        </ul>
        <ul className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Connection types">
          {edgeKinds.map((kind) => (
            <li key={kind} className="flex items-center gap-2 text-fg-secondary">
              <svg aria-hidden width="28" height="8" className="text-fg-muted">
                <line
                  x1="1"
                  y1="4"
                  x2="27"
                  y2="4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray={edgeKindMeta[kind].dash}
                />
              </svg>
              {edgeKindMeta[kind].label}
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
