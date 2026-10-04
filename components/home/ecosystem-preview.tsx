import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SkillGrid } from "@/components/content/skill-grid";
import { ModuleHeader } from "@/components/layout/module-header";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { profile } from "@/content/profile";

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
      <SkillGrid />
    </Section>
  );
}
