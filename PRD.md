# graph-contracts — Product Requirements Document

## Purpose
Shared npm package (`@kabuswe/graph-contracts`) that defines the strongly-typed **Input** and **Output** Zod schemas for every remote subgraph in the Kabatoshi agent platform. This package is the load-bearing contract layer — every graph repo and every Supervisor imports from here. No graph ships without its contract defined here first.

## Guiding Principle
Contracts are defined before graphs are built. If a type isn't in this package, the graph doesn't exist yet.

## Package Structure
```
graph-contracts/
  src/
    index.ts                   ← barrel export of all contracts
    ux-research.ts             ← UxResearchInput / UxResearchOutput (migrated from graph-ux-research)
    intent-classifier.ts       ← IntentClassifierInput / IntentClassifierOutput
    rag-retriever.ts           ← RagRetrieverInput / RagRetrieverOutput
    doc-ingestion.ts           ← DocIngestionInput / DocIngestionOutput
    doc-processor.ts           ← DocProcessorInput / DocProcessorOutput
    page-scanner.ts            ← PageScannerInput / PageScannerOutput
    web-researcher.ts          ← WebResearcherInput / WebResearcherOutput
    email-processor.ts         ← EmailProcessorInput / EmailProcessorOutput
    journal-enricher.ts        ← JournalEnricherInput / JournalEnricherOutput
    daily-briefing.ts          ← DailyBriefingInput / DailyBriefingOutput
    monitor-alert.ts           ← MonitorAlertInput / MonitorAlertOutput
    connector-orchestrator.ts  ← ConnectorOrchestratorInput / ConnectorOrchestratorOutput
    agent-builder.ts           ← AgentBuilderInput / AgentBuilderOutput
    supervisor.ts              ← SupervisorInput / SupervisorOutput
  package.json
  tsconfig.json
  tsup.config.ts               ← builds to dist/ (ESM + CJS)
```

## Contract Shape Convention
Every contract file exports:
- `[Name]InputSchema` — Zod schema
- `[Name]OutputSchema` — Zod schema
- `type [Name]Input` — inferred TypeScript type
- `type [Name]Output` — inferred TypeScript type

Example pattern (from existing ux-research):
```ts
import { z } from 'zod';

export const IntentClassifierInputSchema = z.object({
  rawPrompt: z.string().min(1),
  sessionId: z.string().optional(),
});

export const IntentClassifierOutputSchema = z.object({
  agentType: z.enum(['rag', 'monitor', 'briefing', 'page-scanner', 'connector', 'builder']),
  useCase: z.string(),
  deploymentPreference: z.enum(['local', 'cloud', 'hybrid']),
  complexityScore: z.number().min(0).max(1),
  suggestedTier: z.enum(['starter', 'pro', 'mission-critical']),
  confidence: z.number().min(0).max(1),
});

export type IntentClassifierInput = z.infer<typeof IntentClassifierInputSchema>;
export type IntentClassifierOutput = z.infer<typeof IntentClassifierOutputSchema>;
```

## Shared Primitive Types
Define reusable sub-types also exported from `index.ts`:
- `ClientConfig` — `{ clientId, allowedTopics[], blockedPatterns[], piiPolicy, guardrailLevel, creditBalance }`
- `TelemetryEvent` — `{ runId, graphName, nodeSequence[], duration, tokensUsed, creditsConsumed, outcome }`
- `ConnectorRef` — `{ connectorId, transport: 'stdio'|'sse'|'streamable_http', authType }`
- `VectorChunk` — `{ chunkId, content, embedding?, metadata: { source, date, clientId, docType, tags[] } }`
- `GuardrailResult` — `{ passed: boolean, violations[], action: 'allow'|'redact'|'block' }`
- `SystemBlueprint` — already exists in graph-ux-research, migrate here

## Build & Publish
- Build with `tsup` (dual ESM + CJS output)
- Publish to GitHub Packages as `@kabuswe/graph-contracts`
- Version: semver — bump minor on new contract, patch on field additions, major on breaking changes
- All consuming graph repos pin to a specific version; Dependabot keeps them current

## Agent Instructions
When implementing this package:
1. Migrate `SystemBlueprint`, `DomainResearchBundle`, `DesignResearchBundle` from `graph-ux-research` into this package first
2. Implement all contract files listed above, following the exact shape convention
3. Set up `tsup.config.ts` for dual ESM/CJS build
4. Configure GitHub Packages publish in `package.json` with `@kabuswe` scope
5. Add a GitHub Actions workflow `.github/workflows/publish.yml` that publishes on version tag push
6. Ensure `src/index.ts` barrel-exports everything — no deep imports in consuming packages
7. Do NOT add any LangGraph or LangChain dependencies — this package is model/framework agnostic

## Acceptance Criteria
- `npm install @kabuswe/graph-contracts` works from any graph repo
- All Zod schemas are runtime-validated (not just TypeScript types)
- `graph-ux-research` is updated to import from this package (removing its local type definitions)
- Zero breaking changes to existing graph-ux-research behaviour
