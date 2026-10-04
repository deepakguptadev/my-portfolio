import {
  AppWindow,
  Boxes,
  CircleDot,
  Cloud,
  Component,
  Database,
  Webhook,
  type LucideIcon,
} from "lucide-react";
import type { EdgeKind, NodeKind } from "@/lib/schemas/graph";

/** Node kinds are distinguished by icon, label and border — never by hue. */
export const nodeKindMeta: Record<NodeKind, { label: string; icon: LucideIcon }> = {
  application: { label: "Application", icon: AppWindow },
  module: { label: "Module", icon: Boxes },
  component: { label: "Component", icon: Component },
  api: { label: "API", icon: Webhook },
  database: { label: "Database", icon: Database },
  external: { label: "External service", icon: Cloud },
  concept: { label: "Concept", icon: CircleDot },
};

/** Edge kinds are distinguished by stroke pattern. */
export const edgeKindMeta: Record<EdgeKind, { label: string; dash?: string }> = {
  request: { label: "Request" },
  dataFlow: { label: "Data flow" },
  dependency: { label: "Dependency", dash: "6 5" },
  event: { label: "Event", dash: "1.5 5" },
};
