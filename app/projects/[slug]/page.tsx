import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentRequired } from "@/components/content/content-required";
import { PendingPanel } from "@/components/content/pending-panel";
import { SpecRows } from "@/components/content/spec-rows";
import { Toc } from "@/components/content/toc";
import { ConnectedModules } from "@/components/layout/connected-modules";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { SystemGraph } from "@/components/viz/graph/system-graph";
import { WorkflowDiagram } from "@/components/viz/workflow-diagram";
import { getGraph } from "@/content/graphs";
import { displayClient, getProject, getProjectSlugs } from "@/lib/content";
import { formatPeriod } from "@/lib/format";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getProjectSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject((await params).slug);
  if (!project) return {};
  return pageMetadata({
    title: project.meta.title,
    description: project.meta.summary,
    path: `/projects/${project.slug}`,
    image: `/projects/${project.slug}/opengraph-image`,
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const project = await getProject((await params).slug);
  if (!project) notFound();

  const { meta, Content, headings } = project;
  const graph = meta.architectureGraph ? getGraph(meta.architectureGraph) : undefined;

  // Sections the MDX places with <ProjectWorkflow /> etc.
  const sections = {
    ProjectWorkflow: () => (
      <WorkflowDiagram
        label={`${meta.shortTitle} workflow`}
        steps={meta.workflow}
        className="my-6"
      />
    ),
    ProjectArchitecture: () =>
      graph ? (
        <div className="my-6">
          <SystemGraph graph={graph} aspectRatio={4 / 3.2} inspector="below" showTrace />
        </div>
      ) : (
        <ContentRequired hint="Architecture diagram" />
      ),
    ProjectFeatures: () => (
      <dl className="my-6 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
        {meta.features.map((feature) => (
          <div key={feature.group} className="bg-surface p-4">
            <dt className="text-small font-medium text-fg">{feature.group}</dt>
            <dd className="mt-1 text-small text-fg-secondary">{feature.items.join(" · ")}</dd>
          </div>
        ))}
      </dl>
    ),
  };

  const spec = [
    { label: "Client", value: displayClient(meta) },
    { label: "Industry", value: meta.industry },
    {
      label: "Period",
      value: meta.period ? formatPeriod(meta.period) : <ContentRequired inline />,
    },
    { label: "Role", value: meta.role ?? <ContentRequired inline /> },
    { label: "Frontend", value: meta.stack.frontend.join(", ") },
    { label: "Backend", value: meta.stack.backend.join(", ") },
    { label: "Infrastructure", value: meta.stack.infrastructure.join(", ") },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Projects", path: "/projects" },
          { name: meta.title, path: `/projects/${project.slug}` },
        ])}
      />
      <PageHeader
        index="03"
        path={`/projects/${project.slug}`}
        title={meta.title}
        lede={meta.summary}
        breadcrumb={[{ label: "Projects", href: "/projects" }, { label: meta.shortTitle }]}
      />
      <Container width="wide" className="pb-16 md:pb-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <aside className="hidden xl:col-span-2 xl:block">
            <Toc headings={headings} className="sticky top-24" />
          </aside>

          <article className="min-w-0 lg:col-span-8 xl:col-span-7">
            <div className="mb-10 grid gap-4 sm:grid-cols-2">
              {(["problem", "solution"] as const).map((key) => (
                <div key={key} className="rounded-md border border-line bg-surface p-5">
                  <h2 className="mb-2 eyebrow text-fg-muted">{key}</h2>
                  <p className="text-body text-fg-secondary">{meta[key]}</p>
                </div>
              ))}
            </div>
            <details className="mb-10 rounded-md border border-line bg-surface p-4 xl:hidden">
              <summary className="cursor-pointer text-small font-medium text-fg">
                On this page
              </summary>
              <ul className="mt-3 flex flex-col gap-2 text-small">
                {headings.map((heading) => (
                  <li key={heading.id} className={heading.level === 3 ? "pl-4" : undefined}>
                    <a href={`#${heading.id}`} className="text-fg-secondary hover:text-fg">
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
            <Content components={sections} />
            <PendingPanel items={meta.pending} />
          </article>

          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="flex flex-col gap-4 lg:sticky lg:top-24">
              <SpecRows rows={spec} columns={1} />
              <Button asChild>
                <Link href="/contact?type=product-development">
                  Discuss a similar problem <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      </Container>
      <ConnectedModules items={meta.related} />
    </>
  );
}
