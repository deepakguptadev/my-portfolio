import { ArrowUpRight, Mail } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { CopyEmailButton } from "@/components/content/copy-email-button";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ResumeLink } from "@/components/layout/resume-link";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
                title="The contact form is being set up"
                action={
                  <Button asChild>
                    <a href={profileLinks.emailHref}>
                      <Mail aria-hidden /> Email me directly
                    </a>
                  </Button>
                }
              >
                In the meantime, email is the fastest way to reach me.
              </Alert>
            )}
          </div>
          <aside className="lg:col-span-4">
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
              <ResumeLink variant="secondary" className="justify-start" />
              <p className="mt-2 font-mono text-caption text-fg-muted">{profileLinks.email}</p>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
