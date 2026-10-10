# Graphify: Atlas Forense + JuridIA (10/10/2026)

Mapa estático da branch `feat/atlas-graphify-audit-vps-20261010` no commit `b3c27180`, indexado localmente na VPS em modo code-only, sem dados de clientes ou API externa.

O mapeamento atualizado analisa 424 arquivos e reúne 3.286 nós e 6.775 relações. A visualização interativa `graph.html` e o JSON completo permanecem no diretório privado `/opt/atlas-juridico/audit-vps-graphql-20261010/graphify-out/`.

O grafo de código não comprova a conectividade real. Ver o relatório separado de homologação.

---

# Graph Report - audit-vps-graphql-20261010  (2026-10-10)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 3286 nodes · 6775 edges · 193 communities (168 shown, 25 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 86 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b3c27180`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
- Community 75
- Community 76
- Community 77
- Community 78
- Community 79
- Community 80
- Community 81
- Community 82
- Community 83
- Community 84
- Community 85
- Community 86
- Community 87
- Community 88
- Community 89
- Community 90
- Community 91
- Community 92
- Community 93
- Community 94
- Community 95
- Community 96
- Community 97
- Community 98
- Community 99
- Community 100
- Community 101
- Community 102
- Community 103
- Community 104
- Community 105
- Community 106
- Community 107
- Community 108
- Community 109
- Community 110
- Community 111
- Community 112
- Community 113
- Community 114
- Community 115
- Community 116
- Community 117
- Community 118
- Community 119
- Community 120
- Community 121
- Community 122
- Community 123
- Community 124
- Community 125
- Community 126
- Community 127
- Community 128
- Community 129
- Community 130
- Community 131
- Community 132
- Community 133
- Community 134
- Community 135
- Community 136
- Community 137
- Community 138
- Community 139
- Community 140
- Community 141
- Community 142
- Community 143
- Community 144
- Community 145
- Community 146
- Community 147
- Community 148
- Community 149
- Community 150
- Community 151
- Community 152
- Community 153
- Community 154
- Community 155
- Community 156
- Community 157
- Community 158
- Community 159
- Community 160
- Community 161
- Community 162
- Community 163
- Community 164
- Community 165
- Community 166
- Community 167
- Community 168
- Community 169
- Community 170
- Community 171
- Community 172
- Community 173
- Community 174
- Community 175
- Community 176
- Community 177
- Community 178
- Community 179
- Community 180
- Community 181
- Community 182
- Community 183
- Community 184
- Community 185
- Community 186
- Community 187
- Community 188
- Community 189

## God Nodes (most connected - your core abstractions)
1. `requireAuth()` - 140 edges
2. `Communities (140 total, 14 thin omitted)` - 127 edges
3. `logAuditEvent()` - 94 edges
4. `cn()` - 74 edges
5. `next` - 67 edges
6. `getDb()` - 66 edges
7. `AppRouter` - 54 edges
8. `Button()` - 54 edges
9. `vitest` - 50 edges
10. `Badge()` - 49 edges

## Surprising Connections (you probably didn't know these)
- `Shared package — `@juridico/shared`` --references--> `CitationRef`  [INFERRED]
  README.md → packages/shared/citation-types.ts
- `Shared package — `@juridico/shared`` --references--> `VerifiedCitation`  [INFERRED]
  README.md → packages/shared/citation-types.ts
- `Shared package — `@juridico/shared`` --references--> `CitationGateResult`  [INFERRED]
  README.md → packages/shared/citation-types.ts
- `Shared package — `@juridico/shared`` --references--> `LegalAssertion`  [INFERRED]
  README.md → packages/shared/evidence-types.ts
- `Atlas Forense (mesma revisão)` --references--> `SiteNav()`  [INFERRED]
  apps/atlas-forense/docs/paridade-minutaia.md → apps/atlas-forense/client/src/components/SiteNav.tsx

## Import Cycles
- None detected.

## Communities (193 total, 25 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.02
Nodes (127): Communities (140 total, 14 thin omitted), Community 0 - "Community 0", Community 100 - "Community 100", Community 101 - "Community 101", Community 102 - "Community 102", Community 103 - "Community 103", Community 104 - "Community 104", Community 105 - "Community 105" (+119 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (54): BatchPanel(), callGenerate(), generateMold(), generateRest(), BatchResult, norm(), parseBatchCases(), ParsedCase (+46 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (64): God Nodes (most connected - your core abstractions), 2. Matriz de rotas — contrato mínimo a preservar, GET(), DELETE(), dynamic, GET(), PATCH(), POST() (+56 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (54): Assistente(), BibliotecaJuridica(), JurisprudenceResult, Skill, CalculadoraJuridica(), Cerebro(), analyze(), handleUpload() (+46 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (57): dynamic, GET(), POST(), dynamic, POST(), dynamic, POST(), dynamic (+49 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (53): OfficeClienteDetalhePage(), validarCnjOuCru(), officeJurisprudencia, officeJurisprudenciaSettings, fetchJson(), fetchProvider(), fetchText(), JurisSettingsView (+45 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (48): dataTexto(), KIND_LABEL, OfficeComunicacoesPage(), calcular(), calcularPresc(), usarTeorDaComunicacao(), Validação do Compêndio Jurídico Nacional, Base normativa implementada (+40 more)

### Community 7 - "Community 7"
Cohesion: 0.06
Nodes (47): comparePublicRelatedDecisions(), comparisonWindows, enforceComparisonRateLimit(), assertApiKey(), computeBackoffDelay(), ensureArray(), FetchInit, fetchWithBackoff() (+39 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (44): auditEvents, editorialUpdateRuns, editorialUpdates, editorialUpdateSchedules, evidenceReviewItems, evidenceSources, ingestionBatches, InsertUser (+36 more)

### Community 9 - "Community 9"
Cohesion: 0.07
Nodes (42): O que foi efetivamente implementado, ALLOWED_ROLES, BLOCKED_PII, dynamic, POST(), BrainResult, BrainStep, dynamic (+34 more)

### Community 10 - "Community 10"
Cohesion: 0.15
Nodes (42): decideEditorialUpdate(), decideEvidenceReview(), enqueueEvidenceReview(), getCitationDossier(), getCompendiumOverview(), getDb(), getDecisionRelatedDocuments(), getEditorialUpdateQueue() (+34 more)

### Community 11 - "Community 11"
Cohesion: 0.10
Nodes (40): logUsageEntry(), applyReviewCorrections(), buildDraftUserPrompt(), buildFactsBlock(), buildMarkerList(), buildOutlineUserPrompt(), buildReferencesBlock(), buildReviewUserPrompt() (+32 more)

### Community 12 - "Community 12"
Cohesion: 0.07
Nodes (36): AdvancedEvidencePanel(), CityFilter, data, displayDate(), filingIso(), fmt, months, ProcessRow (+28 more)

### Community 13 - "Community 13"
Cohesion: 0.11
Nodes (35): aliases, aliasOption, clearScroll(), EXECUTE, isFinalLower(), isLimitedPilot, judgingBodyCodes, main() (+27 more)

### Community 14 - "Community 14"
Cohesion: 0.10
Nodes (31): dynamic, GET(), dynamic, GET(), dynamic, GET(), dynamic, POST() (+23 more)

### Community 15 - "Community 15"
Cohesion: 0.14
Nodes (23): Editor paginado com timbrado, CitationChecker(), CitationCheckerProps, STATUS_CONFIG, SummaryCard(), Editor(), contentToHtml(), downloadDocx() (+15 more)

### Community 16 - "Community 16"
Cohesion: 0.08
Nodes (33): dynamic, GET(), POST(), dynamic, GET(), dynamic, GET(), POST() (+25 more)

### Community 17 - "Community 17"
Cohesion: 0.15
Nodes (8): ErrorBoundary, Props, State, Tooltip(), TooltipContent(), TooltipProvider(), cn(), @radix-ui/react-tooltip

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (32): dynamic, maxDuration, POST(), llmCall(), parseJSON(), PipelinePhase, PipelineResult, PipelineStep (+24 more)

### Community 19 - "Community 19"
Cohesion: 0.08
Nodes (16): id_floor_from(), main(), parse_entries(), parse_skill(), parse_status(), render(), slugify(), split_top_level() (+8 more)

### Community 20 - "Community 20"
Cohesion: 0.12
Nodes (28): 1. Arquitetura, getSessionCookieOptions(), isSecureRequest(), LOCAL_HOSTS, b64u(), callbackUri(), discoveryCache, DiscoveryDoc (+20 more)

### Community 21 - "Community 21"
Cohesion: 0.06
Nodes (30): Citation, extractCitations(), STATUS_LABELS, verifyCitations(), VerifyResult, allMarkers, allowedIds, already (+22 more)

### Community 22 - "Community 22"
Cohesion: 0.13
Nodes (28): EXECUTE, main(), projectRoot, publicKeyInMemory(), scriptDir, ALLOWED_FIELD_MARKERS, collectSafeErrorTypes(), descendantFilterPath (+20 more)

### Community 23 - "Community 23"
Cohesion: 0.11
Nodes (25): CaseItem, EDGE_COLORS, GrafoSistema(), GraphData, GraphEdge, GraphNode, layout(), NODE_COLORS (+17 more)

### Community 24 - "Community 24"
Cohesion: 0.07
Nodes (25): CITATION_PATTERNS, CitationGateResult, CitationRef, VerifiedCitation, ejcAuthBridge, ejcIntegrationManifest, EpistemicState, EvidenceItem (+17 more)

### Community 25 - "Community 25"
Cohesion: 0.11
Nodes (25): Home(), AnonResult, Anonymization(), Faq(), FAQS, Features, Hero(), HowItWorks() (+17 more)

### Community 26 - "Community 26"
Cohesion: 0.12
Nodes (27): dynamic, GET(), maxDuration, POST(), canonicalHash(), createEvidence(), CreateEvidenceInput, EvidenceGateError (+19 more)

### Community 27 - "Community 27"
Cohesion: 0.08
Nodes (25): dynamic, maxDuration, MoldeChange, POST(), dynamic, generateFallback(), maxDuration, POST() (+17 more)

### Community 28 - "Community 28"
Cohesion: 0.10
Nodes (22): batches, bodyByCode, civilCodes, consumerCodes, EXECUTE, manifest, manifestBase, projectRoot (+14 more)

### Community 29 - "Community 29"
Cohesion: 0.15
Nodes (24): GraphEdgeData, GraphNodeData, NODE_COLORS, NODE_LABELS, CommandItemDef, CommandPalette(), CardAction(), CardDescription() (+16 more)

### Community 30 - "Community 30"
Cohesion: 0.07
Nodes (30): dependencies, axios, clsx, cookie, dotenv, drizzle-orm, express, html-to-image (+22 more)

### Community 31 - "Community 31"
Cohesion: 0.12
Nodes (21): 5. Observações para o responsável do bot (JuridIA Auto-Deploy), User, AuthenticatedUser, CookieCall, TrpcContext, getQueryParam(), registerOAuthRoutes(), AuthenticatedUser (+13 more)

### Community 32 - "Community 32"
Cohesion: 0.12
Nodes (23): attempts, dynamic, POST(), rateLimited(), dynamic, AuthedUser, base64UrlDecode(), base64UrlEncode() (+15 more)

### Community 33 - "Community 33"
Cohesion: 0.07
Nodes (27): clsx, lucide-react, next-themes, react, react-dom, tailwind-merge, tailwindcss, tw-animate-css (+19 more)

### Community 34 - "Community 34"
Cohesion: 0.07
Nodes (25): clsx, lucide-react, next-themes, react, react-dom, tailwind-merge, tailwindcss, tw-animate-css (+17 more)

### Community 35 - "Community 35"
Cohesion: 0.13
Nodes (23): Controles de segurança implementados, officeCommunications, officeDjenSettings, main(), auditDjen(), DjenSettingsView, fetchComunica(), getDjenSettings() (+15 more)

### Community 36 - "Community 36"
Cohesion: 0.12
Nodes (24): STRONG_TOKEN, Amount, BRAIN_API_PREFIX, BRAIN_CITABLE_SOURCE_STATUSES, BRAIN_JURIMETRY_LIMITS, BRAIN_SEARCH_MAX_PAGE_SIZE, BRAIN_THESIS_SOURCE_KEY, BrainDecision (+16 more)

### Community 37 - "Community 37"
Cohesion: 0.11
Nodes (16): CompendiumPage, Props, statusLabels, Thesis, ThesisEvidenceMap(), Topic, CompendiumPage(), formatDate() (+8 more)

### Community 38 - "Community 38"
Cohesion: 0.15
Nodes (18): enforceRateLimit(), requestWindows, summarizePublicDecision(), IngestionCandidate, IngestionPreview, isHttpsUrl(), previewControlledIngestion(), isSafePublicCitationAuditEvent() (+10 more)

### Community 39 - "Community 39"
Cohesion: 0.14
Nodes (17): geistMono, geistSans, metadata, RootLayout(), ThemeProvider(), Toast, ToastAction, ToastActionElement (+9 more)

### Community 40 - "Community 40"
Cohesion: 0.17
Nodes (20): Generator(), generate(), readSse(), NAV, SiteHeader(), ThemeToggle(), Button(), buttonVariants (+12 more)

### Community 41 - "Community 41"
Cohesion: 0.10
Nodes (22): getUserByOpenId(), CLIENT_EVENT_ALLOWLIST, ClientEventName, clientEventSchemas, DEFAULT_LIMITS, DEFAULT_NOTIFICATION_PORT, DEV_DEFAULT_ORIGINS, EmitRequest (+14 more)

### Community 42 - "Community 42"
Cohesion: 0.13
Nodes (12): MetropolitanCoveragePage, EditorialUpdatesPanel(), formatDate(), kindLabel, trpc, queryClient, redirectToLoginIfUnauthorized(), trpcClient (+4 more)

### Community 43 - "Community 43"
Cohesion: 0.08
Nodes (25): dependencies, class-variance-authority, clsx, cmdk, framer-motion, lucide-react, next, next-themes (+17 more)

### Community 44 - "Community 44"
Cohesion: 0.14
Nodes (11): buildCivilConsumerDescendantFilter(), prepareCivilConsumerDescendantFilter(), ROOT_CODES, execFileAsync, temporaryDirectories, execFileAsync, manifest, temporaryDirectories (+3 more)

### Community 45 - "Community 45"
Cohesion: 0.14
Nodes (20): dynamic, GET(), PATCH(), POST(), formatOAB(), isPrismaUniqueViolation(), MAX_API_TEXT_LENGTH, normalizeOAB() (+12 more)

### Community 46 - "Community 46"
Cohesion: 0.12
Nodes (16): App(), Home, OfficeClienteDetalhePage, OfficeClientesPage, OfficeComunicacoesPage, OfficeJurisprudenciaPage, PageLoader(), Toaster() (+8 more)

### Community 47 - "Community 47"
Cohesion: 0.14
Nodes (16): CitationDossierPage, SITE_NAV_GROUPS, SiteNav(), SiteNavGroup, SiteNavItem, CitationDossierPage(), copyReference(), downloadDossier() (+8 more)

### Community 48 - "Community 48"
Cohesion: 0.16
Nodes (18): ControlCenterPage, EditorialReviewPage, startLogin(), useAuth(), UseAuthOptions, notificationSchema, useRealtimeNotifications(), disconnectRealtime() (+10 more)

### Community 49 - "Community 49"
Cohesion: 0.14
Nodes (21): `audit_events`, audit_events_entity_idx, `evidence_sources`, evidence_sources_status_idx, `ingestion_batches`, ingestion_batches_status_idx, jurisprudence_city_idx, `jurisprudence_records` (+13 more)

### Community 50 - "Community 50"
Cohesion: 0.13
Nodes (18): ENV, buildEndpointUrl(), isNonEmptyString(), NotificationPayload, notifyOwner(), trimValue(), validatePayload(), systemRouter (+10 more)

### Community 51 - "Community 51"
Cohesion: 0.18
Nodes (18): dynamic, POST(), DELETE(), dynamic, GET(), PATCH(), POST(), dynamic (+10 more)

### Community 52 - "Community 52"
Cohesion: 0.19
Nodes (10): createContext(), findAvailablePort(), isPortAvailable(), startServer(), getServerListenOptions(), registerStorageProxy(), serveStatic(), setupVite() (+2 more)

### Community 53 - "Community 53"
Cohesion: 0.16
Nodes (14): GovernancePage, PublicSourcesPage, icons, laneIcons, formatDate(), PublicSourcesPage(), statusLabel, COMPENDIUM_MODULES (+6 more)

### Community 54 - "Community 54"
Cohesion: 0.10
Nodes (20): 3 Personas, Acesse http://localhost:3000, ⚖️ Arquitetura, 🛡️ Camadas, Configurar .env, 📚 Conhecimento jurídico real (não fictício), Cérebro Jurídico (zona única — sem ERP), Em desenvolvimento, popular base de conhecimento (OPCIONAL — só dev): (+12 more)

### Community 55 - "Community 55"
Cohesion: 0.15
Nodes (20): buildCaseGraph(), buildSystemGraph(), CaseGraphNode, edgeId(), EdgeType, GraphEdge, GraphNode, GraphResult (+12 more)

### Community 56 - "Community 56"
Cohesion: 0.13
Nodes (19): AI_ENABLED, AI_EXTERNAL_PROVIDERS_ALLOWED, ensureDraftMarker(), getEligibleProviders(), getSanitizationMode(), hasAvailableProvider(), isProviderEligible(), providerAllowedForMode() (+11 more)

### Community 57 - "Community 57"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 58 - "Community 58"
Cohesion: 0.17
Nodes (9): buildCronUser(), isNonEmptyString(), SDKServer, GetUserInfoWithJwtResponse, BadRequestError(), ForbiddenError(), HttpError, NotFoundError() (+1 more)

### Community 59 - "Community 59"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, baseUrl, esModuleInterop, incremental, jsx, lib, module (+10 more)

### Community 60 - "Community 60"
Cohesion: 0.11
Nodes (17): Author Attribution Template, Confidentiality layers, Configuration vs process — the three-container rule, Documenting an external tool surface, Editing skills — always start from the live file, Lean Content, Licensing, New skills (+9 more)

### Community 61 - "Community 61"
Cohesion: 0.11
Nodes (16): Método e controles, Pré-consulta de indexação DataJud/TJMG, Referências, Resultado do mapeamento, Uso futuro permitido, Árvore TPU Cível/Consumidor — mapeamento metodológico, Confirmações diretas prioritárias, Expansão RMBH e ramos do Direito — fontes e escopo inicial (+8 more)

### Community 62 - "Community 62"
Cohesion: 0.11
Nodes (18): devDependencies, drizzle-kit, esbuild, prettier, tailwindcss, @tailwindcss/vite, tsx, tw-animate-css (+10 more)

### Community 63 - "Community 63"
Cohesion: 0.13
Nodes (10): OAuthService, AuthorizeRequest, AuthorizeResponse, CanAccessRequest, CanAccessResponse, ExchangeTokenRequest, ExchangeTokenResponse, GetUserInfoRequest (+2 more)

### Community 64 - "Community 64"
Cohesion: 0.22
Nodes (14): claimDailyEditorialRun(), enqueueEditorialCandidates(), existingEditorialKeys(), finishEditorialRun(), getEditorialScheduleByTaskUid(), candidate(), collectOfficialEditorialCandidates(), EditorialCandidate (+6 more)

### Community 65 - "Community 65"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 66 - "Community 66"
Cohesion: 0.04
Nodes (42): nextConfig, importSkills(), parseFrontmatter(), FONTES_ATUALIZADAS, main(), probe(), SKILLS, SKILLS (+34 more)

### Community 67 - "Community 67"
Cohesion: 0.12
Nodes (16): Checking in on observations, Checking whether the skill has loaded, Dual-layer activation, Getting kickstarted, Getting Started with the task-observer meta-skill (aka "One skill to rule them all"), How the skill works during a session, Making the skill your own, Open-source vs internal skills (+8 more)

### Community 68 - "Community 68"
Cohesion: 0.24
Nodes (15): compactText(), describeElement(), elText(), formatArg(), formatArgs(), getInputValueSafe(), installUiEventListeners(), nav() (+7 more)

### Community 69 - "Community 69"
Cohesion: 0.18
Nodes (16): `office_attendances`, office_attendances_client_idx, `office_clients`, office_clients_name_idx, `office_communications`, office_communications_cnj_idx, office_communications_received_idx, office_communications_status_idx (+8 more)

### Community 70 - "Community 70"
Cohesion: 0.12
Nodes (16): Assertion, AssertionKind, Event, EvidenceRef, Fact, KIND_CONFIG, LegalIssue, MapResult (+8 more)

### Community 71 - "Community 71"
Cohesion: 0.12
Nodes (15): A session-start hook (Claude Code and similar harnesses), Bundle manifest, Compaction behaviour, Environment mappings, Environments, Activation Setup, and Handoff-Doc Mode, First-run backfill, Git as an optional staging medium, Handoff-doc analysis (when one arrives) (+7 more)

### Community 72 - "Community 72"
Cohesion: 0.12
Nodes (15): aliases, components, hooks, lib, ui, utils, rsc, $schema (+7 more)

### Community 73 - "Community 73"
Cohesion: 0.15
Nodes (15): Community Hubs (Navigation), Corpus Check, Graph Freshness, Graph Report - audit-vps-graphql-20261010  (2026-10-10), Import Cycles, Knowledge Gaps, Mapeamento Graphify, Atlas + JuridIA (10/10/2026), Suggested Questions (+7 more)

### Community 74 - "Community 74"
Cohesion: 0.12
Nodes (15): 1. O que o MinutaIA faz (modelo de referência), 2. Estado do JuridIA antes desta revisão (auditoria), 3.2 Revisão 2 — fechamento das três lacunas operáveis (mesma task), 3. Implementado nesta revisão (commits desta task), 4. Lacunas remanescentes (roadmap honesto, revisado), 5. Operação, Atlas Forense (mesma revisão), Geração em lote com aprovação de molde (+7 more)

### Community 75 - "Community 75"
Cohesion: 0.17
Nodes (10): main(), parseCsv(), parseLine(), main(), parseCsv(), p0, main(), parseCsv() (+2 more)

### Community 76 - "Community 76"
Cohesion: 0.31
Nodes (15): guard(), handleCompendiumSearch(), handleJurimetry(), handleKnowledgeHealth(), handleKnowledgeItem(), handleKnowledgeSnapshot(), handleThesisSubmission(), limiter (+7 more)

### Community 77 - "Community 77"
Cohesion: 0.12
Nodes (15): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+7 more)

### Community 78 - "Community 78"
Cohesion: 0.12
Nodes (14): interpret(), classifyIntent(), EXAMPLE_CHIPS, INTENTS, IntentTab, ScoredIntent, APP_TAB_ALIASES, APP_TABS (+6 more)

### Community 79 - "Community 79"
Cohesion: 0.12
Nodes (15): devDependencies, concurrently, name, private, scripts, build:atlas, build:juridia, dev (+7 more)

### Community 80 - "Community 80"
Cohesion: 0.26
Nodes (12): EXECUTE, main(), MAX_PAGES, projectRoot, publicKeyInMemory(), scriptDir, buildRmbhJudgingBodyQuery(), municipalityFromJudgingBody() (+4 more)

### Community 81 - "Community 81"
Cohesion: 0.28
Nodes (11): run(), collectDjenDailyCandidates(), collectStjResourceCandidates(), communicationId(), DjenEnvelope, previousSaoPauloDate(), PublicCandidate, selectUnseenCandidates() (+3 more)

### Community 82 - "Community 82"
Cohesion: 0.19
Nodes (12): CkanEnvelope, CkanPackage, CkanResource, digest(), httpsUrl(), nonEmpty(), normalizeStjCkanResources(), planStjMetadataChanges() (+4 more)

### Community 83 - "Community 83"
Cohesion: 0.21
Nodes (14): buildSalvaguardas(), calcular(), checklistJulgador(), checkValorCausa(), checkVedacaoSurpresa(), fmtMoeda(), KPI(), ObservacoesList() (+6 more)

### Community 84 - "Community 84"
Cohesion: 0.24
Nodes (12): aliases, checkDataJudCoverage(), DATAJUD_ALIASES, DataJudAlias, extractPublicDataJudKey(), getDataJudConnectionStatus(), getDataJudKey(), lookupDataJudByProcess() (+4 more)

### Community 85 - "Community 85"
Cohesion: 0.24
Nodes (8): ALLOWED_TJMG_BODIES, hasForbiddenIndividualField(), LOWER_PILOT_RUN_KEY, main(), parseTerritorialLowerPilot(), buildRmbhDataset(), refreshRmbhDataset(), RMBH_LEGAL_MUNICIPALITIES

### Community 86 - "Community 86"
Cohesion: 0.15
Nodes (10): dynamic, maxDuration, POST(), dynamic, maxDuration, POST(), SSE_HEADERS, MinutaRunEvent (+2 more)

### Community 87 - "Community 87"
Cohesion: 0.15
Nodes (12): Archival, Assigning an id, Editing an existing observation, Frontmatter fields, Layout, Referencing observations, Scanning cheaply, Skill families and the sibling check (+4 more)

### Community 88 - "Community 88"
Cohesion: 0.15
Nodes (12): Acting on Observations, Archival on Write, How to Log, Quick Reference, Reference files — load on demand, not up front, Referencing Observations, Session Start Protocol, Surfacing Protocol (+4 more)

### Community 89 - "Community 89"
Cohesion: 0.15
Nodes (12): Atlas Forense → JuridIA: implementação incremental auditável, Bloqueio jurídico: DataJud, Constatações de arquitetura, Estado desta branch (escopo controlado), Etapa 1: dados oficiais em modo dry-run, Etapa 2: migrações aditivas e invariantes, Etapa 3: snapshot Atlas → JuridIA, Etapa 4: RAG local (+4 more)

### Community 90 - "Community 90"
Cohesion: 0.31
Nodes (11): assertTree(), buildTpuCivilConsumerDataset(), decodeAjaxHtml(), extractTpuSourceVersion(), makeTreeRequestUrl(), normalizeLabel(), parseTpuPublicTreeChildren(), readTpuPublicHtml() (+3 more)

### Community 91 - "Community 91"
Cohesion: 0.18
Nodes (11): ensureLogDir(), LOG_DIR, LogSource, plugins, TRIM_TARGET_BYTES, trimLogFile(), writeToLogFile(), @tailwindcss/vite (+3 more)

### Community 92 - "Community 92"
Cohesion: 0.15
Nodes (12): 🗑️ "Apague tudo que estiver lá", 🔒 Após publicar, ⚠️ Atenção antes de publicar, 📦 Bundle alternativo (se quiser transferir sem git), 📤 Como publicar o JuridIA no GitHub, ✅ O que já foi preparado, Opção A: Usando Personal Access Token (recomendado), Opção B: Usando HTTPS com username + password (+4 more)

### Community 93 - "Community 93"
Cohesion: 0.24
Nodes (9): NationalCensusPage, formatNumber, monthOptions, NationalCensusPage(), statusLabel(), buildNationalCensusCsv(), escapeCsv(), NationalExportMetadata (+1 more)

### Community 94 - "Community 94"
Cohesion: 0.17
Nodes (11): Achados de ambiente (corrigidos no mesmo passe), Client, Dependências (46 removidas do `package.json`), Efeito, Higienização e simplificação do sistema — pente fino (out/2026), Método, O que foi removido (71 arquivos, ~13.800 linhas), O que foi verificado e MANTIDO (não é morto) (+3 more)

### Community 95 - "Community 95"
Cohesion: 0.17
Nodes (10): bodyCodes, civilCodes, consumerCodes, diagnostic, filter, projectRoot, query, scope (+2 more)

### Community 96 - "Community 96"
Cohesion: 0.27
Nodes (8): INITIAL_LEGAL_BRANCHES, isRmbhMunicipality(), LegalBranch, RMBH_MUNICIPALITIES, RmbhMunicipality, buildMetropolitanCoverageRows(), classifyJudgingBodyLabel(), MetropolitanBodyFacet

### Community 97 - "Community 97"
Cohesion: 0.31
Nodes (6): estimateBlockLines(), PaginatedPage, paginateMarkdown(), PaginationOptions, PaginationResult, parseMarkdownBlocks()

### Community 98 - "Community 98"
Cohesion: 0.29
Nodes (10): getCompendiumQualityOverview(), calculateAverageEvidenceScore(), calculateEvidenceQuality(), calculateThesisQuality(), EvidenceCoverageItem, EvidenceQuality, EvidenceQualityInput, hasText() (+2 more)

### Community 99 - "Community 99"
Cohesion: 0.23
Nodes (9): Body, dynamic, POST(), anonymize(), AnonymizeResult, detect(), MarkerMap, PATTERNS (+1 more)

### Community 100 - "Community 100"
Cohesion: 0.18
Nodes (10): 1. Estado encontrado (antes da auditoria), 2. Controles implementados, 3. Matriz de rotas (depois da auditoria), 4. Fluxos verificados, Auditoria de rotas e fluxos — JuridIA (EJC), Autenticadas (43 arquivos — todo o acervo e IA), Públicas por design (6), Somente admin (2 arquivos) (+2 more)

### Community 102 - "Community 102"
Cohesion: 0.22
Nodes (5): templateRoot, __dirname, eslintConfig, __filename, eslint-config-next

### Community 103 - "Community 103"
Cohesion: 0.18
Nodes (10): Dry-run verificado, Importação no banco Atlas isolado, Minimização e trilha de auditoria, Objetivo e escopo, Paginação e critério de parada, Piloto territorial TJMG — Betim e Igarapé, Piloto TJMG concluído, Projeto de Baixas Nacionais — DataJud (+2 more)

### Community 104 - "Community 104"
Cohesion: 0.25
Nodes (7): main(), FORBIDDEN_KEYS, hasForbiddenStructuredKey(), REQUIRED_FACET_KEYS, validateRmbhCoverageImport(), facets, manifest

### Community 105 - "Community 105"
Cohesion: 0.25
Nodes (9): auditEvents, jurisprudenceTopics, main(), publicMetadataManifest, requireId(), theses, thesisAuthorities, topics (+1 more)

### Community 106 - "Community 106"
Cohesion: 0.25
Nodes (9): isSafeReviewNote(), REVIEW_DECISIONS, REVIEW_PRIORITIES, REVIEW_STATUSES, ReviewDecision, ReviewPriority, ReviewStatus, validateReviewDecision() (+1 more)

### Community 107 - "Community 107"
Cohesion: 0.18
Nodes (11): devDependencies, bun-types, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, tw-animate-css, @types/node (+3 more)

### Community 108 - "Community 108"
Cohesion: 0.18
Nodes (5): db, db, ADVOGADOS, db, @prisma/client

### Community 109 - "Community 109"
Cohesion: 0.22
Nodes (10): anonymizeCompat(), deanonymizeCompat(), DetectionPattern, MarkerMap, pseudonymize(), PseudonymizeResult, PseudonymMap, rehydrate() (+2 more)

### Community 110 - "Community 110"
Cohesion: 0.18
Nodes (10): exports, ./citation-types, ./ejc-integration, ./evidence-types, ./prazos-module, main, name, type (+2 more)

### Community 111 - "Community 111"
Cohesion: 0.22
Nodes (9): OfficeTreinamentoPage, carregarChecklist(), CHECKLIST, FAQ, FLUXO, MODULOS, OfficeTreinamentoPage(), QUIZ (+1 more)

### Community 112 - "Community 112"
Cohesion: 0.36
Nodes (9): aliases, buildQuery(), collectCell(), csvEscape(), main(), worker(), monthBounds(), monthsBetween() (+1 more)

### Community 113 - "Community 113"
Cohesion: 0.20
Nodes (9): artifact, bodies, codes, municipalities, outputPath, projectRoot, scriptDir, source (+1 more)

### Community 114 - "Community 114"
Cohesion: 0.20
Nodes (5): JWT_TEST_SECRET, NotificationServiceHandle, VALID_BODY, jose, socket.io-client

### Community 115 - "Community 115"
Cohesion: 0.22
Nodes (8): 1. Lacuna mapeada, 2. Verificação das APIs públicas (realizada neste ambiente), 3. Arquitetura, 4. Validação executada (04/10/2026), 5. Como validar ao vivo (com internet), Conector de Jurisprudência — verificação de APIs e arquitetura, Estados de sincronização, Garantias

### Community 116 - "Community 116"
Cohesion: 0.36
Nodes (8): editorial_schedule_task_uid_idx, `editorial_update_runs`, editorial_update_runs_status_idx, `editorial_update_schedules`, `editorial_updates`, editorial_updates_kind_idx, editorial_updates_published_idx, editorial_updates_status_idx

### Community 117 - "Community 117"
Cohesion: 0.39
Nodes (8): aliases, collectKind(), csvEscape(), keyInMemory(), labelFromBucket(), main(), PERIOD, query()

### Community 118 - "Community 118"
Cohesion: 0.22
Nodes (9): scripts, build, db:generate, db:migrate, db:push, db:reset, dev, lint (+1 more)

### Community 119 - "Community 119"
Cohesion: 0.28
Nodes (8): CaseAnalysisResult, dynamic, EMPTY, fallbackAnalysis(), GET(), maxDuration, POST(), safeParse()

### Community 120 - "Community 120"
Cohesion: 0.25
Nodes (7): Do NOT log, Signals for a NEW skill, Signals for IMPROVING an existing skill, Signals for SIMPLIFYING a skill, Signals — what to watch for, in full, The generalisability test, Where the observation mindset stays on

### Community 121 - "Community 121"
Cohesion: 0.25
Nodes (7): Assuntos e órgãos agregados, Diagnóstico para baixas, Distribuições nacionais agregadas, Execução planejada, Prontidão do Censo Nacional, Validação de interface, Verificação de aliases estaduais

### Community 122 - "Community 122"
Cohesion: 0.25
Nodes (7): Conector DJEN automático, Escopo entregue, Evidências, Motor de prazos (portado do LexValida), Módulos do Escritório — validação (Painel JEC BH e Betim), Salvaguarda de rede (importante), Validação executada em 04/10/2026

### Community 123 - "Community 123"
Cohesion: 0.25
Nodes (7): Auditoria, Componentes, Eventos reais integrados, Operação (VPS), Política do proxy fixo (sem porta dinâmica), Serviço de Notificações em Tempo Real (WebSocket) — Atlas Forense, Variáveis de ambiente

### Community 124 - "Community 124"
Cohesion: 0.25
Nodes (7): Auditoria e verificação periódica, Garantias estruturais (anti-fictício), O que foi purgado na Task 11, Origens legítimas de dados, Política de Dados Reais — Atlas Forense, Princípio, Regra de ouro

### Community 125 - "Community 125"
Cohesion: 0.25
Nodes (7): 1. Inventário definitivo, 2. Execução na VPS, 3. Ativação e verificação, 4. Rotação, Atlas Forense — `/etc/atlas-ejc/atlas.env` (`root:atlas`, 0640), JuridIA (EJC) — `/etc/juridia/juridia.env` (`root:juridia`, 0640), Segredos definitivos de produção — VPS (Atlas Forense + JuridIA)

### Community 126 - "Community 126"
Cohesion: 0.25
Nodes (8): scripts, build, check, db:push, dev, format, start, test

### Community 127 - "Community 127"
Cohesion: 0.36
Nodes (6): getCompendiumFreshnessOverview(), describeDocumentFreshness(), DOCUMENT_REVIEW_WINDOW_DAYS, DocumentFreshness, DocumentFreshnessStatus, summarizeDocumentFreshness()

### Community 128 - "Community 128"
Cohesion: 0.29
Nodes (6): 2. Sequência da regra — cumprimento, 3. Homologação executada (sandbox, 2026-10-07), 4. Ativação em produção (VPS), 5. Fronteira de dados (inalterada), 6. Nota ao responsável do bot (JuridIA Auto-Deploy), Ativação da ponte SSO Atlas ⇄ EJC (JuridIA)

### Community 129 - "Community 129"
Cohesion: 0.29
Nodes (6): Como estender, Módulo Treinamento do Escritório (Task 10), Política de dados reais (Task 11), Propósito, Seções implementadas, Treinamento do motor (regressão)

### Community 130 - "Community 130"
Cohesion: 0.29
Nodes (6): Contrato da pré-validação, Escopo e não escopo, Fluxo de entrada de um novo lote, Operação do Compêndio Jurídico, Papéis técnicos, Separação de funções

### Community 131 - "Community 131"
Cohesion: 0.29
Nodes (6): Critério de priorização, Recomendações de não adoção imediata, Referências, Roadmap de Melhorias Derivado do Benchmark, Sequência sugerida, Validação de aderência

### Community 132 - "Community 132"
Cohesion: 0.48
Nodes (6): `rmbh_civil_consumer_metrics`, rmbh_civil_consumer_metrics_category_idx, rmbh_civil_consumer_metrics_month_idx, rmbh_civil_consumer_metrics_municipality_idx, `rmbh_civil_consumer_runs`, rmbh_civil_consumer_runs_status_idx

### Community 133 - "Community 133"
Cohesion: 0.38
Nodes (6): authenticateBrainToken(), BrainAuthResult, createRateLimiter(), digest(), isBrainTokenConfigured(), BRAIN_TOKEN_MIN_LENGTH

### Community 134 - "Community 134"
Cohesion: 0.38
Nodes (5): buildComarcaCoverage(), buildCompendiumHomeStats(), ComarcaFacet, CompendiumCityCoverage, CompendiumHomeMetrics

### Community 135 - "Community 135"
Cohesion: 0.43
Nodes (5): aggregateTemporaryFinalLowers(), isFinalLower(), LowerProcessRecord, monthFromMovementDate(), PublicMovement

### Community 136 - "Community 136"
Cohesion: 0.33
Nodes (5): normalizeStjPackage(), StjCatalogEntry, StjPackage, StjResource, StjResponse

### Community 137 - "Community 137"
Cohesion: 0.29
Nodes (6): 1. Portas e serviços (fixas, não negociáveis), 3. Pipeline de IA (paridade MinutaIA) — invariáveis, 4. Ambiente e segredos, 5. Portões de validação (todos verdes = deploy aceito), 6. Coordenação com o Atlas Forense, Contrato operacional — JuridIA (app gerenciado pelo bot)

### Community 138 - "Community 138"
Cohesion: 0.38
Nodes (5): dynamic, POST(), buildProofMatrix(), ProofMatrixEntry, ProofMatrixResult

### Community 139 - "Community 139"
Cohesion: 0.57
Nodes (5): log_step_end(), log_step_start(), dev.sh script, start_mini_services(), wait_for_service()

### Community 140 - "Community 140"
Cohesion: 0.33
Nodes (3): main(), mini-services-start.sh script, start.sh script

### Community 141 - "Community 141"
Cohesion: 0.33
Nodes (5): Approval policy, Comprehensive Review (scheduled or fallback), Constraints, Delivering updated skills, Steps

### Community 142 - "Community 142"
Cohesion: 0.60
Nodes (5): gen_hex(), get_var(), is_strong(), set_env_file(), render-env.sh script

### Community 143 - "Community 143"
Cohesion: 0.33
Nodes (5): Ativação em produção: portões obrigatórios, Atlas + JuridIA, esteira oficial gratuita, primeira entrega, Dry-run seguro, Limites de segurança e governança, Relatório necessário após cada ciclo

### Community 144 - "Community 144"
Cohesion: 0.33
Nodes (5): Controles de reversão, Critérios de retomada operacional, Fontes operacionais, Sequência de retomada segura, Validação consolidada do domínio público

### Community 145 - "Community 145"
Cohesion: 0.33
Nodes (5): Contrato de extensão, Manifesto Técnico de Integração com o EJC, Pré-requisitos de ativação, Revisão de 10/10/2026: integração Cérebro Jurídico ↔ Atlas, Situação

### Community 146 - "Community 146"
Cohesion: 0.33
Nodes (5): Fluxos, Integração Cérebro Jurídico (JuridIA/EJC) ↔ Atlas Forense, Limites obrigatórios, Pendências de segurança (fora deste escopo, registradas), Segurança

### Community 147 - "Community 147"
Cohesion: 0.33
Nodes (5): Arquitetura aprovada, Publicação da VPS — Atlas Forense, Repositório GitHub, Reversão, Variáveis e limites

### Community 148 - "Community 148"
Cohesion: 0.53
Nodes (5): `national_census_metrics`, national_census_metrics_month_idx, national_census_metrics_tribunal_idx, `national_census_runs`, national_census_runs_status_idx

### Community 149 - "Community 149"
Cohesion: 0.53
Nodes (5): metropolitan_body_facet_alias_idx, metropolitan_body_facet_municipality_idx, `metropolitan_coverage_runs`, metropolitan_coverage_runs_status_idx, `metropolitan_judging_body_facets`

### Community 150 - "Community 150"
Cohesion: 0.53
Nodes (4): redactDebugEntries(), redactDebugValue(), redactString(), vitePluginManusDebugCollector()

### Community 151 - "Community 151"
Cohesion: 0.53
Nodes (4): FORBIDDEN_PUBLIC_FIELDS, isSafeThesisMapDocument(), THESIS_MAP_EXPORT_FORMATS, THESIS_MAP_RELATED_LIMIT

### Community 152 - "Community 152"
Cohesion: 0.40
Nodes (4): Migrating a pre-3.0 single-file log, Procedure, Rollback, What the script does

### Community 153 - "Community 153"
Cohesion: 0.40
Nodes (4): Política operacional aprovada, Referências, Requisitos Públicos Confirmados — DataJud, Resultado da consulta oficial

### Community 154 - "Community 154"
Cohesion: 0.40
Nodes (4): Configuração das variáveis na VPS, Preparação de SSO do EJC, Referências, Sequência de ativação

### Community 155 - "Community 155"
Cohesion: 0.40
Nodes (4): Escopo inicial, Fontes e governança do pipeline diário, Fontes verificadas, Governança

### Community 156 - "Community 156"
Cohesion: 0.40
Nodes (4): Ciclo de revisão, Dossiê de citação, Fila e filtros de curadoria, Operação — Revisão de Evidências e Dossiê de Citação

### Community 157 - "Community 157"
Cohesion: 0.40
Nodes (4): Score autônomo de teses, Score Documental e Cobertura de Evidência, Validação da apresentação, Validação da apresentação e da fórmula

### Community 158 - "Community 158"
Cohesion: 0.40
Nodes (4): Desktop, Móvel, Validações técnicas, Verificação visual — 26/08/2026

### Community 159 - "Community 159"
Cohesion: 0.40
Nodes (4): Escopo, Links, Painel JEC BH e Betim / Atlas Forense, Recurso relacionado

### Community 160 - "Community 160"
Cohesion: 0.40
Nodes (3): ADMIN_ANON, CONFIDENTIAL, PUBLIC

### Community 161 - "Community 161"
Cohesion: 0.80
Nodes (4): has_python_sources(), install_pyproject(), install_requirements(), python-runtime-build.sh script

### Community 162 - "Community 162"
Cohesion: 0.50
Nodes (3): Benchmark de Inteligência Jurídica e Jurimetria, Padrões de governança encontrados, Referências

### Community 163 - "Community 163"
Cohesion: 0.50
Nodes (3): Evidência de indisponibilidade do SRU LexML, Referências, Validação de Fontes Públicas

### Community 164 - "Community 164"
Cohesion: 0.50
Nodes (3): Responsividade, Validação após a qualificação institucional, Validação pública — cobertura RMBH

### Community 165 - "Community 165"
Cohesion: 0.83
Nodes (3): `evidence_review_items`, evidence_review_priority_idx, evidence_review_status_idx

### Community 166 - "Community 166"
Cohesion: 0.67
Nodes (3): main(), probe(), SOURCES

### Community 167 - "Community 167"
Cohesion: 0.67
Nodes (3): db, hashPassword(), main()

### Community 169 - "Community 169"
Cohesion: 0.50
Nodes (3): DB_PUSH_CALLS, PATH, database-runtime-build.sh script

## Knowledge Gaps
- **1359 isolated node(s):** `UseAuthOptions`, `CityFilter`, `YearFilter`, `ProcessRow`, `TimelineCensus` (+1354 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1546 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `God Nodes (most connected - your core abstractions)` connect `Community 2` to `Community 40`, `Community 73`, `Community 10`, `Community 3`?**
  _High betweenness centrality (0.124) - this node is a cross-community bridge._
- **Why does `Graph Report - audit-vps-graphql-20261010  (2026-10-10)` connect `Community 73` to `Community 0`, `Community 2`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `getDb()` connect `Community 10` to `Community 64`, `Community 2`, `Community 98`, `Community 35`, `Community 5`, `Community 38`, `Community 7`, `Community 8`, `Community 41`, `Community 76`, `Community 31`, `Community 127`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `requireAuth()` (e.g. with `God Nodes (most connected - your core abstractions)` and `Surprising Connections (you probably didn't know these)`) actually correct?**
  _`requireAuth()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `UseAuthOptions`, `CityFilter`, `YearFilter` to the rest of the system?**
  _1359 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.015748031496062992 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06252587991718427 - nodes in this community are weakly interconnected._