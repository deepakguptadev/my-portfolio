import GithubSlugger from "github-slugger";

const WORDS_PER_MINUTE = 220;

export type Heading = { id: string; text: string; level: 2 | 3 };

/** End index of the object literal starting at `start` ("{"), skipping strings. */
function matchBrace(source: string, start: number) {
  let depth = 0;
  let quote: string | null = null;
  for (let i = start; i < source.length; i++) {
    const char = source[i];
    if (quote) {
      if (char === "\\") i++;
      else if (char === quote) quote = null;
    } else if (char === '"' || char === "'" || char === "`") quote = char;
    else if (char === "{") depth++;
    else if (char === "}" && --depth === 0) return i;
  }
  return source.length;
}

/** Body text without the `export const metadata = {...}` block or JSX tags. */
function bodyText(source: string) {
  let text = source;
  const exportAt = text.indexOf("export const metadata");
  if (exportAt !== -1) {
    const end = matchBrace(text, text.indexOf("{", exportAt));
    text = text.slice(0, exportAt) + text.slice(end + 1).replace(/^;?/, "");
  }
  return text.replace(/<[^>]+>/g, " ");
}

/** Mirrors rehype-slug (github-slugger) so TOC links match heading ids. */
export function extractHeadings(source: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inFence = false;
  for (const line of bodyText(source).split("\n")) {
    if (line.trimStart().startsWith("```")) inFence = !inFence;
    if (inFence) continue;
    const match = /^(##|###)\s+(.+?)\s*#*$/.exec(line);
    if (!match) continue;
    const text = match[2].replace(/[`*_]/g, "");
    headings.push({ id: slugger.slug(text), text, level: match[1].length as 2 | 3 });
  }
  return headings;
}

export function readingMinutes(source: string) {
  const words = bodyText(source).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
