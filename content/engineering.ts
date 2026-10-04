import { defineContent } from "@/lib/schemas/common";
import { engineeringSchema } from "@/lib/schemas/content";

export const engineering = defineContent("engineering", engineeringSchema, {
  // Engineering DNA. Wording is a draft for Deepak to approve.
  principles: [
    {
      id: "architecture",
      label: "Architecture",
      summary: "Clear boundaries so features can grow without the codebase collapsing into itself.",
      practices: [
        "Feature modules over a shared grab-bag of components",
        "One-directional dependencies: features → components → primitives",
        "Decisions recorded with context and tradeoffs",
      ],
      related: ["performance", "quality", "full-stack"],
      draft: true,
    },
    {
      id: "performance",
      label: "Performance",
      summary: "Measured, not guessed: find the real bottleneck, fix it, then prove the fix.",
      practices: [
        "Core Web Vitals as acceptance criteria",
        "Ship less JavaScript; render on the server where it helps",
        "Profile before optimizing",
      ],
      related: ["architecture", "product"],
      draft: true,
    },
    {
      id: "product",
      label: "Product Thinking",
      summary: "Start from the user's workflow and the business constraint, not the framework.",
      practices: [
        "Understand who uses it and in what conditions",
        "Prefer the simplest solution that solves the real problem",
        "Make tradeoffs explicit to stakeholders",
      ],
      related: ["performance", "quality"],
      draft: true,
    },
    {
      id: "quality",
      label: "Quality",
      summary: "Accessible, tested and reviewed by default — not as a phase at the end.",
      practices: [
        "Tests at the right level: unit, integration, end-to-end",
        "Accessibility built into components",
        "Code review as knowledge sharing",
      ],
      related: ["architecture", "product"],
      draft: true,
    },
    {
      id: "full-stack",
      label: "Full-Stack",
      summary: "Own the feature across every layer: UI, APIs, data and the cloud they run on.",
      practices: [
        "Design API contracts with the frontend's needs in mind",
        "Node.js services with Express or NestJS",
        "Containerized deploys on AWS",
        "GitLab CI/CD from merge request to production monitoring",
      ],
      related: ["architecture", "performance"],
      draft: true,
    },
  ],

  performance: {
    philosophy: "I don't just build it. I optimize it.",
    process: [
      {
        id: "identify",
        label: "Identify",
        question: "Which user journey feels slow, and for whom?",
        tools: ["Real-user reports", "Analytics"],
      },
      {
        id: "measure",
        label: "Measure",
        question: "What do the numbers say under realistic conditions?",
        tools: ["Lighthouse", "WebPageTest", "Core Web Vitals"],
      },
      {
        id: "diagnose",
        label: "Diagnose",
        question: "Where is the time going — network, JavaScript, rendering?",
        tools: ["Chrome DevTools Performance", "React Profiler", "Bundle analyzer"],
      },
      {
        id: "optimize",
        label: "Optimize",
        question: "What is the smallest change that removes the bottleneck?",
        tools: ["Code splitting", "Caching", "Memoization", "Virtualization"],
      },
      {
        id: "validate",
        label: "Validate",
        question: "Did it actually improve, without regressions?",
        tools: ["Before/after traces", "Tests"],
      },
      {
        id: "monitor",
        label: "Monitor",
        question: "Will we notice if it regresses?",
        tools: ["Performance budgets in CI", "Real-user monitoring"],
      },
    ],
    topics: [
      {
        id: "lcp",
        label: "LCP",
        category: "Core Web Vitals",
        technique:
          "Make the largest element arrive early: server-render it, preload its font or image, avoid client-only rendering above the fold.",
        whenToUse: "Hero sections, landing pages, content-heavy routes.",
        pitfall: "Lazy-loading the LCP image delays it.",
      },
      {
        id: "cls",
        label: "CLS",
        category: "Core Web Vitals",
        technique:
          "Reserve space for media, ads and late content; use metric-matched font fallbacks.",
        whenToUse: "Any page with images, embeds or web fonts.",
        pitfall: "Injecting banners above existing content after load.",
      },
      {
        id: "inp",
        label: "INP",
        category: "Core Web Vitals",
        technique:
          "Keep event handlers short; yield long tasks; move heavy work off the main thread or defer it with transitions.",
        whenToUse: "Interactive UIs: filters, editors, dashboards.",
        pitfall: "Synchronous re-renders of large trees on every keystroke.",
      },
      {
        id: "code-splitting",
        label: "Code Splitting",
        category: "Loading",
        technique: "Split by route and by interaction so each page ships only what it needs.",
        whenToUse: "Large apps with distinct sections.",
        pitfall: "Over-splitting into many tiny requests.",
      },
      {
        id: "lazy-loading",
        label: "Lazy Loading",
        category: "Loading",
        technique: "Defer below-the-fold components, images and third-party widgets until needed.",
        whenToUse: "Modals, charts, long pages.",
        pitfall: "Lazy-loading what the user sees first.",
      },
      {
        id: "dynamic-imports",
        label: "Dynamic Imports",
        category: "Loading",
        technique:
          "Load a module on demand — e.g. a command palette on first open, with idle-time preloading.",
        whenToUse: "Rarely used, heavy features.",
        pitfall: "Visible delay on first use without preloading.",
      },
      {
        id: "memoization",
        label: "Memoization",
        category: "Rendering",
        technique: "Memoize expensive derivations and stabilize props for memoized children.",
        whenToUse: "Measured re-render hot spots.",
        pitfall: "Memoizing everything adds cost without benefit.",
      },
      {
        id: "virtualization",
        label: "Virtualization",
        category: "Rendering",
        technique: "Render only the visible rows of long lists and tables.",
        whenToUse: "Hundreds or thousands of rows.",
        pitfall: "Breaking find-in-page, keyboard navigation and accessibility if done naively.",
      },
      {
        id: "rendering",
        label: "Rendering Optimization",
        category: "Rendering",
        technique:
          "Keep state close to where it's used; split contexts; prefer server components for static UI.",
        whenToUse: "Large component trees with frequent updates.",
        pitfall: "Global state that re-renders the whole app.",
      },
      {
        id: "api",
        label: "API Optimization",
        category: "Data",
        technique:
          "Fetch in parallel, avoid waterfalls, paginate, and shape responses for the screen that consumes them.",
        whenToUse: "Screens that combine several data sources.",
        pitfall: "Sequential requests hidden inside nested components.",
      },
      {
        id: "caching",
        label: "Caching",
        category: "Data",
        technique:
          "Cache at the right layer — CDN, server, query cache — with explicit invalidation.",
        whenToUse: "Data read far more often than written.",
        pitfall: "Stale data without a clear invalidation path.",
      },
      {
        id: "bundle",
        label: "Bundle Optimization",
        category: "Loading",
        technique:
          "Audit dependencies, tree-shake, replace heavy libraries, and enforce size budgets in CI.",
        whenToUse: "Any production app, continuously.",
        pitfall: "Importing a whole library for one helper.",
      },
      {
        id: "images",
        label: "Image Optimization",
        category: "Loading",
        technique:
          "Modern formats, responsive sizes, explicit dimensions and priority hints for the hero image.",
        whenToUse: "Media-heavy pages.",
        pitfall: "Serving desktop-size images to phones.",
      },
    ],
    measurements: [],
  },

  ai: {
    positioning:
      "AI accelerates my workflow, but engineering judgment, code review, testing and production validation remain human responsibilities.",
    tools: ["ChatGPT", "OpenAI", "Codex", "Cursor", "GitHub Copilot", "Claude Code", "AWS Bedrock"],
    useCases: [
      { label: "Code Generation", humanCheckpoint: "Read every line; it ships under my name." },
      { label: "Refactoring", humanCheckpoint: "Tests pass before and after; behavior unchanged." },
      { label: "Debugging", humanCheckpoint: "Confirm the root cause, not just the symptom." },
      { label: "Testing", humanCheckpoint: "Check the tests assert the right behavior." },
      { label: "Documentation", humanCheckpoint: "Verify it matches what the code actually does." },
      {
        label: "Codebase Understanding",
        humanCheckpoint: "Validate explanations against the source.",
      },
      {
        label: "Architecture Exploration",
        humanCheckpoint: "Decisions and tradeoffs stay with the team.",
      },
    ],
  },

  quality: {
    layers: [
      {
        label: "Static analysis",
        tools: ["TypeScript strict", "ESLint"],
        purpose: "Catch whole classes of bugs before runtime.",
      },
      {
        label: "Unit",
        tools: ["Vitest", "Jest", "React Testing Library"],
        purpose: "Fast feedback on components and logic.",
      },
      {
        label: "Integration",
        tools: ["MSW"],
        purpose: "Exercise UI against realistic API behavior.",
      },
      {
        label: "End-to-end",
        tools: ["Playwright", "Cypress"],
        purpose: "Verify critical user journeys in a real browser.",
      },
      {
        label: "Accessibility",
        tools: ["axe-core", "Keyboard & screen reader passes"],
        purpose: "Make sure everyone can use it.",
      },
    ],
  },
});
