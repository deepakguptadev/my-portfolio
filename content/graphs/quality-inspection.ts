import { defineContent } from "@/lib/schemas/common";
import { systemGraph } from "@/lib/schemas/graph";

/** Architecture as documented in the project case studies; no components added. */
export const qualityInspectionGraph = defineContent("graphs/quality-inspection", systemGraph, {
  id: "quality-inspection",
  title: "Quality Inspection Platform architecture",
  description:
    "A React PWA on factory iPads, with Redux workflow state, integrates with Spring Boot microservices over APIs; Jenkins builds and delivers it.",
  layers: ["Device", "Client application", "Client state", "Interface", "Service", "Data"],
  nodes: [
    {
      id: "ipad",
      label: "iPad / Tablet",
      kind: "application",
      summary: "Factory workers run inspections by touch on iPads on the production floor.",
      details: { tech: ["Touch UI", "Offline support"] },
      layout: { x: 40, y: 6 },
      layer: 0,
    },
    {
      id: "react-pwa",
      label: "React PWA",
      kind: "application",
      summary:
        "Installable progressive web app with reusable UI: scanning, inspection workflows and defect tagging on interactive shoe images.",
      details: { tech: ["React", "PWA"] },
      layout: { x: 40, y: 24 },
      layer: 1,
    },
    {
      id: "redux",
      label: "Redux",
      kind: "module",
      summary: "Predictable state for the inspection workflow.",
      details: { tech: ["Redux"] },
      layout: { x: 40, y: 42 },
      layer: 2,
    },
    {
      id: "api",
      label: "API / service integration",
      kind: "api",
      summary: "Contract between the PWA and the backend services.",
      layout: { x: 40, y: 60 },
      layer: 3,
    },
    {
      id: "spring",
      label: "Spring Boot microservices",
      kind: "application",
      summary: "Java backend services that validate and process inspection data.",
      details: { tech: ["Java 8", "Spring Boot", "Microservices"] },
      layout: { x: 40, y: 78 },
      layer: 4,
    },
    {
      id: "data",
      label: "Enterprise data layer",
      kind: "database",
      summary: "Stores inspection results and defect records.",
      layout: { x: 40, y: 95 },
      layer: 5,
    },
    {
      id: "jenkins",
      label: "Jenkins",
      kind: "external",
      summary: "Build and delivery pipeline.",
      layout: { x: 84, y: 50 },
      layer: 4,
    },
  ],
  edges: [
    { id: "ipad-pwa", from: "ipad", to: "react-pwa", kind: "dependency", label: "hosts" },
    { id: "pwa-redux", from: "react-pwa", to: "redux", kind: "dataFlow" },
    { id: "redux-api", from: "redux", to: "api", kind: "request" },
    { id: "api-spring", from: "api", to: "spring", kind: "request" },
    { id: "spring-data", from: "spring", to: "data", kind: "dataFlow" },
    { id: "jenkins-pwa", from: "jenkins", to: "react-pwa", kind: "dependency", label: "builds" },
    { id: "jenkins-spring", from: "jenkins", to: "spring", kind: "dependency", label: "builds" },
  ],
  trace: ["ipad-pwa", "pwa-redux", "redux-api", "api-spring", "spring-data"],
});
