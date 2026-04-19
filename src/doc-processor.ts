/**
 * doc-processor.ts — Contracts for graph-doc-processor.
 *
 * Pipeline: detectFormat → extractStructure → resolveReferences → generateSummary → extractQAPairs
 * Intelligence layer on top of doc-ingestion.
 */
import { z } from "zod";

// ---------------------------------------------------------------------------
// DocProcessorInput
// ---------------------------------------------------------------------------

export const DocProcessorInputSchema = z.object({
  rawContent: z.string().min(1),
  docType: z.string().default("unknown"),
  processingDepth: z.enum(["shallow", "standard", "deep"]).default("standard"),
  clientId: z.string().optional(),
});

export type DocProcessorInput = z.infer<typeof DocProcessorInputSchema>;

// ---------------------------------------------------------------------------
// DocProcessorOutput
// ---------------------------------------------------------------------------

export const QAPairSchema = z.object({
  question: z.string(),
  answer: z.string(),
  confidence: z.number().min(0).max(1),
});

export type QAPair = z.infer<typeof QAPairSchema>;

export const DocProcessorOutputSchema = z.object({
  structuredContent: z.string().default(""),
  summary: z.string().default(""),
  qaPairs: z.array(QAPairSchema).default([]),
  keyEntities: z.array(z.string()).default([]),
  detectedFormat: z.string().default("unknown"),
});

export type DocProcessorOutput = z.infer<typeof DocProcessorOutputSchema>;
