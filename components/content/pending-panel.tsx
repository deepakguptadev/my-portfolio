/**
 * Authoring aid: lists the facts still missing for a page. Rendered in
 * development only — production shows inline "Content required" markers
 * where a gap is visible, never this checklist.
 */
export function PendingPanel({
  items,
  title = "Content required on this page",
}: {
  items: string[];
  title?: string;
}) {
  if (process.env.NODE_ENV === "production" || items.length === 0) return null;
  return (
    <aside className="my-8 rounded-md border border-dashed border-warning/60 bg-surface p-5">
      <p className="eyebrow text-warning">Dev only · {title}</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-small text-fg-secondary">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}
