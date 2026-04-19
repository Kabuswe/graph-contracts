/**
 * rag-retriever.ts — Contracts for graph-rag-retriever.
 *
 * Pipeline: embedQuery → queryVectorStore → filterByMetadata → rankChunks → formatContext
 */
import { z } from "zod";
import { VectorChunkSchema } from "./primitives.js";

// ---------------------------------------------------------------------------
// RagRetrieverInput
// ---------------------------------------------------------------------------

export const RagRetrieverInputSchema = z.object({
  query: z.string().min(1),
  clientId: z.string().optional(),
  dateRange: z
    .object({
      start: z.string(),
      end: z.string(),
    })
    .optional(),
  docTypes: z.array(z.string()).optional(),
  topK: z.number().int().positive().default(10),
  mode: z.enum(["cloud", "local"]).default("cloud"),
});

export type RagRetrieverInput = z.infer<typeof RagRetrieverInputSchema>;

// ---------------------------------------------------------------------------
// RagRetrieverOutput
// ---------------------------------------------------------------------------

export const SourceRefSchema = z.object({
  chunkId: z.string(),
  source: z.string(),
  score: z.number(),
  snippet: z.string(),
});

export type SourceRef = z.infer<typeof SourceRefSchema>;

export const RagRetrieverOutputSchema = z.object({
  retrievedChunks: z.array(VectorChunkSchema).default([]),
  sourceRefs: z.array(SourceRefSchema).default([]),
  contextWindow: z.string().default(""),
  chunkCount: z.number().int().default(0),
});

export type RagRetrieverOutput = z.infer<typeof RagRetrieverOutputSchema>;
