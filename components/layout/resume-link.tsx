import { Download } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { profileLinks } from "@/lib/profile-links";

type ResumeLinkProps = Omit<ComponentProps<typeof Button>, "asChild" | "children"> & {
  /** Short label for tight spaces like the header. */
  compact?: boolean;
};

/** Opens the resume PDF in a new tab, where it can be viewed or saved. */
export function ResumeLink({ compact = false, ...props }: ResumeLinkProps) {
  return (
    <Button asChild {...props}>
      <a href={profileLinks.resumeUrl} target="_blank" rel="noopener noreferrer">
        <Download aria-hidden />
        {compact ? "Resume" : "Download Resume"}
        <span className="sr-only"> (PDF, opens in a new tab)</span>
      </a>
    </Button>
  );
}
