import { ConnectedModules } from "@/components/layout/connected-modules";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { SkillFilter } from "@/components/skills/skill-filter";
import { UrlTabs } from "@/components/ui/url-tabs";
import { SystemGraph } from "@/components/viz/graph/system-graph";
import { graphs } from "@/content/graphs";
import { skills } from "@/content/skills";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Skills",
  description:
    "Deepak Gupta's technology ecosystem: React, Next.js and TypeScript at the core, with Node.js, APIs, databases, cloud, testing and AI tooling.",
  path: "/skills",
});

export default function SkillsPage() {
  const total = skills.reduce((sum, category) => sum + category.skills.length, 0);

  return (
    <>
      <PageHeader
        index="07"
        path="/skills"
        title="Technology ecosystem"
        lede={`${total} tools across ${skills.length} areas, grouped by where they fit. No proficiency percentages — the projects and architecture lab show how they're used.`}
      />
      <Container width="wide" className="pb-16 md:pb-24">
        <UrlTabs
          param="view"
          label="Skills view"
          tabs={[
            {
              value: "categories",
              label: "Categories",
              content: <SkillFilter categories={skills} />,
            },
            {
              value: "map",
              label: "Map",
              content: <SystemGraph graph={graphs["tech-ecosystem"]} aspectRatio={16 / 10} />,
            },
          ]}
        />
      </Container>
      <ConnectedModules
        items={[
          { label: "Projects", href: "/projects" },
          { label: "Architecture Lab", href: "/architecture" },
          { label: "Experience", href: "/experience" },
        ]}
      />
    </>
  );
}
