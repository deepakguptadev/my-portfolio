"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * Every new page starts at the top. Next.js keeps the previous scroll
 * position when the new page is already in the viewport (see the Link
 * `scroll` docs), which lands visitors mid-page after a short scroll.
 *
 * Left alone: back/forward (the restored position wins), links to an
 * `#anchor`, and query-only changes on the same page such as tabs.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const previous = useRef(pathname);
  const traversedTo = useRef<string | null>(null);

  useEffect(() => {
    // popstate fires after the URL changes, before the new page renders.
    const onPopState = () => {
      traversedTo.current = window.location.pathname;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Layout effect: reset before the new page paints, so it never flashes mid-page.
  useLayoutEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    const traversal = traversedTo.current === pathname;
    traversedTo.current = null;
    if (traversal || window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
