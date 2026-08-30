// EJC — helper base para o lote P0 estrutural
export const FONTE_PADRAO = "Elaboração EJC — conteúdo estrutural original";

export function baseDoc(d) {
  return {
    slug: d.slug,
    titulo: d.titulo,
    tipoDocumento: d.tipoDocumento,
    area: d.area,
    subarea: d.subarea ?? "",
    assunto: d.assunto ?? "",
    subassunto: d.subassunto ?? "",
    prioridade: d.prioridade ?? "P0",
    conteudo: d.conteudo,
    metadados: d.metadados ?? {},
    tags: d.tags ?? [],
    fonte: FONTE_PADRAO,
    urlFonte: null,
    dataConsulta: null,
    confiabilidade: d.confiabilidade ?? "B",
    vigente: true,
    status: d.status ?? "ATIVO",
    dataUltimaVerificacao: d.dataUltimaVerificacao ?? "2026-08-29"
  };
}
