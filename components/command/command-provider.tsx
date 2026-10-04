"use client";

import dynamic from "next/dynamic";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

// The palette (and cmdk) load only when first needed.
const loadPalette = () => import("./command-palette");
const CommandPalette = dynamic(loadPalette, { ssr: false });

type CommandContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Warm the palette chunk, e.g. on trigger hover/focus. */
  preload: () => void;
};

const CommandContext = createContext<CommandContextValue | null>(null);

export function useCommandPalette() {
  const context = useContext(CommandContext);
  if (!context) throw new Error("useCommandPalette must be used inside CommandProvider");
  return context;
}

export function CommandProvider({ children }: { children: ReactNode }) {
  const [open, setOpenState] = useState(false);
  // Mount the lazy palette after first use so its chunk isn't in the initial load.
  const [mounted, setMounted] = useState(false);
  // The palette opens programmatically (no Radix Trigger), so remember
  // where focus was and restore it on close.
  const returnFocus = useRef<HTMLElement | null>(null);

  const setOpen = useCallback((next: boolean) => {
    if (next) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setMounted(true);
    }
    setOpenState(next);
  }, []);

  const restoreFocus = useCallback(() => {
    returnFocus.current?.focus();
    returnFocus.current = null;
  }, []);

  const preload = useCallback(() => {
    void loadPalette();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey) && !event.altKey) {
        event.preventDefault();
        setOpenState((current) => {
          if (!current) returnFocus.current = document.activeElement as HTMLElement | null;
          return !current;
        });
        setMounted(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);

    // Warm the chunk when the browser is idle so the first ⌘K is instant
    // and early keystrokes aren't lost while it downloads.
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 2000));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(() => void loadPalette());

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      cancelIdle(handle);
    };
  }, []);

  return (
    <CommandContext.Provider value={{ open, setOpen, preload }}>
      {children}
      {mounted && (
        <CommandPalette open={open} onOpenChange={setOpen} onCloseAutoFocus={restoreFocus} />
      )}
    </CommandContext.Provider>
  );
}
