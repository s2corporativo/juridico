// seed-templates.ts — Popula APENAS templates (conteúdo operacional do gerador).
// Diferente do seed.ts deprecated: não cria usuários fictícios, skills fake, nem news.
// Idempotente (upsert por slug). Seguro para rodar em qualquer ambiente.
//
// Uso: DATABASE_URL=file:... bun run scripts/seed-templates.ts
import { db } from "../src/lib/db";

const templates = [
  {
    slug: "peticao-inicial-civil",
    name: "Petição Inicial (Cível)",
    category: "peticao",
    description: "Petição inicial para processo cível — Ação Indenizatória, Cobrança, Execução etc.",
    icon: "FileText",
    prompt: `Você é um advogado brasileiro sênior redigindo uma petição inicial cível. Siga rigorosamente o Código de Processo Civil (Lei 13.105/2015). A petição deve conter: endereçamento ao juízo competente, qualificação das partes, fatos, fundamentos jurídicos, pedidos com seus requisitos (art. 319 do CPC), valor da causa e requerimentos finais. Use linguagem jurídica formal em português brasileiro.`,
    fields: JSON.stringify([
      { key: "tipoAcao", label: "Tipo de ação", type: "select", options: ["Indenização por danos morais", "Cobrança", "Execução de título extrajudicial", "Reintegração de posse", "Obrigação de fazer"] },
      { key: "competencia", label: "Juízo/Vara", type: "text", placeholder: "Ex: 1ª Vara Cível da Comarca de..." },
      { key: "autor", label: "Nome do autor (será anonimizado)", type: "text" },
      { key: "reu", label: "Nome do réu (será anonimizado)", type: "text" },
      { key: "fatos", label: "Fatos e fundamentos", type: "textarea", placeholder: "Descreva os fatos..." },
      { key: "pedidos", label: "Pedidos (linhas principais)", type: "textarea" },
      { key: "valorCausa", label: "Valor da causa (será anonimizado)", type: "text" },
    ]),
  },
  {
    slug: "sentenca",
    name: "Sentença",
    category: "sentenca",
    description: "Minuta de sentença — dispositivo, fundamentação e parte dispositiva.",
    icon: "Gavel",
    prompt: `Você é um juiz brasileiro proferindo sentença. Siga o CPC (arts. 489 e 492). Estrutura: relatório, fundamentação (com análise de fatos e direito) e dispositivo. Indique se é procedente/improcedente/parcial. Use marcadores para dados sensíveis se necessário.`,
    fields: JSON.stringify([
      { key: "classe", label: "Classe processual", type: "text", placeholder: "Procedimento Comum Cível" },
      { key: "numeroProcesso", label: "Número do processo (anonimizado)", type: "text" },
      { key: "autor", label: "Nome do autor", type: "text" },
      { key: "reu", label: "Nome do réu", type: "text" },
      { key: "resumoFatos", label: "Resumo dos fatos", type: "textarea" },
      { key: "teses", label: "Teses das partes", type: "textarea" },
      { key: "decisao", label: "Direção do julgamento", type: "select", options: ["Procedente", "Improcedente", "Parcialmente procedente"] },
    ]),
  },
  {
    slug: "recurso-apelacao",
    name: "Apelação",
    category: "recurso",
    description: "Razões de apelação cível com petições de interposição e razões.",
    icon: "Scale",
    prompt: `Você é um advogado recorrendo de sentença cível via apelação (CPC arts. 1.009 e seguintes). Estrutura: petição de interposição ao juízo a quo e razões dirigidas ao tribunal. Use fundamentação com teses de fato e direito.`,
    fields: JSON.stringify([
      { key: "numeroProcesso", label: "Número do processo", type: "text" },
      { key: "apelante", label: "Apelante", type: "text" },
      { key: "apelado", label: "Apelado", type: "text" },
      { key: "sentencaRecorrida", label: "Síntese da sentença recorrida", type: "textarea" },
      { key: "fundamentos", label: "Fundamentos do recurso", type: "textarea" },
      { key: "pedidos", label: "Pedidos", type: "textarea" },
    ]),
  },
  {
    slug: "contrato-prestacao-servicos",
    name: "Contrato de Prestação de Serviços",
    category: "contrato",
    description: "Contrato civil de prestação de serviços com cláusulas essenciais.",
    icon: "FileSignature",
    prompt: `Redija um contrato de prestação de serviços conforme o Código Civil brasileiro (arts. 593 a 609). Inclua: qualificação das partes, objeto, remuneração, prazo, obrigações das partes, rescisão, foro e assinaturas. Use linguagem contratual formal.`,
    fields: JSON.stringify([
      { key: "contratante", label: "Contratante", type: "text" },
      { key: "contratado", label: "Contratado", type: "text" },
      { key: "objeto", label: "Objeto do contrato", type: "textarea" },
      { key: "remuneracao", label: "Remuneração (anonimizado)", type: "text" },
      { key: "prazo", label: "Prazo/vigência", type: "text" },
      { key: "clausulasEspeciais", label: "Cláusulas especiais", type: "textarea" },
    ]),
  },
  {
    slug: "parecer-juridico",
    name: "Parecer Jurídico",
    category: "parecer",
    description: "Parecer consultivo com ementa, consultas, análise e conclusão.",
    icon: "Lightbulb",
    prompt: `Redija um parecer jurídico consultivo: ementa, relação da consulta, exposição dos fatos, análise jurídica (doutrina e legislação), conclusão e ressalvas de responsabilidade. Formal, objetivo e tecnicamente preciso.`,
    fields: JSON.stringify([
      { key: "assunto", label: "Assunto/ementa", type: "text" },
      { key: "quemConsulta", label: "Quem consulta", type: "text" },
      { key: "fatos", label: "Relação dos fatos", type: "textarea" },
      { key: "questoes", label: "Questões a responder", type: "textarea" },
      { key: "normasAplicaveis", label: "Normas aplicáveis (se conhecidas)", type: "textarea" },
    ]),
  },
  {
    slug: "contestacao",
    name: "Contestação",
    category: "defesa",
    description: "Contestação cível com preliminares, mérito e pedidos (CPC art. 335 e ss.).",
    icon: "ShieldAlert",
    prompt: `Redija uma contestação cível conforme o CPC (arts. 335 e seguintes): preliminares processuais (art. 337), impugnação específica dos fatos, mérito (prescrição/decadência se cabível), provas que pretende produzir e pedidos. Tom técnico-defensivo.`,
    fields: JSON.stringify([
      { key: "numeroProcesso", label: "Número do processo", type: "text" },
      { key: "reu", label: "Réu (quem contesta)", type: "text" },
      { key: "autor", label: "Autor", type: "text" },
      { key: "resumoPedidoAutor", label: "Resumo do pedido do autor", type: "textarea" },
      { key: "defesas", label: "Defesas de fato e de direito", type: "textarea" },
      { key: "preliminares", label: "Preliminares (se houver)", type: "textarea" },
    ]),
  },
  {
    slug: "peticao-inicial-trabalhista",
    name: "Petição Inicial (Trabalhista)",
    category: "peticao",
    description: "Reclamação trabalhista na Justiça do Trabalho (CLT).",
    icon: "HardHat",
    prompt: `Redija uma reclamação trabalhista conforme a CLT: endereçamento à vara do trabalho, qualificação, contrato de trabalho, verbas rescisórias e pedidos (horas extras, FGTS, multas etc.), valor da causa. Fundamente nos artigos da CLT aplicáveis.`,
    fields: JSON.stringify([
      { key: "reclamante", label: "Reclamante", type: "text" },
      { key: "reclamada", label: "Reclamada", type: "text" },
      { key: "cargo", label: "Cargo/função", type: "text" },
      { key: "periodoTrabalho", label: "Período do contrato", type: "text" },
      { key: "verbas", label: "Verbas pleiteadas", type: "textarea" },
      { key: "rescisao", label: "Forma de rescisão", type: "select", options: ["Sem justa causa", "Justa causa", "Pedido de demissão", "Rescisão indireta", "Acordo"] },
    ]),
  },
  {
    slug: "queixa-crime",
    name: "Queixa-Crime",
    category: "criminal",
    description: "Queixa-crime subsidiária ou oferecida por advogado (CPP).",
    icon: "Stamp",
    prompt: `Redija uma queixa-crime conforme o CPP (arts. 41 e seguintes): endereçamento, qualificação do querelante e querelado, exposição dos fatos com tipificação penal, pedidos (recebimento, citação, provas), rol de testemunhas. Rigor técnico penal.`,
    fields: JSON.stringify([
      { key: "querelante", label: "Querelante", type: "text" },
      { key: "querelado", label: "Querelado", type: "text" },
      { key: "delito", label: "Delito narrado", type: "text" },
      { key: "fatos", label: "Fatos criminosos", type: "textarea" },
      { key: "provas", label: "Provas existentes", type: "textarea" },
      { key: "testemunhas", label: "Rol de testemunhas", type: "textarea" },
    ]),
  },
  {
    slug: "procuracao-ad-judicia",
    name: "Procuração ad judicia",
    category: "carta",
    description: "Instrumento de mandato ad judicia et extra com poderes gerais e especiais.",
    icon: "Mail",
    prompt: `Redija uma procuração ad judicia et extra (CPC art. 105): outorgante, outorgado com OAB, poderes gerais do foro e poderes especiais (transigir, firmar acordo, receber quitação, substabelecer etc.). Modelo enxuto e completo.`,
    fields: JSON.stringify([
      { key: "outorgante", label: "Outorgante", type: "text" },
      { key: "nacionalidade", label: "Nacionalidade/estado civil", type: "text" },
      { key: "outorgado", label: "Outorgado (advogado)", type: "text" },
      { key: "oab", label: "OAB", type: "text" },
      { key: "poderesEspeciais", label: "Poderes especiais", type: "textarea" },
    ]),
  },
  {
    slug: "defesa-administrativo",
    name: "Defesa Administrativa",
    category: "defesa",
    description: "Defesa em processo administrativo (multas, autos de infração).",
    icon: "Landmark",
    prompt: `Redija defesa administrativa contra auto de infração: identificação do autuado, tempestividade, exposição dos motivos (merito e forma), nulidades, pedidos de cancelamento/redução. Fundamente em lei específica e princípios administrativos.`,
    fields: JSON.stringify([
      { key: "autuado", label: "Autuado", type: "text" },
      { key: "orgaoAutuador", label: "Órgão autuador", type: "text" },
      { key: "numeroAuto", label: "Número do auto de infração", type: "text" },
      { key: "infracaoImputada", label: "Infração imputada", type: "textarea" },
      { key: "defesas", label: "Defesas e motivos", type: "textarea" },
    ]),
  },
];

async function main() {
  console.log(`Populando ${templates.length} templates (upsert idempotente)...`);
  for (const t of templates) {
    await db.template.upsert({ where: { slug: t.slug }, update: t, create: t });
    console.log("  ✓ template:", t.slug);
  }
  const total = await db.template.count();
  console.log(`OK — ${total} templates no banco.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
