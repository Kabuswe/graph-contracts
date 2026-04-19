/**
 * ux-research.ts — Contracts for graph-ux-research.
 *
 * Types reverse-engineered from the real graph-ux-research implementation:
 *   - graph.ts imports: SystemBlueprint, DomainResearchBundle(Schema), DesignResearchBundle(Schema)
 *   - contracts.ts re-exports: UxResearchInput(Schema), UxResearchOutput(Schema)
 *   - nodes/domainResearch.ts imports: DomainResearchQuerySchema, DomainResearchSynthesisSchema
 *   - nodes/designResearch.ts imports: SURFACE_STRATEGIES, DesignSynthesis(Schema),
 *       VisualDesignSynthesis(Schema), SurfaceStrategy
 *   - nodes/validateDesign.ts imports: DesignSynthesis(Schema), VisualDesignSynthesis(Schema)
 */
import { z } from "zod";
import { SystemBlueprintSchema } from "./primitives.js";

// ---------------------------------------------------------------------------
// Surface strategy — controls design query generation & visual synthesis
// ---------------------------------------------------------------------------

export const SURFACE_STRATEGIES = [
  "brand-led-marketing",
  "product-application",
  "hybrid",
] as const;

export const SurfaceStrategySchema = z.enum(SURFACE_STRATEGIES);
export type SurfaceStrategy = z.infer<typeof SurfaceStrategySchema>;

// ---------------------------------------------------------------------------
// DomainResearchQuerySchema — output of the query generation step
// ---------------------------------------------------------------------------

export const DomainResearchQuerySchema = z.object({
  queries: z.array(z.string()).min(1),
  libraries: z.array(z.string()).optional(),
});

export type DomainResearchQuery = z.infer<typeof DomainResearchQuerySchema>;

// ---------------------------------------------------------------------------
// DomainResearchSynthesisSchema — output of the domain synthesis step
// ---------------------------------------------------------------------------

export const DomainResearchSynthesisSchema = z.object({
  targetPersonas: z.array(z.string()),
  competitiveGaps: z.array(z.string()),
  entities: z.array(z.string()),
  userJobs: z.array(z.string()),
  domainConstraints: z.array(z.string()),
  riskyAssumptions: z.array(z.string()),
  unresolvedQuestions: z.array(z.string()),
  architectureNotes: z.array(z.string()),
});

export type DomainResearchSynthesis = z.infer<typeof DomainResearchSynthesisSchema>;

// ---------------------------------------------------------------------------
// DomainResearchBundle — full output of the domainResearch node
// ---------------------------------------------------------------------------

export const DomainResearchBundleSchema = z.object({
  queries: z.array(z.string()),
  detectedLibraries: z.array(z.string()),
  libraries: z.array(z.string()),
  webResults: z.array(z.string()),
  libraryDocResults: z.array(z.string()),
  synthesis: DomainResearchSynthesisSchema,
});

export type DomainResearchBundle = z.infer<typeof DomainResearchBundleSchema>;

// ---------------------------------------------------------------------------
// NarrativeSection — a section in the design synthesis
// ---------------------------------------------------------------------------

export const NarrativeSectionSchema = z.object({
  name: z.string(),
  job: z.string(),
  headline: z.string(),
});

export type NarrativeSection = z.infer<typeof NarrativeSectionSchema>;

// ---------------------------------------------------------------------------
// FirstViewportBudget — what is permitted above the fold
// ---------------------------------------------------------------------------

export const FirstViewportBudgetSchema = z.object({
  brand: z.string(),
  headline: z.string(),
  supportingLine: z.string(),
  ctaGroup: z.string(),
  visualAnchor: z.string(),
  forbidden: z.array(z.string()),
});

export type FirstViewportBudget = z.infer<typeof FirstViewportBudgetSchema>;

// ---------------------------------------------------------------------------
// DesignSynthesis — UX pattern findings from design research
// ---------------------------------------------------------------------------

export const DesignSynthesisSchema = z.object({
  landingPagePattern: z.string(),
  onboardingPattern: z.string(),
  coreScreenPattern: z.string(),
  domainPatterns: z.array(z.string()),
  competitorInsights: z.string(),
  narrativeSections: z.array(NarrativeSectionSchema).min(2),
  firstViewportBudget: FirstViewportBudgetSchema.optional(),
});

export type DesignSynthesis = z.infer<typeof DesignSynthesisSchema>;

// ---------------------------------------------------------------------------
// PaletteRole — a single colour role with 11 Tailwind stops (50–950)
// ---------------------------------------------------------------------------

export const PaletteRoleSchema = z.object({
  role: z.string(),
  hex: z.array(z.string()).length(11),
});

export type PaletteRole = z.infer<typeof PaletteRoleSchema>;

// ---------------------------------------------------------------------------
// VisualDesignSynthesis — complete visual design token system
// ---------------------------------------------------------------------------

export const VisualDesignSynthesisSchema = z.object({
  surfaceStrategy: SurfaceStrategySchema,
  surfaceRationale: z.string(),
  visualThesis: z.string(),
  style: z.string(),
  palette: z.array(PaletteRoleSchema).min(6),
  tailwindTheme: z.string(),
  uiLibraries: z.array(z.string()).min(1),
  typography: z.string(),
  spacing: z.string(),
  borderRadius: z.string(),
  motion: z.string(),
  interactionThesis: z.array(z.string()).min(2),
  backgroundAtmosphere: z.string(),
  guidelines: z.array(z.string()).min(1),
});

export type VisualDesignSynthesis = z.infer<typeof VisualDesignSynthesisSchema>;

// ---------------------------------------------------------------------------
// InspirationImage — annotated UI screenshot
// ---------------------------------------------------------------------------

export const InspirationImageSchema = z.object({
  url: z.string(),
  description: z.string(),
  caption: z.string(),
  layoutDescription: z.string(),
});

export type InspirationImage = z.infer<typeof InspirationImageSchema>;

// ---------------------------------------------------------------------------
// DesignResearchBundle — full output of the designResearch node
// ---------------------------------------------------------------------------

export const DesignResearchBundleSchema = z.object({
  uxQueries: z.array(z.string()),
  visualQueries: z.array(z.string()),
  uiImageQueries: z.array(z.string()),
  uxQueryResults: z.array(z.string()),
  visualQueryResults: z.array(z.string()),
  uiImageQueryResults: z.array(z.string()),
  inspirationImages: z.array(InspirationImageSchema),
  uxSynthesis: DesignSynthesisSchema,
  visualSynthesis: VisualDesignSynthesisSchema,
});

export type DesignResearchBundle = z.infer<typeof DesignResearchBundleSchema>;

// ---------------------------------------------------------------------------
// ResolvedSkill — a template skill fetched from GitHub
// ---------------------------------------------------------------------------

export const ResolvedSkillSchema = z.object({
  name: z.string(),
  ref: z.string(),
  content: z.string(),
});

export type ResolvedSkill = z.infer<typeof ResolvedSkillSchema>;

// ---------------------------------------------------------------------------
// TemplateAgentInstructions — agent instruction file from template repo
// ---------------------------------------------------------------------------

export const TemplateAgentInstructionsSchema = z.object({
  path: z.string(),
  ref: z.string(),
  content: z.string(),
});

export type TemplateAgentInstructions = z.infer<typeof TemplateAgentInstructionsSchema>;

// ---------------------------------------------------------------------------
// UxResearchInput / UxResearchOutput — the graph boundary contracts
// ---------------------------------------------------------------------------

export const UxResearchInputSchema = z.object({
  rawPrompt: z.string().min(1),
  platforms: z.array(z.string()).default(["web", "mobile", "backend"]),
  authFree: z.boolean().default(false),
  blueprint: SystemBlueprintSchema.optional(),
});

export type UxResearchInput = z.infer<typeof UxResearchInputSchema>;

export const UxResearchOutputSchema = z.object({
  domainResearchBundle: DomainResearchBundleSchema.optional(),
  designResearchBundle: DesignResearchBundleSchema.optional(),
  resolvedSkills: z.array(ResolvedSkillSchema).default([]),
  templateAgentInstructions: TemplateAgentInstructionsSchema.optional(),
  templateAgentDefinitions: z
    .array(z.object({ name: z.string(), path: z.string(), content: z.string() }))
    .default([]),
  designResearch: z.array(z.string()).default([]),
  researchQueries: z.array(z.string()).default([]),
  researchFindings: z.array(z.string()).default([]),
  error: z.string().optional(),
  phase: z.string().default(""),
});

export type UxResearchOutput = z.infer<typeof UxResearchOutputSchema>;
