import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Toc } from "@/components/content/toc";
import { ConnectedModules } from "@/components/layout/connected-modules";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Badge, Tag } from "@/components/ui/badge";
import { getNote, getNotes, getNoteSlugs, isPublic } from "@/lib/content";
import { JsonLd } from "@/components/seo/json-ld";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getNoteSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const note = await getNote((await params).slug);
  if (!note) return {};
  return {
    ...pageMetadata({
      title: note.meta.title,
      description: note.meta.summary,
      path: `/notes/${note.slug}`,
      image: `/notes/${note.slug}/opengraph-image`,
    }),
    // Samples and drafts stay out of search results.
    robots: isPublic(note) ? undefined : { index: false, follow: true },
  };
}

export default async function NotePage({ params }: Props) {
  const note = await getNote((await params).slug);
  if (!note) notFound();

  const { meta, Content, headings, readingMinutes } = note;
  const all = await getNotes();
  const index = all.findIndex((n) => n.slug === note.slug);
  const [prev, next] = [all[index - 1], all[index + 1]];
  const related = all.filter(
    (n) => n.slug !== note.slug && n.meta.tags.some((tag) => meta.tags.includes(tag)),
  );

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Notes", path: "/notes" },
          { name: meta.title, path: `/notes/${note.slug}` },
        ])}
      />
      {isPublic(note) && meta.publishedAt && (
        <JsonLd
          data={articleJsonLd({
            title: meta.title,
            summary: meta.summary,
            path: `/notes/${note.slug}`,
            publishedAt: meta.publishedAt,
          })}
        />
      )}
      {/* CSS scroll-driven progress bar; no JavaScript. Hidden where unsupported. */}
      <div aria-hidden className="reading-progress" />
      <PageHeader
        index="06"
        path={`/notes/${note.slug}`}
        title={meta.title}
        lede={meta.summary}
        breadcrumb={[{ label: "Notes", href: "/notes" }, { label: meta.title }]}
      >
        <div className="flex flex-wrap items-center gap-3 font-mono text-caption text-fg-muted">
          {meta.status !== "published" && (
            <Badge tone={meta.status === "draft" ? "warning" : "outline"}>
              {meta.status === "draft" ? "Draft" : "Sample"}
            </Badge>
          )}
          {meta.publishedAt && <time dateTime={meta.publishedAt}>{meta.publishedAt}</time>}
          <span>{readingMinutes} min read</span>
        </div>
      </PageHeader>

      <Container width="wide" className="pb-16 md:pb-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <Toc headings={headings} className="sticky top-24" />
          </aside>
          <article className="min-w-0 lg:col-span-7">
            <div className="max-w-prose">
              <Content />
            </div>
            <nav
              aria-label="More notes"
              className="mt-16 grid gap-4 border-t border-line pt-8 sm:grid-cols-2"
            >
              {prev ? (
                <Link
                  href={`/notes/${prev.slug}`}
                  className="group rounded-md border border-line bg-surface p-4 hover:border-line-strong"
                >
                  <span className="flex items-center gap-1.5 font-mono text-caption text-fg-muted">
                    <ArrowLeft aria-hidden className="size-3.5" /> Previous
                  </span>
                  <span className="mt-1 block text-small font-medium text-fg group-hover:text-accent">
                    {prev.meta.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  href={`/notes/${next.slug}`}
                  className="group rounded-md border border-line bg-surface p-4 text-right hover:border-line-strong"
                >
                  <span className="flex items-center justify-end gap-1.5 font-mono text-caption text-fg-muted">
                    Next <ArrowRight aria-hidden className="size-3.5" />
                  </span>
                  <span className="mt-1 block text-small font-medium text-fg group-hover:text-accent">
                    {next.meta.title}
                  </span>
                </Link>
              )}
            </nav>
          </article>
          <aside className="flex flex-col gap-8 lg:col-span-2">
            <div>
              <h2 className="mb-3 eyebrow text-fg-muted">Tags</h2>
              <ul className="flex flex-wrap gap-1.5">
                {meta.tags.map((tag) => (
                  <li key={tag}>
                    <Tag>{tag}</Tag>
                  </li>
                ))}
              </ul>
            </div>
            {related.length > 0 && (
              <div>
                <h2 className="mb-3 eyebrow text-fg-muted">Related</h2>
                <ul className="flex flex-col gap-2 text-small">
                  {related.map((n) => (
                    <li key={n.slug}>
                      <Link
                        href={`/notes/${n.slug}`}
                        className="text-fg-secondary hover:text-accent"
                      >
                        {n.meta.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </Container>
      <ConnectedModules items={meta.related} />
    </>
  );
}
