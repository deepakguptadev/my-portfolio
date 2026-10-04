import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { ModuleHeader } from "@/components/layout/module-header";
import { Button } from "@/components/ui/button";
import { primaryNav } from "@/lib/navigation";

export const metadata: Metadata = { title: "Module not found" };

export default function NotFound() {
  return (
    <Container width="wide" className="py-24 md:py-30">
      <ModuleHeader
        level={1}
        index="404"
        path="unresolved"
        title="Module not found"
        lede="This route isn't part of the system — it may not be built yet, or the link is out of date."
      />
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/">Go to Home</Link>
        </Button>
        {primaryNav.slice(0, 3).map((item) => (
          <Button key={item.href} asChild variant="secondary">
            <Link href={item.href}>{item.label}</Link>
          </Button>
        ))}
      </div>
      <p className="mt-8 text-small text-fg-muted">
        Tip: press <kbd className="font-mono text-fg-secondary">⌘K</kbd> or{" "}
        <kbd className="font-mono text-fg-secondary">Ctrl K</kbd> to search every page.
      </p>
    </Container>
  );
}
