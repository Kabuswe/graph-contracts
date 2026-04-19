/**
 * email-processor.ts — Contracts for graph-email-processor.
 *
 * Pipeline: parseEmail → classifyPriority → extractActionItems → draftReply? → routeToConnector
 */
import { z } from "zod";

// ---------------------------------------------------------------------------
// EmailProcessorInput
// ---------------------------------------------------------------------------

export const EmailPayloadSchema = z.object({
  from: z.string(),
  to: z.array(z.string()),
  subject: z.string(),
  body: z.string(),
  date: z.string(),
  threadId: z.string().optional(),
  attachments: z.array(z.string()).default([]),
});

export type EmailPayload = z.infer<typeof EmailPayloadSchema>;

export const EmailProcessorInputSchema = z.object({
  emailPayload: EmailPayloadSchema,
  clientConfig: z.record(z.string(), z.unknown()).default({}),
  replyDraftEnabled: z.boolean().default(false),
});

export type EmailProcessorInput = z.infer<typeof EmailProcessorInputSchema>;

// ---------------------------------------------------------------------------
// EmailProcessorOutput
// ---------------------------------------------------------------------------

export const ActionItemSchema = z.object({
  description: z.string(),
  dueDate: z.string().optional(),
  assignee: z.string().optional(),
  priority: z.enum(["high", "medium", "low"]),
});

export type ActionItem = z.infer<typeof ActionItemSchema>;

export const EmailProcessorOutputSchema = z.object({
  priority: z.enum(["urgent", "high", "medium", "low"]),
  actionItems: z.array(ActionItemSchema).default([]),
  suggestedReply: z.string().optional(),
  routing: z.string().default(""),
  summary: z.string().default(""),
});

export type EmailProcessorOutput = z.infer<typeof EmailProcessorOutputSchema>;
