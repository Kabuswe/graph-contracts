/**
 * intent-classifier.ts — Contracts for graph-intent-classifier.
 *
 * Pipeline: parseInput → classifyIntent → resolveAgentType → scoreConfidence
 */
import { z } from "zod";

// ---------------------------------------------------------------------------
// IntentClassifierInput
// ---------------------------------------------------------------------------

export const IntentClassifierInputSchema = z.object({
  rawPrompt: z.string().min(1),
  sessionId: z.string().optional(),
});

export type IntentClassifierInput = z.infer<typeof IntentClassifierInputSchema>;

// ---------------------------------------------------------------------------
// IntentClassifierOutput
// ---------------------------------------------------------------------------

export const AgentTypeSchema = z.enum([
  "rag",
  "monitor",
  "briefing",
  "page-scanner",
  "connector",
  "builder",
  "doc-processor",
  "journal",
  "email",
  "custom",
]);

export type AgentType = z.infer<typeof AgentTypeSchema>;

export const DeploymentPreferenceSchema = z.enum(["local", "cloud", "hybrid"]);
export type DeploymentPreference = z.infer<typeof DeploymentPreferenceSchema>;

export const SubscriptionTierSchema = z.enum(["starter", "pro", "mission-critical"]);
export type SubscriptionTier = z.infer<typeof SubscriptionTierSchema>;

export const GraphPatternSchema = z.enum([
  "ReAct",
  "Plan-and-Execute",
  "Supervisor",
  "Multi-Agent-Swarm",
  "Remote-Subgraph",
]);
export type GraphPattern = z.infer<typeof GraphPatternSchema>;

export const IntentClassifierOutputSchema = z.object({
  normalizedPrompt: z.string(),
  explicitSignals: z.array(z.string()).default([]),
  agentType: AgentTypeSchema,
  useCase: z.string(),
  deploymentPreference: DeploymentPreferenceSchema,
  graphPattern: GraphPatternSchema,
  connectorRefs: z.array(z.string()).default([]),
  dataSensitivity: z.enum(["low", "medium", "high"]).default("low"),
  complexityScore: z.number().min(0).max(1),
  suggestedTier: SubscriptionTierSchema,
  confidence: z.number().min(0).max(1),
  requiresClarification: z.boolean().default(false),
});

export type IntentClassifierOutput = z.infer<typeof IntentClassifierOutputSchema>;
