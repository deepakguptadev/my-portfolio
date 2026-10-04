import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  ArrowRight,
  Boxes,
  Cloud,
  Database,
  Download,
  FileSearch,
  Inbox,
  Mail,
  Plus,
  ServerCrash,
  Webhook,
} from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ContentRequired } from "@/components/content/content-required";
import { SpecRows } from "@/components/content/spec-rows";
import { ModuleHeader } from "@/components/layout/module-header";
import { Section } from "@/components/layout/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert } from "@/components/ui/alert";
import { Badge, Tag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton, StatePanel } from "@/components/ui/feedback";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip } from "@/components/ui/tooltip";
import { getNote, getNotes, getProjects } from "@/lib/content";
import { parseColorTokens } from "@/lib/tokens";
import { FormDemo, ToastDemo } from "./demos";

export const metadata: Metadata = {
  title: "Design System",
  robots: { index: false, follow: false },
};

const enabled = process.env.NODE_ENV !== "production" || process.env.SHOW_DESIGN_SYSTEM === "true";

const typeScale = [
  ["text-display", "Display", "64 / 1.05 → 40"],
  ["text-h1", "Heading 1", "48 / 1.15 → 34"],
  ["text-h2", "Heading 2", "40 / 1.15 → 28"],
  ["text-h3", "Heading 3", "32 / 1.15 → 24"],
  ["text-h4", "Heading 4", "24 / 1.2 → 20"],
  ["text-body-lg", "Body large", "20 / 1.6 → 18"],
  ["text-body", "Body", "16 / 1.6"],
  ["text-small", "Small", "14 / 1.5"],
  ["text-caption", "Caption", "12 / 1.4"],
  ["font-mono text-code", "const code = true;", "14 / 1.5 → 13"],
] as const;

const spacing = [
  ["w-1", 4],
  ["w-2", 8],
  ["w-3", 12],
  ["w-4", 16],
  ["w-5", 20],
  ["w-6", 24],
  ["w-8", 32],
  ["w-10", 40],
  ["w-12", 48],
  ["w-16", 64],
  ["w-20", 80],
  ["w-24", 96],
  ["w-30", 120],
  ["w-40", 160],
] as const;

const radii = [
  ["rounded-xs", "xs · 4"],
  ["rounded-sm", "sm · 6"],
  ["rounded-md", "md · 10"],
  ["rounded-lg", "lg · 14"],
  ["rounded-xl", "xl · 20"],
  ["rounded-full", "full"],
] as const;

const motion = [
  ["Micro", "--dur-micro", "120ms", "Hover, press"],
  ["Small", "--dur-small", "200ms", "Tooltips, tabs, toggles"],
  ["Medium", "--dur-medium", "320ms", "Accordions, drawers, palette"],
  ["Large", "--dur-large", "520ms", "Section reveal, path trace"],
] as const;

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-12 first:mt-0">
      <h3 className="mb-4 eyebrow text-fg-muted">{title}</h3>
      {children}
    </div>
  );
}

export default async function DesignSystemPage() {
  if (!enabled) notFound();

  const colors = parseColorTokens(readFileSync(join(process.cwd(), "styles/tokens.css"), "utf8"));
  const [sampleNote, notes, projects] = await Promise.all([
    getNote("nextjs-rendering-strategies"),
    getNotes(),
    getProjects(),
  ]);

  return (
    <div>
      <Section width="wide" ruled={false} className="pb-0 md:pb-0 xl:pb-0">
        <ModuleHeader
          level={1}
          index="00"
          path="/design-system"
          title="Design system"
          lede="Tokens, components and states for the engineering-system portfolio. Every value here comes from styles/tokens.css."
        />
      </Section>

      <Section width="wide" aria-labelledby="ds-color">
        <ModuleHeader index="01" path="tokens/color" title="Color" id="ds-color" />
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {colors.map((token) => (
            <li
              key={token.name}
              className="overflow-hidden rounded-md border border-line bg-surface"
            >
              <div
                className="h-16 border-b border-line"
                style={{ background: `var(--${token.name})` }}
              />
              <div className="px-3 py-2.5">
                <p className="font-mono text-caption text-fg">--{token.name}</p>
                <p className="font-mono text-caption text-fg-muted">
                  {token.light} · {token.dark}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section width="wide" aria-labelledby="ds-type">
        <ModuleHeader
          index="02"
          path="tokens/type"
          title="Typography"
          id="ds-type"
          lede="Inter for content, JetBrains Mono for labels, metadata and code. Sizes scale fluidly between 390px and 1280px."
        />
        <ul className="divide-y divide-line border-y border-line">
          {typeScale.map(([className, sample, spec]) => (
            <li
              key={className}
              className="grid gap-2 py-5 md:grid-cols-[200px_1fr] md:items-baseline"
            >
              <span className="font-mono text-caption text-fg-muted">
                {className.replace("font-mono ", "")} · {spec}
              </span>
              <span className={`${className} truncate text-fg`}>{sample}</span>
            </li>
          ))}
        </ul>
        <Block title="Overline">
          <p className="eyebrow text-fg-muted">02 — /experience</p>
        </Block>
      </Section>

      <Section width="wide" aria-labelledby="ds-space">
        <ModuleHeader
          index="03"
          path="tokens/space"
          title="Spacing, radius, elevation"
          id="ds-space"
        />
        <Block title="Spacing (px)">
          <ul className="flex flex-col gap-2">
            {spacing.map(([width, px]) => (
              <li key={px} className="flex items-center gap-4">
                <span className="w-10 text-right font-mono text-caption text-fg-muted">{px}</span>
                <span className={`${width} h-3 rounded-xs bg-accent`} />
              </li>
            ))}
          </ul>
        </Block>
        <Block title="Radius">
          <div className="flex flex-wrap gap-4">
            {radii.map(([className, label]) => (
              <div key={className} className="flex flex-col items-center gap-2">
                <div className={`${className} size-20 border border-line-strong bg-surface-2`} />
                <span className="font-mono text-caption text-fg-muted">{label}</span>
              </div>
            ))}
          </div>
        </Block>
        <Block title="Elevation (overlays only)">
          <div className="flex flex-wrap gap-6">
            {(["shadow-sm", "shadow-md", "shadow-lg"] as const).map((shadow) => (
              <div
                key={shadow}
                className={`${shadow} flex h-24 w-40 items-end rounded-md border border-line bg-surface p-3 font-mono text-caption text-fg-muted`}
              >
                {shadow}
              </div>
            ))}
          </div>
        </Block>
        <Block title="Icons (Lucide, 2px stroke)">
          <div className="flex flex-wrap items-end gap-6 text-fg-secondary">
            {[12, 14, 16, 20, 24, 32, 40, 48].map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Boxes aria-hidden size={size} strokeWidth={size >= 32 ? 1.75 : 2} />
                <span className="font-mono text-caption text-fg-muted">{size}</span>
              </div>
            ))}
          </div>
        </Block>
        <Block title="Diagram canvas">
          <div className="flex h-40 items-center justify-center gap-6 rounded-md border border-line bg-canvas-alt bg-dot-grid">
            <span className="flex h-11 items-center gap-2 rounded-sm border border-line-strong bg-surface px-3.5 text-small font-medium text-fg-secondary">
              <Webhook aria-hidden className="size-3.5" /> APIs
            </span>
            <span className="h-px w-12 bg-accent" />
            <span className="flex h-11 items-center gap-2 rounded-sm border-[1.5px] border-accent bg-accent-soft px-3.5 text-small font-medium text-fg">
              <Database aria-hidden className="size-3.5" /> Database
            </span>
            <span className="flex h-11 items-center gap-2 rounded-sm border border-dashed border-line-strong bg-surface px-3.5 text-small font-medium text-fg-secondary opacity-35">
              <Cloud aria-hidden className="size-3.5" /> External
            </span>
          </div>
        </Block>
      </Section>

      <Section width="wide" aria-labelledby="ds-buttons">
        <ModuleHeader
          index="04"
          path="components/button"
          title="Buttons, badges, tags"
          id="ds-buttons"
        />
        <Block title="Variants">
          <div className="flex flex-wrap items-center gap-3">
            <Button>
              Explore Engineering <ArrowRight aria-hidden />
            </Button>
            <Button variant="secondary">View Resume</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="text">Text link</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="secondary" size="icon" aria-label="Email">
              <Mail aria-hidden />
            </Button>
          </div>
        </Block>
        <Block title="Sizes">
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small · 32</Button>
            <Button size="md">Medium · 40</Button>
            <Button size="lg">Large · 48</Button>
            <Button size="icon-sm" variant="ghost" aria-label="Add">
              <Plus aria-hidden />
            </Button>
          </div>
        </Block>
        <Block title="States (hover, focus with Tab, press interactively)">
          <div className="flex flex-wrap items-center gap-3">
            <Button disabled>Disabled</Button>
            <Button loading>Sending…</Button>
            <Button variant="secondary" disabled>
              <Download aria-hidden /> Resume
            </Button>
          </div>
        </Block>
        <Block title="Badges and tags">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>7+ Years Experience</Badge>
            <Badge>React.js</Badge>
            <Badge tone="accent">Selected</Badge>
            <Badge tone="success">Immediate Joiner</Badge>
            <Badge tone="warning">Draft</Badge>
            <Badge tone="outline">Sample</Badge>
            <Tag>TypeScript</Tag>
            <Tag>React Query</Tag>
          </div>
        </Block>
      </Section>

      <Section width="wide" aria-labelledby="ds-content">
        <ModuleHeader
          index="05"
          path="components/content"
          title="Content patterns"
          id="ds-content"
        />
        <Block title="Module header">
          <div className="rounded-md border border-dashed border-line p-6">
            <ModuleHeader
              index="02"
              path="/experience"
              title="Engineering journey"
              lede="Seven years of building production web applications, from feature work to frontend architecture."
              actions={<Button variant="secondary">Download Resume</Button>}
              className="mb-0 md:mb-0"
            />
          </div>
        </Block>
        <Block title="Spec rows — recruiter snapshot">
          <SpecRows
            rows={[
              { label: "Experience", value: "7+ Years" },
              { label: "Primary stack", value: "React / Next.js / TypeScript" },
              { label: "Backend", value: "Node.js / Express / NestJS" },
              { label: "Location", value: "Delhi NCR" },
              { label: "Availability", value: <Badge tone="success">Immediate Joiner</Badge> },
              { label: "Work mode", value: "Remote / Hybrid / Relocation" },
            ]}
          />
        </Block>
        <Block title="Content required / placeholder">
          <div className="grid gap-4 md:grid-cols-2">
            <ContentRequired hint="Role and scope on the Quality Inspection Platform." />
            <ContentRequired kind="placeholder" hint="Sample note outline — not yet published." />
          </div>
          <p className="mt-4 text-body text-fg-secondary">
            Institution: <ContentRequired inline />
          </p>
        </Block>
      </Section>

      <Section width="wide" aria-labelledby="ds-forms">
        <ModuleHeader
          index="06"
          path="components/form"
          title="Forms"
          id="ds-forms"
          lede="Labels are always visible, required fields say so in text, and errors are linked to their control."
        />
        <FormDemo />
      </Section>

      <Section width="wide" aria-labelledby="ds-feedback">
        <ModuleHeader index="07" path="components/feedback" title="Feedback" id="ds-feedback" />
        <Block title="Alerts">
          <div className="grid gap-3 md:grid-cols-2">
            <Alert tone="info" title="The contact form is being set up">
              Email me directly in the meantime.
            </Alert>
            <Alert tone="success" title="Message sent">
              I&apos;ll get back to you soon.
            </Alert>
            <Alert tone="warning" title="Sample content">
              This note is an outline and not yet published.
            </Alert>
            <Alert
              tone="error"
              title="Message failed to send"
              action={
                <Button size="sm" variant="secondary">
                  Try again
                </Button>
              }
            >
              Your message is preserved. You can also email me directly.
            </Alert>
          </div>
        </Block>
        <Block title="States">
          <div className="grid gap-4 md:grid-cols-3">
            <StatePanel
              icon={FileSearch}
              title="No projects match React Native"
              description="Try another technology or clear the filters."
              action={
                <Button size="sm" variant="secondary">
                  Clear filters
                </Button>
              }
            />
            <StatePanel
              icon={ServerCrash}
              title="Module failed to load"
              description="Something went wrong rendering this section."
              action={
                <Button size="sm" variant="secondary">
                  Retry
                </Button>
              }
            />
            <StatePanel icon={Inbox} title="Message sent" description="Thanks for reaching out." />
          </div>
        </Block>
        <Block title="Loading">
          <div className="flex items-center gap-6">
            <Spinner label="Loading" className="size-5 text-fg-muted" />
            <div className="flex w-64 flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <ToastDemo />
          </div>
        </Block>
      </Section>

      <Section width="wide" aria-labelledby="ds-disclosure">
        <ModuleHeader
          index="08"
          path="components/disclosure"
          title="Overlays and disclosure"
          id="ds-disclosure"
        />
        <Block title="Dialog and tooltip">
          <div className="flex flex-wrap items-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Open dialog</Button>
              </DialogTrigger>
              <DialogContent title="Download resume" description="The PDF opens in a new tab.">
                <div className="mt-6 flex justify-end gap-3">
                  <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                  </DialogClose>
                  <Button>
                    <Download aria-hidden /> Download
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Tooltip content="Copies dkgupta5000@gmail.com">
              <Button variant="ghost">Hover or focus me</Button>
            </Tooltip>
          </div>
        </Block>
        <Block title="Tabs">
          <Tabs defaultValue="overview">
            <TabsList aria-label="Resume sections">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
            </TabsList>
            {["overview", "experience", "skills", "projects", "education"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <p className="text-fg-secondary">Panel content for {tab}.</p>
              </TabsContent>
            ))}
          </Tabs>
        </Block>
        <Block title="Accordion">
          <Accordion type="single" collapsible className="border-t border-line">
            <AccordionItem value="mf">
              <AccordionTrigger>Module Federation</AccordionTrigger>
              <AccordionContent>
                Remotes expose modules at runtime; the host loads them on demand and shares
                singleton dependencies like React.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="deploy">
              <AccordionTrigger>Independent deployment</AccordionTrigger>
              <AccordionContent>
                Each remote ships on its own pipeline, so teams release without coordinating a
                monolith build.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Block>
      </Section>

      <Section width="wide" aria-labelledby="ds-motion">
        <ModuleHeader
          index="09"
          path="tokens/motion"
          title="Motion"
          id="ds-motion"
          lede="Motion explains relationships or confirms actions. Durations collapse to near zero under prefers-reduced-motion."
        />
        <SpecRows
          columns={2}
          rows={motion.map(([name, token, value, use]) => ({
            label: `${name} · ${token}`,
            value: (
              <span>
                {value} <span className="font-normal text-fg-muted">— {use}</span>
              </span>
            ),
          }))}
        />
      </Section>
      <Section width="wide" aria-labelledby="ds-mdx">
        <ModuleHeader
          index="10"
          path="content/mdx"
          title="MDX prose"
          id="ds-mdx"
          lede={`Loaded through the typed content layer: ${projects.length} project and ${notes.length} notes validated at build time.`}
        />
        {sampleNote && (
          <article className="max-w-prose">
            <p className="mb-6 font-mono text-caption text-fg-muted">
              {sampleNote.meta.title} · {sampleNote.readingMinutes} min ·{" "}
              {sampleNote.headings.length} headings
            </p>
            <sampleNote.Content />
          </article>
        )}
      </Section>
    </div>
  );
}
