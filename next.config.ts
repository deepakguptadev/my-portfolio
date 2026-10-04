import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // MDX is imported as content modules (content/**), not used as routes.
  pageExtensions: ["ts", "tsx"],
};

// Plugins are referenced by name so options stay serializable for Turbopack.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [
      "rehype-slug",
      [
        "rehype-pretty-code",
        {
          // High-contrast light theme: every token meets WCAG AA on the code background.
          theme: { light: "github-light-high-contrast", dark: "github-dark-dimmed" },
          keepBackground: false,
          defaultLang: "plaintext",
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
