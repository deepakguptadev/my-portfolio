import "server-only";

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { MDXContent } from "mdx/types";
import { cache } from "react";
import { z } from "zod";
import { extractHeadings, readingMinutes, type Heading } from "./mdx-utils";
import {
  noteMetaSchema,
  projectMetaSchema,
  type NoteMeta,
  type ProjectMeta,
} from "./schemas/content";

const CONTENT_DIR = join(process.cwd(), "content");

export type { Heading };

type Document<Meta> = {
  slug: string;
  meta: Meta;
  headings: Heading[];
  readingMinutes: number;
};

export type Project = Document<ProjectMeta>;
export type Note = Document<NoteMeta>;

async function listSlugs(collection: string) {
  const files = await readdir(join(CONTENT_DIR, collection));
  return files.filter((file) => file.endsWith(".mdx")).map((file) => file.replace(/\.mdx$/, ""));
}

async function loadDocument<S extends z.ZodType>(collection: string, slug: string, schema: S) {
  const source = await readFile(join(CONTENT_DIR, collection, `${slug}.mdx`), "utf8");
  // Literal template keeps the import statically analyzable for the bundler.
  const mod = (await import(`@/content/${collection}/${slug}.mdx`)) as {
    default: MDXContent;
    metadata?: unknown;
  };
  const parsed = schema.safeParse(mod.metadata);
  if (!parsed.success) {
    throw new Error(
      `Invalid metadata in content/${collection}/${slug}.mdx:\n${z.prettifyError(parsed.error)}`,
    );
  }
  return {
    slug,
    meta: parsed.data as z.output<S>,
    headings: extractHeadings(source),
    readingMinutes: readingMinutes(source),
    Content: mod.default,
  };
}

/** List views only need metadata, not the compiled component. */
function withoutContent<T extends { Content: unknown }>({ Content, ...doc }: T) {
  void Content;
  return doc;
}

// ── Projects ─────────────────────────────────────────────────────────
export const getProject = cache(async (slug: string) => {
  if (!(await listSlugs("projects")).includes(slug)) return null;
  return loadDocument("projects", slug, projectMetaSchema);
});

export const getProjects = cache(async (): Promise<Project[]> => {
  const slugs = await listSlugs("projects");
  const docs = await Promise.all(
    slugs.map((slug) => loadDocument("projects", slug, projectMetaSchema)),
  );
  return docs.map(withoutContent).sort((a, b) => a.meta.order - b.meta.order);
});

export const getProjectSlugs = () => listSlugs("projects");

/** The client name only appears once Deepak has approved it. */
export function displayClient(meta: ProjectMeta) {
  return meta.client.nameApproved ? meta.client.name : meta.client.anonymized;
}

// ── Notes ────────────────────────────────────────────────────────────
export const getNote = cache(async (slug: string) => {
  if (!(await listSlugs("notes")).includes(slug)) return null;
  return loadDocument("notes", slug, noteMetaSchema);
});

export const getNotes = cache(async (): Promise<Note[]> => {
  const slugs = await listSlugs("notes");
  const docs = await Promise.all(slugs.map((slug) => loadDocument("notes", slug, noteMetaSchema)));
  return docs.map(withoutContent).sort((a, b) => {
    // Published (newest first), then drafts, then samples; alphabetical within.
    const rank = { published: 0, draft: 1, sample: 2 } as const;
    return (
      rank[a.meta.status] - rank[b.meta.status] ||
      (b.meta.publishedAt ?? "").localeCompare(a.meta.publishedAt ?? "") ||
      a.meta.title.localeCompare(b.meta.title)
    );
  });
});

export const getNoteSlugs = () => listSlugs("notes");

/** Notes that may appear in sitemaps, feeds and structured data. */
export function isPublic(note: Pick<Note, "meta">) {
  return note.meta.status === "published";
}
