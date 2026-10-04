import { getNote, getNoteSlugs } from "@/lib/content";
import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Engineering note";
export const size = ogSize;
export const contentType = ogContentType;

// Prerender one image per page at build time.
export async function generateStaticParams() {
  return (await getNoteSlugs()).map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const note = await getNote((await params).slug);
  return renderOg({
    eyebrow: `Engineering notes · ${note?.meta.tags[0] ?? ""}`,
    title: note?.meta.title ?? "Engineering note",
    subtitle: note?.meta.summary,
  });
}
