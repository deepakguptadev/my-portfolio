export function SkipLink({ href = "#main" }: { href?: string }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-skip focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-small focus:font-medium focus:text-on-accent"
    >
      Skip to content
    </a>
  );
}
