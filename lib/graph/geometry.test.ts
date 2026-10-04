import { describe, expect, it } from "vitest";
import { edgeGeometry, nearestInDirection, toView, viewHeight } from "./geometry";

describe("toView", () => {
  it("maps the 0–100 grid onto a uniformly scaled viewBox", () => {
    expect(viewHeight(2)).toBe(500);
    expect(toView({ x: 50, y: 50 }, 2)).toEqual({ x: 500, y: 250 });
  });
});

describe("edgeGeometry", () => {
  it("draws aligned nodes as a straight line", () => {
    const edge = edgeGeometry({ x: 100, y: 0 }, { x: 100, y: 200 });
    expect(edge.d).toBe("M 100 0 L 100 200");
    expect(edge.arrow).toMatchObject({ x: 100, y: 100, angle: 90 });
  });

  it("routes offset nodes orthogonally with the arrow on the final run", () => {
    const edge = edgeGeometry({ x: 0, y: 0 }, { x: 200, y: 200 });
    expect(edge.d.startsWith("M 0 0 V")).toBe(true);
    expect(edge.d.endsWith("V 200")).toBe(true);
    expect(edge.arrow).toEqual({ x: 200, y: 150, angle: 90 });
  });

  it("points upward arrows up", () => {
    expect(edgeGeometry({ x: 0, y: 200 }, { x: 200, y: 0 }).arrow.angle).toBe(-90);
  });

  it("supports straight routing for radial graphs", () => {
    const edge = edgeGeometry({ x: 0, y: 0 }, { x: 100, y: 100 }, "straight");
    expect(edge.d).toBe("M 0 0 L 100 100");
    expect(edge.arrow.angle).toBe(45);
  });
});

describe("nearestInDirection", () => {
  const items = [
    { id: "top", position: { x: 50, y: 0 } },
    { id: "left", position: { x: 10, y: 50 } },
    { id: "center", position: { x: 50, y: 50 } },
    { id: "right", position: { x: 90, y: 50 } },
    { id: "bottom-right", position: { x: 80, y: 100 } },
  ];

  it("moves along the pressed axis", () => {
    expect(nearestInDirection(items, "center", "up")?.id).toBe("top");
    expect(nearestInDirection(items, "center", "left")?.id).toBe("left");
    expect(nearestInDirection(items, "center", "right")?.id).toBe("right");
    expect(nearestInDirection(items, "center", "down")?.id).toBe("bottom-right");
  });

  it("returns null when nothing lies in that direction", () => {
    expect(nearestInDirection(items, "top", "up")).toBeNull();
  });
});
