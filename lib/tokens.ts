/**
 * Reads color tokens from styles/tokens.css so tests and the style guide
 * use the same source of truth as the CSS (no duplicated hex values).
 */

export type ColorToken = { name: string; light: string; dark: string };

const LIGHT_DARK = /--([\w-]+):\s*light-dark\(\s*(#[0-9a-f]{6})\s*,\s*(#[0-9a-f]{6})\s*\)/gi;

export function parseColorTokens(css: string): ColorToken[] {
  return [...css.matchAll(LIGHT_DARK)].map(([, name, light, dark]) => ({
    name,
    light: light.toLowerCase(),
    dark: dark.toLowerCase(),
  }));
}

function channel(value: number) {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string) {
  const n = Number.parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG 2.x contrast ratio between two hex colors. */
export function contrastRatio(a: string, b: string) {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
