import { Tag } from "@/components/ui/badge";
import { skills } from "@/content/skills";

/** Every skill category as a hairline-separated grid of tags. */
export function SkillGrid() {
  return (
    <dl className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {skills.map((category) => (
        <div key={category.id} className="bg-surface p-5">
          <dt className="mb-3 eyebrow text-fg-muted">{category.label}</dt>
          <dd>
            <ul className="flex flex-wrap gap-1.5">
              {category.skills.map((skill) => (
                <li key={skill}>
                  <Tag>{skill}</Tag>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}
