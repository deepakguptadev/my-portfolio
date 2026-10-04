"use client";

import { ChevronLeft, ChevronRight, List, Network, RotateCcw } from "lucide-react";
import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { computeEmphasis, describeConnections } from "@/lib/graph/emphasis";
import {
  edgeGeometry,
  nearestInDirection,
  toView,
  VIEW_WIDTH,
  viewHeight,
  type Direction,
  type Routing,
} from "@/lib/graph/geometry";
import type { GraphNode, SystemGraphData } from "@/lib/schemas/graph";
import { cn } from "@/lib/utils";
import { GraphInspector } from "./graph-inspector";
import { GraphLegend } from "./graph-legend";
import { GraphListView } from "./graph-list-view";
import { edgeKindMeta, nodeKindMeta } from "./kinds";

type SystemGraphProps = {
  graph: SystemGraphData;
  /** Canvas width / height. Node positions scale with it. */
  aspectRatio?: number;
  routing?: Routing;
  /** Direction arrows; off for undirected relationship maps (e.g. DNA). */
  arrows?: boolean;
  inspector?: "side" | "below" | "none";
  /** Show the "trace a request" stepper (needs graph.trace). */
  showTrace?: boolean;
  /** Hide the toolbar (legend + list toggle) for compact embeds. */
  toolbar?: boolean;
  className?: string;
};

type NodeState = "idle" | "active" | "related" | "muted";

const keyDirections: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

function nodeShape(node: GraphNode) {
  switch (node.kind) {
    case "external":
      return "rounded-sm border-dashed";
    case "database":
      return "rounded-sm border-t-[3px] [border-top-style:double]";
    case "concept":
      return "rounded-full px-4";
    case "application":
      return "rounded-sm border-[1.5px]";
    default:
      return "rounded-sm";
  }
}

const nodeStateClasses: Record<NodeState, string> = {
  idle: "border-line-strong bg-surface text-fg-secondary hover:text-fg",
  active: "border-accent bg-accent-soft text-fg shadow-sm",
  related: "border-fg-muted bg-surface text-fg",
  muted: "border-line bg-surface text-fg-muted opacity-40",
};

export function SystemGraph({
  graph,
  aspectRatio = 16 / 10,
  routing = "orthogonal",
  arrows = true,
  inspector = "side",
  showTrace = false,
  toolbar = true,
  className,
}: SystemGraphProps) {
  const instructionsId = useId();
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [lensId, setLensId] = useState<string | null>(null);
  const [traceStep, setTraceStep] = useState<number | null>(null);
  const [focusId, setFocusId] = useState(graph.nodes[0].id);
  const [listView, setListView] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const nodeRefs = useRef(new Map<string, HTMLButtonElement>());

  const height = viewHeight(aspectRatio);
  const positions = useMemo(
    () => new Map(graph.nodes.map((n) => [n.id, toView(n.layout, aspectRatio)])),
    [graph.nodes, aspectRatio],
  );
  const edges = useMemo(
    () =>
      graph.edges.map((edge) => ({
        edge,
        geometry: edgeGeometry(positions.get(edge.from)!, positions.get(edge.to)!, routing),
      })),
    [graph.edges, positions, routing],
  );

  const activeNodeId = selected ?? hovered;
  const emphasis = computeEmphasis(graph, { activeNodeId, lensId, traceStep });
  const lens = graph.lenses?.find((l) => l.id === lensId) ?? null;
  const inspectedNode = traceStep !== null ? null : activeNodeId;

  function nodeState(id: string): NodeState {
    if (!emphasis) return "idle";
    if (emphasis.focus === id) return "active";
    if (emphasis.nodes.has(id)) return emphasis.focus ? "related" : "active";
    return "muted";
  }

  function edgeState(id: string) {
    if (!emphasis) return "idle";
    return emphasis.edges.has(id) ? "active" : "muted";
  }

  function focusNode(id: string) {
    setFocusId(id);
    nodeRefs.current.get(id)?.focus();
  }

  function select(id: string) {
    const next = selected === id ? null : id;
    setSelected(next);
    setTraceStep(null);
    const node = graph.nodes.find((n) => n.id === id)!;
    setAnnouncement(next ? `${node.label} selected. ${node.summary}` : `${node.label} deselected.`);
  }

  function onNodeKeyDown(event: KeyboardEvent<HTMLButtonElement>, id: string) {
    const direction = keyDirections[event.key];
    if (direction) {
      event.preventDefault();
      const items = graph.nodes.map((n) => ({ id: n.id, position: positions.get(n.id)! }));
      const next = nearestInDirection(items, id, direction);
      if (next) focusNode(next.id);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      focusNode(event.key === "Home" ? graph.nodes[0].id : graph.nodes[graph.nodes.length - 1].id);
    } else if (event.key === "Escape" && (selected || lensId || traceStep !== null)) {
      event.preventDefault();
      reset();
    }
  }

  function reset() {
    setSelected(null);
    setLensId(null);
    setTraceStep(null);
    setAnnouncement("Selection cleared.");
  }

  function chooseLens(id: string) {
    const next = lensId === id ? null : id;
    setLensId(next);
    setTraceStep(null);
    const chosen = graph.lenses?.find((l) => l.id === id);
    setAnnouncement(next && chosen ? `${chosen.label}: ${chosen.note}` : "Lens cleared.");
  }

  function stepTrace(delta: number) {
    const total = graph.trace?.length ?? 0;
    if (!total) return;
    const next = traceStep === null ? 0 : Math.min(total - 1, Math.max(0, traceStep + delta));
    setTraceStep(next);
    setLensId(null);
    const edge = graph.edges.find((e) => e.id === graph.trace![next]);
    const label = (nodeId?: string) => graph.nodes.find((n) => n.id === nodeId)?.label;
    setAnnouncement(`Step ${next + 1} of ${total}: ${label(edge?.from)} to ${label(edge?.to)}.`);
  }

  const hasControls = (graph.lenses?.length ?? 0) > 0 || (showTrace && graph.trace);
  const pct = (value: number, of: number) => `${(value / of) * 100}%`;

  const canvas = (
    <div
      role="group"
      aria-label={graph.title}
      aria-describedby={instructionsId}
      data-spotlight="grid"
      className="relative overflow-hidden rounded-md border border-line bg-canvas-alt bg-dot-grid"
      style={{ aspectRatio }}
    >
      <p id={instructionsId} className="sr-only">
        Diagram with {graph.nodes.length} nodes. Use arrow keys to move between nodes, Enter to
        select a node and pin its details, Escape to clear. A list version is available.
      </p>
      <div className="absolute inset-6 sm:inset-8">
        <svg
          aria-hidden
          className="absolute inset-0 size-full overflow-visible"
          viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
          preserveAspectRatio="none"
        >
          {edges.map(({ edge, geometry }) => {
            const state = edgeState(edge.id);
            const { dash } = edgeKindMeta[edge.kind];
            const animate = state === "active" && edge.kind === "dataFlow";
            return (
              <g
                key={edge.id}
                className={cn(
                  "transition-[color,opacity] duration-small ease-standard",
                  state === "active" ? "text-accent" : "text-line-strong",
                  state === "muted" && "opacity-30",
                )}
              >
                <path
                  d={geometry.d}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={state === "active" ? 2 : 1.5}
                  strokeLinecap="round"
                  strokeDasharray={animate ? "8 6" : dash}
                  vectorEffect="non-scaling-stroke"
                  className={animate ? "animate-dash-flow" : undefined}
                />
                {arrows && (
                  <polygon
                    points="-6,-4.5 5,0 -6,4.5"
                    fill="currentColor"
                    transform={`translate(${geometry.arrow.x} ${geometry.arrow.y}) rotate(${geometry.arrow.angle})`}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {edges
          .filter(({ edge }) => arrows && edge.label && edgeState(edge.id) === "active")
          .map(({ edge, geometry }) => (
            <span
              key={edge.id}
              aria-hidden
              className="pointer-events-none absolute z-raised -translate-x-1/2 -translate-y-1/2 rounded-xs bg-canvas-alt px-1.5 font-mono text-caption whitespace-nowrap text-accent"
              style={{
                left: pct(geometry.label.x, VIEW_WIDTH),
                top: pct(geometry.label.y, height),
              }}
            >
              {edge.label}
            </span>
          ))}

        {graph.nodes.map((node) => {
          const state = nodeState(node.id);
          const { label: kindLabel, icon: Icon } = nodeKindMeta[node.kind];
          return (
            <button
              key={node.id}
              ref={(el) => {
                if (el) nodeRefs.current.set(node.id, el);
                else nodeRefs.current.delete(node.id);
              }}
              type="button"
              data-state={state}
              tabIndex={focusId === node.id ? 0 : -1}
              aria-pressed={selected === node.id}
              aria-label={`${node.label}, ${kindLabel}. ${describeConnections(graph, node.id)}`}
              onClick={() => select(node.id)}
              onFocus={() => {
                setFocusId(node.id);
                setHovered(node.id);
              }}
              onBlur={() => setHovered(null)}
              onPointerEnter={() => setHovered(node.id)}
              onPointerLeave={() => setHovered(null)}
              onKeyDown={(event) => onNodeKeyDown(event, node.id)}
              className={cn(
                "absolute z-raised flex h-9 -translate-x-1/2 -translate-y-1/2 items-center gap-2 border px-3 text-small font-medium whitespace-nowrap lg:h-10",
                "transition-[color,background-color,border-color,opacity,box-shadow] duration-small ease-standard",
                nodeShape(node),
                nodeStateClasses[state],
                selected === node.id && "ring-2 ring-accent/30",
              )}
              style={{ left: `${node.layout.x}%`, top: `${node.layout.y}%` }}
            >
              <Icon aria-hidden className="size-3.5 shrink-0 opacity-70" />
              {node.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  const inspectorPanel =
    inspector === "none" ? null : (
      <GraphInspector
        graph={graph}
        nodeId={inspectedNode}
        lens={lens}
        traceStep={traceStep}
        compact={inspector === "below"}
        directed={arrows}
      />
    );

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {hasControls && (
        <div className="flex flex-col gap-3">
          {graph.lenses && graph.lenses.length > 0 && (
            <div
              role="group"
              aria-label="Lenses"
              className="-mx-1 flex [scrollbar-width:none] gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap"
            >
              {graph.lenses.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={lensId === item.id}
                  onClick={() => chooseLens(item.id)}
                  className={cn(
                    "h-8 shrink-0 rounded-full border px-3 text-small whitespace-nowrap transition-colors duration-micro pointer-coarse:h-11",
                    lensId === item.id
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-line bg-surface text-fg-secondary hover:border-line-strong hover:text-fg",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
          {showTrace && graph.trace && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 eyebrow text-fg-muted">
                {graph.traceLabel ?? "Trace a request"}
              </span>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => stepTrace(-1)}
                disabled={!traceStep}
              >
                <ChevronLeft aria-hidden /> Previous
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => stepTrace(1)}
                disabled={traceStep === graph.trace.length - 1}
              >
                {traceStep === null ? "Start" : "Next"} <ChevronRight aria-hidden />
              </Button>
              {traceStep !== null && (
                <span className="font-mono text-caption text-fg-muted">
                  {traceStep + 1} / {graph.trace.length}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          inspector === "side" && "grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start",
          inspector === "below" && "flex flex-col gap-4",
        )}
      >
        <div className={cn(listView ? "hidden" : "hidden sm:block")}>{canvas}</div>
        <GraphListView graph={graph} className={cn(listView ? "block" : "sm:hidden")} />
        {inspectorPanel && (
          <div className={cn(!listView && "hidden sm:block")}>{inspectorPanel}</div>
        )}
      </div>

      {toolbar && (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <GraphLegend graph={graph} />
          <div className="flex gap-2">
            {(selected || lensId || traceStep !== null) && (
              <Button size="sm" variant="ghost" onClick={reset}>
                <RotateCcw aria-hidden /> Reset
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              aria-pressed={listView}
              onClick={() => setListView((value) => !value)}
              className="hidden sm:inline-flex"
            >
              {listView ? <Network aria-hidden /> : <List aria-hidden />}
              {listView ? "View as diagram" : "View as list"}
            </Button>
          </div>
        </div>
      )}

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
