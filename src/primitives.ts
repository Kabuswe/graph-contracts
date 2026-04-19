/**
 * primitives.ts — Shared primitive types used across all graph contracts.
 *
 * These types are the building blocks that individual graph contracts compose.
 * Keep this file framework-agnostic — no LangGraph or LangChain imports.
 */
import { z } from "zod";

// ---------------------------------------------------------------------------
// SystemBlueprint — the structured representation of a product vision
// Used by graph-ux-research, graph-agent-builder, and Supervisors
// ---------------------------------------------------------------------------

export const FlowStepSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export const FlowSchema = z.object({
  steps: z.array(FlowStepSchema).default([]),
});

export const StackSchema = z.object({
  web: z.string().default("none"),
  mobile: z.string().default("none"),
  backend: z.string().default("none"),
});

export const SystemBlueprintSchema = z.object({
  domain: z.string(),
  problemStatement: z.string().optional(),
  targetPersonas: z.array(z.string()).default([]),
  competitiveGaps: z.array(z.string()).default([]),
  entities: z.array(z.string()).default([]),
  stack: StackSchema.optional(),
  flows: z
    .object({
      core: FlowSchema.optional(),
      onboarding: FlowSchema.optional(),
    })
    .optional(),
});

export type SystemBlueprint = z.infer<typeof SystemBlueprintSchema>;
export type FlowStep = z.infer<typeof FlowStepSchema>;
export type Flow = z.infer<typeof FlowSchema>;
export type Stack = z.infer<typeof StackSchema>;

// ---------------------------------------------------------------------------
// ClientConfig — per-client runtime configuration for Supervisors
// ---------------------------------------------------------------------------

export const ClientConfigSchema = z.object({
  clientId: z.string(),
  allowedTopics: z.array(z.string()).default([]),
  blockedPatterns: z.array(z.string()).default([]),
  piiPolicy: z.enum(["redact", "block", "allow"]).default("redact"),
  guardrailLevel: z.enum(["strict", "moderate", "permissive"]).default("moderate"),
  creditBalance: z.number().default(0),
});

export type ClientConfig = z.infer<typeof ClientConfigSchema>;

// ---------------------------------------------------------------------------
// TelemetryEvent — structured log for every graph run
// ---------------------------------------------------------------------------

export const TelemetryEventSchema = z.object({
  runId: z.string(),
  graphName: z.string(),
  nodeSequence: z.array(z.string()).default([]),
  duration: z.number(),
  tokensUsed: z.number().default(0),
  creditsConsumed: z.number().default(0),
  outcome: z.enum(["success", "failure", "partial"]),
});

export type TelemetryEvent = z.infer<typeof TelemetryEventSchema>;

// ---------------------------------------------------------------------------
// ConnectorRef — reference to an MCP connector
// ---------------------------------------------------------------------------

export const ConnectorRefSchema = z.object({
  connectorId: z.string(),
  transport: z.enum(["stdio", "sse", "streamable_http"]),
  authType: z.string().default("none"),
});

export type ConnectorRef = z.infer<typeof ConnectorRefSchema>;

// ---------------------------------------------------------------------------
// VectorChunk — a single chunk in the vector store
// ---------------------------------------------------------------------------

export const VectorChunkMetadataSchema = z.object({
  source: z.string(),
  date: z.string().optional(),
  clientId: z.string().optional(),
  docType: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export const VectorChunkSchema = z.object({
  chunkId: z.string(),
  content: z.string(),
  embedding: z.array(z.number()).optional(),
  metadata: VectorChunkMetadataSchema,
});

export type VectorChunk = z.infer<typeof VectorChunkSchema>;
export type VectorChunkMetadata = z.infer<typeof VectorChunkMetadataSchema>;

// ---------------------------------------------------------------------------
// GuardrailResult — output from a guardrail check
// ---------------------------------------------------------------------------

export const GuardrailResultSchema = z.object({
  passed: z.boolean(),
  violations: z.array(z.string()).default([]),
  action: z.enum(["allow", "redact", "block"]),
});

export type GuardrailResult = z.infer<typeof GuardrailResultSchema>;
