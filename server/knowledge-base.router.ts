import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { auditKnowledgeBase, knowledgeBaseStats, knowledgeDocumentDetail, previewKnowledgeIngestion, searchKnowledgeBase } from "./knowledge-base";

const documentType = z.enum(["peca", "contrato", "checklist", "fluxo", "tabela_documentos", "triagem", "prazo", "doutrina", "regra_inteligencia", "regras_contratuais", "argumentacao", "jurimetria"]);
const sourceStatus = z.enum(["official_confirmed", "attachment_reviewed", "editorial_review", "secondary_pending", "not_for_use"]);
const kind = z.enum(["knowledge_document", "legislation"]);

export const knowledgeBaseRouter = router({
  stats: publicProcedure.query(() => knowledgeBaseStats()),
  search: publicProcedure
    .input(
      z.object({
        query: z.string().trim().max(300).optional(),
        documentType: documentType.optional(),
        area: z.string().trim().max(64).optional(),
        kind: kind.optional(),
        page: z.number().int().min(0).max(1000).optional(),
        pageSize: z.number().int().min(1).max(50).optional(),
      }),
    )
    .query(({ input }) => searchKnowledgeBase(input)),
  detail: publicProcedure.input(z.object({ kind, slug: z.string().trim().min(1).max(191) })).query(({ input }) => knowledgeDocumentDetail(input.kind, input.slug)),
  admin: router({
    audit: adminProcedure.mutation(({ ctx }) => auditKnowledgeBase(ctx.user.userId)),
    ingestionPreview: adminProcedure
      .input(
        z.object({
          batchKey: z.string().trim().min(3).max(191),
          candidates: z
            .array(
              z.object({
                slug: z.string().trim().min(1).max(191),
                documentType,
                area: z.string().trim().min(1).max(64),
                sourceStatus,
                officialUrl: z.string().url().max(1024).optional(),
                metadata: z.record(z.string(), z.unknown()).optional(),
              }),
            )
            .min(1)
            .max(200),
        }),
      )
      .mutation(({ input }) => previewKnowledgeIngestion(input.batchKey, input.candidates)),
  }),
});
