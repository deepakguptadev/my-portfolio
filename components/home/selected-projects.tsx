import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ModuleHeader } from "@/components/layout/module-header";
import { Section } from "@/components/layout/section";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/lib/content";

export async function SelectedProjects() {
  const projects = (await getProjects()).filter((project) => project.meta.featured);
  if (projects.length === 0) return null;

  return (
    <Section width="wide" aria-labelledby="projects-title">
      <ModuleHeader
        index="03"
        path="/projects"
        title="Selected projects"
        id="projects-title"
        lede="Projects as engineering systems: the problem, the workflow users follow, and the architecture underneath."
        actions={
          <Button asChild variant="ghost" size="sm">
            <Link href="/projects">
              All projects <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />
      <div className="flex flex-col gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
}
