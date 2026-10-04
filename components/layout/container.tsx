import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const widths = {
  prose: "max-w-prose",
  content: "max-w-content",
  wide: "max-w-wide",
} as const;

type ContainerProps = ComponentProps<"div"> & { width?: keyof typeof widths };

/** Centered column with the responsive side gutter (16 / 24 / 32). */
export function Container({ width = "content", className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-4 md:px-6 xl:px-8", widths[width], className)}
      {...props}
    />
  );
}
