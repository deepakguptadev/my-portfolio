export const siteConfig = {
  name: "Deepak Gupta",
  title: "Senior Software Engineer",
  description:
    "Deepak Gupta — Senior Software Engineer building scalable, high-performance frontend and full-stack web applications with React, Next.js and TypeScript.",
  // Production domain is not decided yet (Content required); set NEXT_PUBLIC_SITE_URL.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
