import type { Metadata } from "next";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

/** Per-page metadata with a canonical URL. OG images are added in M8. */
export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website" },
  };
}
