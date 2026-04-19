/**
 * supervisor.ts — Contracts for graph-supervisor and graph-local-supervisor.
 *
 * Pipeline: loadClientConfig → loadGuardrails → routeToSubgraph → applyGuardrails → deductCredits → logTrace
 */
import { z } from "zod";
import { GuardrailResultSchema, TelemetryEventSchema } from "./primitives.js";

// ---------------------------------------------------------------------------
// SupervisorInput
// ---------------------------------------------------------------------------

export const SupervisorInputSchema = z.object({
  sessionId: z.string(),
  userMessage: z.string().min(1),
  clientId: z.string(),
});

export type SupervisorInput = z.infer<typeof SupervisorInputSchema>;

// ---------------------------------------------------------------------------
// SupervisorOutput
// ---------------------------------------------------------------------------

export const SupervisorOutputSchema = z.object({
  response: z.string().default(""),
  creditsUsed: z.number().default(0),
  traceId: z.string().default(""),
  guardrailResult: GuardrailResultSchema.optional(),
  telemetryEvent: TelemetryEventSchema.optional(),
  routedTo: z.string().optional(),
});

export type SupervisorOutput = z.infer<typeof SupervisorOutputSchema>;
