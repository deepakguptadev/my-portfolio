import type { SystemGraphData } from "@/lib/schemas/graph";
import {
  apiArchitectureGraph,
  deliveryPipelineGraph,
  microFrontendsGraph,
  nextjsRenderingGraph,
  reactArchitectureGraph,
} from "./architecture";
import { dnaGraph } from "./dna";
import { heroGraph } from "./hero";
import { qualityInspectionGraph } from "./quality-inspection";
import { techEcosystemGraph } from "./tech-ecosystem";

export const graphs = {
  hero: heroGraph,
  dna: dnaGraph,
  "quality-inspection": qualityInspectionGraph,
  "react-architecture": reactArchitectureGraph,
  "nextjs-rendering": nextjsRenderingGraph,
  "micro-frontends": microFrontendsGraph,
  "api-architecture": apiArchitectureGraph,
  "delivery-pipeline": deliveryPipelineGraph,
  "tech-ecosystem": techEcosystemGraph,
} satisfies Record<string, SystemGraphData>;

export type GraphId = keyof typeof graphs;

export function getGraph(id: string): SystemGraphData | undefined {
  return (graphs as Record<string, SystemGraphData>)[id];
}
