"use client";

import { ServerCrash } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { StatePanel } from "@/components/ui/feedback";

export default function Error({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <Container width="content" className="py-24 md:py-30">
      <StatePanel
        icon={ServerCrash}
        title="Module failed to load"
        description="Something went wrong rendering this page. Retrying usually fixes a temporary problem."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => retry()}>Retry</Button>
            <Button asChild variant="secondary">
              <Link href="/">Go to Home</Link>
            </Button>
          </div>
        }
      />
    </Container>
  );
}
