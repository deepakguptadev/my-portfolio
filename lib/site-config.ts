export const siteConfig = {
  name: "Deepak Gupta",
  title: "Senior Full-Stack Engineer",
  description:
    "Deepak Gupta — Senior Full-Stack Engineer building scalable, secure web applications end to end with React, Next.js, Node.js and AWS.",
  // Production domain is not decided yet (Content required); set NEXT_PUBLIC_SITE_URL.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
