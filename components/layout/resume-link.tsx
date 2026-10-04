import { Download, Mail } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { profileLinks } from "@/lib/profile-links";

type ResumeLinkProps = Omit<ComponentProps<typeof Button>, "asChild" | "children"> & {
  /** Short label for tight spaces like the header. */
  compact?: boolean;
};

/**
 * Downloads the configured resume, or — until a PDF is supplied — opens a
 * pre-addressed email asking for it. Never renders a dead link.
 */
export function ResumeLink({ compact = false, ...props }: ResumeLinkProps) {
  const { resumeUrl, resumeRequestHref } = profileLinks;

  if (resumeUrl) {
    return (
      <Button asChild {...props}>
        <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
          <Download aria-hidden />
          {compact ? "Resume" : "Download Resume"}
          <span className="sr-only"> (PDF, opens in a new tab)</span>
        </a>
      </Button>
    );
  }

  return (
    <Button asChild {...props}>
      <a href={resumeRequestHref}>
        <Mail aria-hidden />
        {compact ? "Resume" : "Request Resume"}
        <span className="sr-only"> by email</span>
      </a>
    </Button>
  );
}
