"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./use-theme";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const next = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      aria-label={resolvedTheme ? `Switch to ${next} theme` : "Toggle theme"}
      onClick={() => setTheme(next)}
    >
      {/* Both icons render; CSS shows the right one, so SSR never guesses. */}
      <Sun aria-hidden className="size-5 dark:hidden" />
      <Moon aria-hidden className="hidden size-5 dark:block" />
    </Button>
  );
}
