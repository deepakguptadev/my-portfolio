import { ContentRequired } from "@/components/content/content-required";
import { SpecRows } from "@/components/content/spec-rows";
import { Timeline } from "@/components/experience/timeline";
import { ConnectedModules } from "@/components/layout/connected-modules";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ResumeLink } from "@/components/layout/resume-link";
import { Tag } from "@/components/ui/badge";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { formatPeriod } from "@/lib/format";
import type { Role } from "@/lib/schemas/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Experience",
  description: `Deepak Gupta's engineering journey: ${profile.experienceYears} years building frontend and full-stack web applications.`,
  path: "/experience",
});

function Field({ label, items, pending }: { label: string; items: string[]; pending?: string }) {
  return (
    <div>
      <h3 className="mb-2 eyebrow text-fg-muted">{label}</h3>
      {items.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-small text-fg-secondary marker:text-fg-muted">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <ContentRequired inline hint={pending} />
      )}
    </div>
  );
}

function RoleDetails({ role }: { role: Role }) {
  return (
    <div className="flex flex-col gap-6">
      {role.summary && <p className="text-body text-fg-secondary">{role.summary}</p>}
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Responsibilities" items={role.responsibilities} pending="responsibilities" />
        <Field label="Key achievements" items={role.achievements} pending="achievements" />
        <Field label="Engineering focus" items={role.focus} pending="focus areas" />
        <div>
          <h3 className="mb-2 eyebrow text-fg-muted">Technologies</h3>
          {role.technologies.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {role.technologies.map((tech) => (
                <li key={tech}>
                  <Tag>{tech}</Tag>
                </li>
              ))}
            </ul>
          ) : (
            <ContentRequired inline hint="technologies" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExperiencePage() {
  const current = experience.find((role) => role.period.end === null);
  const companies = new Set(experience.map((role) => role.company).filter(Boolean));

  return (
    <>
      <PageHeader
        index="02"
        path="/experience"
        title="Engineering journey"
        lede="From software developer to senior engineer — expand a role for responsibilities, technologies and outcomes."
        actions={<ResumeLink variant="secondary" />}
      >
        <SpecRows
          rows={[
            { label: "Experience", value: `${profile.experienceYears} Years` },
            { label: "Since", value: experience[experience.length - 1].period.start },
            { label: "Current level", value: current?.title ?? <ContentRequired inline /> },
          ]}
        />
        {companies.size < experience.length && (
          <p className="mt-4 text-small text-fg-muted">
            Some details are still being added; gaps are marked rather than guessed.
          </p>
        )}
      </PageHeader>
      <Container width="content" className="pb-16 md:pb-24">
        <Timeline
          entries={experience.map((role) => ({
            id: role.id,
            period: formatPeriod(role.period),
            title: role.title,
            company: role.company ?? <ContentRequired inline hint="employer" />,
            current: role.period.end === null,
            content: <RoleDetails role={role} />,
          }))}
        />
      </Container>
      <ConnectedModules
        items={[
          { label: "Projects", href: "/projects" },
          { label: "Skills", href: "/skills" },
          { label: "Resume", href: "/resume" },
        ]}
      />
    </>
  );
}
