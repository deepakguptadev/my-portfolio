import { profile } from "@/content/profile";

/** Headline results as stat tiles: big value, plain-language label. */
export function Highlights() {
  if (profile.highlights.length === 0) return null;
  return (
    <dl className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
      {profile.highlights.map((highlight) => (
        <div key={highlight.label} className="flex flex-col gap-2 bg-surface px-6 py-5">
          {/* Label first for screen readers; the value leads visually. */}
          <dt className="order-2 text-small text-fg-secondary">{highlight.label}</dt>
          <dd className="order-1 text-h2 text-fg">{highlight.value}</dd>
        </div>
      ))}
    </dl>
  );
}
