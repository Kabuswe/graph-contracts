/**
 * agent-builder.ts — Contracts for graph-agent-builder.
 *
 * Pipeline: parseIntent → graph-ux-research (subgraph) → deriveAgentSpec → selectPattern → scaffoldGraph → validateSpec → outputBlueprint
 */
import { z } from "zod";

// ---------------------------------------------------------------------------
// AgentBuilderInput
// ---------------------------------------------------------------------------

export const AgentBuilderInputSchema = z.object({
  userRequirement: z.string().min(1),
  clientId: z.string(),
  constraints: z.record(z.string(), z.unknown()).default({}),
});

export type AgentBuilderInput = z.infer<typeof AgentBuilderInputSchema>;

// ---------------------------------------------------------------------------
// AgentBuilderOutput
// ---------------------------------------------------------------------------

export const AgentSpecSchema = z.object({
  name: z.string(),
  description: z.string(),
  graphPattern: z.string(),
  nodeCount: z.number().int(),
  subgraphDependencies: z.array(z.string()).default([]),
  connectorDependencies: z.array(z.string()).default([]),
  estimatedComplexity: z.enum(["low", "medium", "high"]),
});

export type AgentSpec = z.infer<typeof AgentSpecSchema>;

export const AgentBuilderOutputSchema = z.object({
  agentSpec: AgentSpecSchema,
  graphBlueprint: z.string().default(""),
  estimatedCredits: z.number().default(0),
  recommendedTier: z.enum(["starter", "pro", "mission-critical"]),
});

export type AgentBuilderOutput = z.infer<typeof AgentBuilderOutputSchema>;
