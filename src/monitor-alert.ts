/**
 * monitor-alert.ts — Contracts for graph-monitor-alert.
 *
 * Pipeline: loadWatchlist → [parallel: page-scanner × urls] → diffAgainstPrevious → scoreSignificance → conditionalAlert
 */
import { z } from "zod";

// ---------------------------------------------------------------------------
// MonitorAlertInput
// ---------------------------------------------------------------------------

export const MonitorAlertInputSchema = z.object({
  clientId: z.string(),
  watchlistId: z.string(),
  alertThreshold: z.number().min(0).max(1).default(0.5),
});

export type MonitorAlertInput = z.infer<typeof MonitorAlertInputSchema>;

// ---------------------------------------------------------------------------
// MonitorAlertOutput
// ---------------------------------------------------------------------------

export const ChangeRecordSchema = z.object({
  url: z.string(),
  field: z.string(),
  previousValue: z.string(),
  currentValue: z.string(),
  significance: z.number().min(0).max(1),
});

export type ChangeRecord = z.infer<typeof ChangeRecordSchema>;

export const MonitorAlertOutputSchema = z.object({
  changes: z.array(ChangeRecordSchema).default([]),
  alertsFired: z.array(z.string()).default([]),
  nextRunAt: z.string().optional(),
});

export type MonitorAlertOutput = z.infer<typeof MonitorAlertOutputSchema>;
