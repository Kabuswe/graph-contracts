/**
 * contracts.test.ts — Unit tests for all graph contracts.
 *
 * Validates:
 * 1. Every schema accepts valid input and rejects invalid input
 * 2. All barrel exports are accessible
 * 3. Type inference works correctly via Zod
 */
import { describe, it, expect } from "vitest";
import {
  // Primitives
  SystemBlueprintSchema,
  ClientConfigSchema,
  TelemetryEventSchema,
  ConnectorRefSchema,
  VectorChunkSchema,
  GuardrailResultSchema,

  // UX Research
  UxResearchInputSchema,
  UxResearchOutputSchema,
  DomainResearchQuerySchema,
  DomainResearchSynthesisSchema,
  DomainResearchBundleSchema,
  DesignSynthesisSchema,
  VisualDesignSynthesisSchema,
  DesignResearchBundleSchema,
  SurfaceStrategySchema,
  SURFACE_STRATEGIES,
  NarrativeSectionSchema,
  PaletteRoleSchema,

  // Intent Classifier
  IntentClassifierInputSchema,
  IntentClassifierOutputSchema,

  // RAG Retriever
  RagRetrieverInputSchema,
  RagRetrieverOutputSchema,

  // Doc Ingestion
  DocIngestionInputSchema,
  DocIngestionOutputSchema,

  // Web Researcher
  WebResearcherInputSchema,
  WebResearcherOutputSchema,

  // Doc Processor
  DocProcessorInputSchema,
  DocProcessorOutputSchema,

  // Page Scanner
  PageScannerInputSchema,
  PageScannerOutputSchema,

  // Email Processor
  EmailProcessorInputSchema,
  EmailProcessorOutputSchema,

  // Journal Enricher
  JournalEnricherInputSchema,
  JournalEnricherOutputSchema,

  // Connector Orchestrator
  ConnectorOrchestratorInputSchema,
  ConnectorOrchestratorOutputSchema,

  // Daily Briefing
  DailyBriefingInputSchema,
  DailyBriefingOutputSchema,

  // Monitor Alert
  MonitorAlertInputSchema,
  MonitorAlertOutputSchema,

  // Agent Builder
  AgentBuilderInputSchema,
  AgentBuilderOutputSchema,

  // Supervisor
  SupervisorInputSchema,
  SupervisorOutputSchema,
} from "../src/index.js";

// ═══════════════════════════════════════════════════════════════════════════
// Primitives
// ═══════════════════════════════════════════════════════════════════════════

describe("primitives", () => {
  describe("SystemBlueprintSchema", () => {
    it("accepts valid blueprint", () => {
      const result = SystemBlueprintSchema.safeParse({
        domain: "fintech",
        problemStatement: "Personal finance tracker",
        targetPersonas: ["young professionals"],
        entities: ["Account", "Transaction"],
        stack: { web: "next.js", mobile: "expo", backend: "express" },
        flows: {
          core: { steps: [{ name: "Dashboard" }, { name: "Transactions" }] },
          onboarding: { steps: [{ name: "Signup" }] },
        },
      });
      expect(result.success).toBe(true);
    });

    it("requires domain field", () => {
      const result = SystemBlueprintSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it("accepts minimal blueprint with just domain", () => {
      const result = SystemBlueprintSchema.safeParse({ domain: "edtech" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.targetPersonas).toEqual([]);
        expect(result.data.entities).toEqual([]);
      }
    });
  });

  describe("ClientConfigSchema", () => {
    it("accepts valid config", () => {
      const result = ClientConfigSchema.safeParse({
        clientId: "client-123",
        allowedTopics: ["finance"],
        blockedPatterns: ["explicit"],
        piiPolicy: "redact",
        guardrailLevel: "strict",
        creditBalance: 500,
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid piiPolicy", () => {
      const result = ClientConfigSchema.safeParse({
        clientId: "x",
        piiPolicy: "invalid",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("TelemetryEventSchema", () => {
    it("accepts valid event", () => {
      const result = TelemetryEventSchema.safeParse({
        runId: "run-001",
        graphName: "intent-classifier",
        nodeSequence: ["parseInput", "classifyIntent"],
        duration: 1250,
        tokensUsed: 450,
        creditsConsumed: 1,
        outcome: "success",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid outcome", () => {
      const result = TelemetryEventSchema.safeParse({
        runId: "run-001",
        graphName: "test",
        duration: 100,
        outcome: "unknown",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("ConnectorRefSchema", () => {
    it("accepts valid connector ref", () => {
      const result = ConnectorRefSchema.safeParse({
        connectorId: "gmail-mcp",
        transport: "streamable_http",
        authType: "oauth2",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("VectorChunkSchema", () => {
    it("accepts valid chunk", () => {
      const result = VectorChunkSchema.safeParse({
        chunkId: "chunk-abc",
        content: "This is a text chunk about finance.",
        metadata: {
          source: "report.pdf",
          clientId: "client-123",
          docType: "pdf",
          tags: ["finance", "Q4"],
        },
      });
      expect(result.success).toBe(true);
    });

    it("rejects chunk without chunkId", () => {
      const result = VectorChunkSchema.safeParse({
        content: "missing id",
        metadata: { source: "test" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("GuardrailResultSchema", () => {
    it("accepts valid result", () => {
      const result = GuardrailResultSchema.safeParse({
        passed: false,
        violations: ["PII detected"],
        action: "redact",
      });
      expect(result.success).toBe(true);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// UX Research contracts
// ═══════════════════════════════════════════════════════════════════════════

describe("ux-research", () => {
  describe("SurfaceStrategy", () => {
    it("exports SURFACE_STRATEGIES constant", () => {
      expect(SURFACE_STRATEGIES).toEqual(["brand-led-marketing", "product-application", "hybrid"]);
    });

    it("validates strategy values", () => {
      expect(SurfaceStrategySchema.safeParse("brand-led-marketing").success).toBe(true);
      expect(SurfaceStrategySchema.safeParse("invalid").success).toBe(false);
    });
  });

  describe("DomainResearchQuerySchema", () => {
    it("accepts valid queries", () => {
      const result = DomainResearchQuerySchema.safeParse({
        queries: ["fintech user jobs", "fintech competitors"],
        libraries: ["stripe", "plaid"],
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty queries array", () => {
      const result = DomainResearchQuerySchema.safeParse({ queries: [] });
      expect(result.success).toBe(false);
    });
  });

  describe("DomainResearchSynthesisSchema", () => {
    it("accepts valid synthesis", () => {
      const result = DomainResearchSynthesisSchema.safeParse({
        targetPersonas: ["freelancers", "small business owners"],
        competitiveGaps: ["No real-time sync"],
        entities: ["Invoice", "Client", "Payment"],
        userJobs: ["Track expenses", "Generate invoices"],
        domainConstraints: ["PCI compliance required"],
        riskyAssumptions: ["Users want AI categorization"],
        unresolvedQuestions: ["Which payment gateway?"],
        architectureNotes: ["Use event sourcing for transactions"],
      });
      expect(result.success).toBe(true);
    });
  });

  describe("DomainResearchBundleSchema", () => {
    it("accepts valid bundle", () => {
      const result = DomainResearchBundleSchema.safeParse({
        queries: ["q1", "q2"],
        detectedLibraries: ["stripe"],
        libraries: ["next.js", "stripe"],
        webResults: ["result1", "result2"],
        libraryDocResults: ["docs1"],
        synthesis: {
          targetPersonas: ["dev"],
          competitiveGaps: ["gap"],
          entities: ["User"],
          userJobs: ["build"],
          domainConstraints: [],
          riskyAssumptions: [],
          unresolvedQuestions: [],
          architectureNotes: [],
        },
      });
      expect(result.success).toBe(true);
    });
  });

  describe("NarrativeSectionSchema", () => {
    it("accepts valid section", () => {
      const result = NarrativeSectionSchema.safeParse({
        name: "Hero",
        job: "Establish brand identity",
        headline: "Build agents that work",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("PaletteRoleSchema", () => {
    it("accepts palette with exactly 11 hex values", () => {
      const result = PaletteRoleSchema.safeParse({
        role: "primary",
        hex: ["#eff6ff","#dbeafe","#bfdbfe","#93c5fd","#60a5fa","#3b82f6","#2563eb","#1d4ed8","#1e40af","#1e3a8a","#172554"],
      });
      expect(result.success).toBe(true);
    });

    it("rejects palette with wrong number of hex values", () => {
      const result = PaletteRoleSchema.safeParse({
        role: "primary",
        hex: ["#fff", "#000"],
      });
      expect(result.success).toBe(false);
    });
  });

  describe("DesignSynthesisSchema", () => {
    it("accepts valid synthesis with narrative sections", () => {
      const result = DesignSynthesisSchema.safeParse({
        landingPagePattern: "Full bleed hero",
        onboardingPattern: "3-step wizard",
        coreScreenPattern: "Dashboard with sidebar",
        domainPatterns: ["Card-based layouts"],
        competitorInsights: "Competitors use dark mode",
        narrativeSections: [
          { name: "Hero", job: "Brand", headline: "Build" },
          { name: "Features", job: "Show value", headline: "Ship faster" },
        ],
      });
      expect(result.success).toBe(true);
    });

    it("rejects synthesis with fewer than 2 narrative sections", () => {
      const result = DesignSynthesisSchema.safeParse({
        landingPagePattern: "test",
        onboardingPattern: "test",
        coreScreenPattern: "test",
        domainPatterns: [],
        competitorInsights: "test",
        narrativeSections: [{ name: "Hero", job: "Brand", headline: "Build" }],
      });
      expect(result.success).toBe(false);
    });
  });

  describe("VisualDesignSynthesisSchema", () => {
    const validVisual = {
      surfaceStrategy: "product-application" as const,
      surfaceRationale: "App-focused",
      visualThesis: "Clean minimal interface with purposeful typography",
      style: "modern-minimalist",
      palette: Array.from({ length: 6 }, (_, i) => ({
        role: ["primary", "secondary", "accent", "neutral", "surface", "background"][i],
        hex: Array.from({ length: 11 }, () => "#000000"),
      })),
      tailwindTheme: "@theme { --color-primary-500: #3b82f6; }",
      uiLibraries: ["shadcn/ui"],
      typography: "Display: Fraunces. Body: DM Sans.",
      spacing: "4px base",
      borderRadius: "8px",
      motion: "150ms ease-out",
      interactionThesis: ["Fade-up on load", "Scroll-linked parallax"],
      backgroundAtmosphere: "Subtle gradient with noise grain",
      guidelines: ["Use consistent spacing"],
    };

    it("accepts valid visual synthesis", () => {
      const result = VisualDesignSynthesisSchema.safeParse(validVisual);
      expect(result.success).toBe(true);
    });

    it("rejects fewer than 6 palette roles", () => {
      const result = VisualDesignSynthesisSchema.safeParse({
        ...validVisual,
        palette: [{ role: "primary", hex: Array.from({ length: 11 }, () => "#000") }],
      });
      expect(result.success).toBe(false);
    });

    it("rejects fewer than 2 interaction theses", () => {
      const result = VisualDesignSynthesisSchema.safeParse({
        ...validVisual,
        interactionThesis: ["only one"],
      });
      expect(result.success).toBe(false);
    });
  });

  describe("UxResearchInputSchema", () => {
    it("accepts valid input", () => {
      const result = UxResearchInputSchema.safeParse({
        rawPrompt: "I want to build a personal finance tracker",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.platforms).toEqual(["web", "mobile", "backend"]);
        expect(result.data.authFree).toBe(false);
      }
    });

    it("rejects empty prompt", () => {
      const result = UxResearchInputSchema.safeParse({ rawPrompt: "" });
      expect(result.success).toBe(false);
    });
  });

  describe("UxResearchOutputSchema", () => {
    it("accepts minimal output", () => {
      const result = UxResearchOutputSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.resolvedSkills).toEqual([]);
        expect(result.data.designResearch).toEqual([]);
      }
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Intent Classifier contracts
// ═══════════════════════════════════════════════════════════════════════════

describe("intent-classifier", () => {
  describe("IntentClassifierInputSchema", () => {
    it("accepts valid input", () => {
      const result = IntentClassifierInputSchema.safeParse({
        rawPrompt: "I need an agent that monitors my inbox",
        sessionId: "sess-001",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty prompt", () => {
      const result = IntentClassifierInputSchema.safeParse({ rawPrompt: "" });
      expect(result.success).toBe(false);
    });
  });

  describe("IntentClassifierOutputSchema", () => {
    it("accepts valid output", () => {
      const result = IntentClassifierOutputSchema.safeParse({
        normalizedPrompt: "monitor inbox agent",
        explicitSignals: ["email", "monitoring"],
        agentType: "email",
        useCase: "Inbox monitoring with daily digest",
        deploymentPreference: "cloud",
        graphPattern: "ReAct",
        connectorRefs: ["gmail-mcp"],
        dataSensitivity: "high",
        complexityScore: 0.6,
        suggestedTier: "pro",
        confidence: 0.85,
        requiresClarification: false,
      });
      expect(result.success).toBe(true);
    });

    it("rejects complexityScore > 1", () => {
      const result = IntentClassifierOutputSchema.safeParse({
        normalizedPrompt: "test",
        agentType: "rag",
        useCase: "test",
        deploymentPreference: "local",
        graphPattern: "ReAct",
        complexityScore: 1.5,
        suggestedTier: "starter",
        confidence: 0.5,
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid agentType", () => {
      const result = IntentClassifierOutputSchema.safeParse({
        normalizedPrompt: "test",
        agentType: "invalid-type",
        useCase: "test",
        deploymentPreference: "local",
        graphPattern: "ReAct",
        complexityScore: 0.5,
        suggestedTier: "starter",
        confidence: 0.5,
      });
      expect(result.success).toBe(false);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// RAG Retriever contracts
// ═══════════════════════════════════════════════════════════════════════════

describe("rag-retriever", () => {
  describe("RagRetrieverInputSchema", () => {
    it("accepts valid input with defaults", () => {
      const result = RagRetrieverInputSchema.safeParse({
        query: "How does the billing system work?",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.topK).toBe(10);
        expect(result.data.mode).toBe("cloud");
      }
    });

    it("accepts input with all fields", () => {
      const result = RagRetrieverInputSchema.safeParse({
        query: "billing",
        clientId: "client-1",
        dateRange: { start: "2025-01-01", end: "2025-12-31" },
        docTypes: ["pdf", "md"],
        topK: 5,
        mode: "local",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("RagRetrieverOutputSchema", () => {
    it("accepts valid output", () => {
      const result = RagRetrieverOutputSchema.safeParse({
        retrievedChunks: [
          { chunkId: "c1", content: "Billing info", metadata: { source: "doc.pdf" } },
        ],
        sourceRefs: [
          { chunkId: "c1", source: "doc.pdf", score: 0.95, snippet: "Billing info" },
        ],
        contextWindow: "Billing info from doc.pdf",
        chunkCount: 1,
      });
      expect(result.success).toBe(true);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Doc Ingestion contracts
// ═══════════════════════════════════════════════════════════════════════════

describe("doc-ingestion", () => {
  describe("DocIngestionInputSchema", () => {
    it("accepts valid input", () => {
      const result = DocIngestionInputSchema.safeParse({
        s3Key: "uploads/report.pdf",
        clientId: "client-123",
        docType: "pdf",
      });
      expect(result.success).toBe(true);
    });

    it("requires clientId", () => {
      const result = DocIngestionInputSchema.safeParse({
        s3Key: "uploads/report.pdf",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("DocIngestionOutputSchema", () => {
    it("accepts valid output", () => {
      const result = DocIngestionOutputSchema.safeParse({
        chunkCount: 42,
        vectorIds: ["v1", "v2"],
        registryEntry: {
          documentId: "doc-001",
          clientId: "client-123",
          docType: "pdf",
          status: "indexed",
          chunkCount: 42,
          ingestedAt: "2025-12-01T00:00:00Z",
        },
        detectedFormat: "pdf",
        status: "indexed",
      });
      expect(result.success).toBe(true);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Web Researcher contracts
// ═══════════════════════════════════════════════════════════════════════════

describe("web-researcher", () => {
  it("accepts valid input", () => {
    const result = WebResearcherInputSchema.safeParse({
      topic: "AI agent architecture patterns 2026",
      maxSources: 5,
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid output", () => {
    const result = WebResearcherOutputSchema.safeParse({
      findings: [
        { title: "Agent patterns", url: "https://example.com", snippet: "...", relevanceScore: 0.9 },
      ],
      synthesis: { headline: "AI agents are evolving", keyPoints: ["trend1"], sentiment: "positive", confidence: 0.8 },
      sourceUrls: ["https://example.com"],
    });
    expect(result.success).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Doc Processor contracts
// ═══════════════════════════════════════════════════════════════════════════

describe("doc-processor", () => {
  it("accepts valid input", () => {
    const result = DocProcessorInputSchema.safeParse({
      rawContent: "# Report\nThis is a test document.",
      processingDepth: "deep",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid output with QA pairs", () => {
    const result = DocProcessorOutputSchema.safeParse({
      structuredContent: "structured",
      summary: "A test document about reports.",
      qaPairs: [{ question: "What is this?", answer: "A report.", confidence: 0.9 }],
      keyEntities: ["Report"],
    });
    expect(result.success).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Page Scanner contracts
// ═══════════════════════════════════════════════════════════════════════════

describe("page-scanner", () => {
  it("accepts valid input", () => {
    const result = PageScannerInputSchema.safeParse({
      pageUrl: "https://example.com",
      storePolicy: "always",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid output", () => {
    const result = PageScannerOutputSchema.safeParse({
      entities: [{ name: "OpenAI", type: "organization", confidence: 0.95 }],
      insights: [{ claim: "AI is growing", evidence: "Revenue up 300%", category: "market" }],
      contentType: "article",
      topicTags: ["AI", "business"],
      relevanceScore: 0.8,
      stored: true,
      vectorId: "v-123",
      headline: "OpenAI raises billions",
    });
    expect(result.success).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Email Processor contracts
// ═══════════════════════════════════════════════════════════════════════════

describe("email-processor", () => {
  it("accepts valid input", () => {
    const result = EmailProcessorInputSchema.safeParse({
      emailPayload: {
        from: "alice@example.com",
        to: ["bob@example.com"],
        subject: "Meeting tomorrow",
        body: "Let's meet at 10am.",
        date: "2026-04-19T08:00:00Z",
      },
      replyDraftEnabled: true,
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid output", () => {
    const result = EmailProcessorOutputSchema.safeParse({
      priority: "high",
      actionItems: [{ description: "Attend meeting", priority: "high" }],
      suggestedReply: "I'll be there at 10am.",
      routing: "calendar",
      summary: "Meeting request for tomorrow at 10am",
    });
    expect(result.success).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Journal Enricher contracts
// ═══════════════════════════════════════════════════════════════════════════

describe("journal-enricher", () => {
  it("accepts valid input", () => {
    const result = JournalEnricherInputSchema.safeParse({
      rawContent: "Today I worked on the agent platform...",
      entryDate: "2026-04-19",
      existingThemes: ["productivity"],
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid output", () => {
    const result = JournalEnricherOutputSchema.safeParse({
      themes: ["productivity", "agent-development"],
      moodScore: 0.7,
      energyLevel: 0.8,
      coreQuestions: ["What is the right abstraction level?"],
      insightSummary: "Focused session on platform architecture.",
      publicRewrite: "Spent the day building agent infrastructure.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects moodScore outside range", () => {
    const result = JournalEnricherOutputSchema.safeParse({
      moodScore: 2,
    });
    expect(result.success).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Connector Orchestrator contracts
// ═══════════════════════════════════════════════════════════════════════════

describe("connector-orchestrator", () => {
  it("accepts valid input", () => {
    const result = ConnectorOrchestratorInputSchema.safeParse({
      connectorId: "gmail-mcp",
      action: "send-email",
      payload: { to: "bob@example.com", body: "Hello" },
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid output", () => {
    const result = ConnectorOrchestratorOutputSchema.safeParse({
      result: { messageId: "msg-123" },
      status: "success",
      creditsConsumed: 2,
    });
    expect(result.success).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Daily Briefing contracts
// ═══════════════════════════════════════════════════════════════════════════

describe("daily-briefing", () => {
  it("accepts valid input", () => {
    const result = DailyBriefingInputSchema.safeParse({
      userId: "user-001",
      topics: ["AI", "fintech"],
      date: "2026-04-19",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty topics", () => {
    const result = DailyBriefingInputSchema.safeParse({
      userId: "user-001",
      topics: [],
      date: "2026-04-19",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid output", () => {
    const result = DailyBriefingOutputSchema.safeParse({
      briefingMarkdown: "# Daily Briefing\n...",
      deliveryStatus: "delivered",
      topicCount: 2,
      sourcesUsed: 8,
    });
    expect(result.success).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Monitor Alert contracts
// ═══════════════════════════════════════════════════════════════════════════

describe("monitor-alert", () => {
  it("accepts valid input", () => {
    const result = MonitorAlertInputSchema.safeParse({
      clientId: "client-123",
      watchlistId: "wl-001",
      alertThreshold: 0.7,
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid output", () => {
    const result = MonitorAlertOutputSchema.safeParse({
      changes: [{ url: "https://example.com", field: "price", previousValue: "$10", currentValue: "$15", significance: 0.9 }],
      alertsFired: ["Price increase detected"],
      nextRunAt: "2026-04-20T00:00:00Z",
    });
    expect(result.success).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Agent Builder contracts
// ═══════════════════════════════════════════════════════════════════════════

describe("agent-builder", () => {
  it("accepts valid input", () => {
    const result = AgentBuilderInputSchema.safeParse({
      userRequirement: "I need an agent that monitors competitor pricing",
      clientId: "client-123",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid output", () => {
    const result = AgentBuilderOutputSchema.safeParse({
      agentSpec: {
        name: "price-monitor",
        description: "Monitors competitor pricing pages",
        graphPattern: "ReAct",
        nodeCount: 5,
        subgraphDependencies: ["graph-page-scanner", "graph-rag-retriever"],
        estimatedComplexity: "medium",
      },
      graphBlueprint: "graph definition...",
      estimatedCredits: 50,
      recommendedTier: "pro",
    });
    expect(result.success).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Supervisor contracts
// ═══════════════════════════════════════════════════════════════════════════

describe("supervisor", () => {
  it("accepts valid input", () => {
    const result = SupervisorInputSchema.safeParse({
      sessionId: "sess-001",
      userMessage: "What happened with my inbox today?",
      clientId: "client-123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty userMessage", () => {
    const result = SupervisorInputSchema.safeParse({
      sessionId: "sess-001",
      userMessage: "",
      clientId: "client-123",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid output", () => {
    const result = SupervisorOutputSchema.safeParse({
      response: "Here's your inbox summary...",
      creditsUsed: 3,
      traceId: "trace-abc",
      routedTo: "graph-email-processor",
      guardrailResult: { passed: true, violations: [], action: "allow" },
    });
    expect(result.success).toBe(true);
  });
});
