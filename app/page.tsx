import { ContactCta } from "@/components/home/contact-cta";
import { EcosystemPreview } from "@/components/home/ecosystem-preview";
import { EngineeringDna } from "@/components/home/engineering-dna";
import { Hero } from "@/components/home/hero";
import { JourneyPreview } from "@/components/home/journey-preview";
import { LabTeaser } from "@/components/home/lab-teaser";
import { NotesPreview } from "@/components/home/notes-preview";
import { Practice } from "@/components/home/practice";
import { RecruiterSnapshot } from "@/components/home/recruiter-snapshot";
import { SelectedProjects } from "@/components/home/selected-projects";
import { JsonLd } from "@/components/seo/json-ld";
import { personJsonLd, websiteJsonLd } from "@/lib/json-ld";

export default function Home() {
  return (
    <>
      <JsonLd data={personJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <Hero />
      <RecruiterSnapshot />
      <EngineeringDna />
      <SelectedProjects />
      <JourneyPreview />
      <LabTeaser />
      <Practice />
      <EcosystemPreview />
      <NotesPreview />
      <ContactCta />
    </>
  );
}
