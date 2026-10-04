"use client";

import { Command as Cmdk } from "cmdk";
import {
  ArrowRight,
  Copy,
  CornerDownLeft,
  ExternalLink,
  Monitor,
  Moon,
  Search,
  SunMedium,
  SwatchBook,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog as DialogPrimitive } from "radix-ui";
import { applyThemePreference, useTheme } from "@/components/theme/use-theme";
import { overlayClasses } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toaster";
import { commandGroups, commandsByGroup, type Command } from "@/lib/commands";

function iconFor(command: Command): LucideIcon {
  const { action } = command;
  if (action.type === "navigate") return ArrowRight;
  if (action.type === "copy") return Copy;
  if (action.type === "external") return ExternalLink;
  if (action.theme === "light") return SunMedium;
  if (action.theme === "dark") return Moon;
  if (action.theme === "system") return Monitor;
  return SwatchBook;
}

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Restores focus to wherever the palette was opened from. */
  onCloseAutoFocus: () => void;
};

export default function CommandPalette({
  open,
  onOpenChange,
  onCloseAutoFocus,
}: CommandPaletteProps) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  function run(command: Command) {
    onOpenChange(false);
    const { action } = command;
    switch (action.type) {
      case "navigate":
        router.push(action.href);
        break;
      case "external":
        if (action.newTab) window.open(action.href, "_blank", "noopener,noreferrer");
        else window.location.assign(action.href);
        break;
      case "copy":
        navigator.clipboard.writeText(action.value).then(
          () => toast.success(action.message),
          () => toast.error(`Couldn't copy. The address is ${action.value}`),
        );
        break;
      case "theme":
        applyThemePreference(
          action.theme === "toggle" ? (resolvedTheme === "dark" ? "light" : "dark") : action.theme,
        );
        break;
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={overlayClasses} />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            onCloseAutoFocus();
          }}
          className="fixed top-[12vh] left-1/2 z-palette w-[calc(100vw-32px)] max-w-160 -translate-x-1/2 overflow-hidden rounded-lg border border-line bg-surface shadow-lg data-[state=closed]:animate-fade-out data-[state=open]:animate-dialog-in"
        >
          <DialogPrimitive.Title className="sr-only">Command palette</DialogPrimitive.Title>
          <Cmdk label="Command palette" loop className="flex max-h-[min(70vh,520px)] flex-col">
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search aria-hidden className="size-4 shrink-0 text-fg-muted" />
              <Cmdk.Input
                autoFocus
                placeholder="Search pages and actions…"
                className="h-13 w-full bg-transparent text-body text-fg outline-none placeholder:text-fg-muted"
              />
            </div>
            <Cmdk.List className="overflow-y-auto overscroll-contain p-2">
              <Cmdk.Empty className="px-3 py-10 text-center text-small text-fg-muted">
                No matching pages or actions.
              </Cmdk.Empty>
              {commandGroups.map((group) => (
                <Cmdk.Group
                  key={group}
                  heading={group}
                  className="mb-1 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:eyebrow [&_[cmdk-group-heading]]:text-fg-muted"
                >
                  {commandsByGroup(group).map((command) => {
                    const Icon = iconFor(command);
                    return (
                      <Cmdk.Item
                        key={command.id}
                        value={command.label}
                        keywords={command.keywords}
                        onSelect={() => run(command)}
                        className="group relative flex h-10 cursor-pointer items-center gap-3 rounded-sm px-3 text-small text-fg-secondary select-none data-[selected=true]:bg-surface-2 data-[selected=true]:text-fg"
                      >
                        <span
                          aria-hidden
                          className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent opacity-0 group-data-[selected=true]:opacity-100"
                        />
                        <Icon aria-hidden className="size-4 text-fg-muted" />
                        <span className="flex-1">{command.label}</span>
                        <CornerDownLeft
                          aria-hidden
                          className="size-3.5 text-fg-muted opacity-0 group-data-[selected=true]:opacity-100"
                        />
                      </Cmdk.Item>
                    );
                  })}
                </Cmdk.Group>
              ))}
            </Cmdk.List>
            <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 font-mono text-caption text-fg-muted">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc close</span>
            </div>
          </Cmdk>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
