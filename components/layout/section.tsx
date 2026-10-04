import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";

type SectionProps = ComponentProps<"section"> & {
  width?: ComponentProps<typeof Container>["width"];
  /** Draws the full-width hairline rule above the module. */
  ruled?: boolean;
};

/**
 * Page module with the vertical rhythm 64 / 96 / 120. A ruled module
 * starts at its hairline (the rule replaces top padding), so stacked
 * modules sit one bottom-padding apart rather than two.
 */
export function Section({ width, ruled = true, className, children, ...props }: SectionProps) {
  return (
    <section
      className={cn("pb-16 md:pb-24 xl:pb-30", !ruled && "pt-16 md:pt-24 xl:pt-30", className)}
      {...props}
    >
      <Container width={width}>
        {ruled && <div aria-hidden className="mb-12 border-t border-line md:mb-16" />}
        {children}
      </Container>
    </section>
  );
}
