import { ConnectedModules } from "@/components/layout/connected-modules";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { NotesBrowser } from "@/components/notes/notes-browser";
import { getNotes, isPublic } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Engineering Notes",
  description:
    "Engineering notes across the stack: API design, Node.js services, delivery pipelines, testing, frontend performance and shipping AI features.",
  path: "/notes",
});

export default async function NotesPage() {
  const notes = await getNotes();
  const published = notes.filter(isPublic).length;

  return (
    <>
      <PageHeader
        index="06"
        path="/notes"
        title="Engineering notes"
        lede={
          published > 0
            ? "Notes from across the stack — APIs, services, delivery, testing and performance — and the decisions behind them."
            : "Notes from across the stack — APIs, services, delivery, testing and performance — and the decisions behind them. Notes marked Draft or Sample are still being reviewed."
        }
      />
      <Container width="wide" className="pb-16 md:pb-24">
        <NotesBrowser notes={notes} />
      </Container>
      <ConnectedModules
        items={[
          { label: "Architecture Lab", href: "/architecture" },
          { label: "Engineering", href: "/engineering" },
        ]}
      />
    </>
  );
}
