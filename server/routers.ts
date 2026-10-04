import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { decideEvidenceReview, enqueueEvidenceReview, getCitationDossier, getThesisRelatedDocuments, getDecisionRelatedDocuments, getCompendiumFreshnessOverview, getCompendiumOverview, getCompendiumQualityOverview, getEditorialUpdateQueue, getPublicEditorialUpdates, decideEditorialUpdate, getEvidenceReviewQueue, getMetropolitanCoverageOverview, getNationalCensusOverview, getNationalCensusReadiness, getPublicDataSources, getRmbhCivilConsumerOverview, searchCompendium } from "./db";
import { summarizePublicDecision } from "./compendium-ai-summary";
import { comparePublicRelatedDecisions } from "./compendium-ai-compare";
import { previewControlledIngestion } from "./compendium.ingestion";
import { checkDataJudCoverage, DATAJUD_ALIASES, getDataJudConnectionStatus, lookupDataJudByProcess, NATIONAL_DATAJUD_ALIASES } from "./datajud";
import { fetchStjJurisprudenceCatalog } from "./public-sources";
import { getEjcIntegrationStatus } from "@shared/ejc-integration";
import { getEjcSsoReadiness } from "./ejc-sso-config";
import { REVIEW_DECISIONS, REVIEW_PRIORITIES, REVIEW_STATUSES } from "./evidence-review";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createAttendance,
  createClient,
  createMatter,
  getClient,
  listAttendances,
  listClients,
  listCommunications,
  listMatters,
  registerManualCommunication,
  updateClient,
  updateCommunicationStatus,
} from "./office";
import { getDjenSettings, syncDjenNow, updateDjenSettings } from "./djen";
import {
  getJurisSettings,
  listJurisprudencia,
  linkJurisToMatter,
  registerManualJurisprudencia,
  syncJurisprudencia,
  updateJurisSettings,
  updateJurisStatus,
} from "./jurisprudencia";

const sourceStatusSchema = z.enum(["official_confirmed", "official_without_number", "attachment_reviewed", "secondary_pending", "movement_observed", "search_thematic"]);

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  sources: router({
    list: publicProcedure.query(() => getPublicDataSources()),
    stjCatalog: publicProcedure.input(z.object({ query: z.string().trim().max(120).optional() })).query(({ input }) => fetchStjJurisprudenceCatalog(input.query)),
  }),
  editorial: router({
    approved: publicProcedure.query(() => getPublicEditorialUpdates()),
    queue: adminProcedure.input(z.object({ status: z.enum(["pending_review", "approved", "rejected", "superseded"]).optional(), kind: z.enum(["jurisprudence", "legislation", "official_update"]).optional() }).optional()).query(({ input }) => getEditorialUpdateQueue(input)),
    decide: adminProcedure.input(z.object({ id: z.number().int().positive(), decision: z.enum(["approved", "rejected", "superseded"]), reviewNote: z.string().trim().min(3).max(1_000) })).mutation(({ ctx, input }) => decideEditorialUpdate(input.id, input.decision, input.reviewNote, ctx.user.id)),
  }),
  datajud: router({
    status: publicProcedure.query(() => getDataJudConnectionStatus()),
    lookup: adminProcedure.input(z.object({ tribunalAlias: z.enum(DATAJUD_ALIASES), processNumber: z.string().trim().min(1).max(80) })).mutation(({ input }) => lookupDataJudByProcess(input.tribunalAlias, input.processNumber)),
    coverage: adminProcedure.input(z.object({ aliases: z.array(z.enum(NATIONAL_DATAJUD_ALIASES)).min(1).max(NATIONAL_DATAJUD_ALIASES.length).optional() })).mutation(({ input }) => checkDataJudCoverage(input.aliases)),
  }),
  integration: router({
    ejcStatus: publicProcedure.query(() => ({ ...getEjcIntegrationStatus(), sso: getEjcSsoReadiness() })),
  }),
  office: router({
    clients: router({
      list: publicProcedure.query(() => listClients()),
      get: publicProcedure.input(z.object({ id: z.number().int().positive() })).query(({ input }) => getClient(input.id)),
      create: publicProcedure.input(z.object({
        name: z.string().trim().min(2).max(191),
        document: z.string().trim().max(32).optional(),
        email: z.string().trim().email().max(191).optional(),
        phone: z.string().trim().max(32).optional(),
        note: z.string().trim().max(2000).optional(),
      })).mutation(({ input }) => createClient(input)),
      update: publicProcedure.input(z.object({
        id: z.number().int().positive(),
        name: z.string().trim().min(2).max(191).optional(),
        document: z.string().trim().max(32).nullable().optional(),
        email: z.string().trim().email().max(191).nullable().optional(),
        phone: z.string().trim().max(32).nullable().optional(),
        note: z.string().trim().max(2000).nullable().optional(),
      })).mutation(({ input }) => updateClient(input.id, input)),
    }),
    matters: router({
      list: publicProcedure.input(z.object({ clientId: z.number().int().positive().optional() }).optional()).query(({ input }) => listMatters(input?.clientId)),
      create: publicProcedure.input(z.object({
        clientId: z.number().int().positive(),
        title: z.string().trim().min(2).max(255),
        cnjNumber: z.string().trim().max(32).optional(),
        area: z.string().trim().max(128).optional(),
        note: z.string().trim().max(2000).optional(),
      })).mutation(({ input }) => createMatter(input)),
    }),
    attendances: router({
      list: publicProcedure.input(z.object({ clientId: z.number().int().positive().optional() }).optional()).query(({ input }) => listAttendances(input?.clientId)),
      create: publicProcedure.input(z.object({
        clientId: z.number().int().positive(),
        matterId: z.number().int().positive().nullable().optional(),
        channel: z.string().trim().max(64).optional(),
        summary: z.string().trim().min(3).max(4000),
      })).mutation(({ input }) => createAttendance(input)),
    }),
    comms: router({
      list: publicProcedure.input(z.object({ status: z.enum(["nova", "lida", "arquivada"]).optional() }).optional()).query(({ input }) => listCommunications(input?.status)),
      updateStatus: publicProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["nova", "lida", "arquivada"]) })).mutation(({ input }) => updateCommunicationStatus(input.id, input.status)),
      registerManual: publicProcedure.input(z.object({
        cnjNumber: z.string().trim().max(32).optional(),
        kind: z.string().trim().max(32).optional(),
        title: z.string().trim().min(2).max(255),
        content: z.string().trim().max(20000).optional(),
        deadlineDays: z.number().int().min(1).max(365).optional(),
      })).mutation(({ input }) => registerManualCommunication(input)),
    }),
    djen: router({
      settings: publicProcedure.query(() => getDjenSettings()),
      updateSettings: publicProcedure.input(z.object({
        enabled: z.boolean().optional(),
        lawyerName: z.string().trim().max(120).nullable().optional(),
        oabNumber: z.string().trim().max(16).nullable().optional(),
        oabUf: z.string().trim().max(2).nullable().optional(),
        tribunal: z.string().trim().max(64).optional(),
        autoSyncEnabled: z.boolean().optional(),
        intervalMinutes: z.number().int().min(30).max(1440).optional(),
        windowDays: z.number().int().min(1).max(90).optional(),
        defaultDeadlineDays: z.number().int().min(1).max(365).optional(),
      })).mutation(({ input }) => updateDjenSettings(input)),
      sync: publicProcedure.mutation(() => syncDjenNow()),
    }),
    jurisprudencia: router({
      settings: publicProcedure.query(() => getJurisSettings()),
      updateSettings: publicProcedure.input(z.object({
        enabled: z.boolean().optional(),
        query: z.string().trim().max(160).optional(),
        lexmlEndpoint: z.string().trim().max(512).optional(),
        maxItems: z.number().int().min(1).max(20).optional(),
        autoSyncEnabled: z.boolean().optional(),
        intervalMinutes: z.number().int().min(30).max(1440).optional(),
      })).mutation(({ input }) => updateJurisSettings(input)),
      sync: publicProcedure.mutation(() => syncJurisprudencia()),
      list: publicProcedure.input(z.object({ status: z.enum(["nova", "destacada", "aplicada", "descartada"]).optional(), tribunal: z.string().trim().max(64).optional() }).optional()).query(({ input }) => listJurisprudencia(input)),
      updateStatus: publicProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["nova", "destacada", "aplicada", "descartada"]) })).mutation(({ input }) => updateJurisStatus(input.id, input.status)),
      link: publicProcedure.input(z.object({ id: z.number().int().positive(), matterId: z.number().int().positive().nullable() })).mutation(({ input }) => linkJurisToMatter(input.id, input.matterId)),
      manual: publicProcedure.input(z.object({
        externalId: z.string().trim().min(3).max(191),
        tribunal: z.string().trim().min(1).max(64),
        orgao: z.string().trim().max(128).optional(),
        cnjNumber: z.string().trim().max(32).optional(),
        ementa: z.string().trim().min(3).max(20000),
        url: z.string().trim().max(1024).optional(),
        dataJulgamento: z.string().trim().max(10).optional(),
      })).mutation(({ input }) => registerManualJurisprudencia(input)),
    }),
  }),
  nationalCensus: router({
    readiness: publicProcedure.query(() => getNationalCensusReadiness()),
    overview: publicProcedure.input(z.object({ from: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/).optional(), to: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/).optional(), tribunalAlias: z.string().trim().max(64).optional() }).optional()).query(({ input }) => getNationalCensusOverview(input)),
  }),
  metropolitan: router({
    coverage: publicProcedure.query(() => getMetropolitanCoverageOverview()),
  }),
  civilConsumer: router({
    overview: publicProcedure.input(z.object({
      from: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/).optional(),
      to: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/).optional(),
      municipalityIbgeCode: z.string().regex(/^\d{7}$/).optional(),
    }).optional()).query(({ input }) => getRmbhCivilConsumerOverview(input)),
  }),
  compendium: router({
    overview: publicProcedure.query(() => getCompendiumOverview()),
    quality: publicProcedure.query(() => getCompendiumQualityOverview()),
    freshness: publicProcedure.query(() => getCompendiumFreshnessOverview()),
    search: publicProcedure.input(z.object({
      query: z.string().trim().max(160).optional(),
      tribunal: z.string().trim().max(64).optional(),
      city: z.string().trim().max(128).optional(),
      legalArea: z.string().trim().max(255).optional(),
      sourceStatus: sourceStatusSchema.optional(),
      page: z.number().int().min(0).max(10_000).optional(),
      pageSize: z.number().int().min(1).max(50).optional(),
    })).query(({ input }) => searchCompendium(input)),
    dossier: publicProcedure.input(z.object({ externalId: z.string().trim().min(1).max(191) })).query(({ input }) => getCitationDossier(input.externalId)),
    aiSummary: publicProcedure.input(z.object({ externalId: z.string().trim().min(1).max(191) })).mutation(({ ctx, input }) => summarizePublicDecision(input.externalId, ctx.req.ip || "anonymous")),
    aiCompareRelated: publicProcedure.input(z.object({ externalIds: z.array(z.string().trim().min(1).max(191)).min(2).max(4) })).mutation(({ ctx, input }) => comparePublicRelatedDecisions(input.externalIds, ctx.req.ip || "anonymous")),
    thesisRelated: publicProcedure.input(z.object({ thesisId: z.number().int().positive() })).query(({ input }) => getThesisRelatedDocuments(input.thesisId)),
    decisionRelated: publicProcedure.input(z.object({ externalId: z.string().trim().min(1).max(191) })).query(({ input }) => getDecisionRelatedDocuments(input.externalId)),
    reviewQueue: router({
      list: adminProcedure.input(z.object({ status: z.enum(REVIEW_STATUSES).optional(), priority: z.enum(REVIEW_PRIORITIES).optional(), tribunal: z.string().trim().min(1).max(191).optional() }).optional()).query(({ input }) => getEvidenceReviewQueue(input)),
      enqueue: adminProcedure.input(z.object({ externalId: z.string().trim().min(1).max(191), priority: z.enum(REVIEW_PRIORITIES), requestedReason: z.string().trim().min(3).max(2_000) })).mutation(({ ctx, input }) => enqueueEvidenceReview(input.externalId, input.priority, input.requestedReason, ctx.user.id)),
      decide: adminProcedure.input(z.object({ reviewId: z.number().int().positive(), decision: z.enum(REVIEW_DECISIONS), decisionNote: z.string().trim().min(3).max(2_000) })).mutation(({ ctx, input }) => decideEvidenceReview(input.reviewId, input.decision, input.decisionNote, ctx.user.id)),
    }),
    ingestion: router({
      preview: adminProcedure.input(z.object({
        batchKey: z.string().trim().min(3).max(191),
        candidates: z.array(z.object({
          externalId: z.string().trim().min(1).max(191),
          cnjNumber: z.string().trim().max(80).optional(),
          tribunal: z.string().trim().min(1).max(64),
          justice: z.string().trim().min(1).max(64),
          decisionType: z.string().trim().min(1).max(64),
          sourceUrl: z.string().trim().url().max(1024).optional(),
          sourceStatus: sourceStatusSchema,
          metadata: z.object({}).catchall(z.unknown()).optional(),
        })).min(1).max(200),
      })).mutation(({ input }) => previewControlledIngestion(input.batchKey, input.candidates)),
    }),
  }),
});

export type AppRouter = typeof appRouter;
