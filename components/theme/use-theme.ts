"use client";

import { useCallback, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type ResolvedTheme, type ThemePreference } from "./theme-constants";

const CHANGE_EVENT = "themechange";
const DARK_QUERY = "(prefers-color-scheme: dark)";

function readPreference(): ThemePreference {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

function readResolved(): ResolvedTheme {
  const preference = readPreference();
  if (preference !== "system") return preference;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia(DARK_QUERY);
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  media.addEventListener("change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
    media.removeEventListener("change", onChange);
  };
}

/** Swaps colors without animating every transition-colors element. */
function withoutTransitions(apply: () => void) {
  const style = document.createElement("style");
  style.textContent = "*,*::before,*::after{transition:none!important}";
  document.head.appendChild(style);
  apply();
  // Force a style flush before re-enabling transitions.
  void window.getComputedStyle(document.body).opacity;
  requestAnimationFrame(() => style.remove());
}

export function applyThemePreference(preference: ThemePreference) {
  withoutTransitions(() => {
    try {
      if (preference === "system") localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {
      // Storage unavailable: the choice still applies for this page view.
    }
    const root = document.documentElement;
    if (preference === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", preference);
  });
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Theme state backed by localStorage + the OS preference.
 * During SSR and hydration `resolvedTheme` is null (unknown on the server).
 */
export function useTheme() {
  const preference = useSyncExternalStore<ThemePreference>(
    subscribe,
    readPreference,
    () => "system",
  );
  const resolvedTheme = useSyncExternalStore<ResolvedTheme | null>(
    subscribe,
    readResolved,
    () => null,
  );

  const setTheme = useCallback((next: ThemePreference) => applyThemePreference(next), []);

  return { preference, resolvedTheme, setTheme };
}
