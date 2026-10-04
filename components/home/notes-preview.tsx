import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ModuleHeader } from "@/components/layout/module-header";
import { Section } from "@/components/layout/section";
import { NoteCard } from "@/components/notes/note-card";
import { Button } from "@/components/ui/button";
import { getNotes } from "@/lib/content";

export async function NotesPreview() {
  const notes = (await getNotes()).slice(0, 3);
  if (notes.length === 0) return null;

  return (
    <Section width="wide" aria-labelledby="notes-title">
      <ModuleHeader
        index="08"
        path="/notes"
        title="Engineering notes"
        id="notes-title"
        actions={
          <Button asChild variant="ghost" size="sm">
            <Link href="/notes">
              All notes <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />
      <ul className="grid gap-4 md:grid-cols-3">
        {notes.map((note) => (
          <li key={note.slug}>
            <NoteCard note={note} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
