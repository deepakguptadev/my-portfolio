"use client";

import { Toaster as Sonner } from "sonner";

export { toast } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      duration={4000}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-[calc(100vw-32px)] items-center gap-3 rounded-md border border-line bg-surface px-4 py-3 text-small text-fg shadow-lg sm:w-90",
          description: "text-fg-secondary",
          icon: "text-success",
        },
      }}
      style={{ zIndex: "var(--z-toast)" }}
    />
  );
}
