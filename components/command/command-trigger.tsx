"use client";

import { Search } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { useCommandPalette } from "./command-provider";

const subscribe = () => () => {};
const isApplePlatform = () => /Mac|iPhone|iPad/.test(navigator.userAgent);

/** Shows ⌘K on Apple platforms and Ctrl K elsewhere (⌘K during SSR). */
export function useShortcutLabel() {
  const apple = useSyncExternalStore(subscribe, isApplePlatform, () => true);
  return apple ? "⌘K" : "Ctrl K";
}

export function CommandTrigger({ className }: { className?: string }) {
  const { setOpen, preload } = useCommandPalette();
  const shortcut = useShortcutLabel();

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      onPointerEnter={preload}
      onFocus={preload}
      aria-haspopup="dialog"
      aria-keyshortcuts="Meta+K Control+K"
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-sm border border-line bg-surface pr-1.5 pl-2.5 text-small text-fg-muted",
        "transition-colors duration-micro ease-standard hover:border-line-strong hover:text-fg",
        className,
      )}
    >
      <Search aria-hidden className="size-3.5" />
      <span>Search</span>
      <kbd className="ml-3 rounded-xs border border-line bg-surface-2 px-1.5 font-mono text-caption text-fg-secondary">
        {shortcut}
      </kbd>
    </button>
  );
}
