import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SystemGraph } from "@/components/viz/graph/system-graph";
import { graphs } from "@/content/graphs";
import { profile } from "@/content/profile";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="pt-12 pb-16 md:pt-20 md:pb-24 xl:pt-24">
      <Container width="wide" className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <p className="mb-6 eyebrow text-accent">{profile.title}</p>
          <h1 id="hero-title" className="max-w-[16ch] text-display text-fg">
            {profile.headline}
          </h1>
          <p className="mt-6 max-w-[52ch] text-body-lg text-fg-secondary">{profile.intro}</p>
          <div className="mt-8 flex flex-col gap-3 xs:flex-row">
            <Button asChild size="lg">
              <Link href="/projects">
                Explore Engineering <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/resume">View Resume</Link>
            </Button>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Highlights">
            {profile.heroBadges.map((badge) => (
              <li key={badge}>
                <Badge>{badge}</Badge>
              </li>
            ))}
            <li>
              <Badge tone="success">{profile.availability}</Badge>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-6">
          <div className="rounded-lg border border-line bg-surface p-4 shadow-sm sm:p-5">
            <p className="mb-4 eyebrow text-fg-muted">System overview</p>
            <SystemGraph graph={graphs.hero} aspectRatio={4 / 3.3} inspector="below" />
          </div>
        </div>
      </Container>
    </section>
  );
}
