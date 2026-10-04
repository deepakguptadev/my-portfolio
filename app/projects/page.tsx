import { Container } from "@/components/layout/container";
import { ConnectedModules } from "@/components/layout/connected-modules";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectFilter } from "@/components/projects/project-filter";
import { getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "Projects by Deepak Gupta presented as engineering systems: problem, user workflow, architecture and technology.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const projects = await getProjects();
  const stackOf = (p: (typeof projects)[number]) => [
    ...p.meta.stack.frontend,
    ...p.meta.stack.backend,
    ...p.meta.stack.infrastructure,
  ];
  const techs = [...new Set(projects.flatMap(stackOf))].sort((a, b) => a.localeCompare(b));

  return (
    <>
      <PageHeader
        index="03"
        path="/projects"
        title="Projects"
        lede="Each project as a small engineering system — the problem, the workflow users follow, and the architecture underneath. More case studies are being written up."
      />
      <Container width="wide" className="pb-16 md:pb-24">
        <ProjectFilter
          techs={techs}
          items={projects.map((project) => ({
            slug: project.slug,
            techs: stackOf(project),
            card: <ProjectCard project={project} headingLevel={2} />,
          }))}
        />
      </Container>
      <ConnectedModules
        items={[
          { label: "Architecture Lab", href: "/architecture" },
          { label: "Engineering Journey", href: "/experience" },
          { label: "Skills", href: "/skills" },
        ]}
      />
    </>
  );
}
