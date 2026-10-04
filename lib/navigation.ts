export type NavItem = {
  label: string;
  href: string;
  /** Two-digit module index shown in mono labels. */
  index: string;
};

/** Top-level modules shown in the header (max six, per the IA). */
export const primaryNav: NavItem[] = [
  { label: "About", href: "/about", index: "01" },
  { label: "Experience", href: "/experience", index: "02" },
  { label: "Projects", href: "/projects", index: "03" },
  { label: "Architecture", href: "/architecture", index: "04" },
  { label: "Engineering", href: "/engineering", index: "05" },
  { label: "Notes", href: "/notes", index: "06" },
];

/** Reachable from the drawer, footer and command palette. */
export const secondaryNav: NavItem[] = [
  { label: "Skills", href: "/skills", index: "07" },
  { label: "Resume", href: "/resume", index: "08" },
  { label: "Contact", href: "/contact", index: "09" },
];

export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
