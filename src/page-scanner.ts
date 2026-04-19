/**
 * page-scanner.ts — Contracts for graph-page-scanner.
 *
 * Pipeline: extractPageContent → identifyEntities → extractInsights → classifyContent → storeIfRelevant
 */
import { z } from "zod";

// ---------------------------------------------------------------------------
// PageScannerInput
// ---------------------------------------------------------------------------

export const PageScannerInputSchema = z.object({
  pageUrl: z.string().optional(),
  rawHTML: z.string().optional(),
  userContext: z.string().default(""),
  storePolicy: z.enum(["always", "if-relevant", "never"]).default("if-relevant"),
  clientId: z.string().optional(),
});

export type PageScannerInput = z.infer<typeof PageScannerInputSchema>;

// ---------------------------------------------------------------------------
// PageScannerOutput
// ---------------------------------------------------------------------------

export const EntitySchema = z.object({
  name: z.string(),
  type: z.string(),
  confidence: z.number().min(0).max(1),
});

export type Entity = z.infer<typeof EntitySchema>;

export const InsightSchema = z.object({
  claim: z.string(),
  evidence: z.string(),
  category: z.string(),
});

export type Insight = z.infer<typeof InsightSchema>;

export const PageScannerOutputSchema = z.object({
  entities: z.array(EntitySchema).default([]),
  insights: z.array(InsightSchema).default([]),
  contentType: z.string().default("unknown"),
  topicTags: z.array(z.string()).default([]),
  relevanceScore: z.number().min(0).max(1).default(0),
  stored: z.boolean().default(false),
  vectorId: z.string().optional(),
  headline: z.string().default(""),
});

export type PageScannerOutput = z.infer<typeof PageScannerOutputSchema>;
