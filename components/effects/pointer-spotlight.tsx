"use client";

import { useEffect } from "react";

const ENABLED = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/**
 * Feeds the pointer position to the hovered `[data-spotlight]` element as
 * `--spotlight-x` / `--spotlight-y`. The look lives in globals.css. Only
 * listens for mouse/trackpad users who haven't asked for reduced motion,
 * and writes CSS variables once per frame — no React re-renders.
 */
export function PointerSpotlight() {
  useEffect(() => {
    const query = window.matchMedia(ENABLED);
    let latest: PointerEvent | null = null;
    let frame = 0;

    function update() {
      frame = 0;
      const target =
        latest?.target instanceof Element
          ? latest.target.closest<HTMLElement>("[data-spotlight]")
          : null;
      if (!latest || !target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--spotlight-x", `${latest.clientX - rect.left}px`);
      target.style.setProperty("--spotlight-y", `${latest.clientY - rect.top}px`);
    }

    function onMove(event: PointerEvent) {
      latest = event;
      frame ||= requestAnimationFrame(update);
    }

    function sync() {
      if (query.matches) document.addEventListener("pointermove", onMove, { passive: true });
      else document.removeEventListener("pointermove", onMove);
    }

    sync();
    query.addEventListener("change", sync);
    return () => {
      query.removeEventListener("change", sync);
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
