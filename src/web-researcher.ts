/**
 * web-researcher.ts — Contracts for graph-web-researcher.
 *
 * Pipeline: decomposeQuery → [parallel searchBranch × N] → mergeFindings → deduplicateFindings → synthesizeSummary
 */
import { z } from "zod";

// ---------------------------------------------------------------------------
// WebResearcherInput
// ---------------------------------------------------------------------------

export const WebResearcherInputSchema = z.object({
  topic: z.string().min(1),
  timeframe: z.string().optional(),
  maxSources: z.number().int().positive().default(10),
});

export type WebResearcherInput = z.infer<typeof WebResearcherInputSchema>;

// ---------------------------------------------------------------------------
// WebResearcherOutput
// ---------------------------------------------------------------------------

export const WebFindingSchema = z.object({
  title: z.string(),
  url: z.string(),
  snippet: z.string(),
  relevanceScore: z.number().min(0).max(1),
});

export type WebFinding = z.infer<typeof WebFindingSchema>;

export const WebSynthesisSchema = z.object({
  headline: z.string(),
  keyPoints: z.array(z.string()),
  sentiment: z.enum(["positive", "negative", "neutral", "mixed"]),
  confidence: z.number().min(0).max(1),
});

export type WebSynthesis = z.infer<typeof WebSynthesisSchema>;

export const WebResearcherOutputSchema = z.object({
  findings: z.array(WebFindingSchema).default([]),
  synthesis: WebSynthesisSchema.optional(),
  sourceUrls: z.array(z.string()).default([]),
});

export type WebResearcherOutput = z.infer<typeof WebResearcherOutputSchema>;
