import type { GraphEdge, SystemGraphData } from "@/lib/schemas/graph";

export type Emphasis = {
  /** The node the user is looking at (shown as active). */
  focus: string | null;
  nodes: ReadonlySet<string>;
  edges: ReadonlySet<string>;
};

type EmphasisInput = {
  activeNodeId: string | null;
  lensId: string | null;
  /** Index into graph.trace while the request tracer is running. */
  traceStep: number | null;
};

/**
 * What to highlight. Priority: trace step > lens > active node.
 * null = nothing emphasized; everything renders in its idle state.
 */
export function computeEmphasis(graph: SystemGraphData, input: EmphasisInput): Emphasis | null {
  if (input.traceStep !== null && graph.trace?.[input.traceStep]) {
    const edge = graph.edges.find((e) => e.id === graph.trace![input.traceStep!]);
    if (edge)
      return { focus: edge.to, nodes: new Set([edge.from, edge.to]), edges: new Set([edge.id]) };
  }

  if (input.lensId) {
    const lens = graph.lenses?.find((l) => l.id === input.lensId);
    if (lens) {
      return {
        focus: null,
        nodes: new Set(lens.emphasize.nodes),
        edges: new Set(lens.emphasize.edges),
      };
    }
  }

  if (input.activeNodeId) {
    const incident = graph.edges.filter(
      (e) => e.from === input.activeNodeId || e.to === input.activeNodeId,
    );
    return {
      focus: input.activeNodeId,
      nodes: new Set([input.activeNodeId, ...incident.flatMap((e) => [e.from, e.to])]),
      edges: new Set(incident.map((e) => e.id)),
    };
  }

  return null;
}

/** Edges touching a node, described for screen readers and list views. */
export function connectionsOf(graph: SystemGraphData, nodeId: string) {
  const label = (id: string) => graph.nodes.find((n) => n.id === id)?.label ?? id;
  return graph.edges
    .filter((e) => e.from === nodeId || e.to === nodeId)
    .map((edge: GraphEdge) => ({
      edge,
      direction: edge.from === nodeId ? ("out" as const) : ("in" as const),
      other: label(edge.from === nodeId ? edge.to : edge.from),
    }));
}

export const edgeKindLabel: Record<GraphEdge["kind"], string> = {
  request: "request",
  dataFlow: "data flow",
  dependency: "dependency",
  event: "event",
};

export function describeConnections(graph: SystemGraphData, nodeId: string) {
  const items = connectionsOf(graph, nodeId).map(
    ({ direction, other, edge }) =>
      `${direction === "out" ? "to" : "from"} ${other} (${edge.label ?? edgeKindLabel[edge.kind]})`,
  );
  return items.length ? `Connects ${items.join(", ")}.` : "No connections.";
}
