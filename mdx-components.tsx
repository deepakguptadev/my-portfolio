import type { MDXComponents } from "mdx/types";
import { mdxComponents } from "@/components/content/mdx";

// Required by @next/mdx in the App Router; maps markdown to design-system components.
export function useMDXComponents(components: MDXComponents = {}): MDXComponents {
  return { ...mdxComponents, ...components };
}
