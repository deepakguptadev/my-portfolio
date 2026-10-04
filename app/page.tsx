import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

// Temporary shell until the home modules land (roadmap M5).
export default function Home() {
  return (
    <main id="main" tabIndex={-1} className="flex flex-1 items-center py-24 outline-none">
      <Container width="wide">
        <p className="mb-6 eyebrow text-accent">Senior Software Engineer</p>
        <h1 className="max-w-[14ch] text-display text-fg">
          Building scalable, high-performance web experiences.
        </h1>
        <p className="mt-6 max-w-[52ch] text-body-lg text-fg-secondary">
          I&apos;m Deepak Gupta, a Senior Software Engineer with 7+ years of experience building
          production-grade frontend and full-stack applications.
        </p>
        {process.env.NODE_ENV !== "production" && (
          <div className="mt-10">
            <Button asChild variant="secondary">
              <Link href="/design-system">Open design system</Link>
            </Button>
          </div>
        )}
      </Container>
    </main>
  );
}
