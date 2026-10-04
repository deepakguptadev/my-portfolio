import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ModuleHeader } from "@/components/layout/module-header";
import { Section } from "@/components/layout/section";
import { Tag } from "@/components/ui/badge";
import { engineering } from "@/content/engineering";

export function Practice() {
  const { performance, ai } = engineering;

  return (
    <Section width="wide" aria-labelledby="practice-title">
      <ModuleHeader
        index="06"
        path="/engineering"
        title="Engineering practice"
        id="practice-title"
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <article className="flex flex-col rounded-lg border border-line bg-surface p-6 md:p-8">
          <p className="eyebrow text-fg-muted">Performance lab</p>
          <h3 className="mt-3 text-h3 text-fg">{performance.philosophy}</h3>
          <ol
            className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3"
            aria-label="Optimization process"
          >
            {performance.process.map((step, index) => (
              <li
                key={step.id}
                className="flex items-center gap-2 rounded-sm border border-line bg-canvas-alt px-3 py-2 text-small font-medium text-fg"
              >
                <span aria-hidden className="font-mono text-caption text-fg-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {step.label}
              </li>
            ))}
          </ol>
          <Link
            href="/engineering#performance"
            className="mt-auto flex items-center gap-1.5 pt-6 text-small font-medium text-accent hover:text-accent-hover"
          >
            Inside the performance lab <ArrowRight aria-hidden className="size-4" />
          </Link>
        </article>

        <article className="flex flex-col rounded-lg border border-line bg-surface p-6 md:p-8">
          <p className="eyebrow text-fg-muted">AI + engineering</p>
          <blockquote className="mt-3 border-l-2 border-accent pl-4 text-body-lg text-fg">
            {ai.positioning}
          </blockquote>
          <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="AI tools">
            {ai.tools.map((tool) => (
              <li key={tool}>
                <Tag>{tool}</Tag>
              </li>
            ))}
          </ul>
          <Link
            href="/engineering#ai"
            className="mt-auto flex items-center gap-1.5 pt-6 text-small font-medium text-accent hover:text-accent-hover"
          >
            How I use AI responsibly <ArrowRight aria-hidden className="size-4" />
          </Link>
        </article>
      </div>
    </Section>
  );
}
