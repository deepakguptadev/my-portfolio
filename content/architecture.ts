import { z } from "zod";
import { defineContent, slug } from "@/lib/schemas/common";
import { graphs, type GraphId } from "./graphs";

const labModuleSchema = z.object({
  id: slug,
  label: z.string(),
  graphId: z.string().refine((id) => id in graphs, "Unknown graph id"),
  intro: z.string(),
  concepts: z.array(z.object({ title: z.string(), body: z.string() })).min(1),
});

const architectureSchema = z.object({
  modules: z.array(labModuleSchema).min(1),
  renderingMatrix: z.object({
    columns: z.array(z.string()),
    rows: z.array(z.object({ label: z.string(), values: z.array(z.string()) })),
  }),
  repoStrategies: z.object({
    columns: z.array(z.string()),
    rows: z.array(z.object({ label: z.string(), values: z.array(z.string()) })),
  }),
});

export const architecture = defineContent("architecture", architectureSchema, {
  modules: [
    {
      id: "react",
      label: "React Architecture",
      graphId: "react-architecture",
      intro:
        "Large React codebases stay healthy when dependencies point one way: pages compose features, features use shared components and hooks, and only the API layer talks to the backend.",
      concepts: [
        {
          title: "Feature modules",
          body: "Group code by business capability, not by file type. A feature owns its components, hooks, state and tests, and exposes a small public surface.",
        },
        {
          title: "Dependency direction",
          body: "Shared components must never import from features. Enforcing this (lint rules or path boundaries) is what keeps a design system reusable.",
        },
        {
          title: "Server state vs client state",
          body: "Data fetched from the backend belongs in a query cache with explicit invalidation. Only genuinely client-side state — UI toggles, multi-step workflows — needs a store.",
        },
        {
          title: "The API layer",
          body: "Typed client functions centralize auth headers, error mapping and retries, so a backend change touches one layer instead of fifty components.",
        },
      ],
    },
    {
      id: "nextjs",
      label: "Next.js Rendering",
      graphId: "nextjs-rendering",
      intro:
        "Rendering strategy is a per-route decision: how fresh the data must be, how personalized the page is, and how much JavaScript the user should download.",
      concepts: [
        {
          title: "Server Components by default",
          body: "Server Components render on the server and ship no component JavaScript. Interactivity is added with Client Components only where needed.",
        },
        {
          title: "Static first",
          body: "Prerender whatever you can at build time and serve it from the CDN. Use ISR or on-demand revalidation when content changes occasionally.",
        },
        {
          title: "Dynamic when it must be",
          body: "Per-request rendering is for personalized or real-time pages. Stream slow parts behind Suspense so the shell paints immediately.",
        },
        {
          title: "Client-side rendering",
          body: "Still valid for authenticated, highly interactive views where SEO and first paint matter less than responsiveness.",
        },
      ],
    },
    {
      id: "micro-frontends",
      label: "Micro Frontends",
      graphId: "micro-frontends",
      intro:
        "Micro frontends trade a single build for independent teams and deployments. They pay off when organizational scale — not code size — is the bottleneck.",
      concepts: [
        {
          title: "When they're worth it",
          body: "Several teams shipping to one product on different cadences, with clear domain boundaries. For a single team, a well-structured monolith is simpler and faster.",
        },
        {
          title: "Module Federation",
          body: "Webpack/Rspack Module Federation lets a host load remotes' exposed modules at runtime, sharing singletons like React.",
        },
        {
          title: "Contracts, not imports",
          body: "Remotes integrate through versioned props, routes and events. Importing another remote's internals recreates the monolith with extra network hops.",
        },
        {
          title: "Failure isolation",
          body: "Every remote mounts inside an error boundary with a fallback and a timeout, so one failing deploy degrades a section instead of the whole app.",
        },
      ],
    },
    {
      id: "api",
      label: "Backend & APIs",
      graphId: "api-architecture",
      intro:
        "In a Node.js service — Express or NestJS — a request should be validated and authenticated before it reaches business logic, and business logic should not know whether it was called over HTTP.",
      concepts: [
        {
          title: "REST or GraphQL",
          body: "REST for resource-shaped, cacheable endpoints; GraphQL when several clients need different shapes of the same data — with generated types so the schema and the frontend can't drift apart.",
        },
        {
          title: "Validate at the edge",
          body: "Schema-validate input in the API layer and return consistent error shapes. Downstream code can then trust its inputs.",
        },
        {
          title: "Authentication vs authorization",
          body: "Authenticate once per request; authorize per action, close to the data being accessed.",
        },
        {
          title: "Isolate the domain",
          body: "Keep business rules free of HTTP and ORM details so they can be tested directly and reused by jobs or other transports.",
        },
        {
          title: "Treat external services as unreliable",
          body: "Timeouts, retries with backoff, idempotency keys and circuit breakers keep third-party failures from cascading.",
        },
      ],
    },
    {
      id: "delivery",
      label: "Delivery Pipeline",
      graphId: "delivery-pipeline",
      intro:
        "Shipping is part of the feature. Every change travels the same path — branch, merge request, automated checks, staged environments, production validation — and monitoring closes the loop.",
      concepts: [
        {
          title: "Small branches, reviewed merges",
          body: "Changes land through merge requests with peer review and a passing pipeline. Short-lived branches keep reviews focused and merges painless.",
        },
        {
          title: "The pipeline is the gate",
          body: "Lint, type checks, unit, component and end-to-end tests and the build run on every merge request. A red pipeline blocks the merge, so main stays releasable.",
        },
        {
          title: "Build once, promote the same artifact",
          body: "The container image validated in staging is the one that reaches production. Environments differ only in configuration, which removes a whole class of release surprises.",
        },
        {
          title: "Validate after release",
          body: "A deploy isn't done until production is checked. Telemetry and error tracking show whether the release behaves, and regressions are rolled back or fixed forward quickly.",
        },
      ],
    },
  ],

  renderingMatrix: {
    columns: ["Server Components", "Client Components", "SSR", "SSG", "ISR", "CSR"],
    rows: [
      {
        label: "Renders on",
        values: [
          "Server",
          "Server, then hydrated in browser",
          "Server",
          "Build machine",
          "Build, then server in background",
          "Browser",
        ],
      },
      {
        label: "Renders when",
        values: [
          "Build or request",
          "Build or request + hydration",
          "Every request",
          "At build",
          "Build + after revalidation",
          "After JS loads",
        ],
      },
      {
        label: "Data freshness",
        values: [
          "Depends on caching",
          "Depends on parent",
          "Always fresh",
          "Stale until rebuild",
          "Fresh within window",
          "Fresh (client fetch)",
        ],
      },
      {
        label: "Component JS shipped",
        values: [
          "None",
          "Yes",
          "Yes, for client parts",
          "Yes, for client parts",
          "Yes, for client parts",
          "All of it",
        ],
      },
      {
        label: "Best for",
        values: [
          "Data-heavy, static UI",
          "Interactivity",
          "Personalized pages",
          "Docs, marketing",
          "Large catalogs",
          "Dashboards behind login",
        ],
      },
    ],
  },

  repoStrategies: {
    columns: ["Monorepo", "Independent repositories"],
    rows: [
      {
        label: "Shared code",
        values: ["Direct imports, one version", "Published packages, versioned"],
      },
      { label: "Deploy independence", values: ["Possible with per-app pipelines", "Natural"] },
      { label: "Cross-cutting changes", values: ["One atomic change", "Coordinated releases"] },
      { label: "Version drift", values: ["Prevented by default", "Must be managed"] },
      {
        label: "Tooling cost",
        values: ["Build caching and task graphs needed", "Duplicated CI and config"],
      },
    ],
  },
});

export type LabModule = (typeof architecture.modules)[number];

export function getLabModule(id: string) {
  return architecture.modules.find((module) => module.id === id);
}

export const labGraphId = (module: LabModule) => module.graphId as GraphId;
