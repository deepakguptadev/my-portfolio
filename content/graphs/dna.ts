import { engineering } from "@/content/engineering";
import { defineContent } from "@/lib/schemas/common";
import { systemGraph } from "@/lib/schemas/graph";

// Pentagon around the center node, starting at the top, clockwise.
const positions: Record<string, { x: number; y: number }> = {
  architecture: { x: 50, y: 8 },
  product: { x: 90, y: 38 },
  quality: { x: 74, y: 90 },
  "full-stack": { x: 26, y: 90 },
  performance: { x: 10, y: 38 },
};

// Principle-to-principle links come from engineering.ts (deduplicated).
const links = new Map<string, { from: string; to: string }>();
for (const principle of engineering.principles) {
  for (const other of principle.related) {
    const [from, to] = [principle.id, other].sort();
    links.set(`${from}--${to}`, { from, to });
  }
}

export const dnaGraph = defineContent("graphs/dna", systemGraph, {
  id: "dna",
  title: "Engineering DNA",
  description: "The five principles behind how I engineer, and how they reinforce each other.",
  layers: ["Core", "Principles"],
  nodes: [
    {
      id: "deepak",
      label: "Deepak",
      kind: "concept",
      summary: "Select a principle to see what it means in practice and what it connects to.",
      layout: { x: 50, y: 52 },
      layer: 0,
    },
    ...engineering.principles.map((principle) => ({
      id: principle.id,
      label: principle.label,
      kind: "concept" as const,
      summary: principle.summary,
      details: { tradeoffs: principle.practices },
      layout: positions[principle.id] ?? { x: 50, y: 50 },
      layer: 1,
    })),
  ],
  edges: [
    ...engineering.principles.map((principle) => ({
      id: `deepak--${principle.id}`,
      from: "deepak",
      to: principle.id,
      kind: "dependency" as const,
      label: "principle",
    })),
    ...[...links].map(([id, { from, to }]) => ({
      id,
      from,
      to,
      kind: "event" as const,
      label: "related",
    })),
  ],
});
