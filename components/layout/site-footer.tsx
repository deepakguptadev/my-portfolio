import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { primaryNav } from "@/lib/navigation";
import { profileLinks } from "@/lib/profile-links";
import { Container } from "./container";

const footerModules = [...primaryNav, { label: "Contact", href: "/contact", index: "09" }];

const linkClasses =
  "inline-flex min-h-6 items-center gap-1 text-small text-fg-secondary transition-colors duration-micro hover:text-fg";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <Container width="wide" className="grid gap-12 py-12 md:grid-cols-12 md:py-16">
        <div className="md:col-span-5">
          <p className="eyebrow text-fg">Deepak Gupta</p>
          <p className="mt-3 text-small text-fg-secondary">
            Senior Software Engineer
            <br />
            Frontend &amp; Full-Stack Engineering
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-4">
          <p className="mb-4 eyebrow text-fg-muted">Modules</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
            {footerModules.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClasses}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="mb-4 eyebrow text-fg-muted">Elsewhere</p>
          <ul className="flex flex-col gap-2">
            <li>
              <a
                href={profileLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClasses}
              >
                LinkedIn <ArrowUpRight aria-hidden className="size-3.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={profileLinks.emailHref} className={linkClasses}>
                Email
              </a>
            </li>
          </ul>
        </div>
      </Container>
      <Container width="wide">
        <p className="border-t border-line py-6 font-mono text-caption text-fg-muted">
          © {new Date().getFullYear()} Deepak Gupta
        </p>
      </Container>
    </footer>
  );
}
