import { ArrowRight, ArrowUp, ArrowUpRight, Download, MapPin } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { profile } from "@/content/profile";
import { primaryNav, secondaryNav } from "@/lib/navigation";
import { profileLinks } from "@/lib/profile-links";
import { Container } from "./container";

const modules = [...primaryNav, ...secondaryNav];

const linkClasses =
  "inline-flex min-h-6 items-center gap-1.5 text-small text-fg-secondary transition-colors duration-micro hover:text-fg";

const external = [
  { label: "LinkedIn", href: profileLinks.linkedin },
  { label: "GitHub", href: profileLinks.github },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line print:hidden">
      <Container width="wide" className="grid gap-12 py-12 md:grid-cols-12 md:py-16">
        <div className="flex flex-col gap-5 md:col-span-5">
          <div>
            <p className="eyebrow text-fg">{profile.name}</p>
            <p className="mt-3 text-small text-fg-secondary">
              {profile.title}
              <br />
              {profile.subtitle}
            </p>
          </div>
          <ul
            aria-label="Availability"
            className="flex flex-col gap-2 text-small text-fg-secondary"
          >
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <Badge tone="success">{profile.availability}</Badge>
              {profile.workModes.join(" / ")}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <MapPin aria-hidden className="size-4 text-fg-muted" />
              {profile.location} · {profile.timezone}
            </li>
          </ul>
          <Link
            href="/contact?type=full-time"
            className="inline-flex min-h-6 w-fit items-center gap-1.5 text-small font-medium text-accent hover:text-accent-hover"
          >
            Hiring? Let&apos;s talk <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>

        <nav aria-label="Footer" className="md:col-span-4">
          <p className="mb-4 eyebrow text-fg-muted">Modules</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
            {modules.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClasses}>
                  <span aria-hidden className="font-mono text-caption text-fg-muted">
                    {item.index}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="mb-4 eyebrow text-fg-muted">Elsewhere</p>
          <ul className="flex flex-col gap-2">
            {external.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClasses}
                >
                  {link.label} <ArrowUpRight aria-hidden className="size-3.5" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
            <li>
              <a
                href={profileLinks.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClasses}
              >
                Resume <Download aria-hidden className="size-3.5" />
                <span className="sr-only">(PDF, opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={profileLinks.emailHref} className={`${linkClasses} break-all`}>
                {profileLinks.email}
              </a>
            </li>
          </ul>
        </div>
      </Container>
      <Container width="wide">
        <div className="flex flex-col gap-3 border-t border-line py-6 font-mono text-caption text-fg-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {profile.name} · Built with Next.js, React, TypeScript and
            Tailwind CSS
          </p>
          {/* Plain anchor: no JavaScript, and focus moves back to the top with the scroll. */}
          <a
            href="#main"
            className="inline-flex min-h-6 w-fit items-center gap-1.5 transition-colors duration-micro hover:text-fg"
          >
            Back to top <ArrowUp aria-hidden className="size-3.5" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
