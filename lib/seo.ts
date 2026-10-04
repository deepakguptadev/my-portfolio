import type { Metadata } from "next";
import { siteConfig } from "./site-config";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  /** Social image path; detail pages pass their generated opengraph-image. */
  image?: string;
};

/**
 * Per-page metadata. Setting openGraph in a page replaces the inherited
 * object, so the shared defaults (site name, image) are restated here.
 * An explicit image here wins over segment opengraph-image files, so detail
 * pages pass their own image path.
 */
export function pageMetadata({
  title,
  description,
  path,
  image: imagePath = "/opengraph-image",
}: PageMetadataInput): Metadata {
  const fullTitle = `${title} — ${siteConfig.name}`;
  const image = { url: imagePath, width: 1200, height: 630, alt: fullTitle };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
      images: [image],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
  };
}
