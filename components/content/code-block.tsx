"use client";

import { Check, Copy } from "lucide-react";
import { useRef, useState, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** <pre> from rehype-pretty-code, with a copy button. */
export function Pre({ className, children, ...props }: ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = ref.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (permissions/insecure context): leave state unchanged.
    }
  }

  return (
    <div className="group relative">
      <pre
        ref={ref}
        className={cn(
          "overflow-x-auto rounded-md border border-line bg-canvas-alt py-4 font-mono text-code",
          className,
        )}
        {...props}
      >
        {children}
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute top-2.5 right-2.5 flex size-8 items-center justify-center rounded-sm border border-line bg-surface text-fg-muted opacity-0 transition-opacity duration-micro group-hover:opacity-100 hover:text-fg focus-visible:opacity-100 pointer-coarse:opacity-100"
      >
        {copied ? (
          <Check aria-hidden className="size-4 text-success" />
        ) : (
          <Copy aria-hidden className="size-4" />
        )}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Code copied to clipboard" : ""}
      </span>
    </div>
  );
}
