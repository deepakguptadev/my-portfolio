import { ArrowUpRight, Mail } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { CopyEmailButton } from "@/components/content/copy-email-button";
import { SpecRows } from "@/components/content/spec-rows";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ResumeLink } from "@/components/layout/resume-link";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { profile } from "@/content/profile";
import { getEmailConfig } from "@/lib/email/sender";
import { profileLinks } from "@/lib/profile-links";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact Deepak Gupta about full-time roles, freelance and consulting work, product development or a technical discussion.",
  path: "/contact",
});

export default function ContactPage() {
  const formEnabled = getEmailConfig() !== null;

  return (
    <>
      <PageHeader
        index="09"
        path="/contact"
        title="Have a product, problem, or idea worth building?"
        lede="I'm always interested in thoughtful engineering problems, scalable products, and opportunities where technology can create meaningful impact."
      />
      <Container width="wide" className="pb-16 md:pb-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {formEnabled ? (
              <ContactForm />
            ) : (
              <Alert
                tone="info"
                title="Email is the quickest way to reach me"
                action={
                  <Button asChild>
                    <a href={profileLinks.emailHref}>
                      <Mail aria-hidden /> Email Me
                    </a>
                  </Button>
                }
              >
                Tell me about the role, project or idea you have in mind.
              </Alert>
            )}
          </div>
          <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
            <div className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-6">
              <h2 className="mb-1 eyebrow text-fg-muted">Direct</h2>
              <Button asChild variant="secondary" className="justify-start">
                <a href={profileLinks.emailHref}>
                  <Mail aria-hidden /> Email Me
                </a>
              </Button>
              <CopyEmailButton className="justify-start" />
              <Button asChild variant="secondary" className="justify-start">
                <a href={profileLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn <ArrowUpRight aria-hidden />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </Button>
              <Button asChild variant="secondary" className="justify-start">
                <a href={profileLinks.github} target="_blank" rel="noopener noreferrer">
                  GitHub <ArrowUpRight aria-hidden />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </Button>
              <ResumeLink variant="secondary" className="justify-start" />
              <p className="mt-2 font-mono text-caption text-fg-muted">{profileLinks.email}</p>
            </div>
            <SpecRows
              columns={1}
              rows={[
                {
                  label: "Availability",
                  value: <Badge tone="success">{profile.availability}</Badge>,
                },
                { label: "Work mode", value: profile.workModes.join(" / ") },
                { label: "Timezone", value: profile.timezone },
                { label: "Location", value: profile.location },
              ]}
            />
          </aside>
        </div>
      </Container>
    </>
  );
}
