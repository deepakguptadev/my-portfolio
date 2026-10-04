"use client";

import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export const overlayClasses =
  "fixed inset-0 z-overlay bg-canvas/60 backdrop-blur-[4px] data-[state=open]:animate-overlay-in data-[state=closed]:animate-fade-out";

type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  title: ReactNode;
  description?: ReactNode;
  /** Visually hide the title (still announced). */
  hideTitle?: boolean;
};

export function DialogContent({
  title,
  description,
  hideTitle = false,
  className,
  children,
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={overlayClasses} />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-1/2 left-1/2 z-modal w-[calc(100vw-32px)] max-w-lg -translate-x-1/2 -translate-y-1/2",
          "rounded-lg border border-line bg-surface p-6 shadow-lg",
          "data-[state=open]:animate-dialog-in",
          "data-[state=closed]:animate-fade-out",
          className,
        )}
        {...props}
      >
        <div className="mb-4 pr-10">
          <DialogPrimitive.Title className={cn("text-h4 text-fg", hideTitle && "sr-only")}>
            {title}
          </DialogPrimitive.Title>
          {description && (
            <DialogPrimitive.Description className="mt-2 text-small text-fg-secondary">
              {description}
            </DialogPrimitive.Description>
          )}
        </div>
        {children}
        <DialogPrimitive.Close asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Close"
            className="absolute top-4 right-4"
          >
            <X aria-hidden />
          </Button>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
