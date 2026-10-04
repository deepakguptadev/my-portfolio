import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/**
 * Privacy-light analytics, off unless NEXT_PUBLIC_ANALYTICS=vercel. Both
 * scripts load after the page and send no cookies.
 */
export function Analytics() {
  if (process.env.NEXT_PUBLIC_ANALYTICS !== "vercel") return null;
  return (
    <>
      <VercelAnalytics />
      <SpeedInsights />
    </>
  );
}
