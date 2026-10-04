"use client";

import { Search, X } from "lucide-react";
import { useId, useState } from "react";
import type { SkillCategory } from "@/lib/schemas/content";
import { cn } from "@/lib/utils";

/** Category view with a live text filter that highlights matching skills. */
export function SkillFilter({ categories }: { categories: SkillCategory[] }) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const matches = (skill: string) => q.length > 0 && skill.toLowerCase().includes(q);
  const visible = categories.filter(
    (category) => !q || category.label.toLowerCase().includes(q) || category.skills.some(matches),
  );
  const matchCount = categories.flatMap((c) => c.skills).filter(matches).length;

  return (
    <div>
      <div className="relative max-w-sm">
        <label htmlFor={inputId} className="sr-only">
          Filter skills
        </label>
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-muted"
        />
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter skills, e.g. react or test"
          className="h-11 w-full rounded-sm border border-line bg-surface pr-10 pl-9 text-body text-fg placeholder:text-fg-muted hover:border-line-strong focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear filter"
            className="absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-sm text-fg-muted hover:text-fg"
          >
            <X aria-hidden className="size-4" />
          </button>
        )}
      </div>
      <p role="status" className="mt-3 h-5 font-mono text-caption text-fg-muted">
        {q ? `${matchCount} matching ${matchCount === 1 ? "skill" : "skills"}` : ""}
      </p>
      <dl className="mt-4 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((category) => (
          <div key={category.id} className="bg-surface p-5">
            <dt className="mb-3 eyebrow text-fg-muted">{category.label}</dt>
            <dd>
              <ul className="flex flex-wrap gap-1.5">
                {category.skills.map((skill) => (
                  <li
                    key={skill}
                    className={cn(
                      "inline-flex h-7 items-center rounded-xs border px-2 font-mono text-caption transition-colors duration-micro",
                      matches(skill)
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-transparent bg-surface-2 text-fg-secondary",
                      q && !matches(skill) && "opacity-60",
                    )}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
      {visible.length === 0 && (
        <p className="mt-6 text-small text-fg-secondary">No skills match &ldquo;{query}&rdquo;.</p>
      )}
    </div>
  );
}
