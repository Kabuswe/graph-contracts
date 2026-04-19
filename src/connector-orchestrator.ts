/**
 * connector-orchestrator.ts — Contracts for graph-connector-orchestrator.
 *
 * Pipeline: resolveConnector → authenticateViaMCP → executeAction → validateResult → logToTelemetry
 */
import { z } from "zod";
import { TelemetryEventSchema } from "./primitives.js";

// ---------------------------------------------------------------------------
// ConnectorOrchestratorInput
// ---------------------------------------------------------------------------

export const ConnectorOrchestratorInputSchema = z.object({
  connectorId: z.string(),
  action: z.string(),
  payload: z.record(z.string(), z.unknown()).default({}),
  clientConfig: z.record(z.string(), z.unknown()).default({}),
  clientId: z.string().optional(),
});

export type ConnectorOrchestratorInput = z.infer<typeof ConnectorOrchestratorInputSchema>;

// ---------------------------------------------------------------------------
// ConnectorOrchestratorOutput
// ---------------------------------------------------------------------------

export const ConnectorOrchestratorOutputSchema = z.object({
  result: z.unknown(),
  status: z.enum(["success", "failure", "partial"]),
  telemetryEvent: TelemetryEventSchema.optional(),
  creditsConsumed: z.number().default(0),
});

export type ConnectorOrchestratorOutput = z.infer<typeof ConnectorOrchestratorOutputSchema>;
