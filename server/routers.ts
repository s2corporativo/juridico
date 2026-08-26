import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getCompendiumOverview, getNationalCensusOverview, getNationalCensusReadiness, getPublicDataSources, searchCompendium } from "./db";
import { previewControlledIngestion } from "./compendium.ingestion";
import { checkDataJudCoverage, DATAJUD_ALIASES, getDataJudConnectionStatus, lookupDataJudByProcess, NATIONAL_DATAJUD_ALIASES } from "./datajud";
import { fetchStjJurisprudenceCatalog } from "./public-sources";
import { getEjcIntegrationStatus } from "@shared/ejc-integration";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";

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
  datajud: router({
    status: publicProcedure.query(() => getDataJudConnectionStatus()),
    lookup: adminProcedure.input(z.object({ tribunalAlias: z.enum(DATAJUD_ALIASES), processNumber: z.string().trim().min(1).max(80) })).mutation(({ input }) => lookupDataJudByProcess(input.tribunalAlias, input.processNumber)),
    coverage: adminProcedure.input(z.object({ aliases: z.array(z.enum(NATIONAL_DATAJUD_ALIASES)).min(1).max(NATIONAL_DATAJUD_ALIASES.length).optional() })).mutation(({ input }) => checkDataJudCoverage(input.aliases)),
  }),
  integration: router({
    ejcStatus: publicProcedure.query(() => getEjcIntegrationStatus()),
  }),
  nationalCensus: router({
    readiness: publicProcedure.query(() => getNationalCensusReadiness()),
    overview: publicProcedure.input(z.object({ from: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/).optional(), to: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/).optional(), tribunalAlias: z.string().trim().max(64).optional() }).optional()).query(({ input }) => getNationalCensusOverview(input)),
  }),
  compendium: router({
    overview: publicProcedure.query(() => getCompendiumOverview()),
    search: publicProcedure.input(z.object({
      query: z.string().trim().max(160).optional(),
      tribunal: z.string().trim().max(64).optional(),
      city: z.string().trim().max(128).optional(),
      legalArea: z.string().trim().max(255).optional(),
      sourceStatus: sourceStatusSchema.optional(),
      page: z.number().int().min(0).max(10_000).optional(),
      pageSize: z.number().int().min(1).max(50).optional(),
    })).query(({ input }) => searchCompendium(input)),
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
