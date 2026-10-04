"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/mdx-utils";
import { cn } from "@/lib/utils";

/** Sticky table of contents with scroll-spy (IntersectionObserver, no scroll listener). */
export function Toc({ headings, className }: { headings: Heading[]; className?: string }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // A band near the top of the viewport decides the current section.
      { rootMargin: "-80px 0px -65% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page" className={className}>
      <p className="mb-3 eyebrow text-fg-muted">On this page</p>
      <ul className="flex flex-col border-l border-line">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={active === heading.id ? "location" : undefined}
              className={cn(
                "-ml-px block border-l-2 py-1.5 text-small transition-colors duration-micro",
                heading.level === 3 ? "pl-6" : "pl-3",
                active === heading.id
                  ? "border-accent text-fg"
                  : "border-transparent text-fg-muted hover:text-fg",
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
