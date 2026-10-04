import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ModuleHeader } from "@/components/layout/module-header";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/badge";
import { profile } from "@/content/profile";
import { skills } from "@/content/skills";

export function EcosystemPreview() {
  return (
    <Section width="wide" aria-labelledby="ecosystem-title">
      <ModuleHeader
        index="07"
        path="/skills"
        title="Technology ecosystem"
        id="ecosystem-title"
        lede={`Centered on ${profile.primaryStack.slice(0, 3).join(", ")} — no proficiency percentages, just where each tool fits.`}
        actions={
          <Button asChild variant="ghost" size="sm">
            <Link href="/skills">
              Explore the map <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />
      <dl className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((category) => (
          <div key={category.id} className="bg-surface p-5">
            <dt className="mb-3 eyebrow text-fg-muted">{category.label}</dt>
            <dd>
              <ul className="flex flex-wrap gap-1.5">
                {category.skills.map((skill) => (
                  <li key={skill}>
                    <Tag>{skill}</Tag>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
