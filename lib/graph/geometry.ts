/**
 * Pure layout math for SystemGraph. Node positions are authored on a
 * 0–100 grid; the SVG uses a VIEW_WIDTH-wide viewBox whose height matches
 * the canvas aspect ratio, so scaling is uniform and nothing distorts.
 */

export const VIEW_WIDTH = 1000;

export type Point = { x: number; y: number };
export type Routing = "orthogonal" | "straight";

export function viewHeight(aspectRatio: number) {
  return VIEW_WIDTH / aspectRatio;
}

export function toView(position: Point, aspectRatio: number): Point {
  return { x: (position.x / 100) * VIEW_WIDTH, y: (position.y / 100) * viewHeight(aspectRatio) };
}

export type EdgeGeometry = {
  d: string;
  /** Where the direction arrow sits, and its rotation in degrees. */
  arrow: Point & { angle: number };
  /** Where an edge label sits. */
  label: Point;
};

const round = (n: number) => Math.round(n * 10) / 10;

function straight(a: Point, b: Point): EdgeGeometry {
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  return {
    d: `M ${round(a.x)} ${round(a.y)} L ${round(b.x)} ${round(b.y)}`,
    arrow: { ...mid, angle },
    label: mid,
  };
}

/**
 * Center-to-center path (nodes are drawn on top and cover the ends).
 * Orthogonal edges go vertical → horizontal → vertical with rounded bends;
 * the arrow sits on the final vertical run so it stays visible.
 */
export function edgeGeometry(
  a: Point,
  b: Point,
  routing: Routing = "orthogonal",
  radius = 12,
): EdgeGeometry {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (routing === "straight" || Math.abs(dx) < 1 || Math.abs(dy) < 1) return straight(a, b);

  const sx = Math.sign(dx);
  const sy = Math.sign(dy);
  const midY = a.y + dy / 2;
  const r = Math.min(radius, Math.abs(dx) / 2, Math.abs(dy) / 4);

  const d = [
    `M ${round(a.x)} ${round(a.y)}`,
    `V ${round(midY - sy * r)}`,
    `Q ${round(a.x)} ${round(midY)} ${round(a.x + sx * r)} ${round(midY)}`,
    `H ${round(b.x - sx * r)}`,
    `Q ${round(b.x)} ${round(midY)} ${round(b.x)} ${round(midY + sy * r)}`,
    `V ${round(b.y)}`,
  ].join(" ");

  return {
    d,
    arrow: { x: b.x, y: midY + (b.y - midY) / 2, angle: sy > 0 ? 90 : -90 },
    label: { x: (a.x + b.x) / 2, y: midY },
  };
}

export type Direction = "up" | "down" | "left" | "right";

const unit: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

/**
 * Spatial keyboard navigation: the closest node in the pressed direction,
 * preferring nodes aligned with that axis. Returns null at the edge.
 */
export function nearestInDirection<T extends { id: string; position: Point }>(
  items: T[],
  fromId: string,
  direction: Direction,
): T | null {
  const from = items.find((item) => item.id === fromId);
  if (!from) return null;
  const { x: ux, y: uy } = unit[direction];

  let best: T | null = null;
  let bestScore = Infinity;
  for (const item of items) {
    if (item.id === fromId) continue;
    const dx = item.position.x - from.position.x;
    const dy = item.position.y - from.position.y;
    const along = dx * ux + dy * uy;
    if (along <= 0) continue;
    const across = Math.abs(dx * uy - dy * ux);
    const score = along + across * 2;
    if (score < bestScore) {
      bestScore = score;
      best = item;
    }
  }
  return best;
}
