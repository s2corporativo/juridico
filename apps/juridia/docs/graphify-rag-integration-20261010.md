# Graphify Atlas/JuridIA — atualização pós-integração RAG (10/10/2026)

Gerado na VPS com `graphify . --code-only --directed` e `graphify cluster-only . --no-label`, baseado no commit `f7633a3`. Nenhuma API paga ou conteúdo de clientes foi enviado externamente. O mapa HTML e JSON continuam privados em `/opt/atlas-juridico/audit-vps-rag-20261010/graphify-out/`. As contagens não devem ser comparadas diretamente a execuções anteriores com outra modalidade de atualização do grafo.

---

# Graph Report - audit-vps-rag-20261010  (2026-10-10)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 2761 nodes · 6339 edges · 140 communities (125 shown, 15 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 38 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f7633a3c`
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

## God Nodes (most connected - your core abstractions)
1. `requireAuth()` - 136 edges
2. `logAuditEvent()` - 93 edges
3. `cn()` - 74 edges
4. `next` - 67 edges
5. `getDb()` - 65 edges
6. `AppRouter` - 54 edges
7. `Button()` - 53 edges
8. `vitest` - 50 edges
9. `Badge()` - 48 edges
10. `db` - 48 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `requireAuth()`  [EXTRACTED]
  apps/juridia/src/app/api/brain/route.ts → apps/juridia/src/lib/auth.ts
- `GET()` --calls--> `requireAuth()`  [EXTRACTED]
  apps/juridia/src/app/api/intelligence/map/route.ts → apps/juridia/src/lib/auth.ts
- `POST()` --calls--> `requireAuth()`  [EXTRACTED]
  apps/juridia/src/app/api/molde/route.ts → apps/juridia/src/lib/auth.ts
- `GET()` --calls--> `requireAuth()`  [EXTRACTED]
  apps/juridia/src/app/api/prazos/route.ts → apps/juridia/src/lib/auth.ts
- `GET()` --calls--> `requireAuth()`  [EXTRACTED]
  apps/juridia/src/app/api/skills/route.ts → apps/juridia/src/lib/auth.ts

## Import Cycles
- None detected.

## Communities (140 total, 15 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (68): dynamic, GET(), DELETE(), dynamic, GET(), PATCH(), POST(), dynamic (+60 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (57): dynamic, GET(), POST(), dynamic, POST(), dynamic, POST(), dynamic (+49 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (55): OfficeClienteDetalhePage(), validarCnjOuCru(), officeJurisprudencia, officeJurisprudenciaSettings, fetchJson(), fetchProvider(), fetchText(), JurisSettingsView (+47 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (43): CaseItem, EDGE_COLORS, GrafoSistema(), GraphData, GraphEdge, GraphNode, layout(), NODE_COLORS (+35 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (46): auditEvents, editorialUpdateRuns, editorialUpdates, editorialUpdateSchedules, evidenceReviewItems, evidenceSources, ingestionBatches, InsertUser (+38 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (47): comparePublicRelatedDecisions(), comparisonWindows, enforceComparisonRateLimit(), assertApiKey(), computeBackoffDelay(), ensureArray(), FetchInit, fetchWithBackoff() (+39 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (43): Dashboard(), addDays(), DataJudBusca(), buscar(), preencherExemplo(), Field(), formatarCnj(), mockProcesso() (+35 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (34): Assistente(), interpret(), ClassificationResult, classifyIntent(), Entity, EXAMPLE_CHIPS, IntentDef, INTENTS (+26 more)

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (25): CitationChecker(), CitationCheckerProps, STATUS_CONFIG, SummaryCard(), Editor(), contentToHtml(), downloadDocx(), esc() (+17 more)

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (40): dataTexto(), KIND_LABEL, OfficeComunicacoesPage(), calcular(), calcularPresc(), usarTeorDaComunicacao(), termoPrazoDaFonte(), adicionarDias() (+32 more)

### Community 10 - "Community 10"
Cohesion: 0.14
Nodes (42): decideEditorialUpdate(), decideEvidenceReview(), enqueueEvidenceReview(), getCitationDossier(), getCompendiumOverview(), getDb(), getDecisionRelatedDocuments(), getEditorialUpdateQueue() (+34 more)

### Community 11 - "Community 11"
Cohesion: 0.10
Nodes (27): Props, State, fmt, Home(), Faq(), FAQS, FEATURES, Hero() (+19 more)

### Community 12 - "Community 12"
Cohesion: 0.11
Nodes (38): logUsageEntry(), applyReviewCorrections(), buildDraftUserPrompt(), buildFactsBlock(), buildMarkerList(), buildOutlineUserPrompt(), buildReferencesBlock(), buildReviewUserPrompt() (+30 more)

### Community 13 - "Community 13"
Cohesion: 0.07
Nodes (21): importSkills(), parseFrontmatter(), FONTES_ATUALIZADAS, main(), probe(), SKILLS, SKILLS, sources (+13 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (31): BibliotecaJuridica(), JurisprudenceResult, LegalSource, Skill, buildSalvaguardas(), CalculadoraJuridica(), calcular(), checklistJulgador() (+23 more)

### Community 15 - "Community 15"
Cohesion: 0.11
Nodes (35): aliases, aliasOption, clearScroll(), EXECUTE, isFinalLower(), isLimitedPilot, judgingBodyCodes, main() (+27 more)

### Community 16 - "Community 16"
Cohesion: 0.10
Nodes (31): dynamic, GET(), dynamic, GET(), dynamic, GET(), dynamic, POST() (+23 more)

### Community 17 - "Community 17"
Cohesion: 0.09
Nodes (34): BrainResult, BrainStep, dynamic, EpistemicState, EvidenceItem, GET(), maxDuration, POST() (+26 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (19): AuthenticatedUser, buildCronUser(), isNonEmptyString(), OAuthService, SDKServer, SessionPayload, AuthorizeRequest, AuthorizeResponse (+11 more)

### Community 19 - "Community 19"
Cohesion: 0.08
Nodes (33): dynamic, GET(), POST(), dynamic, GET(), dynamic, GET(), POST() (+25 more)

### Community 20 - "Community 20"
Cohesion: 0.10
Nodes (27): ControlCenterPage, EditorialReviewPage, startLogin(), useAuth(), UseAuthOptions, queryClient, redirectToLoginIfUnauthorized(), trpcClient (+19 more)

### Community 21 - "Community 21"
Cohesion: 0.08
Nodes (16): id_floor_from(), main(), parse_entries(), parse_skill(), parse_status(), render(), slugify(), split_top_level() (+8 more)

### Community 22 - "Community 22"
Cohesion: 0.08
Nodes (30): Home, CivilConsumerPanel(), fmt, monthLabel(), PercentBar(), CauseStat, ChartTitle(), CITY_COLOR (+22 more)

### Community 23 - "Community 23"
Cohesion: 0.10
Nodes (30): authenticateBrainToken(), BrainAuthResult, createRateLimiter(), digest(), isBrainTokenConfigured(), STRONG_TOKEN, Amount, BRAIN_API_PREFIX (+22 more)

### Community 24 - "Community 24"
Cohesion: 0.06
Nodes (30): Citation, extractCitations(), STATUS_LABELS, verifyCitations(), VerifyResult, allMarkers, allowedIds, already (+22 more)

### Community 25 - "Community 25"
Cohesion: 0.13
Nodes (28): EXECUTE, main(), projectRoot, publicKeyInMemory(), scriptDir, ALLOWED_FIELD_MARKERS, collectSafeErrorTypes(), descendantFilterPath (+20 more)

### Community 26 - "Community 26"
Cohesion: 0.11
Nodes (28): dynamic, maxDuration, POST(), getZai(), llmCall(), parseJSON(), PipelinePhase, PipelineResult (+20 more)

### Community 27 - "Community 27"
Cohesion: 0.13
Nodes (26): getSessionCookieOptions(), isSecureRequest(), LOCAL_HOSTS, b64u(), callbackUri(), discoveryCache, DiscoveryDoc, ejcSsoCallback() (+18 more)

### Community 28 - "Community 28"
Cohesion: 0.08
Nodes (25): dynamic, maxDuration, MoldeChange, POST(), dynamic, generateFallback(), maxDuration, POST() (+17 more)

### Community 29 - "Community 29"
Cohesion: 0.07
Nodes (30): dependencies, axios, clsx, cookie, dotenv, drizzle-orm, express, html-to-image (+22 more)

### Community 30 - "Community 30"
Cohesion: 0.09
Nodes (26): getUserByOpenId(), emitNotification(), NotificationEmitInput, CLIENT_EVENT_ALLOWLIST, ClientEventName, clientEventSchemas, DEFAULT_LIMITS, DEFAULT_NOTIFICATION_PORT (+18 more)

### Community 31 - "Community 31"
Cohesion: 0.11
Nodes (24): dynamic, GET(), PATCH(), POST(), dynamic, escapeHtml(), POST(), formatOAB() (+16 more)

### Community 32 - "Community 32"
Cohesion: 0.11
Nodes (24): attempts, dynamic, POST(), rateLimited(), dynamic, AuthedUser, base64UrlDecode(), base64UrlEncode() (+16 more)

### Community 33 - "Community 33"
Cohesion: 0.10
Nodes (22): User, AuthenticatedUser, CookieCall, TrpcContext, ENV, buildEndpointUrl(), isNonEmptyString(), NotificationPayload (+14 more)

### Community 34 - "Community 34"
Cohesion: 0.10
Nodes (22): batches, bodyByCode, civilCodes, consumerCodes, EXECUTE, manifest, manifestBase, projectRoot (+14 more)

### Community 35 - "Community 35"
Cohesion: 0.11
Nodes (17): ALLOWED_TJMG_BODIES, hasForbiddenIndividualField(), LOWER_PILOT_RUN_KEY, main(), parseTerritorialLowerPilot(), buildCivilConsumerDescendantFilter(), prepareCivilConsumerDescendantFilter(), ROOT_CODES (+9 more)

### Community 36 - "Community 36"
Cohesion: 0.17
Nodes (22): BatchPanel(), callGenerate(), generateMold(), generateRest(), Generator(), generate(), readSse(), ICONS (+14 more)

### Community 37 - "Community 37"
Cohesion: 0.10
Nodes (17): App(), MetropolitanCoveragePage, OfficeClienteDetalhePage, OfficeClientesPage, OfficeComunicacoesPage, OfficeJurisprudenciaPage, PageLoader(), ErrorBoundary (+9 more)

### Community 38 - "Community 38"
Cohesion: 0.15
Nodes (18): enforceRateLimit(), requestWindows, summarizePublicDecision(), IngestionCandidate, IngestionPreview, isHttpsUrl(), previewControlledIngestion(), isSafePublicCitationAuditEvent() (+10 more)

### Community 39 - "Community 39"
Cohesion: 0.09
Nodes (19): dynamic, maxDuration, POST(), dynamic, maxDuration, POST(), SSE_HEADERS, dynamic (+11 more)

### Community 40 - "Community 40"
Cohesion: 0.17
Nodes (19): run(), claimDailyEditorialRun(), enqueueEditorialCandidates(), existingEditorialKeys(), finishEditorialRun(), candidate(), collectOfficialEditorialCandidates(), EditorialCandidate (+11 more)

### Community 41 - "Community 41"
Cohesion: 0.08
Nodes (25): dependencies, class-variance-authority, clsx, cmdk, framer-motion, lucide-react, next, next-themes (+17 more)

### Community 42 - "Community 42"
Cohesion: 0.21
Nodes (16): maintainKnowledge(), HybridKnowledgeResult, hybridKnowledgeSearch(), indexedVector(), addInitialIndex(), assertKnowledgeTables(), ensureKnowledgeFts(), LocalHit (+8 more)

### Community 43 - "Community 43"
Cohesion: 0.08
Nodes (22): clsx, react, license, name, packageManager, type, version, lucide-react (+14 more)

### Community 44 - "Community 44"
Cohesion: 0.18
Nodes (19): CommandItemDef, CommandPalette(), Command(), CommandDialog(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem() (+11 more)

### Community 45 - "Community 45"
Cohesion: 0.14
Nodes (16): CitationDossierPage, SITE_NAV_GROUPS, SiteNav(), SiteNavGroup, SiteNavItem, CitationDossierPage(), copyReference(), downloadDossier() (+8 more)

### Community 46 - "Community 46"
Cohesion: 0.09
Nodes (22): clsx, next-themes, react, tailwind-merge, tw-animate-css, @types/node, typescript, name (+14 more)

### Community 47 - "Community 47"
Cohesion: 0.15
Nodes (20): createEvidence(), CreateEvidenceInput, EvidenceGateError, EvidenceRefRecord, listEvidence(), normalizeQuote(), quoteHash(), toRecord() (+12 more)

### Community 48 - "Community 48"
Cohesion: 0.14
Nodes (21): `audit_events`, audit_events_entity_idx, `evidence_sources`, evidence_sources_status_idx, `ingestion_batches`, ingestion_batches_status_idx, jurisprudence_city_idx, `jurisprudence_records` (+13 more)

### Community 49 - "Community 49"
Cohesion: 0.18
Nodes (18): dynamic, POST(), DELETE(), dynamic, GET(), PATCH(), POST(), dynamic (+10 more)

### Community 50 - "Community 50"
Cohesion: 0.16
Nodes (17): geistMono, geistSans, metadata, RootLayout(), ThemeProvider(), Toast, ToastAction, ToastActionElement (+9 more)

### Community 51 - "Community 51"
Cohesion: 0.12
Nodes (20): AI_ENABLED, AI_EXTERNAL_PROVIDERS_ALLOWED, ensureDraftMarker(), getEligibleProviders(), getSanitizationMode(), hasAvailableProvider(), isProviderEligible(), providerAllowedForMode() (+12 more)

### Community 52 - "Community 52"
Cohesion: 0.15
Nodes (20): buildCaseGraph(), buildSystemGraph(), CaseGraphNode, edgeId(), EdgeType, GraphEdge, GraphNode, GraphResult (+12 more)

### Community 53 - "Community 53"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+12 more)

### Community 54 - "Community 54"
Cohesion: 0.19
Nodes (10): createContext(), findAvailablePort(), isPortAvailable(), startServer(), getServerListenOptions(), registerStorageProxy(), serveStatic(), setupVite() (+2 more)

### Community 55 - "Community 55"
Cohesion: 0.10
Nodes (14): CITATION_PATTERNS, CitationGateResult, CitationRef, VerifiedCitation, ejcAuthBridge, ejcIntegrationManifest, EpistemicState, EvidenceItem (+6 more)

### Community 56 - "Community 56"
Cohesion: 0.15
Nodes (12): notificationSchema, useRealtimeNotifications(), disconnectRealtime(), getRealtimeSocket(), readMirroredSessionToken(), REALTIME_NOTIFICATION_EVENT, RealtimeNotification, JWT_TEST_SECRET (+4 more)

### Community 57 - "Community 57"
Cohesion: 0.15
Nodes (15): redactDebugEntries(), redactDebugValue(), redactString(), ensureLogDir(), LOG_DIR, LogSource, plugins, TRIM_TARGET_BYTES (+7 more)

### Community 58 - "Community 58"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, baseUrl, esModuleInterop, incremental, jsx, lib, module (+10 more)

### Community 59 - "Community 59"
Cohesion: 0.15
Nodes (15): Body, dynamic, POST(), ALLOWED_ROLES, BLOCKED_PII, dynamic, POST(), anonymize() (+7 more)

### Community 60 - "Community 60"
Cohesion: 0.21
Nodes (16): officeCommunications, officeDjenSettings, main(), auditDjen(), DjenSettingsView, fetchComunica(), getDjenSettings(), marcarSync() (+8 more)

### Community 61 - "Community 61"
Cohesion: 0.11
Nodes (18): devDependencies, drizzle-kit, esbuild, prettier, tailwindcss, @tailwindcss/vite, tsx, tw-animate-css (+10 more)

### Community 62 - "Community 62"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 63 - "Community 63"
Cohesion: 0.24
Nodes (15): compactText(), describeElement(), elText(), formatArg(), formatArgs(), getInputValueSafe(), installUiEventListeners(), nav() (+7 more)

### Community 64 - "Community 64"
Cohesion: 0.16
Nodes (12): CompendiumPage, ThesisEvidenceMap(), CompendiumPage(), formatDate(), RelatedJudgments(), sourceLabel, SourceStatus, sourceStatuses (+4 more)

### Community 65 - "Community 65"
Cohesion: 0.18
Nodes (16): `office_attendances`, office_attendances_client_idx, `office_clients`, office_clients_name_idx, `office_communications`, office_communications_cnj_idx, office_communications_received_idx, office_communications_status_idx (+8 more)

### Community 66 - "Community 66"
Cohesion: 0.12
Nodes (15): aliases, components, hooks, lib, ui, utils, rsc, $schema (+7 more)

### Community 67 - "Community 67"
Cohesion: 0.17
Nodes (10): main(), parseCsv(), parseLine(), main(), parseCsv(), p0, main(), parseCsv() (+2 more)

### Community 68 - "Community 68"
Cohesion: 0.31
Nodes (15): guard(), handleCompendiumSearch(), handleJurimetry(), handleKnowledgeHealth(), handleKnowledgeItem(), handleKnowledgeSnapshot(), handleThesisSubmission(), limiter (+7 more)

### Community 69 - "Community 69"
Cohesion: 0.19
Nodes (13): CkanEnvelope, CkanPackage, CkanResource, digest(), discoverStjCkanResources(), httpsUrl(), nonEmpty(), normalizeStjCkanResources() (+5 more)

### Community 70 - "Community 70"
Cohesion: 0.12
Nodes (15): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+7 more)

### Community 71 - "Community 71"
Cohesion: 0.14
Nodes (9): nextConfig, dynamic, dynamic, dynamic, POST(), buildProofMatrix(), ProofMatrixEntry, ProofMatrixResult (+1 more)

### Community 72 - "Community 72"
Cohesion: 0.12
Nodes (15): devDependencies, concurrently, name, private, scripts, build:atlas, build:juridia, dev (+7 more)

### Community 73 - "Community 73"
Cohesion: 0.26
Nodes (12): EXECUTE, main(), MAX_PAGES, projectRoot, publicKeyInMemory(), scriptDir, buildRmbhJudgingBodyQuery(), municipalityFromJudgingBody() (+4 more)

### Community 74 - "Community 74"
Cohesion: 0.16
Nodes (8): auth, TOKEN, styles, FORBIDDEN_PUBLIC_FIELDS, isSafeThesisMapDocument(), THESIS_MAP_EXPORT_FORMATS, THESIS_MAP_RELATED_LIMIT, vitest

### Community 75 - "Community 75"
Cohesion: 0.14
Nodes (8): db, db, db, hashPassword(), main(), ADVOGADOS, db, @prisma/client

### Community 76 - "Community 76"
Cohesion: 0.20
Nodes (12): dynamic, GET(), maxDuration, POST(), dynamic, POST(), canonicalHash(), identifyIssues() (+4 more)

### Community 77 - "Community 77"
Cohesion: 0.18
Nodes (12): AdvancedEvidencePanel(), CityFilter, data, displayDate(), filingIso(), fmt, months, ProcessRow (+4 more)

### Community 78 - "Community 78"
Cohesion: 0.24
Nodes (12): aliases, checkDataJudCoverage(), DATAJUD_ALIASES, DataJudAlias, extractPublicDataJudKey(), getDataJudConnectionStatus(), getDataJudKey(), lookupDataJudByProcess() (+4 more)

### Community 79 - "Community 79"
Cohesion: 0.20
Nodes (13): Action, ActionType, actionTypes, addToRemoveQueue(), dispatch(), genId(), listeners, memoryState (+5 more)

### Community 80 - "Community 80"
Cohesion: 0.19
Nodes (8): EditorialUpdatesPanel(), formatDate(), kindLabel, Props, statusLabels, Thesis, Topic, trpc

### Community 81 - "Community 81"
Cohesion: 0.31
Nodes (11): assertTree(), buildTpuCivilConsumerDataset(), decodeAjaxHtml(), extractTpuSourceVersion(), makeTreeRequestUrl(), normalizeLabel(), parseTpuPublicTreeChildren(), readTpuPublicHtml() (+3 more)

### Community 82 - "Community 82"
Cohesion: 0.24
Nodes (9): NationalCensusPage, formatNumber, monthOptions, NationalCensusPage(), statusLabel(), buildNationalCensusCsv(), escapeCsv(), NationalExportMetadata (+1 more)

### Community 83 - "Community 83"
Cohesion: 0.17
Nodes (10): bodyCodes, civilCodes, consumerCodes, diagnostic, filter, projectRoot, query, scope (+2 more)

### Community 84 - "Community 84"
Cohesion: 0.27
Nodes (8): INITIAL_LEGAL_BRANCHES, isRmbhMunicipality(), LegalBranch, RMBH_MUNICIPALITIES, RmbhMunicipality, buildMetropolitanCoverageRows(), classifyJudgingBodyLabel(), MetropolitanBodyFacet

### Community 85 - "Community 85"
Cohesion: 0.29
Nodes (10): getCompendiumQualityOverview(), calculateAverageEvidenceScore(), calculateEvidenceQuality(), calculateThesisQuality(), EvidenceCoverageItem, EvidenceQuality, EvidenceQualityInput, hasText() (+2 more)

### Community 86 - "Community 86"
Cohesion: 0.24
Nodes (9): fetchAtlasKnowledgeSnapshot(), FetchLike, initializeCache(), listApprovedDiscovery(), SnapshotSyncResult, syncApprovedDiscovery(), verifyItem(), cfg (+1 more)

### Community 87 - "Community 87"
Cohesion: 0.33
Nodes (7): GovernancePage, icons, laneIcons, COMPENDIUM_MODULES, EVIDENCE_FLOW, GOVERNANCE_GUARDRAILS, GOVERNANCE_LANES

### Community 88 - "Community 88"
Cohesion: 0.24
Nodes (5): Tooltip(), TooltipContent(), TooltipProvider(), cn(), @radix-ui/react-tooltip

### Community 89 - "Community 89"
Cohesion: 0.25
Nodes (7): main(), FORBIDDEN_KEYS, hasForbiddenStructuredKey(), REQUIRED_FACET_KEYS, validateRmbhCoverageImport(), facets, manifest

### Community 90 - "Community 90"
Cohesion: 0.25
Nodes (9): auditEvents, jurisprudenceTopics, main(), publicMetadataManifest, requireId(), theses, thesisAuthorities, topics (+1 more)

### Community 91 - "Community 91"
Cohesion: 0.25
Nodes (9): isSafeReviewNote(), REVIEW_DECISIONS, REVIEW_PRIORITIES, REVIEW_STATUSES, ReviewDecision, ReviewPriority, ReviewStatus, validateReviewDecision() (+1 more)

### Community 92 - "Community 92"
Cohesion: 0.18
Nodes (11): devDependencies, bun-types, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, tw-animate-css, @types/node (+3 more)

### Community 93 - "Community 93"
Cohesion: 0.22
Nodes (10): anonymizeCompat(), deanonymizeCompat(), DetectionPattern, MarkerMap, pseudonymize(), PseudonymizeResult, PseudonymMap, rehydrate() (+2 more)

### Community 94 - "Community 94"
Cohesion: 0.18
Nodes (10): exports, ./citation-types, ./ejc-integration, ./evidence-types, ./prazos-module, main, name, type (+2 more)

### Community 95 - "Community 95"
Cohesion: 0.22
Nodes (9): OfficeTreinamentoPage, carregarChecklist(), CHECKLIST, FAQ, FLUXO, MODULOS, OfficeTreinamentoPage(), QUIZ (+1 more)

### Community 96 - "Community 96"
Cohesion: 0.29
Nodes (7): PublicSourcesPage, formatDate(), PublicSourcesPage(), statusLabel, ejcAuthBridge, ejcIntegrationManifest, getEjcIntegrationStatus()

### Community 97 - "Community 97"
Cohesion: 0.36
Nodes (9): aliases, buildQuery(), collectCell(), csvEscape(), main(), worker(), monthBounds(), monthsBetween() (+1 more)

### Community 98 - "Community 98"
Cohesion: 0.20
Nodes (9): artifact, bodies, codes, municipalities, outputPath, projectRoot, scriptDir, source (+1 more)

### Community 99 - "Community 99"
Cohesion: 0.31
Nodes (6): estimateBlockLines(), PaginatedPage, paginateMarkdown(), PaginationOptions, PaginationResult, parseMarkdownBlocks()

### Community 100 - "Community 100"
Cohesion: 0.36
Nodes (8): cosineSimilarity(), ensureIdfCache(), RagResult, ragSearch(), ragSearchTfidf(), termFreq(), tfidfVector(), tokenize()

### Community 101 - "Community 101"
Cohesion: 0.20
Nodes (9): APP_TAB_ALIASES, APP_TABS, AppState, AppTab, DEFAULT_PROFILE, LawyerProfile, resolveAppTab(), View (+1 more)

### Community 102 - "Community 102"
Cohesion: 0.36
Nodes (8): editorial_schedule_task_uid_idx, `editorial_update_runs`, editorial_update_runs_status_idx, `editorial_update_schedules`, `editorial_updates`, editorial_updates_kind_idx, editorial_updates_published_idx, editorial_updates_status_idx

### Community 103 - "Community 103"
Cohesion: 0.39
Nodes (8): aliases, collectKind(), csvEscape(), keyInMemory(), labelFromBucket(), main(), PERIOD, query()

### Community 104 - "Community 104"
Cohesion: 0.22
Nodes (5): templateRoot, __dirname, eslintConfig, __filename, eslint-config-next

### Community 105 - "Community 105"
Cohesion: 0.28
Nodes (8): CaseAnalysisResult, dynamic, EMPTY, fallbackAnalysis(), GET(), maxDuration, POST(), safeParse()

### Community 106 - "Community 106"
Cohesion: 0.25
Nodes (8): scripts, build, check, db:push, dev, format, start, test

### Community 107 - "Community 107"
Cohesion: 0.36
Nodes (6): getCompendiumFreshnessOverview(), describeDocumentFreshness(), DOCUMENT_REVIEW_WINDOW_DAYS, DocumentFreshness, DocumentFreshnessStatus, summarizeDocumentFreshness()

### Community 108 - "Community 108"
Cohesion: 0.25
Nodes (8): scripts, build, db:generate, db:migrate, db:push, dev, lint, start

### Community 109 - "Community 109"
Cohesion: 0.48
Nodes (6): `rmbh_civil_consumer_metrics`, rmbh_civil_consumer_metrics_category_idx, rmbh_civil_consumer_metrics_month_idx, rmbh_civil_consumer_metrics_municipality_idx, `rmbh_civil_consumer_runs`, rmbh_civil_consumer_runs_status_idx

### Community 110 - "Community 110"
Cohesion: 0.43
Nodes (5): aggregateTemporaryFinalLowers(), isFinalLower(), LowerProcessRecord, monthFromMovementDate(), PublicMovement

### Community 111 - "Community 111"
Cohesion: 0.33
Nodes (5): normalizeStjPackage(), StjCatalogEntry, StjPackage, StjResource, StjResponse

### Community 112 - "Community 112"
Cohesion: 0.48
Nodes (5): BadRequestError(), ForbiddenError(), HttpError, NotFoundError(), UnauthorizedError()

### Community 113 - "Community 113"
Cohesion: 0.57
Nodes (5): log_step_end(), log_step_start(), dev.sh script, start_mini_services(), wait_for_service()

### Community 114 - "Community 114"
Cohesion: 0.33
Nodes (3): main(), mini-services-start.sh script, start.sh script

### Community 115 - "Community 115"
Cohesion: 0.60
Nodes (5): gen_hex(), get_var(), is_strong(), set_env_file(), render-env.sh script

### Community 116 - "Community 116"
Cohesion: 0.53
Nodes (5): `national_census_metrics`, national_census_metrics_month_idx, national_census_metrics_tribunal_idx, `national_census_runs`, national_census_runs_status_idx

### Community 117 - "Community 117"
Cohesion: 0.53
Nodes (5): metropolitan_body_facet_alias_idx, metropolitan_body_facet_municipality_idx, `metropolitan_coverage_runs`, metropolitan_coverage_runs_status_idx, `metropolitan_judging_body_facets`

### Community 118 - "Community 118"
Cohesion: 0.60
Nodes (4): getEditorialScheduleByTaskUid(), sanitizeEditorialError(), authenticateEditorialScheduleSecret(), registerEditorialScheduledRoute()

### Community 119 - "Community 119"
Cohesion: 0.47
Nodes (6): Cerebro(), analyze(), handleUpload(), loadHistory(), onDrop(), EpistemicBadge()

### Community 120 - "Community 120"
Cohesion: 0.40
Nodes (3): ADMIN_ANON, CONFIDENTIAL, PUBLIC

### Community 121 - "Community 121"
Cohesion: 0.80
Nodes (4): has_python_sources(), install_pyproject(), install_requirements(), python-runtime-build.sh script

### Community 122 - "Community 122"
Cohesion: 0.83
Nodes (3): `evidence_review_items`, evidence_review_priority_idx, evidence_review_status_idx

### Community 123 - "Community 123"
Cohesion: 0.67
Nodes (3): main(), probe(), SOURCES

### Community 125 - "Community 125"
Cohesion: 0.50
Nodes (3): DB_PUSH_CALLS, PATH, database-runtime-build.sh script

## Knowledge Gaps
- **950 isolated node(s):** `DatajudResultado`, `Honorario`, `ChecklistItem`, `ChecklistResultItem`, `JulgadorResult` (+945 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 1087 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Community 71` to `Community 0`, `Community 1`, `Community 13`, `Community 16`, `Community 17`, `Community 19`, `Community 26`, `Community 28`, `Community 31`, `Community 32`, `Community 39`, `Community 44`, `Community 46`, `Community 49`, `Community 50`, `Community 59`, `Community 76`, `Community 105`, `Community 124`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Why does `vitest` connect `Community 74` to `Community 2`, `Community 4`, `Community 5`, `Community 9`, `Community 15`, `Community 22`, `Community 23`, `Community 25`, `Community 27`, `Community 33`, `Community 34`, `Community 35`, `Community 38`, `Community 40`, `Community 43`, `Community 45`, `Community 54`, `Community 56`, `Community 57`, `Community 64`, `Community 69`, `Community 73`, `Community 78`, `Community 81`, `Community 82`, `Community 84`, `Community 85`, `Community 87`, `Community 89`, `Community 90`, `Community 91`, `Community 96`, `Community 104`, `Community 107`, `Community 110`, `Community 111`, `Community 118`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Why does `logAuditEvent()` connect `Community 0` to `Community 32`, `Community 1`, `Community 71`, `Community 76`, `Community 12`, `Community 16`, `Community 17`, `Community 49`, `Community 19`, `Community 26`, `Community 59`, `Community 28`, `Community 31`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `DatajudResultado`, `Honorario`, `ChecklistItem` to the rest of the system?**
  _950 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.048650093557872226 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05222734254992319 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07139079851930195 - nodes in this community are weakly interconnected._