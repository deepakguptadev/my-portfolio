import { getProject, getProjectSlugs } from "@/lib/content";
import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Case study";
export const size = ogSize;
export const contentType = ogContentType;

// Prerender one image per page at build time.
export async function generateStaticParams() {
  return (await getProjectSlugs()).map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const project = await getProject((await params).slug);
  return renderOg({
    eyebrow: `Case study · ${project?.meta.industry ?? ""}`,
    title: project?.meta.title ?? "Case study",
    subtitle: project?.meta.summary,
  });
}
