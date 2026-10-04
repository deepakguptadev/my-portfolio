import { describe, expect, it } from "vitest";
import { extractHeadings, readingMinutes } from "./mdx-utils";

const source = `export const metadata = {
  title: "## Not a heading",
}

## Getting started

Some text.

### Server Components & you

\`\`\`md
## Inside a code fence
\`\`\`

## Getting started
`;

describe("extractHeadings", () => {
  it("returns h2/h3 with rehype-slug compatible ids, skipping metadata and code", () => {
    expect(extractHeadings(source)).toEqual([
      { id: "getting-started", text: "Getting started", level: 2 },
      { id: "server-components--you", text: "Server Components & you", level: 3 },
      { id: "getting-started-1", text: "Getting started", level: 2 },
    ]);
  });
});

it("handles a `};` metadata terminator and code containing braces", () => {
  const formatted = `export const metadata = {
  title: "A { tricky } title",
};

## First

\`\`\`ts
function f() {
  return 1;
}
\`\`\`

## Second
`;
  expect(extractHeadings(formatted).map((h) => h.text)).toEqual(["First", "Second"]);
});

describe("readingMinutes", () => {
  it("is at least one minute", () => {
    expect(readingMinutes("short")).toBe(1);
  });

  it("scales with word count", () => {
    expect(readingMinutes(Array.from({ length: 660 }, () => "word").join(" "))).toBe(3);
  });
});
