import Link from "next/link";
import { ContentRequired } from "@/components/content/content-required";
import { SpecRows } from "@/components/content/spec-rows";
import { ConnectedModules } from "@/components/layout/connected-modules";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ResumeLink } from "@/components/layout/resume-link";
import { Badge, Tag } from "@/components/ui/badge";
import { UrlTabs } from "@/components/ui/url-tabs";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { skills } from "@/content/skills";
import { displayClient, getProjects } from "@/lib/content";
import { formatPeriod } from "@/lib/format";
import { profileLinks } from "@/lib/profile-links";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Resume",
  description: `Resume of ${profile.name}, ${profile.title} — experience, skills, projects and education.`,
  path: "/resume",
});

/** Visible only when printing, where every tab panel is shown in sequence. */
function PrintHeading({ children }: { children: string }) {
  return <h2 className="hidden text-h4 text-fg print:mt-6 print:mb-3 print:block">{children}</h2>;
}

export default async function ResumePage() {
  const projects = await getProjects();

  const overview = (
    <div className="flex flex-col gap-8">
      <PrintHeading>Overview</PrintHeading>
      <p className="max-w-[68ch] text-body-lg text-fg-secondary">{profile.intro}</p>
      <SpecRows
        rows={[
          { label: "Experience", value: `${profile.experienceYears} Years` },
          { label: "Primary stack", value: profile.primaryStack.join(", ") },
          { label: "Backend", value: profile.backendStack.join(", ") },
          { label: "Location", value: profile.location },
          { label: "Availability", value: <Badge tone="success">{profile.availability}</Badge> },
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
      <ol className="flex flex-col divide-y divide-line rounded-md border border-line bg-surface">
        {experience.map((role) => (
          <li key={role.id} className="grid gap-2 p-5 md:grid-cols-[200px_1fr]">
            <span className="font-mono text-caption text-fg-muted">
              {formatPeriod(role.period)}
            </span>
            <div>
              <h3 className="text-body font-semibold text-fg">{role.title}</h3>
              <p className="text-small text-fg-secondary">
                {role.company ?? <ContentRequired inline hint="employer" />}
              </p>
              {role.responsibilities.length > 0 ? (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-small text-fg-secondary">
                  {role.responsibilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2">
                  <ContentRequired inline hint="responsibilities" />
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-small">
        <Link href="/experience" className="text-accent hover:text-accent-hover print:hidden">
          Full engineering journey →
        </Link>
      </p>
    </div>
  );

  const skillsPanel = (
    <div>
      <PrintHeading>Skills</PrintHeading>
      <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((category) => (
          <div key={category.id}>
            <dt className="mb-2 eyebrow text-fg-muted">{category.label}</dt>
            <dd className="text-small text-fg-secondary">{category.skills.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </div>
  );

  const projectsPanel = (
    <div>
      <PrintHeading>Projects</PrintHeading>
      <ul className="flex flex-col gap-4">
        {projects.map(({ slug, meta }) => (
          <li key={slug} className="rounded-md border border-line bg-surface p-5">
            <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
              <h3 className="text-body font-semibold text-fg">
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
            <p className="mt-3 text-small text-fg-secondary">{meta.summary}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {[...meta.stack.frontend, ...meta.stack.backend].map((tech) => (
                <li key={tech}>
                  <Tag>{tech}</Tag>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );

  const educationPanel = (
    <div>
      <PrintHeading>Education</PrintHeading>
      <div className="rounded-md border border-line bg-surface p-5">
        <h3 className="text-body font-semibold text-fg">
          {profile.education.degree} — {profile.education.field}
        </h3>
        <p className="mt-1 text-small text-fg-secondary">
          {profile.education.institution ?? <ContentRequired inline hint="institution" />}
        </p>
        <p className="mt-1 font-mono text-caption text-fg-muted">{profile.education.year}</p>
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
        actions={<ResumeLink />}
      >
        <p className="hidden text-small text-fg-secondary print:block">
          {profileLinks.email} · {profileLinks.linkedin} · {profile.location}
        </p>
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
