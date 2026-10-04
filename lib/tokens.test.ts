import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio, parseColorTokens } from "./tokens";

const root = join(__dirname, "..");
const tokens = parseColorTokens(readFileSync(join(root, "styles/tokens.css"), "utf8"));
const byName = Object.fromEntries(tokens.map((t) => [t.name, t]));

type Pair = { fg: string; bg: string; min: number };

// Text: 4.5:1. UI boundaries / large text / focus rings: 3:1.
const pairs: Pair[] = [
  ...["bg-primary", "bg-secondary", "surface-primary"].flatMap((bg) => [
    { fg: "text-primary", bg, min: 4.5 },
    { fg: "text-secondary", bg, min: 4.5 },
    { fg: "text-muted", bg, min: 4.5 },
    { fg: "accent", bg, min: 4.5 },
    { fg: "success", bg, min: 4.5 },
    { fg: "warning", bg, min: 4.5 },
    { fg: "error", bg, min: 4.5 },
  ]),
  { fg: "text-primary", bg: "surface-secondary", min: 4.5 },
  { fg: "text-secondary", bg: "surface-secondary", min: 4.5 },
  { fg: "accent", bg: "accent-soft", min: 4.5 },
  { fg: "accent-contrast", bg: "accent", min: 4.5 },
  { fg: "accent-contrast", bg: "accent-hover", min: 4.5 },
  { fg: "accent-contrast", bg: "error", min: 4.5 },
  { fg: "accent", bg: "bg-primary", min: 3 },
];

describe("color tokens", () => {
  it("defines every token referenced by the contrast pairs", () => {
    const referenced = new Set(pairs.flatMap(({ fg, bg }) => [fg, bg]));
    expect([...referenced].filter((name) => !byName[name])).toEqual([]);
  });

  for (const mode of ["light", "dark"] as const) {
    for (const { fg, bg, min } of pairs) {
      it(`${mode}: ${fg} on ${bg} ≥ ${min}:1`, () => {
        const ratio = contrastRatio(byName[fg][mode], byName[bg][mode]);
        expect(ratio).toBeGreaterThanOrEqual(min);
      });
    }
  }
});

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

describe("token discipline", () => {
  it("keeps raw hex colors inside styles/tokens.css only", () => {
    const offenders = ["app", "components", "content", "lib"]
      .flatMap((dir) => {
        try {
          return walk(join(root, dir));
        } catch {
          return [];
        }
      })
      .filter((file) => /\.(tsx?|css|mdx?)$/.test(file) && !file.endsWith(".test.ts"))
      .filter((file) => /#[0-9a-f]{3,8}\b/i.test(readFileSync(file, "utf8").replace(/&#\w+;/g, "")))
      .map((file) => relative(root, file));

    expect(offenders).toEqual([]);
  });

  // text-muted on surface-secondary is 4.43:1 in light mode (below 4.5).
  it("never puts muted text directly on surface-2", () => {
    const offenders = ["app", "components"]
      .flatMap((dir) => walk(join(root, dir)))
      .filter((file) => file.endsWith(".tsx"))
      .flatMap((file) =>
        [...readFileSync(file, "utf8").matchAll(/className=(?:"([^"]*)"|\{[^}]*?"([^"]*)")/g)]
          .map((match) => match[1] ?? match[2])
          .filter(
            (classes) =>
              /(^|\s)bg-surface-2(\s|$)/.test(classes) && /(^|\s)text-fg-muted(\s|$)/.test(classes),
          )
          .map((classes) => `${relative(root, file)}: ${classes}`),
      );
    expect(offenders).toEqual([]);
  });
});
