import { ConnectedModules } from "@/components/layout/connected-modules";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { NotesBrowser } from "@/components/notes/notes-browser";
import { getNotes, isPublic } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Engineering Notes",
  description:
    "Technical notes on React, Next.js rendering, micro frontends, state management and frontend architecture.",
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
            ? "Notes on frontend architecture, rendering and the decisions behind them."
            : "Notes on frontend architecture, rendering and the decisions behind them. The notes below are samples while full articles are being written."
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
