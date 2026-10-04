/**
 * Lists every fact still marked as missing across the site, so the
 * portfolio can be completed without hunting through files.
 * Run: npm run content:status
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";

type Section = { title: string; items: string[] };
const sections: Section[] = [];

sections.push({
  title: "Profile (content/profile.ts)",
  items: [
    ...profile.pending,
    ...profile.story.filter((b) => b.draft).map((b) => `Approve draft wording: "${b.title}"`),
  ],
});

for (const role of experience) {
  sections.push({
    title: `Experience: ${role.title} @ ${role.company ?? "?"} (content/experience.ts)`,
    items: role.pending,
  });
}

// MDX metadata can't be imported outside the Next build; read `pending` from the source.
for (const collection of ["projects", "notes"]) {
  const dir = join(process.cwd(), "content", collection);
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
    const source = readFileSync(join(dir, file), "utf8");
    const block = /pending:\s*\[([\s\S]*?)\]/.exec(source)?.[1] ?? "";
    const items = [...block.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    if (/status:\s*"sample"/.test(source))
      items.push("Sample note — replace with a real article or remove");
    if (/status:\s*"draft"/.test(source))
      items.push('Draft — review, then set status: "published" with a publishedAt date');
    if (/<ContentRequired/.test(source))
      items.push("Has inline <ContentRequired> sections in the body");
    sections.push({ title: `${collection}/${file}`, items });
  }
}

sections.push({
  title: "Site configuration (.env — see .env.example)",
  items: [
    ...(process.env.NEXT_PUBLIC_SITE_URL ? [] : ["NEXT_PUBLIC_SITE_URL (production domain)"]),
    ...(process.env.CONTACT_TO_EMAIL && process.env.RESEND_API_KEY
      ? []
      : ["Contact form email: CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL, RESEND_API_KEY"]),
  ],
});

let total = 0;
for (const { title, items } of sections) {
  if (items.length === 0) continue;
  total += items.length;
  console.log(`\n${title}`);
  for (const item of items) console.log(`  [ ] ${item}`);
}
console.log(total ? `\n${total} item(s) outstanding.\n` : "\nAll content complete.\n");
