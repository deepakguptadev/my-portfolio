import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { parseColorTokens } from "./tokens";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

// Colors come from styles/tokens.css (dark theme) — no hex values duplicated here.
const tokens = Object.fromEntries(
  parseColorTokens(readFileSync(join(process.cwd(), "styles/tokens.css"), "utf8")).map((t) => [
    t.name,
    t.dark,
  ]),
);

type OgInput = { eyebrow: string; title: string; subtitle?: string };

/** Shared social card: module label, title, and the name as a signature. */
export function renderOg({ eyebrow, title, subtitle }: OgInput) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: tokens["bg-primary"],
        backgroundImage: `radial-gradient(${tokens["border-default"]} 1.5px, transparent 1.5px)`,
        backgroundSize: "32px 32px",
        color: tokens["text-primary"],
      }}
    >
      <div style={{ display: "flex", fontSize: 24, letterSpacing: 3, color: tokens["accent"] }}>
        {eyebrow.toUpperCase()}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 600,
            lineHeight: 1.08,
            maxWidth: 980,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: tokens["text-secondary"],
              maxWidth: 940,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: `1px solid ${tokens["border-strong"]}`,
          paddingTop: 28,
          fontSize: 26,
          color: tokens["text-secondary"],
        }}
      >
        <span>Deepak Gupta</span>
        <span>Senior Software Engineer</span>
      </div>
    </div>,
    ogSize,
  );
}
