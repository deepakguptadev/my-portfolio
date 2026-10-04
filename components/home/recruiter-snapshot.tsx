import { CopyEmailButton } from "@/components/content/copy-email-button";
import { SpecRows } from "@/components/content/spec-rows";
import { ModuleHeader } from "@/components/layout/module-header";
import { ResumeLink } from "@/components/layout/resume-link";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { profile } from "@/content/profile";

export function RecruiterSnapshot() {
  return (
    <Section width="wide" aria-labelledby="snapshot-title">
      <ModuleHeader
        index="01"
        path="/snapshot"
        title="Recruiter snapshot"
        id="snapshot-title"
        actions={
          <>
            <CopyEmailButton size="sm" />
            <ResumeLink compact variant="secondary" size="sm" />
          </>
        }
      />
      <SpecRows
        rows={[
          { label: "Experience", value: `${profile.experienceYears} Years` },
          { label: "Primary stack", value: "React / Next.js / TypeScript" },
          { label: "Backend", value: profile.backendStack.join(" / ") },
          { label: "Location", value: profile.location },
          { label: "Availability", value: <Badge tone="success">{profile.availability}</Badge> },
          { label: "Work mode", value: profile.workModes.join(" / ") },
        ]}
      />
    </Section>
  );
}
