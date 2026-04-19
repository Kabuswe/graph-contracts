/**
 * daily-briefing.ts — Contracts for graph-daily-briefing.
 *
 * Pipeline: loadUserPreferences → [parallel: web-researcher × topics] →
 *           [parallel: email-processor × inbox] → mergeBriefing → formatOutput → deliverViaConnector
 */
import { z } from "zod";

// ---------------------------------------------------------------------------
// DailyBriefingInput
// ---------------------------------------------------------------------------

export const DailyBriefingInputSchema = z.object({
  userId: z.string(),
  deliveryChannel: z.string().default("email"),
  topics: z.array(z.string()).min(1),
  date: z.string(),
});

export type DailyBriefingInput = z.infer<typeof DailyBriefingInputSchema>;

// ---------------------------------------------------------------------------
// DailyBriefingOutput
// ---------------------------------------------------------------------------

export const DailyBriefingOutputSchema = z.object({
  briefingMarkdown: z.string().default(""),
  deliveryStatus: z.enum(["delivered", "failed", "pending"]).default("pending"),
  topicCount: z.number().int().default(0),
  sourcesUsed: z.number().int().default(0),
});

export type DailyBriefingOutput = z.infer<typeof DailyBriefingOutputSchema>;
