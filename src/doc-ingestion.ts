/**
 * doc-ingestion.ts — Contracts for graph-doc-ingestion.
 *
 * Pipeline: extractText → detectStructure → chunkDocument → generateEmbeddings → writeS3Vectors → registerDynamoDB
 * Zero LLM calls — pure processing pipeline.
 */
import { z } from "zod";

// ---------------------------------------------------------------------------
// DocIngestionInput
// ---------------------------------------------------------------------------

export const DocIngestionInputSchema = z.object({
  s3Key: z.string().optional(),
  rawContent: z.string().optional(),
  clientId: z.string(),
  docType: z.string().default("unknown"),
  metadata: z
    .record(z.string(), z.unknown())
    .default({}),
  mode: z.enum(["cloud", "local"]).default("cloud"),
});

export type DocIngestionInput = z.infer<typeof DocIngestionInputSchema>;

// ---------------------------------------------------------------------------
// DocIngestionOutput
// ---------------------------------------------------------------------------

export const RegistryEntrySchema = z.object({
  documentId: z.string(),
  s3Key: z.string().optional(),
  clientId: z.string(),
  docType: z.string(),
  status: z.enum(["indexed", "failed", "pending"]),
  chunkCount: z.number().int(),
  ingestedAt: z.string(),
});

export type RegistryEntry = z.infer<typeof RegistryEntrySchema>;

export const DocIngestionOutputSchema = z.object({
  chunkCount: z.number().int().default(0),
  vectorIds: z.array(z.string()).default([]),
  registryEntry: RegistryEntrySchema.optional(),
  detectedFormat: z.string().default("unknown"),
  status: z.enum(["indexed", "failed", "pending"]).default("pending"),
});

export type DocIngestionOutput = z.infer<typeof DocIngestionOutputSchema>;
