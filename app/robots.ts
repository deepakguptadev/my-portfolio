import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments (Vercel sets VERCEL_ENV) must not be indexed.
  const isPreview = process.env.VERCEL_ENV !== undefined && process.env.VERCEL_ENV !== "production";
  if (isPreview) return { rules: { userAgent: "*", disallow: "/" } };

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/design-system"] },
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
  };
}
