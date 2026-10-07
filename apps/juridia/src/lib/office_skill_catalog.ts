// office_skill_catalog.ts — catálogo operacional massivo de skills jurídicas do escritório.
// São skills de ORQUESTRAÇÃO/QUALIDADE: orientam o que investigar, provar, pesquisar,
// redigir e revisar. Não substituem fonte jurídica; toda regra substantiva exige fonte
// oficial/vigente e passa pelo Citation Gate.

export interface OfficeSkillDefinition {
  slug: string;
  area: string;
  description: string;
  content: string;
  triggers: string[];
  requiredSources: string[];
  requiredEvidence: string[];
  rules: string[];
  exceptions: string[];
  forbiddenClaims: string[];
  allowedTools: string[];
  outputSchema: Record<string, unknown>;
}

const AREAS: Record<string, string[]> = {
  civil: ["responsabilidade civil","inadimplemento","prescrição e decadência","obrigações","danos materiais","danos morais","posse e propriedade","enriquecimento sem causa","tutela específica","cumprimento de obrigação"],
  processo_civil: ["competência","condições da ação","legitimidade","tutela provisória","provas","ônus da prova","sentença","recursos","cumprimento de sentença","execução"],
  consumidor: ["vício do produto","fato do produto","serviço defeituoso","cobrança indevida","negativação","práticas abusivas","cláusula abusiva","inversão do ônus","oferta e publicidade","responsabilidade do fornecedor"],
  bancario: ["fraude bancária","empréstimo consignado","cartão de crédito","tarifas bancárias","superendividamento","juros remuneratórios","capitalização","portabilidade","conta bancária","meios de pagamento"],
  empresarial: ["título de crédito","recuperação de crédito","contrato empresarial","responsabilidade empresarial","concorrência","estabelecimento","representação comercial","distribuição","franquia","insolvência empresarial"],
  societario: ["constituição societária","alteração contratual","administração","responsabilidade de sócio","retirada de sócio","exclusão de sócio","apuração de haveres","acordo de sócios","dissolução","governança"],
  contratos: ["formação do contrato","interpretação","boa-fé objetiva","inadimplemento","resolução","resilição","revisão contratual","cláusula penal","garantias","responsabilidade contratual"],
  imobiliario: ["compra e venda","locação","condomínio","usucapião","posse","incorporação","loteamento","registro imobiliário","vícios construtivos","distrato imobiliário"],
  familia: ["divórcio","guarda","alimentos","convivência","união estável","partilha","filiação","adoção","violência patrimonial","cumprimento de alimentos"],
  sucessoes: ["inventário","partilha","testamento","herdeiros","meação","colação","sonegados","renúncia","cessão hereditária","planejamento sucessório"],
  trabalhista: ["vínculo de emprego","jornada","horas extras","verbas rescisórias","adicional de insalubridade","adicional de periculosidade","acidente do trabalho","assédio","estabilidade","terceirização"],
  processo_trabalho: ["competência trabalhista","petição inicial","contestação","prova trabalhista","audiência","liquidação","execução trabalhista","recurso ordinário","recurso de revista","acordo trabalhista"],
  previdenciario: ["aposentadoria","benefício por incapacidade","BPC","pensão por morte","tempo de contribuição","atividade especial","salário de benefício","revisão de benefício","qualidade de segurado","carência"],
  tributario: ["obrigação tributária","crédito tributário","decadência tributária","prescrição tributária","imunidade","isenção","execução fiscal","compensação","responsabilidade tributária","planejamento tributário"],
  administrativo: ["ato administrativo","processo administrativo","servidor público","sanção administrativa","responsabilidade do estado","poder de polícia","concurso público","improbidade","controle administrativo","contrato administrativo"],
  licitacoes: ["habilitação","proposta","impugnação de edital","recurso administrativo","contratação direta","dispensa","inexigibilidade","execução contratual","reequilíbrio econômico-financeiro","sanções em licitação"],
  ambiental: ["licenciamento ambiental","infração ambiental","responsabilidade civil ambiental","responsabilidade administrativa ambiental","APP","reserva legal","resíduos sólidos","recursos hídricos","fauna e flora","TAC ambiental"],
  penal: ["tipicidade","dolo e culpa","excludentes","concurso de pessoas","pena","prescrição penal","crimes patrimoniais","crimes contra pessoa","crimes econômicos","crimes ambientais"],
  processo_penal: ["inquérito","prisão cautelar","prova penal","nulidades","resposta à acusação","audiência criminal","sentença penal","apelação criminal","habeas corpus","execução penal"],
  digital_lgpd: ["base legal LGPD","direitos do titular","incidente de segurança","tratamento de dados","dados sensíveis","encarregado","operador e controlador","transferência internacional","prova digital","responsabilidade digital"],
};

const WORKFLOWS = [
  { key: "triagem", label: "Triagem jurídica", focus: "identificar enquadramento, requisitos, exceções e lacunas" },
  { key: "fatos_provas", label: "Fatos e provas", focus: "separar alegações, fatos suportados, controvérsias e provas faltantes" },
  { key: "legislacao", label: "Legislação aplicável", focus: "localizar fonte primária vigente e regras temporais aplicáveis" },
  { key: "juris_favoravel", label: "Jurisprudência favorável", focus: "buscar precedentes aderentes e fundamentos favoráveis sem cherry-picking" },
  { key: "juris_contraria", label: "Jurisprudência contrária", focus: "buscar precedentes adversos, riscos e distinguishing" },
  { key: "estrategia", label: "Estratégia", focus: "propor caminhos processuais condicionados às evidências e fontes" },
  { key: "roteiro", label: "Roteiro da peça", focus: "organizar seções, ordem argumentativa, pedidos e dependências probatórias" },
  { key: "redacao", label: "Redação jurídica", focus: "redigir apenas afirmações sustentadas por fatos/evidências e fontes verificáveis" },
  { key: "adversarial", label: "Revisão adversarial", focus: "atacar a própria tese, procurar contradições, preliminares e argumentos contrários" },
  { key: "auditoria", label: "Auditoria final", focus: "verificar citações, vigência, aderência, pedidos, coerência e ressalvas" },
];

const SOURCE_BY_AREA: Record<string, string[]> = {
  penal: ["Planalto/legislação vigente","STF","STJ","tribunal competente"],
  processo_penal: ["Planalto/CPP e legislação vigente","STF","STJ","tribunal competente"],
  trabalhista: ["Planalto/CLT e legislação vigente","TST","TRT competente"],
  processo_trabalho: ["Planalto/CLT e legislação vigente","TST","TRT competente"],
  tributario: ["Planalto/CTN e legislação vigente","STF","STJ","tribunal competente"],
  administrativo: ["Planalto/legislação vigente","STF","STJ","órgão/tribunal competente"],
  licitacoes: ["Planalto/Lei 14.133/2021 e legislação vigente","TCU quando pertinente","tribunal competente"],
  ambiental: ["Planalto/legislação ambiental vigente","CONAMA/órgão ambiental quando pertinente","STF/STJ","tribunal competente"],
  digital_lgpd: ["Planalto/LGPD e legislação vigente","ANPD quando pertinente","STJ/STF","tribunal competente"],
};

function slugify(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function sources(area: string): string[] {
  return SOURCE_BY_AREA[area] || ["Planalto/legislação vigente","STF/STJ quando pertinente","tribunal competente"];
}

function evidenceFor(workflow: string): string[] {
  if (workflow === "fatos_provas") return ["documentos do caso","trechos com página","cronologia","declarações identificadas como alegação"];
  if (workflow === "redacao" || workflow === "auditoria") return ["fatos suportados por evidence_ref_id","documento e página quando disponível"];
  return ["fatos relevantes do caso","evidence_ref_id quando a afirmação depender dos autos"];
}

export function buildOfficeSkillCatalog(): OfficeSkillDefinition[] {
  const out: OfficeSkillDefinition[] = [];
  for (const [area, topics] of Object.entries(AREAS)) {
    for (const topic of topics) {
      for (const workflow of WORKFLOWS) {
        const slug = `office-${area}-${slugify(topic)}-${workflow.key}`;
        const requiredSources = sources(area);
        const requiredEvidence = evidenceFor(workflow.key);
        const description = `${workflow.label}: ${topic} — ${area.replace(/_/g, " ")}`;
        const content = [
          `# ${description}`,
          "",
          `Objetivo: ${workflow.focus} no tema **${topic}**, área **${area.replace(/_/g, " ")}**.`,
          "",
          "Regras de execução:",
          "1. Não trate conhecimento do modelo como fonte jurídica.",
          "2. Localize a norma vigente em fonte oficial antes de afirmar regra substantiva.",
          "3. Quando houver jurisprudência relevante, procure posição favorável e contrária e teste aderência fática.",
          "4. Diferencie fato provado, alegação, inferência, regra jurídica, precedente, risco e lacuna.",
          "5. Vincule fatos relevantes a evidence_ref_id; quando disponível, preserve documento e página.",
          "6. Não invente número de processo, súmula, tema, artigo, data, valor ou trecho de decisão.",
          "7. Citação não verificada deve permanecer identificada como não verificada e passar pelo Citation Gate.",
          "8. Se a pesquisa estiver incompleta, informe EVIDÊNCIA JURÍDICA INSUFICIENTE PARA CONCLUSÃO SEGURA.",
          "9. Toda saída é rascunho sujeito a revisão humana.",
          "",
          "Fontes mínimas esperadas:",
          ...requiredSources.map((x) => `- ${x}`),
          "",
          "Evidências mínimas esperadas:",
          ...requiredEvidence.map((x) => `- ${x}`),
        ].join("\n");

        out.push({
          slug,
          area,
          description,
          content,
          triggers: [topic, area.replace(/_/g, " "), workflow.label.toLowerCase()],
          requiredSources,
          requiredEvidence,
          rules: [
            "fonte oficial e vigente",
            "pesquisa bilateral de jurisprudência",
            "aderência fática",
            "rastreabilidade por evidência",
            "revisão humana obrigatória",
          ],
          exceptions: ["se a fonte oficial estiver indisponível, marcar a pesquisa como incompleta"],
          forbiddenClaims: [
            "promessa de resultado",
            "jurisprudência inventada",
            "lei ou artigo não verificado",
            "fato sem suporte apresentado como provado",
          ],
          allowedTools: ["legal_search","iterative_research","evidence_list","research_plan"],
          outputSchema: {
            type: "object",
            required: ["findings","sources","risks"],
            properties: {
              findings: { type: "array" },
              sources: { type: "array" },
              risks: { type: "array" },
            },
          },
        });
      }
    }
  }
  if (out.length !== 2000) throw new Error(`Catálogo inválido: esperado 2000, obtido ${out.length}`);
  return out;
}
