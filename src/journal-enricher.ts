/**
 * journal-enricher.ts — Contracts for graph-journal-enricher.
 *
 * Pipeline: parseMarkdown → extractThemes → scoreMood → surfaceInsights → generatePublicRewrite → storeMetadata
 */
import { z } from "zod";

// ---------------------------------------------------------------------------
// JournalEnricherInput
// ---------------------------------------------------------------------------

export const JournalEnricherInputSchema = z.object({
  rawContent: z.string().min(1),
  entryDate: z.string(),
  existingThemes: z.array(z.string()).default([]),
});

export type JournalEnricherInput = z.infer<typeof JournalEnricherInputSchema>;

// ---------------------------------------------------------------------------
// JournalEnricherOutput
// ---------------------------------------------------------------------------

export const JournalEnricherOutputSchema = z.object({
  themes: z.array(z.string()).default([]),
  moodScore: z.number().min(-1).max(1).default(0),
  energyLevel: z.number().min(0).max(1).default(0.5),
  coreQuestions: z.array(z.string()).default([]),
  insightSummary: z.string().default(""),
  publicRewrite: z.string().default(""),
  embedding: z.array(z.number()).optional(),
});

export type JournalEnricherOutput = z.infer<typeof JournalEnricherOutputSchema>;
