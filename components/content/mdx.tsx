import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Callout } from "./callout";
import { Pre } from "./code-block";
import { ContentRequired } from "./content-required";

function Anchor({ href = "", className, ...props }: ComponentProps<"a">) {
  const classes = cn("text-accent underline underline-offset-4 hover:text-accent-hover", className);
  if (href.startsWith("/") || href.startsWith("#")) {
    return <Link href={href} className={classes} {...props} />;
  }
  return <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...props} />;
}

/** Markdown → design-system mapping for every MDX document. */
export const mdxComponents: MDXComponents = {
  h2: ({ className, ...props }) => (
    <h2
      className={cn("mt-14 mb-4 scroll-mt-24 text-h3 text-fg first:mt-0", className)}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3 className={cn("mt-10 mb-3 scroll-mt-24 text-h4 text-fg", className)} {...props} />
  ),
  p: ({ className, ...props }) => (
    <p className={cn("my-5 text-body text-fg-secondary", className)} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        "my-5 list-disc space-y-2 pl-6 text-fg-secondary marker:text-fg-muted",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn(
        "my-5 list-decimal space-y-2 pl-6 text-fg-secondary marker:text-fg-muted",
        className,
      )}
      {...props}
    />
  ),
  strong: ({ className, ...props }) => (
    <strong className={cn("font-semibold text-fg", className)} {...props} />
  ),
  a: Anchor,
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn("my-6 border-l-2 border-accent pl-5 text-body-lg text-fg", className)}
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-line" />,
  table: ({ className, ...props }) => (
    <div className="my-6 overflow-x-auto rounded-md border border-line">
      <table className={cn("w-full text-left text-small", className)} {...props} />
    </div>
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn("border-b border-line bg-surface-2 px-4 py-2.5 font-medium text-fg", className)}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn("border-b border-line px-4 py-2.5 text-fg-secondary", className)}
      {...props}
    />
  ),
  // Inline code; block code is styled through the [data-rehype-pretty-code-figure] rules.
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "rounded-xs bg-surface-2 px-1.5 py-0.5 font-mono text-[0.9em] text-fg [pre_&]:rounded-none [pre_&]:bg-transparent [pre_&]:p-0 [pre_&]:text-[1em]",
        className,
      )}
      {...props}
    />
  ),
  pre: Pre,
  figure: ({ className, ...props }) => <figure className={cn("my-6", className)} {...props} />,
  figcaption: ({ className, ...props }) => (
    <figcaption
      className={cn(
        "mb-0 rounded-t-md border border-b-0 border-line bg-surface-2 px-4 py-2 font-mono text-caption text-fg-secondary [&+div_pre]:rounded-t-none",
        className,
      )}
      {...props}
    />
  ),
  Callout,
  ContentRequired,
};
