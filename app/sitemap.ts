import type { MetadataRoute } from "next";
import { getNotes, getProjects, isPublic } from "@/lib/content";
import { primaryNav, secondaryNav } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => new URL(path, siteConfig.url).toString();
  const [projects, notes] = await Promise.all([getProjects(), getNotes()]);

  return [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    ...[...primaryNav, ...secondaryNav].map((item) => ({ url: url(item.href), priority: 0.8 })),
    ...projects.map((project) => ({ url: url(`/projects/${project.slug}`), priority: 0.7 })),
    // Sample and draft notes stay out of the sitemap.
    ...notes.filter(isPublic).map((note) => ({
      url: url(`/notes/${note.slug}`),
      lastModified: note.meta.publishedAt ?? undefined,
      priority: 0.6,
    })),
  ];
}
