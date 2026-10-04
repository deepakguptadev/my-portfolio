import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { CommandProvider } from "@/components/command/command-provider";
import { PointerSpotlight } from "@/components/effects/pointer-spotlight";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { ThemeScript } from "@/components/theme/theme-script";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@/components/seo/analytics";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.title}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: { siteName: siteConfig.name, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-dvh flex-col bg-canvas font-sans text-fg">
        <SkipLink />
        {/* Scroll progress on every page: CSS scroll-driven, no JavaScript; hidden where unsupported. */}
        <div aria-hidden className="scroll-progress print:hidden" />
        <CommandProvider>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
            {children}
          </main>
          <SiteFooter />
        </CommandProvider>
        <Toaster />
        <PointerSpotlight />
        <ScrollToTop />
        <Analytics />
      </body>
    </html>
  );
}
