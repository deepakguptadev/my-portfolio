import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ContentRequired } from "@/components/content/content-required";
import { Tag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SystemGraph } from "@/components/viz/graph/system-graph";
import { WorkflowDiagram } from "@/components/viz/workflow-diagram";
import { getGraph } from "@/content/graphs";
import { displayClient, type Project } from "@/lib/content";
import { formatPeriod } from "@/lib/format";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  headingLevel?: 2 | 3;
  className?: string;
};

/** A project presented as a small engineering system: problem, solution, workflow, architecture. */
export function ProjectCard({ project, headingLevel = 3, className }: ProjectCardProps) {
  const { meta, slug } = project;
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const Subheading = headingLevel === 2 ? "h3" : "h4";
  const graph = meta.architectureGraph ? getGraph(meta.architectureGraph) : undefined;
  const stack = [...meta.stack.frontend, ...meta.stack.backend, ...meta.stack.infrastructure];

  return (
    <article
      aria-labelledby={`project-${slug}`}
      className={cn(
        "rounded-lg border border-line bg-surface p-6 transition-colors duration-small hover:border-line-strong md:p-8",
        className,
      )}
    >
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-2 eyebrow text-fg-muted">
            {meta.industry} · {displayClient(meta)}
          </p>
          <Heading id={`project-${slug}`} className="text-h3 text-fg">
            {meta.title}
          </Heading>
        </div>
        <dl className="flex shrink-0 flex-wrap gap-x-6 gap-y-1 font-mono text-caption text-fg-muted md:text-right">
          {meta.period && (
            <div>
              <dt className="sr-only">Period</dt>
              <dd>{formatPeriod(meta.period)}</dd>
            </div>
          )}
          <div>
            <dt className="sr-only">Role</dt>
            <dd>{meta.role ?? <ContentRequired inline hint="role" />}</dd>
          </div>
        </dl>
      </header>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <Subheading className="mb-2 eyebrow text-fg-muted">Problem</Subheading>
          <p className="text-body text-fg-secondary">{meta.problem}</p>
        </div>
        <div>
          <Subheading className="mb-2 eyebrow text-fg-muted">Solution</Subheading>
          <p className="text-body text-fg-secondary">{meta.solution}</p>
        </div>
      </div>

      <Tabs defaultValue="workflow" className="mt-8">
        <TabsList aria-label={`${meta.shortTitle} views`}>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          {graph && <TabsTrigger value="architecture">Architecture</TabsTrigger>}
          <TabsTrigger value="features">Key features</TabsTrigger>
        </TabsList>
        <TabsContent value="workflow">
          <WorkflowDiagram label={`${meta.shortTitle} workflow`} steps={meta.workflow} />
        </TabsContent>
        {graph && (
          <TabsContent value="architecture">
            <SystemGraph graph={graph} aspectRatio={2} inspector="side" />
          </TabsContent>
        )}
        <TabsContent value="features">
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {meta.features.map((feature) => (
              <div key={feature.group}>
                <dt className="text-small font-medium text-fg">{feature.group}</dt>
                <dd className="mt-1 text-small text-fg-secondary">{feature.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </TabsContent>
      </Tabs>

      <footer className="mt-8 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
        <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
          {stack.map((tech) => (
            <li key={tech}>
              <Tag>{tech}</Tag>
            </li>
          ))}
        </ul>
        <Button asChild variant="secondary" className="shrink-0">
          <Link href={`/projects/${slug}`}>
            Open case study <ArrowRight aria-hidden />
          </Link>
        </Button>
      </footer>
    </article>
  );
}
