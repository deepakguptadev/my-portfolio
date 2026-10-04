import type { ThemePreference } from "@/components/theme/theme-constants";
import { primaryNav, secondaryNav } from "./navigation";
import { profileLinks } from "./profile-links";

export type CommandAction =
  | { type: "navigate"; href: string }
  | { type: "external"; href: string; newTab: boolean }
  | { type: "copy"; value: string; message: string }
  | { type: "theme"; theme: ThemePreference | "toggle" };

export type CommandGroup = "Navigate" | "Actions" | "Theme";

export type Command = {
  id: string;
  label: string;
  group: CommandGroup;
  /** Extra search terms; cmdk matches against label + keywords. */
  keywords?: string[];
  action: CommandAction;
};

// Labels follow the brief's command list where it names one.
const navLabels: Record<string, string> = {
  "/about": "Go to About",
  "/experience": "Go to Experience",
  "/projects": "Explore Projects",
  "/architecture": "Open Architecture Lab",
  "/engineering": "Go to Engineering",
  "/notes": "Read Engineering Notes",
  "/skills": "View Skills",
  "/resume": "Go to Resume",
  "/contact": "Contact Deepak",
};

const navigate: Command[] = [
  {
    id: "nav-home",
    label: "Go to Home",
    group: "Navigate",
    keywords: ["overview", "start"],
    action: { type: "navigate", href: "/" },
  },
  ...[...primaryNav, ...secondaryNav].map<Command>((item) => ({
    id: `nav-${item.href.slice(1)}`,
    label: navLabels[item.href] ?? `Go to ${item.label}`,
    group: "Navigate",
    keywords: [item.label.toLowerCase()],
    action: { type: "navigate", href: item.href },
  })),
];

const actions: Command[] = [
  profileLinks.resumeUrl
    ? {
        id: "resume",
        label: "Download Resume",
        group: "Actions",
        keywords: ["cv", "pdf"],
        action: { type: "external", href: profileLinks.resumeUrl, newTab: true },
      }
    : {
        id: "resume",
        label: "Request Resume by Email",
        group: "Actions",
        keywords: ["download resume", "cv", "pdf"],
        action: { type: "external", href: profileLinks.resumeRequestHref, newTab: false },
      },
  {
    id: "copy-email",
    label: "Copy Email Address",
    group: "Actions",
    keywords: ["contact", "mail", profileLinks.email],
    action: { type: "copy", value: profileLinks.email, message: "Email copied" },
  },
  {
    id: "email",
    label: "Email Deepak",
    group: "Actions",
    keywords: ["contact", "mail"],
    action: { type: "external", href: profileLinks.emailHref, newTab: false },
  },
  {
    id: "linkedin",
    label: "Open LinkedIn",
    group: "Actions",
    keywords: ["profile", "social"],
    action: { type: "external", href: profileLinks.linkedin, newTab: true },
  },
];

const theme: Command[] = [
  {
    id: "theme-toggle",
    label: "Toggle Theme",
    group: "Theme",
    keywords: ["dark", "light", "mode"],
    action: { type: "theme", theme: "toggle" },
  },
  {
    id: "theme-light",
    label: "Use Light Theme",
    group: "Theme",
    action: { type: "theme", theme: "light" },
  },
  {
    id: "theme-dark",
    label: "Use Dark Theme",
    group: "Theme",
    action: { type: "theme", theme: "dark" },
  },
  {
    id: "theme-system",
    label: "Use System Theme",
    group: "Theme",
    keywords: ["auto", "os"],
    action: { type: "theme", theme: "system" },
  },
];

export const commands: Command[] = [...navigate, ...actions, ...theme];

export const commandGroups: CommandGroup[] = ["Navigate", "Actions", "Theme"];

export function commandsByGroup(group: CommandGroup) {
  return commands.filter((command) => command.group === group);
}
