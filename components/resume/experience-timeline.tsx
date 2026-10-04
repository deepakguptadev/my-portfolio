import { TrendingUp } from "lucide-react";
import { ContentRequired } from "@/components/content/content-required";
import { Tag } from "@/components/ui/badge";
import { experience } from "@/content/experience";
import { groupRolesByCompany } from "@/lib/experience";
import { formatDuration, formatPeriod } from "@/lib/format";
import type { Period } from "@/lib/schemas/common";
import type { Role } from "@/lib/schemas/content";
import { cn } from "@/lib/utils";

function PeriodLabel({ period }: { period: Period }) {
  const duration = formatDuration(period);
  return (
    <span className="font-mono text-caption text-fg-muted">
      {formatPeriod(period)}
      {duration && ` · ${duration}`}
    </span>
  );
}

function RoleDetails({ role, nested }: { role: Role; nested: boolean }) {
  return (
    <div className={cn("flex flex-col gap-4", nested && "border-l-2 border-line pl-4 md:pl-5")}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="text-body font-semibold text-fg">{role.title}</h4>
        {nested && <PeriodLabel period={role.period} />}
      </div>
      {role.achievements.length > 0 && (
        <ul aria-label="Key achievements" className="flex flex-col gap-2">
          {role.achievements.map((item) => (
            <li key={item} className="flex gap-2.5 text-small text-fg">
              <TrendingUp aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
              {item}
            </li>
          ))}
        </ul>
      )}
      {role.responsibilities.length > 0 ? (
        <ul className="list-disc space-y-1.5 pl-5 text-small text-fg-secondary marker:text-fg-muted">
          {role.responsibilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <ContentRequired inline hint="responsibilities" />
      )}
      {role.technologies.length > 0 && (
        <ul aria-label="Technologies" className="flex flex-wrap gap-1.5">
          {role.technologies.map((tech) => (
            <li key={tech}>
              <Tag>{tech}</Tag>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Resume experience: one card per employer on a rail, newest first. */
export function ExperienceTimeline() {
  const groups = groupRolesByCompany(experience);

  return (
    <ol className="flex flex-col gap-6">
      {groups.map((group, index) => (
        <li key={group.roles[0].id} className="relative pl-7 md:pl-9">
          {index < groups.length - 1 && (
            <span aria-hidden className="absolute top-4 -bottom-6 left-[5px] w-px bg-line" />
          )}
          <span
            aria-hidden
            className={cn(
              "absolute top-2 left-0 size-3 rounded-full",
              index === 0
                ? "bg-accent ring-4 ring-accent-soft"
                : "border-2 border-line-strong bg-canvas",
            )}
          />
          <article className="rounded-lg border border-line bg-surface p-5 md:p-6">
            <header className="mb-5 flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-4">
              <div>
                <h3 className="text-h4 text-fg">
                  {group.company ?? <ContentRequired inline hint="employer" />}
                </h3>
                {group.location && <p className="text-small text-fg-muted">{group.location}</p>}
              </div>
              <PeriodLabel period={group.period} />
            </header>
            <div className="flex flex-col gap-6">
              {group.roles.map((role) => (
                <RoleDetails key={role.id} role={role} nested={group.roles.length > 1} />
              ))}
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
