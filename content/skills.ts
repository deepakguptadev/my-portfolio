import { defineContent } from "@/lib/schemas/common";
import { skillsSchema } from "@/lib/schemas/content";

/**
 * Categories and skills exactly as listed in the brief and resume. No proficiency scores.
 * Ordered so the full stack reads first: frontend, backend, data, cloud.
 */
export const skills = defineContent("skills", skillsSchema, [
  {
    id: "frontend",
    label: "Frontend",
    skills: ["React.js", "Next.js", "JavaScript", "TypeScript", "HTML5", "CSS3"],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [
      "Node.js",
      "Express.js",
      "NestJS",
      "REST",
      "GraphQL",
      "WebSockets",
      "Socket.IO",
      "Authentication & Authorization",
    ],
  },
  { id: "database", label: "Database", skills: ["MongoDB", "PostgreSQL", "MySQL"] },
  {
    id: "cloud-devops",
    label: "Cloud / DevOps",
    skills: [
      "AWS",
      "Azure",
      "Azure DevOps",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "GitLab CI/CD",
      "Git",
      "New Relic",
    ],
  },
  {
    id: "state-and-data",
    label: "State & Data",
    skills: [
      "Redux Toolkit",
      "Redux",
      "React Query",
      "Context API",
      "Zustand",
      "REST",
      "GraphQL",
      "Apollo",
      "GraphQL Code Generator",
      "Axios",
    ],
  },
  {
    id: "ui",
    label: "UI",
    skills: ["MUI", "Tailwind", "SCSS", "styled-components", "CSS Modules"],
  },
  {
    id: "testing",
    label: "Testing",
    skills: ["Jest", "React Testing Library", "Vitest", "Playwright", "Cypress", "MSW"],
  },
  {
    id: "architecture",
    label: "Architecture",
    skills: [
      "Component Architecture",
      "Design Systems",
      "Micro Frontends",
      "Microservices",
      "Module Federation",
      "SSR",
      "SSG",
      "ISR",
      "PWA",
    ],
  },
  {
    id: "ai",
    label: "AI",
    skills: [
      "Generative AI",
      "OpenAI",
      "AWS Bedrock",
      "Cursor",
      "GitHub Copilot",
      "Claude Code",
      "ChatGPT",
      "Codex",
    ],
  },
]);
