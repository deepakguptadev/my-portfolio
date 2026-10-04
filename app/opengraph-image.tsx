import { profile } from "@/content/profile";
import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = `${profile.name} — ${profile.title}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "Engineering system",
    title: profile.headline,
    subtitle: `${profile.experienceYears} years · React · Next.js · Node.js · TypeScript · AWS`,
  });
}
