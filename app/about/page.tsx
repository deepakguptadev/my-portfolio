import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ContentRequired } from "@/components/content/content-required";
import { PendingPanel } from "@/components/content/pending-panel";
import { SpecRows } from "@/components/content/spec-rows";
import { ConnectedModules } from "@/components/layout/connected-modules";
import { Container } from "@/components/layout/container";
import { ModuleHeader } from "@/components/layout/module-header";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Badge, Tag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { engineering } from "@/content/engineering";
import { profile } from "@/content/profile";
import { JsonLd } from "@/components/seo/json-ld";
import { personJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description: `About Deepak Gupta — ${profile.title} based in ${profile.location}. ${profile.subtitle}.`,
  path: "/about",
});

// The full-stack picture, from the tools listed in the profile and skills.
const layers = [
  {
    label: "Interface",
    tools: ["React.js", "Next.js", "TypeScript", "Design Systems", "Accessibility"],
  },
  { label: "State & data", tools: ["Redux Toolkit", "React Query", "Apollo Client"] },
  { label: "APIs", tools: ["REST", "GraphQL", "WebSockets", "Socket.IO"] },
  {
    label: "Services",
    tools: ["Node.js", "Express.js", "NestJS", "Microservices", "Authentication & Authorization"],
  },
  { label: "Data", tools: ["PostgreSQL", "MySQL", "MongoDB"] },
  {
    label: "Cloud & delivery",
    tools: ["AWS", "Docker", "Kubernetes", "GitLab CI/CD", "New Relic"],
  },
];

export default function AboutPage() {
  const drafts = profile.story
    .filter((block) => block.draft)
    .map((block) => `Approve wording: "${block.title}"`);

  return (
    <>
      <JsonLd data={personJsonLd()} />
      <PageHeader
        index="01"
        path="/about"
        title="A full-stack engineer who thinks in systems and products"
        lede={`${profile.title} · ${profile.subtitle} · ${profile.experienceYears} years`}
      />

      <Container width="wide" className="pb-16 md:pb-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ol className="flex flex-col gap-10">
              {profile.story.map((block, index) => (
                <li key={block.id} className="grid gap-3 md:grid-cols-[64px_1fr]">
                  <span aria-hidden className="font-mono text-caption text-fg-muted md:pt-2">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="text-h3 text-fg">{block.title}</h2>
                    <p className="mt-3 max-w-[64ch] text-body-lg text-fg-secondary">{block.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <PendingPanel items={[...drafts, ...profile.pending]} />
          </div>

          <aside className="lg:col-span-4">
            <div className="flex flex-col gap-4 lg:sticky lg:top-24">
              <SpecRows
                columns={1}
                rows={[
                  { label: "Location", value: profile.location },
                  {
                    label: "Availability",
                    value: <Badge tone="success">{profile.availability}</Badge>,
                  },
                  { label: "Work mode", value: profile.workModes.join(" / ") },
                  { label: "Timezone", value: profile.timezone },
                  {
                    label: "Education",
                    value: (
                      <span>
                        {profile.education.degree} — {profile.education.field},{" "}
                        {profile.education.year}
                        <span className="mt-1 block">
                          {profile.education.institution ?? (
                            <ContentRequired inline hint="institution" />
                          )}
                        </span>
                      </span>
                    ),
                  },
                ]}
              />
              <Button asChild>
                <Link href="/contact">
                  Let&apos;s Connect <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      </Container>

      <Section width="wide" aria-labelledby="principles-title">
        <ModuleHeader
          index="01.1"
          path="/engineering#dna"
          title="Engineering philosophy"
          id="principles-title"
          actions={
            <Button asChild variant="ghost" size="sm">
              <Link href="/engineering#dna">
                Explore the DNA graph <ArrowRight aria-hidden />
              </Link>
            </Button>
          }
        />
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {engineering.principles.map((principle) => (
            <li key={principle.id} className="rounded-md border border-line bg-surface p-5">
              <h3 className="text-h4 text-fg">{principle.label}</h3>
              <p className="mt-2 text-small text-fg-secondary">{principle.summary}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section width="wide" aria-labelledby="fullstack-title">
        <ModuleHeader
          index="01.2"
          path="/skills"
          title="Full-stack, layer by layer"
          id="fullstack-title"
          lede="I own a feature through every layer: the interface, the API, the services and data behind it, and the pipeline that ships it."
        />
        <ol className="flex flex-col gap-2">
          {layers.map((layer, index) => (
            <li
              key={layer.label}
              className="grid gap-3 rounded-md border border-line bg-surface p-4 md:grid-cols-[48px_200px_1fr] md:items-center"
            >
              <span aria-hidden className="font-mono text-caption text-fg-muted">
                L{index}
              </span>
              <span className="text-body font-semibold text-fg">{layer.label}</span>
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
        <h3 className="mt-12 mb-4 eyebrow text-fg-muted">Focus areas</h3>
        <ul className="flex flex-wrap gap-2">
          {profile.focusAreas.map((area) => (
            <li key={area}>
              <Badge>{area}</Badge>
            </li>
          ))}
        </ul>
      </Section>

      <ConnectedModules
        items={[
          { label: "Experience", href: "/experience" },
          { label: "Engineering", href: "/engineering" },
          { label: "Contact", href: "/contact" },
        ]}
      />
    </>
  );
}
