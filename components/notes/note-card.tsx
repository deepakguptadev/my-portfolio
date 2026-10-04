import Link from "next/link";
import { Badge, Tag } from "@/components/ui/badge";
import type { Note } from "@/lib/content";
import { formatPartialDate } from "@/lib/format";

const statusBadge = {
  published: null,
  draft: { tone: "warning", label: "Draft" },
  sample: { tone: "outline", label: "Sample" },
} as const;

export function NoteCard({ note }: { note: Note }) {
  const { meta, slug, readingMinutes } = note;
  const badge = statusBadge[meta.status];

  return (
    <article className="group relative flex h-full flex-col rounded-lg border border-line bg-surface p-6 transition-colors duration-small hover:border-line-strong">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="font-mono text-caption text-fg-muted">
          {meta.publishedAt ? (
            <time dateTime={meta.publishedAt}>
              {formatPartialDate(meta.publishedAt.slice(0, 7))}
            </time>
          ) : null}
          {meta.publishedAt ? " · " : ""}
          {readingMinutes} min read
        </p>
        {badge && <Badge tone={badge.tone}>{badge.label}</Badge>}
      </div>
      <h3 className="text-h4 text-fg">
        {/* Stretched link: the whole card is clickable, one tab stop. */}
        <Link
          href={`/notes/${slug}`}
          className="group-hover:text-accent after:absolute after:inset-0 after:rounded-lg"
        >
          {meta.title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-small text-fg-secondary">{meta.summary}</p>
      <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tags">
        {meta.tags.map((tag) => (
          <li key={tag}>
            <Tag>{tag}</Tag>
          </li>
        ))}
      </ul>
    </article>
  );
}
