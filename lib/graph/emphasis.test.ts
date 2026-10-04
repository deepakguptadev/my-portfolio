import { describe, expect, it } from "vitest";
import { graphs } from "@/content/graphs";
import { computeEmphasis, describeConnections } from "./emphasis";

const hero = graphs.hero;
const mfe = graphs["micro-frontends"];
const api = graphs["api-architecture"];
const none = { activeNodeId: null, lensId: null, traceStep: null };

describe("computeEmphasis", () => {
  it("is null when nothing is selected", () => {
    expect(computeEmphasis(hero, none)).toBeNull();
  });

  it("emphasizes a node and its direct neighbors", () => {
    const result = computeEmphasis(hero, { ...none, activeNodeId: "apis" })!;
    expect(result.focus).toBe("apis");
    expect([...result.nodes].sort()).toEqual([
      "apis",
      "aws",
      "database",
      "nextjs",
      "node",
      "react",
    ]);
    expect(result.edges.has("product-react")).toBe(false);
  });

  it("lets a lens override node selection", () => {
    const result = computeEmphasis(mfe, {
      ...none,
      activeNodeId: "host",
      lensId: "communication",
    })!;
    expect([...result.nodes]).toEqual(["events"]);
    expect(result.focus).toBeNull();
  });

  it("lets a trace step override everything", () => {
    const result = computeEmphasis(api, { activeNodeId: "db", lensId: null, traceStep: 1 })!;
    expect([...result.edges]).toEqual(["api-auth"]);
    expect(result.focus).toBe("auth");
  });
});

describe("describeConnections", () => {
  it("spells out direction and relationship", () => {
    expect(describeConnections(hero, "node")).toBe(
      "Connects from Product (dependency), to APIs (serves).",
    );
  });
});
