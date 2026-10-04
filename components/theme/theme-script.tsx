import { THEME_STORAGE_KEY } from "./theme-constants";

/**
 * Runs synchronously in <head> before first paint, so a stored
 * light/dark preference applies without a flash. With no stored value
 * (or "system"), no attribute is set and CSS follows the OS via
 * `color-scheme: light dark`.
 */
const script = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export function ThemeScript() {
  // Executable on the server render; inert ("text/plain") when React renders
  // it on the client, which avoids React 19's script-tag warning (per the
  // Next.js "preventing flash before hydration" guide).
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
