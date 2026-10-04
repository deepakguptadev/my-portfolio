import { connectionsOf, edgeKindLabel } from "@/lib/graph/emphasis";
import type { GraphLens, SystemGraphData } from "@/lib/schemas/graph";
import { Tag } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { nodeKindMeta } from "./kinds";

type InspectorProps = {
  graph: SystemGraphData;
  nodeId: string | null;
  lens: GraphLens | null;
  traceStep: number | null;
  compact?: boolean;
  /** False for undirected maps: connections are listed without direction. */
  directed?: boolean;
  className?: string;
};

function Subhead({ children }: { children: string }) {
  return <p className="mt-5 mb-1.5 eyebrow text-fg-muted">{children}</p>;
}

/** Details for whatever the user is looking at: trace step, node, lens or the graph. */
export function GraphInspector({
  graph,
  nodeId,
  lens,
  traceStep,
  compact,
  directed = true,
  className,
}: InspectorProps) {
  const shell = cn("rounded-md border border-line bg-surface p-5", compact && "p-4", className);
  const nodeLabel = (id: string) => graph.nodes.find((n) => n.id === id)?.label ?? id;

  if (traceStep !== null && graph.trace) {
    const edge = graph.edges.find((e) => e.id === graph.trace![traceStep]);
    const target = graph.nodes.find((n) => n.id === edge?.to);
    if (edge && target) {
      return (
        <div className={shell}>
          <p className="eyebrow text-accent">
            Step {traceStep + 1} of {graph.trace.length}
          </p>
          <p className="mt-2 text-h4 text-fg">
            {nodeLabel(edge.from)} → {target.label}
          </p>
          <p className="mt-2 text-small text-fg-secondary">{target.summary}</p>
          <p className="mt-3 font-mono text-caption text-fg-muted">
            {edge.label ?? edgeKindLabel[edge.kind]}
          </p>
        </div>
      );
    }
  }

  const node = nodeId ? graph.nodes.find((n) => n.id === nodeId) : null;
  if (node) {
    const { label: kindLabel, icon: Icon } = nodeKindMeta[node.kind];
    const connections = connectionsOf(graph, node.id);
    return (
      <div className={shell}>
        <p className="flex items-center gap-1.5 eyebrow text-fg-muted">
          <Icon aria-hidden className="size-3.5" /> {kindLabel}
        </p>
        <p className="mt-2 text-h4 text-fg">{node.label}</p>
        <p className="mt-2 text-small text-fg-secondary">{node.summary}</p>
        {!compact && (
          <>
            {node.details?.responsibility && (
              <>
                <Subhead>Responsibility</Subhead>
                <p className="text-small text-fg-secondary">{node.details.responsibility}</p>
              </>
            )}
            {node.details?.whyItMatters && (
              <>
                <Subhead>Why it matters</Subhead>
                <p className="text-small text-fg-secondary">{node.details.whyItMatters}</p>
              </>
            )}
            {node.details?.tradeoffs && node.details.tradeoffs.length > 0 && (
              <>
                <Subhead>{node.kind === "concept" ? "In practice" : "Tradeoffs"}</Subhead>
                <ul className="list-disc space-y-1 pl-5 text-small text-fg-secondary marker:text-fg-muted">
                  {node.details.tradeoffs.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}
            {connections.length > 0 && (
              <>
                <Subhead>Connections</Subhead>
                <ul className="space-y-1 font-mono text-caption text-fg-secondary">
                  {connections.map(({ edge, direction, other }) => (
                    <li key={edge.id}>
                      {directed ? (direction === "out" ? "→" : "←") : "·"} {other} ·{" "}
                      {edge.label ?? edgeKindLabel[edge.kind]}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
        {node.details?.tech && node.details.tech.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {node.details.tech.map((tech) => (
              <Tag key={tech} className="bg-surface">
                {tech}
              </Tag>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (lens) {
    return (
      <div className={shell}>
        <p className="eyebrow text-accent">Lens</p>
        <p className="mt-2 text-h4 text-fg">{lens.label}</p>
        <p className="mt-2 text-small text-fg-secondary">{lens.note}</p>
      </div>
    );
  }

  return (
    <div className={shell}>
      <p className="eyebrow text-fg-muted">Inspector</p>
      <p className="mt-2 text-small text-fg-secondary">{graph.description}</p>
      <p className="mt-3 text-small text-fg-muted">
        Hover or focus a node to preview its connections; select it to pin the details.
      </p>
    </div>
  );
}
