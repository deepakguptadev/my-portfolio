import { Gauge } from "lucide-react";
import { ConnectedModules } from "@/components/layout/connected-modules";
import { ModuleHeader } from "@/components/layout/module-header";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Tag } from "@/components/ui/badge";
import { StatePanel } from "@/components/ui/feedback";
import { SystemGraph } from "@/components/viz/graph/system-graph";
import { engineering } from "@/content/engineering";
import { graphs } from "@/content/graphs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Engineering",
  description:
    "How Deepak Gupta engineers: core principles, a measured performance process, responsible AI-assisted development, and layered quality practice.",
  path: "/engineering",
});

const sections = [
  { id: "dna", label: "Engineering DNA" },
  { id: "performance", label: "Performance Lab" },
  { id: "ai", label: "AI + Engineering" },
  { id: "quality", label: "Quality" },
];

export default function EngineeringPage() {
  const { performance, ai, quality } = engineering;
  const topicGroups = [...new Set(performance.topics.map((topic) => topic.category))];

  return (
    <>
      <PageHeader
        index="05"
        path="/engineering"
        title="How I engineer"
        lede="Principles, process and practice — the judgment behind the code."
      >
        <nav aria-label="Sections" className="mt-2">
          <ul className="flex flex-wrap gap-2">
            {sections.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-surface px-4 text-small text-fg-secondary transition-colors duration-micro hover:border-line-strong hover:text-fg"
                >
                  <span aria-hidden className="font-mono text-caption text-fg-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <Section width="wide" id="dna" aria-labelledby="dna-heading" className="scroll-mt-16">
        <ModuleHeader
          index="05.1"
          path="#dna"
          title="Engineering DNA"
          id="dna-heading"
          lede="Five principles and how they reinforce each other. Select a principle for what it looks like in practice."
        />
        <SystemGraph graph={graphs.dna} aspectRatio={16 / 10} routing="straight" arrows={false} />
      </Section>

      <Section
        width="wide"
        id="performance"
        aria-labelledby="perf-heading"
        className="scroll-mt-16"
      >
        <ModuleHeader index="05.2" path="#performance" title="Performance Lab" id="perf-heading" />
        <blockquote className="mb-12 max-w-[30ch] border-l-2 border-accent pl-5 text-h3 text-fg">
          {performance.philosophy}
        </blockquote>

        <h3 className="mb-4 eyebrow text-fg-muted">Process</h3>
        <ol className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {performance.process.map((step, index) => (
            <li key={step.id} className="flex flex-col bg-surface p-5">
              <span className="font-mono text-caption text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mt-2 text-h4 text-fg">{step.label}</span>
              <span className="mt-2 text-small text-fg-secondary">{step.question}</span>
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${step.label} tools`}>
                {step.tools.map((tool) => (
                  <li key={tool}>
                    <Tag>{tool}</Tag>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        {topicGroups.map((group) => (
          <div key={group} className="mt-12">
            <h3 className="mb-4 eyebrow text-fg-muted">{group}</h3>
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {performance.topics
                .filter((topic) => topic.category === group)
                .map((topic) => (
                  <li key={topic.id} className="rounded-md border border-line bg-surface p-5">
                    <p className="text-body font-semibold text-fg">{topic.label}</p>
                    <dl className="mt-3 flex flex-col gap-3 text-small">
                      <div>
                        <dt className="eyebrow text-fg-muted">Technique</dt>
                        <dd className="mt-1 text-fg-secondary">{topic.technique}</dd>
                      </div>
                      <div>
                        <dt className="eyebrow text-fg-muted">When</dt>
                        <dd className="mt-1 text-fg-secondary">{topic.whenToUse}</dd>
                      </div>
                      <div>
                        <dt className="eyebrow text-fg-muted">Pitfall</dt>
                        <dd className="mt-1 text-fg-secondary">{topic.pitfall}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
            </ul>
          </div>
        ))}

        <div className="mt-12">
          <h3 className="mb-4 eyebrow text-fg-muted">This site&apos;s measurements</h3>
          {performance.measurements.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-3">
              {performance.measurements.map((m) => (
                <li
                  key={`${m.metric}-${m.page}`}
                  className="rounded-md border border-line bg-surface p-5"
                >
                  <p className="eyebrow text-fg-muted">{m.metric}</p>
                  <p className="mt-2 text-h3 text-fg">{m.value}</p>
                  <p className="mt-2 font-mono text-caption text-fg-muted">
                    {m.page} · {m.tool} · <time dateTime={m.measuredAt}>{m.measuredAt}</time>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <StatePanel
              icon={Gauge}
              title="Measurements pending"
              description="Real Lighthouse CI results for this site will be published here after launch. No numbers are shown until they've actually been measured."
            />
          )}
        </div>
      </Section>

      <Section width="wide" id="ai" aria-labelledby="ai-heading" className="scroll-mt-16">
        <ModuleHeader index="05.3" path="#ai" title="AI + Engineering" id="ai-heading" />
        <blockquote className="mb-10 max-w-[48ch] border-l-2 border-accent pl-5 text-body-lg text-fg">
          {ai.positioning}
        </blockquote>
        <ul className="mb-10 flex flex-wrap gap-2" aria-label="Tools">
          {ai.tools.map((tool) => (
            <li key={tool}>
              <Tag className="h-7 px-2.5 text-small">{tool}</Tag>
            </li>
          ))}
        </ul>
        <div className="overflow-hidden rounded-md border border-line">
          <table className="w-full text-left text-small">
            <caption className="sr-only">AI use cases and the human checkpoint for each</caption>
            <thead>
              <tr className="border-b border-line bg-surface">
                <th scope="col" className="p-4 font-medium text-fg">
                  Use case
                </th>
                <th scope="col" className="p-4 font-medium text-fg">
                  Human checkpoint
                </th>
              </tr>
            </thead>
            <tbody>
              {ai.useCases.map((useCase) => (
                <tr
                  key={useCase.label}
                  className="border-b border-line bg-canvas-alt last:border-b-0"
                >
                  <th scope="row" className="p-4 align-top font-medium text-fg">
                    {useCase.label}
                  </th>
                  <td className="p-4 align-top text-fg-secondary">{useCase.humanCheckpoint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section width="wide" id="quality" aria-labelledby="quality-heading" className="scroll-mt-16">
        <ModuleHeader
          index="05.4"
          path="#quality"
          title="Quality"
          id="quality-heading"
          lede="Layered checks, from the type system to real-browser accessibility runs."
        />
        <ol className="flex flex-col gap-2">
          {quality.layers.map((layer) => (
            <li
              key={layer.label}
              className="grid gap-3 rounded-md border border-line bg-surface p-5 md:grid-cols-[200px_1fr_auto] md:items-center"
            >
              <span className="text-body font-semibold text-fg">{layer.label}</span>
              <span className="text-small text-fg-secondary">{layer.purpose}</span>
              <ul className="flex flex-wrap gap-1.5" aria-label={`${layer.label} tools`}>
                {layer.tools.map((tool) => (
                  <li key={tool}>
                    <Tag>{tool}</Tag>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <ConnectedModules
        items={[
          { label: "Architecture Lab", href: "/architecture" },
          { label: "Skills", href: "/skills" },
          { label: "Engineering Notes", href: "/notes" },
        ]}
      />
    </>
  );
}
