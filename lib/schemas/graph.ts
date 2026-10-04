import { z } from "zod";

export const nodeKinds = [
  "application",
  "module",
  "component",
  "api",
  "database",
  "external",
  "concept",
] as const;

export const edgeKinds = ["request", "dataFlow", "dependency", "event"] as const;

const graphNode = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  kind: z.enum(nodeKinds),
  summary: z.string().min(1),
  details: z
    .object({
      responsibility: z.string().optional(),
      whyItMatters: z.string().optional(),
      tradeoffs: z.array(z.string()).optional(),
      tech: z.array(z.string()).optional(),
    })
    .optional(),
  /** Position on a 0–100 grid (x across, y down); the renderer scales it. */
  layout: z.object({ x: z.number().min(0).max(100), y: z.number().min(0).max(100) }),
  /** Layer for stacked/mobile representations, top = 0. */
  layer: z.number().int().min(0),
});

const graphEdge = z.object({
  id: z.string().min(1),
  from: z.string(),
  to: z.string(),
  kind: z.enum(edgeKinds),
  label: z.string().optional(),
});

const graphLens = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  note: z.string().min(1),
  emphasize: z.object({ nodes: z.array(z.string()), edges: z.array(z.string()) }),
});

export const systemGraph = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    /** Human-readable names for layers, used by the stacked view. */
    layers: z.array(z.string()).min(1),
    nodes: z.array(graphNode).min(1),
    edges: z.array(graphEdge),
    lenses: z.array(graphLens).optional(),
    /** Ordered edge ids for the "trace a request" stepper. */
    trace: z.array(z.string()).optional(),
    /** Stepper label when the trace follows something other than a request. */
    traceLabel: z.string().optional(),
  })
  .superRefine((graph, ctx) => {
    const nodeIds = new Set<string>();
    for (const node of graph.nodes) {
      if (nodeIds.has(node.id))
        ctx.addIssue({ code: "custom", message: `Duplicate node "${node.id}"` });
      nodeIds.add(node.id);
      if (node.layer >= graph.layers.length) {
        ctx.addIssue({
          code: "custom",
          message: `Node "${node.id}" uses undefined layer ${node.layer}`,
        });
      }
    }
    const edgeIds = new Set<string>();
    for (const edge of graph.edges) {
      if (edgeIds.has(edge.id))
        ctx.addIssue({ code: "custom", message: `Duplicate edge "${edge.id}"` });
      edgeIds.add(edge.id);
      for (const end of [edge.from, edge.to]) {
        if (!nodeIds.has(end)) {
          ctx.addIssue({
            code: "custom",
            message: `Edge "${edge.id}" references unknown node "${end}"`,
          });
        }
      }
    }
    for (const lens of graph.lenses ?? []) {
      for (const id of lens.emphasize.nodes) {
        if (!nodeIds.has(id))
          ctx.addIssue({
            code: "custom",
            message: `Lens "${lens.id}" references unknown node "${id}"`,
          });
      }
      for (const id of lens.emphasize.edges) {
        if (!edgeIds.has(id))
          ctx.addIssue({
            code: "custom",
            message: `Lens "${lens.id}" references unknown edge "${id}"`,
          });
      }
    }
    for (const id of graph.trace ?? []) {
      if (!edgeIds.has(id))
        ctx.addIssue({ code: "custom", message: `Trace references unknown edge "${id}"` });
    }
  });

export type SystemGraphData = z.infer<typeof systemGraph>;
export type GraphNode = SystemGraphData["nodes"][number];
export type GraphEdge = SystemGraphData["edges"][number];
export type GraphLens = NonNullable<SystemGraphData["lenses"]>[number];
export type NodeKind = (typeof nodeKinds)[number];
export type EdgeKind = (typeof edgeKinds)[number];
