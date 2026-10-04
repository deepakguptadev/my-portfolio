"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CommandTrigger } from "@/components/command/command-trigger";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { isActivePath, primaryNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { MobileNav } from "./mobile-nav";
import { ResumeLink } from "./resume-link";

export function BrandMark() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5 rounded-sm text-body font-semibold text-fg"
    >
      <span
        aria-hidden
        className="flex size-6 items-center justify-center rounded-xs border border-line-strong font-mono text-caption font-medium text-fg-secondary transition-colors duration-micro group-hover:border-accent group-hover:text-accent"
      >
        DG
      </span>
      Deepak Gupta
    </Link>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex h-16 items-center px-3 text-small font-medium transition-colors duration-micro ease-standard",
        "after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-accent after:opacity-0 after:transition-opacity after:duration-small",
        active ? "text-fg after:opacity-100" : "text-fg-secondary hover:text-fg",
      )}
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const sentinel = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // An 8px sentinel at the top of the document: once it leaves the
  // viewport, the header gains its background. No scroll listener.
  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        ref={sentinel}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-2"
      />
      <header
        data-scrolled={scrolled}
        className={cn(
          "sticky top-0 z-sticky h-16 border-b transition-[background-color,border-color] duration-small ease-standard",
          scrolled ? "border-line bg-canvas/85 backdrop-blur-[8px]" : "border-transparent",
        )}
      >
        <Container width="wide" className="flex h-full items-center">
          <BrandMark />
          <nav aria-label="Primary" className="ml-8 hidden lg:block">
            <ul className="flex">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    label={item.label}
                    active={isActivePath(pathname, item.href)}
                  />
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <CommandTrigger className="hidden md:inline-flex" />
            <ThemeToggle />
            <ResumeLink compact variant="secondary" size="sm" className="hidden lg:inline-flex" />
            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link href="/contact">Let&apos;s Connect</Link>
            </Button>
            <MobileNav className="lg:hidden" pathname={pathname} />
          </div>
        </Container>
      </header>
    </>
  );
}
