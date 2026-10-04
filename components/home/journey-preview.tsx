import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ContentRequired } from "@/components/content/content-required";
import { ModuleHeader } from "@/components/layout/module-header";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { experience } from "@/content/experience";
import { formatPeriod } from "@/lib/format";

export function JourneyPreview() {
  // Oldest first reads left-to-right as a progression.
  const roles = [...experience].reverse();

  return (
    <Section width="wide" aria-labelledby="journey-title">
      <ModuleHeader
        index="04"
        path="/experience"
        title="Engineering journey"
        id="journey-title"
        actions={
          <Button asChild variant="ghost" size="sm">
            <Link href="/experience">
              Full journey <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />
      <ol className="grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-3">
        {roles.map((role, index) => (
          <li key={role.id} className="relative flex flex-col bg-surface p-6">
            <div className="mb-5 flex items-center gap-3">
              <span
                aria-hidden
                className={
                  index === roles.length - 1
                    ? "size-2.5 rounded-full bg-accent"
                    : "size-2.5 rounded-full border-2 border-line-strong"
                }
              />
              <span className="font-mono text-caption text-fg-muted">
                {formatPeriod(role.period)}
              </span>
            </div>
            <h3 className="text-h4 text-fg">{role.title}</h3>
            <p className="mt-1 text-small text-fg-secondary">
              {role.company ?? <ContentRequired inline hint="employer" />}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
