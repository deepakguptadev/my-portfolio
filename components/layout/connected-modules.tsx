import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ModuleRef } from "@/lib/schemas/common";
import { Container } from "./container";

/** "Connected modules" strip: every page links onward into the system. */
export function ConnectedModules({ items }: { items: ModuleRef[] }) {
  if (items.length === 0) return null;
  return (
    <aside aria-labelledby="connected-modules" className="pb-16 md:pb-24 print:hidden">
      <Container width="wide">
        <div className="border-t border-line pt-10">
          <h2 id="connected-modules" className="mb-4 eyebrow text-fg-muted">
            Connected modules
          </h2>
          <ul className="flex flex-wrap gap-3">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex h-10 items-center gap-2 rounded-sm border border-line bg-surface px-4 text-small font-medium text-fg transition-colors duration-micro hover:border-line-strong"
                >
                  {item.label} <ArrowRight aria-hidden className="size-4 text-fg-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </aside>
  );
}
