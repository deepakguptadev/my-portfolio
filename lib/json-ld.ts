import { profile } from "@/content/profile";
import { profileLinks } from "./profile-links";
import { siteConfig } from "./site-config";

const absolute = (path: string) => new URL(path, siteConfig.url).toString();

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": absolute("/#person"),
    name: profile.name,
    jobTitle: profile.title,
    url: absolute("/"),
    email: `mailto:${profileLinks.email}`,
    sameAs: [profileLinks.linkedin],
    address: { "@type": "PostalAddress", addressLocality: "Delhi NCR", addressCountry: "IN" },
    knowsAbout: [...profile.primaryStack, ...profile.focusAreas],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absolute("/"),
    author: { "@id": absolute("/#person") },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

/** Only for published notes with a real date — samples never get Article markup. */
export function articleJsonLd(note: {
  title: string;
  summary: string;
  path: string;
  publishedAt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: note.title,
    description: note.summary,
    datePublished: note.publishedAt,
    url: absolute(note.path),
    author: { "@id": absolute("/#person") },
  };
}
