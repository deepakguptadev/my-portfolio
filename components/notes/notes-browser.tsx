"use client";

import { FileSearch, Search } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { StatePanel } from "@/components/ui/feedback";
import type { Note } from "@/lib/content";
import { cn } from "@/lib/utils";
import { NoteCard } from "./note-card";

/** Client-side search (title, summary, tags) and tag filter over the notes list. */
export function NotesBrowser({ notes }: { notes: Note[] }) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const tags = [...new Set(notes.flatMap((note) => note.meta.tags))].sort();

  const q = query.trim().toLowerCase();
  const visible = notes.filter((note) => {
    const haystack = [note.meta.title, note.meta.summary, ...note.meta.tags]
      .join(" ")
      .toLowerCase();
    return (!q || haystack.includes(q)) && (!tag || note.meta.tags.includes(tag));
  });

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-sm">
          <label htmlFor={inputId} className="sr-only">
            Search notes
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
            placeholder="Search notes"
            className="h-11 w-full rounded-sm border border-line bg-surface pr-3 pl-9 text-body text-fg placeholder:text-fg-muted hover:border-line-strong focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent"
          />
        </div>
        <div role="group" aria-label="Filter by tag" className="flex flex-wrap gap-2">
          {tags.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={tag === item}
              onClick={() => setTag(tag === item ? null : item)}
              className={cn(
                "h-8 rounded-full border px-3 text-small transition-colors duration-micro pointer-coarse:h-11",
                tag === item
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line bg-surface text-fg-secondary hover:border-line-strong hover:text-fg",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <p role="status" className="mt-4 font-mono text-caption text-fg-muted">
        {visible.length} {visible.length === 1 ? "note" : "notes"}
      </p>
      {visible.length > 0 ? (
        <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((note) => (
            <li key={note.slug}>
              <NoteCard note={note} />
            </li>
          ))}
        </ul>
      ) : (
        <StatePanel
          className="mt-6"
          icon={FileSearch}
          title={q ? `No notes match "${query}"` : "No notes with that tag"}
          action={
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setQuery("");
                setTag(null);
              }}
            >
              Clear search
            </Button>
          }
        />
      )}
    </div>
  );
}
