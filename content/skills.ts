import { defineContent } from "@/lib/schemas/common";
import { skillsSchema } from "@/lib/schemas/content";

/** Categories and skills exactly as listed in the brief. No proficiency scores. */
export const skills = defineContent("skills", skillsSchema, [
  {
    id: "frontend",
    label: "Frontend",
    skills: ["React.js", "Next.js", "JavaScript", "TypeScript", "HTML5", "CSS3"],
  },
  {
    id: "state-and-data",
    label: "State & Data",
    skills: [
      "Redux Toolkit",
      "React Query",
      "Context API",
      "Zustand",
      "REST",
      "GraphQL",
      "Apollo",
      "WebSockets",
      "Socket.IO",
    ],
  },
  {
    id: "ui",
    label: "UI",
    skills: ["MUI", "Tailwind", "SCSS", "styled-components", "CSS Modules"],
  },
  {
    id: "backend",
    label: "Backend",
    skills: ["Node.js", "Express.js", "NestJS", "REST", "GraphQL"],
  },
  { id: "database", label: "Database", skills: ["MongoDB", "PostgreSQL", "MySQL"] },
  {
    id: "cloud-devops",
    label: "Cloud / DevOps",
    skills: ["AWS", "Azure", "Docker", "CI/CD", "Git"],
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
