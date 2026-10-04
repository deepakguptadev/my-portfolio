"use client";

import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useState } from "react";
import { useCommandPalette } from "@/components/command/command-provider";
import { Button } from "@/components/ui/button";
import { overlayClasses } from "@/components/ui/dialog";
import { isActivePath, primaryNav, secondaryNav } from "@/lib/navigation";
import { profileLinks } from "@/lib/profile-links";
import { cn } from "@/lib/utils";
import { ResumeLink } from "./resume-link";

export function MobileNav({ className, pathname }: { className?: string; pathname: string }) {
  const [open, setOpen] = useState(false);
  const palette = useCommandPalette();
  const close = () => setOpen(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu" className={className}>
          <Menu aria-hidden />
        </Button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={overlayClasses} />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-modal flex w-full max-w-sm flex-col border-l border-line bg-canvas shadow-lg data-[state=closed]:animate-sheet-out data-[state=open]:animate-sheet-in"
        >
          <div className="flex h-16 items-center justify-between border-b border-line px-4">
            <DialogPrimitive.Title className="eyebrow text-fg-muted">Modules</DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close menu">
                <X aria-hidden />
              </Button>
            </DialogPrimitive.Close>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="flex flex-col">
              {[...primaryNav, ...secondaryNav].map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex h-12 items-center gap-4 border-b border-line text-body font-medium transition-colors duration-micro",
                        active ? "text-fg" : "text-fg-secondary hover:text-fg",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "w-6 font-mono text-caption",
                          active ? "text-accent" : "text-fg-muted",
                        )}
                      >
                        {item.index}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={() => {
                close();
                palette.setOpen(true);
              }}
              className="mt-6 flex h-11 w-full items-center gap-3 rounded-sm border border-line bg-surface px-3 text-small text-fg-muted"
            >
              <Search aria-hidden className="size-4" />
              Search pages and actions
            </button>
          </nav>

          <div className="flex flex-col gap-3 border-t border-line p-4">
            <Button asChild size="lg">
              <Link href="/contact" onClick={close}>
                Let&apos;s Connect
              </Link>
            </Button>
            <ResumeLink variant="secondary" size="lg" />
            <div className="mt-2 flex justify-center gap-6 text-small">
              <a
                href={profileLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-fg-secondary hover:text-fg"
              >
                LinkedIn <ArrowUpRight aria-hidden className="size-3.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a
                href={profileLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-fg-secondary hover:text-fg"
              >
                GitHub <ArrowUpRight aria-hidden className="size-3.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a href={profileLinks.emailHref} className="text-fg-secondary hover:text-fg">
                Email
              </a>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
