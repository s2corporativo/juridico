// agent_tools.ts — ferramentas controladas do agente EJC.
// Tools são somente leitura nesta primeira fase; escrita jurídica exige fluxo/homologação específico.

import { governedWebSearch } from "@/lib/ai_gateway";
import { registerTool, type AgentContext, type ToolResult } from "@/lib/agent_loop";
import { listEvidence } from "@/lib/evidence";
import { legalSearch } from "@/lib/legal_retrieval";
import { buildResearchPlan } from "@/lib/research_coverage";
import { routeSkills } from "@/lib/skill_router";

let registered = false;

export function registerDefaultAgentTools(): void {
  if (registered) return;
  registered = true;

  registerTool({
    name: "legal_search",
    category: "leitura",
    description: "Busca híbrida na base jurídica curada. Args: {query:string, topK?:number}",
    async execute(args): Promise<ToolResult> {
      const query = String(args.query || "").trim();
      if (!query) return { success: false, output: {}, error: "query obrigatória" };
      const results = await legalSearch(query, Math.max(1, Math.min(Number(args.topK) || 8, 15)));
      return {
        success: true,
        output: {
          results: results.map((r) => ({
            sourceId: r.source.id,
            tipo: r.source.tipo,
            diploma: r.source.diploma,
            numero: r.source.numero,
            tribunal: r.source.tribunal,
            trecho: r.source.textoTrecho.slice(0, 500),
            urlOficial: r.source.urlOficial,
            vigente: r.source.vigente,
            score: r.score,
            signals: r.signals,
          })),
        },
      };
    },
  });

  registerTool({
    name: "web_search",
    category: "leitura",
    description: "Pesquisa externa governada. Em matéria LOCAL_COMPLETO, falha fechado. Args: {query:string,num?:number}",
    async execute(args, ctx: AgentContext): Promise<ToolResult> {
      const query = String(args.query || "").trim();
      if (!query) return { success: false, output: {}, error: "query obrigatória" };
      try {
        const results = await governedWebSearch(query, ctx.taskType, Math.max(1, Math.min(Number(args.num) || 6, 10)));
        return {
          success: true,
          output: {
            results: results.map((r) => ({
              name: r.name,
              url: r.url,
              host: r.host_name,
              snippet: r.snippet.slice(0, 500),
              verified: false,
            })),
          },
        };
      } catch (e) {
        return { success: false, output: {}, error: e instanceof Error ? e.message : "web_search bloqueada" };
      }
    },
  });

  registerTool({
    name: "skill_router",
    category: "motores",
    description: "Identifica skills jurídicas aprovadas e questões do caso. Args: {facts:string}",
    async execute(args): Promise<ToolResult> {
      const facts = String(args.facts || "").trim();
      if (!facts) return { success: false, output: {}, error: "facts obrigatório" };
      const routed = await routeSkills(facts);
      return {
        success: true,
        output: {
          area: routed.area,
          issues: routed.issues,
          skills: routed.matches.slice(0, 8).map((m) => ({
            slug: m.slug,
            name: m.name,
            area: m.area,
            score: m.matchScore,
            version: m.version,
          })),
        },
      };
    },
  });

  registerTool({
    name: "evidence_list",
    category: "leitura",
    description: "Lista evidências já registradas no caso. Args: {}",
    async execute(_args, ctx: AgentContext): Promise<ToolResult> {
      const evidence = await listEvidence(ctx.caseId);
      return {
        success: true,
        output: {
          evidence: evidence.slice(0, 50).map((e) => ({
            evidenceRefId: e.id,
            pageNumber: e.pageNumber,
            quote: e.quote.slice(0, 600),
            quoteHash: e.quoteHash,
            verified: e.verified,
            sourceKind: e.sourceKind,
          })),
        },
      };
    },
  });

  registerTool({
    name: "research_plan",
    category: "motores",
    description: "Cria plano de pesquisa obrigatório com fonte primária, vigência, favorável, contrário e aderência. Args: {issue:string,area:string}",
    async execute(args): Promise<ToolResult> {
      const issue = String(args.issue || "").trim();
      const area = String(args.area || "civil").trim();
      if (!issue) return { success: false, output: {}, error: "issue obrigatório" };
      return { success: true, output: buildResearchPlan(issue, area) as unknown as Record<string, unknown> };
    },
  });
}
