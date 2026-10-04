import { ArrowUpRight, Mail } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ResumeLink } from "@/components/layout/resume-link";
import { Button } from "@/components/ui/button";
import { profileLinks } from "@/lib/profile-links";

export function ContactCta() {
  return (
    <section aria-labelledby="contact-cta-title" className="pb-16 md:pb-24 xl:pb-30">
      <Container width="wide">
        <div
          data-spotlight="grid"
          className="rounded-xl border border-line bg-surface bg-dot-grid px-6 py-12 md:px-12 md:py-16"
        >
          <p className="mb-4 eyebrow text-fg-muted">09 — /contact</p>
          <h2 id="contact-cta-title" className="max-w-[22ch] text-h1 text-fg">
            Have a product, problem, or idea worth building?
          </h2>
          <p className="mt-5 max-w-[56ch] text-body-lg text-fg-secondary">
            I&apos;m always interested in thoughtful engineering problems, scalable products, and
            opportunities where technology can create meaningful impact.
          </p>
          <div className="mt-8 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
            <Button asChild size="lg">
              <a href={profileLinks.emailHref}>
                <Mail aria-hidden /> Email Me
              </a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href={profileLinks.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn <ArrowUpRight aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href={profileLinks.github} target="_blank" rel="noopener noreferrer">
                GitHub <ArrowUpRight aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </Button>
            <ResumeLink size="lg" variant="ghost" />
          </div>
        </div>
      </Container>
    </section>
  );
}
