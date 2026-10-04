import { ConnectedModules } from "@/components/layout/connected-modules";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/content/data-table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UrlTabs } from "@/components/ui/url-tabs";
import { SystemGraph } from "@/components/viz/graph/system-graph";
import { architecture, type LabModule } from "@/content/architecture";
import { getGraph } from "@/content/graphs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Architecture Lab",
  description:
    "Interactive explorations of React application architecture, Next.js rendering strategies, micro frontends with Module Federation, and API design.",
  path: "/architecture",
});

const aspect: Record<string, number> = {
  react: 4 / 3.6,
  nextjs: 16 / 10,
  "micro-frontends": 16 / 10,
  api: 4 / 3.4,
};

function ModulePanel({ module }: { module: LabModule }) {
  const graph = getGraph(module.graphId)!;
  return (
    <div className="flex flex-col gap-12">
      <p className="max-w-[68ch] text-body-lg text-fg-secondary">{module.intro}</p>

      <SystemGraph graph={graph} aspectRatio={aspect[module.id]} showTrace={Boolean(graph.trace)} />

      {module.id === "nextjs" && (
        <section aria-labelledby="matrix-title">
          <h2 id="matrix-title" className="mb-4 text-h4 text-fg">
            Rendering strategies compared
          </h2>
          <DataTable caption="Rendering strategies compared" {...architecture.renderingMatrix} />
        </section>
      )}

      <section aria-labelledby={`${module.id}-concepts`}>
        <h2 id={`${module.id}-concepts`} className="mb-2 text-h4 text-fg">
          Key concepts
        </h2>
        <Accordion type="multiple" className="border-t border-line">
          {module.concepts.map((concept) => (
            <AccordionItem key={concept.title} value={concept.title}>
              <AccordionTrigger>{concept.title}</AccordionTrigger>
              <AccordionContent>
                <p className="max-w-[68ch]">{concept.body}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {module.id === "micro-frontends" && (
        <section aria-labelledby="repos-title">
          <h2 id="repos-title" className="mb-4 text-h4 text-fg">
            Monorepo vs independent repositories
          </h2>
          <DataTable
            caption="Monorepo vs independent repositories"
            {...architecture.repoStrategies}
          />
        </section>
      )}
    </div>
  );
}

export default function ArchitecturePage() {
  return (
    <>
      <PageHeader
        index="04"
        path="/architecture"
        title="Architecture Lab"
        lede="How I structure frontend systems, explained interactively. Pick a module, then hover, select or use the arrow keys to explore each diagram."
      />
      <Container width="wide" className="pb-16 md:pb-24">
        <UrlTabs
          param="module"
          label="Architecture modules"
          tabs={architecture.modules.map((module) => ({
            value: module.id,
            label: module.label,
            content: <ModulePanel module={module} />,
          }))}
        />
      </Container>
      <ConnectedModules
        items={[
          {
            label: "Case study: Quality Inspection",
            href: "/projects/quality-inspection-platform",
          },
          { label: "Performance Lab", href: "/engineering#performance" },
          { label: "Engineering Notes", href: "/notes" },
        ]}
      />
    </>
  );
}
