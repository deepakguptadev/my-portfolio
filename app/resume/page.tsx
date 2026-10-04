import { ArrowRight, ArrowUpRight, GraduationCap, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { ContentRequired } from "@/components/content/content-required";
import { SkillGrid } from "@/components/content/skill-grid";
import { SpecRows } from "@/components/content/spec-rows";
import { ConnectedModules } from "@/components/layout/connected-modules";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ResumeLink } from "@/components/layout/resume-link";
import { ExperienceTimeline } from "@/components/resume/experience-timeline";
import { Highlights } from "@/components/resume/highlights";
import { Badge, Tag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UrlTabs } from "@/components/ui/url-tabs";
import { profile } from "@/content/profile";
import { displayClient, getProjects } from "@/lib/content";
import { formatPeriod } from "@/lib/format";
import { profileLinks } from "@/lib/profile-links";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Resume",
  description: `Resume of ${profile.name}, ${profile.title} — experience, skills, projects and education.`,
  path: "/resume",
});

const contactLinkClasses =
  "inline-flex min-h-6 items-center gap-1.5 transition-colors duration-micro hover:text-fg";

/** Visible only when printing, where every tab panel is shown in sequence. */
function PrintHeading({ children }: { children: string }) {
  return <h2 className="hidden text-h4 text-fg print:mt-6 print:mb-3 print:block">{children}</h2>;
}

function ContactStrip() {
  return (
    <>
      <ul
        aria-label="Contact details"
        className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-small text-fg-secondary print:hidden"
      >
        <li>
          <Badge tone="success">{profile.availability}</Badge>
        </li>
        <li className="inline-flex items-center gap-1.5">
          <MapPin aria-hidden className="size-4 text-fg-muted" />
          {profile.location}
        </li>
        <li>
          <a href={profileLinks.emailHref} className={contactLinkClasses}>
            <Mail aria-hidden className="size-4 text-fg-muted" />
            {profileLinks.email}
          </a>
        </li>
        {[
          { label: "LinkedIn", href: profileLinks.linkedin },
          { label: "GitHub", href: profileLinks.github },
        ].map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={contactLinkClasses}
            >
              {link.label} <ArrowUpRight aria-hidden className="size-3.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
      {/* Printed pages can't follow links, so print spells the addresses out. */}
      <p className="hidden text-small text-fg-secondary print:block">
        {profileLinks.email} · {profileLinks.linkedin} · {profileLinks.github} · {profile.location}{" "}
        · {profile.availability}
      </p>
    </>
  );
}

export default async function ResumePage() {
  const projects = await getProjects();

  const overview = (
    <div className="flex flex-col gap-8">
      <PrintHeading>Overview</PrintHeading>
      <p className="max-w-[68ch] text-body-lg text-fg-secondary">{profile.intro}</p>
      <Highlights />
      <SpecRows
        rows={[
          { label: "Primary stack", value: profile.primaryStack.join(", ") },
          { label: "Backend", value: profile.backendStack.join(", ") },
          { label: "Work mode", value: profile.workModes.join(" / ") },
        ]}
      />
      <div>
        <h3 className="mb-3 eyebrow text-fg-muted">Focus areas</h3>
        <ul className="flex flex-wrap gap-2">
          {profile.focusAreas.map((area) => (
            <li key={area}>
              <Badge>{area}</Badge>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const experiencePanel = (
    <div>
      <PrintHeading>Experience</PrintHeading>
      <ExperienceTimeline />
      <p className="mt-6 text-small">
        <Link href="/experience" className="text-accent hover:text-accent-hover print:hidden">
          Full engineering journey →
        </Link>
      </p>
    </div>
  );

  const skillsPanel = (
    <div>
      <PrintHeading>Skills</PrintHeading>
      <SkillGrid />
    </div>
  );

  const projectsPanel = (
    <div>
      <PrintHeading>Projects</PrintHeading>
      <ul className="flex flex-col gap-4">
        {projects.map(({ slug, meta }) => (
          <li key={slug} className="rounded-lg border border-line bg-surface p-5 md:p-6">
            <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-4">
              <h3 className="text-h4 text-fg">
                <Link href={`/projects/${slug}`} className="hover:text-accent">
                  {meta.title}
                </Link>
              </h3>
              {meta.period && (
                <span className="font-mono text-caption text-fg-muted">
                  {formatPeriod(meta.period)}
                </span>
              )}
            </div>
            <p className="mt-1 text-small text-fg-muted">
              {meta.industry} · {displayClient(meta)}
            </p>
            <p className="mt-3 max-w-[72ch] text-body text-fg-secondary">{meta.summary}</p>
            <ul aria-label="Technologies" className="mt-4 flex flex-wrap gap-1.5">
              {[...meta.stack.frontend, ...meta.stack.backend].map((tech) => (
                <li key={tech}>
                  <Tag>{tech}</Tag>
                </li>
              ))}
            </ul>
            <Link
              href={`/projects/${slug}`}
              className="mt-5 inline-flex min-h-6 items-center gap-1 text-small text-accent hover:text-accent-hover print:hidden"
            >
              Read the case study <ArrowRight aria-hidden className="size-3.5" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  const educationPanel = (
    <div>
      <PrintHeading>Education</PrintHeading>
      <div className="flex gap-4 rounded-lg border border-line bg-surface p-5 md:gap-5 md:p-6">
        <span
          aria-hidden
          className="flex size-12 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent"
        >
          <GraduationCap className="size-6" />
        </span>
        <div>
          <h3 className="text-h4 text-fg">
            {profile.education.degree} — {profile.education.field}
          </h3>
          <p className="mt-1 text-body text-fg-secondary">
            {profile.education.institution ?? <ContentRequired inline hint="institution" />}
          </p>
          <p className="mt-2 font-mono text-caption text-fg-muted">
            {formatPeriod(profile.education.period)}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader
        index="08"
        path="/resume"
        title={profile.name}
        lede={`${profile.title} · ${profile.subtitle}`}
        actions={
          <>
            <ResumeLink />
            <Button asChild variant="secondary">
              <Link href="/contact?type=full-time">
                Hiring? Let&apos;s Talk <ArrowRight aria-hidden />
              </Link>
            </Button>
          </>
        }
      >
        <ContactStrip />
      </PageHeader>
      <Container width="wide" className="pb-16 md:pb-24">
        <UrlTabs
          param="tab"
          label="Resume sections"
          listClassName="print:hidden"
          forceMount
          tabs={[
            { value: "overview", label: "Overview", content: overview },
            { value: "experience", label: "Experience", content: experiencePanel },
            { value: "skills", label: "Skills", content: skillsPanel },
            { value: "projects", label: "Projects", content: projectsPanel },
            { value: "education", label: "Education", content: educationPanel },
          ]}
        />
      </Container>
      <ConnectedModules
        items={[
          { label: "Experience", href: "/experience" },
          { label: "Contact", href: "/contact" },
        ]}
      />
    </>
  );
}
